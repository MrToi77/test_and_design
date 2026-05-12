import PointDTO from "@/game/general/dtos/PointDTO";
export default class map_view_room_floor extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, pos: PointDTO) {
        super(scene, pos.x, pos.y, "floor");
        scene.add.existing(this);
    }

    public getFloorPos(){
        return new PointDTO(this.x, this.y);
    }

    public getFloorSize(){
        return {
            width: this.width,
            height: this.height
        }
    }
}