import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";

const OLD_STORAGE_KEY = "daons_high_user_id";

/**
 * 로컬 스토리지에 남아있는 이전 아이디(UUID) 기록을 새로운 Firebase UID로 통합합니다.
 * @param newUid Firebase 익명 로그인을 통해 발급받은 새로운 UID
 */
export const migrateUserRecords = async (newUid: string): Promise<void> => {
  const oldId = localStorage.getItem(OLD_STORAGE_KEY);

  // 이전 아이디가 없으면 마이그레이션 불필요
  if (!oldId || oldId === newUid) return;

  console.log(`🚀 데이터 유산 이관 시작: ${oldId} -> ${newUid}`);

  try {
    const rankingsRef = collection(db, "rankings");
    const q = query(rankingsRef, where("user_id", "==", oldId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("ℹ️ 이전할 수 있는 과거 기록이 없습니다.");
      localStorage.removeItem(OLD_STORAGE_KEY);
      return;
    }

    // 대량 작업을 위한 배치(Batch) 생성
    const batch = writeBatch(db);

    querySnapshot.forEach((oldDoc) => {
      const data = oldDoc.data();
      const gridSize = data.grid_size;
      const newDocId = `${newUid}_${gridSize}`;
      const newDocRef = doc(db, "rankings", newDocId);

      // 1. 새로운 UID로 데이터 생성 (또는 덮어쓰기)
      batch.set(
        newDocRef,
        {
          ...data,
          user_id: newUid,
          updated_at: serverTimestamp(),
        },
        { merge: true },
      );

      // 2. 기존 데이터 삭제
      batch.delete(oldDoc.ref);
    });

    // 배치 실행
    await batch.commit();

    console.log(
      `✅ ${querySnapshot.size}개의 기록이 성공적으로 새 계정으로 통합되었습니다.`,
    );

    // 이관 성공 시 로컬 스토리지 비우기
    localStorage.removeItem(OLD_STORAGE_KEY);
  } catch (error) {
    console.error("❌ 데이터 유산 이관 중 오류 발생:", error);
  }
};
