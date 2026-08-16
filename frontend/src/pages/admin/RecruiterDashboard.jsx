// File Path: frontend/src/pages/admin/RecruiterDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, Users, TrendingUp } from 'lucide-react';
import useGetAllAdminJobs from '../../hooks/useGetAllAdminJobs';

const RecruiterDashboard = () => {
    // Fetch the latest admin jobs into Redux
    useGetAllAdminJobs();
    
    // Safely pull from Redux, defaulting to an empty array if undefined
    // Pointing to 'adminJob' because that is where your adminJobReducer is stored
    const { allAdminJobs } = useSelector(state => state.adminJob);
    const safeJobs = allAdminJobs || []; 

    const [barChartData, setBarChartData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [totalApplicants, setTotalApplicants] = useState(0);

    const COLORS = ['#eab308', '#22c55e', '#ef4444']; 

    useEffect(() => {
        // QUICK DEBUGGER: This will print your job data to the browser console
        console.log("Dashboard Jobs Loaded:", safeJobs);

        if (safeJobs.length > 0) {
            
            const barData = safeJobs.map(job => {
                const jobTitle = job?.title || 'Unknown Role';
                return {
                    name: jobTitle.length > 15 ? jobTitle.substring(0, 15) + '...' : jobTitle,
                    Applications: job?.applications?.length || 0
                };
            });
            setBarChartData(barData);

            let pending = 0;
            let accepted = 0;
            let rejected = 0;
            let total = 0;

            safeJobs.forEach(job => {
                if (job?.applications && Array.isArray(job.applications)) {
                    job.applications.forEach(app => {
                        total++;
                        // Make sure to check both uppercase and lowercase in case your database saves them differently
                        const status = app.status?.toLowerCase();
                        if (status === 'pending') pending++;
                        if (status === 'accepted') accepted++;
                        if (status === 'rejected') rejected++;
                    });
                }
            });

            setTotalApplicants(total);
            setPieChartData([
                { name: 'Pending', value: pending },
                { name: 'Accepted', value: accepted },
                { name: 'Rejected', value: rejected }
            ]);
        }
    }, [safeJobs]); 

    // NOTICE: We removed the <Navbar /> from the return statement below to fix the double navbar!
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Analytics Dashboard</h1>
                <p className="text-gray-500 mt-1">Track your job postings and candidate engagement.</p>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                        <Briefcase className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                        <h3 className="text-2xl font-bold text-gray-900">{safeJobs.length}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-full">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Applicants</p>
                        <h3 className="text-2xl font-bold text-gray-900">{totalApplicants}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Avg. Applicants / Job</p>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {safeJobs.length > 0 ? (totalApplicants / safeJobs.length).toFixed(1) : 0}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg text-gray-900 mb-6">Applications per Job Role</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f9fafb' }}
                                />
                                <Bar dataKey="Applications" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg text-gray-900 mb-6">Candidate Pipeline Status</h3>
                    <div className="h-80 w-full flex items-center justify-center">
                        {totalApplicants === 0 ? (
                            <p className="text-gray-400 text-sm">No applicants yet</p>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;