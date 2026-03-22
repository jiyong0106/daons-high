import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM 환경에서는 __dirname이 없으므로 직접 정의해야 합니다.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, "../src/assets/images");

async function convertImages() {
  try {
    // 폴더 존재 여부 확인
    try {
      await fs.access(inputDir);
    } catch {
      console.error("❌ 폴더를 찾을 수 없습니다:", inputDir);
      return;
    }

    const files = await fs.readdir(inputDir);
    const targetFiles = files.filter((file) => /\.(png|jpe?g)$/i.test(file));

    if (targetFiles.length === 0) {
      console.log("📂 변환할 이미지가 없습니다.");
      return;
    }

    console.log(`📂 총 ${targetFiles.length}개의 이미지 변환을 시작합니다...`);

    let count = 0;
    for (const file of targetFiles) {
      const inputPath = path.join(inputDir, file);
      const { name } = path.parse(file);
      const outputPath = path.join(inputDir, `${name}.webp`);

      // 1. 이미 변환된 파일이 있는지 체크 (덮어쓰고 싶다면 이 try-catch 블록 삭제)
      try {
        await fs.access(outputPath);
        continue;
      } catch {
        // 파일이 없으면 정상 진행
      }

      // 2. 변환 실행
      await sharp(inputPath)
        .webp({
          quality: 80,
          effort: 6,
        })
        .toFile(outputPath);

      count++;
      console.log(
        `✅ [${count}/${targetFiles.length}] 변환 완료: ${file} -> ${name}.webp`,
      );
    }

    console.log(`✨ 작업 완료! (새로 변환됨: ${count}개)`);
  } catch (err) {
    console.error("❌ 에러 발생:", err);
  }
}

convertImages();
