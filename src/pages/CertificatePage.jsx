import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Calendar,
  CheckCircle,
  Copy,
  Fingerprint,
  RefreshCcw,
  ShieldCheck,
  User,
} from "lucide-react";

import { getUserProgress } from "../services/progressService";
import {
  generateCertificate,
  getMyCertificate,
} from "../services/certificateService";

export default function CertificatePage() {
  const [progress, setProgress] = useState(null);
  const [certificate, setCertificate] = useState(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadPageData() {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const progressData = await getUserProgress();
      setProgress(progressData);

      try {
        const certificateData = await getMyCertificate();
        setCertificate(certificateData);
      } catch {
        setCertificate(null);
      }
    } catch (err) {
      setError(err.message || "Сертификат деректерін жүктеу мүмкін болмады");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

  const canGenerateCertificate =
    progress?.summary?.totalModules > 0 &&
    progress?.summary?.completedModules === progress?.summary?.totalModules;

  async function handleGenerateCertificate() {
    try {
      setGenerating(true);
      setError("");
      setMessage("");

      const result = await generateCertificate();
      setCertificate(result.certificate);

      setMessage(
        result.alreadyExists
          ? "Сертификат бұрын жасалған"
          : "Сертификат сәтті жасалды"
      );
    } catch (err) {
      setError(err.message || "Сертификат жасау мүмкін болмады");
    } finally {
      setGenerating(false);
    }
  }

  function copyCertificateId() {
    if (!certificate?.id) return;
    navigator.clipboard.writeText(certificate.id);
    setMessage("Certificate ID көшірілді");
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          Сертификат деректері жүктелуде...
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="font-semibold text-emerald-600">Сертификат</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Курсты аяқтау сертификаты
          </h1>
          <p className="mt-3 max-w-2xl text-slate-500">
            Барлық модуль аяқталғаннан кейін жүйе бірегей ID және SHA-256 hash
            мәні бар сертификат жасайды.
          </p>
        </div>

        <Link
          to="/verify-certificate"
          className="rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Сертификатты тексеру
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {message && (
        <div className="mt-6 rounded-2xl bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
          {message}
        </div>
      )}

      {!canGenerateCertificate && !certificate && (
        <UnavailableCertificate progress={progress} />
      )}

      {canGenerateCertificate && !certificate && (
        <AvailableCertificate
          generating={generating}
          onGenerate={handleGenerateCertificate}
        />
      )}

      {certificate && (
        <CertificateView
          certificate={certificate}
          onCopyCertificateId={copyCertificateId}
          onRefresh={loadPageData}
        />
      )}
    </section>
  );
}

function UnavailableCertificate({ progress }) {
  const summary = progress?.summary || {
    totalModules: 5,
    completedModules: 0,
    progressPercent: 0,
  };

  return (
    <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Сертификат әлі қолжетімді емес
          </h2>

          <p className="mt-3 text-slate-600">
            Сертификат алу үшін барлық модульді аяқтау қажет. Қазіргі прогресс:
            {" "}
            {summary.completedModules}/{summary.totalModules} модуль.
          </p>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-amber-500"
              style={{ width: `${summary.progressPercent}%` }}
            />
          </div>

          <p className="mt-2 text-sm font-semibold text-amber-700">
            {summary.progressPercent}%
          </p>
        </div>

        <Link
          to="/courses"
          className="rounded-2xl bg-amber-600 px-6 py-3 font-semibold text-white hover:bg-amber-700"
        >
          Оқуды жалғастыру
        </Link>
      </div>
    </div>
  );
}

function AvailableCertificate({ generating, onGenerate }) {
  return (
    <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Сертификат алуға болады
          </h2>

          <p className="mt-3 text-slate-600">
            Барлық модуль сәтті аяқталды. Енді сертификатты жасап, оның hash
            мәнін ала аласыз.
          </p>
        </div>

        <button
          onClick={onGenerate}
          disabled={generating}
          className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {generating ? "Жасалуда..." : "Сертификат жасау"}
        </button>
      </div>
    </div>
  );
}

function CertificateView({ certificate, onCopyCertificateId, onRefresh }) {
  const user = certificate?.user || {};

  return (
    <div className="mt-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="rounded-[1.5rem] border-2 border-emerald-200 bg-gradient-to-br from-white to-emerald-50 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-600 text-white">
            <Award className="h-9 w-9" />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
            BlockQazaq Edu
          </p>

          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 md:text-4xl">
            Курсты аяқтау сертификаты
          </h2>

          <p className="mt-4 text-slate-600">
            Бұл сертификат пайдаланушының блокчейн технологиялары бойынша оқу
            курсын аяқтағанын растайды.
          </p>

          <div className="mt-8 grid gap-4 text-left md:grid-cols-2">
            <InfoItem
              icon={User}
              label="Пайдаланушы"
              value={user.fullName || "Аты-жөні көрсетілмеген"}
            />

            <InfoItem
              icon={Award}
              label="Курс"
              value={certificate.courseTitle || "BlockQazaq Edu"}
            />

            <InfoItem
              icon={Calendar}
              label="Берілген күні"
              value={formatDate(certificate.issuedAt)}
            />

            <InfoItem
              icon={ShieldCheck}
              label="Blockchain status"
              value={certificate.blockchainStatus || "PENDING"}
            />
          </div>

          <div className="mt-6 rounded-2xl bg-white p-5 text-left shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="font-semibold text-slate-900">Certificate ID</p>

              <button
                onClick={onCopyCertificateId}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200"
              >
                <Copy className="h-4 w-4" />
                Көшіру
              </button>
            </div>

            <p className="break-all rounded-xl bg-slate-50 p-3 font-mono text-sm text-slate-700">
              {certificate.id}
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-5 text-left shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-emerald-600" />
              <p className="font-semibold text-slate-900">Certificate Hash</p>
            </div>

            <p className="break-all rounded-xl bg-slate-50 p-3 font-mono text-sm text-slate-700">
              {certificate.certificateHash}
            </p>
          </div>

          {certificate.txHash && (
            <div className="mt-6 rounded-2xl bg-white p-5 text-left shadow-sm">
              <p className="font-semibold text-slate-900">Transaction Hash</p>
              <p className="mt-3 break-all rounded-xl bg-slate-50 p-3 font-mono text-sm text-slate-700">
                {certificate.txHash}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/verify-certificate"
              className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              Сертификатты тексеру
            </Link>

            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCcw className="h-4 w-4" />
              Жаңарту
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-emerald-700">
        <Icon className="h-5 w-5" />
        <span className="text-sm font-semibold">{label}</span>
      </div>

      <p className="font-bold text-slate-900">{value}</p>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "Көрсетілмеген";

  return new Intl.DateTimeFormat("kk-KZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}