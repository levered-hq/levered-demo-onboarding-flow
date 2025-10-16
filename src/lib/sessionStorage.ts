import { v4 as uuidv4 } from 'uuid';
import { LeadUpdateDto } from '@/types/leadTypes';

// Simple in-memory session storage
interface SessionData {
  email: string;
  answers: Record<string, string>;
  leadData: Partial<LeadUpdateDto>;
  progressInfo?: {
    stepNumber: number;
    totalSteps: number;
  };
  createdAt: number;
}

const sessions = new Map<string, SessionData>();

export function createSession(email: string): string {
  const sessionId = uuidv4(); // Use proper UUID
  sessions.set(sessionId, {
    email,
    answers: {},
    leadData: {},
    createdAt: Date.now(),
  });
  return sessionId;
}

export function getSession(sessionId: string): SessionData | null {
  return sessions.get(sessionId) || null;
}

export function updateSessionAnswer(sessionId: string, step: string, answer: string): void {
  const session = sessions.get(sessionId);
  if (session) {
    session.answers[step] = answer;
  }
}

export function getSessionAnswers(sessionId: string): Record<string, string> {
  const session = sessions.get(sessionId);
  return session?.answers || {};
}

export function getLeadData(sessionId: string): Partial<LeadUpdateDto> {
  const session = sessions.get(sessionId);
  return session?.leadData || {};
}

export function updateLeadData(sessionId: string, data: Partial<LeadUpdateDto>): void {
  const session = sessions.get(sessionId);
  if (session) {
    session.leadData = { ...session.leadData, ...data };
  }
}

export function storeProgressInfo(sessionId: string, stepNumber: number, totalSteps: number): void {
  const session = sessions.get(sessionId);
  if (session) {
    session.progressInfo = { stepNumber, totalSteps };
  }
}

export function getProgressInfo(sessionId: string): { stepNumber: number; totalSteps: number } | null {
  const session = sessions.get(sessionId);
  return session?.progressInfo || null;
}
