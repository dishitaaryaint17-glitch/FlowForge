import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getFriendlyErrorMessage } from '../utils/errorMessages';

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onChange = (key) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Name is required';
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
      const user = await signup(form);
      toast({
        title: 'Account created',
        description: `${user.name} is ready in the ${user.role} workspace.`,
        variant: 'success',
      });
      navigate(user.role === 'admin' ? '/admin' : '/member', { replace: true });
    } catch (err) {
      const message = getFriendlyErrorMessage(err, 'Unable to create account');
      setError(message);
      toast({ title: 'Signup failed', description: message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout eyebrow="Task management workspace" title="Create account" subtitle="Set up your workspace and invite the right team.">
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <Input label="Full Name" value={form.name} onChange={onChange('name')} error={fieldErrors.name} invalid={Boolean(fieldErrors.name)} />
        <Input label="Email" type="email" value={form.email} onChange={onChange('email')} error={fieldErrors.email} invalid={Boolean(fieldErrors.email)} />
        <Input label="Password" type="password" value={form.password} onChange={onChange('password')} error={fieldErrors.password} invalid={Boolean(fieldErrors.password)} />

        {error && <p className="text-sm text-rose-300">{error}</p>}

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-400">
        Already have an account? <Link to="/login" className="font-semibold text-cyan-300">Login</Link>
      </p>
    </AuthLayout>
  );
};

export default SignupPage;
