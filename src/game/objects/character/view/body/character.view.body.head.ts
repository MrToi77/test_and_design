import Ease from "@/game/general/anim/Eases";

export default class character_view_body_head extends Phaser.GameObjects.Container {
    private _head: Phaser.GameObjects.Container;
    private _emotion: Phaser.GameObjects.Image;

    private _plantPotLeftCorner: Phaser.GameObjects.Container;
    private _plantPotRightCorner: Phaser.GameObjects.Container;

    private _plantPotEvent: Phaser.Time.TimerEvent;

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
        this._plantPotLeftCorner = this.scene.add.container(-26.5, -headImg.height);
        this._plantPotRightCorner = this.scene.add.container(26.5, -headImg.height);
        this._head.add([headImg, face, this._emotion]);

        // Pot & plant

        const potImg1 = this.scene.add.image(0, 0, "plant_pot").setOrigin(0.185, 1);
        const plant1 = this.scene.add
            .image(26.5, -potImg1.height, "leaf")
            .setOrigin(0.5, 1);
        this._plantPotLeftCorner.add([potImg1, plant1]);

        const potImg2 = this.scene.add.image(0, 0, "plant_pot").setOrigin(0.807, 1);
        const plant2 = this.scene.add
            .image(-26.5, -potImg2.height, "leaf")
            .setOrigin(0.5, 1);
        this._plantPotRightCorner.add([potImg2, plant2]);

        this._head.add([this._plantPotLeftCorner, this._plantPotRightCorner]);
        this._plantPotLeftCorner.setVisible(true);
        this._plantPotRightCorner.setVisible(false);
        this.add(this._head);
    }

    public walkAnimation(){
        const tween = this.scene.tweens.add({
            targets: this._head,
            angle: { from: -12, to: 12 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: Ease.EaseSine_easeInOut
        });
        this.walkTween.push(tween);
        this.plantPotAnimation();
        this._plantPotEvent = this.scene.time.addEvent({
            delay: 2000,
            loop: true,
            callback: () => {
                this.plantPotAnimation();
            }
        })
    }

    public plantPotAnimation(){
        const tween1 = this.scene.tweens.add({
            targets: this._plantPotLeftCorner,
            angle: { from: 0, to: -15 },
            duration: 500,
            yoyo: true,
            ease: Ease.EaseSine_easeInOut,
            onComplete: () => {
                this._plantPotLeftCorner.setVisible(false);
                this._plantPotRightCorner.setVisible(true);
                this.scene.tweens.add({
                targets: this._plantPotRightCorner,
                angle: { from: 0, to: 15 },
                duration: 500,
                yoyo: true,
                ease: Ease.EaseSine_easeInOut,
                onComplete: () => {
                    this._plantPotRightCorner.setVisible(false);
                    this._plantPotLeftCorner.setVisible(true);
                }
            })
            }
        });
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
        if(this._plantPotEvent){
            this._plantPotEvent.remove();
        }
        this._head.angle = 0;
    }
}