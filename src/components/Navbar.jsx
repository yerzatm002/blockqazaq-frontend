import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navClass = ({ isActive }) =>
    isActive
      ? "text-emerald-600 font-semibold"
      : "text-slate-600 hover:text-emerald-600";

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold text-slate-900">
          BlockQazaq Edu
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navClass}>Басты бет</NavLink>
          <NavLink to="/hash-demo" className={navClass}>
            Hash Demo
          </NavLink>
          <NavLink to="/courses" className={navClass}>Курстар</NavLink>
          <NavLink to="/dashboard" className={navClass}>Жеке кабинет</NavLink>
          <NavLink to="/certificate" className={navClass}>Сертификат</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-slate-600 md:block">
                {user.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Шығу
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Кіру
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Тіркелу
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}