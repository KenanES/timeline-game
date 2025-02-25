interface ResultDisplayProps {
  achievements: {
    perfectScore: boolean;
    speedSolve: boolean;
    hardMode: boolean;
    firstTry: boolean;
  };
  result: boolean[];
}

export default function ResultDisplay({ achievements, result }: ResultDisplayProps) {
  return (
    <div className="bg-zinc-900 p-4 rounded-lg text-center space-y-2">
      <div className="flex justify-center space-x-2">
        {achievements.perfectScore && <span className="text-2xl">👑</span>}
        {achievements.speedSolve && <span className="text-2xl">⚡</span>}
        {achievements.hardMode && <span className="text-2xl">🔥</span>}
        {achievements.firstTry && <span className="text-2xl">🎯</span>}
      </div>
      <div className="grid grid-cols-5 gap-1">
        {result.map((correct, index) => (
          <div key={index} className="flex justify-center">
            <span className="text-2xl">{correct ? "✅" : "❌"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
