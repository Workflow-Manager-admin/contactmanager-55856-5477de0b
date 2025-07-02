import React, { useState, useEffect } from 'react';
import './App.css';

// Backend API base URL; assumes backend served at localhost:3001 or proxy is set up
const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

const COLORS = {
  primary: '#1976D2',
  secondary: '#FFC107',
  accent: '#388E3C'
};

// PUBLIC_INTERFACE
function App() {
  // Contact state
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [theme, setTheme] = useState('light');

  // Fetch contacts once on mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Set CSS variables for theme and accent
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // Set color palette
    document.documentElement.style.setProperty('--kavia-primary', COLORS.primary);
    document.documentElement.style.setProperty('--kavia-secondary', COLORS.secondary);
    document.documentElement.style.setProperty('--kavia-accent', COLORS.accent);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // PUBLIC_INTERFACE
  async function fetchContacts() {
    setLoading(true);
    setErr('');
    try {
      const res = await fetch(`${API_BASE}/contacts`);
      if (!res.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await res.json();
      setContacts(data.contacts || data);
    } catch (e) {
      setErr('Error loading contacts');
    }
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  async function handleAddContact(e) {
    e.preventDefault();
    setErr('');
    setSuccess('');
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErr('All fields are required.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErr('Please enter a valid email address.');
      return;
    }
    // Optionally validate phone format
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim() })
      });
      if (!res.ok) {
        throw new Error('Failed to add contact');
      }
      setName('');
      setEmail('');
      setPhone('');
      setSuccess('Contact added.');
      fetchContacts();
    } catch (e) {
      setErr('Error adding contact');
    }
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  async function handleDeleteContact(id) {
    setLoading(true);
    setErr('');
    setSuccess('');
    try {
      const res = await fetch(`${API_BASE}/contacts/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error('Failed to delete contact');
      setSuccess('Contact deleted.');
      fetchContacts();
    } catch (e) {
      setErr('Error deleting contact');
    }
    setLoading(false);
  }

  return (
    <div className="App" style={{ background: 'var(--bg-primary)', minHeight: "100vh" }}>
      <header className="App-header" style={{ background: 'var(--bg-secondary)', minHeight: "unset", padding: "1.5rem 1rem 2rem 1rem", alignItems: "stretch" }}>
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <div>
          <h1 style={{ color: "var(--kavia-primary)", fontWeight: 700, margin: "12px 0 0 0", fontSize: "2.2rem" }}>
            Contact Manager
          </h1>
          <p style={{ color: "var(--text-secondary)", margin: "0 0 20px 0", fontWeight: 400, fontSize: "1.1rem" }}>
            Add, view, and manage your contacts easily.
          </p>
        </div>
        <section className="container" style={{ margin: "0 auto", maxWidth: 480, width: "100%", background: "var(--bg-primary)", padding: "18px 22px 18px 22px", borderRadius: 14, boxShadow: "0 2px 14px 0 rgba(40, 44, 52,0.13)", border: "1px solid var(--border-color)", marginBottom: 30 }}>
          <form onSubmit={handleAddContact} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                type="text"
                placeholder="Name"
                aria-label="Name"
                style={inputStyle}
                maxLength={64}
                required
              />
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                aria-label="Email"
                style={inputStyle}
                maxLength={80}
                required
              />
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                type="text"
                placeholder="Phone"
                aria-label="Phone"
                style={inputStyle}
                maxLength={30}
                required
              />
            </div>
            <button
              className="btn"
              type="submit"
              disabled={loading}
              style={{
                ...buttonStyle,
                background: COLORS.primary,
                color: "#fff"
              }}
            >
              {loading ? "Processing..." : "Add Contact"}
            </button>
          </form>
          {(err || success) && (
            <div style={{ marginTop: 8, fontSize: 14, color: err ? '#d32f2f' : COLORS.accent }}>
              {err || success}
            </div>
          )}
        </section>
        <section className="container" style={{ margin: "0 auto", maxWidth: 480, width: "100%", background: "var(--bg-primary)", padding: "10px 20px 10px 20px", borderRadius: 14, border: "1px solid var(--border-color)", boxShadow: "0 1px 8px 0 rgba(40,44,52,0.09)" }}>
          <h2 style={{ fontSize: "1.5rem", margin: "0 0 14px 0", color: "var(--kavia-primary)" }}>Saved Contacts</h2>
          {loading && contacts.length === 0 && (
            <div style={{ textAlign: 'center', color: "var(--kavia-primary)", padding: 8 }}>Loading...</div>
          )}
          {contacts.length === 0 && !loading && (
            <div style={{ color: "var(--text-secondary)", padding: "10px 4px" }}>No contacts yet.</div>
          )}
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {contacts.map(c => (
              <li
                key={c.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "var(--bg-secondary)",
                  padding: "12px 10px",
                  marginBottom: 9,
                  borderRadius: 8,
                  border: "1px solid var(--border-color)",
                  boxShadow: "0 1px 2px rgba(40, 44, 52,0.05)"
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span style={{ fontWeight: 600, fontSize: "1.07rem", color: "var(--text-primary)" }}>{c.name}</span>
                  <span style={{ color: "var(--kavia-primary)", fontSize: "0.98rem", marginTop: 2 }}>{c.email}</span>
                  <span style={{ color: "var(--kavia-secondary)", fontSize: "0.98rem", marginTop: 2 }}>{c.phone}</span>
                </div>
                <button
                  className="btn"
                  style={{ ...buttonStyle, background: COLORS.secondary, color: "#212121", padding: "5px 14px", minWidth: 0, marginLeft: 16, border: 'none' }}
                  onClick={() => handleDeleteContact(c.id)}
                  aria-label={`Delete contact ${c.name}`}
                  disabled={loading}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>
        <footer style={{ margin: "30px auto 5px auto", fontSize: "0.97rem", color: "var(--text-secondary)" }}>
          &copy; {new Date().getFullYear()} Contact Manager
        </footer>
      </header>
    </div>
  );
}

// Style objects for quick inline use (minimalistic)
const inputStyle = {
  flex: 1,
  fontSize: "1rem",
  padding: "10px 8px",
  borderRadius: "6px",
  border: "1px solid var(--border-color)",
  background: "var(--bg-secondary)",
  color: "var(--text-primary)",
  fontWeight: 400,
  outline: "none"
};

const buttonStyle = {
  display: "inline-block",
  padding: "10px 28px",
  borderRadius: 7,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "1.08rem",
  background: "var(--kavia-primary)",
  color: "#fff",
  transition: "background 0.13s, box-shadow 0.13s",
  boxShadow: "0 1px 5px rgba(25, 118, 210,0.10)"
};

export default App;
