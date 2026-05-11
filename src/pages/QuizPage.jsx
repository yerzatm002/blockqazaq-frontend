import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  RefreshCcw,
  XCircle,
} from "lucide-react";

import { getQuizByModuleId, submitQuiz } from "../services/quizService";

export default function QuizPage() {
  const { moduleId } = useParams();

  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitResult, setSubmitResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadQuiz() {
    try {
      setLoading(true);
      setError("");
      setSubmitResult(null);

      const data = await getQuizByModuleId(moduleId);
      setQuizData(data);
    } catch (err) {
      setError(err.message || "Тест сұрақтарын жүктеу мүмкін болмады");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuiz();
  }, [moduleId]);

  const questions = quizData?.quiz?.questions || [];
  const totalQuestions = quizData?.quiz?.totalQuestions || questions.length;
  const passingScore = quizData?.quiz?.passingScore || 60;

  const answeredCount = useMemo(() => {
    return Object.keys(selectedAnswers).length;
  }, [selectedAnswers]);

  const allAnswered = answeredCount === totalQuestions;

  function handleSelect(questionId, answerText) {
    if (submitResult) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerText,
    }));
  }

  async function handleSubmit() {
    if (!allAnswered) {
      setError("Барлық сұрақтарға жауап беріңіз");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const answers = questions.map((question) => ({
        questionId: question.id,
        answer: selectedAnswers[question.id],
      }));

      const result = await submitQuiz(moduleId, answers);
      setSubmitResult(result);
    } catch (err) {
      setError(err.message || "Тест нәтижесін сақтау мүмкін болмады");
    } finally {
      setSubmitting(false);
    }
  }

  function resetQuiz() {
    setSelectedAnswers({});
    setSubmitResult(null);
    setError("");
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-6 h-5 w-40 animate-pulse rounded bg-slate-200" />
        <div className="h-10 w-96 animate-pulse rounded-xl bg-slate-200" />

        <div className="mt-8 space-y-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-3xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error && !quizData) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <h2 className="text-xl font-bold text-red-700">Қате пайда болды</h2>
          <p className="mt-2 text-red-600">{error}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={loadQuiz}
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

  const module = quizData?.module;

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <Link
        to={`/courses/${moduleId}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Сабаққа қайту
      </Link>

      <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="font-semibold text-emerald-600">
            Модуль {module?.order}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {module?.title}
          </h1>

          <p className="mt-3 max-w-3xl text-slate-500">
            {module?.description}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
          {answeredCount} / {totalQuestions} жауап берілді
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {submitResult && (
        <ResultBlock result={submitResult.result} moduleTitle={submitResult.module?.title} />
      )}

      <div className="mt-8 space-y-6">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            selectedAnswer={selectedAnswers[question.id]}
            onSelect={handleSelect}
            details={submitResult?.details}
            disabled={Boolean(submitResult)}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {!submitResult ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting ? "Жіберілуде..." : "Жауаптарды жіберу"}
          </button>
        ) : (
          <>
            <button
              onClick={resetQuiz}
              className="rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Қайта тапсыру
            </button>

            <Link
              to="/courses"
              className="rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Курстарға өту
            </Link>
          </>
        )}
      </div>
    </section>
  );
}

function QuestionCard({
  question,
  index,
  selectedAnswer,
  onSelect,
  details = [],
  disabled,
}) {
  const detail = details?.find((item) => item.questionId === question.id);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 font-bold text-emerald-700">
          {index + 1}
        </div>

        <div>
          <h3 className="text-lg font-bold leading-7 text-slate-900">
            {question.question}
          </h3>

          {detail && (
            <p
              className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                detail.isCorrect
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {detail.isCorrect ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {detail.isCorrect ? "Дұрыс жауап" : "Қате жауап"}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.text;
          const isCorrect = detail?.correctAnswer === option.text;
          const isWrongSelected = detail && isSelected && !detail.isCorrect;

          let optionClass =
            "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50";

          if (isSelected && !detail) {
            optionClass = "border-emerald-500 bg-emerald-50";
          }

          if (detail && isCorrect) {
            optionClass = "border-emerald-500 bg-emerald-50";
          }

          if (isWrongSelected) {
            optionClass = "border-red-500 bg-red-50";
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(question.id, option.text)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${optionClass}`}
            >
              <span className="text-sm font-medium text-slate-700">
                {option.text}
              </span>

              {isSelected && !detail && (
                <HelpCircle className="h-5 w-5 text-emerald-600" />
              )}

              {detail && isCorrect && (
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              )}

              {isWrongSelected && <XCircle className="h-5 w-5 text-red-600" />}
            </button>
          );
        })}
      </div>

      {detail && !detail.isCorrect && (
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p>
            <b>Сіздің жауабыңыз:</b> {detail.userAnswer}
          </p>
          <p className="mt-1">
            <b>Дұрыс жауап:</b> {detail.correctAnswer}
          </p>
        </div>
      )}
    </div>
  );
}

function ResultBlock({ result, moduleTitle }) {
  const completed = result?.completed;

  return (
    <div
      className={`mt-8 rounded-3xl border p-8 shadow-sm ${
        completed
          ? "border-emerald-200 bg-emerald-50"
          : "border-red-200 bg-red-50"
      }`}
    >
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p
            className={`font-semibold ${
              completed ? "text-emerald-700" : "text-red-700"
            }`}
          >
            {completed ? "Өтті" : "Өтпеді"}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {moduleTitle || "Тест нәтижесі"}
          </h2>

          <p className="mt-3 text-slate-600">
            Дұрыс жауап: {result.correctCount}. Қате жауап: {result.wrongCount}.
            Өту шегі: {result.passingScore}%.
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-slate-500">Жинаған балл</p>
          <p
            className={`mt-2 text-5xl font-extrabold ${
              completed ? "text-emerald-700" : "text-red-700"
            }`}
          >
            {result.score}%
          </p>
        </div>
      </div>
    </div>
  );
}