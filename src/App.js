import 'phaser';
import './canvas.css';

import {SHOTGUN_SOUND} from './sound.js';

/* global Phaser:true */

const width = 1280;
const height = 720;

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width,
  height,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const state = {};

document.body.addEventListener('wasteday:start', () => state.start = true);

function startGame() {
  Object.assign(state, {
    game: new Phaser.Game(config),
    start: false,
    playerIsDead: false,
    direction: '↑→',
    scorpDirection: '↑→',
    scorpIsDead: false,
    isHitting: false,
    scorpHealth: 10,
    shootingCooldown: 0,
    shooting: 0,
    hitting: 0,
  })
}

function stopGame() {
  state.game.destroy();
}

function restartGame() {
  stopGame();
  startGame();
  document.body.dispatchEvent(new CustomEvent('wasteday:restart'));
}

startGame();

function checkHit() {
  const {
    direction,
    scorpDirection
  } = state;

  switch (direction) {
    case '←':
      return scorpDirection === '→'
    case '→':
      return scorpDirection === '←'
    case '↑→':
      return scorpDirection === '↓←'
    case '↑←':
      return scorpDirection === '↓→'
    case '↓→':
      return scorpDirection === '↑←'
    case '↓←':
      return scorpDirection === '↑←'
  }
}


function shoot() {
  const {
    player,
    scorp,
    ctrl,
    shootingCooldown,
    shooting,
    scorpHealth,
    scorpDirection
  } = state;

  const now = Date.now();

  if (shooting > now) {
    return true;
  }

  if (ctrl.isDown && shootingCooldown <= now) {
    player.anims.play(`player_shoot_${state.direction}`, true);
    SHOTGUN_SOUND.shot.play();

    state.shooting = now + 400;
    state.shootingCooldown = now + 2000;
    player.setVelocityX(0);
    player.setVelocityY(0);

    if (checkHit()) {
      if (scorpHealth <= 1) {
        state.scorpIsDead = true;
      } else {
        state.hitting = now + 500;
        state.scorpHealth = scorpHealth - 1;
        scorp.anims.play(`scorp_hit_${scorpDirection}`, true);
      }
    }

    return true;
  }

  return false;
}

function updateScorpDirection() {
  const {player, scorp} = state;
  const pc = player.getCenter();
  const sc = scorp.getCenter();

  const hor = Math.abs(pc.y - sc.y) > 25;
  const ver = Math.abs(pc.x - sc.x) > 25;
  const up = hor && pc.y < sc.y;
  const down = hor && !up;
  const right = pc.x > sc.x;
  const left = !right;

  const v = up !== down ? up ? '↑' : '↓' : '';
  const h = right !== left ? left ? '←' : '→' : '';

  if (!hor && !ver) {
    state.scorpDirection = '';
    state.playerIsDead = true;
  } else {
    state.scorpDirection = (v && !h) ? state.scorpDirection : `${v}${h}`;
  }
}

function updateScorpWalkAnimation() {
  const {
    scorp,
    scorpDirection,
    scorpIsDead,
    isHitting
  } = state;

  if (scorpIsDead || isHitting) {
    return;
  }

  if (scorpDirection === false) {
    scorp.anims.stop();
  } else {
    scorp.anims.play(`scorp_${scorpDirection}`, true);
  }
}

function updateScorpVelocity() {
  const {
    scorp,
    scorpDirection,
    scorpIsDead,
    isHitting
  } = state;

  if (scorpIsDead || !scorpDirection || isHitting) {
    scorp.setVelocityX(0);
    scorp.setVelocityY(0);

    return;
  }

  switch (scorpDirection) {
    case '←':
      scorp.setVelocityX(-100);
      scorp.setVelocityY(0);
      break;
    case '→':
      scorp.setVelocityX(100);
      scorp.setVelocityY(0);
      break;
    case '↑→':
      scorp.setVelocityX(50);
      scorp.setVelocityY(-50);
      break;
    case '↑←':
      scorp.setVelocityX(-50);
      scorp.setVelocityY(-50);
      break;
    case '↓→':
      scorp.setVelocityX(50);
      scorp.setVelocityY(50);
      break;
    case '↓←':
      scorp.setVelocityX(-50);
      scorp.setVelocityY(50);
      break;
  }
}

function preload() {
  this.load.spritesheet('player_idle', 'assets/stand.png', {
    frameWidth: 70,
    frameHeight: 70
  });
  this.load.spritesheet('player_walk', 'assets/walk.png', {
    frameWidth: 80,
    frameHeight: 80
  });
  this.load.spritesheet('player_shoot', 'assets/shoot.png', {
    frameWidth: 80,
    frameHeight: 80
  });

  this.load.spritesheet('scorp_hit', 'assets/scorp_hit.png', {
    frameWidth: 117,
    frameHeight: 99
  });

  this.load.spritesheet('scorp_walk', 'assets/scorp_walk.png', {
    frameWidth: 116,
    frameHeight: 94
  });

  this.load.image('floor', 'assets/ground.jpg');
}

function create() {
  this.add.tileSprite(width / 2, height / 2, width, height, 'floor');
  state.player = this.physics.add.sprite(width / 2, height / 2, 'player_idle');
  state.cursors = this.input.keyboard.createCursorKeys();
  state.ctrl = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);

  state.scorp = this.physics.add.sprite(width, 0, 'scorp_walk');

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('player_idle', {
      start: 0,
      end: 11
    }),
    frameRate: 10,
    repeat: -1
  });

  ['↑→', '→', '↓→', '↓←', '←', '↑←'].forEach((direction, i) => {
    this.anims.create({
      key: `player_${direction}`,
      frames: this.anims.generateFrameNumbers('player_walk', {
        start: i * 8,
        end: (i + 1) * 8 - 1
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: `player_idle_${direction}`,
      frames: this.anims.generateFrameNumbers('player_idle', {
        start: i,
        end: i
      }),
      frameRate: 10,
      repeat: 0
    })

    this.anims.create({
      key: `player_shoot_${direction}`,
      frames: this.anims.generateFrameNumbers('player_shoot', {
        start: i * 4,
        end: (i + 1) * 4 - 1
      }),
      frameRate: 10,
      repeat: 0
    })

    this.anims.create({
      key: `scorp_${direction}`,
      frames: this.anims.generateFrameNumbers('scorp_walk', {
        start: i * 8,
        end: (i + 1) * 8 - 1
      }),
      frameRate: 10,
      repeat: 0
    })

    this.anims.create({
      key: `scorp_hit_${direction}`,
      frames: this.anims.generateFrameNumbers('scorp_hit', {
        start: i * 5,
        end: (i + 1) * 5 - 1
      }),
      frameRate: 10,
      repeat: 0
    })
  })
}

function update() {
  const {
    start,
    player,
    cursors,
    hitting,
    scorpIsDead,
    playerIsDead
  } = state;

  if (!start) {
    return;
  }

  const now = Date.now();

  const {
    up,
    right,
    down,
    left
  } = cursors;

  if (scorpIsDead) {
    alert('Скорпион мёртв. Но пустошь полна опасностей. Беги! Отправь мне код 7dLvgiyzKnG7eH6n, чтобы получить нагаду.')
    restartGame();
  }

  if (playerIsDead) {
    alert('WASTED');
    restartGame();
  }

  state.isHitting = (hitting >= now);

  updateScorpDirection();
  updateScorpWalkAnimation();
  updateScorpVelocity();

  const v = up.isDown !== down.isDown ? up.isDown ? '↑' : '↓' : '';
  const h = right.isDown !== left.isDown ? left.isDown ? '←' : '→' : '';
  const direction = (v && !h) ? '' : `${v}${h}`;

  if (direction) {
    state.direction = direction;
  }

  if (shoot()) {
    return;
  }

  const animation = `player_${direction}`;
  switch (direction) {
    case '←':
      player.setVelocityX(-160);
      player.setVelocityY(0);
      player.anims.play(animation, true);
      break;
    case '→':
      player.setVelocityX(160);
      player.setVelocityY(0);
      player.anims.play(animation, true);
      break;
    case '↑→':
      player.setVelocityX(80);
      player.setVelocityY(-80);
      player.anims.play(animation, true);
      break;
    case '↑←':
      player.setVelocityX(-80);
      player.setVelocityY(-80);
      player.anims.play(animation, true);
      break;
    case '↓→':
      player.setVelocityX(80);
      player.setVelocityY(80);
      player.anims.play(animation, true);
      break;
    case '↓←':
      player.setVelocityX(-80);
      player.setVelocityY(80);
      player.anims.play(animation, true);
      break;
    default:
      player.setVelocityX(0);
      player.setVelocityY(0);

      player.anims.play(`player_idle_${state.direction}`, true);

      break;
  }
}
