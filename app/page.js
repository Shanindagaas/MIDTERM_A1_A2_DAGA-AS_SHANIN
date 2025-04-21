'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaGem, FaHeart, FaLaptopCode, FaQuestion } from 'react-icons/fa';

const spinningMessages = [
  "Spinning... This could be your lucky compile!",
  "Spinning... Will your code execute correctly?",
  "Spinning... Debugging your luck!",
  "Spinning... Optimizing for a win!",
  "Spinning... Crossing fingers for no infinite loop!",
  "Spinning... Are you a computer science genius?",
  "Spinning... Hope you don't hit a bug!",
  "Spinning... Will you make it past the first condition?",
  "Spinning... 3, 2, 1... Success?",
  "Spinning... Can you break the recursion?"
];

const gameOverMessages = [
  "Oops! Looks like your code threw an error. Game Over!",
  "Your algorithm failed... Better luck next time!",
  "Looks like you hit a segmentation fault. Game Over!",
  "Compile error! Try again!",
  "This is the equivalent of a 404... Game Over!",
  "You've been debugged... by failure.",
  "Oops! Infinite loop... in the wrong direction. Game Over!",
  "Game Over, but at least you didn't get caught in an endless recursion.",
  "404: Success Not Found. Try again!",
  "Better luck next time, your code ran out of retries!"
];

// Define symbols, including a computer science–themed symbol.
const symbols = [
  { icon: <FaStar className="text-yellow-400" />, name: 'Star' },
  { icon: <FaGem className="text-blue-400" />, name: 'Gem' },
  { icon: <FaHeart className="text-red-400" />, name: 'Heart' },
  { icon: <FaLaptopCode className="text-green-400" />, name: 'Code' },
  { icon: <FaQuestion className="text-red-400" />, name: 'Question' },
];

// Utility to get a random symbol.
const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

// ----- Confetti Component -----
// Renders animated confetti using Framer Motion.
const Confetti = () => {
  const pieces = new Array(30).fill(0);
  const colors = ["#FFC700", "#FF0000", "#2E3192", "#41BBC7"];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {pieces.map((_, index) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = 2 + Math.random() * 2;
        const size = 5 + Math.random() * 10;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <motion.div
            key={index}
            className="absolute rounded-full"
            initial={{ opacity: 0, y: -20, rotate: 0 }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, window.innerHeight * 1.2],
              rotate: [0, 360]
            }}
            transition={{ duration, delay, ease: "easeInOut" }}
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              backgroundColor: color,
            }}
          />
        );
      })}
    </div>
  );
};

const SlotMachine = () => {
  // Initialize reels with three random symbols.
  const [reels, setReels] = useState([
    getRandomSymbol(),
    getRandomSymbol(),
    getRandomSymbol(),
  ]);
  const [spinning, setSpinning] = useState(false);
  const [winSound, setWinSound] = useState(null);
  const [spinSound, setSpinSound] = useState(null);
  const [gameOverSound, setGameOverSound] = useState(null);
  const [bgMusic, setBgMusic] = useState(null);
  
  const [remainingRetries, setRemainingRetries] = useState(3);
  const [statusMessage, setStatusMessage] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [studentName, setStudentName] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [hasWon, setHasWon] = useState(false);
  const [usedRetries, setUsedRetries] = useState(0);
  
  useEffect(() => {
    // Create and set up audio elements.
    const winAudio = new Audio('/win.wav');
    const spinAudio = new Audio('/spin.wav');
    const gameOverAudio = new Audio('/game-over.wav');
    const introAudio = new Audio('/intro.wav'); // Use intro.wav for the initial screen.
    introAudio.loop = true;
    
    setWinSound(winAudio);
    setSpinSound(spinAudio);
    setGameOverSound(gameOverAudio);
    setBgMusic(introAudio);
  }, []);

  // Attach a one-time click listener to enable the intro audio after a user interaction.
  useEffect(() => {
    if (bgMusic && !isValidated) {
      const enableAudio = () => {
        bgMusic.play().catch((err) =>
          console.error('Intro audio play error:', err)
        );
        window.removeEventListener('click', enableAudio);
      };
      window.addEventListener('click', enableAudio);
      return () => window.removeEventListener('click', enableAudio);
    }
  }, [bgMusic, isValidated]);

  const playWinSound = () => {
    if (winSound) {
      winSound.currentTime = 0;
      winSound.play().catch((err) =>
        console.error('Win sound play error:', err)
      );
    }
  };

  const playSpinSound = () => {
    if (spinSound) {
      spinSound.currentTime = 0;
      spinSound.play().catch((err) =>
        console.error('Spin sound play error:', err)
      );
    }
  };

  // Validate student number format (must start with 'C' and contain only numbers after that)
  const isValidStudentNumberFormat = (number) => {
    return /^C\d+$/.test(number);
  };

  // Validate student number through API
  const validateStudentNumber = async (e) => {
    e.preventDefault();
    
    // First check if the format is valid
    if (!isValidStudentNumberFormat(studentNumber)) {
      setValidationError('Invalid student number format. Must start with C followed by numbers only.');
      return;
    }
    
    setIsValidating(true);
    setValidationError('');
    
    try {
      // Check if player has played in the last 3 hours
      const recentPlayersResponse = await fetch('/api/recent-players');
      const recentPlayers = await recentPlayersResponse.json();
      
      const isRecentPlayer = recentPlayers.some(player => player.studentNumber === studentNumber);
      if (isRecentPlayer) {
        setValidationError('You can only play once every 3 hours. Please try again later.');
        setIsValidating(false);
        return;
      }
      
      // Validate if player exists in the system
      const response = await fetch(`/api/validate-player?studentNumber=${studentNumber}`);
      const data = await response.json();
      
      if (response.ok && data.valid) {
        setStudentName(data.name); // Set the student name from the API response
        setIsValidated(true);
        if (bgMusic) {
          bgMusic.pause();
          bgMusic.currentTime = 0;
        }
      } else {
        setValidationError('Invalid student number. Please check and try again.');
      }
    } catch (error) {
      console.error('Error validating student:', error);
      setValidationError('An error occurred while validating your student number. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const spin = () => {
    if (spinning || remainingRetries === 0) return;
    
    setSpinning(true);
    setStatusMessage(spinningMessages[Math.floor(Math.random() * spinningMessages.length)]);
    playSpinSound();
    
    // Calculate spin duration based on spinSound's duration (at least 1 second) multiplied by 800.
    const spinDuration = Math.max(spinSound?.duration || 1, 1) * 800;
    
    const interval = setInterval(() => {
      setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
    }, 100);
    
    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      
      // Determine if player wins
      const newReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
      setReels(newReels);
      
      // Check if all three reels have the same symbol
      const isWin = newReels[0]?.name === newReels[1]?.name && newReels[1]?.name === newReels[2]?.name;
      
      if (isWin) {
        playWinSound();
        setStatusMessage('Congratulations! You win!');
        setHasWon(true);
        
        // Save game result
        saveGameResult(true);
      } else {
        setRemainingRetries((prev) => {
          const updatedRetries = prev - 1;
          setUsedRetries(3 - updatedRetries);
          
          if (updatedRetries === 0) {
            if (gameOverSound) {
              gameOverSound.currentTime = 0;
              gameOverSound.play().catch((err) =>
                console.error('Game over sound error:', err)
              );
            }
            setStatusMessage(gameOverMessages[Math.floor(Math.random() * gameOverMessages.length)]);
            
            // Save game result as loss after all retries are used
            saveGameResult(false);
          } else {
            setStatusMessage('Try again?');
          }
          return updatedRetries;
        });
      }
    }, spinDuration);
  };

  // Save game result to the API
  const saveGameResult = async (isWin) => {
    try {
      const gameData = {
        studentNumber,
        studentName,
        outcome: isWin ? 'Win' : `Loss (${usedRetries + 1} retries)`,
        datePlayed: new Date().toISOString()
      };
      
      await fetch('/api/save-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
      });
    } catch (error) {
      console.error('Error saving game result:', error);
    }
  };

  // Reset the game state and redirect to student number validation
  const handleQuit = () => {
    if (bgMusic) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }
    resetGame();
  };

  // Start a new game after winning
  const handleNewGame = () => {
    if (bgMusic) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }
    resetGame();
  };

  // Reset game state back to its initial values
  const resetGame = () => {
    setRemainingRetries(3);
    setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
    setStatusMessage('');
    setStudentNumber('');
    setStudentName('');
    setIsValidated(false);
    setValidationError('');
    setHasWon(false);
    setUsedRetries(0);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Top right "Quit" control (only on game screen) */}
      {isValidated && (
        <button
          onClick={handleQuit}
          className="absolute top-4 right-4 text-white text-3xl focus:outline-none"
          aria-label="Quit Game"
        >
          &times;
        </button>
      )}
      {!isValidated ? (
        // Student number validation screen
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-4xl font-bold mb-6">Student Slot Machine</h1>
          <form
            onSubmit={validateStudentNumber}
            className="flex flex-col items-center"
          >
            <input
              type="text"
              value={studentNumber}
              required
              onChange={(e) => setStudentNumber(e.target.value.toUpperCase())}
              placeholder="Enter Student Number (C12345)"
              className="mb-4 p-2 text-black rounded-lg bg-white text-center w-64"
            />
            {validationError && (
              <p className="text-red-400 mb-4 text-center">{validationError}</p>
            )}
            <button
              type="submit"
              disabled={isValidating}
              className="px-6 py-3 bg-yellow-500 text-black rounded-xl shadow-lg text-lg font-bold hover:bg-yellow-400 transition-all duration-300 disabled:opacity-50"
            >
              {isValidating ? 'Validating...' : 'Start Game'}
            </button>
          </form>
        </div>
      ) : (
        // Game screen
        <>
          <h1 className="text-4xl font-bold mb-4">Slot Machine</h1>
          <h3 className="text-2xl mb-2">Student: {studentName}</h3>
          <h4 className="text-xl mb-6 text-gray-300">{studentNumber}</h4>
          <div className="flex space-x-4 bg-gray-700 p-6 rounded-lg shadow-lg border-4 border-yellow-500">
            {reels.map((reel, index) => (
              <motion.div
                key={index}
                className="text-6xl"
                animate={{ rotate: spinning ? 360 : 0 }}
                transition={spinning ? { duration: 2, ease: 'easeInOut' } : { duration: 0 }}
              >
                {reel ? reel.icon : <span className="opacity-50">?</span>}
              </motion.div>
            ))}
          </div>
          <div className="mt-6">
            {hasWon ? (
              <button
                onClick={handleNewGame}
                disabled={spinning}
                className="px-6 py-3 bg-yellow-500 text-black rounded-xl shadow-lg text-lg font-bold hover:bg-yellow-400 transition-all duration-300 disabled:opacity-50"
              >
                New Game
              </button>
            ) : remainingRetries > 0 ? (
              <button
                onClick={spin}
                disabled={spinning}
                className="px-6 py-3 bg-yellow-500 text-black rounded-xl shadow-lg text-lg font-bold hover:bg-yellow-400 transition-all duration-300 disabled:opacity-50"
              >
                {spinning ? 'Spinning...' : `Spin (${remainingRetries} left)`}
              </button>
            ) : (
              <div className="px-6 py-3 bg-gray-500 rounded-xl text-lg font-bold">
                Game Over
              </div>
            )}
          </div>
          {statusMessage && <p className="mt-4 text-lg">{statusMessage}</p>}
        </>
      )}
      {hasWon && <Confetti />}
    </div>
  );
};

export default SlotMachine;