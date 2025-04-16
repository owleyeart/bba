///////////////////////////////////////////////////////
// Bob Baker - Bob Baker Art, April 2025             
// Scribe Station Page - Context-Aware Response Popup
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

const IMAGE_COUNT = 42;
const isImageRequest = (text) => {
  return /(show|example|image|photo|pictures?|visual|see)\b/i.test(text);
};

const getRandomImagePath = () => {
  const index = Math.floor(Math.random() * IMAGE_COUNT) + 1;
  const padded = index.toString().padStart(2, '0');
  return `images/scribe-gallery/${padded}.jpg`;
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
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [triggeredImage, setTriggeredImage] = useState(null);


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

  useEffect(() => {
    if (showLoginModal && passwordRef.current) {
      passwordRef.current.focus();
    }
  }, [showLoginModal]);

  useEffect(() => {
    if (isLoggedIn) {
      setUseMic(true);
      const audio = new Audio('/audio/login.mp3');
      audio.play().catch((error) => console.error("Audio play error:", error));

      setShowGlow(true);
      const glowTimer = setTimeout(() => setShowGlow(false), 2000);
      return () => clearTimeout(glowTimer);
    } else {
      setUseMic(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      const resetInactivityTimer = () => {
        if (inactivityTimeoutId.current) clearTimeout(inactivityTimeoutId.current);
        inactivityTimeoutId.current = setTimeout(() => {
          alert("Session timed out due to inactivity.");
          handleLogout();
        }, 300000);
      };

      ['mousemove', 'keypress', 'mousedown', 'touchstart'].forEach(event =>
        window.addEventListener(event, resetInactivityTimer)
      );

      resetInactivityTimer();

      return () => {
        ['mousemove', 'keypress', 'mousedown', 'touchstart'].forEach(event =>
          window.removeEventListener(event, resetInactivityTimer)
        );
        if (inactivityTimeoutId.current) clearTimeout(inactivityTimeoutId.current);
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
        setShouldSpeakResponse(true);
        setPrompt(transcript);
        setTimeout(() => handleSubmit(new Event('submit')), 500);
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
    setTriggeredImage(null); // Reset any previous image
    setShowLightbox(false);
  
    const userRequestedImage = isImageRequest(prompt);
  
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
            },
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
  
      // 🎯 Trigger image *only* if user clearly asked for one
      if (userRequestedImage) {
        const randomIndex = Math.floor(Math.random() * IMAGE_COUNT);
        setCurrentImageIndex(randomIndex);
        setTriggeredImage(`images/scribe-gallery/${(randomIndex + 1).toString().padStart(2, '0')}.jpg`);
      }
  
      // 🗣 Optional speech output
      if (shouldSpeakResponse) {
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
        setShouldSpeakResponse(false);
      }
  
      // 💫 Auto-scroll to results
      setTimeout(() => {
        const responseEl = document.querySelector('.scribe-response');
        if (responseEl) {
          const yOffset = -40;
          const y = responseEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
      
    } catch (err) {
      console.error('Request failed:', err);
      setResponse('Request failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>

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
            <form className="login-content" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
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
                <button type="button" className="scribe-button" onClick={() => setShowLoginModal(false)}>Cancel</button>
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
  <>
    <div className="scribe-response">
      <p>{response}</p>
    </div>

    {triggeredImage && (
      <div className="info-popup">
        <p>
          <strong>Learn More:</strong>{' '}
          <a href="/observed" target="_blank" rel="noopener noreferrer">
            Observed Light Exhibit →
          </a>
        </p>
        <img
          src={triggeredImage}
          alt="Example artwork"
          className="popup-thumbnail"
          onClick={() => setShowLightbox(true)}
        />
      </div>
    )}

    {showLightbox && (
      <div className="lightbox-overlay" onClick={() => setShowLightbox(false)}>
        <button className="lightbox-close" onClick={() => setShowLightbox(false)}>✖</button>
        <img
          src={`images/scribe-gallery/${(currentImageIndex + 1).toString().padStart(2, '0')}.jpg`}
          className="lightbox-image"
          alt={`Slide ${currentImageIndex + 1}`}
        />
        <button className="lightbox-arrow left" onClick={(e) => {
          e.stopPropagation();
          setCurrentImageIndex((prev) => (prev - 1 + IMAGE_COUNT) % IMAGE_COUNT);
        }}>←</button>
        <button className="lightbox-arrow right" onClick={(e) => {
          e.stopPropagation();
          setCurrentImageIndex((prev) => (prev + 1) % IMAGE_COUNT);
        }}>→</button>
      </div>
    )}
  </>
)}


        {isLoggedIn && (
          <div className="exhibit-banner show">
            🎤 Exhibit Mode Active
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
