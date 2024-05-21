/**
 * Content-Aware Scale
 *
 * @link {https://github.com/trekhleb/js-image-carver}
 * @filename packages/web-utils/src/utils/imageResize/index.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-05-21 13:38:26
 */

import {
  ImageSize,
  PixelColor,
  PixelCoordinate,
  getPixel,
  setPixel,
} from './utils';

const matrix = <T>(w: number, h: number, filler: T) => {
  return new Array(h).fill(null).map(() => {
    return new Array<T>(w).fill(filler);
  });
};

const getPixelEnergy = (
  left: PixelColor,
  middle: PixelColor,
  right: PixelColor
) => {
  const [mR, mG, mB] = middle;

  let lEnergy = 0;
  if (left) {
    const [lR, lG, lB] = left;
    lEnergy = (lR - mR) ** 2 + (lG - mG) ** 2 + (lB - mB) ** 2;
  }

  let rEnergy = 0;
  if (right) {
    const [rR, rG, rB] = right;
    rEnergy = (rR - mR) ** 2 + (rG - mG) ** 2 + (rB - mB) ** 2;
  }

  return Math.sqrt(lEnergy + rEnergy);
};

const calculateEnergyMap = (img: ImageData, { w, h }: ImageSize) => {
  const energyMap = matrix(w, h, Infinity);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const left = x - 1 >= 0 ? getPixel(img, { x: x - 1, y }) : null;
      const middle = getPixel(img, { x, y });
      const right = x + 1 < w ? getPixel(img, { x: x + 1, y }) : null;
      energyMap[y][x] = getPixelEnergy(left!, middle, right!);
    }
  }
  return energyMap;
};

const findLowEnergySeam = (
  energyMap: number[][],
  { w, h }: { w: number; h: number }
) => {
  type SeamPixelItem = {
    energy: number;
    coordinate: PixelCoordinate;
    // 距离此点最低能量接缝的前一个像素
    previous: PixelCoordinate | null;
  };
  const seamPixelsMap = matrix<SeamPixelItem>(w, h, null!);

  for (let x = 0; x < w; x++) {
    const y = 0;
    seamPixelsMap[y][x] = {
      energy: energyMap[y][x],
      coordinate: { x, y },
      previous: null,
    };
  }

  for (let y = 1; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // 能量最低的路径
      let minPrevEnergy = Infinity;
      let minPrevX = x;
      for (let i = x - 1; i <= x + 1; i += 1) {
        if (i >= 0 && i < w && seamPixelsMap[y - 1][i].energy < minPrevEnergy) {
          minPrevEnergy = seamPixelsMap[y - 1][i].energy;
          minPrevX = i;
        }
      }

      seamPixelsMap[y][x] = {
        energy: minPrevEnergy + energyMap[y][x],
        coordinate: { x, y },
        previous: { x: minPrevX, y: y - 1 },
      };
    }
  }

  let lastMinCoordinate = null;
  let minSeamEnergy = Infinity;
  for (let x = 0; x < w; x += 1) {
    const y = h - 1;
    if (seamPixelsMap[y][x].energy < minSeamEnergy) {
      minSeamEnergy = seamPixelsMap[y][x].energy;
      lastMinCoordinate = { x, y };
    }
  }

  const seam: PixelCoordinate[] = [];

  const { x: lastMinX, y: lastMinY } = lastMinCoordinate!;

  let currentSeam = seamPixelsMap[lastMinY][lastMinX];
  while (currentSeam) {
    seam.push(currentSeam.coordinate);
    const prevMinCoordinates = currentSeam.previous;
    if (!prevMinCoordinates) {
      currentSeam = null!;
    } else {
      const { x: prevMinX, y: prevMinY } = prevMinCoordinates;
      currentSeam = seamPixelsMap[prevMinY][prevMinX];
    }
  }

  return seam;
};

const deleteSeam = (
  img: ImageData,
  seam: PixelCoordinate[],
  { w }: { w: number; h: number }
) => {
  seam.forEach(({ x: seamX, y: seamY }) => {
    for (let x = seamX; x < w - 1; x++) {
      const nextPixel = getPixel(img, { x: x + 1, y: seamY });
      setPixel(img, { x, y: seamY }, nextPixel);
    }
  });
};

const ImageResizer = (img: ImageData, toWidth: number) => {
  const size = { w: img.width, h: img.height };
  const pxToRemove = img.width - toWidth;

  for (let i = 0; i < pxToRemove; i++) {
    // 1. 计算当前版本的能量
    const energyMap = calculateEnergyMap(img, size);

    // 2. 找能量低的接缝
    const seam = findLowEnergySeam(energyMap, size);

    // 3. 删除能量低的接缝
    deleteSeam(img, seam, size);
    size.w -= 1;
  }

  return { img, size };
};

export default ImageResizer;
