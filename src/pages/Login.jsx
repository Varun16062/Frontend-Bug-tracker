import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import { routeURL } from "../getData/ConstantVal"



function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("User")) {
            navigate("/");
        }
    }, [navigate]);


    const handleLogin = async (e) => {
        e.preventDefault();

        axios.post(`${routeURL}/login`, { email, password })
            .then((response) => {
                console.log("Response : ", response.data);
                if (response.data.user) {
                    localStorage.setItem("User", JSON.stringify(response.data.user));
                    localStorage.setItem("token", JSON.stringify(response.data.token));
                    toast.done("You are logged in successfully")
                    navigate("/");
                }
            }).catch((error) => {
                console.error("There was an error logging in!", error);
                toast.error("Invalid credentials, please try again.");
            });
    }


    return (
        <section id='login'>
          
            <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
                <form onSubmit={handleLogin} className=''>
                    <h1 className='text-sky-950 mb-4'>User Login</h1>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            E-mail
                        </label>
                        <input
                            type='email'
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            placeholder='Enter Email'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type='password'
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            placeholder='Enter Password'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>

                    <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                        Login
                    </button>
                </form>
                <br />
                <p className='text-black'>Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline"> Sign Up</Link>
                </p>
            </div>
        </section>
    )
}

export default Login;