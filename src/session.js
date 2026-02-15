/**
 * USSD Session Manager
 * Tracks session state, history, and user data per session (phone number).
 */

const SESSION_TTL_MS = 5 * 60 * 1000; // 5 minutes

export class Session {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.state = 'WELCOME';
    this.history = [];
    this.data = {}; // e.g. { department, date, time, name, phone }
    this.createdAt = Date.now();
  }

  isExpired() {
    return Date.now() - this.createdAt > SESSION_TTL_MS;
  }

  setState(state) {
    this.state = state;
  }

  getState() {
    return this.state;
  }

  setData(key, value) {
    this.data[key] = value;
  }

  getData(key) {
    return this.data[key];
  }

  pushHistory(state) {
    this.history.push(state);
  }

  popHistory() {
    return this.history.pop();
  }

  getPreviousState() {
    return this.history.length > 0 ? this.history[this.history.length - 1] : null;
  }

  goBack() {
    if (this.history.length > 0) {
      this.history.pop();
      this.state = this.history.length > 0 ? this.history[this.history.length - 1] : 'WELCOME';
      return true;
    }
    return false;
  }

  clearBookingData() {
    this.data = {};
  }

  toJSON() {
    return {
      sessionId: this.sessionId,
      state: this.state,
      data: { ...this.data },
      history: [...this.history],
    };
  }
}

const sessions = new Map();

export function getOrCreateSession(sessionId) {
  let session = sessions.get(sessionId);
  if (session && session.isExpired()) {
    sessions.delete(sessionId);
    session = null;
  }
  if (!session) {
    session = new Session(sessionId);
    sessions.set(sessionId, session);
  }
  return session;
}

export function getSession(sessionId) {
  return sessions.get(sessionId);
}

export function deleteSession(sessionId) {
  sessions.delete(sessionId);
}
