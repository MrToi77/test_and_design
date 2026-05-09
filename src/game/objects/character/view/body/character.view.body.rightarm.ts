import Ease from "@/game/general/anim/Eases";

export default class character_view_body_rightarm extends Phaser.GameObjects.Container {
    private _upper_part_right_arm: Phaser.GameObjects.Container;
    private _lower_part_right_arm: Phaser.GameObjects.Container;
    private _idleTween: Phaser.Tweens.Tween[] = [];
    private _walkTween: Phaser.Tweens.Tween[] = [];
    private _failTween: Phaser.Tweens.Tween[] = [];
    private _successTween: Phaser.Tweens.Tween[] = [];
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        scene.add.existing(this);
        this.create();
    }

    private create(){
        this._upper_part_right_arm = this.scene.add.container(0, 0).setAlpha(0.7);
        const upperImg = this.scene.add.image(0, 0, "arm_part").setOrigin(0, 0);
        this._upper_part_right_arm.add(upperImg);

        this._upper_part_right_arm.angle = 10;
        this._lower_part_right_arm = this.scene.add.container(0, upperImg.height - 2);
        const lowerImg = this.scene.add.image(0, 0, "arm").setOrigin(0, 0);
        this._lower_part_right_arm.add(lowerImg);

        this._lower_part_right_arm.angle = -70;
        this._upper_part_right_arm.add(this._lower_part_right_arm);
        this.add(this._upper_part_right_arm);
    }

    public idleAnimation(){
        const tweenUpper = this.scene.tweens.add({
            targets: [this._upper_part_right_arm],
            angle: {from: 10, to: -10},
            duration: 1000,
            ease: Ease.EaseSine_easeInOut,
            yoyo: true,
            repeat: -1
        });

        const tweenLower = this.scene.tweens.add({
            targets: [this._lower_part_right_arm],
            angle: {from: -70 , to: -75},
            duration: 1000,
            ease: Ease.EaseSine_easeInOut,
            yoyo: true,
            repeat: -1
        });

        this._idleTween.push(tweenUpper);
        this._idleTween.push(tweenLower);

    }

    public walkAnimation(duration: number){
        const t1 = this.scene.tweens.add({
            targets: this._upper_part_right_arm,
            angle: { from: 35, to: -35 },
            duration: duration,
            ease: Ease.EaseSine_easeInOut,
            yoyo: true,
            repeat: -1,
        });
        this._walkTween.push(t1);
    }

    public stopAnimation(){
        this._idleTween.forEach(tween => tween.stop());
        this._walkTween.forEach(tween => tween.stop());
        this._failTween.forEach(tween => tween.stop());
        this._successTween.forEach(tween => tween.stop());
        this._upper_part_right_arm.angle = 10;
        this._lower_part_right_arm.angle = -70;
    }

    public failAnimation(durationPhase1: number, delayPhase2: number = durationPhase1, durationPhase2: number = durationPhase1){
        const tweenUpper = this.scene.tweens.add({
            targets: this._upper_part_right_arm,
            angle: {from: this._upper_part_right_arm.angle, to: -75},
            duration: durationPhase1,
            ease: Ease.EaseSine_easeInOut,
            yoyo: false,
            repeat: 0,
        });

        const tweenLower = this.scene.tweens.add({
            targets: this._lower_part_right_arm,
            angle: {from: this._lower_part_right_arm.angle, to: 0},
            duration: durationPhase1,
            ease: Ease.EaseSine_easeInOut,
            yoyo: false,
            repeat: 0,
        });

        this.scene.time.delayedCall(delayPhase2, () => {
            this.backToIdleAnimation(durationPhase2);
        });
        this._failTween.push(tweenUpper);
        this._failTween.push(tweenLower);
    }

    public successAnimation(durationPhase1: number, delayPhase2: number = durationPhase1, durationPhase2: number = durationPhase1){
        const tweenUpper = this.scene.tweens.add({
            targets: this._upper_part_right_arm,
            angle: {from: this._upper_part_right_arm.angle, to: -90},
            duration: durationPhase1,
            ease: Ease.EaseSine_easeInOut,
            yoyo: false,
            repeat: 0,
            onComplete: () => {
                const tween = this.scene.tweens.add({
                                targets: this._upper_part_right_arm,
                                angle: {from: -70, to: -90},
                                duration: durationPhase1,
                                ease: Ease.EaseSine_easeInOut,
                                yoyo: true,
                                repeat: -1,
                                })
                                this._successTween.push(tween);
            }
        });

        const tweenLower = this.scene.tweens.add({
            targets: this._lower_part_right_arm,
            angle: {from: this._lower_part_right_arm.angle, to: -90},
            duration: durationPhase1,
            ease: Ease.EaseSine_easeInOut,
            yoyo: false,
            repeat: 0,
        });

        this.scene.time.delayedCall(delayPhase2, () => {
            this._successTween.forEach(tween => tween.stop());
            this.backToIdleAnimation(durationPhase2);
        });
    }

    private backToIdleAnimation(duration: number){
        const tweenUpper = this.scene.tweens.add({
                    targets: this._upper_part_right_arm,
                    angle: {from: this._upper_part_right_arm.angle, to: 10},
                    duration: duration,
                    ease: Ease.EaseSine_easeInOut,
                    yoyo: false,
                    repeat: 0,
                    onComplete: () => {
                        this.idleAnimation();
                    }
                });

            const tweenLower = this.scene.tweens.add({
                    targets: this._lower_part_right_arm,
                    angle: {from: this._lower_part_right_arm.angle, to: -70},
                    duration: duration,
                    ease: Ease.EaseSine_easeInOut,
                    yoyo: false,
                    repeat: 0,
                });
    }
        
}