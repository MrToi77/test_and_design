import Ease from "@/game/general/anim/Eases";

export default class character_view_body_head extends Phaser.GameObjects.Container {
    private _head: Phaser.GameObjects.Container;
    private _emotion: Phaser.GameObjects.Image;
    private _plant_pot: Phaser.GameObjects.Container;

    private walkTween: Phaser.Tweens.Tween[] = [];
    private failTween: Phaser.Tweens.Tween[] = [];
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        scene.add.existing(this);
        this.create();
    }

    private create(){
        this._head = this.scene.add.container(0, 0);

        const headImg = this.scene.add.image(0, 0, "head").setOrigin(0.5, 1);
        const face = this.scene.add.image(0, -(headImg.height / 2), "face").setOrigin(0.5);
        this._emotion = this.scene.add.image(0, -(headImg.height / 2), "happy").setOrigin(0.5).setScale(0.2);

        this._head.add([headImg, face, this._emotion]);

        // Pot & plant
        this._plant_pot = this.scene.add.container(0, -headImg.height);
        const potImg = this.scene.add.image(0, 0, "plant_pot").setOrigin(0.5, 1);
        const plant = this.scene.add
            .image(0, -potImg.height, "leaf")
            .setOrigin(0.5, 1);
        this._plant_pot.add([potImg, plant]);

        this._head.add(this._plant_pot);
        this.add(this._head);
    }

    public walkAnimation(){
        const tween = this.scene.tweens.add({
            targets: this._head,
            angle: { from: -10, to: 10 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: Ease.EaseSine_easeInOut
        });
        this.walkTween.push(tween);
    }

    public failAnimation(durationPhase1: number, delayPhase2: number = durationPhase1, durationPhase2: number = durationPhase1){
        const tween = this.scene.tweens.add({
            targets: this._head,
            angle: { from: this.angle, to: 10 },
            duration: durationPhase1,
            yoyo: false,
            repeat: 0,
            ease: Ease.EaseSine_easeInOut,
        });
        this.scene.time.delayedCall(delayPhase2, () => {
            this.scene.tweens.add({
                    targets: this._head,
                    angle: { from: this.angle, to: 0 },
                    duration: durationPhase2,
                    yoyo: false,
                    repeat: 0,
                    ease: Ease.EaseSine_easeInOut,
                })
        });
        this._emotion.setTexture("unhappy");        
        this.failTween.push(tween);
    }

    public setEmotion(emotion: string){
        this._emotion.setTexture(emotion);
    }

    public stopAnimation(){
        this.walkTween.forEach(tween => tween.stop());
        this.failTween.forEach(tween => tween.stop());
        this._head.angle = 0;
    }
}