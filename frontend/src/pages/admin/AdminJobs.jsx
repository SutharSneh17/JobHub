// File Path: frontend/src/pages/admin/AdminJobs.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Plus, Search, ExternalLink } from 'lucide-react';
import useGetAllAdminJobs from '../../hooks/useGetAllAdminJobs';

const AdminJobs = () => {
    useGetAllAdminJobs();
    const navigate = useNavigate();
    
    const { allAdminJobs } = useSelector(state => state.adminJob);
    const safeAdminJobs = allAdminJobs || [];

    const [filterInput, setFilterInput] = useState("");

    const filteredJobs = safeAdminJobs.filter((job) => {
        if (!filterInput) return true;
        return job?.title?.toLowerCase().includes(filterInput.toLowerCase()) || 
               job?.companyId?.name?.toLowerCase().includes(filterInput.toLowerCase());
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
            {/* Action Header Panel Row */}
            <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
                <div className="flex border border-gray-200 pl-3 pr-1 py-1 rounded-md items-center gap-2 bg-white w-full sm:w-80 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    <Search className="h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Filter jobs by title or company..."
                        value={filterInput}
                        onChange={(e) => setFilterInput(e.target.value)}
                        className="outline-none border-none w-full text-sm font-medium text-gray-700 py-1"
                    />
                </div>
                <button
                    onClick={() => navigate("/admin/jobs/create")}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
                >
                    <Plus className="h-4 w-4" /> Post New Job
                </button>
            </div>

            {/* Recruiter Active Postings Data Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-500">
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4">Role Title</th>
                            <th className="px-6 py-4">Salary Package</th>
                            <th className="px-6 py-4">Date Created</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm font-medium text-gray-700">
                        {filteredJobs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                    No active job listings found. Click "Post New Job" to create one.
                                </td>
                            </tr>
                        ) : (
                            filteredJobs.map((job) => (
                                <tr key={job._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        {/* NEW CLICKABLE LOGO AND NAME */}
                                        {job?.companyId?.website ? (
                                            <a 
                                                href={job.companyId.website.startsWith('http') ? job.companyId.website : `https://${job.companyId.website}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 hover:text-blue-600 transition-colors group"
                                                title={`Visit ${job.companyId.name} website`}
                                            >
                                                {job?.companyId?.logo ? (
                                                    <img 
                                                        src={job.companyId.logo} 
                                                        alt="logo" 
                                                        className="w-8 h-8 rounded object-cover border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400 font-bold border border-gray-200">
                                                        {job?.companyId?.name?.charAt(0) || "I"}
                                                    </div>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    {job?.companyId?.name || "Independent"}
                                                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </span>
                                            </a>
                                        ) : (
                                            /* Fallback if no website is provided */
                                            <div className="flex items-center gap-3">
                                                {job?.companyId?.logo ? (
                                                    <img 
                                                        src={job.companyId.logo} 
                                                        alt="logo" 
                                                        className="w-8 h-8 rounded object-cover border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400 font-bold border border-gray-200">
                                                        {job?.companyId?.name?.charAt(0) || "I"}
                                                    </div>
                                                )}
                                                <span>{job?.companyId?.name || "Independent"}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{job?.title}</td>
                                    <td className="px-6 py-4 text-emerald-600">
                                        ₹{(job?.salary / 100000).toFixed(1)} LPA
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-400">
                                        {job?.createdAt?.split("T")[0]}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => navigate(`/admin/jobs/applicants/${job._id}`)}
                                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded border border-gray-200 text-blue-600 bg-white hover:bg-gray-50 transition-all cursor-pointer shadow-sm"
                                        >
                                            Applicants ({job?.applications?.length || 0})
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminJobs;