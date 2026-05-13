import { SpriteNames } from "@/game/general/sprites/spritenames";
import { SpriteSizes } from "@/game/general/sprites/spriteconfig";

export default class DoorView extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, SpriteNames.Door);
        scene.add.existing(this);
        this.setScale(SpriteSizes.getDoorScale(this.scene).x, SpriteSizes.getDoorScale(this.scene).y);
        this.setOrigin(0.5);
    }
}