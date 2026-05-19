import { useState } from "react";
import { Copy, Fingerprint, RefreshCcw } from "lucide-react";
import { generateHash } from "../services/hashService";

export default function HashDemoPage() {
  const [text, setText] = useState("Hello");
  const [result, setResult] = useState(null);
  const [secondResult, setSecondResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!text.trim()) {
      setError("Мәтін енгізіңіз");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await generateHash(text);
      setResult(data);

      const changedText = text + " ";
      const secondData = await generateHash(changedText);
      setSecondResult(secondData);
    } catch (err) {
      setError(err.message || "Хэш жасау кезінде қате пайда болды");
    } finally {
      setLoading(false);
    }
  }

  function copyHash(hash) {
    navigator.clipboard.writeText(hash);
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div>
        <p className="font-semibold text-emerald-600">Практикалық бөлім</p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Хэш генерация практикасы
        </h1>

        <p className="mt-3 max-w-3xl text-slate-500">
          Мәтін енгізіңіз. Жүйе SHA-256 алгоритмі арқылы хэш жасайды.
          Бір ғана символ өзгерсе, хэш мәні толық өзгеретінін байқайсыз.
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Мәтін
        </label>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
          placeholder="Мәтін енгізіңіз..."
        />

        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 disabled:bg-emerald-300"
        >
          {loading ? (
            <>
              <RefreshCcw className="h-5 w-5 animate-spin" />
              Жасалуда...
            </>
          ) : (
            <>
              <Fingerprint className="h-5 w-5" />
              SHA-256 хэш жасау
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <HashResultCard
            title="Бастапқы мәтіннің хэші"
            result={result}
            onCopy={copyHash}
          />

          {secondResult && (
            <HashResultCard
              title="Бір символ өзгерген мәтіннің хэші"
              result={secondResult}
              onCopy={copyHash}
            />
          )}
        </div>
      )}

      {result && secondResult && result.hash !== secondResult.hash && (
        <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-xl font-bold text-emerald-700">
            Бақылау нәтижесі
          </h2>

          <p className="mt-3 leading-7 text-emerald-800">
            Бір ғана символ өзгерген кезде SHA-256 хэш мәні толық өзгерді.
            Бұл хэштеу алгоритмдерінің негізгі қасиетін көрсетеді.
          </p>
        </div>
      )}
    </section>
  );
}

function HashResultCard({ title, result, onCopy }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>

      <div className="mt-5 space-y-4">
        <InfoRow label="Original text" value={result.originalText} />
        <InfoRow label="Algorithm" value={result.algorithm} />
        <InfoRow label="Length" value={`${result.length} символ`} />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">Hash</p>

            <button
              onClick={() => onCopy(result.hash)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200"
            >
              <Copy className="h-4 w-4" />
              Көшіру
            </button>
          </div>

          <p className="break-all rounded-2xl bg-slate-50 p-4 font-mono text-sm text-slate-700">
            {result.hash}
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-all font-semibold text-slate-800">{value}</p>
    </div>
  );
}