// File Path: frontend/src/pages/Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setLoading } from '../redux/authSlice';
import { AUTH_API_END_POINT } from '../utils/constant';
import { toast } from 'sonner';

const Signup = () => {
    const [input, setInput] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "student"
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.auth);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            
            const res = await axios.post(`${AUTH_API_END_POINT}/register`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message || "Account created successfully!");
                navigate("/login");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="flex items-center justify-center max-w-7xl mx-auto px-4 min-h-[calc(100vh-4rem)]">
            <form onSubmit={submitHandler} className="w-full sm:w-1/2 md:w-1/3 border border-gray-200 rounded-xl p-8 my-10 bg-white shadow-sm">
                <h1 className="font-bold text-2xl mb-6 text-gray-900 tracking-tight">
                    Create <span className="text-blue-600">Account</span>
                </h1>

                <div className="flex flex-col my-3">
                    <label className="text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        value={input.fullName}
                        name="fullName"
                        onChange={changeEventHandler}
                        placeholder="John Doe"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                        required
                    />
                </div>

                <div className="flex flex-col my-3">
                    <label className="text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        value={input.email}
                        name="email"
                        onChange={changeEventHandler}
                        placeholder="johndoe@example.com"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                        required
                    />
                </div>

                <div className="flex flex-col my-3">
                    <label className="text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        value={input.phoneNumber}
                        name="phoneNumber"
                        onChange={changeEventHandler}
                        placeholder="1234567890"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                        required
                    />
                </div>

                <div className="flex flex-col my-3">
                    <label className="text-sm font-semibold text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        value={input.password}
                        name="password"
                        onChange={changeEventHandler}
                        placeholder="••••••••"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                        required
                    />
                </div>

                <div className="flex items-center justify-between my-5">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="role"
                            value="student"
                            checked={input.role === 'student'}
                            onChange={changeEventHandler}
                            id="r-student"
                            className="cursor-pointer h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="r-student" className="text-sm font-medium text-gray-700 cursor-pointer">Student</label>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="role"
                            value="recruiter"
                            checked={input.role === 'recruiter'}
                            onChange={changeEventHandler}
                            id="r-recruiter"
                            className="cursor-pointer h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="r-recruiter" className="text-sm font-medium text-gray-700 cursor-pointer">Recruiter</label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full my-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-all text-sm disabled:bg-blue-400"
                >
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>

                <p className="text-xs text-center text-gray-600 mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                        Login here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;