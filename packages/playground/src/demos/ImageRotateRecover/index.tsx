/**
 * 图片翻转恢复
 * @filename: packages/playground/src/demos/ImageRotateRecover/index.tsx
 * @author: Mr Prince
 * @date: 2022-11-04 11:51:42
 */
import { ChangeEventHandler, useEffect, useRef } from 'react';
import { rotateRecover } from '@mrtujiawei/web-utils';
import './index.less';

const ImageRotateRecover = () => {
  const src = 'https://a.xingqiu.tv/test/1.jpg';
  const handleChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files![0];
    const result = await rotateRecover(file);
    console.log({ result });
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 300;
      canvas.height = 400;
      const context = canvas.getContext('2d');

      if (context) {
        const image = new Image(300, 400);
        image.onload = () => {
          alert(`canvasWidth: ${canvas.width}, canvasHeight: ${canvas.height}`);
          // 顺时针旋转(度)
          let type = 0;
          if (type == 0) {
            // 0
            context.rotate(0);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
          } else if (type == 1) {
            // 90
            context.rotate(Math.PI / 2);
            context.drawImage(image, 0, 0, canvas.width, -canvas.height);
          } else if (type == 2) {
            // 180
            context.rotate(Math.PI);
            context.drawImage(image, 0, 0, -canvas.width, -canvas.height);
          } else if (type == 3) {
            // 270
            context.rotate((3 / 2) * Math.PI);
            context.drawImage(image, 0, 0, -canvas.width, canvas.height);
          } else if (type == 4) {
            // 镜像水平翻转
            context.scale(-1, 1);
            context.drawImage(image, 0, 0, -canvas.width, canvas.height);
          } else if (type == 5) {
            // 镜像垂直翻转
            context.scale(1, -1);
            context.drawImage(image, 0, 0, canvas.width, -canvas.height);
          } else if (type == 6) {
            // 90 + 镜像水平翻转
            context.rotate(Math.PI / 2);
            context.scale(-1, 1);
            context.drawImage(image, 0, 0, -canvas.width, -canvas.height);
          } else if (type == 7) {
            // 90 + 镜像垂直翻转
            context.rotate(Math.PI / 2);
            context.scale(1, -1);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
          }
        };
        image.src = src;
      }
    }
  }, []);

  return (
    <div>
      <div className="uploader">
        上传
        <input
          className="input"
          type="file"
          name="图片上传"
          onChange={handleChange}
        />
      </div>
      <canvas className="canvas" ref={canvasRef}></canvas>
    </div>
  );
};

export default ImageRotateRecover;
