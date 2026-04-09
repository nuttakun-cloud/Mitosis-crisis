import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Clock, User, ArrowLeft, Loader2 } from 'lucide-react';
import { getTopScores, PlayerScore } from '../lib/game-service';

interface LeaderboardProps {
  onBack: () => void;
  currentPlayer?: { name: string; time: number };
}

export default function Leaderboard({ onBack, currentPlayer }: LeaderboardProps) {
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [loading, setLoading] = useState(true);

  // เมื่อหน้าจอเปิดขึ้นมา ให้ดึงคะแนนล่าสุดทันที
  useEffect(() => {
    const fetchScores = async () => {
      const topScores = await getTopScores();
      setScores(topScores);
      setLoading(false);
    };
    fetchScores();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full flex flex-col space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-cyan-400" />
        </button>
        <h2 className="text-xl font-black tracking-tighter uppercase">Nano-Bot Ranking</h2>
        <div className="w-10" />
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-cyan-500 gap-4">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-xs font-bold animate-pulse uppercase tracking-widest">กำลังดึงข้อมูลจากศูนย์บัญชาการ...</p>
        </div>
      ) : (
        <>
          {/* List view for Rankings */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {scores.length > 0 ? (
              scores.map((score, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-2xl border ${
                    index === 0 ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-black text-lg w-6 ${index === 0 ? 'text-yellow-500' : 'text-white/20'}`}>
                      {index + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold flex items-center gap-2">
                        {score.name}
                        {index === 0 && <Trophy className="w-3 h-3 text-yellow-500" />}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Clock className="w-3 h-3" />
                    <span className="font-mono font-bold">{score.time}s</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 text-white/20 italic uppercase text-xs">ยังไม่มีข้อมูลการปฏิบัติภารกิจ</div>
            )}
          </div>

          {/* Current Player Status Bar */}
          {currentPlayer && (
            <div className="p-5 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-3xl flex justify-between items-center shadow-2xl border-t border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black opacity-70 tracking-widest">Your Result</span>
                  <span className="text-base font-black truncate max-w-[120px]">{currentPlayer.name}</span>
                </div>
              </div>
              <div className="text-3xl font-black italic">{currentPlayer.time}s</div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
