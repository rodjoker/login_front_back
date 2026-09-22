// app/register/page.tsx - Página de registro conectada al backend.
'use client';
import React, { useState } from 'react';
import { colors } from '@/lib/colors';
import { api, ApiError, type User } from '@/lib/api';
import { setToken } from '@/lib/session';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await api<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: { name, email, password },
      });
      setToken(token);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: colors.backgroundColor,
    color: colors.foregroundColor,
    border: `1px solid ${colors.borderColor}`,
  };
  const inputClass = 'w-full px-3 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      <div className="w-full max-w-md">
        <Card variant="default">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: colors.foregroundColor }}>
              Create account
            </h1>
            <p style={{ color: colors.foregroundSecondary }}>Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: colors.foregroundColor }}>
                Name
              </label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                required minLength={2} className={inputClass} style={inputStyle} placeholder="Your name" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: colors.foregroundColor }}>
                Email Address
              </label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required className={inputClass} style={inputStyle} placeholder="Enter your email" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: colors.foregroundColor }}>
                Password (min. 8 characters)
              </label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required minLength={8} className={inputClass} style={inputStyle} placeholder="Enter your password" />
            </div>

            {error && (
              <div role="alert" className="p-3 rounded-md text-sm"
                style={{ backgroundColor: colors.colorErrorLight, color: colors.colorError }}>
                {error}
              </div>
            )}

            <Button variant="primary" type="submit" className="w-full" loading={loading}>
              Create account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: colors.foregroundSecondary }}>
              Already have an account?{' '}
              <Link href="/" className="hover:underline" style={{ color: colors.primaryColor }}>
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}