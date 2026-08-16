// File Path: frontend/src/pages/Home.jsx
import React from 'react';
import HeroSection from '../components/shared/HeroSection';
import CategoryCarousel from '../components/shared/CategoryCarousel';
import LatestJobs from '../components/shared/LatestJobs';

const Home = () => {
    return (
        <div className="pb-16 bg-gray-50/50 min-h-screen">
            <HeroSection />
            <CategoryCarousel />
            <LatestJobs />
        </div>
    );
};

export default Home;