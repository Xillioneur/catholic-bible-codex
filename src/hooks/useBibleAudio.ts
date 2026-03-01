"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export interface AudioOptions {
  onEnd?: () => void;
  rate?: number;
}

export function useBibleAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(0.95);
  const [currentReference, setCurrentReference] = useState("");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const onEndRef = useRef<(() => void) | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Stabilize voice selection
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
      setCurrentReference("");
    }
  }, []);

  const speak = useCallback((text: string, reference: string, options?: AudioOptions) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    stop();
    setCurrentReference(reference);
    onEndRef.current = options?.onEnd ?? null;

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    if (voiceRef.current) utterance.voice = voiceRef.current;
    
    utterance.rate = options?.rate ?? rate;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      // Small delay before calling next to ensure clean transition
      setTimeout(() => {
        if (onEndRef.current) {
          onEndRef.current();
        } else {
          setCurrentReference("");
        }
      }, 50);
    };
    utterance.onerror = (e) => {
      console.error("Speech Error:", e);
      setIsPlaying(false);
      setCurrentReference("");
    };

    window.speechSynthesis.speak(utterance);
  }, [stop, rate]);

  const changeRate = (newRate: number) => {
    setRate(newRate);
    if (isPlaying && utteranceRef.current) {
      utteranceRef.current.rate = newRate;
    }
  };

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return {
    isPlaying,
    rate,
    currentReference,
    speak,
    stop,
    setRate: changeRate
  };
}
