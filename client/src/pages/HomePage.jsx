import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "manager") {
        navigate("/manager");
      } else {
        navigate("/tournaments");
      }
    }
  }, [user, navigate]);

  return (
    <div className="relative w-full overflow-hidden rounded-[2.5rem] bg-slate-950 text-slate-100 shadow-[0_20px_60px_rgba(30,_58,_138,_0.2)] ring-1 ring-white/10">
      
      {/* Dynamic Background Glowing Orbs */}
      <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-rose-600/20 blur-[120px]"></div>
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-amber-500/15 blur-[100px]"></div>
      <div className="pointer-events-none absolute top-[20%] right-[10%] h-[300px] w-[300px] rounded-full bg-fuchsia-500/15 blur-[100px]"></div>

      <div className="relative z-10 px-8 py-20 sm:px-16 lg:py-28 lg:px-24">
        
        {/* Hero Content */}
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
          
          {/* Left / Copy */}
          <div className="flex flex-col justify-center space-y-8 text-center lg:text-left">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl xl:text-7xl">
              Professional <br />
              <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent">
                Tournament Operations
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-400 lg:mx-0">
              Manage registrations, fixtures, results, and standings through a flawlessly unified platform designed for modern organizers, team managers, and fans.
            </p>
            
            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
               <Link 
                  to="/tournaments" 
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-rose-600 px-8 py-4 font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_8px_rgba(244,_63,_94,_0.3)] focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-slate-900"
               >
                  <span className="absolute inset-0 bg-white/20 transition-opacity opacity-0 group-hover:opacity-100"></span>
                  <span className="relative">View Tournaments</span>
               </Link>
               
               {!user && (
                 <Link 
                    to="/register" 
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:shadow-lg focus:outline-none"
                 >
                    Create Account
                 </Link>
               )}
            </div>
          </div>

          {/* Right / Showcase Cards */}
          <div className="flex items-center justify-center">
            <div className="group relative w-full max-w-md">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 to-fuchsia-600 opacity-20 blur-xl transition-opacity duration-500 group-hover:opacity-40"></div>
              <div className="relative flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl shadow-2xl">
                
                <h3 className="mb-2 text-xl font-bold tracking-wide text-rose-300">System Capabilities</h3>
                
                <div className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_20px_rgba(244,_63,_94,_0.1)]">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Role-Based Access</h4>
                    <p className="mt-1 text-sm text-slate-400">Separate controls for administrators, managers, and public users.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_20px_rgba(245,_158,_11,_0.1)]">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Match Control</h4>
                    <p className="mt-1 text-sm text-slate-400">Schedule fixtures, record scores, and keep the competition moving.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_4px_20px_rgba(217,_70,_239,_0.1)]">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-fuchsia-500/20 text-fuchsia-400">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Automatic Standings</h4>
                    <p className="mt-1 text-sm text-slate-400">Leaderboards update immediately after completed matches.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
      
      {/* Info Strip */}
      <div className="relative z-10 grid gap-px bg-white/5 sm:grid-cols-3 border-t border-white/10">
        <div className="bg-slate-900/80 p-8 pt-10 backdrop-blur-md transition-colors duration-300 hover:bg-slate-800/90">
          <h3 className="mb-3 text-lg font-bold text-amber-300">For Organizers</h3>
          <p className="text-slate-400">Create tournaments, schedule matches, publish official results, and oversee operations.</p>
        </div>
        <div className="bg-slate-900/80 p-8 pt-10 backdrop-blur-md transition-colors duration-300 hover:bg-slate-800/90">
          <h3 className="mb-3 text-lg font-bold text-rose-300">For Team Managers</h3>
          <p className="text-slate-400">Build squads, register teams with ease, and follow tournament progress seamlessly.</p>
        </div>
        <div className="bg-slate-900/80 p-8 pt-10 backdrop-blur-md transition-colors duration-300 hover:bg-slate-800/90">
          <h3 className="mb-3 text-lg font-bold text-fuchsia-300">For Spectators</h3>
          <p className="text-slate-400">View fixtures, completed match scores, and live standings with unrestricted read-only access.</p>
        </div>
      </div>
      
    </div>
  );
};

export default HomePage;
