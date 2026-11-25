# 麻家績肉丸（Majiagi Meatballs）品牌網站

> 專為養刺蝟的人打造的全天然無添加鮮食品牌網站，解決「刺蝟的食物太少」的日常困擾。

## 品牌定位與核心賣點
- **品牌名稱**：麻家績肉丸
- **目標客群**：養刺蝟的人（刺蝟飼主／刺寶爸媽）
- **解決痛點**：市面上專為刺蝟設計的安全食物選擇太少，飼主往往只能依賴單一乾飼料或高脂蟲乾。
- **核心賣點**：**全天然無添加**——嚴選 100% 原型肉類與蔬果手工製作，零防腐劑、零人工香料、零誘食劑、無澱粉黏著劑。

## 網站功能一覽
1. **品牌首頁與響應式手機選單**：
   - Mobile-First 設計，所有色彩由 `css/style.css` 的 `:root` CSS 變數統一管理。
   - 支援鍵盤操作與無障礙焦點提示（`Tab`、`Enter`、`Space`、`Esc`）。
   - 包含品牌故事、首屏主標與核心賣點、「看商品」與「認識品牌」雙按鈕、聯絡資訊（示例）與頁尾。
2. **本地商品型錄與詳情彈窗（`js/data.js`）**：
   - 5 項示例商品，分為「主食肉丸」、「機能副食」、「點心凍乾」3 大分類。
   - 支援分類按鈕篩選與即時關鍵字搜尋，並提供「查無結果」提示與一鍵重設。
   - 「查看詳情」彈窗支援 `Esc` 鍵與點擊背景關閉，所有動態資料均以 `textContent` 安全寫入。
3. **限時活動橫幅、顧客評價與 FAQ**：
   - 採用含明確時區（`+08:00`）的固定截止時間，即時顯示天、時、分、秒及活動結束狀態。
   - 提供優惠碼（示例：`HEDGEHOG90`）一鍵複製與即時文字回饋。
   - 從 `js/data.js` 讀取 3 則顧客評價（標示為示例）與 4 題支援鍵盤展開的常見問題。
4. **本地預購清單與明細匯出**：
   - 支援加入商品、增減數量、移除商品、清空清單，並以 `localStorage` 只保存商品 ID 與數量。
   - 自動計算商品小計、優惠碼折抵與優惠後預估金額。
   - 提供聯絡人暱稱與備註欄位，在清單為空或暱稱空白時顯示友善提示並導引焦點。
   - 一鍵「複製明細」或「下載 .txt」，方便顧客自行貼給品牌 LINE 或 IG。

## 檔案結構
```text
網站製作/
├── AGENTS.md              # 開發規範與無障礙／純靜態原則
├── README.md              # 品牌說明、功能、預覽與部署指引
├── .gitignore             # Git 忽略清單
├── vercel.json            # Vercel 靜態資源自訂快取標頭設定
├── index.html             # 品牌網站主頁面
├── css/
│   └── style.css          # Mobile-First 樣式表與品牌 CSS 變數
├── js/
│   ├── data.js            # 本地靜態資料（活動、商品、評價、FAQ）
│   └── app.js             # 互動邏輯、篩選、彈窗、倒數、購物清單與匯出
└── images/                # 本地攝影棚等級產品與首屏圖片（小寫命名）
    ├── hero-hedgehog-meatballs.jpg
    ├── product-chicken-pumpkin.jpg
    ├── product-salmon-sweetpotato.jpg
    ├── product-duck-broccoli.jpg
    ├── product-freeze-dried-chicken.jpg
    └── product-apple-chicken-chips.jpg
```

## 本機預覽方式
本專案為純原生靜態網站（無建置步驟、無外部相依套件），建議透過任一種本地靜態伺服器開啟預覽（以確保剪貼簿與現代瀏覽器安全性 API 正常運作）：

- **方法一（VS Code）**：安裝並開啟 **Live Server** 擴充功能，於 `index.html` 右鍵選擇 `Open with Live Server`。
- **方法二（Python）**：在專案根目錄執行：
  ```bash
  python -m http.server 8080
  ```
  接著於瀏覽器開啟 `http://localhost:8080`。
- **方法三（Node.js）**：在專案根目錄執行：
  ```bash
  npx serve .
  ```
- **直接開啟**：亦可直接雙擊 `index.html` 以瀏覽器開啟（若無 `https` / `localhost` 環境，複製按鈕會自動改採 `execCommand` 備援）。

## 活動狀態驗收方式（進行中／已過期）
1. **進行中狀態**：預設 `js/data.js` 中的 `campaign.endTime` 為 `"2026-12-31T23:59:59+08:00"`，開啟頁面即可看到「天、時、分、秒」即時倒數，且可複製並套用 `HEDGEHOG90` 享 9 折。
2. **已過期狀態**：將 `js/data.js` 中 `campaign.endTime` 暫時改為過去時間（例如 `"2026-11-01T23:59:59+08:00"`）並重新整理頁面，橫幅會切換為「活動已結束（示例）」、倒數歸零（`00 天 00 時 00 分 00 秒`）、複製按鈕停用，且預購清單將不再套用該過期優惠折扣（驗收後請記得改回未來時間）。

## Vercel 靜態部署操作指南
本網站為純原生靜態檔案（無框架、無需建置命令），可直接部署於 Vercel：

1. **從 GitHub 匯入**：登入 [Vercel](https://vercel.com/) 後點擊 **Add New... → Project**，選擇已推送的 GitHub 儲存庫並點擊 **Import**。
2. **選擇框架預設（Framework Preset）**：在 **Framework Preset** 下拉選單選擇 **`Other`**。
3. **確認根目錄（Root Directory）**：確認 **Root Directory** 為專案根目錄 `./`（即包含 `index.html` 的資料夾）。
4. **確認建置與輸出設定（Build and Output Settings）**：
   - **Build Command**：維持空白（不勾選 Override，不需要執行任何 build）。
   - **Output Directory**：維持預設 `./`（或空白，直接提供根目錄靜態檔案）。
   - **Environment Variables**：無須設定任何環境變數或金鑰。
5. **點擊 Deploy 並進行部署後檢查**：
   - 確認 `*.vercel.app` 網址可正常載入首屏圖片與 5 張產品攝影棚圖片（無 404 與大小寫錯誤）。
   - 測試手機版（DevTools 375px 寬度）漢堡選單展開／關閉。
   - 測試商品分類篩選、即時搜尋、詳情彈窗（`Esc` 關閉）與預購清單「複製明細」／「下載 .txt」。
   - 開啟瀏覽器 DevTools **Network** 分頁，確認圖片與 CSS／JS 均為 `200`（或 `304`）且無外部 CDN 請求失敗。

### 關於 `vercel.json` 的快取設定說明
因本網站包含較高解析度的本地產品攝影圖片（`images/*.jpg`），專案根目錄附有 `vercel.json` 進行資源快取設定：
- `/images/(.*)` 設定 `public, max-age=604800, stale-while-revalidate=86400`（圖片可於瀏覽器與 CDN 快取 7 天，提升回訪載入速度）。
- `/(css|js)/(.*)` 設定 `public, max-age=3600, must-revalidate`（樣式與資料／腳本快取 1 小時並在過期後驗證更新，方便活動或商品文案修改後快速生效）。
- `index.html` 維持 Vercel 預設短快取與 ETag 驗證，確保首頁內容更新能即時反映。
