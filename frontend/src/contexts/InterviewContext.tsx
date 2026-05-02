import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface InterviewContextType {
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
  jobFile: File | null;
  setJobFile: (file: File | null) => void;
  role: string;
  setRole: (role: string) => void;
  experience: string;
  setExperience: (exp: string) => void;
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  currentQuestion: string;
  setCurrentQuestion: (q: string) => void;
  currentAudio: string | null;
  setCurrentAudio: (audio: string | null) => void;
  phase: string;
  setPhase: (phase: string) => void;
  scores: number[];
  setScores: (scores: number[]) => void;
  feedbacks: string[];
  setFeedbacks: (feedbacks: string[]) => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider = ({ children }: { children: ReactNode }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobFile, setJobFile] = useState<File | null>(null);
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [phase, setPhase] = useState<string>('intro');
  const [scores, setScores] = useState<number[]>([]);
  const [feedbacks, setFeedbacks] = useState<string[]>([]);

  return (
    <InterviewContext.Provider
      value={{
        resumeFile,
        setResumeFile,
        jobFile,
        setJobFile,
        role,
        setRole,
        experience,
        setExperience,
        sessionId,
        setSessionId,
        currentQuestion,
        setCurrentQuestion,
        currentAudio,
        setCurrentAudio,
        phase,
        setPhase,
        scores,
        setScores,
        feedbacks,
        setFeedbacks
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
