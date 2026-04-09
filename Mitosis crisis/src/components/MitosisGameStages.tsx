import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Fingerprint, GitMerge, Info } from 'lucide-react';

const MISSION_LOGS = {
  PROPHASE: "ระยะโพรเฟส: เยื่อหุ้มนิวเคลียสสลายไป และโครมาทินขดตัวเป็นโครโมโซมที่เห็นชัดเจน",
  METAPHASE: "ระยะเมทาเฟส: โครโมโซมมาเรียงตัวกันที่กึ่งกลางเซลล์ (Metaphase Plate) เตรียมพร้อมแยกตัว",
  ANAPHASE: "ระยะแอนาเฟส: โครมาทิดพี่น้องถูกดึงแยกออกจากกันไปยังขั้วเซลล์คนละด้าน",
  TELOPHASE: "ระยะเทโลเฟส: สร้างเยื่อหุ้มนิวเคลียสขึ้นมาใหม่รอบๆ โครโมโซมทั้งสองกลุ่ม",
  CYTOKINESIS: "ระยะไซโทคิเนซิส: การแบ่งไซโทพลาซึมเพื่อให้ได้เซลล์ใหม่ 2 เซลล์ที่สมบูรณ์"
};

const CHROMO_COLORS = ['#22d3ee', '#818cf8', '#f472b6', '#fbbf24'];

interface StageProps {
  onComplete: () => void;
  stage: string;
}

export default function MitosisGameStages({ stage, onComplete }: StageProps) {
  const [taskProgress, setTaskProgress] = useState(0);
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    setTaskProgress(0);
    setShowLog(true);
    const timer = setTimeout(() => setShowLog(false), 4000);
    return () => clearTimeout(timer);
  }, [stage]);

  // ฟังก์ชันส่วนกลางสำหรับจบด่านพร้อมเอฟเฟกต์
  const finishStage = () => {
    setTaskProgress(100);
    setTimeout(() => {
      onComplete();
    }, 600); // รอให้ผู้เล่นเห็นความสำเร็จนิดนึงก่อนข้ามด่าน
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 overflow-hidden">
      
      {/* Mission Log Tooltip */}
      <motion.div 
        animate={{ y: showLog ? 0 : -120, opacity: showLog ? 1 : 0 }}
        className="absolute top-4 left-4 right-4 bg-cyan-950/90 border border-cyan-500/50 p-4 rounded-2xl backdrop-blur-xl z-50 flex gap-3 items-start shadow-2xl"
      >
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-sm leading-snug text-cyan-50 font-medium">{MISSION_LOGS[stage as keyof typeof MISSION_LOGS]}</p>
      </motion.div>

      <div className="flex-1 w-full flex items-center justify-center relative">
        
        {/* Stage 1: Prophase */}
        {stage === 'PROPHASE' && (
          <div className="relative flex items-center justify-center">
            <motion.div 
              animate={{ 
                scale: 1 - (taskProgress / 100), 
                opacity: 1 - (taskProgress / 100),
                rotate: taskProgress * 2
              }}
              className="w-64 h-64 border-4 border-dashed border-pink-500 rounded-full flex items-center justify-center bg-pink-500/5 shadow-[0_0_30px_rgba(236,72,153,0.2)]"
            >
              <Fingerprint className="w-12 h-12 text-pink-500 animate-pulse" />
            </motion.div>
            
            <div className="absolute grid grid-cols-2 gap-4">
              {CHROMO_COLORS.map((color, i) => (
                <motion.div 
                  key={i}
                  animate={{ scale: taskProgress > 50 ? 1.2 : 1, rotate: i * 45 }}
                  className="w-12 h-4 rounded-full"
                  style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}` }}
                />
              ))}
            </div>

            <button 
              onClick={() => {
                const next = taskProgress + 25;
                if (next >= 100) finishStage();
                else setTaskProgress(next);
              }}
              className="absolute inset-0 z-10"
            />
            <p className="absolute -bottom-16 text-pink-400 text-[10px] font-bold tracking-widest animate-bounce uppercase bg-pink-500/10 px-4 py-1 rounded-full">แตะรัวๆ เพื่อสลายเยื่อหุ้ม!</p>
          </div>
        )}

        {/* Stage 2: Metaphase */}
        {stage === 'METAPHASE' && (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-12">
            <div className="h-1 w-full bg-cyan-500/30 relative shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-cyan-400 font-black tracking-tighter bg-[#020617] px-3 border border-cyan-500/30 rounded-full">METAPHASE PLATE</div>
            </div>
            
            <div className="flex gap-4">
              {CHROMO_COLORS.map((color, i) => (
                <motion.div
                  key={i}
                  drag="y"
                  dragConstraints={{ top: -80, bottom: 80 }}
                  onDragEnd={(_, info) => {
                    if (Math.abs(info.point.y - window.innerHeight/2) < 60) {
                      const next = taskProgress + 25;
                      if (next >= 100) finishStage();
                      else setTaskProgress(next);
                    }
                  }}
                  whileDrag={{ scale: 1.3, zIndex: 50 }}
                  className="w-8 h-24 rounded-full cursor-grab active:cursor-grabbing relative flex items-center justify-center"
                  style={{ backgroundColor: color, boxShadow: `0 0 25px ${color}` }}
                >
                  <div className="w-4 h-4 bg-white/40 rounded-full blur-[2px]" />
                </motion.div>
              ))}
            </div>
            <p className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase">ลากโครโมโซมมาที่เส้นกึ่งกลาง!</p>
          </div>
        )}

        {/* Stage 3: Anaphase */}
        {stage === 'ANAPHASE' && (
          <div className="w-full flex flex-col items-center justify-around h-72">
            <div className="flex flex-col gap-12 w-full items-center">
              {[1, -1].map((dir) => (
                <motion.div 
                  key={dir}
                  animate={{ y: (taskProgress / 100) * 120 * dir }}
                  className="flex gap-6"
                >
                  {CHROMO_COLORS.map((color, i) => (
                    <div 
                      key={i} 
                      className="w-5 h-12 rounded-full" 
                      style={{ 
                        backgroundColor: color, 
                        boxShadow: `0 0 15px ${color}`,
                        borderRadius: dir > 0 ? '4px 4px 20px 20px' : '20px 20px 4px 4px'
                      }} 
                    />
                  ))}
                </motion.div>
              ))}
            </div>
            
            <button 
              onClick={() => {
                const next = taskProgress + 20;
                if (next >= 100) finishStage();
                else setTaskProgress(next);
              }}
              className="px-10 py-4 bg-indigo-600 rounded-2xl font-black text-sm shadow-[0_10px_20px_rgba(79,70,229,0.4)] active:scale-90 transition-transform uppercase tracking-widest border-b-4 border-indigo-800"
            >
              PULL FIBERS!
            </button>
          </div>
        )}

        {/* Stage 4: Telophase */}
        {stage === 'TELOPHASE' && (
          <div className="w-full flex flex-col items-center justify-center gap-10 py-10">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0.3 }}
                animate={{ 
                  scale: taskProgress >= 100 ? 1 : 0.85,
                  opacity: taskProgress >= 100 ? 1 : 0.4,
                  borderColor: taskProgress >= 100 ? '#22d3ee' : '#ffffff20',
                  borderStyle: taskProgress >= 100 ? 'solid' : 'dashed'
                }}
                className="w-36 h-36 border-2 rounded-full flex items-center justify-center bg-cyan-500/5 shadow-[0_0_40px_rgba(34,211,238,0.1)]"
              >
                <div className="grid grid-cols-2 gap-2">
                   {CHROMO_COLORS.map((c, idx) => <div key={idx} className="w-5 h-1.5 bg-white/20 rounded-full" />)}
                </div>
              </motion.div>
            ))}

            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                // แก้ไข: เพิ่มการสั่งให้จบด่านเมื่อกดปุ่ม
                setTaskProgress(100);
                setTimeout(finishStage, 500);
              }}
              className="w-16 h-16 bg-cyan-900/40 rounded-full border-2 border-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] group hover:bg-cyan-500 transition-colors"
            >
              <GitMerge className="text-cyan-400 group-hover:text-white transition-colors" />
            </motion.button>
            <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em]">คลิกเพื่อสร้างนิวเคลียสใหม่</p>
          </div>
        )}

        {/* Stage 5: Cytokinesis */}
        {stage === 'CYTOKINESIS' && (
          <div className="w-full flex flex-col items-center gap-16">
            <div className="relative flex items-center justify-center w-full h-48">
              <motion.div 
                animate={{ 
                  width: 280 - (taskProgress * 1.5),
                  borderRadius: taskProgress > 50 ? '50%' : '80px',
                  gap: taskProgress + 'px'
                }}
                className="h-36 bg-cyan-500/10 border-4 border-cyan-500/40 flex items-center justify-center overflow-hidden p-4"
              >
                <div className="w-14 h-14 bg-white/10 rounded-full border border-white/20 shadow-inner" />
                <div className="w-14 h-14 bg-white/10 rounded-full border border-white/20 shadow-inner" />
              </motion.div>
            </div>
            
            <div className="w-3/4 space-y-4">
              <input 
                type="range" 
                min="0" max="100" 
                value={taskProgress}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setTaskProgress(val);
                  if(val === 100) finishStage();
                }}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <p className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase text-center">รูดเพื่อแบ่งเซลล์ให้ขาดจากกัน!</p>
            </div>
          </div>
        )}

      </div>

      {/* --- Progress Bar (Bottom) --- */}
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-4 border border-white/10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${taskProgress}%` }}
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
        />
      </div>

    </div>
  );
}
