import PointDTO from "@/game/general/dtos/PointDTO";
import DoorView from "./doorView";
import FloorView from "./floorView";
import WallView from "./wallView";
import { SpriteSizes } from "@/game/general/sprites/spriteconfig";

export default class RoomView extends Phaser.GameObjects.Container {
    private _floorLayer: Phaser.GameObjects.Container;
    private _wallLayer: Phaser.GameObjects.Container;
    private _doorLayer: Phaser.GameObjects.Container;

    private _width: number;
    private _height: number;

    constructor(scene: Phaser.Scene, posCenter: PointDTO, size: {col: number, row: number}) {
        super(scene, posCenter.x, posCenter.y);
        scene.add.existing(this);
        this._floorLayer = this.scene.add.container(0, 0);
        this._wallLayer = this.scene.add.container(0, 0);
        this._doorLayer = this.scene.add.container(0, 0);
        this.add([this._floorLayer, this._wallLayer, this._doorLayer]);
        this.create(size.col, size.row);
    }
    private create(col: number, row: number) {
    const tileW = SpriteSizes.Standard.width;
    const tileH = SpriteSizes.Standard.height;

    this._width = col * tileW;
    this._height = row * tileH;

    const midCol = Math.floor(col / 2);
    const midRow = Math.floor(row / 2);

    // Vị trí tương đối so với Container (0,0 là trung tâm phòng)
    const offsetX = -this._width / 2 + tileW / 2;
    const offsetY = -this._height / 2 + tileH / 2;

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const x = offsetX + j * tileW;
            const y = offsetY + i * tileH;

            if (i === 0 || i === row - 1 || j === 0 || j === col - 1) {
                if ((i === midRow && j === 0) ||              
                    (i === midRow && j === col - 1) ||          
                    (j === midCol && i === 0) ||              
                    (j === midCol && i === row - 1)) {

                    const door = new DoorView(this.scene, x, y);
                    this._doorLayer.add(door);
                } else {
                    const wall = new WallView(this.scene, x, y);
                    this._wallLayer.add(wall);
                }
            } else {
                const floor = new FloorView(this.scene, x, y);
                this._floorLayer.add(floor);
            }
        }
    }
}

    public getTopLeftCornerPos(){
        return new PointDTO(this.x - this._width / 2, this.y - this._height / 2);
    }

    public getTopRightCornerPos(){
        return new PointDTO(this.x + this._width / 2, this.y - this._height / 2);
    }

    public getBottomLeftCornerPos(){
        return new PointDTO(this.x - this._width / 2, this.y + this._height / 2);
    }

    public getBottomRightCornerPos(){
        return new PointDTO(this.x + this._width / 2, this.y + this._height / 2);
    }
}