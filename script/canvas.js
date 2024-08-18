const particles = [];
let hoveredParticle = null;
const imgs = [];
const imgPaths = [
  './style/assets/img1.png',
  './style/assets/img2.png',
  './style/assets/img3.png',
  './style/assets/img4.png',
  './style/assets/img5.png',
  './style/assets/img6.png',
  './style/assets/img7.png',
];
let cam;
let camGraphics;

function preload() {
  imgPaths.forEach((eachPath) => {
    imgs.push(loadImage(eachPath));
  });
}

function setup() {
  setCanvasContainer('canvas', 4, 3, true);
  const constraints = {
    video: {
      width: { exact: 520 },
      height: { exact: 440 },
    },
    audio: false,
  };

  cam = createCapture(constraints);
  cam.hide();

  rectMode(CENTER);
  imageMode(CENTER);

  background('#D9BEA7 ');
}

function draw() {
  background('#D9BEA7 ');

  captureDot();

  chkHover();
  particles.forEach((eachParticle) => {
    eachParticle.update(hoveredParticle);
  });

  stroke(0);
  particles.forEach((eachParticle, idx) => {
    if (idx !== 0) {
      line(
        particles[idx - 1].pos.x,
        particles[idx - 1].pos.y,
        eachParticle.pos.x,
        eachParticle.pos.y
      );
    }
  });

  strokeWeight(1);
  noFill();
  ellipse(width / 2, height / 2, width - 8, height - 8);

  noStroke();
  particles.forEach((eachParticle) => {
    if (hoveredParticle !== eachParticle) eachParticle.display(hoveredParticle);
  });
  hoveredParticle?.display(hoveredParticle);

  console.log(hoveredParticle);
}

function captureDot() {
  cam.loadPixels();
  noStroke();
  fill('#733C30');
  for (let y = 2; y < cam.height; y += 7) {
    for (let x = 2; x < cam.width; x += 7) {
      const pixelIdx = 4 * (cam.width * y + x);
      const r = cam.pixels[pixelIdx + 0];
      const g = cam.pixels[pixelIdx + 1];
      const b = cam.pixels[pixelIdx + 2];
      const a = cam.pixels[pixelIdx + 3];
      const pixelColor = color(r, g, b);
      const pixelBrightness = brightness(pixelColor);
      const canvasX = map(x, 0, cam.width - 1, 0, width - 1);
      const canvasY = map(y, 0, cam.height - 1, 0, height - 1);
      const ratio = width / cam.width;

      rect(
        canvasX,
        canvasY,
        ratio * 0.8 * (10 - (10 * pixelBrightness) / 255),
        ratio * 0.8 * (10 - (10 * pixelBrightness) / 255)
      );
    }
  }
}

function chkHover() {
  let nothingHovered = true;
  for (let idx = 0; idx < particles.length; idx++) {
    if (particles[idx].isHover(mouseX, mouseY)) {
      nothingHovered = false;
      hoveredParticle = particles[idx];
      break;
    }
  }
  if (nothingHovered) {
    hoveredParticle = null;
  }
}

function mouseDragged() {
  const mouseDistSq = (width / 2 - mouseX) ** 2 + (height / 2 - mouseY) ** 2;
  const canvasRadiusSq = (width / 2 - 90) ** 2;

  if (mouseDistSq >= canvasRadiusSq) return;

  const prob = random();
  const random2D = p5.Vector.random2D();
  random2D.mult(random(25, 50));

  let particle1 = new Particle(
    mouseX,
    mouseY,
    random2D.x + mouseX,
    random2D.y + mouseY,
    random(10, 25),
    color(random(255), random(255), random(255)),
    imgs[floor(random(imgs.length))]
  );

  /* 새 파티클 위치가 캔버스 경계 내에 있는지 확인 */
  if (isWithinCanvasBounds(particle1.pos.x, particle1.pos.y)) {
    particles.push(particle1);
  }

  if (prob > 0.5) {
    random2D.rotate(random(TAU));

    let particle2 = new Particle(
      mouseX,
      mouseY,
      random2D.x + mouseX,
      random2D.y + mouseY,
      random(5, 10),
      color(random(255), random(255), random(255)),
      imgs[floor(random(imgs.length))]
    );

    if (isWithinCanvasBounds(particle2.pos.x, particle2.pos.y)) {
      particles.push(particle2);
    }
  }
}

/* 캔버스 경계 내에 있는지 확인하는 함수 추가 */
function isWithinCanvasBounds(x, y) {
  const canvasRadius = width / 2 - 20;
  const distanceSq = (x - width / 2) ** 2 + (y - height / 2) ** 2;
  return distanceSq <= canvasRadius ** 2;
}
