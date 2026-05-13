type Room = {
    row: number;
    col: number;
    power: number;
    isRequiredPath: boolean;
};

function generatePowerMap(row: number, col: number, pathLength: number, totalPowerPath: number, totalPowerRemaining: number) {

    // 1. Khởi tạo lưới 5x5 trống
    const grid: Room[][] = [];
    for (let r = 0; r < row; r++) {
        grid[r] = [];
        for (let c = 0; c < col; c++) {
            grid[r][c] = { row: r, col: c, power: 0, isRequiredPath: false };
        }
    }

    // 2. Tìm lộ trình dài 20 phòng (Backtracking đơn giản)
    const path: Room[] = [];
    function findPath(r: number, c: number): boolean {
        if (path.length === pathLength) return true;
        
        // Trộn ngẫu nhiên các hướng để đường đi tự nhiên
        const dirs = [[0,1], [0,-1], [1,0], [-1,0]].sort(() => Math.random() - 0.5);
        
        for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < row && nc >= 0 && nc < col && !grid[nr][nc].isRequiredPath) {
                grid[nr][nc].isRequiredPath = true;
                path.push(grid[nr][nc]);
                if (findPath(nr, nc)) return true;
                // Backtrack nếu đi vào ngõ cụt
                grid[nr][nc].isRequiredPath = false;
                path.pop();
            }
        }
        return false;
    }

    // Chọn điểm bắt đầu ngẫu nhiên và chạy tìm đường
    const startR = Math.floor(Math.random() * row);
    const startC = Math.floor(Math.random() * col);
    grid[startR][startC].isRequiredPath = true;
    path.push(grid[startR][startC]);
    findPath(startR, startC);

    // 3. Phân bổ 100 Power cho 20 phòng trên lộ trình
    // Theo yêu cầu: Phòng 1 có 1 power, các phòng sau chia nốt 99 power
    path[0].power = 1; 
    let remainingPathPower = totalPowerPath - 1;

    // Chia ngẫu nhiên 99 power cho 19 phòng còn lại (mỗi phòng tối thiểu 1 để đảm bảo có tiến triển)
    for (let i = 1; i < path.length; i++) {
        path[i].power = 1;
        remainingPathPower--;
    }
    
    while (remainingPathPower > 0) {
        const idx = Math.floor(Math.random() * (path.length - 1)) + 1; // Bỏ phòng đầu
        path[idx].power++;
        remainingPathPower--;
    }

    // 4. Phân bổ 50 Power cho 5 phòng còn lại (không nằm trên path)
    const offPathRooms: Room[] = [];
    for (let r = 0; r < row; r++) {
        for (let c = 0; c < col; c++) {
            if (!grid[r][c].isRequiredPath) offPathRooms.push(grid[r][c]);
        }
    }

    let remainingOffPower = totalPowerRemaining;
    while (remainingOffPower > 0 && offPathRooms.length > 0) {
        const idx = Math.floor(Math.random() * offPathRooms.length);
        offPathRooms[idx].power++;
        remainingOffPower--;
    }

    return { grid, path, exit: path[path.length - 1] };
}

// Chạy thử
const result = generatePowerMap(5, 5, 20, 100, 50);
console.log("Lộ trình đi qua:", result.path.map(p => `(${p.row},${p.col}) Power: ${p.power}`));