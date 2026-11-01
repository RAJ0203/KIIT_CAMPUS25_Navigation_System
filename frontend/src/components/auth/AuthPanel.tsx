
"use client";

import { useState } from "react";
import {
  loginUser,
  registerUser,
  type AuthUser,
} from "@/lib/api";

interface AuthPanelProps {
  onLogin: (token: string, user: AuthUser) => void;
}

export default function AuthPanel({ onLogin }: AuthPanelProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (username.trim().length < 3) {
      setError("Username must contain at least 3 characters.");
      return;
    }

    if (mode === "register" && password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        await registerUser(username.trim(), password);
      }

      const result = await loginUser(username.trim(), password);
      onLogin(result.access_token, result.user);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Authentication failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">C<span>25</span></span>
          <div>
            <strong>CAMPUS25</strong>
            <small>WAYFINDING SYSTEM</small>
          </div>
        </div>

        <p className="auth-eyebrow">KIIT CAMPUS NAVIGATION</p>

        <h1>{mode === "login" ? "Welcome back." : "Create your account."}</h1>

        <p className="auth-description">
          {mode === "login"
            ? "Sign in to plan your campus journey."
            : "Register to access campus navigation."}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="auth-username">Username</label>
          <input
            id="auth-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            autoComplete="username"
            required
          />

          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login" ? "New to Campus25?" : "Already registered?"}
          {" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </p>
      </section>
    </main>
  );
}