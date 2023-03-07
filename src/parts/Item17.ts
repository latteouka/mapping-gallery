const radius = 10;
const colors = ["#99b898", "#fecea8", "#ff847c", "#e84a5f", "#2a363b"];
const speed2 = 2;

class Vector {
  _x: number;
  _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  setX(value: number) {
    this._x = value;
  }

  getX() {
    return this._x;
  }

  setY(value: number) {
    this._y = value;
  }

  getY() {
    return this._y;
  }

  setAngle(angle: number) {
    const length: number = this.getLength();
    this._x = Math.cos(angle) * length;
    this._y = Math.sin(angle) * length;
  }

  getAngle() {
    return Math.atan2(this._y, this._x);
  }

  setLength(length: number) {
    const angle = this.getAngle();
    this._x = Math.cos(angle) * length;
    this._y = Math.sin(angle) * length;
  }

  getLength() {
    return Math.sqrt(this._x * this._x + this._y * this._y);
  }

  add(vector: Vector) {
    this._x = this._x + vector._x;
    this._y = this._y + vector._y;
  }

  subtract(vector: Vector) {
    this._x = this._x - vector._x;
    this._y = this._y - vector._y;
  }

  multiply(value: number) {
    this._x = this._x * value;
    this._y = this._y * value;
  }

  devide(value: number) {
    this._x = this._x / value;
    this._y = this._y / value;
  }
}
class Particle {
  position: Vector;
  velocity: Vector;
  mass: number = 1;
  radius: number;
  color: string = "#000";

  constructor(
    x: number,
    y: number,
    speed: number,
    direction: number,
    radius: number,
    color?: string
  ) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.velocity.setLength(speed);
    this.velocity.setAngle(direction);
    this.color = color ? color : "#000";
    this.radius = radius;
  }

  update() {
    this.position.add(this.velocity);
  }

  accelerate(accel: Vector) {
    this.velocity.add(accel);
  }

  angleTo(p2: Particle) {
    return Math.atan2(
      p2.position.getY() - this.position.getY(),
      p2.position.getX() - this.position.getX()
    );
  }

  distanceTo(p2: Particle) {
    const dx = p2.position.getX() - this.position.getX();
    const dy = p2.position.getY() - this.position.getY();
    return Math.sqrt(dx * dx + dy * dy);
  }
}

function draw() {
  const canvas = document.getElementById("canvas-item17") as HTMLCanvasElement;
  const context = canvas.getContext("2d")!;
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles: Particle[] = [];
  const num = 14;

  for (let i = 0; i < num; i++) {
    particles.push(
      new Particle(
        width / 2 + (Math.random() * 2 - 1) * 500,
        height / 2 + (Math.random() * 2 - 1) * 500,
        1, // speed
        Math.sin(Math.random() * 2 - 1) * Math.PI * 2, // direction
        10 + Math.random() * 5, // radius
        colors[~~(Math.random() * 5)]
      )
    );
  }

  // bouncing force when collide with walls
  function checkBounce(p: Particle) {
    const bounce = -1;
    if (p.position.getX() + p.radius > width) {
      p.position.setX(width - p.radius);
      p.velocity.setX(p.velocity.getX() * bounce);
    }
    if (p.position.getX() - p.radius < 0) {
      p.position.setX(p.radius);
      p.velocity.setX(p.velocity.getX() * bounce);
    }
    if (p.position.getY() + p.radius > height) {
      p.position.setY(height - p.radius);
      p.velocity.setY(p.velocity.getY() * bounce);
    }
    if (p.position.getY() - p.radius < 0) {
      p.position.setY(p.radius);
      p.velocity.setY(p.velocity.getY() * bounce);
    }
  }
  function checkDistance(array: Particle[]) {
    for (var i = 0, len = array.length; i < len - 1; i++) {
      for (var j = i + 1; j < len; j++) {
        var p0 = array[i],
          p1 = array[j],
          pDistance =
            (p1.position.getX() - p0.position.getX()) *
              (p1.position.getX() - p0.position.getX()) +
            (p1.position.getY() - p0.position.getY()) *
              (p1.position.getY() - p0.position.getY()),
          pAngle = Math.atan2(
            p1.position.getY() - p0.position.getY(),
            p1.position.getX() - p0.position.getX()
          );

        if (pDistance < (p0.radius + p1.radius) * (p0.radius + p1.radius)) {
          p1.velocity.setX(Math.cos(pAngle) * speed2);
          p1.velocity.setY(Math.sin(pAngle) * speed2);
          p0.velocity.setX(-Math.cos(pAngle) * speed2);
          p0.velocity.setY(-Math.sin(pAngle) * speed2);
        }
      }
    }
  }

  update();

  function update() {
    context.clearRect(0, 0, width, height);
    checkDistance(particles);

    for (let i = 0; i < num; i++) {
      particles[i].update();
      checkBounce(particles[i]);

      context.fillStyle = particles[i].color;
      context.beginPath();
      context.arc(
        particles[i].position.getX(),
        particles[i].position.getY(),
        particles[i].radius,
        0,
        Math.PI * 2,
        false
      );
      context.fill();
    }
    requestAnimationFrame(update);
  }
}

draw();
