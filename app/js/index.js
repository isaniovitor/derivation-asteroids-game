console.log("hello");

// ----- vars ----- //

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const projectiles = [];

// ----- classes ----- //

class Player {
  constructor(x, y, r, color) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Projectile {
  constructor(x, y, r, v, color) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.v = v;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();

    this.x = this.x + this.v.vx;
    this.y = this.y + this.v.vy;
  }
}

const player = new Player(canvas.width / 2, canvas.height / 2, 30, "blue");

// ----- windows events ----- //

addEventListener("click", (event) => {
  // angle bitween center and mouse click //

  const a = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );

  projectiles.push(
    new Projectile(
      canvas.width / 2,
      canvas.height / 2,
      5,
      {
        vx: Math.cos(a),
        vy: Math.sin(a),
      },
      "red"
    )
  );
});

// ----- loop function ----- //
function loop() {
  requestAnimationFrame(loop);

  // cleaning the canvas //
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.draw();

  projectiles.forEach((projectile) => {
    projectile.update();
  });
}

loop();
