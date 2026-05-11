import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, CheckCircle, Mail, ShieldCheck } from "lucide-react";

import { getDashboard } from "../services/userService";
import { getUserProgress } from "../services/progressService";

import ProgressCard from "../components/ProgressCard";
import StatsCard from "../components/StatsCard";
import CertificateStatusCard from "../components/CertificateStatusCard";
import ModuleProgressList from "../components/ModuleProgressList";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [progressData, setProgressData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [dashboardResponse, progressResponse] = await Promise.all([
        getDashboard(),
        getUserProgress(),
      ]);

      setDashboard(dashboardResponse);
      setProgressData(progressResponse);
    } catch (err) {
      setError(err.message || "Жеке кабинет деректерін жүктеу мүмкін болмады");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          Жеке кабинет деректері жүктелуде...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
          {error}
        </div>
      </section>
    );
  }

  const user = dashboard?.user;

  const summary = progressData?.summary || dashboard?.stats || {
    totalModules: 0,
    completedModules: 0,
    progressPercent: 0,
  };

  const certificate = dashboard?.certificate || {
    available: false,
    blockchainStatus: null,
  };

  const isCourseCompleted =
    summary.totalModules > 0 &&
    summary.completedModules === summary.totalModules;

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="font-semibold text-emerald-600">Жеке кабинет</p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Қош келдіңіз, {user?.fullName || "пайдаланушы"}!
          </h1>

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {user?.email}
            </span>

            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              {user?.role}
            </span>
          </div>
        </div>

        <Link
          to="/courses"
          className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          Курстарға өту
        </Link>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <StatsCard
          title="Барлық модуль"
          value={summary.totalModules}
          description="Курстағы оқу модульдерінің саны"
        />

        <StatsCard
          title="Аяқталған модуль"
          value={summary.completedModules}
          description="Тесттен сәтті өткен модульдер"
        />

        <StatsCard
          title="Жалпы прогресс"
          value={`${summary.progressPercent}%`}
          description="Курс бойынша ағымдағы көрсеткіш"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProgressCard
            completed={summary.completedModules}
            total={summary.totalModules}
            percent={summary.progressPercent}
          />
        </div>

        <CertificateStatusCard certificate={certificate} />
      </div>

      <div className="mt-8">
        <ModuleProgressList progress={progressData?.progress || []} />
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Соңғы нәтижелер</h2>

        <div className="mt-5 space-y-4">
          <ActivityItem
            icon={CheckCircle}
            title={`${summary.completedModules} модуль аяқталды`}
            text={`Жалпы прогресс: ${summary.progressPercent}%`}
          />

          <ActivityItem
            icon={BookOpen}
            title={isCourseCompleted ? "Курс толық аяқталды" : "Оқуды жалғастыру қажет"}
            text={
              isCourseCompleted
                ? "Сертификат алуға болады"
                : "Барлық модульді аяқтаңыз"
            }
          />
        </div>
      </div>
    </section>
  );
}

function ActivityItem({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-4 rounded-2xl bg-slate-50 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{text}</p>
      </div>
    </div>
  );
}