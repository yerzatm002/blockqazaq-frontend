import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  RefreshCcw,
} from "lucide-react";

import { getLessonByModuleId } from "../services/lessonService";

export default function LessonPage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLesson() {
    try {
      setLoading(true);
      setError("");

      const data = await getLessonByModuleId(moduleId);
      setLessonData(data);
    } catch (err) {
      setError(err.message || "Сабақ деректерін жүктеу мүмкін болмады");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLesson();
  }, [moduleId]);

  function goToTest() {
    if (!lessonData?.nextTest?.available) return;

    navigate(`/courses/${lessonData.nextTest.moduleId}/quiz`);
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-6 h-5 w-40 animate-pulse rounded bg-slate-200" />
        <div className="h-10 w-96 animate-pulse rounded-xl bg-slate-200" />

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="h-6 w-80 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-11/12 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-10/12 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <h2 className="text-xl font-bold text-red-700">Қате пайда болды</h2>
          <p className="mt-2 text-red-600">{error}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={loadLesson}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
            >
              <RefreshCcw className="h-4 w-4" />
              Қайта жүктеу
            </button>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-red-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Курстарға қайту
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const module = lessonData?.module;
  const lesson = lessonData?.lesson;
  const status = lessonData?.status;
  const nextTest = lessonData?.nextTest;

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <Link
        to="/courses"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Курстарға қайту
      </Link>

      <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="font-semibold text-emerald-600">
            Модуль {module?.order}
          </p>

          <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
            {module?.title}
          </h1>

          <p className="mt-3 max-w-3xl text-slate-500">
            {module?.description}
          </p>
        </div>

        <div
          className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
            status?.completed
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {status?.completed
            ? `Аяқталды • ${status.score}%`
            : "Оқу процесінде"}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
              <BookOpen className="h-4 w-4" />
              {lesson?.title}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
              <Clock className="h-4 w-4" />
              {lesson?.duration} минут
            </span>
          </div>

          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900">
              {lesson?.title}
            </h2>

            <div className="mt-5 whitespace-pre-line text-lg leading-8 text-slate-700">
              {lesson?.content}
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-slate-50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">Мысал</h3>
            </div>

            <p className="leading-7 text-slate-600">
              Егер бір блоктағы дерек өзгерсе, оның hash мәні де өзгереді.
              Сол өзгеріс келесі блоктармен байланысқа әсер етеді. Сондықтан
              блокчейнде деректерді жасырын өзгерту өте қиын.
            </p>
          </div>

          <button
            onClick={goToTest}
            disabled={!nextTest?.available}
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Тестке өту
          </button>
        </article>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Кілт сөздер</h3>

            <div className="mt-4 flex flex-wrap gap-2">
              {lesson?.keywords?.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Тест статусы</h3>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {nextTest?.available
                ? "Сабақтан кейін тест тапсыруға болады."
                : "Тест әзірше қолжетімді емес."}
            </p>

            {status?.completed && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                <CheckCircle className="h-5 w-5" />
                Модуль аяқталды
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}