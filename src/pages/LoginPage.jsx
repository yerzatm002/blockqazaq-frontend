import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!formData.email.trim()) {
      setError("Email енгізіңіз");
      return;
    }

    if (!formData.password.trim()) {
      setError("Құпия сөз енгізіңіз");
      return;
    }

    try {
      setLoading(true);
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Кіру кезінде қате пайда болды");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Кіру</h1>

        <p className="mt-2 text-slate-500">
          Жеке кабинетке кіру үшін деректеріңізді енгізіңіз.
        </p>

        {error && (
          <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
              placeholder="aruzhan@example.com"
              type="email"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Құпия сөз
            </label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
              placeholder="Құпия сөз"
              type="password"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {loading ? "Кіру..." : "Кіру"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-500">
          Аккаунтыңыз жоқ па?{" "}
          <Link to="/register" className="font-semibold text-emerald-600">
            Тіркелу
          </Link>
        </p>
      </div>
    </section>
  );
}