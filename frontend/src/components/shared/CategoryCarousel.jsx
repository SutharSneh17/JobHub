// File Path: frontend/src/components/shared/CategoryCarousel.jsx
import React from 'react';

const categories = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer",
    "DevOps Engineer"
];

const CategoryCarousel = () => {
    const handleCategoryClick = (catName) => {
        console.log("Filtering listings by quick tag: ", catName);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 my-12 text-center">
            <div className="flex items-center justify-center gap-3 overflow-x-auto py-3 no-scrollbar flex-wrap">
                {categories.map((cat, index) => (
                    <button
                        key={index}
                        onClick={() => handleCategoryClick(cat)}
                        className="px-5 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm cursor-pointer whitespace-nowrap"
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryCarousel;