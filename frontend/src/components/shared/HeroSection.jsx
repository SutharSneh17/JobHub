// File Path: frontend/src/components/shared/HeroSection.jsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';

const HeroSection = () => {
    const [query, setQuery] = useState("");

    const searchJobHandler = (e) => {
        e.preventDefault();
        console.log("Searching jobs for query: ", query);
        // We will tie this to our global Redux search filters in later dashboard steps
    };

    return (
        <div className="text-center bg-gradient-to-b from-blue-50/50 to-transparent py-20 px-4">
            <div className="flex flex-col gap-5 my-10 max-w-4xl mx-auto">
                {/* Micro Branding Pill */}
                <span className="mx-auto px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-semibold text-xs uppercase tracking-wider shadow-sm border border-blue-100">
                    No. 1 Job Placement Aggregator
                </span>

                {/* Catchy Header Hook */}
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-950 tracking-tight leading-none mt-2">
                    Search, Apply & <br /> Get Your <span className="text-blue-600">Dream Jobs</span>
                </h1>

                {/* Subtext description summary */}
                <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mt-2 leading-relaxed">
                    Discover thousands of curated corporate career opportunities, internships, and flexible contract openings engineered around your tech stack specialization.
                </p>

                {/* Integrated Input Search Bar Panel */}
                <form onSubmit={searchJobHandler} className="flex w-full sm:w-2/3 md:w-1/2 border border-gray-200 pl-4 pr-1 py-1 rounded-full items-center gap-2 mx-auto bg-white shadow-md focus-within:ring-2 focus-within:ring-blue-500 transition-all mt-6">
                    <input
                        type="text"
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Find your dream jobs by title, skills or keywords..."
                        className="outline-none border-none w-full text-sm font-medium text-gray-700 bg-transparent py-2"
                    />
                    <button type="submit" className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm cursor-pointer">
                        <Search className="h-4 w-4" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HeroSection;