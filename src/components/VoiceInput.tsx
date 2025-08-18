"use client";
import { useState, useRef } from "react";

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export default function VoiceInput({ value, onChange, placeholder = "Enter clinical notes...", rows = 6 }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    setIsListening(true);
    
    // @ts-expect-error - WebkitSpeechRecognition is not in the types
    const recognition = new window.webkitSpeechRecognition() as SpeechRecognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Voice recognition started');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
        onChange(value + ' ' + finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleMode = () => {
    setIsVoiceMode(!isVoiceMode);
  };

  return (
    <div className="space-y-4">
      {isVoiceMode ? (
        <div className="text-center">
          <div className="relative inline-block">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-200 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 shadow-lg scale-105' 
                  : 'bg-primary-500 hover:bg-primary-600 shadow-md hover:shadow-lg'
              }`}
            >
              <svg 
                className={`w-10 h-10 sm:w-12 sm:h-12 text-white ${isListening ? 'animate-pulse' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isListening ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                )}
              </svg>
            </button>
            {isListening && (
              <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full animate-ping"></div>
            )}
          </div>
          <p className="text-base sm:text-lg text-neutral-600 mt-2 sm:mt-3 font-medium">
            {isListening ? "Listening... Click to stop" : "Tap to dictate text"}
          </p>
          <button
            onClick={toggleMode}
            className="text-sm text-primary-600 hover:text-primary-700 underline mt-2"
          >
            Or type instead
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            className="input-field resize-none"
            rows={rows}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <button
            onClick={toggleMode}
            className="text-sm text-primary-600 hover:text-primary-700 underline"
          >
            Or use voice input instead
          </button>
        </div>
      )}
    </div>
  );
}

