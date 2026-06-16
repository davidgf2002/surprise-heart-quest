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
  correct: number | number[]; // Permite un solo índice o un array de índices válidos
  hint?: string;
};

const QUESTIONS: Question[] = [

  {
    q: "¿Cuándo empezamos a salir? (Para ir calentando)",
    options: ["17 de Marzo", "26 de Febrero", "16 de Febrero", "26 de Marzo"],
    correct: 1
  },

  {
    q: "¿Cuál es mi comida favorita?",
    options: ["Mi novia", "Macarrones", "Hamburguesa", "Lo que sea que cocine mi novia"],
    correct: [3, 2]
  },

  {
    q: "¿Cómo me conquintaste?",
    options: ["Te gusta Mari", "Todas son correctas", "Cogiéndome de la manita", "Siendo autista"],
    correct: 1
  },

  {
    q: "¿Cuál es mi canción favorita de María Becerra?",
    options: ["Automáico", "Infinitos como el mar", "Te Necesito", "Felices x Siempre"],
    correct: 2
  },

  {
    q: "¿Quién tiene siempre razón en la relación?",
    options: ["Elena, claramente", "Depende del día (Que quiera Elena)", "Losh dosh (Elena y Aurem)", "David, no cabe duda (Que esta no es)"],
    correct: 2,
    hint: "La B no es"
  },

  {
    q: "¿Dónde quiero vivir en un futuro?",
    options: ["Me da igual (Pero contigo)", "Granada (Contigo)", "Valencia (Contigo)", "Madrid (Contigo)"],
    correct: [2, 0]
  },

  {
    q: "¿Primera serie que vimos juntos?",
    options: ["Avatar", "The Mighty Nein", "Vox Machina", "Samurái de los ojos azules"],
    correct: 2
  },

  {
    q: "¿Qué personaje te gusta más?",
    options: ["Ninguno, solo tengo ojos para mi novio", "Dan Heng", "Jing Yuan", "Sunday"],
    correct: 0
  },

  {
    q: "¿Quién es a quien más quiero?",
    options: ["Todas son correctas", "Tú", "Mi novia", "Quien está leyendo esto ahora mismo"],
    correct: [0]
  }
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

    const targetCorrect = QUESTIONS[current].correct;
    // Verifica si la respuesta es correcta buscando en el array o comparando el número directo
    const isCorrect = Array.isArray(targetCorrect) 
      ? targetCorrect.includes(idx) 
      : idx === targetCorrect;

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
      <div className="flex items-center gap-2"></div>
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
        <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Un mini examen para ti
      </div>
      <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
        ¿Cuánto me<br />conoces de verdad?
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-base text-muted-foreground">
        9 preguntas rápidas. Aprueba y hay sorpresa.
      </p>
      <button
        onClick={onStart}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-[0.98]"
      >
        Empezar examen
        <span aria-hidden>→</span>
      </button>
      <p className="mt-3 text-xs text-muted-foreground">~ 2 minutos · sin hacer trampas</p>
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
          ["🚫", "Está prohibido copiar", "Será motivo de castigo."],
          ["❌", "No se permite el uso de apuntes", "Ni de ChatGPT."],
          ["🏆", "Cada acierto suma 1 punto", "Con cada fallo muere una persona aleatoria."],
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
            
            // Evalúa si este índice específico es una respuesta correcta válida
            const isCorrect = Array.isArray(question.correct)
              ? question.correct.includes(i)
              : i === question.correct;

            let state = "border-border bg-card hover:border-foreground/30 hover:bg-secondary/60";
            
            if (picked !== null) {
              if (isPicked && isCorrect) state = "border-success/60 bg-success/10";
              else if (isPicked && !isCorrect) state = "border-danger/60 bg-danger/10";
              else if (isCorrect) state = "border-success/40 bg-success/5"; // Ilumina las otras respuestas correctas válidas
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
              <span className="text-success">Let's goo ✨</span>
            ) : (
              <span className="text-danger">Muy mal...</span>
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
    if (pct < 50) return { emoji: "🫣", title: "Bueno… se puede mejorar", message: "Castigada a estudiar." };
    if (pct < 80) return { emoji: "👏", title: "Vas bastante bien", message: "Se nota que me escuchas." };
    return { emoji: "🏆", title: "Nivel stalker", message: "Me tienes calao" };
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