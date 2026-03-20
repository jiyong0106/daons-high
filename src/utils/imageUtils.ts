import { GRID_SIZE, TOTAL_TILES } from "./puzzleUtils";

// 로컬 고양이 이미지 목록 (da*.png, ra*.png)
const CAT_IMAGE_MODULES = import.meta.glob<{ default: string }>(
  "../assets/images/*.png",
  { eager: true },
);

// 이미지 경로 배열로 변환
const CAT_IMAGES: string[] = Object.values(CAT_IMAGE_MODULES).map(
  (mod) => mod.default,
);

/**
 * 이미지 경로에서 고양이 이름(다온/라온)을 추출.
 * 파일명에 'da'가 포함되면 다온, 'ra'가 포함되면 라온.
 */
export function getCatNameFromPath(path: string): string {
  const filename = path.split("/").pop()?.toLowerCase() || "";
  if (filename.includes("da")) return "다온";
  if (filename.includes("ra")) return "라온";
  return "고양이";
}

/**
 * 랜덤 고양이 이미지 경로 반환.
 * 이전 이미지와 다른 이미지를 보장.
 */
export function getRandomCatImage(previousImage?: string | null): string {
  if (CAT_IMAGES.length === 0) {
    throw new Error(
      "고양이 이미지가 없습니다. src/assets/images/ 폴더를 확인하세요.",
    );
  }

  if (CAT_IMAGES.length === 1) return CAT_IMAGES[0];

  let image: string;
  do {
    image = CAT_IMAGES[Math.floor(Math.random() * CAT_IMAGES.length)];
  } while (image === previousImage);

  return image;
}

/**
 * 이미지 URL을 HTMLImageElement로 로드.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`이미지 로드 실패: ${src}`));
    img.src = src;
  });
}

/**
 * 이미지를 3x3 타일로 슬라이싱.
 * 이미 1080x1080 정사각형이므로 크롭은 생략.
 * 각 타일은 360x360 크기의 data URL로 반환.
 *
 * @param imageSrc 원본 이미지 경로
 * @returns 9개 타일의 data URL 배열
 */
export async function sliceImage(imageSrc: string): Promise<string[]> {
  const img = await loadImage(imageSrc);

  // 정사각형 기준 크기 (짧은 변 기준)
  const size = Math.min(img.width, img.height);
  const tileSize = size / GRID_SIZE;

  // 중앙 크롭 오프셋
  const offsetX = (img.width - size) / 2;
  const offsetY = (img.height - size) / 2;

  const tiles: string[] = [];

  for (let i = 0; i < TOTAL_TILES; i++) {
    const row = Math.floor(i / GRID_SIZE);
    const col = i % GRID_SIZE;

    const canvas = document.createElement("canvas");
    canvas.width = tileSize;
    canvas.height = tileSize;
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Canvas 2D 컨텍스트를 가져올 수 없습니다.");

    ctx.drawImage(
      img,
      offsetX + col * tileSize, // 소스 x
      offsetY + row * tileSize, // 소스 y
      tileSize, // 소스 width
      tileSize, // 소스 height
      0, // 캔버스 x
      0, // 캔버스 y
      tileSize, // 캔버스 width
      tileSize, // 캔버스 height
    );

    tiles.push(canvas.toDataURL("image/webp", 0.9));
  }

  return tiles;
}

/**
 * 전체 고양이 이미지 수 반환.
 */
export function getTotalImages(): number {
  return CAT_IMAGES.length;
}
