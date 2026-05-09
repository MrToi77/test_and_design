import PointDTO from "@/game/general/dtos/PointDTO";
import character_view_body_torso from "./character.view.body.torso";
import character_view_body_leftleg from "./character.view.body.leftleg";
import character_view_body_rightleg from "./character.view.body.rightleg";
import character_view_body_leftarm from "./character.view.body.leftarm";
import character_view_body_rightarm from "./character.view.body.rightarm";
import character_view_body_head from "./character.view.body.head";
import Ease from "@/game/general/anim/Eases";
let count = 0;

export default class character_view_body_fullbody extends Phaser.GameObjects.Container {
    private _torso: character_view_body_torso;
    private _left_leg: character_view_body_leftleg;
    private _right_leg: character_view_body_rightleg;
    private _left_arm: character_view_body_leftarm;
    private _right_arm: character_view_body_rightarm;
    private _head: character_view_body_head;
    private switch: number[] = [1,2,3,4];

    private _upperBody: Phaser.GameObjects.Container; // Head + torso + arms

    private _idleTween: Phaser.Tweens.Tween[] = [];

    constructor(scene: Phaser.Scene, pos: PointDTO) {
        super(scene, pos.x, pos.y);
        scene.add.existing(this);
        this.assemble();
        this.setInteractive(new Phaser.Geom.Rectangle(-50, -50, 100, 100), Phaser.Geom.Rectangle.Contains);
        this.on("pointerdown", () => {
            this.stopAnimation();
            const index = this.switch[count % this.switch.length];
            if(index === 1){
                this.idleAnimation();
            }else if(index === 2){
                this.walkAnimation();
            }else if(index === 3){
                this.failAnimation(500, 2000);
            }else if(index === 4){
                this.successAnimation(500, 5000);
            }
            count++;
        });
    }
    
    private assemble(){
        this._torso = new character_view_body_torso(this.scene, 0, 0);
        this._upperBody = this.scene.add.container(0, 0);

        const leftLegPos = this._torso.getleftLegPos();
        const rightLegPos = this._torso.getrightLegPos();
        const leftArmPos = this._torso.getleftArmPos();
        const rightArmPos = this._torso.getrightArmPos();
        const headPos = this._torso.getheadPos();

        this._left_leg = new character_view_body_leftleg(this.scene, leftLegPos.x, leftLegPos.y);
        this._right_leg = new character_view_body_rightleg(this.scene, rightLegPos.x, rightLegPos.y);
        this._left_arm = new character_view_body_leftarm(this.scene, leftArmPos.x, leftArmPos.y);
        this._right_arm = new character_view_body_rightarm(this.scene, rightArmPos.x, rightArmPos.y);
        this._head = new character_view_body_head(this.scene, headPos.x, headPos.y);

        this.add([this._right_leg, this._left_leg, this._upperBody]);
        this._upperBody.add([this._torso, this._head, this._right_arm, this._left_arm]);
    }

    private idleAnimation(){
        this._left_leg.idleAnimation();
        this._right_leg.idleAnimation();
        this._right_arm.idleAnimation();
        this._left_arm.idleAnimation();
        this.idleUpperBodyAnimation();
    }

    private walkAnimation(){
        this._head.walkAnimation();
        this._left_arm.walkAnimation(280);
        this._right_arm.walkAnimation(280);
        this._left_leg.walkAnimation(280);
        this._right_leg.walkAnimation(280);
    }

    private idleUpperBodyAnimation(){
        const tween = this.scene.tweens.add({
            targets: this._upperBody,
            y: { from: this._upperBody.y, to: this._upperBody.y + 10 },
            x: { from: this._upperBody.x, to: this._upperBody.x - 10 },
            duration: 1000,
            ease: Ease.EaseSine_easeInOut,
            yoyo: true,
            repeat: -1
        });
        this._idleTween.push(tween);
    }

    private failAnimation(durationPhase1: number, delayPhase2: number = durationPhase1, durationPhase2: number = durationPhase1){
        this._left_arm.failAnimation(durationPhase1, delayPhase2, durationPhase2);
        this._right_arm.failAnimation(durationPhase1, delayPhase2, durationPhase2);
        this._right_leg.failAnimation(durationPhase1, delayPhase2, durationPhase2);
        this._left_leg.failAnimation(durationPhase1, delayPhase2, durationPhase2);
        this._head.failAnimation(durationPhase1, delayPhase2, durationPhase2);
        this.scene.time.delayedCall(delayPhase2 + durationPhase2, () => {
            this.idleUpperBodyAnimation();
        });
    }

    private successAnimation(durationPhase1: number, delayPhase2: number = durationPhase1, durationPhase2: number = durationPhase1){
        this._right_leg.successAnimation(durationPhase1, delayPhase2, durationPhase2);
        this._left_leg.successAnimation(durationPhase1, delayPhase2, durationPhase2);
        this._right_arm.successAnimation(durationPhase1, delayPhase2, durationPhase2);
        this._left_arm.successAnimation(durationPhase1, delayPhase2, durationPhase2);
        this._head.setEmotion("excited");
        this.scene.time.delayedCall(delayPhase2 + durationPhase2, () => {
            this.idleUpperBodyAnimation();
            this._head.setEmotion("happy");
        });
    }

    public stopAnimation(){
        this._left_leg.stopAnimation();
        this._right_leg.stopAnimation();
        this._right_arm.stopAnimation();
        this._left_arm.stopAnimation();
        this._head.stopAnimation();
        this._idleTween.forEach(tween => tween.stop());
        this._upperBody.x = 0;
        this._upperBody.y = 0;
    }
}