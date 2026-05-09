import React, { useRef, useState, useEffect } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import { EventBus } from './game/EventBus';
// import { DifficultyType, DIFFICULTY_CONFIG } from './game/types/difficultyType';

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const currentScene = (_scene: Phaser.Scene) => {};

    // null = chưa hiện, "selecting" = đang chọn, "fading" = đang fade, "done" = ẩn hẳn
    const [uiState, setUiState] = useState<"hidden" | "selecting" | "fading" | "done">("hidden");

    useEffect(() => {
        const handler = () => setUiState("selecting");
        EventBus.on("current-scene-ready", handler);
        return () => { EventBus.off("current-scene-ready", handler); };
    }, []);

    // useEffect(() => {
    //     const handler = () => {
    //         setUiState("fading");
    //         setTimeout(() => setUiState("done"), 800); // khớp với transition duration
    //     };
    //     EventBus.on("difficulty-confirmed", handler);
    //     return () => { EventBus.off("difficulty-confirmed", handler); };
    // }, []);

    // const handleSelect = (difficulty: DifficultyType) => {
    //     EventBus.emit("select-difficulty", difficulty);
    // };

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />

            {/* Màn hình chọn difficulty */}
            

            {/* Nút zoom góc dưới phải */}
            <div style={{
                position: "fixed",
                bottom: 20,
                right: 20,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                zIndex: 100,
            }}>
                <button onClick={() => EventBus.emit("zoom-in")} style={zoomBtnStyle}>+</button>
                <button onClick={() => EventBus.emit("zoom-out")} style={zoomBtnStyle}>−</button>
            </div>
        </div>
    );
}

// const DIFFICULTY_COLORS: Record<DifficultyType, string> = {
//     easy:    "#16a34a",
//     medium:  "#ca8a04",
//     hard:    "#dc2626",
//     extreme: "#7c3aed",
// };

// function DifficultyButton({ difficulty, onClick }: { difficulty: DifficultyType; onClick: () => void }) {
//     const [isHover, setIsHover] = useState(false);
//     const { label, size } = DIFFICULTY_CONFIG[difficulty];
//     const color = DIFFICULTY_COLORS[difficulty];

//     return (
//         <button
//             onClick={onClick}
//             onMouseEnter={() => setIsHover(true)}
//             onMouseLeave={() => setIsHover(false)}
//             style={{
//                 padding: "16px 32px",
//                 fontSize: 20,
//                 fontWeight: "bold",
//                 fontFamily: "Arial Black, sans-serif",
//                 backgroundColor: isHover ? color : "transparent",
//                 color: isHover ? "#fff" : color,
//                 border: `3px solid ${color}`,
//                 borderRadius: 12,
//                 cursor: "pointer",
//                 transition: "all 0.2s ease",
//                 minWidth: 140,
//             }}
//         >
//             <div>{label}</div>
//             <div style={{ fontSize: 13, fontWeight: "normal", opacity: 0.85, marginTop: 4 }}>
//                 {size}×{size} phòng
//             </div>
//         </button>
//     );
// }

const zoomBtnStyle: React.CSSProperties = {
    width: 44,
    height: 44,
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "rgba(30,30,30,0.8)",
    color: "#fff",
    border: "2px solid rgba(255,255,255,0.3)",
    borderRadius: 8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
};

export default App;
