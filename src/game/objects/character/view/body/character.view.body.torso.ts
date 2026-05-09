import Ease from "@/game/general/anim/Eases";
import PointDTO from "@/game/general/dtos/PointDTO";
export default class character_view_body_torso extends Phaser.GameObjects.Container {
    private _torso: Phaser.GameObjects.Container;
    private img: Phaser.GameObjects.Image;
    private _idleTween: Phaser.Tweens.Tween[] = [];
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        scene.add.existing(this);
        this.create();
    }

    private create(){
        this._torso = this.scene.add.container(0, 0).setAlpha(0.9);
        this.img = this.scene.add.image(0, 0, "body").setOrigin(0.5, 0.5);
        this._torso.add(this.img);
        this.add(this._torso);
    }

    public getHalfBodyWH(){
        return {
            halfWidth: this.img.width / 2,
            halfHeight: this.img.height / 2
        }
    }

    public getheadPos(){
        const { halfHeight } = this.getHalfBodyWH();
        return new PointDTO(0, -(halfHeight - 10));
    }

    public getleftArmPos(){
        const { halfWidth, halfHeight } = this.getHalfBodyWH();
        return new PointDTO(-(halfWidth - 20), -(halfHeight - 10));
    }

    public getrightArmPos(){
        const { halfWidth, halfHeight } = this.getHalfBodyWH();
        return new PointDTO(halfWidth - 20, -(halfHeight - 10));
    }

    public getleftLegPos(){
        const { halfWidth, halfHeight } = this.getHalfBodyWH();
        return new PointDTO(-(halfWidth - 20), halfHeight - 10);
    }

    public getrightLegPos(){
        const { halfWidth, halfHeight } = this.getHalfBodyWH();
        return new PointDTO(halfWidth - 15, halfHeight - 10);
    }

}