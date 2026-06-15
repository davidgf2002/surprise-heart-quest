import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Un regalo para ti 💝" },
      { name: "description", content: "Una sorpresa romántica gamificada hecha con cariño." },
      { property: "og:title", content: "Un regalo para ti 💝" },
      { property: "og:description", content: "Supera el reto y desbloquea tu recompensa." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;1,9..144,600&display=swap",
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
  { q: "¿Dónde fue nuestra primera cita?", options: ["En un café ☕", "En el cine 🎬", "Dando una vuelta 🌙", "Tú dime, yo ya no me acuerdo 😅"], correct: 0 },
  { q: "¿Qué comida me gusta más?", options: ["Pasta 🍝", "Pizza 🍕", "Sushi 🍣", "Cualquier cosa que cocines tú 💘"], correct: 3 },
  { q: "¿Qué día empezamos a hablar?", options: ["Un lunes cualquiera", "El mejor día de mi vida", "No lo recuerdo 🙈", "El día que dejé de aburrirme"], correct: 1 },
  { q: "¿Cuál es mi serie/peli favorita?", options: ["La que vemos juntos 🍿", "Una random de Netflix", "Friends, obvio", "Esa que siempre repito"], correct: 0 },
  { q: "¿Qué hago cuando tengo hambre?", options: ["Me enfado 😤", "Me callo 🤐", "Lo digo 🗣️", "Todas las anteriores ✅"], correct: 3 },
  { q: "¿Cuál es mi estado más habitual?", options: ["Productivo 💼", "Dormido 😴", "Pensando en ti 💭", "Procrastinando 🫠"], correct: 2 },
  { q: "¿Qué estoy pensando ahora mismo?", options: ["En ti ❤️", "En comida 🍕", "En dormir 😴", "Todas son correctas ✨"], correct: 3 },
  { q: "¿Cuántas veces he dicho 'no tengo hambre' y sí tenía?", options: ["Pocas, soy honesto", "Algunas 🙃", "Muchísimas 😂", "He perdido la cuenta"], correct: 3 },
  { q: "¿Cuál es mi debilidad secreta?", options: ["El chocolate 🍫", "Dormir hasta tarde", "Tú 💞", "Las series malas"], correct: 2, hint: "Pista: empieza por T y termina por Ú 😉" },
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
    }, 1100);
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:py-12">
      <FloatingHearts />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl items-center justify-center">
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
    </main>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-slide-up text-center">
      <div className="mb-6 inline-block animate-pop-in text-7xl sm:text-8xl">💝</div>
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-tight text-foreground sm:text-5xl">
        Una sorpresa<br />para ti
      </h1>
      <p className="mx-auto mt-6 max-w-md text-lg text-muted-foreground">
        Antes de desbloquear tu recompensa… tienes que superar un pequeño reto 😏
      </p>
      <button
        onClick={onStart}
        className="animate-pulse-glow mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-romantic px-10 py-4 text-lg font-semibold text-primary-foreground shadow-romantic transition-transform hover:scale-105 active:scale-95"
      >
        Empezar <span aria-hidden>→</span>
      </button>
    </div>
  );
}

function Explain({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="animate-slide-up rounded-3xl bg-gradient-card p-8 text-center shadow-romantic sm:p-12">
      <div className="mb-4 text-6xl">🧠💕</div>
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-foreground">
        Las reglas son simples
      </h2>
      <p className="mt-4 text-base text-muted-foreground sm:text-lg">
        Responde estas preguntas para demostrar cuánto sabes…<br />
        <span className="font-semibold text-foreground">o cuánto te inventas 😌</span>
      </p>
      <ul className="mx-auto mt-6 max-w-xs space-y-2 text-left text-sm text-muted-foreground">
        <li>❤️ Habrá preguntas reales</li>
        <li>😂 Habrá preguntas absurdas</li>
        <li>🎁 Y al final… una sorpresa</li>
      </ul>
      <button
        onClick={onContinue}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-romantic px-10 py-4 font-semibold text-primary-foreground shadow-romantic transition-transform hover:scale-105 active:scale-95"
      >
        Continuar <span aria-hidden>→</span>
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
  const progress = ((index) / total) * 100;
  return (
    <div className={`w-full animate-slide-up ${feedback === "wrong" ? "animate-shake" : ""}`}>
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-muted-foreground">
          <span>Pregunta {index + 1} / {total}</span>
          <span>💖</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-romantic transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-card p-6 shadow-romantic sm:p-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold leading-snug text-foreground sm:text-3xl">
          {question.q}
        </h2>
        {question.hint && (
          <p className="mt-2 text-sm italic text-muted-foreground">{question.hint}</p>
        )}
        <div className="mt-6 space-y-3">
          {question.options.map((opt, i) => {
            const isPicked = picked === i;
            const isCorrect = i === question.correct;
            let state = "border-border bg-card hover:border-primary hover:bg-secondary/60";
            if (picked !== null) {
              if (isPicked && isCorrect) state = "border-emerald-400 bg-emerald-50 scale-[1.02]";
              else if (isPicked && !isCorrect) state = "border-rose-400 bg-rose-50";
              else if (isCorrect) state = "border-emerald-300 bg-emerald-50/60";
              else state = "border-border bg-card opacity-60";
            }
            return (
              <button
                key={i}
                disabled={picked !== null}
                onClick={() => onPick(i)}
                className={`flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-left text-base font-medium text-foreground transition-all active:scale-[0.98] ${state}`}
              >
                <span>{opt}</span>
                {picked !== null && isCorrect && <span className="text-xl">✓</span>}
                {isPicked && !isCorrect && <span className="text-xl">✗</span>}
              </button>
            );
          })}
        </div>
        {feedback && (
          <p className="mt-5 animate-pop-in text-center text-base font-semibold">
            {feedback === "correct" ? (
              <span className="text-emerald-600">¡Correcto! Te conoces bien 💘</span>
            ) : (
              <span className="text-rose-500">Casi… pero igual te quiero 😘</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

function Result({ score, total }: { score: number; total: number }) {
  const pct = Math.round((score / total) * 100);
  const { title, message } = useMemo(() => {
    if (pct < 50) return { title: "Necesitas más sesiones de actualización conmigo 😌", message: "Pero tranquila, te las daré yo en persona." };
    if (pct < 80) return { title: "Vas muy bien ❤️", message: "Casi me conoces de memoria." };
    return { title: "Nivel experto en mí desbloqueado 🏆", message: "Oficialmente sabes más de mí que yo mismo." };
  }, [pct]);

  return (
    <div className="relative w-full text-center">
      <Confetti />
      <div className="animate-pop-in relative z-10 rounded-3xl bg-gradient-card p-8 shadow-glow-pink sm:p-12">
        <div className="text-7xl">🎁</div>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold text-foreground sm:text-4xl">
          Has desbloqueado tu recompensa
        </h2>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">{title}</p>

        <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-secondary-foreground">
          Puntuación: {score} / {total} <span>·</span> {pct}%
        </div>

        <div className="mt-8 rounded-2xl border-2 border-dashed border-primary/40 bg-background/60 p-6">
          <p className="text-base text-foreground sm:text-lg">
            Ve a la caja que te he preparado.<br />
            <span className="font-semibold">Dentro está todo lo que es tuyo. 💝</span>
          </p>
          <p className="mt-3 text-xs italic text-muted-foreground">{message}</p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-romantic px-10 py-4 font-semibold text-primary-foreground shadow-romantic transition-transform hover:scale-105 active:scale-95"
        >
          Finalizar 💞
        </button>
      </div>
    </div>
  );
}

function FloatingHearts() {
  const hearts = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 10 + Math.random() * 8,
      size: 14 + Math.random() * 22,
      emoji: ["💗", "💖", "💕", "🌸", "✨"][i % 5],
    })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animation: `float-heart ${h.duration}s linear ${h.delay}s infinite`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}

function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2.5 + Math.random() * 2.5,
      color: ["#ffb3c6", "#ffd6a5", "#fdffb6", "#caffbf", "#bdb2ff", "#ffc6ff"][i % 6],
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 360,
    })),
  );
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute block rounded-sm"
          style={{
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.size * 1.4,
            background: p.color,
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
