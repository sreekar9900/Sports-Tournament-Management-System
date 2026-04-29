import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import getErrorMessage from "../utils/getErrorMessage";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
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
      const user = await login(form);
      navigate(user.role === "admin" ? "/admin" : user.role === "manager" ? "/manager" : "/tournaments");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full max-w-5xl mx-auto overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative z-10">
      
      {/* Decorative Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 p-12 flex-col justify-between overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-rose-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/30 mb-8">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
            Accelerate your<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">gameplay.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-sm">
            Sign in to your STMS account to manage fixtures, view leaderboards, and coordinate your tournament operations.
          </p>
        </div>
        
        <div className="relative z-10 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
           <p className="text-slate-300 text-sm font-medium italic">"The definitive tool for modern sports management. Absolutely frictionless."</p>
        </div>
      </div>

      {/* Form Right Side */}
      <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-slate-900">
        <div className="max-w-sm w-full mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-400 mb-8">Enter your credentials to access your dashboard.</p>
          
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-300">Email Address</span>
              <input 
                name="email" 
                type="email" 
                className="!bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 !text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors shadow-inner"
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
                className="!bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 !text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors shadow-inner"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>
            {error ? <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">{error}</div> : null}
            <button 
              className="mt-2 w-full flex items-center justify-center py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:opacity-90 shadow-lg shadow-rose-600/20 transition-all hover:scale-[1.02]" 
              disabled={submitting} 
              type="submit"
            >
              {submitting ? (
                 <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Signing in...
                 </span>
              ) : "Sign in to Dashboard"}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-slate-400">
             Don't have an account? <Link to="/register" className="font-semibold text-rose-400 hover:text-rose-300 transition-colors">Create one now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
