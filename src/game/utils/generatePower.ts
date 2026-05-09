function key(x: number, y: number): string {
    return `${x},${y}`;
}

function getNeighbors(x: number, y: number, size: number) {
    return [
        { x: x + 1, y },
        { x: x - 1, y },
        { x, y: y + 1 },
        { x, y: y - 1 },
    ].filter(p => p.x >= 0 && p.x < size && p.y >= 0 && p.y < size);
}

function shuffle<T>(arr: T[]) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    }
}

function generateMainPath(
    size: number,
    startX: number,
    startY: number,
    targetLen: number,
) {
    while (true) {
        const visited = new Set<string>();
        const path: { x: number; y: number }[] = [];

        const dfs = (x: number, y: number): boolean => {
            visited.add(key(x, y));
            path.push({ x, y });

            if (path.length >= targetLen) return true;

            const neighbors = getNeighbors(x, y, size);
            shuffle(neighbors);

            for (const n of neighbors) {
                if (!visited.has(key(n.x, n.y))) {
                    if (dfs(n.x, n.y)) return true;
                }
            }

            visited.delete(key(x, y));
            path.pop();
            return false;
        };

        if (dfs(startX, startY)) return path;
    }
}

/**
 * FIXED VERSION
 */
export function generateMap(size: number, exitPower: number): Map<string, number> {
    const totalRooms = size * size;
    const startX = Math.floor(size / 2);
    const startY = Math.floor(size / 2);

    const targetLen = Math.max(1, Math.floor(totalRooms * 0.7));

    const mainPath = generateMainPath(size, startX, startY, targetLen);
    const mainSet = new Set(mainPath.map(p => key(p.x, p.y)));

    const extraCells: { x: number; y: number }[] = [];
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (!mainSet.has(key(x, y))) extraCells.push({ x, y });
        }
    }

    const result = new Map<string, number>();

    // =========================
    // MAIN PATH (FIBONACCI PROGRESSION)
    // =========================

    const mainTarget = exitPower - 1;
    const mainLen = mainPath.length;

    // 1. tạo weights Fibonacci
    const fib = buildFibWeights(mainLen);
    const weights = fib.map((w, i) => w * 0.7 + (i + 1) * 0.3);

    // 2. normalize về đúng tổng
    const mainPowers = normalizeToTarget(weights, mainTarget);

    // đảm bảo mỗi phòng >= 1
    for (let i = 0; i < mainPowers.length; i++) {
        if (mainPowers[i] < 1) mainPowers[i] = 1;
    }

    // gán vào map
    for (let i = 0; i < mainLen; i++) {
        result.set(key(mainPath[i].x, mainPath[i].y), mainPowers[i]);
    }

    // =========================
    // 2. EXTRA POWER
    // =========================

    const totalTarget = Math.round(exitPower * 1.5);
    const currentSum =
        1 + mainPowers.reduce((a, b) => a + b, 0); // +1 start

    let extraRemaining = totalTarget - currentSum;

    for (const cell of extraCells) {
        let p = 1;

        if (extraRemaining > 0) {
            const add = Math.min(extraRemaining, Math.floor(Math.random() * 3));
            p += add;
            extraRemaining -= add;
        }

        result.set(key(cell.x, cell.y), p);
    }

    // nếu còn dư → dồn vào phòng cuối
    if (extraRemaining > 0 && extraCells.length > 0) {
        const last = extraCells[extraCells.length - 1];
        const k = key(last.x, last.y);
        result.set(k, result.get(k)! + extraRemaining);
    }

    // spawn luôn = 1
    result.set(key(startX, startY), 1);

    return result;
}

function buildFibWeights(n: number): number[] {
    const fib: number[] = new Array(n).fill(0);
    fib[0] = 1;
    if (n > 1) fib[1] = 1;

    for (let i = 2; i < n; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];

        // cap để tránh overflow và tránh lệch quá mạnh
        if (fib[i] > 1000) fib[i] = 1000;
    }

    return fib;
}

function normalizeToTarget(weights: number[], target: number): number[] {
    const sum = weights.reduce((a, b) => a + b, 0);

    // scale về target
    const scaled = weights.map(w => (w / sum) * target);

    // làm tròn xuống trước
    const result = scaled.map(v => Math.floor(v));

    let currentSum = result.reduce((a, b) => a + b, 0);
    let diff = target - currentSum;

    // bù sai số vào phần cuối (late game)
    let i = result.length - 1;
    while (diff > 0) {
        result[i]++;
        diff--;
        i = (i - 1 + result.length) % result.length;
    }

    return result;
}