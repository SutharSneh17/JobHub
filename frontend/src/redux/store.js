// File Path: frontend/src/redux/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import jobReducer from './jobSlice';
import companyReducer from './companySlice';
import adminJobReducer from './adminJobSlice';
import applicantReducer from './applicantSlice';

import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';

// FIXED: Manually defining the storage engine to bypass the Vite import bug
const storage = {
    getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
    setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
    removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
};

const persistConfig = {
    key: 'root',
    version: 1,
    storage, // Now safely uses our custom manual storage
};

const rootReducer = combineReducers({
    auth: authReducer,
    job: jobReducer,
    company: companyReducer,
    adminJob: adminJobReducer,
    applicant: applicantReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export default store;