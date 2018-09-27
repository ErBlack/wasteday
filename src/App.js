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

const game = new Phaser.Game(config);

const state = {
  direction: '↑→',
  shootingCooldown: 0,
  shooting: 0
};

function shoot() {
  const {
    player,
    ctrl,
    shootingCooldown,
    shooting
  } = state;

  const now = Date.now();

  if (shooting > now) {
    return true;
  }

  if (ctrl.isDown && shootingCooldown <= now) {
    state.player.anims.play(`player_shoot_${state.direction}`, true);
    SHOTGUN_SOUND.shot.play();

    state.shooting = now + 400;
    state.shootingCooldown = now + 2000;
    player.setVelocityX(0);
    player.setVelocityY(0);

    return true;
  }

  return false;
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

  this.load.image('floor', 'assets/ground.jpg');
}

function create() {
  this.add.tileSprite(width / 2, height / 2, width, height, 'floor');
  state.player = this.physics.add.sprite(width / 2, height / 2, 'player_idle');
  state.cursors = this.input.keyboard.createCursorKeys();
  state.ctrl = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('player_idle', {
      start: 0,
      end: 11
    }),
    frameRate: 10,
    repeat: -1
  });

  const walkLength = 8;
  const shootLength = 4;

  ['↑→', '→', '↓→', '↓←', '←', '↑←'].forEach((direction, i) => {
    this.anims.create({
      key: `player_${direction}`,
      frames: this.anims.generateFrameNumbers('player_walk', {
        start: i * walkLength,
        end: (i + 1) * walkLength - 1
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
        start: i * shootLength,
        end: (i + 1) * shootLength - 1
      }),
      frameRate: 10,
      repeat: 0
    })
  })
}

function update() {
  const {
    player,
    cursors,
    ctrl
  } = state;

  const {
    up,
    right,
    down,
    left
  } = cursors;

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
