// File Path: frontend/src/pages/admin/PostJob.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { JOB_API_END_POINT } from '../../utils/constant';
import useGetAllCompanies from '../../hooks/useGetAllCompanies';
import { toast } from 'sonner';

const PostJob = () => {
    // Invoke the hook to ensure our available companies list is populated in Redux memory
    useGetAllCompanies();

    const navigate = useNavigate();
    const { companies } = useSelector(state => state.company);
    const [loading, setLoading] = useState(false);

    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "Full-time",
        experience: "",
        position: "",
        companyId: "",
        // --- UPDATED: Split timing into Start and End for the selectors ---
        startTime: "", 
        endTime: "",
        workingDays: "Mon - Fri",
        transportation: "Not Available",
        workMode: "Work From Office",
        laptopRequired: "No"
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (e) => {
        setInput({ ...input, companyId: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.companyId) {
            toast.error("Please select or register an active company framework first before publishing.");
            return;
        }

        try {
            setLoading(true);
            
            // Format numbers and combine the time strings for the backend
            const payload = {
                ...input,
                salary: Number(input.salary),
                position: Number(input.position),
                experienceLevel: Number(input.experience),
                // Combine the two time inputs into a single string for your database
                timing: `${input.startTime} to ${input.endTime}` 
            };

            const res = await axios.post(`${JOB_API_END_POINT}/post`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message || "Job listing published seamlessly!");
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create active opening profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 my-10">
            <form onSubmit={submitHandler} className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
                <div className="border-b border-gray-100 pb-4 mb-6">
                    <h1 className="font-extrabold text-2xl text-gray-950 tracking-tight">Publish Opportunity</h1>
                    <p className="text-sm text-gray-500 mt-1">Provide clear metric filters and descriptions to attract targeted candidates.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Job Title */}
                    <div className="flex flex-col my-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1">Job Title</label>
                        <input
                            type="text"
                            name="title"
                            value={input.title}
                            onChange={changeEventHandler}
                            placeholder="e.g. Frontend Developer"
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Job Location */}
                    <div className="flex flex-col my-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1">Job Location</label>
                        <input
                            type="text"
                            name="location"
                            value={input.location}
                            onChange={changeEventHandler}
                            placeholder="e.g. Ahmedabad, Remote"
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Salary Package */}
                    <div className="flex flex-col my-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1">Salary Package (INR per Annum)</label>
                        <input
                            type="number"
                            name="salary"
                            value={input.salary}
                            onChange={changeEventHandler}
                            placeholder="e.g. 600000"
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Experience Level */}
                    <div className="flex flex-col my-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1">Minimum Experience (Years)</label>
                        <input
                            type="number"
                            name="experience"
                            value={input.experience}
                            onChange={changeEventHandler}
                            placeholder="e.g. 2"
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Openings Count */}
                    <div className="flex flex-col my-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1">Number of Openings</label>
                        <input
                            type="number"
                            name="position"
                            value={input.position}
                            onChange={changeEventHandler}
                            placeholder="e.g. 3"
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Job Type Dropdown */}
                    <div className="flex flex-col my-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1">Job Type</label>
                        <select
                            name="jobType"
                            value={input.jobType}
                            onChange={changeEventHandler}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Remote">Remote</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>

                    {/* --- UPDATED: Job Timing (Time Selectors) --- */}
                    <div className="flex flex-col my-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1">Job Timing</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="time"
                                name="startTime"
                                value={input.startTime}
                                onChange={changeEventHandler}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all w-full bg-white text-gray-700"
                                required
                            />
                            <span className="text-sm font-medium text-gray-500">to</span>
                            <input
                                type="time"
                                name="endTime"
                                value={input.endTime}
                                onChange={changeEventHandler}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all w-full bg-white text-gray-700"
                                required
                            />
                        </div>
                    </div>

                    {/* Working Days */}
                    <div className="flex flex-col my-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1">Working Days</label>
                        <select
                            name="workingDays"
                            value={input.workingDays}
                            onChange={changeEventHandler}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                        >
                            <option value="Mon - Fri">Mon - Fri</option>
                            <option value="Mon - Sat">Mon - Sat</option>
                        </select>
                    </div>

                    {/* Transportation Service */}
                    <div className="flex flex-col my-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1">Employee Transportation</label>
                        <select
                            name="transportation"
                            value={input.transportation}
                            onChange={changeEventHandler}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                        >
                            <option value="Not Available">Not Available</option>
                            <option value="Available">Available</option>
                        </select>
                    </div>

                    {/* Work Mode */}
                    <div className="flex flex-col my-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1">Work Mode</label>
                        <select
                            name="workMode"
                            value={input.workMode}
                            onChange={changeEventHandler}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                        >
                            <option value="Work From Office">Work From Office</option>
                            <option value="Work From Home">Work From Home</option>
                            <option value="Hybrid Work">Hybrid Work</option>
                        </select>
                    </div>

                    {/* Laptop Required */}
                    <div className="flex flex-col my-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1">Laptop Required</label>
                        <select
                            name="laptopRequired"
                            value={input.laptopRequired}
                            onChange={changeEventHandler}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                        >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                </div>

                {/* Company Link Selection Dropdown */}
                <div className="flex flex-col my-4">
                    <label className="text-sm font-semibold text-gray-700 mb-1">Link to Corporate Organization Profile</label>
                    <select
                        name="companyId"
                        value={input.companyId}
                        onChange={selectChangeHandler}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                        required
                    >
                        <option value="">-- Choose target corporate entity --</option>
                        {companies.map((company) => (
                            <option key={company._id} value={company._id}>
                                {company.name} ({company.location})
                            </option>
                        ))}
                    </select>
                    {companies.length === 0 && (
                        <p className="text-xs text-amber-600 font-semibold mt-1">
                            * No entities found. You must register a company identity entry before building active job cards.
                        </p>
                    )}
                </div>

                {/* Requirements / Key Skills */}
                <div className="flex flex-col my-4">
                    <label className="text-sm font-semibold text-gray-700 mb-1">Technical Skills / Requirements</label>
                    <input
                        type="text"
                        name="requirements"
                        value={input.requirements}
                        onChange={changeEventHandler}
                        placeholder="e.g. React, Node.js, MongoDB, Tailwind CSS (Comma separated)"
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        required
                    />
                </div>

                {/* Job Description Textarea */}
                <div className="flex flex-col my-4">
                    <label className="text-sm font-semibold text-gray-700 mb-1">Job Description Overview</label>
                    <textarea
                        name="description"
                        value={input.description}
                        onChange={changeEventHandler}
                        rows={4}
                        placeholder="Detail core operational responsibilities, engineering project goals, and daily stack tasks..."
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        required
                    />
                </div>

                {/* Form Navigation Controls */}
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/jobs")}
                        className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition-all cursor-pointer disabled:bg-blue-400"
                    >
                        {loading ? "Publishing..." : "Post Job Opening"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostJob;