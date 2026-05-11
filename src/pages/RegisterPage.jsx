import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
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

    if (!formData.fullName.trim()) {
      setError("Толық аты-жөніңізді енгізіңіз");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email енгізіңіз");
      return;
    }

    if (formData.password.length < 6) {
      setError("Құпия сөз кемінде 6 таңбадан тұруы керек");
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Тіркелу кезінде қате пайда болды");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Тіркелу</h1>

        <p className="mt-2 text-slate-500">
          Оқуды бастау үшін аккаунт жасаңыз.
        </p>

        {error && (
          <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Толық аты-жөні
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
              placeholder="Аружан Тілмаш"
            />
          </div>

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
              placeholder="Кемінде 6 таңба"
              type="password"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {loading ? "Тіркелуде..." : "Тіркелу"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-500">
          Аккаунтыңыз бар ма?{" "}
          <Link to="/login" className="font-semibold text-emerald-600">
            Кіру
          </Link>
        </p>
      </div>
    </section>
  );
}