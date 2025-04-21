'use client';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const AdminWebApp = () => {
  // States for form inputs
  const [studentNumber, setStudentNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');
  
  // States for filtering
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // States for data
  const [allPlayers, setAllPlayers] = useState([]);
  const [winners, setWinners] = useState([]);
  const [auditTrail, setAuditTrail] = useState([]);
  const [activeTab, setActiveTab] = useState('register');
  
  // Load initial data
  useEffect(() => {
    fetchAllGameData();
    fetchWinners();
  }, []);
  
  // Fetch data when date filters change
  useEffect(() => {
    if (startDate && endDate) {
      fetchAllGameData();
      fetchWinners();
    }
  }, [startDate, endDate]);
  
  const fetchAllGameData = async () => {
    try {
      let url = '/api/games';
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setAuditTrail(data);
        setAllPlayers(data);
      }
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  };
  
  const fetchWinners = async () => {
    try {
      let url = '/api/winners';
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setWinners(data);
      }
    } catch (error) {
      console.error('Error fetching winners:', error);
    }
  };
  
  const handleRegisterUser = async (e) => {
    e.preventDefault();
    
    // Validate student number
    if (!studentNumber.startsWith('C') || !/^C\d+$/.test(studentNumber)) {
      setRegisterMessage('Student number must start with C followed by numbers only');
      return;
    }
    
    try {
      const response = await fetch('/api/register-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentNumber,
          firstName,
          lastName
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setRegisterMessage('Student registered successfully!');
        setStudentNumber('');
        setFirstName('');
        setLastName('');
        // Refresh player list
        fetchAllGameData();
      } else {
        setRegisterMessage(data.message || 'Error registering student');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setRegisterMessage('An error occurred while registering the student');
    }
  };
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Slot Machine Admin Portal</h1>
      
      {/* Navigation Tabs */}
      <div className="flex border-b mb-6">
        <button 
          className={`px-4 py-2 ${activeTab === 'register' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('register')}
        >
          Register User
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'players' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('players')}
        >
          All Players
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'winners' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('winners')}
        >
          Winners
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'audit' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('audit')}
        >
          Audit Trail
        </button>
      </div>
      
      {/* Date Filter (for players, winners, and audit tabs) */}
      {activeTab !== 'register' && (
        <div className="flex items-center mb-6 bg-gray-100 p-4 rounded">
          <div className="flex items-center">
            <label className="mr-2">Start Date:</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 mr-4"
            />
          </div>
          <div className="flex items-center">
            <label className="mr-2">End Date:</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 mr-4"
            />
          </div>
          <button 
            onClick={() => {
              fetchAllGameData();
              fetchWinners();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Apply Filter
          </button>
        </div>
      )}
      
      {/* Register User Tab */}
      {activeTab === 'register' && (
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Register New Player</h2>
          <form onSubmit={handleRegisterUser}>
            <div className="mb-4">
              <label className="block mb-2">Student Number (C12345):</label>
              <input 
                type="text" 
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value.toUpperCase())}
                placeholder="C12345"
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">First Name:</label>
              <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Last Name:</label>
              <input 
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <button 
              type="submit" 
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Register
            </button>
            {registerMessage && (
              <p className={`mt-4 ${registerMessage.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                {registerMessage}
              </p>
            )}
          </form>
        </div>
      )}
      
      {/* All Players Tab */}
      {activeTab === 'players' && (
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-4">All Players</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Student Number</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Outcome</th>
                  <th className="py-2 px-4 border">Date Played</th>
                </tr>
              </thead>
              <tbody>
                {allPlayers.length > 0 ? (
                  allPlayers.map((player, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-2 px-4 border">{player.studentNumber}</td>
                      <td className="py-2 px-4 border">{player.studentName}</td>
                      <td className="py-2 px-4 border">{player.outcome}</td>
                      <td className="py-2 px-4 border">{formatDate(player.datePlayed)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-center">No players found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Winners Tab */}
      {activeTab === 'winners' && (
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Winners</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Student Number</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Date Won</th>
                </tr>
              </thead>
              <tbody>
                {winners.length > 0 ? (
                  winners.map((winner, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-2 px-4 border">{winner.studentNumber}</td>
                      <td className="py-2 px-4 border">{winner.studentName}</td>
                      <td className="py-2 px-4 border">{formatDate(winner.datePlayed)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-4 text-center">No winners found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Audit Trail Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Audit Trail</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Student Number</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Outcome</th>
                  <th className="py-2 px-4 border">Date Played</th>
                </tr>
              </thead>
              <tbody>
                {auditTrail.length > 0 ? (
                  auditTrail.map((entry, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-2 px-4 border">{entry.studentNumber}</td>
                      <td className="py-2 px-4 border">{entry.studentName}</td>
                      <td className="py-2 px-4 border">{entry.outcome}</td>
                      <td className="py-2 px-4 border">{formatDate(entry.datePlayed)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-center">No audit entries found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWebApp;