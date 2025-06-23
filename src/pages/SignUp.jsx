import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { routeURL } from "../getData/ConstantVal"

function SignUp() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("user")
    const navigate = useNavigate();

    const registerUser = (e) => {
        e.preventDefault();
        console.log(name, email, password, role);

        axios.post("http://localhost:5000/signup",{ username: name, email, password, role })
            .then((response) => {
                console.log("Response : ", response.data);
                navigate("/login");
            }).catch((error) => {
                console.error("There was an error registering the user!", error);
            });
    }

    return (
        <section id='signup'>
            <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
                <form onSubmit={registerUser}>
                    <h1 className='text-sky-950 mb-4'>Register User</h1>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            type='text' placeholder='Enter Your name'
                            value={name} onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            E-mail
                        </label>
                        <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            type='email' placeholder='Enter Your Email'
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            type='password' placeholder='Enter Your Password'
                            value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                        Role :
                        <select className='text-gray-700 leading-tight font-medium text-center focus:outline-none focus:shadow-outline' onChange={(e) => setRole(e.target.value)}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="developer">Developer</option>
                            <option value="tester">Tester</option>
                        </select>
                    </label>

                    <button className='shadow bg-red-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded'>Sign Up</button>
                </form>
                <br />
                <p className='text-black'>Do you have an account?
                    <Link to="/login" className="text-blue-500 hover:underline"> login</Link>
                </p>
            </div>
        </section>
    )
}

export default SignUp;