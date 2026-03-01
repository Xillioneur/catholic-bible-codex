"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export interface AudioOptions {
  onEnd?: () => void;
  rate?: number;
}

export function useBibleAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, _setRate] = useState(1.0);
  const [currentReference, setCurrentReference] = useState("");
  const [currentText, setCurrentText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  
  // Refs to prevent stale closures in speech events
  const rateRef = useRef(1.0);
  const onEndRef = useRef<(() => void) | null>(null);
  const currentTextRef = useRef("");
  const charIndexRef = useRef(0);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Sync refs with state
  useEffect(() => { rateRef.current = rate; }, [rate]);
  useEffect(() => { currentTextRef.current = currentText; }, [currentText]);
  useEffect(() => { charIndexRef.current = charIndex; }, [charIndex]);

  const selectVoice = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return;

    voiceRef.current = voices.find(v => 
      v.name.includes("Enhanced") || 
      v.name.includes("Natural") || 
      v.name.includes("Google") ||
      v.name.includes("Premium")
    ) ?? voices[0] ?? null;
  }, []);

  useEffect(() => {
    selectVoice();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = selectVoice;
    }
  }, [selectVoice]);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setCurrentReference("");
    setCurrentText("");
    setCharIndex(0);
    onEndRef.current = null;
  }, [stop]);

  const speak = useCallback((text: string, reference: string, options?: AudioOptions) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    
    setCurrentReference(reference);
    setCurrentText(text);
    onEndRef.current = options?.onEnd ?? null;

    const utterance = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) utterance.voice = voiceRef.current;
    
    // Use the explicit rate option or the persistent ref
    const finalRate = options?.rate ?? rateRef.current;
    utterance.rate = Math.max(0.25, Math.min(2.0, finalRate));
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onboundary = (event) => {
      if (event.name === 'word') setCharIndex(event.charIndex);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      if (onEndRef.current) {
        const callback = onEndRef.current;
        // Delay to ensure state settles before next verse starts
        setTimeout(() => callback(), 50);
      }
    };

    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  }, []); // speak is now stable

  const setRate = useCallback((newRate: number) => {
    const clampedRate = Math.max(0.25, Math.min(2.0, newRate));
    _setRate(clampedRate);
    
    if (isPlaying && currentTextRef.current) {
      // Re-speak from current position to apply rate change mid-verse
      const remainingText = currentTextRef.current.slice(charIndexRef.current);
      speak(remainingText, currentReference, { 
        rate: clampedRate, 
        onEnd: onEndRef.current ?? undefined 
      });
    }
  }, [isPlaying, currentReference, speak]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    isPlaying,
    rate,
    currentReference,
    charIndex,
    speak,
    stop,
    reset,
    setRate
  };
}
