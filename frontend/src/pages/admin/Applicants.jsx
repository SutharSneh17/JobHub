// File Path: frontend/src/pages/admin/Applicants.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Check, X, ArrowLeft } from 'lucide-react';
import { setApplicants } from '../../redux/applicantSlice';
import { APPLICATION_API_END_POINT } from '../../utils/constant';
import { toast } from 'sonner';

const Applicants = () => {
    const { id } = useParams(); // Capture the dynamic jobId parameter string
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { applicantsData } = useSelector(state => state.applicant);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${id}/applicants`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setApplicants(res.data));
                }
            } catch (error) {
                console.error("Error retrieving candidate submissions:", error);
            }
        };
        fetchApplicants();
    }, [id, dispatch]);

    const statusHandler = async (status, applicationId) => {
        try {
            const res = await axios.put(`${APPLICATION_API_END_POINT}/status/${applicationId}/update`, { status }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message || `Application status marked as ${status}!`);
                
                // Dynamically update the application status locally in Redux state memory
                const updatedApplications = applicantsData.applicants.map(app => 
                    app._id === applicationId ? { ...app, status } : app
                );
                dispatch(setApplicants({ ...applicantsData, applicants: updatedApplications }));
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to mutate candidate status.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
            {/* Navigational Header Row */}
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={() => navigate("/admin/jobs")}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-600"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="font-extrabold text-2xl text-gray-950 tracking-tight">
                        Review Applicants
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Managing {applicantsData?.applicants?.length || 0} applications
                    </p>
                </div>
            </div>

            {/* Candidate Submissions Grid Table Layout */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-500">
                            <th className="px-6 py-4">Full Name</th>
                            <th className="px-6 py-4">Email Address</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Resume</th>
                            <th className="px-6 py-4">Current Status</th>
                            <th className="px-6 py-4 text-right">Review Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm font-medium text-gray-700">
                        {!applicantsData?.applicants || applicantsData.applicants.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                    No candidate submissions recorded for this job posting yet.
                                </td>
                            </tr>
                        ) : (
                            applicantsData.applicants.map((app) => (
                                <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        {app?.applicantId?.fullName || "Anonymous Candidate"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{app?.applicantId?.email}</td>
                                    <td className="px-6 py-4 text-gray-500">{app?.applicantId?.phoneNumber || "N/A"}</td>
                                    {/* --- NEW RESUME LINK --- */}
                                    <td className="px-6 py-4">
                                        {app?.applicantId?.profile?.resume ? (
                                            <a 
                                                href={app?.applicantId?.profile?.resume} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition-colors"
                                            >
                                                {app?.applicantId?.profile?.resumeOriginalName || "View Resume"}
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-sm italic">Not Uploaded</span>
                                        )}
                                    </td>
                                    {/* ----------------------- */}
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                                            app.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            app.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                            'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                            {app.status || 'pending'}
                                        </span>
                                    </td>
                                    
                                    {/* --- NEW ANIMATED ACTION COLUMN --- */}
                                    <td className="px-6 py-4 text-right">
                                        {app.status === 'accepted' || app.status === 'rejected' ? (
                                            <div className="flex justify-end">
                                                <span 
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm transition-all duration-500 ease-out
                                                        ${app.status === 'accepted' 
                                                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                                                            : 'bg-rose-100 text-rose-700 border border-rose-300'
                                                        }
                                                    `}
                                                    style={{
                                                        animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
                                                    }}
                                                >
                                                    {app.status === 'accepted' ? (
                                                        <><Check className="h-3.5 w-3.5" /> Accepted</>
                                                    ) : (
                                                        <><X className="h-3.5 w-3.5" /> Rejected</>
                                                    )}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center justify-end gap-2 w-full">
                                                <button
                                                    onClick={() => statusHandler('accepted', app._id)}
                                                    className="p-1.5 border border-gray-200 text-emerald-600 bg-white hover:bg-emerald-50 rounded shadow-sm transition-all cursor-pointer"
                                                    title="Accept Candidate"
                                                >
                                                    <Check className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => statusHandler('rejected', app._id)}
                                                    className="p-1.5 border border-gray-200 text-rose-600 bg-white hover:bg-rose-50 rounded shadow-sm transition-all cursor-pointer"
                                                    title="Reject Candidate"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        )}
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

export default Applicants;