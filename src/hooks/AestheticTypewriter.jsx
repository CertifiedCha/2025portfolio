import React, { useState, useEffect } from 'react';

const AestheticTypewriter = ({ words }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // --- Animation Control Logic (Same as before) ---
  useEffect(() => {
    // Safely access the current word's text
    const currentWord = words[wordIndex]?.text || ''; 
    let timer;

    // Phase 1: Typing
    if (!isDeleting && displayedText.length < currentWord.length) {
      setTypingSpeed(90); 
      timer = setTimeout(() => {
        setDisplayedText(currentWord.substring(0, displayedText.length + 1));
      }, typingSpeed);
    } 
    // Phase 2: Wait
    else if (!isDeleting && displayedText.length === currentWord.length) {
      setTypingSpeed(3500);
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, typingSpeed);
    } 
    // Phase 3: Deleting
    else if (isDeleting && displayedText.length > 0) {
      setTypingSpeed(50); 
      timer = setTimeout(() => {
        setDisplayedText(currentWord.substring(0, displayedText.length - 1));
      }, typingSpeed);
    } 
    // Phase 4: Transition to next word
    else if (isDeleting && displayedText.length === 0) {
      setIsDeleting(false);
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      setTypingSpeed(400); 
      timer = setTimeout(() => { /* Start next word cycle */ }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, wordIndex, words, typingSpeed]);

  // --- Render (Simplified to ONLY show the active text) ---
  return (
    // The original layout classes are preserved on the main container 
    // to keep the visual style in line with the surrounding H1s.
    // The inner wrappers (.slide, .wrapper) are now redundant and removed.
<span className="flex items-center md:gap-3 gap-1 my-0">      {/* The animated text */}
      <span>
        {displayedText}
        {/* Aesthetic Blinking Cursor */}
        <span className={`blinking-cursor ${isDeleting ? 'deleting' : ''}`}>|</span>
      </span>
    </span>
  );
};

export default AestheticTypewriter;