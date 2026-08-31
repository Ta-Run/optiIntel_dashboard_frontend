import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Shield, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getDemoUsers } from '../../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoUsers, setDemoUsers] = useState([]);
  const [demoPasswordHint, setDemoPasswordHint] = useState('Password123!');

  useEffect(() => {
    getDemoUsers()
      .then((users) => {
        setDemoUsers(users);
        if (users[0]?.passwordHint) {
          setDemoPasswordHint(users[0].passwordHint);
        }
      })
      .catch(() => {
        setDemoUsers([]);
      });
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        addToast('Signed in successfully');
      } else {
        await register({ email, password, name });
        addToast('Account created — you are now signed in');
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      addToast(err.message || (mode === 'login' ? 'Sign in failed' : 'Registration failed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoUser = (demoUser) => {
    setEmail(demoUser.email);
    setPassword(demoUser.passwordHint || demoPasswordHint);
    setMode('login');
  };

  return (
    <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-600 mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {mode === 'login' ? 'Sign in to optIntel' : 'Create an account'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Operations Intelligence Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Full name
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Jane Doe"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Password123!"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {loading
              ? mode === 'login'
                ? 'Signing in...'
                : 'Creating account...'
              : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-center text-slate-600 mt-4">
          {mode === 'login' ? (
            <>
              Need an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-brand-600 font-medium hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-brand-600 font-medium hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>

        {demoUsers.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-medium text-slate-500 text-center mb-2">
              Demo accounts (password: {demoPasswordHint})
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {demoUsers.map((demoUser) => (
                <button
                  key={demoUser.email}
                  type="button"
                  onClick={() => fillDemoUser(demoUser)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-brand-400 hover:text-brand-700 transition-colors"
                  title={`${demoUser.name} — ${demoUser.role}`}
                >
                  {demoUser.role}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
