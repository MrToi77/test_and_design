/**
 * A* Pathfinder trên grid tile-based.
 * Mỗi cell = TILE_SIZE x TILE_SIZE pixels.
 */

const TILE_SIZE = 100;

interface Node {
    gx: number; // grid col
    gy: number; // grid row
    g: number;  // cost from start
    h: number;  // heuristic to goal
    f: number;  // g + h
    parent: Node | null;
}

function heuristic(ax: number, ay: number, bx: number, by: number): number {
    // Manhattan distance
    return Math.abs(ax - bx) + Math.abs(ay - by);
    // ax, ay tọa độ cột hàng của ô hiện tại
    // bx, by tọa độ cột hàng của ô đích 
    // ===> Hàm dùng để ướng lượng từ ô hiện tại đến ô đích còn khoảng bao nhiêu.
    // Đặc trưng của thuật toán A* so với Dijk.
}

function nodeKey(gx: number, gy: number): string {
    return `${gx},${gy}`;
    // Đặt label cho ô đã xét (Dùng cho việc tra cứu.)
}

/**
 * Chuyển world position → grid cell (floor)
 */
export function worldToGrid(wx: number, wy: number): { gx: number; gy: number } {
    return {
        gx: Math.floor(wx / TILE_SIZE),
        gy: Math.floor(wy / TILE_SIZE),
    };

    // wx, wy tọa độ thực của ô (Container chứa ô). Vd: 250px, 150px
    // gx, gy tọa độ, vị trí của ô trong grid. Vd: (1,2), (1, 3);
    // Nếu đứng ở x = 150, thì 150 / 100 = 1.5. Lấy Math.floor (làm tròn xuống) sẽ được 1. Vậy đang đứng ở cột 1.
}

/**
 * Chuyển grid cell → world position (center của cell)
 */
export function gridToWorld(gx: number, gy: number): { wx: number; wy: number } {
    return {
        wx: gx * TILE_SIZE + TILE_SIZE / 2,
        wy: gy * TILE_SIZE + TILE_SIZE / 2,
    };

    // gx * TILE_SIZE: Tìm tọa độ mép trái của ô. Ví dụ ô cột 1 sẽ bắt đầu từ pixel 100.

    // + TILE_SIZE / 2: Cộng thêm một nửa kích thước ô để lấy tọa độ chính giữa ô đó.
}

/**
 * Tìm đường đi từ (startWX, startWY) đến (goalWX, goalWY).
 * blockedCells: Set của các key "gx,gy" là wall hoặc door.
 * Trả về mảng world positions (waypoints), không bao gồm điểm xuất phát.
 * Trả về [] nếu không tìm được đường.
 */
export function findPath(
    startWX: number,
    startWY: number,
    goalWX: number,
    goalWY: number,
    blockedCells: Set<string>
): Array<{ x: number; y: number }> {
    const start = worldToGrid(startWX, startWY);
    const goal = worldToGrid(goalWX, goalWY);

    // Nếu goal bị block, tìm cell gần nhất không bị block
    const resolvedGoal = resolveGoal(goal.gx, goal.gy, blockedCells);
    if (!resolvedGoal) return [];

    const openList: Node[] = [];
    const closedSet = new Set<string>();
    const openMap = new Map<string, Node>();

    const startNode: Node = {
        gx: start.gx,
        gy: start.gy,
        g: 0,
        h: heuristic(start.gx, start.gy, resolvedGoal.gx, resolvedGoal.gy),
        f: 0,
        parent: null,
    };
    startNode.f = startNode.g + startNode.h;
    openList.push(startNode);
    openMap.set(nodeKey(start.gx, start.gy), startNode);

    const MAX_ITERATIONS = 2000;
    let iterations = 0;

    while (openList.length > 0 && iterations < MAX_ITERATIONS) {
        iterations++;

        // Lấy node có f nhỏ nhất
        let lowestIdx = 0;
        for (let i = 1; i < openList.length; i++) {
            if (openList[i].f < openList[lowestIdx].f) lowestIdx = i;
        }
        const current = openList.splice(lowestIdx, 1)[0];
        openMap.delete(nodeKey(current.gx, current.gy));
        closedSet.add(nodeKey(current.gx, current.gy));

        // Đến đích
        if (current.gx === resolvedGoal.gx && current.gy === resolvedGoal.gy) {
            return reconstructPath(current, goalWX, goalWY);
        }

        // 4 hướng (không diagonal để tránh đi xuyên góc tường)
        const neighbors = [
            { gx: current.gx, gy: current.gy - 1 },
            { gx: current.gx, gy: current.gy + 1 },
            { gx: current.gx - 1, gy: current.gy },
            { gx: current.gx + 1, gy: current.gy },
        ];

        for (const nb of neighbors) {
            const key = nodeKey(nb.gx, nb.gy);
            if (closedSet.has(key)) continue;
            if (blockedCells.has(key)) continue;

            const g = current.g + 1;
            const h = heuristic(nb.gx, nb.gy, resolvedGoal.gx, resolvedGoal.gy);
            const f = g + h;

            const existing = openMap.get(key);
            if (existing && existing.g <= g) continue;

            const node: Node = { gx: nb.gx, gy: nb.gy, g, h, f, parent: current };
            openList.push(node);
            openMap.set(key, node);
        }
    }

    // Không tìm được đường
    return [];
}

/**
 * Nếu goal bị block, tìm cell gần nhất xung quanh không bị block.
 */
function resolveGoal(
    gx: number,
    gy: number,
    blockedCells: Set<string>
): { gx: number; gy: number } | null {
    if (!blockedCells.has(nodeKey(gx, gy))) return { gx, gy };

    // BFS tìm cell gần nhất không bị block
    const queue: Array<{ gx: number; gy: number }> = [{ gx, gy }];
    const visited = new Set<string>();
    visited.add(nodeKey(gx, gy));

    for (let i = 0; i < queue.length && i < 50; i++) {
        const cur = queue[i];
        const neighbors = [
            { gx: cur.gx, gy: cur.gy - 1 },
            { gx: cur.gx, gy: cur.gy + 1 },
            { gx: cur.gx - 1, gy: cur.gy },
            { gx: cur.gx + 1, gy: cur.gy },
        ];
        for (const nb of neighbors) {
            const key = nodeKey(nb.gx, nb.gy);
            if (visited.has(key)) continue;
            visited.add(key);
            if (!blockedCells.has(key)) return nb;
            queue.push(nb);
        }
    }
    return null;
}

/**
 * Reconstruct path từ goal node về start, trả về world positions.
 * Điểm cuối cùng dùng exact goalWX/goalWY thay vì center của cell.
 */
function reconstructPath(
    goalNode: Node,
    exactGoalWX: number,
    exactGoalWY: number
): Array<{ x: number; y: number }> {
    const path: Array<{ x: number; y: number }> = [];
    let cur: Node | null = goalNode;

    while (cur !== null) {
        const world = gridToWorld(cur.gx, cur.gy);
        path.unshift({ x: world.wx, y: world.wy });
        cur = cur.parent;
    }

    // Bỏ điểm đầu (vị trí hiện tại của character)
    path.shift();

    // Điểm cuối dùng exact position0
    if (path.length > 0) {
        path[path.length - 1] = { x: exactGoalWX, y: exactGoalWY };
    }

    return path;
}
