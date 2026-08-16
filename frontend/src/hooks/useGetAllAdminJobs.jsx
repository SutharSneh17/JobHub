// File Path: frontend/src/hooks/useGetAllAdminJobs.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setAdminJobs } from '../redux/adminJobSlice';
import { JOB_API_END_POINT } from '../utils/constant';

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAdminJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/recruiter/all`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.error("Error retrieving admin jobs database log: ", error);
            }
        };
        fetchAdminJobs();
    }, [dispatch]);
};

export default useGetAllAdminJobs;