import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="body-container">
          <Sidebar />
          <main className="page-content">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Otras rutas aquí */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
