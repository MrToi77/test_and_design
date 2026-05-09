
import { AUTO, Game } from 'phaser';
import Boot from './scenes/Boot';
import Preloader from './scenes/Preloader';
import PlayScene from './scenes/PlayScene';

const MOBILE_SIZE = { width: 768, height: 1024 };

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: MOBILE_SIZE.width,
    height: MOBILE_SIZE.height,
    parent: 'game-container',
    backgroundColor: '#dbe1e6',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
        }
    },
    scene: [
        Boot,
        Preloader,
        PlayScene,
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;
