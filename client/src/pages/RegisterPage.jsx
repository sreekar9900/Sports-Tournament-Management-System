import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import getErrorMessage from "../utils/getErrorMessage";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "spectator"
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin" : user.role === "manager" ? "/manager" : "/tournaments");
    }
  }, [user, navigate]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const user = await register(form);
      navigate(user.role === "admin" ? "/admin" : user.role === "manager" ? "/manager" : "/tournaments");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full max-w-5xl mx-auto overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative z-10 flex-row-reverse">

      {/* Decorative Right Side for Register */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 p-12 flex-col justify-between overflow-hidden">
        <div className="absolute top-[-20%] right-[-20%] w-[300px] h-[300px] bg-amber-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[120px]"></div>

        <div className="relative z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-500/30 mb-8">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
            Join the<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">Revolution.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-sm">
            Whether you are competing, organizing logic, or managing an entire franchise, STMS is built for you.
          </p>
        </div>
      </div>

      {/* Form Left Side */}
      <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-slate-900 border-r border-slate-800">
        <div className="max-w-sm w-full mx-auto flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400 mb-8 w-full">Set up your profile to join professional tournaments.</p>

          <form className="flex flex-col gap-4 w-full text-left" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-300">Full Name</span>
              <input
                name="name"
                type="text"
                className="!bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 !text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors shadow-inner"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-300">Email Address</span>
              <input
                name="email"
                type="email"
                className="!bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 !text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors shadow-inner"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-300">Password</span>
              <input
                name="password"
                type="password"
                className="!bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 !text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors shadow-inner"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            <label className="flex flex-col gap-2 relative">
              <span className="text-sm font-semibold text-slate-300">Account Type</span>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                style={{ colorScheme: 'dark' }}
                className="appearance-none !bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 !text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors cursor-pointer shadow-inner"
              >
                <option value="spectator">Spectator / Player</option>
                <option value="manager">Team Manager</option>
                <option value="admin">Administrator</option>
              </select>
              <div className="absolute right-4 bottom-[0.8rem] pointer-events-none text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </label>

            {error ? <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm mt-2">{error}</div> : null}

            <button
              className="mt-4 w-full flex items-center justify-center py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-rose-600 hover:opacity-90 shadow-lg shadow-amber-600/20 transition-all hover:scale-[1.02]"
              disabled={submitting}
              type="submit"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Creating account...
                </span>
              ) : "Sign Up"}
            </button>
          </form>

          <p className="mt-8 text-center w-full text-sm text-slate-400">
            Already have an account? <Link to="/login" className="font-semibold text-amber-400 hover:text-amber-300 transition-colors">Log in back</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
