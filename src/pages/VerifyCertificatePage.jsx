import { useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Fingerprint,
  Search,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";

import { verifyCertificate } from "../services/certificateService";

export default function VerifyCertificatePage() {
  const [certificateId, setCertificateId] = useState("");
  const [verification, setVerification] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setVerification(null);

    if (!certificateId.trim()) {
      setError("Certificate ID енгізіңіз");
      return;
    }

    try {
      setLoading(true);

      const result = await verifyCertificate(certificateId.trim());
      setVerification(result);
    } catch (err) {
      setError(err.message || "Сертификатты тексеру мүмкін болмады");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div>
        <p className="font-semibold text-emerald-600">Тексеру</p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Сертификатты тексеру
        </h1>

        <p className="mt-3 max-w-2xl text-slate-500">
          Certificate ID енгізіп, сертификаттың жүйеде бар-жоғын және blockchain
          тіркеу статусын тексеріңіз.
        </p>
      </div>

      <form
        onSubmit={handleVerify}
        className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Certificate ID
        </label>

        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
            placeholder="certificate_uuid"
          />

          <button
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            <Search className="h-5 w-5" />
            {loading ? "Тексерілуде..." : "Тексеру"}
          </button>
        </div>

        {error && (
          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}
      </form>

      {verification && <VerificationResult verification={verification} />}
    </section>
  );
}

function VerificationResult({ verification }) {
  const certificate = verification?.certificate;

  if (!verification.valid) {
    return (
      <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-700">
            <XCircle className="h-7 w-7" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-red-700">
              Сертификат табылмады
            </h2>

            <p className="mt-2 text-red-600">
              Енгізілген Certificate ID бойынша сертификат жүйеден табылған жоқ.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <CheckCircle className="h-7 w-7" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-emerald-700">
            Сертификат табылды
          </h2>

          <p className="mt-2 text-emerald-700">
            Сертификат жүйеде тіркелген және тексеруден өтті.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <VerifyInfoItem
          icon={User}
          label="Пайдаланушы"
          value={certificate?.user?.fullName}
        />

        <VerifyInfoItem
          icon={Calendar}
          label="Берілген күні"
          value={formatDate(certificate?.issuedAt)}
        />

        <VerifyInfoItem
          icon={ShieldCheck}
          label="Blockchain status"
          value={certificate?.blockchainStatus || "PENDING"}
        />

        <VerifyInfoItem
          icon={Fingerprint}
          label="Курс"
          value={certificate?.courseTitle || "BlockQazaq Edu"}
        />
      </div>

      <div className="mt-5 rounded-2xl bg-white p-5">
        <p className="font-semibold text-slate-900">Certificate Hash</p>
        <p className="mt-3 break-all rounded-xl bg-slate-50 p-3 font-mono text-sm text-slate-700">
          {certificate?.certificateHash}
        </p>
      </div>

      {certificate?.txHash && (
        <div className="mt-5 rounded-2xl bg-white p-5">
          <p className="font-semibold text-slate-900">Transaction Hash</p>
          <p className="mt-3 break-all rounded-xl bg-slate-50 p-3 font-mono text-sm text-slate-700">
            {certificate.txHash}
          </p>
        </div>
      )}
    </div>
  );
}

function VerifyInfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-5">
      <div className="mb-3 flex items-center gap-2 text-emerald-700">
        <Icon className="h-5 w-5" />
        <span className="text-sm font-semibold">{label}</span>
      </div>

      <p className="font-bold text-slate-900">{value || "Көрсетілмеген"}</p>
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