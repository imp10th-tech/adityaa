import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { AdminApp } from '@/components/admin/AdminApp';
import { Lock, Loader2, UserPlus, KeyRound } from 'lucide-react';

export function AdminPage() {
  const { isAuthenticated, loading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [info, setInfo] = useState('');
  const [secretCode, setSecretCode] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-katana-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-katana-crimson" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <AdminApp />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setInfo('');

    if (mode === 'signup') {
      if (secretCode !== '80811') {
        setSubmitting(false);
        setError('Invalid secret code. Access denied, miya.');
        return;
      }
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      setSubmitting(false);
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      if (data.user) {
        setInfo('Account created! You can now sign in.');
        setMode('signin');
      }
      return;
    }

    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError);
    }
  };

  return (
    <div className="min-h-screen bg-katana-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-katana-crimson/10 border border-katana-crimson/30 mb-4">
            <Lock className="w-7 h-7 text-katana-crimson" />
          </div>
          <h1 className="font-display font-700 text-katana-bone text-2xl tracking-wider">
            KATANA ADMIN
          </h1>
          <p className="text-katana-silver/40 text-sm mt-2">
            {mode === 'signin' ? 'Sign in to manage your content, miya' : 'Create a new admin account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-katana-gold/60 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone focus:border-katana-crimson/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-katana-gold/60 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone focus:border-katana-crimson/50 focus:outline-none"
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-katana-gold/60 mb-1">Secret Code</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-katana-silver/30" />
                <input
                  type="password"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone focus:border-katana-crimson/50 focus:outline-none"
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-katana-crimson text-sm bg-katana-crimson/10 border border-katana-crimson/20 rounded px-3 py-2">
              {error}
            </p>
          )}

          {info && (
            <p className="text-katana-gold text-sm bg-katana-gold/10 border border-katana-gold/20 rounded px-3 py-2">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-3 bg-katana-crimson/20 border border-katana-crimson/40 text-katana-crimson rounded font-display uppercase tracking-wider text-sm hover:bg-katana-crimson/30 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Please wait...' : mode === 'signin' ? 'Enter the Darbar' : 'Create Account'}
          </button>

          <div className="text-center pt-2">
            {mode === 'signin' ? (
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); setInfo(''); setSecretCode(''); }}
                className="inline-flex items-center gap-1.5 text-katana-silver/40 hover:text-katana-crimson text-sm transition-colors"
              >
                <UserPlus className="w-4 h-4" /> Need an account? Sign up
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(''); setInfo(''); }}
                className="text-katana-silver/40 hover:text-katana-crimson text-sm transition-colors"
              >
                Already have an account? Sign in
              </button>
            )}
          </div>
        </form>

        <p className="text-center mt-6">
          <a href="/" className="text-katana-silver/30 hover:text-katana-crimson text-sm">← Back to site</a>
        </p>
      </div>
    </div>
  );
}
