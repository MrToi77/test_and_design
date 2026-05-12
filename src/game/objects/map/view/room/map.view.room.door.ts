import PointDTO from "@/game/general/dtos/PointDTO";
export default class map_view_room_door extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, pos: PointDTO) {
        super(scene, pos.x, pos.y, "door");
        scene.add.existing(this);
    }

    public getDoorPos(){
        return new PointDTO(this.x, this.y);
    }

    public getDoorSize(){
        return {
            width: this.width,
            height: this.height
        }
    }
}