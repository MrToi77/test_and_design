import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {

	constructor() {
		super("Preloader");
	}

	private progressBar!: Phaser.GameObjects.Rectangle;
    private loadTimeout?: ReturnType<typeof setTimeout>;

    init ()
    {
        const cx = 1920;
        const cy = 1080;
        
        const pt = 800;
        const pbg = this.add.rectangle(cx, cy, pt + 8, 68);
        pbg.isFilled = true;
        pbg.fillColor = 0x222222;
        pbg.isStroked = true;
        this.progressBar = pbg;
        
        const bar = this.add.rectangle(cx - pt/2, cy, 4, 60, 0xffffff);
        this.load.on('progress', (p: number) => { 
            bar.width = 4 + (pt * p); 
        });
    }

    preload ()
    {
        // Limit max parallel downloads to prevent mobile network crash (too many requests)
        this.load.maxParallelDownloads = 2;

        // Handle load errors gracefully - log and continue instead of hanging
        this.load.on('loaderror', (file: Phaser.Loader.File) => {
            console.warn(`[Preloader] Failed to load: ${file.key} (${file.url})`);
        });

        this.load.on('complete', () => {
            console.log('[Preloader] All assets loaded OK');
        });

        // Timeout fallback: if loading stalls for 30s, force proceed
        this.loadTimeout = setTimeout(() => {
            console.warn('[Preloader] Load timeout - forcing scene start');
            this.scene.start('PlayScene');
        }, 30000);
        
        // Use the 'pack' file to load in any assets you need for this scene
        // this.load.pack('preload', 'assets/preload-asset-pack.json');
        // Menu
        this.load.image("happy", "assets/bot_a/walk_emotion.png");
        this.load.image("unhappy", "assets/bot_a/sad_emotion.png");
        this.load.image("excited", "assets/bot_a/gotPower.png");
        this.load.image("arm", "assets/bot_a/Arm.png");
        this.load.image("arm_part", "assets/bot_a/Arm_part.png");
        this.load.image("face", "assets/bot_a/Face.png");
        this.load.image("leg", "assets/bot_a/Leg.png");
        this.load.image("leg_part", "assets/bot_a/Leg_part.png");
        this.load.image("head", "assets/bot_a/Head.png");
        this.load.image("body", "assets/bot_a/Body.png");
        this.load.image("plant_pot", "assets/bot_a/Plant_pot.png");
        this.load.image("leaf", "assets/bot_a/Leaf.png");
        this.load.image("floor_piece", "assets/floor.png");
        this.load.image("wall_piece", "assets/wall.png");


        // Orbs
        this.load.image("sun_smile", "assets/Orbs/sun_smile.png");
        this.load.image("sun_laugh", "assets/Orbs/sun_laugh.png");
        this.load.image("sun_no_emotion", "assets/Orbs/sun.png");
        this.load.image("orb_base", "assets/Orbs/sun_orb_base.png");

    }

    create ()
    {
        clearTimeout(this.loadTimeout); 
        this.scene.start('PlayScene');
    }
}
