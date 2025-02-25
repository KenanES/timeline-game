interface StatsDisplayProps {
  stats: { gamesPlayed: number; gamesWon: number; currentStreak: number; bestStreak: number };
}

export default function StatsDisplay({ stats }: StatsDisplayProps) {
  const winRate = stats.gamesPlayed > 0 ? ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(0) : "0";
  return (
    <div className="grid grid-cols-2 gap-2 text-sm text-center">
      <div>
        <p>Played</p>
        <p className="font-bold">{stats.gamesPlayed}</p>
      </div>
      <div>
        <p>Win %</p>
        <p className="font-bold">{winRate}%</p>
      </div>
      <div>
        <p>Streak</p>
        <p className="font-bold">{stats.currentStreak}</p>
      </div>
      <div>
        <p>Best</p>
        <p className="font-bold">{stats.bestStreak}</p>
      </div>
    </div>
  );
}
