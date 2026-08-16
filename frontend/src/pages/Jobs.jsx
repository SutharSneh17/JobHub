// File Path: frontend/src/pages/Jobs.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FilterCard from '../components/shared/FilterCard';
import JobCard from '../components/shared/JobCard';
import useGetAllJobs from '../hooks/useGetAllJobs';

const Jobs = () => {
    useGetAllJobs();
    
    const { allJobs, searchQuery } = useSelector(state => state.job);
    const [filterJobs, setFilterJobs] = useState([]);
    
    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 6; 
    // -----------------------------

    useEffect(() => {
        // Reset to page 1 whenever filters change
        setCurrentPage(1);
        
        if (searchQuery && searchQuery.length > 0) {
            if (typeof searchQuery === 'string') {
                const filtered = allJobs.filter((job) => {
                    return job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.location.toLowerCase().includes(searchQuery.toLowerCase());
                });
                setFilterJobs(filtered);
                return;
            }

            if (Array.isArray(searchQuery)) {
                const locationOptions = ["Ahmedabad", "Mumbai", "Bangalore", "Pune", "Remote"];
                const industryOptions = ["Frontend Developer", "Backend Developer", "Data Science", "FullStack Developer"];
                const salaryOptions = ["0-3 Lakhs", "3-6 Lakhs", "6-15 Lakhs", "15+ Lakhs"];
                const workModeOptions = ["Work From Office", "Work From Home", "Hybrid Work"];
                
                // --- NEW: Added filter categories ---
                const jobTypeOptions = ["Full-time", "Part-time", "Internship", "Contract"];
                const experienceOptions = ["Fresher", "1-3 Years", "3-5 Years", "5+ Years"];

                const selectedLocations = searchQuery.filter(q => locationOptions.includes(q));
                const selectedIndustries = searchQuery.filter(q => industryOptions.includes(q));
                const selectedSalaries = searchQuery.filter(q => salaryOptions.includes(q));
                const selectedWorkModes = searchQuery.filter(q => workModeOptions.includes(q));
                
                // --- NEW: Extracting selected options ---
                const selectedJobTypes = searchQuery.filter(q => jobTypeOptions.includes(q));
                const selectedExperiences = searchQuery.filter(q => experienceOptions.includes(q));

                const filtered = allJobs.filter((job) => {
                    let locationMatch = true;
                    if (selectedLocations.length > 0) {
                        locationMatch = selectedLocations.some(loc => job.location.toLowerCase().includes(loc.toLowerCase()));
                    }

                    let industryMatch = true;
                    if (selectedIndustries.length > 0) {
                        industryMatch = selectedIndustries.some(ind => job.title.toLowerCase().includes(ind.toLowerCase()));
                    }

                    let salaryMatch = true;
                    if (selectedSalaries.length > 0) {
                        salaryMatch = selectedSalaries.some(range => {
                            if (range === "0-3 Lakhs") return job.salary >= 0 && job.salary <= 300000;
                            if (range === "3-6 Lakhs") return job.salary > 300000 && job.salary <= 600000;
                            if (range === "6-15 Lakhs") return job.salary > 600000 && job.salary <= 1500000;
                            if (range === "15+ Lakhs") return job.salary > 1500000;
                            return false;
                        });
                    }

                    let workModeMatch = true;
                    if (selectedWorkModes.length > 0) {
                        workModeMatch = selectedWorkModes.some(mode => job.workMode && job.workMode.toLowerCase() === mode.toLowerCase());
                    }

                    // --- NEW: Matching Logic for Job Type ---
                    let jobTypeMatch = true;
                    if (selectedJobTypes.length > 0) {
                        jobTypeMatch = selectedJobTypes.some(type => job.jobType && job.jobType.toLowerCase() === type.toLowerCase());
                    }

                    // --- NEW: Matching Logic for Experience (Numbers) ---
                    let experienceMatch = true;
                    if (selectedExperiences.length > 0) {
                        experienceMatch = selectedExperiences.some(exp => {
                            if (exp === "Fresher") return job.experienceLevel === 0;
                            if (exp === "1-3 Years") return job.experienceLevel >= 1 && job.experienceLevel <= 3;
                            if (exp === "3-5 Years") return job.experienceLevel > 3 && job.experienceLevel <= 5;
                            if (exp === "5+ Years") return job.experienceLevel > 5;
                            return false;
                        });
                    }

                    // Update the return statement to include the new matches
                    return locationMatch && industryMatch && salaryMatch && workModeMatch && jobTypeMatch && experienceMatch;
                });
                setFilterJobs(filtered);
            }
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchQuery]);

    // --- Calculate Jobs to Show for Current Page ---
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filterJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filterJobs.length / jobsPerPage);
    // ----------------------------------------------------

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pb-20">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/4">
                    <FilterCard />
                </div>

                <div className="flex-1">
                    {filterJobs.length === 0 ? (
                        <div className="text-center py-20 bg-white border border-gray-200 rounded-xl font-medium text-gray-500 text-sm">
                            No corporate openings match your designated target query selections.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {currentJobs.map((job) => (
                                    <JobCard key={job._id} job={job} />
                                ))}
                            </div>
                            
                            {/* --- Pagination Controls --- */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-4 mt-6">
                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm font-medium text-gray-600">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Jobs;