import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";

import CourseCard from "../components/CourseCard";
import ProgressCard from "../components/ProgressCard";
import ModuleProgressList from "../components/ModuleProgressList";

import { getModules } from "../services/moduleService";
import { getUserProgress } from "../services/progressService";

export default function CoursesPage() {
  const [modules, setModules] = useState([]);
  const [progressData, setProgressData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPageData() {
    try {
      setLoading(true);
      setError("");

      const [modulesResponse, progressResponse] = await Promise.all([
        getModules(),
        getUserProgress(),
      ]);

      setModules(modulesResponse);
      setProgressData(progressResponse);
    } catch (err) {
      setError(err.message || "Модульдерді жүктеу мүмкін болмады");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

  const summary = progressData?.summary || {
    totalModules: modules.length,
    completedModules: modules.filter((module) => module?.status?.completed).length,
    progressPercent:
      modules.length > 0
        ? Math.round(
            (modules.filter((module) => module?.status?.completed).length /
              modules.length) *
              100
          )
        : 0,
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <div className="h-8 w-64 animate-pulse rounded-xl bg-slate-200" />
          <div className="mt-3 h-5 w-96 animate-pulse rounded-xl bg-slate-200" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-3xl border border-slate-200 bg-white p-6"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <h2 className="text-xl font-bold text-red-700">Қате пайда болды</h2>
          <p className="mt-2 text-red-600">{error}</p>

          <button
            onClick={loadPageData}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
          >
            <RefreshCcw className="h-4 w-4" />
            Қайта жүктеу
          </button>
        </div>
      </section>
    );
  }

  const isCourseCompleted =
    summary.totalModules > 0 &&
    summary.completedModules === summary.totalModules;

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="font-semibold text-emerald-600">Оқу бағдарламасы</p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Оқу модульдері
          </h1>

          <p className="mt-3 max-w-2xl text-slate-500">
            Блокчейн технологиялары бойынша 5 негізгі модульді оқып, әр
            сабақтан кейін тест тапсырыңыз.
          </p>

          {isCourseCompleted && (
            <p className="mt-4 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              Барлық модуль аяқталды. Сертификат алуға болады.
            </p>
          )}
        </div>

        <div className="w-full lg:w-[420px]">
          <ProgressCard
            completed={summary.completedModules}
            total={summary.totalModules || 5}
            percent={summary.progressPercent}
          />
        </div>
      </div>

      {modules.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-slate-600">
          Әзірге модульдер табылмады.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((module) => (
              <CourseCard key={module.id} module={module} />
            ))}
        </div>
      )}

      <div className="mt-8">
        <ModuleProgressList progress={progressData?.progress || []} />
      </div>
    </section>
  );
}