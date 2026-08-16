// File Path: frontend/src/pages/Profile.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Mail, Contact, Pen, FileText, Bookmark } from 'lucide-react';
import UpdateProfileDialog from "../components/shared/UpdateProfileDialog";
import JobCard from "../components/shared/JobCard"; // NEW: Import the JobCard

const Profile = () => {
    const [open, setOpen] = useState(false);
    const { user } = useSelector(state => state.auth);

    if (!user) return null; 

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-10 p-8 shadow-sm">
                
                {/* --- Top Profile Info Section --- */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                        <div className="h-24 w-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-extrabold border-4 border-white shadow-md overflow-hidden shrink-0">
                            {user?.profile?.profilePhoto ? (
                                <img 
                                    src={user?.profile?.profilePhoto} 
                                    alt="Profile" 
                                    className="h-full w-full object-cover" 
                                />
                            ) : (
                                user?.fullName?.charAt(0) || "U"
                            )}
                        </div>
                        
                        <div>
                            <h1 className="font-extrabold text-2xl text-gray-900">{user?.fullName}</h1>
                            <p className="text-gray-500 text-sm mt-1 max-w-md">
                                {user?.profile?.bio || "No bio provided yet. Update your profile to add one!"}
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setOpen(true)} 
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all cursor-pointer"
                        title="Edit Profile"
                    >
                        <Pen className="w-5 h-5" />
                    </button>
                </div>

                {/* --- Contact Info --- */}
                <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-3 text-gray-600">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                        <Contact className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium">{user?.phoneNumber || "Not provided"}</span>
                    </div>
                </div>

                {/* --- Skills --- */}
                <div className="mt-10">
                    <h2 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-2 mb-4">Core Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {user?.profile?.skills?.length > 0 ? (
                            user.profile.skills.map((skill, index) => (
                                <span key={index} className="bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full text-xs border border-blue-200">
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-400 text-sm italic">No skills added yet.</span>
                        )}
                    </div>
                </div>

                {/* --- Resume --- */}
                <div className="mt-10">
                    <h2 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-2 mb-4">Resume</h2>
                    {user?.profile?.resume ? (
                        <a 
                            href={user?.profile?.resume} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg border border-blue-200"
                        >
                            <FileText className="w-5 h-5" />
                            {user?.profile?.resumeOriginalName || "View Uploaded Resume"}
                        </a>
                    ) : (
                        <p className="text-gray-400 text-sm italic">No resume uploaded.</p>
                    )}
                </div>

                {/* --- NEW: Saved Jobs Section --- */}
                <div className="mt-14">
                    <h2 className="font-bold text-xl text-gray-900 border-b border-gray-100 pb-2 mb-6">Saved Jobs</h2>
                    
                    {/* We check typeof object to ensure the backend population was successful */}
                    {user?.profile?.savedJobs?.length > 0 && typeof user.profile.savedJobs[0] === 'object' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {user.profile.savedJobs.map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 text-center">
                            <Bookmark className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium text-sm">You haven't saved any jobs yet.</p>
                            <p className="text-gray-400 text-xs mt-1">Jobs you bookmark will appear here for easy access.</p>
                        </div>
                    )}
                </div>
                {/* ---------------------------------- */}
                
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default Profile;