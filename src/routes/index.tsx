import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quiz para ti" },
      { name: "description", content: "Un mini test divertido. Si lo apruebas, hay premio." },
      { property: "og:title", content: "Quiz para ti" },
      { property: "og:description", content: "Un mini test divertido. Si lo apruebas, hay premio." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  component: Index,
});

type Question = {
  q: string;
  options: string[];
  correct: number;
  hint?: string;
};

const QUESTIONS: Question[] = [
  { q: "¿Dónde fue nuestra primera cita?", options: ["En un café", "En el cine", "Dando una vuelta", "No me acuerdo, dímelo tú"], correct: 0 },
  { q: "¿Qué comida me gusta más?", options: ["Pasta", "Pizza", "Sushi", "Lo que cocines tú"], correct: 3 },
  { q: "¿Qué día empezamos a hablar?", options: ["Un lunes cualquiera", "El mejor día del año", "Ni idea", "El día que dejé de aburrirme"], correct: 1 },
  { q: "¿Cuál es mi serie/peli favorita?", options: ["La que vemos juntos", "Una random de Netflix", "Friends", "Esa que siempre repito"], correct: 0 },
  { q: "¿Qué hago cuando tengo hambre?", options: ["Me enfado", "Me callo", "Lo digo", "Todas las anteriores"], correct: 3 },
  { q: "¿Cuál es mi estado más habitual?", options: ["Productivo", "Dormido", "Pensando en ti", "Procrastinando"], correct: 2 },
  { q: "¿Qué estoy pensando ahora?", options: ["En ti", "En comida", "En dormir", "Todas son correctas"], correct: 3 },
  { q: "¿Cuántas veces he dicho 'no tengo hambre' mintiendo?", options: ["Pocas", "Algunas", "Muchísimas", "He perdido la cuenta"], correct: 3 },
  { q: "¿Cuál es mi debilidad?", options: ["El chocolate", "Dormir tarde", "Tú", "Las series malas"], correct: 2, hint: "Empieza por T, termina por Ú." },
];

type Stage = "intro" | "explain" | "quiz" | "result";

function Index() {
  const [stage, setStage] = useState<Stage>("intro");
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const total = QUESTIONS.length;

  const handlePick = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    const isCorrect = idx === QUESTIONS[current].correct;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore((s) => s + 1);
    setTimeout(() => {
      setPicked(null);
      setFeedback(null);
      if (current + 1 >= total) setStage("result");
      else setCurrent((c) => c + 1);
    }, 900);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Backdrop />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 py-6">
        <Header stage={stage} current={current} total={total} />
        <div className="flex flex-1 items-center justify-center py-6">
          {stage === "intro" && <Intro onStart={() => setStage("explain")} />}
          {stage === "explain" && <Explain onContinue={() => setStage("quiz")} />}
          {stage === "quiz" && (
            <QuizCard
              key={current}
              index={current}
              total={total}
              question={QUESTIONS[current]}
              picked={picked}
              feedback={feedback}
              onPick={handlePick}
            />
          )}
          {stage === "result" && <Result score={score} total={total} />}
        </div>
      </div>
    </main>
  );
}

function Backdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="animate-float-blob absolute -top-24 -left-20 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: "oklch(0.85 0.1 50)" }}
      />
      <div
        className="animate-float-blob absolute -bottom-24 -right-20 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: "oklch(0.85 0.08 240)", animationDelay: "-7s" }}
      />
    </div>
  );
}

function Header({ stage, current, total }: { stage: Stage; current: number; total: number }) {
  const showProgress = stage === "quiz" || stage === "result";
  const progress = stage === "result" ? 100 : (current / total) * 100;
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">🎯</span>
        <span className="text-sm font-semibold tracking-tight">Quizcito</span>
      </div>
      {showProgress && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-foreground transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="tabular-nums">
            {Math.min(current + (stage === "result" ? 0 : 1), total)}/{total}
          </span>
        </div>
      )}
    </header>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-fade-in w-full text-center">
      <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" /> un mini quiz para ti
      </div>
      <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
        ¿Cuánto me<br />conoces de verdad?
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-base text-muted-foreground">
        9 preguntas rápidas. Algunas fáciles, otras absurdas. Si lo apruebas, hay sorpresa.
      </p>
      <button
        onClick={onStart}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-[0.98]"
      >
        Empezar quiz
        <span aria-hidden>→</span>
      </button>
      <p className="mt-3 text-xs text-muted-foreground">~ 2 minutos · sin trampas (casi)</p>
    </div>
  );
}

function Explain({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="animate-fade-in w-full rounded-3xl border border-border bg-card p-7 shadow-card sm:p-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        Cómo funciona
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Tres reglas, muy fáciles.</p>
      <ul className="mt-5 space-y-3">
        {[
          ["💬", "Habrá preguntas reales", "A ver si prestas atención."],
          ["🤷", "Y alguna absurda", "Improvisa, vale todo."],
          ["🎁", "Al final, sorpresa", "Pero solo si terminas."],
        ].map(([icon, t, sub]) => (
          <li key={t} className="flex items-start gap-3 rounded-xl bg-secondary/60 p-3">
            <span className="text-xl leading-none">{icon}</span>
            <div>
              <div className="text-sm font-semibold text-foreground">{t}</div>
              <div className="text-xs text-muted-foreground">{sub}</div>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={onContinue}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-[0.99]"
      >
        Vamos <span aria-hidden>→</span>
      </button>
    </div>
  );
}

function QuizCard({
  index,
  total,
  question,
  picked,
  feedback,
  onPick,
}: {
  index: number;
  total: number;
  question: Question;
  picked: number | null;
  feedback: "correct" | "wrong" | null;
  onPick: (i: number) => void;
}) {
  return (
    <div className={`w-full ${feedback === "wrong" ? "animate-shake" : "animate-fade-in"}`}>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-7">
        <div className="text-xs font-medium text-muted-foreground">
          Pregunta {index + 1} de {total}
        </div>
        <h2 className="mt-2 text-balance text-2xl font-bold leading-snug tracking-tight text-foreground">
          {question.q}
        </h2>
        {question.hint && (
          <p className="mt-2 text-xs italic text-muted-foreground">Pista: {question.hint}</p>
        )}
        <div className="mt-5 space-y-2">
          {question.options.map((opt, i) => {
            const isPicked = picked === i;
            const isCorrect = i === question.correct;
            let state = "border-border bg-card hover:border-foreground/30 hover:bg-secondary/60";
            if (picked !== null) {
              if (isPicked && isCorrect) state = "border-success/60 bg-success/10";
              else if (isPicked && !isCorrect) state = "border-danger/60 bg-danger/10";
              else if (isCorrect) state = "border-success/40 bg-success/5";
              else state = "border-border bg-card opacity-50";
            }
            return (
              <button
                key={i}
                disabled={picked !== null}
                onClick={() => onPick(i)}
                className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left text-[15px] font-medium text-foreground transition-all active:scale-[0.99] ${state}`}
              >
                <span>{opt}</span>
                {picked !== null && isCorrect && (
                  <span className="text-sm text-success" aria-hidden>✓</span>
                )}
                {isPicked && !isCorrect && (
                  <span className="text-sm text-danger" aria-hidden>✕</span>
                )}
              </button>
            );
          })}
        </div>
        {feedback && (
          <div className="animate-pop-in mt-4 text-center text-sm font-medium">
            {feedback === "correct" ? (
              <span className="text-success">Bien ahí ✨</span>
            ) : (
              <span className="text-danger">Casi… pero no 😅</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Result({ score, total }: { score: number; total: number }) {
  const pct = Math.round((score / total) * 100);
  const { emoji, title, message } = useMemo(() => {
    if (pct < 50) return { emoji: "🫣", title: "Bueno… hay margen de mejora", message: "Tranquila, te pongo al día yo." };
    if (pct < 80) return { emoji: "👏", title: "Vas bastante bien", message: "Casi me conoces de memoria." };
    return { emoji: "🏆", title: "Nivel experto", message: "Sabes más de mí que yo mismo." };
  }, [pct]);

  return (
    <div className="animate-fade-in w-full">
      <div className="rounded-3xl border border-border bg-card p-7 text-center shadow-card sm:p-9">
        <div className="text-6xl">{emoji}</div>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-1.5 text-sm font-semibold text-foreground tabular-nums">
          {score} / {total}
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{pct}%</span>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-border bg-secondary/40 p-5 text-left">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Siguiente paso
          </div>
          <p className="mt-1 text-[15px] text-foreground">
            Ve a la caja que te he preparado. Dentro está todo lo que es tuyo. 🎁
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Volver a empezar <span aria-hidden>↻</span>
        </button>
      </div>
    </div>
  );
}
