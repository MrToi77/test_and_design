import { SpriteNames } from "./spritenames";

export class SpriteSizes {
    /** Kích thước chuẩn bạn muốn hiển thị */
    static readonly Standard = { 
        width: 10, 
        height: 10 
    };

    /**
     * Lấy scale để resize sprite về kích thước Standard
     */
    static getScale(scene: Phaser.Scene, spriteName: string): { x: number; y: number } {
        if (!scene || !scene.textures) {
            console.error("Scene or textures not available");
            return { x: 1, y: 1 };
        }

        const texture = scene.textures.get(spriteName);
        const source = texture.getSourceImage();

        const originalWidth = (source as any).width || 32;
        const originalHeight = (source as any).height || 32;

        return {
            x: SpriteSizes.Standard.width / originalWidth,
            y: SpriteSizes.Standard.height / originalHeight
        };
    }

    /** Scale cho từng loại sprite */
    static getFloorScale(scene: Phaser.Scene) {
        return this.getScale(scene, SpriteNames.Floor);
    }

    static getWallScale(scene: Phaser.Scene) {
        return this.getScale(scene, SpriteNames.Wall);
    }

    static getDoorScale(scene: Phaser.Scene) {
        return this.getScale(scene, SpriteNames.Door);
    }
}
