import PointDTO from "@/game/general/dtos/PointDTO";
export default class map_view_room_wall extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, pos: PointDTO) {
        super(scene, pos.x, pos.y, "wall");
        scene.add.existing(this);
    }

    public getWallPos(){
        return new PointDTO(this.x, this.y);
    }

    public getWallSize(){
        return {
            width: this.width,
            height: this.height
        }
    }
}