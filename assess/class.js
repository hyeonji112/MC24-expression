class Particle {
  constructor(x, y, tarX, tarY, rad, col, img) {
    this.img = img;
    this.pos = createVector(x, y);
    this.tarPos = createVector(tarX, tarY);
    this.rad = rad;
    this.tarSize = createVector(
      4 * 2 * this.rad,
      ((4 * this.img.height) / this.img.width) * 2 * this.rad
    );
    this.size = createVector(2 * this.rad, 2 * this.rad);
    this.col = col;
    this.isMoving = true;
  }

  isHover(x, y) {
    const distSq = (this.pos.x - x) ** 2 + (this.pos.y - y) ** 2;
    return distSq <= this.rad ** 2;
  }

  update(hoveredParticle) {
    const dist = p5.Vector.sub(this.tarPos, this.pos);
    if (dist.magSq() > 0.1) {
      dist.mult(0.5);
      this.pos.add(dist);
    } else {
      this.pos.set(this.tarPos);
      this.isMoving = false;
    }

    /* in canvas */
    this.pos.x = constrain(this.pos.x, this.rad, width - this.rad);
    this.pos.y = constrain(this.pos.y, this.rad, height - this.rad);

    if (this.isMoving) return;
    if (hoveredParticle === this) {
      const dist = p5.Vector.sub(this.tarSize, this.size);
      if (dist.magSq() > 0.1) {
        dist.mult(0.5);
        this.size.add(dist);
      } else {
        this.size.set(this.tarSize);
      }
    } else {
      const distX = this.rad * 2 - this.size.x;
      const distY = this.rad * 2 - this.size.y;
      this.size.x += distX * 0.5;
      this.size.y += distY * 0.5;
    }
  }

  display(hoveredParticle) {
    fill(this.col);
    if (hoveredParticle === this) {
      image(this.img, this.pos.x, this.pos.y, this.size.x, this.size.y, 0);
    } else {
      rect(
        this.pos.x,
        this.pos.y,
        this.size.x,
        this.size.y,
        max(this.size.x, this.size.y)
      );
    }
  }
}
