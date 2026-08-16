// File Path: frontend/src/redux/applicantSlice.js
import { createSlice } from '@reduxjs/toolkit';

const applicantSlice = createSlice({
    name: 'applicant',
    initialState: {
        applicantsData: null,
    },
    reducers: {
        setApplicants: (state, action) => {
            state.applicantsData = action.payload;
        }
    }
});

export const { setApplicants } = applicantSlice.actions;
export default applicantSlice.reducer;