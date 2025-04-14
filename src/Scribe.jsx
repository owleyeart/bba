///////////////////////////////////////////////////////
// Bob Baker - Bob Baker Art, April 2025             
// Scribe Station Page - Login = Exhibit Mode        
// Includes audio feedback, form glow, and auto-logout
///////////////////////////////////////////////////////

import React, { useState, useRef, useEffect } from 'react';
import './Scribe.css';
import Header from './Header';
import Footer from './Footer';

const initializeRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Your browser doesn't support voice input.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  return recognition;
};




export default function Scribe() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showGlow, setShowGlow] = useState(false);
  const [bioContent, setBioContent] = useState('');
  const [useMic, setUseMic] = useState(false);
  const [shouldSpeakResponse, setShouldSpeakResponse] = useState(false);

  
  const recognitionRef = useRef(null);
  const passwordRef = useRef(null);
  const inactivityTimeoutId = useRef(null);
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const storedHash = '1ce24efe439ffa6a3912c514ac1bb16387e3bbdb06d6aebe47cc169442a4ce54';

  useEffect(() => {
    fetch('/data/bio.txt')
      .then(res => res.text())
      .then(data => setBioContent(data))
      .catch(err => console.error("Failed to load bio:", err));
  }, []);
  

  // Focus password input when login modal opens
  useEffect(() => {
    if (showLoginModal && passwordRef.current) {
      passwordRef.current.focus();
    }
  }, [showLoginModal]);

  // Play audio feedback and trigger form glow on login (Exhibit Mode)
  useEffect(() => {
    if (isLoggedIn) {
      setUseMic(true); // Default ON in Exhibit Mode
      // Play audio. Make sure /audio/login.mp3 exists in your public folder.
      const audio = new Audio('/audio/login.mp3');
      audio.play().catch((error) => console.error("Audio play error:", error));

      // Trigger glow effect on form, then clear after 2 seconds.
      setShowGlow(true);
      const glowTimer = setTimeout(() => {
        setShowGlow(false);
      }, 2000);

      return () => clearTimeout(glowTimer);
    } else {
      setUseMic(false); // Default OFF in Audience
    }
  }, [isLoggedIn]);

  // Auto-logout after 5 minutes of inactivity when logged in
  useEffect(() => {
    if (isLoggedIn) {
      const resetInactivityTimer = () => {
        if (inactivityTimeoutId.current) {
          clearTimeout(inactivityTimeoutId.current);
        }
        inactivityTimeoutId.current = setTimeout(() => {
          alert("Session timed out due to inactivity.");
          handleLogout();
        }, 300000); // 300,000 ms = 5 minutes
      };

      // List of events that constitute activity.
      const activityEvents = ['mousemove', 'keypress', 'mousedown', 'touchstart'];
      activityEvents.forEach(event =>
        window.addEventListener(event, resetInactivityTimer)
      );

      // Start the timer immediately.
      resetInactivityTimer();

      return () => {
        activityEvents.forEach(event =>
          window.removeEventListener(event, resetInactivityTimer)
        );
        if (inactivityTimeoutId.current) {
          clearTimeout(inactivityTimeoutId.current);
        }
      };
    }
  }, [isLoggedIn]);

  const handleLogin = async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode(passwordInput.trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (hashHex === storedHash) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setPasswordInput('');
    } else {
      alert('Incorrect password.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPrompt('');
    setResponse('');
  };

  const handleMicToggle = () => {
    const recognition = recognitionRef.current || initializeRecognition();
    if (!recognition) return;
  
    if (!useMic) {
      recognition.start();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setShouldSpeakResponse(true); // Tell the app to speak the reply
        setPrompt(transcript);
        setTimeout(() => handleSubmit(new Event('submit')), 500); // Fake submit
      };
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setUseMic(false);
      };
      recognitionRef.current = recognition;
    } else {
      recognition.stop();
    }
  
    setUseMic(!useMic);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are Scribe, the poetic and thoughtful digital assistant of Bob Baker from Bob Baker Art. You respond briefly and insightfully to questions from exhibit guests, using Bob's background info below. Respond like you're speaking at a gallery opening. Limit responses to **3 sentences or fewer**. Keep it under **400 characters** when possible.\n\n${bioContent}`,
            }
            ,
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('OpenAI error:', errorText);
        setResponse('OpenAI error: ' + errorText);
        return;
      }

      const data = await res.json();
      const reply = data.choices[0].message.content;
      setResponse(reply);
      
      if (shouldSpeakResponse) {
        console.log("🔊 Speaking:", reply);
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
        setShouldSpeakResponse(false);
      }
      
    } catch (err) {
      console.error('Request failed:', err);
      setResponse('Request failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className={`scribe-wrapper ${isLoggedIn ? 'exhibit-bg' : 'audience-bg'}`}>
        <div className="scribe-header">
          <h1 className="scribe-title">Speak with Scribe</h1>

          {!isLoggedIn ? (
            <button className="scribe-mode-toggle" onClick={() => setShowLoginModal(true)}>
              Log On
            </button>
          ) : (
            <button className="scribe-mode-toggle" onClick={handleLogout}>
              Log Off
            </button>
          )}
        </div>

        {showLoginModal && (
          <div className="login-modal">
            <form
              className="login-content"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <h2>Enter Password</h2>
              <input
                type="password"
                ref={passwordRef}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="scribe-input"
              />
              <div className="scribe-button-row">
                <button type="submit" className="scribe-button">Submit</button>
                <button
                  type="button"
                  className="scribe-button"
                  onClick={() => setShowLoginModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <form onSubmit={handleSubmit} className={`scribe-form ${showGlow ? 'glow' : ''}`}>
          <input
            type="text"
            placeholder="Type your question for Scribe..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="scribe-input"
          />
          <div className="scribe-button-row">
  <button type="submit" className="scribe-button" disabled={loading || useMic}>
    {loading ? 'Researching...' : 'Search'}
  </button>

  <button
    type="button"
    className={`scribe-button ${useMic ? 'active' : ''}`}
    onClick={handleMicToggle}
  >
    {useMic ? '🎤 Listening...' : 'Ask'}
  </button>
</div>
        </form>

        {response && (
          <div className="scribe-response">
            <p>{response}</p>
          </div>
        )}

        {/* Exhibit banner appears only when logged in */}
        {isLoggedIn && (
          <div className={`exhibit-banner show`}>
            🎤 Exhibit Mode Active
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
