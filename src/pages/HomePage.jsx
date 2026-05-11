import { Link } from "react-router-dom";
import { Bot, CheckCircle, GraduationCap, ShieldCheck, WalletCards } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: GraduationCap,
      title: "Қазақ тіліндегі сабақтар",
      text: "Блокчейн ұғымдары қарапайым тілмен және оқу модульдері арқылы түсіндіріледі.",
    },
    {
      icon: CheckCircle,
      title: "Тест және прогресс",
      text: "Әр модульден кейін тест тапсырып, жеке оқу прогресін бақылауға болады.",
    },
    {
      icon: ShieldCheck,
      title: "Цифрлық сертификат",
      text: "Курсты аяқтағаннан кейін бірегей ID және hash бар сертификат беріледі.",
    },
    {
      icon: Bot,
      title: "AI көмекші",
      text: "Пайдаланушы блокчейн, хэш, транзакция және смарт-келісімшарт туралы сұрақ қоя алады.",
    },
  ];

  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            Blockchain education platform
          </p>

          <h1 className="text-4xl font-extrabold leading-tight text-slate-900 md:text-6xl">
            BlockQazaq Edu
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Қазақ тілінде блокчейн технологияларын үйренуге арналған білім беру
            платформасы. Сабақтар, тесттер, прогресс, сертификат және AI көмекші
            бір жүйеге біріктірілген.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Оқуды бастау
            </Link>

            <Link
              to="/login"
              className="rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Жүйеге кіру
            </Link>
          </div>
        </div>

        <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="absolute -right-5 -top-5 hidden rounded-2xl bg-emerald-600 p-4 text-white shadow-lg md:block">
            <WalletCards className="h-8 w-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Блокчейн дегеніміз не?
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Блокчейн деректерді блоктар тізбегі ретінде сақтайтын технология.
            Әр блок алдыңғы блокпен криптографиялық байланысады. Сол себепті
            жазылған ақпаратты өзгерту қиын, ал деректерді тексеру ашық әрі
            сенімді болады.
          </p>

          <div className="mt-6 grid gap-3">
            {["Блок", "Хэш", "Транзакция", "Консенсус", "Смарт-келісімшарт"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-slate-50 px-4 py-3 font-medium text-slate-700"
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Платформа артықшылықтары
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {feature.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}