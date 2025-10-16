// Simple in-memory session storage
interface SessionData {
  email: string;
  answers: Record<string, string>;
  createdAt: number;
}

const sessions = new Map<string, SessionData>();

export function createSession(email: string): string {
  const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  sessions.set(sessionId, {
    email,
    answers: {},
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
