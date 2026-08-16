// File Path: frontend/src/pages/admin/CompanyCreate.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setSingleCompany } from '../../redux/companySlice';
import { COMPANY_API_END_POINT } from '../../utils/constant';
import { toast } from 'sonner';

const CompanyCreate = () => {
    const [companyName, setCompanyName] = useState("");
    const [location, setLocation] = useState(""); // Track explicit location entry (NEW)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // File Path: frontend/src/pages/admin/CompanyCreate.jsx

    const registerNewCompany = async (e) => {
        e.preventDefault();
        if (!companyName.trim() || !location.trim()) {
            toast.error("Please provide both a company name and primary location.");
            return;
        }
    
        try {
            // FIXED: Changed 'name' to 'companyName' to match your backend controller exactly
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { 
                companyName: companyName, 
                location: location 
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
        
            if (res.data.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message || "Company base initialized successfully!");
                const companyId = res.data.company._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to register corporate profile entry.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 my-20">
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                {/* Intro Headers */}
                <div className="mb-8">
                    <h1 className="font-extrabold text-2xl text-gray-950 tracking-tight">Your Company Identity</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Provide a base name and location for your organization. You can modify descriptions and extra brand elements later.
                    </p>
                </div>

                {/* Form Processing Block */}
                <form onSubmit={registerNewCompany}>
                    {/* Company Name Input Box */}
                    <div className="flex flex-col my-4">
                        <label className="text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g. Google, Microsoft, TechSolutions"
                            className="px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50/50 transition-all"
                            required
                        />
                    </div>

                    {/* Company Location Input Box (NEW) */}
                    <div className="flex flex-col my-4">
                        <label className="text-sm font-semibold text-gray-700 mb-2">Primary Location / City</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g. Ahmedabad, Mumbai, Remote"
                            className="px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50/50 transition-all"
                            required
                        />
                    </div>

                    {/* Navigation CTA Buttons Group */}
                    <div className="flex items-center gap-4 mt-10 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/companies")}
                            className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
                        >
                            Continue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompanyCreate;