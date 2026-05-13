import { SpriteSizes } from "@/game/general/sprites/spriteconfig";
import { SpriteNames } from "@/game/general/sprites/spritenames";

export default class FloorView extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, SpriteNames.Floor);
        scene.add.existing(this);
        this.setScale(SpriteSizes.getFloorScale(this.scene).x, SpriteSizes.getFloorScale(this.scene).y);
        this.setOrigin(0.5);
    }
}