import PointDTO from "@/game/general/dtos/PointDTO";
export default class map_view_room_fullroom extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, pos: PointDTO) {
        super(scene, pos.x, pos.y);
        scene.add.existing(this);
    }

    
}