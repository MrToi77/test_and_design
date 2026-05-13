import { EventBus } from "../EventBus";
import PointDTO from "../general/dtos/PointDTO";
import character_view_body_fullbody from "../objects/character/view/body/character.view.body.fullbody";
import MapView from "../objects/map/view/map/mapView";
import RoomView from "../objects/map/view/room/roomView";
import { generateMap } from "../objects/map/generate/GenerateMap";

export default class PlayScene extends Phaser.Scene {
    // private isDragging: boolean = false;
    // private dragStartX: number = 0;
    // private dragStartY: number = 0;
    // private camStartX: number = 0;
    // private camStartY: number = 0;

    // private readonly ZOOM_NODE = [
    //     1, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05,
    // ];
    // private ZOOM_STEP: number = 0;
    // private readonly POWER_SCALE_NODE = [
    //     1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8,
    // ];
    // private POWER_SCALE_STEP: number = 0;

    constructor() {
        super("PlayScene");
    }

    // private onZoomIn = () => {
    //     const cam = this.cameras.main;
    //     const MAX_STEP = this.ZOOM_NODE.length - 1;
    //     const MAX_STEP_SCALE = this.POWER_SCALE_NODE.length - 1;

    //     this.ZOOM_STEP = Math.min(this.ZOOM_STEP + 1, MAX_STEP);
    //     this.tweens.add({
    //         targets: cam,
    //         zoom: this.ZOOM_NODE[this.ZOOM_STEP],
    //         duration: 1000,
    //         ease: "Cubic.easeOut",
    //     });

    //     const pd = CharacterManager.character?.power;
    //     if (pd) {
    //         this.POWER_SCALE_STEP = Math.min(this.POWER_SCALE_STEP + 1, MAX_STEP_SCALE);
    //         this.tweens.add({
    //             targets: pd,
    //             scale: this.POWER_SCALE_NODE[this.POWER_SCALE_STEP],
    //             duration: 1000,
    //             ease: "Cubic.easeOut",
    //         });
    //     }
    // };

    // private onZoomOut = () => {
    //     const cam = this.cameras.main;

    //     this.ZOOM_STEP = Math.max(this.ZOOM_STEP - 1, 0);
    //     this.tweens.add({
    //         targets: cam,
    //         zoom: this.ZOOM_NODE[this.ZOOM_STEP],
    //         duration: 1000,
    //         ease: "Cubic.easeOut",
    //     });

    //     const pd = CharacterManager.character?.power;
    //     if (pd) {
    //         this.POWER_SCALE_STEP = Math.max(this.POWER_SCALE_STEP - 1, 0);
    //         this.tweens.add({
    //             targets: pd,
    //             scale: this.POWER_SCALE_NODE[this.POWER_SCALE_STEP],
    //             duration: 1000,
    //             ease: "Cubic.easeOut",
    //         });
    //     }
    // };

    // private onDifficultySelected = (difficulty: DifficultyType) => {
    //     MapManager.init(this);
    //     MapManager.createMap(this, difficulty);

    //     // Set bounds trước khi spawn character để camera không bị clamp sai
    //     const bounds = MapManager.getMapBounds();
    //     this.cameras.main.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);

    //     CharacterManager.startGame(this);
    //     this.setupCameraDrag();
    //     this.setupZoomEvents();
    //     this.startGameAnim();
    //     EventBus.emit("difficulty-confirmed");
    // };

    create() {
        new character_view_body_fullbody(this, new PointDTO(400, 300));
        const mapGrid = generateMap({ row: 5, col: 5 });
        new MapView(this, new PointDTO(384, 512), mapGrid.grid);
        // // Lắng nghe chọn difficulty từ React UI
        // EventBus.once("select-difficulty", this.onDifficultySelected);

        // // Báo React scene đã sẵn sàng để hiện UI chọn difficulty
        // EventBus.emit("current-scene-ready", this);
    }

    // startGameAnim() {
    //     const lastStep = this.ZOOM_NODE.length - 2;
    //     this.ZOOM_STEP = lastStep;
    //     this.POWER_SCALE_STEP = lastStep;

    //     this.cameras.main.zoom = this.ZOOM_NODE[lastStep];

    //     const pd = CharacterManager.character?.power;
    //     if (pd) {
    //         pd.setScale(this.POWER_SCALE_NODE[lastStep]);
    //     }

    //     this.time.delayedCall(1000, () => {
    //         this.ZOOM_STEP = 0;
    //         this.POWER_SCALE_STEP = 0;
    //         const cam = this.cameras.main;
    //         const pdNow = CharacterManager.character?.power;

    //         const zoomObj = { value: cam.zoom };
    //         this.tweens.killTweensOf(cam);
    //         this.tweens.add({
    //             targets: zoomObj,
    //             value: this.ZOOM_NODE[0],
    //             duration: 1500,
    //             ease: "Cubic.easeOut",
    //             onUpdate: () => cam.setZoom(zoomObj.value),
    //         });

    //         if (pdNow) {
    //             this.tweens.killTweensOf(pdNow);
    //             this.tweens.add({
    //                 targets: pdNow,
    //                 scale: this.POWER_SCALE_NODE[0],
    //                 duration: 1500,
    //                 ease: "Cubic.easeOut",
    //             });
    //         }
    //     });
    // }

    // shutdown() {
    //     EventBus.off("zoom-in", this.onZoomIn);
    //     EventBus.off("zoom-out", this.onZoomOut);
    //     EventBus.off("select-difficulty", this.onDifficultySelected);
    // }

    // private setupZoomEvents() {
    //     EventBus.on("zoom-in", this.onZoomIn);
    //     EventBus.on("zoom-out", this.onZoomOut);
    // }

    // private setupCameraDrag() {
    //     const cam = this.cameras.main;
    //     const DRAG_THRESHOLD = 8;

    //     this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    //         this.isDragging = true;
    //         this.dragStartX = pointer.x;
    //         this.dragStartY = pointer.y;
    //         this.camStartX = cam.scrollX;
    //         this.camStartY = cam.scrollY;
    //     });

    //     this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
    //         if (!this.isDragging) return;
    //         const dx = (pointer.x - this.dragStartX) / cam.zoom;
    //         const dy = (pointer.y - this.dragStartY) / cam.zoom;
    //         cam.setScroll(this.camStartX - dx, this.camStartY - dy);
    //     });

    //     this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
    //         if (!this.isDragging) return;

    //         const movedX = Math.abs(pointer.x - this.dragStartX);
    //         const movedY = Math.abs(pointer.y - this.dragStartY);

    //         if (movedX < DRAG_THRESHOLD && movedY < DRAG_THRESHOLD) {
    //             const worldPoint = cam.getWorldPoint(pointer.x, pointer.y);
    //             CharacterManager.moveToPoint(worldPoint.x, worldPoint.y);
    //         }

    //         this.isDragging = false;
    //     });

    //     this.input.on("pointerupoutside", () => {
    //         this.isDragging = false;
    //     });
    // }
}
