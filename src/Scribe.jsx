///////////////////////////////////////////////////////
// Bob Baker - Bob Baker Art, April 2025             //
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

const isQRPrompt = (text) => {
  return /(qr\s?code|book|observed light|buying prints?|print(s)?)/i.test(text);
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
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [triggeredImage, setTriggeredImage] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const micIsActiveRef = useRef(false);
  const isProcessingRef = useRef(false);
  const shouldSpeakRef = useRef(false);
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
      const delayStart = setTimeout(() => {
        startListening();
      }, 300);
      const audio = new Audio('/audio/login.mp3');
      audio.play().catch((error) => console.error("Audio play error:", error));
      setShowGlow(true);
      const glowTimer = setTimeout(() => setShowGlow(false), 2000);
      return () => {
        clearTimeout(glowTimer);
        clearTimeout(delayStart);
      };
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

  const startListening = () => {
    window.speechSynthesis.cancel(); // ✅ ensures no speech overlaps

    if (isProcessingRef.current || micIsActiveRef.current) return;
  
    if (!recognitionRef.current) {
      const newRecognition = initializeRecognition();
      if (!newRecognition) return;
      recognitionRef.current = newRecognition;
    }
  
    const recognition = recognitionRef.current;
  
    // 🧼 CLEAR PREVIOUS LISTENERS
    recognition.onresult = null;
    recognition.onend = null;
    recognition.onerror = null;
  
    // 🛑 Cancel any ongoing speech
    window.speechSynthesis.cancel();
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      if (!transcript) return;
  
      // ✅ Prevent repeat triggers
      recognition.stop();
      micIsActiveRef.current = false;
      shouldSpeakRef.current = true;
      setPrompt(transcript);
      handleSubmit(null, transcript);
    };
  
    recognition.onend = () => {
      micIsActiveRef.current = false;
      if (isLoggedIn && useMic && !isProcessingRef.current && !isSpeaking) {
        startListening();
      }
    };
  
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      micIsActiveRef.current = false;
  
      if (["not-allowed", "service-not-allowed"].includes(event.error)) {
        setUseMic(false);
      }
  
      if (event.error === 'no-speech' && isLoggedIn && useMic) {
        setTimeout(() => startListening(), 1000);
      }
    };
  
    try {
      recognition.start();
      micIsActiveRef.current = true;
      setUseMic(true);
    } catch (err) {
      console.error('Mic start error:', err.message);
    }
  };
  

  const handleMicToggle = () => {
    const recognition = recognitionRef.current;
    if (!useMic) {
      startListening();
    } else {
      recognition?.stop();
      window.speechSynthesis.cancel();
      micIsActiveRef.current = false;
      setUseMic(false);
    }
  };

  const handleStopSpeaking = () => {
    window.speechSynthesis.cancel();
    shouldSpeakRef.current = false;
    setIsSpeaking(false);
    isProcessingRef.current = false;
    micIsActiveRef.current = false;
    setUseMic(true);
    setTimeout(() => startListening(), 400);
  };

  const resetAndListen = () => {
    setPrompt('');
    setResponse('');
    setTriggeredImage(null);
    setShowLightbox(false);
    isProcessingRef.current = false;
    setUseMic(true);
    startListening();
  };

  const handleSubmit = async (e, submittedPrompt = prompt) => {
    if (isProcessingRef.current) return; // ✅ Prevent multiple calls
    if (e?.preventDefault) e.preventDefault();
    isProcessingRef.current = true;

    if (!submittedPrompt || submittedPrompt.trim().length === 0) {
      setResponse("I didn’t catch that — could you try again?");
      setLoading(false);
      isProcessingRef.current = false;
      return;
    }

    
    const recognition = recognitionRef.current;
    if (recognition) recognition.stop();
    setUseMic(false);
    setLoading(true);
    setResponse('');
    setTriggeredImage(null);
    setShowLightbox(false);

    const safePrompt = submittedPrompt?.trim() || prompt.trim();
    const userRequestedImage = isImageRequest(safePrompt);
    const userRequestedQR = isQRPrompt(safePrompt);

    const systemPrompt = isLoggedIn
      ? `You are Scribe, a collaborative assistant for Bob Baker and Kacie. Use the following background and past experience to guide your responses and keep the responses under six sentences or less than 1000 characters:\n\n${bioContent}`
      : `You are Scribe, the poetic and thoughtful digital assistant of Bob Baker from Bob Baker Art. You respond briefly and insightfully to questions from exhibit guests, using the context below. Respond like you're speaking at a gallery opening. Limit responses to **3 sentences or fewer**. Keep it under **400 characters**.\n\n${bioContent}`;

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
            { role: 'system', content: systemPrompt },
            { role: 'user', content: submittedPrompt },
          ],
          temperature: 0.84,
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
      let finalReply = reply;

      if (userRequestedImage) {
        finalReply = '';
      }

      setResponse(finalReply);

      if (userRequestedQR) {
        setTriggeredImage('/images/qr-code.png');
        setShowLightbox(true);
      
        const qrMessage = "Here’s the QR code for Bob’s book and prints.";
        const utterance = new SpeechSynthesisUtterance(qrMessage);
      
        utterance.rate = 1.2;
        utterance.pitch = 1.1;
        utterance.volume = 0.95;
        utterance.lang = 'en-US';
      
        const attemptVoiceAssignment = () => {
          const voices = speechSynthesis.getVoices();
      
          const aria = voices.find(v => v.name.includes('Aria') && v.lang === 'en-US');
            if (aria) {
              utterance.voice = aria;
            } else {
              console.warn("⚠️ Aria not found. Using default voice.");
            }

            window.speechSynthesis.cancel(); // stop any previous speech

          speechSynthesis.speak(utterance);
        };
      
        // Always give the voice list a moment to populate
        setTimeout(() => {
          if (speechSynthesis.getVoices().length > 0) {
            attemptVoiceAssignment();
          } else {
            speechSynthesis.onvoiceschanged = attemptVoiceAssignment;
          }
        }, 200); // 👈 wait 200ms for voices to populate
      
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          micIsActiveRef.current = false;
          setUseMic(true);
          setTimeout(() => startListening(), 800);
        };
      
        shouldSpeakRef.current = false;
        return;
      }
      
      

      if (userRequestedImage) {
        const randomIndex = Math.floor(Math.random() * IMAGE_COUNT);
        const imageFile = (randomIndex + 1).toString().padStart(2, '0');
        const imagePath = `/images/scribe-gallery/${imageFile}.jpg`;
      
        setCurrentImageIndex(randomIndex);
        setTriggeredImage(imagePath);
      }
      
      

      if (shouldSpeakRef.current && finalReply) {
        const utterance = new SpeechSynthesisUtterance(finalReply);
        utterance.rate = 1.2;
        utterance.pitch = 1.1;
        utterance.volume = 0.95;
        utterance.lang = 'en-US';
      
        const attemptVoiceAssignment = () => {
          const voices = speechSynthesis.getVoices();
          const aria = voices.find(v => v.name.includes('Aria') && v.lang === 'en-US');
          if (aria) {
            utterance.voice = aria;
          } else {
          }
          window.speechSynthesis.cancel(); // stop any previous speech

          speechSynthesis.speak(utterance);
        };
      
        if (speechSynthesis.getVoices().length > 0) {
          attemptVoiceAssignment();
        } else {
          speechSynthesis.onvoiceschanged = attemptVoiceAssignment;
        }
      
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          resetAndListen();
        };
      
        shouldSpeakRef.current = false;
      }
      
    } catch (err) {
      console.error('Request failed:', err);
      setResponse('Request failed. Check console for details.');
      isProcessingRef.current = false;
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
              className={`scribe-button ${useMic || isSpeaking ? 'active' : ''}`}
              onClick={() => {
                if (isSpeaking) {
                  handleStopSpeaking();
                } else {
                  handleMicToggle();
                }
              }}
            >
              {isSpeaking ? '⛔ Stop' : useMic ? '🎤 Listening...' : 'Ask'}
            </button>

          </div>
        </form>

        {response && (
  <div className="scribe-response">
    <p>{response}</p>
  </div>
)}


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
  onClick={() => {

    setShowLightbox(true);
  }}
/>
  </div>
)}

{showLightbox && (
  <div
  className="lightbox-overlay"
  onClick={(e) => {
    e.stopPropagation();
    setShowLightbox(false);
  
    // Force reset mic states
    micIsActiveRef.current = false;
    isProcessingRef.current = false;
    shouldSpeakRef.current = false;
    setIsSpeaking(false);
    setUseMic(false);
  
    // Restart mic after UI closes
    setTimeout(() => {
      setUseMic(true);
      startListening();
    }, 600);
  }}
>

    <button
  className="lightbox-close"
  onClick={(e) => {
    e.stopPropagation();
    setShowLightbox(false);
  
    // Force reset mic states
    micIsActiveRef.current = false;
    isProcessingRef.current = false;
    shouldSpeakRef.current = false;
    setIsSpeaking(false);
    setUseMic(false);
  
    // Restart mic after UI closes
    setTimeout(() => {
      setUseMic(true);
      startListening();
    }, 600);
  }}
>
  ✖
</button>
    <img
  src={triggeredImage}
  className="lightbox-image"
  alt="Lightbox"
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
