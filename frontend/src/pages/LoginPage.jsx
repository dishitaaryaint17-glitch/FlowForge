import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getFriendlyErrorMessage } from '../utils/errorMessages';
import { USER_ROLES } from '../utils/constants';

const roleOptions = [
  { label: 'Admin', value: USER_ROLES.ADMIN, hint: 'Management access' },
  { label: 'Member', value: USER_ROLES.MEMBER, hint: 'Personal workspace' },
];

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [selectedRole, setSelectedRole] = useState(USER_ROLES.MEMBER);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onChange = (key) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) nextErrors.email = 'Email is required';
    if (!form.password.trim()) nextErrors.password = 'Password is required';

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const user = await login(form);
      if (user.role !== selectedRole) {
        throw new Error(`Those credentials belong to a ${user.role} account.`);
      }

      toast({
        title: 'Signed in',
        description: `${user.name} is now in the ${user.role} workspace.`,
        variant: 'success',
      });

      navigate(user.role === 'admin' ? '/admin' : '/member', { replace: true });
    } catch (err) {
      const message = getFriendlyErrorMessage(err, 'Unable to sign in');

      if (message === 'Incorrect password') {
        setFieldErrors((current) => ({ ...current, password: message }));
        return;
      }

      if (message === 'User not found') {
        setFieldErrors((current) => ({ ...current, email: message }));
        return;
      }

      setError(message);
      toast({
        title: 'Login failed',
        description: message,
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Task management workspace"
      title="Sign in"
      subtitle="Use your admin or member credentials to enter the workspace."
    >
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Workspace role</p>
          <div className="grid grid-cols-2 gap-2 rounded-[1.5rem] border border-white/10 bg-white/5 p-1">
            {roleOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedRole(option.value)}
                className={`rounded-[1.2rem] px-4 py-3 text-left transition ${selectedRole === option.value
                  ? 'bg-cyan-400/15 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.18)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
              >
                <div className="text-sm font-semibold">{option.label}</div>
                <div className="mt-1 text-xs text-slate-400">{option.hint}</div>
              </button>
            ))}
          </div>
        </div>

        <Input label="Email address" type="email" value={form.email} onChange={onChange('email')} error={fieldErrors.email} invalid={Boolean(fieldErrors.email)} />
        <Input label="Password" type="password" value={form.password} onChange={onChange('password')} error={fieldErrors.password} invalid={Boolean(fieldErrors.password)} />

        {error && <p className="text-sm text-rose-300">{error}</p>}

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Continue'}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
        <span>Role selected: <span className="text-slate-100 capitalize">{selectedRole}</span></span>
        <Link to="/signup" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
          Create account
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
