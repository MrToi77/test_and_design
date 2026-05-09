import { Scene } from 'phaser';

export default class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        // No assets to load in Boot
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
