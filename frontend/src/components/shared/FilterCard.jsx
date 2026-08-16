// File Path: frontend/src/components/shared/FilterCard.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../../redux/jobSlice';

const filterData = [
    {
        filterType: "Location",
        array: ["Ahmedabad", "Mumbai", "Bangalore", "Pune", "Remote"]
    },
    {
        filterType: "Industry / Stack",
        array: ["Frontend Developer", "Backend Developer", "Data Science", "FullStack Developer"]
    },
    {
        filterType: "Salary Range",
        array: ["0-3 Lakhs", "3-6 Lakhs", "6-15 Lakhs", "15+ Lakhs"]
    },
    // --- NEW: Work Mode Filter ---
    {
        filterType: "Work Mode",
        array: ["Work From Office", "Work From Home", "Hybrid Work"]
    },
    {
        filterType: "Job Type",
        array: ["Full-time", "Part-time", "Internship", "Contract"]
    },
    {
        filterType: "Experience",
        array: ["Fresher", "1-3 Years", "3-5 Years", "5+ Years"]
    }
];

const FilterCard = () => {
    const [selectedValues, setSelectedValues] = useState([]);
    const dispatch = useDispatch();

    const changeHandler = (item) => {
        const currentIndex = selectedValues.indexOf(item);
        const newSelectedValues = [...selectedValues];

        if (currentIndex === -1) {
            newSelectedValues.push(item);
        } else {
            newSelectedValues.splice(currentIndex, 1);
        }

        setSelectedValues(newSelectedValues);
        dispatch(setSearchQuery(newSelectedValues)); 
    };

    const clearFilters = () => {
        setSelectedValues([]);
        dispatch(setSearchQuery([]));
    };

    useEffect(() => {
        return () => {
            dispatch(setSearchQuery([]));
        }
    }, [dispatch]);

    return (
        <div className="w-full bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h2 className="font-extrabold text-lg text-gray-950 tracking-tight">
                    Filter Openings
                </h2>
                {selectedValues.length > 0 && (
                    <button 
                        onClick={clearFilters}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                    >
                        Clear
                    </button>
                )}
            </div>
            <div className="space-y-6">
                {filterData.map((data, index) => (
                    <div key={index}>
                        <h3 className="font-bold text-sm text-gray-800 tracking-tight mb-3">
                            {data.filterType}
                        </h3>
                        <div className="space-y-2">
                            {data.array.map((item, idx) => {
                                const itemId = `f-${index}-${idx}`;
                                return (
                                    <div key={itemId} className="flex items-center gap-2.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name={data.filterType}
                                            value={item}
                                            checked={selectedValues.includes(item)}
                                            onChange={() => changeHandler(item)}
                                            id={itemId}
                                            className="cursor-pointer h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <label
                                            htmlFor={itemId}
                                            className="text-xs font-medium text-gray-600 cursor-pointer select-none hover:text-blue-600 transition-colors"
                                        >
                                            {item}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FilterCard;