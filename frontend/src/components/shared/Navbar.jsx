// File Path: frontend/src/components/shared/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, Bell, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { setUser } from '../../redux/authSlice';
import { USER_API_END_POINT } from '../../utils/constant';
import { toast } from 'sonner';

const Navbar = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // --- NEW: Notification State ---
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Fetch Notifications on load
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) return;
            try {
                const res = await axios.get('http://localhost:5000/api/v1/notifications', {
                    withCredentials: true
                });
                if (res.data.success) {
                    setNotifications(res.data.notifications);
                }
            } catch (error) {
                console.error("Could not fetch notifications", error);
            }
        };
        fetchNotifications();
    }, [user]);

    // Handle marking a notification as read
    const markAsReadHandler = async (id) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/v1/notifications/${id}/read`, {}, {
                withCredentials: true
            });
            if (res.data.success) {
                // Update local state to remove the blue unread indicator
                setNotifications(notifications.map(n => 
                    n._id === id ? { ...n, isRead: true } : n
                ));
            }
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };
    // --------------------------------

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, {
                withCredentials: true
            });
            
            if (res.data.success) {
                dispatch(setUser(null)); 
                navigate('/'); 
                toast.success(res.data.message || "Logged out successfully");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to log out");
        }
    };

    // Format date for notifications
    const timeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        if (diffInHours < 24) return diffInHours === 0 ? 'Just now' : `${diffInHours}h ago`;
        return `${Math.floor(diffInHours / 24)}d ago`;
    };

    return (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8">
                {/* Branding Logo */}
                <div>
                    <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
                        Job<span className="text-gray-900">Hub</span>
                    </Link>
                </div>

                {/* Navigation Link Items */}
                <div className="flex items-center gap-12">
                    <ul className="flex font-medium text-gray-600 gap-8 items-center">
                        <li>
                            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                        </li>
                        
                        {user?.role !== 'recruiter' && (
                            <>
                                <li>
                                    <Link to="/jobs" className="hover:text-blue-600 transition-colors">Browse Jobs</Link>
                                </li>
                                <li>
                                    <Link to="/status" className="hover:text-blue-600 transition-colors">Status</Link>
                                </li>
                            </>
                        )}

                        {user?.role === 'recruiter' && (
                            <>
                                <li>
                                    <Link to="/admin/dashboard" className="hover:text-blue-600 transition-colors font-semibold text-blue-600">Dashboard</Link>
                                </li>
                                <li>
                                    <Link to="/admin/companies" className="hover:text-blue-600 transition-colors">Companies</Link>
                                </li>
                                <li>
                                    <Link to="/admin/jobs" className="hover:text-blue-600 transition-colors">Manage Jobs</Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Authentication CTA Cluster */}
                    <div className="flex items-center gap-4">
                        {!user ? (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-all">
                                    Login
                                </Link>
                                <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm transition-all">
                                    Signup
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                
                                {/* --- NEW: Notification Bell & Dropdown --- */}
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
                                    >
                                        <Bell className="h-5 w-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1 right-1.5 flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
                                            </span>
                                        )}
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showNotifications && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                                <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
                                                <span className="text-xs text-gray-500 font-medium">{unreadCount} unread</span>
                                            </div>
                                            
                                            <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                                                {notifications.length === 0 ? (
                                                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                                                        You have no notifications yet.
                                                    </div>
                                                ) : (
                                                    notifications.map((notif) => (
                                                        <div 
                                                            key={notif._id} 
                                                            onClick={() => !notif.isRead && markAsReadHandler(notif._id)}
                                                            className={`px-4 py-3 border-b border-gray-50 flex items-start gap-3 transition-colors ${notif.isRead ? 'bg-white' : 'bg-blue-50/50 cursor-pointer hover:bg-blue-50'}`}
                                                        >
                                                            <div className="mt-0.5">
                                                                <CheckCircle2 className={`h-4 w-4 ${notif.isRead ? 'text-gray-400' : 'text-blue-500'}`} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className={`text-sm ${notif.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                                                                    {notif.message}
                                                                </p>
                                                                <span className="text-[10px] text-gray-400 font-medium mt-1 block">
                                                                    {timeAgo(notif.createdAt)}
                                                                </span>
                                                            </div>
                                                            {!notif.isRead && (
                                                                <div className="h-2 w-2 bg-blue-500 rounded-full shrink-0 mt-1.5"></div>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* --------------------------------------- */}

                                <Link 
                                    to="/profile" 
                                    className="flex items-center gap-3 border border-gray-200 rounded-full py-1.5 px-3 hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer"
                                >
                                    <span className="font-medium text-gray-800 tracking-tight">
                                        {user?.fullName}
                                    </span>
                                    <span className="bg-blue-100 text-blue-700 text-[10px] font-extrabold px-2 py-1 rounded-md tracking-wider uppercase">
                                        {user?.role}
                                    </span>
                                </Link>
                                <button 
                                    onClick={logoutHandler}
                                    className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;