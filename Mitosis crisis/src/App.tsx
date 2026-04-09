import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Trophy, Dna, Zap } from 'lucide-react';
import MitosisGameStages from './components/MitosisGameStages';
import Leaderboard from './components/Leaderboard';
import { saveScore } from './lib/game-service'; // ดึงระบบบันทึกคะแนนมาใช้งาน

type GameState = 'LANDING' | 'PROPHASE' | 'METAPHASE' | 'ANAPHASE' | 'TELOPHASE' | 'CYTOKINESIS' | 'SUMMARY' | 'LEADERBOARD';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('LANDING');
  const [playerName, setPlayerName] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finalTime, setFinalTime] = useState<number | null>(null);

  // ฟังก์ชันเริ่มภารกิจ
  const startMission = () => {
    if (playerName.trim()) {
      setStartTime(Date.now());
      setGameState('PROPHASE');
    } else {
      alert("กรุณาระบุรหัสเรียกขาน (ชื่อ) ของคุณก่อนเริ่มภารกิจ!");
    }
  };

  // ฟังก์ชันเปลี่ยนด่านและบันทึกคะแนนเมื่อจบเกม
  const nextStage = async () => {
    const sequence: GameState[] = ['PROPHASE', 'METAPHASE', 'ANAPHASE', 'TELOPHASE', 'CYTOKINESIS', 'SUMMARY'];
    const currentIndex = sequence.indexOf(gameState);
    
    if (currentIndex < sequence.length - 1) {
      const nextState = sequence[currentIndex + 1];
      setGameState(nextState);

      // ถ้าถึงหน้าสรุปผล (เล่นจบทุกด่านแล้ว)
      if (nextState === 'SUMMARY' && startTime) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        setFinalTime(timeSpent);
        
        // ส่งข้อมูลไปยังหอเกียรติยศทันที
        await saveScore(playerName, timeSpent);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white font-sans selection:bg-cyan-500/30 overflow-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-md mx-auto h-[100dvh] flex flex-col p-6">
        <AnimatePresence mode="wait">
          
          {/* 1. หน้าแรก (Landing) */}
          {gameState === 'LANDING' && (
            <motion.div key="landing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center justify-center h-full text-center space-y-8">
              <div className="relative">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-32 h-32 border-4 border-dashed border-cyan-500 rounded-full flex items-center justify-center">
                  <Dna className="w-16 h-16 text-cyan-400" />
                </motion.div>
                <div className="absolute -top-2 -right-2 bg-pink-500 p-2 rounded-lg animate-pulse"><Zap className="w-4 h-4 text-white" /></div>
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">MITOSIS <span className="text-cyan-400">CRISIS</span></h1>
                <p className="text-gray-400 text-sm uppercase tracking-[0.2em]">Nano-Bot Mission 2026</p>
              </div>
              <div className="w-full space-y-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md text-left">
                  <label className="block text-xs text-cyan-400 mb-2 uppercase font-bold tracking-widest">Pilot Identification</label>
                  <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="ENTER YOUR NAME..." className="w-full bg-transparent border-none outline-none text-xl font-bold placeholder:text-white/20 uppercase" />
                </div>
                <button onClick={startMission} className="w-full py-5 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl font-black text-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3">INITIALIZE MISSION <Rocket className="w-6 h-6" /></button>
              </div>
            </motion.div>
          )}

          {/* 2. ด่านการเล่น (Game Stages) */}
          {['PROPHASE', 'METAPHASE', 'ANAPHASE', 'TELOPHASE', 'CYTOKINESIS'].includes(gameState) && (
            <motion.div key="gameplay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
               <div className="flex justify-between items-center mb-6">
                  <div className="px-4 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/30 text-[10px] font-black uppercase tracking-widest text-cyan-400">{gameState} ACTIVE</div>
                  <div className="text-white/40 font-mono text-[10px] italic">{playerName}</div>
               </div>
               <div className="flex-1 bg-white/5 rounded-[2.5rem] border border-white/10 relative shadow-inner overflow-hidden">
                  <MitosisGameStages stage={gameState} onComplete={nextStage} />
               </div>
            </motion.div>
          )}

          {/* 3. หน้าสรุปผล (Summary) */}
          {gameState === 'SUMMARY' && (
            <motion.div key="summary" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center space-y-8">
              <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(234,179,8,0.4)] animate-bounce"><Trophy className="w-12 h-12 text-black" /></div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">Mission Accomplished!</h2>
                <p className="text-white/50 text-xs uppercase tracking-[0.3em]">Cell Repair Status: 100%</p>
              </div>
              <div className="text-7xl font-black text-cyan-400 tracking-tighter">{finalTime} <span className="text-xl text-white italic">SEC</span></div>
              <button onClick={() => setGameState('LEADERBOARD')} className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-400 transition-colors shadow-2xl">Access Hall of Fame</button>
            </motion.div>
          )}

          {/* 4. หน้ากระดานผู้นำ (Leaderboard) */}
          {gameState === 'LEADERBOARD' && (
            <Leaderboard 
              onBack={() => setGameState('LANDING')} 
              currentPlayer={finalTime ? { name: playerName, time: finalTime } : undefined} 
            />
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
