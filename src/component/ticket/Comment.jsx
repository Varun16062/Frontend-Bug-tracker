import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSpinner, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { NewComment } from '../../getData/TicketData';
import { getCommentHistory } from '../../getData/TicketData';
import ShowComments from './ShowComments';

function Comment() {
    const { ticketId: paramTicketId } = useParams();
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [commentError, setCommentError] = useState(null);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const user = localStorage.getItem('User');
    const userId = user ? JSON.parse(user)._id : null;
    const userName = user ? JSON.parse(user).name : 'Guest';

    const ticketIdentifier = paramTicketId;

    const fetchComments = useCallback(async () => {
        if (!ticketIdentifier) {
            setCommentError('No ticket ID provided to fetch comments.');
            return;
        }
        setIsLoadingComments(true);
        setCommentError(null);
        try {
            const fetchedComments = await getCommentHistory(ticketIdentifier);
            setComments(fetchedComments || []);
        } catch (err) {
            console.error('Error fetching comments:', err);
            setCommentError(err.message || 'Failed to load comments.');
            toast.error(err.message || 'Failed to load comments!');
        } finally {
            setIsLoadingComments(false);
        }
    }, [ticketIdentifier]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        toast.dismiss();

        if (!commentText.trim()) {
            toast.error('Comment cannot be empty.');
            return;
        }
        if (!userId) {
            toast.error('You must be logged in to post a comment.');
            return;
        }
        if (!ticketIdentifier) {
            toast.error('Cannot post comment: Missing ticket ID.');
            return;
        }

        setIsSubmittingComment(true);
        try {
            const newCommentData = {
                text: commentText.trim(),
                userId,
                userName,
                ticketId: ticketIdentifier,
                createdAt: new Date().toISOString(),
            };

            await NewComment(newCommentData);
            toast.success('Comment added successfully!');
            setCommentText('');

            fetchComments();
        } catch (error) {
            console.error('Error submitting comment:', error);
            toast.error(error.message || 'Failed to post comment.');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                <FontAwesomeIcon icon={faCommentDots} className="mr-2 text-blue-500" />Comments
            </h3>

            <form onSubmit={handleCommentSubmit} className="flex flex-col sm:flex-row items-end sm:items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg shadow-inner">
                <div className="flex-1 w-full">
                    <label htmlFor="comment-input" className="sr-only">Add a comment</label>
                    <textarea
                        id="comment-input"
                        name="comment"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder={userId ? "Add a comment..." : "Login to add a comment..."}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[60px]"
                        rows="2"
                        disabled={!userId || isSubmittingComment}
                    />
                </div>
                <button
                    type="submit"
                    className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    disabled={!userId || isSubmittingComment || !commentText.trim()}
                >
                    {isSubmittingComment ? (
                        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                    ) : (
                        <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                    )}
                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                </button>
            </form>

            {isLoadingComments ? (
                <div className="text-center text-gray-500 py-6">
                    <FontAwesomeIcon icon={faSpinner} spin size="lg" className="mr-2" /> Loading comments...
                </div>
            ) : commentError ? (
                <div className="text-center text-red-500 py-6">
                    <p className="font-semibold mb-2">Error loading comments:</p>
                    <p>{commentError}</p>
                    <button
                        onClick={fetchComments}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Retry
                    </button>
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center text-gray-500 py-6">
                    No comments yet. Be the first to comment!
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map(comment => (
                        <ShowComments key={comment._id} comment={comment} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Comment;