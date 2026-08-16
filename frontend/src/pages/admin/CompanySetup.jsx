// File Path: frontend/src/pages/admin/CompanySetup.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '../../utils/constant';
import { toast } from 'sonner';

const CompanySetup = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null // NEW: Changed from text "logo" to a file object
    });
    const [logoPreview, setLogoPreview] = useState(""); // NEW: To show the image on the screen
    const [loading, setLoading] = useState(false);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    // NEW: Handle the physical file selection
    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, file });
            // Create a temporary local URL to show a preview immediately
            setLogoPreview(URL.createObjectURL(file)); 
        }
    };

    // Pre-populate input states if the company metrics already exist
    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, {
                    withCredentials: true
                });
                if (res.data.success && res.data.company) {
                    const comp = res.data.company;
                    setInput({
                        name: comp.name || "",
                        description: comp.description || "",
                        website: comp.website || "",
                        location: comp.location || "",
                        file: null
                    });
                    // If they already have a logo saved in Cloudinary, show it!
                    if (comp.logo) {
                        setLogoPreview(comp.logo);
                    }
                }
            } catch (error) {
                console.error("Error retrieving company details: ", error);
            }
        };
        fetchCompanyDetails();
    }, [id]);

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // NEW: Convert data to FormData so it can carry the image file
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        
        // Only append the file if the user actually selected a new one
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // NEW: Changed header for files
                },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message || "Corporate profile updated successfully!");
                navigate("/admin/companies");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update corporate profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 my-10">
            <form onSubmit={submitHandler} className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
                
                {/* Header with Logo Preview */}
                <div className="flex items-center gap-5 border-b border-gray-100 pb-4 mb-6">
                    {/* NEW: Visual display of the logo */}
                    <div className="h-20 w-20 bg-gray-100 rounded-full border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                        {logoPreview ? (
                            <img src={logoPreview} alt="Company Logo" className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-gray-400 font-bold text-xl">
                                {input.name ? input.name.charAt(0).toUpperCase() : "C"}
                            </span>
                        )}
                    </div>
                    
                    <div>
                        <h1 className="font-extrabold text-2xl text-gray-950 tracking-tight">Complete Corporate Profile</h1>
                        <p className="text-sm text-gray-500 mt-1">Provide background data info regarding your operational entity workspace framework.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col my-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                        <input
                            type="text"
                            name="name"
                            value={input.name}
                            onChange={changeEventHandler}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                        />
                    </div>
                    <div className="flex flex-col my-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1">Corporate Website URL</label>
                        <input
                            type="url"
                            name="website"
                            value={input.website}
                            onChange={changeEventHandler}
                            placeholder="https://example.com"
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex flex-col my-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1">Primary Location</label>
                        <input
                            type="text"
                            name="location"
                            value={input.location}
                            onChange={changeEventHandler}
                            placeholder="e.g. Ahmedabad, IN"
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    
                    {/* NEW: Replaced Text Input with File Input */}
                    <div className="flex flex-col my-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1">Company Logo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={fileChangeHandler}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-gray-300 rounded-md px-1 py-1"
                        />
                    </div>
                </div>

                <div className="flex flex-col my-4">
                    <label className="text-sm font-semibold text-gray-700 mb-1">Summary Description</label>
                    <textarea
                        name="description"
                        value={input.description}
                        onChange={changeEventHandler}
                        rows={4}
                        placeholder="Write a concise overview description statement clarifying your core company vision values..."
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    />
                </div>

                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/companies")}
                        className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition-all cursor-pointer disabled:bg-blue-400"
                    >
                        {loading ? "Saving Changes..." : "Save Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanySetup;