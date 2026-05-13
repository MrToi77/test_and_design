import PointDTO from "@/game/general/dtos/PointDTO";
import { SpriteSizes } from "@/game/general/sprites/spriteconfig";
import { sideType } from "@/game/general/types/sideType";
import RoomView from "../room/roomView";
const ROOM_COLS = 5;
const ROOM_ROWS = 5;

// Bitmask: 1=top, 2=right, 4=bottom, 8=left
const TOP    = 1;
const RIGHT  = 2;
const BOTTOM = 4;
const LEFT   = 8;

function decodeSides(mask: number): sideType[] {
    const sides: sideType[] = [];
    if (mask & TOP)    sides.push("top");
    if (mask & RIGHT)  sides.push("right");
    if (mask & BOTTOM) sides.push("bottom");
    if (mask & LEFT)   sides.push("left");
    return sides;
}

export default class MapView extends Phaser.GameObjects.Container{
    constructor(scene: Phaser.Scene, posCenter: PointDTO, mapGrid: number[][]){
        super(scene, posCenter.x, posCenter.y);
        scene.add.existing(this);
        this.create(mapGrid, {col: 0, row: 0, side: "top"});
    }

    private create(mapGrid: number[][], exit: {col: number, row: number, side: sideType}) {
        const ROOM_PIXEL_WIDTH = ROOM_COLS * SpriteSizes.Standard.width;
        const ROOM_PIXEL_HEIGHT = ROOM_ROWS * SpriteSizes.Standard.height;
        const originR = Math.floor(mapGrid.length / 2);
        const originC = Math.floor(mapGrid[0].length / 2);
        const offsetX = -originC * ROOM_PIXEL_WIDTH;
        const offsetY = -originR * ROOM_PIXEL_HEIGHT;

        for (let r = 0; r < mapGrid.length; r++) {
            for (let c = 0; c < mapGrid[0].length; c++) {
                const x = offsetX + c * ROOM_PIXEL_WIDTH;
                const y = offsetY + r * ROOM_PIXEL_HEIGHT;
                const room = new RoomView(this.scene, new PointDTO(x, y), {col: ROOM_COLS, row: ROOM_ROWS});
                this.add(room);
            }
        }
    }
}