// components/Login.tsx - Login component using the color library
"use client";
import React, { useState } from "react";

import { api, ApiError, type User } from "@/lib/api";
import { setToken } from "@/lib/session";

import { colors } from "@/lib/colors";
import { useDarkMode } from "@/hooks/useDarkMode";
import Button from "./Button";
import Card from "./Card";
import ThemeToggle from "./ThemeToggle";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await api<{ user: User; token: string }>(
        "/auth/login",
        {
          method: "POST",
          body: { email, password },
        },
      );
      setToken(token);
      window.location.href = "/dashboard";
    } catch (err) {
      // El mensaje ya viene en español desde el backend (incluido el de bloqueo 423).
      setError(
        err instanceof ApiError ? err.message : "Ocurrió un error inesperado",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative"
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6">
        <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
      </div>

      <div className="w-full max-w-md">
        <Card variant="default">
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: colors.foregroundColor }}
            >
              Welcome Back
            </h1>
            <p
              className="text-lg"
              style={{ color: colors.foregroundSecondary }}
            >
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: colors.foregroundColor }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.backgroundColor,
                  color: colors.foregroundColor,
                  border: `1px solid ${colors.borderColor}`,
                }}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: colors.foregroundColor }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.backgroundColor,
                  color: colors.foregroundColor,
                  border: `1px solid ${colors.borderColor}`,
                }}
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 rounded"
                  style={{ accentColor: colors.primaryColor }}
                />
                <span
                  className="text-sm"
                  style={{ color: colors.foregroundSecondary }}
                >
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-sm hover:underline"
                style={{ color: colors.primaryColor }}
              >
                Forgot password?
              </a>
            </div>

            {error && (
              <div
                role="alert"
                className="p-3 rounded-md text-sm"
                style={{
                  backgroundColor: colors.colorErrorLight,
                  color: colors.colorError,
                }}
              >
                {error}
              </div>
            )}

            <Button
              variant="primary"
              type="submit"
              className="w-full"
              loading={loading}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: colors.foregroundSecondary }}>
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="hover:underline"
                style={{ color: colors.primaryColor }}
              >
                Sign up
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
