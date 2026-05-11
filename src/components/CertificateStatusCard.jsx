import { Link } from "react-router-dom";

export default function CertificateStatusCard({ certificate }) {
  const available = certificate?.available;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">Сертификат статусы</h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {available
          ? "Сертификат қолжетімді. Барлық модульдер сәтті аяқталды."
          : "Сертификат барлық 5 модуль аяқталғаннан кейін қолжетімді болады."}
      </p>

      {available && (
        <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
          <p>
            <b>Blockchain:</b>{" "}
            {certificate.blockchainStatus || "PENDING"}
          </p>
          {certificate.txHash && (
            <p className="mt-1 break-all">
              <b>Tx Hash:</b> {certificate.txHash}
            </p>
          )}
        </div>
      )}

      <Link
        to="/certificate"
        className={`mt-5 inline-block rounded-xl px-5 py-3 text-sm font-semibold ${
          available
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        Сертификатқа өту
      </Link>
    </div>
  );
}