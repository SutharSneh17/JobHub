// File Path: frontend/src/components/shared/JobCard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Flame } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/constant';
import { toast } from 'sonner';

const JobCard = ({ job }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    
    const checkIsSaved = () => {
        if (!user?.profile?.savedJobs) return false;
        return user.profile.savedJobs.some(savedJob => {
            const savedJobId = typeof savedJob === 'object' ? savedJob._id : savedJob;
            return savedJobId === job?._id;
        });
    };

    const [isSaved, setIsSaved] = useState(checkIsSaved());

    useEffect(() => {
        setIsSaved(checkIsSaved());
    }, [user, job]);

    // --- NEW: Smart Match Calculation Logic ---
    const calculateMatch = () => {
        if (!user?.profile?.skills || !job?.requirements || job.requirements.length === 0) return 0;
        
        const userSkills = user.profile.skills.map(s => s.toLowerCase().trim());
        const jobReqs = job.requirements.map(r => r.toLowerCase().trim());
        
        let matchCount = 0;
        jobReqs.forEach(req => {
            // Check if the user has a skill that matches or partially matches the requirement
            if (userSkills.some(skill => skill.includes(req) || req.includes(skill))) {
                matchCount++;
            }
        });
        
        return Math.round((matchCount / jobReqs.length) * 100);
    };
    
    const matchPercentage = calculateMatch();
    // ------------------------------------------

    const daysAgo = (timeString) => {
        if (!timeString) return "Today";
        const createdAt = new Date(timeString);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        return days === 0 ? "Today" : `${days} days ago`;
    };

    const handleSaveJob = async (e) => {
        e.stopPropagation(); 
        if (!user) {
            toast.error("You must be logged in to save jobs.");
            return;
        }

        try {
            const res = await axios.post(`${USER_API_END_POINT}/profile/save-job/${job._id}`, {}, {
                withCredentials: true
            });

            if (res.data.success) {
                dispatch({ 
                    type: 'auth/setUser', 
                    payload: { 
                        ...user, 
                        profile: { ...user.profile, savedJobs: res.data.savedJobs } 
                    } 
                });
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "An error occurred while saving the job");
        }
    };

    return (
        <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-gray-500 px-2 py-0.5 bg-gray-100 rounded-full">
                            {daysAgo(job?.createdAt)}
                        </span>
                        
                        {/* --- NEW: Smart Match Badge Render --- */}
                        {user && user.role === 'student' && matchPercentage > 0 && (
                            <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                matchPercentage >= 75 ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                matchPercentage >= 50 ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                                'bg-gray-50 text-gray-500 border-gray-200'
                            }`}>
                                <Flame className="w-3 h-3" /> {matchPercentage}% Match
                            </span>
                        )}
                        {/* ----------------------------------- */}
                    </div>
                    
                    <button 
                        onClick={handleSaveJob}
                        className="text-gray-400 hover:text-blue-600 transition-all duration-200 p-1.5 rounded-full hover:bg-blue-50 cursor-pointer active:scale-75"
                        title={isSaved ? "Remove from saved" : "Save this job"}
                    >
                        <Bookmark 
                            className={`h-4 w-4 transition-all duration-300 ease-in-out ${
                                isSaved ? 'fill-blue-600 text-blue-600 scale-125' : 'scale-100'
                            }`} 
                        />
                    </button>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <div 
                        onClick={() => navigate(`/description/${job._id}`)}
                        className="h-12 w-12 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-200 transition-all"
                    >
                        {job?.companyId?.logo ? (
                            <img src={job.companyId.logo} alt={`${job.companyId.name} Logo`} className="h-full w-full object-contain bg-white p-1" />
                        ) : (
                            <span className="font-bold text-gray-400 text-lg">{job?.companyId?.name ? job.companyId.name.charAt(0).toUpperCase() : "C"}</span>
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-gray-900">{job?.companyId?.name || "Independent Posting"}</h4>
                        <p className="text-xs text-gray-500">{job?.location}</p>
                    </div>
                </div>

                <h3 className="font-extrabold text-base text-gray-950 tracking-tight my-1 line-clamp-1">{job?.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-4">{job?.description}</p>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">{job?.position} Openings</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-100">{job?.jobType}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-100">₹{(job?.salary / 100000).toFixed(1)} LPA</span>
                </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-50 mt-2">
                <button 
                    onClick={() => navigate(`/description/${job._id}`)}
                    className="flex-1 px-4 py-2 text-xs font-semibold border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all cursor-pointer text-center"
                >
                    Details
                </button>
                <button 
                    onClick={() => navigate(`/description/${job._id}`)}
                    className="flex-1 px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition-all cursor-pointer text-center"
                >
                    Apply Now
                </button>
            </div>
        </div>
    );
};

export default JobCard;