import Ease from "@/game/general/anim/Eases";

export default class character_view_body_rightleg
    extends Phaser.GameObjects.Container
{
    private _upper_part_right_leg: Phaser.GameObjects.Container;
    private _lower_part_right_leg: Phaser.GameObjects.Container;
    private _idleTween: Phaser.Tweens.Tween[] = [];
    private _walkTween: Phaser.Tweens.Tween[] = [];
    private _failTween: Phaser.Tweens.Tween[] = [];
    private _successTween: Phaser.Tweens.Tween[] = [];
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        scene.add.existing(this);
        this.create();
    }

    private create() {
        const legPartHeight = this.scene.textures
            .get("leg_part")
            .getSourceImage().height;
        this._upper_part_right_leg = this.scene.add.container(0, legPartHeight);
        const upperImg = this.scene.add
            .image(0, 0, "leg_part")
            .setOrigin(0.5, 1);
        this._upper_part_right_leg.add(upperImg);
        this._lower_part_right_leg = this.scene.add.container(
            0,
            legPartHeight - 10,
        );
        const lowerImg = this.scene.add.image(0, 0, "leg").setOrigin(0.5, 0);
        this._lower_part_right_leg.add(lowerImg);
        this.add(this._lower_part_right_leg);

        this.add(this._upper_part_right_leg);
    }

    public idleAnimation() {
        this.angle = -15;
        const tweenUpper = this.scene.tweens.add({
            targets: this._upper_part_right_leg,
            angle: { from: -3, to: -15 },
            ease: Ease.EaseSine_easeInOut,
            yoyo: true,
            repeat: -1,
            duration: 1000,
        });
        this._idleTween.push(tweenUpper);
    }

    public walkAnimation(duration: number) {
        const t1 = this.scene.tweens.add({
            targets: this,
            angle: { from: -35, to: 25 },
            duration: duration,
            ease: Ease.EaseSine_easeInOut,
            yoyo: true,
            repeat: -1,
        });
        this._walkTween.push(t1);
    }

    public stopAnimation() {
        this._idleTween.forEach((tween) => tween.stop());
        this._walkTween.forEach((tween) => tween.stop());
        this._failTween.forEach((tween) => tween.stop());
        this._successTween.forEach((tween) => tween.stop());
        this._upper_part_right_leg.angle = 0;
        this._lower_part_right_leg.angle = 0;
        this.angle = 0;
    }

    public failAnimation(
        durationPhase1: number,
        delayPhase2: number = durationPhase1,
        durationPhase2: number = durationPhase1,
    ) {
        const tween = this.scene.tweens.add({
            targets: this,
            angle: { from: this.angle, to: -75 },
            duration: durationPhase1,
            ease: Ease.EaseSine_easeInOut,
            yoyo: false,
            repeat: 0,
        });

        this.scene.time.delayedCall(delayPhase2, () => {
            this.backToIdleAnimation(durationPhase2);
        });
        this._failTween.push(tween);
    }

    private backToIdleAnimation(duration: number) {
        this.scene.tweens.add({
            targets: this,
            angle: { from: this.angle, to: -15 },
            duration: duration,
            ease: Ease.EaseSine_easeInOut,
            yoyo: false,
            repeat: 0,
            onComplete: () => {
                this.idleAnimation();
            },
        });
    }

    public successAnimation(
        durationPhase1: number,
        delayPhase2: number = durationPhase1,
        durationPhase2: number = durationPhase1,
    ) {
        const tweenUpper = this.scene.tweens.add({
            targets: this,
            angle: { from: this.angle, to: 0 },
            duration: durationPhase1,
            ease: Ease.EaseSine_easeInOut,
            yoyo: false,
            repeat: 0,
        });

        const tweenLower = this.scene.tweens.add({
            targets: this._lower_part_right_leg,
            angle: { from: this._lower_part_right_leg.angle, to: 0 },
            duration: durationPhase1,
            ease: Ease.EaseSine_easeInOut,
            yoyo: false,
            repeat: 0,
        });

        this.scene.time.delayedCall(delayPhase2, () => {
            this.backToIdleAnimation(durationPhase2);
        });
        this._successTween.push(tweenUpper);
        this._successTween.push(tweenLower);
    }
}
