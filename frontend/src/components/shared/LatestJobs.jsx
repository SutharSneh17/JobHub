// File Path: frontend/src/components/shared/LatestJobs.jsx
import React from 'react';
import LatestJobCard from './LatestJobCard';

// Temporary structured mock data arrays matching our backend layout requirements
const mockJobs = [
    { _id: '1', title: 'Associate Frontend Developer', description: 'Proficient with building responsive components using React and Tailwind CSS.', position: 2, jobType: 'Full-time', salary: 600000, location: 'Ahmedabad, India', companyName: 'TechSolutions Inc' },
    { _id: '2', title: 'Backend Node.js Engineer', description: 'Experienced building secure microservices architecture models and complex relational database schemas.', position: 1, jobType: 'Remote', salary: 850000, location: 'Mumbai, India', companyName: 'CloudCorp Labs' },
    { _id: '3', title: 'Full Stack MERN Developer', description: 'Drive core architectural features from data layout setup models up to unified dashboard interfaces.', position: 3, jobType: 'Internship', salary: 300000, location: 'Bangalore, India', companyName: 'InnovateX Technologies' }
];

const LatestJobs = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight mb-8">
                Latest & Top <span className="text-blue-600">Job Openings</span>
            </h1>

            {mockJobs.length === 0 ? (
                <div className="text-center py-10 text-gray-500 font-medium text-sm">No job openings listed currently.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockJobs.map((job) => (
                        <LatestJobCard key={job._id} job={job} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default LatestJobs;