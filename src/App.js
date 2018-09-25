/* global Phaser:true */

import 'phaser';
import './canvas.css';

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

};

function preload() {
  this.load.spritesheet('player_idle', 'assets/HMMAXXAA.png', {
    frameWidth: 35,
    frameHeight: 69
  });
  this.load.spritesheet('player_walk', 'assets/walk.png', {
    frameWidth: 80,
    frameHeight: 80
  });

  this.load.image('floor', 'assets/floor/ground.jpg');
}

function create() {
  this.add.tileSprite(width / 2, height / 2, width, height, 'floor');
  state.player = this.physics.add.sprite(400, 300, 'player_idle');
  state.cursors = this.input.keyboard.createCursorKeys();

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

  ['↑→', '→', '↓→', '↓←', '←', '↑←'].forEach((direction, i) => {
    const start = i * walkLength;

    this.anims.create({
      key: `player_${direction}`,
      frames: this.anims.generateFrameNumbers('player_walk', {
        start,
        end: start + walkLength - 1
      }),
      frameRate: 10,
      repeat: -1
    })
  })


  // state.player.anims.play('left', true);

  // const logo = this.add.image(400, 150, 'player_idle');

  // this.tweens.add({
  //     targets: logo,
  //     y: 450,
  //     duration: 2000,
  //     ease: 'Power2',
  //     yoyo: true,
  //     loop: -1
  // });

}

function update() {
  const {
    player,
    cursors
  } = state;

  const {
    up,
    right,
    down,
    left
  } = cursors;

  const v = up.isDown !== down.isDown ? up.isDown ? '↑' : '↓' : '';
  const h = right.isDown !== left.isDown ? left.isDown ? '←' : '→' : '';
  const animation = `player_${v}${h}`;

  switch (`${v}${h}`) {
    // case '↑':
    //     player.setVelocityX(0);
    //     player.setVelocityY(-160);
    //     break;
    // case '↓':
    //     player.setVelocityX(0);
    //     player.setVelocityY(160);
    //     break;
    case '←':
      player.setVelocityX(-160);
      player.setVelocityY(0);
      console.log(animation);
      state.player.anims.play(animation, true);
      break;
    case '→':
      player.setVelocityX(160);
      player.setVelocityY(0);
      state.player.anims.play(animation, true);
      break;
    case '↑→':
      player.setVelocityX(80);
      player.setVelocityY(-80);
      state.player.anims.play(animation, true);
      break;
    case '↑←':
      player.setVelocityX(-80);
      player.setVelocityY(-80);
      state.player.anims.play(animation, true);
      break;
    case '↓→':
      player.setVelocityX(80);
      player.setVelocityY(80);
      state.player.anims.play(animation, true);
      break;
    case '↓←':
      player.setVelocityX(-80);
      player.setVelocityY(80);
      state.player.anims.play(animation, true);
      break;
    default:
      player.setVelocityX(0);
      player.setVelocityY(0);
      break;
  }

  // if (cursors.left.isDown) {
  //     player.setVelocityX(-160);

  //     // player.anims.play('left', true);
  // }
  // else if (cursors.right.isDown) {
  //     player.setVelocityX(160);

  //     // player.anims.play('right', true);
  // }
  // else {
  //     player.setVelocityX(0);

  //     // player.anims.play('turn');
  // }

  // if (cursors.up.isDown && player.body.touching.down) {
  //     player.setVelocityY(-330);
  // }
}
