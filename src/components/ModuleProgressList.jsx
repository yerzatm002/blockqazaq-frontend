import { CheckCircle, Clock, XCircle } from "lucide-react";

export default function ModuleProgressList({ progress = [] }) {
  if (!progress.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
        Модульдер бойынша прогресс әзірге жоқ.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">
        Модульдер бойынша прогресс
      </h2>

      <div className="mt-5 space-y-4">
        {progress
          .slice()
          .sort((a, b) => a.moduleOrder - b.moduleOrder)
          .map((item) => (
            <div
              key={item.moduleId}
              className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                    item.completed
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <Clock className="h-6 w-6" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-emerald-600">
                    Модуль {item.moduleOrder}
                  </p>
                  <h3 className="font-bold text-slate-900">
                    {item.moduleTitle}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.moduleDescription}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.completed
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {item.completed ? "Аяқталды" : "Аяқталмады"}
                </span>

                {item.score !== null && item.score !== undefined ? (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {item.score}%
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                    <XCircle className="h-3.5 w-3.5" />
                    Нәтиже жоқ
                  </span>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}