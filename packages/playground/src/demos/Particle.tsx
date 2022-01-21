/**
 * 粒子效果
 * @filename: packages/playground/src/demos/Particle.tsx
 * @author: Mr Prince
 * @date: 2022-10-18 19:37:03
 */
import { useEffect, useRef } from 'react';
import Random from '../../../utils/src/utils/Random';

const Particle = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvas.current) {
      canvas.current.width = window.innerWidth;
      canvas.current.height = window.innerHeight;
      const ctx = canvas.current.getContext('2d');
      const particles: ParticleItem[] = [];
      let mouse = { x: -500, y: -500 };

      class ParticleItem {
        x: number = 0;
        y: number = 0;
        private vx: number = 0;
        private vy: number = 0;
        private age: number = 0;

        constructor(
          private canvas: HTMLCanvasElement,
          private ctx: CanvasRenderingContext2D
        ) {
          this.init();
        }

        init() {
          this.x = Random.getRandomNumber(0, this.canvas.width);
          this.y = Random.getRandomNumber(0, this.canvas.height);
          this.vx = Math.random() - 0.5;
          this.vy = Math.random() - 0.5;
          this.age = Random.getRandomNumber(0, 50);
        }

        update() {
          this.x += this.vx;
          this.y += this.vy;

          if (
            this.x < 0 ||
            this.x > this.canvas.width ||
            this.y < 0 ||
            this.y > this.canvas.height
          ) {
            this.init();
          }
          this.age--;
          if (this.age < 0) {
            this.age = Random.getRandomNumber(0, 50);
            this.vx += (Math.random() - 0.5) * 0.1;
            this.vy += (Math.random() - 0.5) * 0.1;
          }
          const r = Math.sqrt(
            Math.pow(this.x - mouse.x, 2) + Math.pow(this.y - mouse.y, 2)
          );
          if (r < 200) {
            this.x += (this.x - mouse.x) / 100;
            this.y += (this.y - mouse.y) / 100;
          }
        }

        draw() {
          const ctx = this.ctx;
          if (ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      document.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
      });

      for (let i = 0; i < 200; i++) {
        particles.push(new ParticleItem(canvas.current, ctx!));
      }

      const ani = () => {
        ctx?.clearRect(0, 0, canvas.current?.width!, canvas.current?.height!);
        particles.forEach((item, index) => {
          item.update();
          item.draw();
          particles.slice(index).forEach((p) => {
            const r = Math.sqrt(Math.pow(item.x - p.x, 2) + Math.pow(item.y - p.y, 2));
            if (r < 100) {
              ctx?.beginPath();
              ctx?.moveTo(item.x, item.y);
              ctx?.lineTo(p.x, p.y);
              if (ctx) {
                ctx.strokeStyle = `rgba(0, 0, 0, ${1 - r / 100})`;
              }
              ctx?.stroke();
            }
          });
        });
      };

      setInterval(ani, 1000 / 60);
    }
  }, []);

  return <canvas ref={canvas}></canvas>;
};

export default Particle;
