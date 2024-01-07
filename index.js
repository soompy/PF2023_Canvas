import { gsap } from "gsap";
import Particle from "./js/particle.js";
import CanvasOption from "./js/CanvasOption.js";
import Particle2 from "./js/particle2.js";
import Tail from "./js/Tail.js";
import { hypotenuse, randomNumBetween } from "./js/utils2.js";
import Spark from "./js/Spark.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio;
let canvasWidth = innerWidth;
let canvasHeight = innerHeight;
const interval = 1000 / 60;

const particles = [];

window.addEventListener("load", () => {
  init();
  render();

  const texts = document.querySelectorAll("span");
  const countDownOption = {
    opacity: 1,
    scale: 1,
    duration: 0.4,
    ease: "Power4.easeOut",
  };

  gsap.fromTo(
    texts[0],
    { opacity: 0, scale: 5 },
    {
      ...countDownOption,
    }
  );
  gsap.fromTo(
    texts[1],
    { opacity: 0, scale: 5 },
    {
      ...countDownOption,
      delay: 1,
      onStart: () => (texts[0].style.opacity = 0),
    }
  );
  gsap.fromTo(
    texts[2],
    { opacity: 0, scale: 5 },
    {
      ...countDownOption,
      delay: 2,
      onStart: () => (texts[1].style.opacity = 0),
    }
  );
  gsap.fromTo(
    texts[3],
    { opacity: 0, scale: 5 },
    {
      ...countDownOption,
      delay: 3,
      onStart: () => (texts[2].style.opacity = 0),
    }
  );
  gsap.fromTo(
    texts[4],
    { opacity: 0, scale: 5 },
    {
      ...countDownOption,
      delay: 4,
      onStart: () => (texts[3].style.opacity = 0),
    }
  );

  const circleImg = document.querySelector(".circle");
  gsap.fromTo(
    circleImg,
    { opacity: 1 },
    {
      opacity: 0,
      display: "none",
      duration: 1,
      delay: 5,
      onStart: () => {
        createCircle();
        texts[4].style.opacity = 0;
      },
      onComplete: () => {
        setTimeout(() => {
          createFireworks();
        }, 3000);
      },
    }
  );
});

window.addEventListener("resize", init);

function init() {
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;

  canvas.style.width = canvasWidth + "px";
  canvas.style.height = canvasHeight + "px";
  canvas.width = canvasWidth + dpr;
  canvas.height = canvasHeight + dpr;
  ctx.scale(dpr, dpr);
}

function createCircle() {
  const PARTICLE_NUM = 800;
  for (let i = 0; i < PARTICLE_NUM; i++) {
    particles.push(new Particle());
  }
}

function render() {
  let now, delta;
  let then = Date.now();

  const frame = () => {
    requestAnimationFrame(frame);
    now = Date.now();
    delta = now - then;
    if (delta < interval) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);

      if (particles[i].opacity < 0) particles.splice(i, 1);
    }

    then = now - (delta % interval);
  };

  requestAnimationFrame(frame);
}

function createFireworks() {
  class Canvas2 extends CanvasOption {
    constructor() {
      super();

      this.tails = [];
      this.particles = [];
      this.sparks = [];
    }

    init() {
      this.canvasWidth = innerWidth;
      this.canvasHeight = innerHeight;

      this.canvas.width = this.canvasWidth * this.dpr;
      this.canvas.height = this.canvasHeight * this.dpr;
      this.ctx.scale(this.dpr, this.dpr);

      this.canvas.style.width = this.canvasWidth + "px";
      this.canvas.style.height = this.canvasHeight + "px";

      this.createParticles();
    }

    createTail() {
      const x = randomNumBetween(
        this.canvasWidth * 0.2,
        this.canvasWidth * 0.8
      );
      const vy = this.canvasHeight * randomNumBetween(0.01, 0.015) * -1;
      const colorDeg = randomNumBetween(0, 360);
      this.tails.push(new Tail(x, vy, colorDeg));
    }

    createParticles(x, y, colorDeg) {
      const PARTICLE_NUM = 400;
      for (let i = 0; i < PARTICLE_NUM; i++) {
        const r =
          randomNumBetween(2, 100) *
          hypotenuse(innerWidth, innerHeight) *
          0.0001;
        const angle = (Math.PI / 180) * randomNumBetween(0, 360);
        const vx = r * Math.cos(angle);
        const vy = r * Math.sin(angle);
        const opacity = randomNumBetween(0.6, 0.9);
        const _colorDeg = randomNumBetween(-20, 20) + colorDeg;
        this.particles.push(
          new Particle2(x, y, vx, vy, opacity, colorDeg, _colorDeg)
        );
      }
    }

    render() {
      let now, delta;
      let then = Date.now();

      const frame = () => {
        requestAnimationFrame(frame);
        now = Date.now();
        delta = now - then;
        if (delta < this.interval) return;

        this.ctx.fillStyle = this.bgColor + "40";
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        this.ctx.fillStyle = `rgba(255, 255, 255, ${
          this.particles.length / 50000
        })`;
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        if (Math.random() < 0.03) this.createTail();

        this.tails.forEach((tail, index) => {
          tail.update();
          tail.draw();

          for (let i = 0; i < Math.round(-tail.vy * 0.5); i++) {
            const vx = randomNumBetween(-5, 5) * 0.05;
            const vy = randomNumBetween(-5, 5) * 0.05;
            const opacity = Math.min(-tail.vy, 0.5);
            this.sparks.push(
              new Spark(tail.x, tail.y, vx, vy, opacity, tail.colorDeg)
            );
          }

          if (tail.vy > -0.7) {
            this.tails.splice(index, 1);
            this.createParticles(tail.x, tail.y, tail.colorDeg);
          }
        });

        this.particles.forEach((particle, index) => {
          particle.update();
          particle.draw();

          if (Math.random() < 0.1) {
            this.sparks.push(new Spark(particle.x, particle.y, 0, 0, 0.3, 45));
          }

          if (particle.opacity < 0) this.particles.splice(index, 1);
        });

        this.sparks.forEach((spark, index) => {
          spark.update();
          spark.draw();

          if (spark.opacity < 0) this.sparks.splice(index, 1);
        });

        then = now - (delta % this.interval);
      };
      requestAnimationFrame(frame);
    }
  }

  const canvas2 = new Canvas2();
  canvas2.init();
  canvas2.render();
}
