/**
 *
 * @filename packages/web-utils/src/utils/VideoUtils.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2025-01-23 15:33:37
 */

import { loadVideo } from '.';

export const getVideoFirstFrame = async (src: string) => {
  const video = await loadVideo(src);

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');
  ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
  const thumbnailUrl = canvas.toDataURL('image/png');

  return thumbnailUrl;
};
