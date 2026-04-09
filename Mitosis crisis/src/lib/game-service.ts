import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";

// โครงสร้างข้อมูลคะแนน
export interface PlayerScore {
  name: string;
  time: number;
  timestamp?: any;
}

// 1. ฟังก์ชัน "ส่งคะแนน" ขึ้นไปยังฐานข้อมูล
export const saveScore = async (name: string, time: number) => {
  try {
    await addDoc(collection(db, "scores"), {
      name: name,
      time: time,
      timestamp: serverTimestamp(),
    });
    console.log("บันทึกภารกิจสำเร็จ!");
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการบันทึก:", error);
  }
};

// 2. ฟังก์ชัน "ดึงคะแนน" 5 อันดับที่เร็วที่สุด (เวลาน้อยที่สุด)
export const getTopScores = async (): Promise<PlayerScore[]> => {
  try {
    const scoresRef = collection(db, "scores");
    // จัดเรียงตามเวลา (น้อยไปมาก) และเอาแค่ 5 คนแรก
    const q = query(scoresRef, orderBy("time", "asc"), limit(5));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data()
    } as PlayerScore));
  } catch (error) {
    console.error("ไม่สามารถดึงข้อมูลคะแนนได้:", error);
    return [];
  }
};
