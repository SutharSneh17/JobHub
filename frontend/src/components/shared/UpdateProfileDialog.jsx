// File Path: frontend/src/components/shared/UpdateProfileDialog.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { X, Loader2 } from 'lucide-react';
import { USER_API_END_POINT } from "../../utils/constant";

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || "",
        file: "", 
        profilePhoto: "" // NEW: State for the photo
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    };

    // NEW: Handler specifically for the image input
    const photoChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, profilePhoto: file });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("fullName", input.fullName);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        
        if (input.file) {
            formData.append("file", input.file);
        }
        
        // NEW: Append profile photo if selected
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }

        try {
            setLoading(true);
            const res = await axios.put(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            
            if (res.data.success) {
                dispatch({ type: 'auth/setUser', payload: res.data.user }); 
                alert(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "An error occurred while updating profile");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden relative flex flex-col max-h-[90vh] animate-in zoom-in duration-200">
                
                <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                    <button type="button" onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={submitHandler} className="p-5 space-y-4 overflow-y-auto">
                    
                    {/* NEW: Profile Photo Input */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Profile Photo (Image)</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={photoChangeHandler} 
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Full Name</label>
                        <input type="text" name="fullName" value={input.fullName} onChange={changeEventHandler} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Email</label>
                        <input type="email" name="email" value={input.email} onChange={changeEventHandler} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                        <input type="text" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Bio</label>
                        <textarea name="bio" value={input.bio} onChange={changeEventHandler} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Skills (comma separated)</label>
                        <input type="text" name="skills" value={input.skills} onChange={changeEventHandler} placeholder="React, Node, Express" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Resume Upload (PDF)</label>
                        <input 
                            type="file" 
                            accept="application/pdf" 
                            onChange={fileChangeHandler} 
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                    </div>

                    <div className="pt-4 pb-2">
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2.5 rounded-md font-bold hover:bg-blue-700 transition-colors flex justify-center items-center cursor-pointer">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Save Updates"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfileDialog;