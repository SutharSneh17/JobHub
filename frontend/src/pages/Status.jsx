// File Path: frontend/src/pages/Status.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '../utils/constant'; // Adjust path if needed
import { toast } from 'sonner';

const Status = () => {
    const [appliedJobs, setAppliedJobs] = useState([]);

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/applied`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setAppliedJobs(res.data.applications);
                }
            } catch (error) {
                console.error("Error fetching applied jobs:", error);
            }
        };
        fetchAppliedJobs();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
            <div className="mb-8">
                <h1 className="font-extrabold text-2xl text-gray-950 tracking-tight">
                    My Application Status
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    You have applied to {appliedJobs.length} jobs.
                </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-500">
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4">Job Role</th>
                            <th className="px-6 py-4">Applied Date</th>
                            <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm font-medium text-gray-700">
                        {appliedJobs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                    You haven't applied to any jobs yet. Head over to the Browse Jobs page!
                                </td>
                            </tr>
                        ) : (
                            appliedJobs.map((app) => (
                                <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        {app?.jobId?.companyId?.name || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {app?.jobId?.title || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {app?.createdAt?.split("T")[0]}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                            app.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            app.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                            'bg-gray-50 text-gray-700 border-gray-200'
                                        }`}>
                                            {app.status || 'pending'}
                                        </span>
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

export default Status;