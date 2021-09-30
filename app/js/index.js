console.log("hello");

// ----- vars ----- //

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const projectiles = [];
const enemies = [];

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

class Enemy {
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

const player = new Player(canvas.width / 2, canvas.height / 2, 10, "white");

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
        vx: Math.cos(a) * 7,
        vy: Math.sin(a) * 7,
      },
      "white"
    )
  );
});

// ----- enemies functions ----- //
function spwanEnemies() {
  setInterval(() => {
    // max -> 30, min -> 8

    const r = Math.random() * (30 - 8) + 8;
    const color = `hsl(${Math.random() * 360} , 50%, 50%)`;

    let x, y;

    // Math.random() < 0.5 -> spawn horizontally
    if (Math.random() < 0.5) {
      // Math.random() < 0.5 -> spawn left

      x = Math.random() < 0.5 ? 0 - r : canvas.width + r;
      y = Math.random() * canvas.height;
    } else {
      // Math.random() < 0.5 -> spawn up

      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - r : canvas.height + r;
    }

    const a = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const v = {
      vx: Math.cos(a),
      vy: Math.sin(a),
    };

    enemies.push(new Enemy(x, y, r, v, color));
  }, 1000);
}

// ----- loop function ----- //
function loop() {
  const animationId = requestAnimationFrame(loop);

  // cleaning the canvas //
  //ctx.clearRect(0, 0, canvas.width, canvas.height);

  // desing //
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.draw();

  projectiles.forEach((projectile, pIndex) => {
    projectile.update();

    // remove projectiles when they leave the screen

    if (
      projectile.x + projectile.r < 0 ||
      projectile.x - projectile.r > canvas.width ||
      projectile.y + projectile.r < 0 ||
      projectile.y - projectile.r > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(pIndex, 1);
      }, 0);
    }
  });

  enemies.forEach((enemy, eIndex) => {
    enemy.update();

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    if (dist - enemy.r - player.r < 1) {
      cancelAnimationFrame(animationId);
    }

    projectiles.forEach((projectile, pIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      if (dist - enemy.r - projectile.r < 1) {
        // Evitar flash dos enimigos

        setTimeout(() => {
          enemies.splice(eIndex, 1);
          projectiles.splice(pIndex, 1);
        }, 0);
      }
    });
  });
}

loop();
spwanEnemies();
