import { Link } from "react-router-dom";
import { CheckCircle, Clock, PlayCircle } from "lucide-react";

export default function CourseCard({ module }) {
  const completed = module?.status?.completed;
  const score = module?.status?.score;
  const lessonDuration = module?.lesson?.duration;

  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-600">
            Модуль {module.order}
          </p>

          <h3 className="mt-2 text-xl font-bold leading-7 text-slate-900">
            {module.title}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            completed
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {completed ? (
            <CheckCircle className="h-6 w-6" />
          ) : (
            <PlayCircle className="h-6 w-6" />
          )}
        </div>
      </div>

      <p className="min-h-[72px] text-sm leading-6 text-slate-600">
        {module.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {lessonDuration && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            <Clock className="h-3.5 w-3.5" />
            {lessonDuration} минут
          </span>
        )}

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            completed
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {completed ? "Аяқталды" : "Бастау"}
        </span>

        {score !== null && score !== undefined && (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            Нәтиже: {score}%
          </span>
        )}
      </div>

      <Link
        to={`/courses/${module.id}`}
        className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
      >
        Сабақты ашу
      </Link>
    </div>
  );
}