export default function ProgressCard({ completed = 0, total = 5, percent }) {
  const progressPercent =
    typeof percent === "number" ? percent : Math.round((completed / total) * 100);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Жалпы прогресс</h3>
          <p className="text-sm text-slate-500">
            {completed} / {total} модуль аяқталды
          </p>
        </div>

        <span className="text-2xl font-bold text-emerald-600">
          {progressPercent}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-600 transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}