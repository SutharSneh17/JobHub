// File Path: frontend/src/hooks/useGetAllJobs.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setAllJobs } from '../redux/jobSlice';
import { JOB_API_END_POINT } from '../utils/constant';

const useGetAllJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/all`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.error("Error fetching jobs from server:", error);
            }
        };
        fetchAllJobs();
    }, [dispatch]); // Ensures it fires accurately when mounting the route viewport
};

export default useGetAllJobs;