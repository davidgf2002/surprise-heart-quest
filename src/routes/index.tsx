import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quiz · Acceso restringido" },
      { name: "description", content: "Un pequeño test antes de desbloquear lo que sigue." },
      { property: "og:title", content: "Quiz · Acceso restringido" },
      { property: "og:description", content: "Responde correctamente para continuar." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
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
    }, 950);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 py-6">
        <Header stage={stage} current={current} total={total} score={score} />
        <div className="flex flex-1 items-center justify-center py-8">
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
        <footer className="pt-4 text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          v1.0 · build 2026.06
        </footer>
      </div>
    </main>
  );
}

function Header({ stage, current, total, score }: { stage: Stage; current: number; total: number; score: number }) {
  const showProgress = stage === "quiz" || stage === "result";
  const progress = stage === "result" ? 100 : (current / total) * 100;
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border pb-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background">
          <span className="font-mono text-xs font-bold">Q</span>
        </div>
        <span className="text-sm font-semibold tracking-tight">quiz.app</span>
      </div>
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {showProgress ? (
          <>
            <span>{Math.min(current + (stage === "result" ? 0 : 1), total)}/{total}</span>
            <div className="h-1 w-20 overflow-hidden rounded-full bg-secondary">
              <div className="h-full bg-foreground transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span>{score} pt</span>
          </>
        ) : (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            ready
          </span>
        )}
      </div>
    </header>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-fade-in w-full">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground shadow-soft">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" /> acceso restringido
      </div>
      <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
        Un test rápido<br />
        <span className="text-muted-foreground">antes de continuar.</span>
      </h1>
      <p className="mt-5 max-w-md text-base text-muted-foreground">
        9 preguntas. Sin trampas (casi). Si apruebas, hay recompensa física esperándote.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={onStart}
          className="group inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90 active:scale-[0.98]"
        >
          Empezar
          <span className="font-mono opacity-70 transition-transform group-hover:translate-x-0.5">→</span>
        </button>
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          ~ 2 min
        </span>
      </div>
    </div>
  );
}

function Explain({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="animate-fade-in w-full rounded-2xl border border-border bg-card p-7 shadow-card sm:p-9">
      <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        Instrucciones
      </div>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        Cómo funciona
      </h2>
      <ul className="mt-6 divide-y divide-border">
        {[
          ["01", "Preguntas reales. Demuestra que prestas atención."],
          ["02", "Alguna pregunta absurda. Improvisa."],
          ["03", "Al final hay una sorpresa. Sin spoilers."],
        ].map(([n, t]) => (
          <li key={n} className="flex items-start gap-4 py-3">
            <span className="font-mono text-xs text-muted-foreground">{n}</span>
            <span className="text-sm text-foreground">{t}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onContinue}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90 active:scale-[0.99] sm:w-auto"
      >
        Continuar <span className="font-mono opacity-70">→</span>
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
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <span>Pregunta {String(index + 1).padStart(2, "0")}</span>
          <span>/ {String(total).padStart(2, "0")}</span>
        </div>
        <h2 className="mt-3 text-balance text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-[26px]">
          {question.q}
        </h2>
        {question.hint && (
          <p className="mt-2 font-mono text-xs text-muted-foreground">// {question.hint}</p>
        )}
        <div className="mt-6 space-y-2">
          {question.options.map((opt, i) => {
            const isPicked = picked === i;
            const isCorrect = i === question.correct;
            let state = "border-border bg-card hover:border-foreground/40 hover:bg-secondary";
            let badgeState = "border-border text-muted-foreground group-hover:border-foreground/50 group-hover:text-foreground";
            if (picked !== null) {
              if (isPicked && isCorrect) {
                state = "border-success/60 bg-success/5";
                badgeState = "border-success/60 bg-success/10 text-success";
              } else if (isPicked && !isCorrect) {
                state = "border-danger/60 bg-danger/5";
                badgeState = "border-danger/60 bg-danger/10 text-danger";
              } else if (isCorrect) {
                state = "border-success/40 bg-success/5";
                badgeState = "border-success/40 text-success";
              } else {
                state = "border-border bg-card opacity-50";
                badgeState = "border-border text-muted-foreground";
              }
            }
            const letter = String.fromCharCode(65 + i);
            return (
              <button
                key={i}
                disabled={picked !== null}
                onClick={() => onPick(i)}
                className={`group flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-[15px] font-medium text-foreground transition-all active:scale-[0.995] ${state}`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-[11px] transition-colors ${badgeState}`}
                >
                  {letter}
                </span>
                <span className="flex-1">{opt}</span>
                {picked !== null && isCorrect && <span className="font-mono text-xs text-success">✓</span>}
                {isPicked && !isCorrect && <span className="font-mono text-xs text-danger">✗</span>}
              </button>
            );
          })}
        </div>
        {feedback && (
          <div className="animate-pop-in mt-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest">
            {feedback === "correct" ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                <span className="text-success">correct · te conoces bien</span>
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                <span className="text-danger">incorrect · acepto la decepción</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Result({ score, total }: { score: number; total: number }) {
  const pct = Math.round((score / total) * 100);
  const { tag, title, message } = useMemo(() => {
    if (pct < 50) return { tag: "rookie", title: "Necesitas una actualización.", message: "Tranquila, te la doy yo en persona." };
    if (pct < 80) return { tag: "intermediate", title: "Vas bastante bien.", message: "Casi me conoces de memoria." };
    return { tag: "expert", title: "Nivel experto desbloqueado.", message: "Oficialmente sabes más de mí que yo." };
  }, [pct]);

  return (
    <div className="animate-fade-in w-full">
      <div className="rounded-2xl border border-border bg-card p-7 shadow-card sm:p-9">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            completed
          </div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            tier: {tag}
          </div>
        </div>

        <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="mt-2 text-muted-foreground">{message}</p>

        <div className="mt-6 grid grid-cols-3 divide-x divide-border overflow-hidden rounded-xl border border-border bg-background">
          <Stat label="score" value={`${score}/${total}`} />
          <Stat label="accuracy" value={`${pct}%`} />
          <Stat label="status" value="passed" />
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-border bg-secondary/40 p-5">
          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Siguiente paso
          </div>
          <p className="mt-1 text-[15px] text-foreground">
            Ve a la caja que te he preparado. Dentro está todo lo que es tuyo.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:w-auto"
        >
          Reiniciar <span className="font-mono opacity-70">↻</span>
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold tracking-tight text-foreground">{value}</div>
    </div>
  );
}
