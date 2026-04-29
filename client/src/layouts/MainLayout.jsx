import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const isHomeOrAuth = location.pathname === "/" || isAuthPage;
  const isHome = location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={`flex min-h-screen flex-col relative selection:bg-rose-500/30 transition-colors duration-500 ${isHomeOrAuth ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <header className={`sticky top-0 w-full z-50 transition-colors duration-300 backdrop-blur-xl border-b ${isHomeOrAuth ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50/80 border-slate-200'}`}>
        <div className="mx-auto w-full max-w-[1200px] flex flex-col items-center justify-between p-3 px-6 md:flex-row gap-4">

            <div className="flex flex-col hidden sm:flex">
              <Link
                to="/"
                className="group flex items-center gap-3 transition-transform hover:scale-[1.02]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-amber-500 to-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)]">
                  {/* Trophy Icon */}
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M19 3v4M5 7a4 4 0 004 4h6a4 4 0 004-4V7M9 11v4m6-4v4m-3 4V15m-4 4h8" />
                  </svg>
                </div>
                <span className={`text-xl font-bold tracking-tight ${isHomeOrAuth ? 'text-slate-100' : 'text-slate-900'}`}>
                  Sports Tournament <span className={`font-light ${isHomeOrAuth ? 'text-rose-400' : 'text-rose-500'}`}>Management System</span>
                </span>
              </Link>
            </div>

            {/* Mobile minimal version */}
            <div className="flex sm:hidden">
              <Link to="/" className={`text-lg font-bold tracking-tight flex items-center gap-2 ${isHomeOrAuth ? 'text-white' : 'text-slate-900'}`}>
                <svg className={`h-4 w-4 ${isHomeOrAuth ? 'text-rose-400' : 'text-rose-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M19 3v4M5 7a4 4 0 004 4h6a4 4 0 004-4V7M9 11v4m6-4v4m-3 4V15m-4 4h8" />
                </svg>
                STMS
              </Link>
            </div>

            <nav className={`flex flex-wrap items-center justify-center gap-2 text-sm font-semibold ${isHomeOrAuth ? 'text-slate-300' : 'text-slate-600'}`}>
              {user && (
                <NavLink
                  to="/tournaments"
                  className={({ isActive }) => `rounded-full px-4 py-2 transition-all duration-200 ${isActive ? `bg-amber-500/15 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)] ${isHomeOrAuth ? 'text-amber-300' : 'text-amber-600'}` : (isHomeOrAuth ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-200/60 hover:text-slate-900')}`}
                >
                  Tournaments
                </NavLink>
              )}

              {user?.role === "admin" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `rounded-full px-4 py-2 transition-all duration-200 ${isActive ? `bg-rose-500/15 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.15)] ${isHomeOrAuth ? 'text-rose-300' : 'text-rose-600'}` : (isHomeOrAuth ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-200/60 hover:text-slate-900')}`}
                >
                  Admin
                </NavLink>
              )}

              {user?.role === "manager" && (
                <NavLink
                  to="/manager"
                  className={({ isActive }) => `rounded-full px-4 py-2 transition-all duration-200 ${isActive ? `bg-fuchsia-500/15 border border-fuchsia-500/20 shadow-[0_0_15px_rgba(217,70,239,0.15)] ${isHomeOrAuth ? 'text-fuchsia-300' : 'text-fuchsia-600'}` : (isHomeOrAuth ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-200/60 hover:text-slate-900')}`}
                >
                  Manager
                </NavLink>
              )}

              <div className={`ml-1 pl-3 border-l flex items-center gap-3 ${isHomeOrAuth ? 'border-slate-700/60' : 'border-slate-300'}`}>
                {!user && (
                  <>
                    <NavLink to="/login" className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isHomeOrAuth ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-200/60 hover:text-slate-900'}`}>
                      <svg className={`h-4 w-4 ${isHomeOrAuth ? 'text-rose-400' : 'text-rose-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Login
                    </NavLink>
                    <NavLink to="/register" className="flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2 text-white hover:bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all hover:scale-105">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Register
                    </NavLink>
                  </>
                )}

                {user && (
                  <span className={`flex items-center gap-2 rounded-full border px-4 py-1.5 ${isHomeOrAuth ? 'border-slate-700 bg-slate-800/50 text-rose-50' : 'border-slate-200 bg-white text-slate-800 shadow-sm'}`}>
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                    {user.name}
                  </span>
                )}

                {user && (
                  <button
                    onClick={handleLogout}
                    type="button"
                    className={`rounded-full px-4 py-2 transition-colors ${isHomeOrAuth ? 'text-slate-400 hover:bg-rose-500/15 hover:text-rose-400' : 'text-slate-500 hover:bg-rose-100 hover:text-rose-600'}`}
                  >
                    Logout
                  </button>
                )}
              </div>
            </nav>

          </div>
        </header>

      <main className="mx-auto w-full max-w-[1200px] flex-grow p-5 pb-12 pt-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
