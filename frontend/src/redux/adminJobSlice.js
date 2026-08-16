// File Path: frontend/src/redux/adminJobSlice.js
import { createSlice } from '@reduxjs/toolkit';

const adminJobSlice = createSlice({
    name: "adminJob",
    initialState: {
        allAdminJobs: [], // Make sure this key matches!
    },
    reducers: {
        setAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
    },
});

export const { setAdminJobs } = adminJobSlice.actions;
export default adminJobSlice.reducer;