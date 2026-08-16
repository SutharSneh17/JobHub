// File Path: frontend/src/pages/admin/Companies.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Edit2, Plus, Search, ExternalLink } from 'lucide-react'; // <-- ADDED ExternalLink
import useGetAllCompanies from '../../hooks/useGetAllCompanies';
import { toast } from 'sonner';

const Companies = () => {
    useGetAllCompanies(); // Fetch data dynamically on mount
    const navigate = useNavigate();
    const { companies } = useSelector(state => state.company);
    const [filterInput, setFilterInput] = useState("");

    // Filter companies dynamically based on search bar string
    const filteredCompanies = companies.filter((company) => {
        if (!filterInput) return true;
        return company?.name?.toLowerCase().includes(filterInput.toLowerCase());
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
            {/* Top Action Row Bar */}
            <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
                <div className="flex border border-gray-200 pl-3 pr-1 py-1 rounded-md items-center gap-2 bg-white w-full sm:w-80 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    <Search className="h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Filter companies by name..."
                        value={filterInput}
                        onChange={(e) => setFilterInput(e.target.value)}
                        className="outline-none border-none w-full text-sm font-medium text-gray-700 py-1"
                    />
                </div>
                <button
                    onClick={() => navigate("/admin/companies/create")}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
                >
                    <Plus className="h-4 w-4" /> New Company
                </button>
            </div>

            {/* Structured Companies Data Table Layout */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-500">
                            <th className="px-6 py-4">Logo</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Date Initialized</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm font-medium text-gray-700">
                        {filteredCompanies.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                    No registered company profiles found.
                                </td>
                            </tr>
                        ) : (
                            filteredCompanies.map((company) => (
                                <tr key={company._id} className="hover:bg-gray-50/50 transition-colors">
                                    
                                    {/* --- UPDATED LOGO COLUMN --- */}
                                    <td className="px-6 py-4">
                                        {company?.website ? (
                                            <a 
                                                href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                title={`Visit ${company.name} website`}
                                            >
                                                <div className="h-8 w-8 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-xs text-blue-600 overflow-hidden hover:opacity-80 transition-opacity">
                                                    {company.logo ? (
                                                        <img src={company.logo} alt="logo" className="h-full w-full object-cover" />
                                                    ) : (
                                                        company.name?.charAt(0)
                                                    )}
                                                </div>
                                            </a>
                                        ) : (
                                            <div className="h-8 w-8 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-xs text-blue-600 overflow-hidden">
                                                {company.logo ? (
                                                    <img src={company.logo} alt="logo" className="h-full w-full object-cover" />
                                                ) : (
                                                    company.name?.charAt(0)
                                                )}
                                            </div>
                                        )}
                                    </td>

                                    {/* --- UPDATED NAME COLUMN --- */}
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        {company?.website ? (
                                            <a 
                                                href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 hover:text-blue-600 transition-colors group w-fit"
                                            >
                                                {company.name}
                                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                                            </a>
                                        ) : (
                                            company.name
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-gray-500">{company.location}</td>
                                    <td className="px-6 py-4 text-xs text-gray-400">
                                        {company.createdAt?.split("T")[0]}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => navigate(`/admin/companies/${company._id}`)}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:text-blue-600 transition-all cursor-pointer shadow-sm"
                                        >
                                            <Edit2 className="h-3 w-3" /> Edit
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

export default Companies;