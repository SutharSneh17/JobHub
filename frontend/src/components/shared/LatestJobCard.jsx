// File Path: frontend/src/components/shared/LatestJobCard.jsx
import React from 'react';

const LatestJobCard = ({ job }) => {
    return (
        <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col justify-between h-full">
            <div>
                {/* Corporate Company Context Row */}
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h2 className="font-bold text-base text-gray-900 tracking-tight">{job?.companyName}</h2>
                        <p className="text-xs text-gray-500">{job?.location}</p>
                    </div>
                </div>

                {/* Title & Description Context Blocks */}
                <h3 className="font-extrabold text-lg text-gray-950 my-2 tracking-tight line-clamp-1">{job?.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-4">{job?.description}</p>
            </div>

            {/* Badges Cluster Grid Block */}
            <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-50 flex-wrap">
                <span className="text-[10px] font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                    {job?.position} Openings
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-100">
                    {job?.jobType}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100">
                    ₹{(job?.salary / 100000).toFixed(1)} LPA
                </span>
            </div>
        </div>
    );
};

export default LatestJobCard;