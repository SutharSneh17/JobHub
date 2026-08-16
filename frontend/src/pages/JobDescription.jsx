// File Path: frontend/src/pages/JobDescription.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setSingleJob } from '../redux/jobSlice';
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from '../utils/constant';
import { toast } from 'sonner';

const JobDescription = () => {
    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    
    const { singleJob } = useSelector(state => state.job);
    const { user } = useSelector(state => state.auth);

    const initialAppliedState = singleJob?.applications?.some(app => app.applicantId === user?._id) || false;
    const [isApplied, setIsApplied] = useState(initialAppliedState);

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/details/${jobId}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications?.some(app => app.applicantId === user?._id));
                }
            } catch (error) {
                console.error("Error retrieving job metrics context: ", error);
            }
        };
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    const applyJobHandler = async () => {
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {}, {
                withCredentials: true
            });

            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = {
                    ...singleJob,
                    applications: [...(singleJob.applications || []), { applicantId: user?._id }]
                };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message || "Application log synced successfully!");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Application process failed.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
            <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-6 flex-wrap gap-4">
                <div>
                    <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-950 tracking-tight">{singleJob?.title}</h1>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100">{singleJob?.position} Openings</span>
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-100">{singleJob?.jobType}</span>
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100">₹{(singleJob?.salary / 100000).toFixed(1)} LPA</span>
                    </div>
                </div>

                <button
                    onClick={isApplied ? null : applyJobHandler}
                    disabled={isApplied || user?.role === 'recruiter'}
                    className={`px-6 py-2.5 text-sm font-semibold rounded-md shadow-sm transition-all cursor-pointer ${
                        isApplied 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {user?.role === 'recruiter' ? "Recruiter Mode" : isApplied ? "Already Applied" : "Apply Now"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* --- Job Specifications --- */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
                    <h2 className="font-extrabold text-lg text-gray-950 border-b border-gray-100 pb-3 mb-4 tracking-tight">Job Specifications</h2>
                    <div className="space-y-4 text-sm">
                        <div className="flex"><span className="font-bold text-gray-800 w-32 shrink-0">Role:</span> <span className="text-gray-600">{singleJob?.title}</span></div>
                        <div className="flex"><span className="font-bold text-gray-800 w-32 shrink-0">Location:</span> <span className="text-gray-600">{singleJob?.location}</span></div>
                        <div className="flex"><span className="font-bold text-gray-800 w-32 shrink-0">Experience:</span> <span className="text-gray-600">{singleJob?.experienceLevel} Years</span></div>
                        <div className="flex"><span className="font-bold text-gray-800 w-32 shrink-0">Description:</span> <span className="text-gray-600 leading-relaxed">{singleJob?.description}</span></div>
                    </div>
                </div>

                {/* --- NEW: Operational Details --- */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
                    <h2 className="font-extrabold text-lg text-gray-950 border-b border-gray-100 pb-3 mb-4 tracking-tight">Operational Details</h2>
                    <div className="space-y-4 text-sm">
                        <div className="flex"><span className="font-bold text-gray-800 w-40 shrink-0">Timing:</span> <span className="text-gray-600">{singleJob?.timing || "Not specified"}</span></div>
                        <div className="flex"><span className="font-bold text-gray-800 w-40 shrink-0">Working Days:</span> <span className="text-gray-600">{singleJob?.workingDays || "Not specified"}</span></div>
                        <div className="flex"><span className="font-bold text-gray-800 w-40 shrink-0">Transportation:</span> <span className="text-gray-600">{singleJob?.transportation || "Not specified"}</span></div>
                        <div className="flex"><span className="font-bold text-gray-800 w-40 shrink-0">Work Mode:</span> <span className="text-gray-600">{singleJob?.workMode || "Not specified"}</span></div>
                        <div className="flex"><span className="font-bold text-gray-800 w-40 shrink-0">Laptop Required:</span> <span className="text-gray-600">{singleJob?.laptopRequired || "Not specified"}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDescription;