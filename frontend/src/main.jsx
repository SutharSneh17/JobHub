// File Path: frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Redux imports
import { Provider } from 'react-redux';
import store from './redux/store.js';

// Redux Persist imports
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Provider gives your whole app access to Redux */}
    <Provider store={store}>
      {/* PersistGate delays rendering the App until your saved data is loaded */}
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);