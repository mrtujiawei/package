export type PixelColor = Uint8ClampedArray;

export type ImageSize = {
  /**
   * 宽度
   */
  w: number;

  /**
   * 高度
   */
  h: number;
};

export type PixelCoordinate = {
  /**
   * 水平坐标
   */
  x: number;

  /**
   * 垂直坐标
   */
  y: number;
};

export const getPixel = (img: ImageData, { x, y }: PixelCoordinate) => {
  const i = y * img.width + x;
  const cellsPerColor = 4;
  return img.data.subarray(
    i * cellsPerColor,
    i * cellsPerColor + cellsPerColor
  );
};

export const setPixel = (
  img: ImageData,
  { x, y }: PixelCoordinate,
  color: PixelColor
) => {
  const i = y * img.width + x;
  const cellsPerColor = 4;
  img.data.set(color, i * cellsPerColor);
};
