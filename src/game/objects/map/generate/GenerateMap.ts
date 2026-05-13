import { sideType } from "@/game/general/types/sideType";

export type ExitInfo = {
    /** Grid col của phòng chứa lối ra */
    col: number;
    /** Grid row của phòng chứa lối ra */
    row: number;
    /** Hướng lối ra (luôn hướng ra ngoài rìa) */
    side: sideType;
};

// Bitmask: 1=top, 2=right, 4=bottom, 8=left
const TOP    = 1;
const RIGHT  = 2;
const BOTTOM = 4;
const LEFT   = 8;

export function generateMap(size: { row: number; col: number }): { grid: number[][]; exit: ExitInfo }{
    const map: number[][] = [];
    for (let r = 0; r < size.row; r++) {
        const row: number[] = [];
        for (let c = 0; c < size.col; c++) {
            let mask = 0;
            if (r > 0)      mask |= TOP;
            if (c < size.col - 1) mask |= RIGHT;
            if (r < size.row - 1) mask |= BOTTOM;
            if (c > 0)        mask |= LEFT;
            row.push(mask);
        }
        map.push(row);
    }

    // Collect tất cả ô rìa và hướng ra ngoài tương ứng
    const rimCells: ExitInfo[] = [];
    for (let c = 0; c < size.col; c++) {
        rimCells.push({ col: c, row: 0,        side: "top"    });
        rimCells.push({ col: c, row: size.row - 1, side: "bottom" });
    }
    for (let r = 1; r < size.row - 1; r++) {
        rimCells.push({ col: 0,        row: r, side: "left"  });
        rimCells.push({ col: size.col - 1, row: r, side: "right" });
    }

    // Random 1 ô rìa làm lối ra
    const exitIdx = Math.floor(Math.random() * rimCells.length);
    const exit = rimCells[exitIdx]!;

    // Thêm bit hướng ra ngoài vào mask của phòng đó
    const sideBit: Record<sideType, number> = {
        top: TOP, right: RIGHT, bottom: BOTTOM, left: LEFT
    };
    map[exit.row]![exit.col]! |= sideBit[exit.side];

    return { grid: map, exit };
}