# Mobile Fix Notes

## Vấn đề

Game chạy tốt trên PC nhưng crash hoặc hiển thị sai trên mobile khi truy cập qua IP local (cùng WiFi).

---

## Nguyên nhân

### 1. WebGL crash do giới hạn GPU memory
Game dùng `type: AUTO` - Phaser tự chọn WebGL. Trên mobile, WebGL bị giới hạn max texture size (~4096px) và RAM GPU thấp. World size `3840x2160` với `resolution: 0.5` tạo ra canvas `1920x1080` - vẫn quá nặng cho nhiều thiết bị mobile.

### 2. Quá nhiều asset load cùng lúc
150+ ảnh riêng lẻ load qua WiFi. Khi một file timeout hoặc fail, Phaser không tự tiếp tục - game treo ở màn hình đen im lặng.

### 3. SSR conflict với `navigator`
`isMobile` detect bằng `navigator.userAgent` ở module level sẽ crash vì Next.js chạy SSR trên server - `navigator` không tồn tại ở đó.

### 4. Thiếu viewport meta tag
Không có `<meta name="viewport">` khiến browser mobile tự zoom trang theo viewport mặc định 980px, làm layout và canvas bị lệch.

### 5. Button overlay lệch vị trí
HTML overlay dùng `position: absolute, bottom: 0` nhưng canvas được Phaser Scale.FIT thu nhỏ và center lại - overlay không khớp với vị trí canvas thực tế trên mobile.

---

## Cách fix

### `src/game/main.ts`
- Detect mobile **bên trong hàm `StartGame`** (chạy ở browser, tránh SSR)
- Mobile dùng `type: CANVAS` thay vì `AUTO` - Canvas 2D renderer nhẹ hơn WebGL, không bị giới hạn GPU texture
- Giữ nguyên `type: AUTO` cho PC

```ts
const StartGame = (parent: string) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
    const config = {
        type: isMobile ? CANVAS : AUTO,
        // ...
    };
};
```

### `src/game/scenes/Preloader.ts`
- Giảm `maxParallelDownloads` từ 4 xuống `2`
- Thêm `loaderror` handler để log asset fail thay vì treo im lặng
- Thêm `complete` handler để confirm load xong
- Thêm timeout 30s fallback: nếu load bị treo thì vẫn vào được game

```ts
this.load.maxParallelDownloads = 2;
this.load.on('loaderror', (file) => console.warn('Failed:', file.key));
this.load.on('complete', () => console.log('All loaded'));
this.loadTimeout = setTimeout(() => this.scene.start('PlayScene'), 30000);
```

### `src/pages/_app.tsx`
- Thêm viewport meta tag đúng cách (Next.js 14 không cho phép đặt trong `_document.tsx`)

```tsx
import Head from "next/head";
// trong return:
<Head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</Head>
```

### `src/App.tsx`
- Khi `updateOptions` emit, lấy `getBoundingClientRect()` của canvas để biết vị trí thực sau Scale.FIT
- Overlay dùng `position: fixed` với tọa độ tính từ bounds canvas thực tế

```tsx
const canvas = document.querySelector('#game-container canvas') as HTMLCanvasElement;
const rect = canvas.getBoundingClientRect();
setCanvasBounds({ left: rect.left, bottom: window.innerHeight - rect.bottom, width: rect.width });
// overlay dùng: position: fixed, bottom: canvasBounds.bottom, left: canvasBounds.left
```

---

## Kết quả

| | PC | Mobile |
|---|---|---|
| Trước | ✅ Chạy được | ❌ Crash / màn hình đen |
| Sau | ✅ Chạy được | ✅ Chạy được, hiển thị đúng |
