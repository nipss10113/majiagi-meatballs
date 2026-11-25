/**
 * 麻家績肉丸 — 本地靜態資料庫（js/data.js）
 * 注意：以下商品、活動、顧客評價與聯絡示範資訊皆為品牌網站建置用「示例資料」，
 * 正式上線前可依實際營業內容直接修改此檔案，無須更動程式邏輯。
 */

window.MAJIAGI_DATA = {
  /**
   * 限時活動設定（示例）
   * endTime 必須包含明確時區偏移（例如 +08:00 臺灣時間），確保跨裝置倒數一致。
   * 驗收「已過期」狀態時，可暫時將 endTime 改為過去時間（例如 "2026-11-01T23:59:59+08:00"）。
   */
  campaign: {
    isSample: true,
    badge: "限時活動（示例）",
    title: "新刺友嚐鮮週｜全館績肉丸輸入優惠碼享 9 折",
    subtitle: "讓刺寶每天都能換口味，全天然無添加鮮食現正優惠中。",
    promoCode: "HEDGEHOG90",
    discountRate: 0.9,
    discountLabel: "9 折優惠",
    endTime: "2026-12-31T23:59:59+08:00"
  },

  /**
   * 商品型錄（5 項商品，分為 3 大類：主食肉丸、機能副食、點心凍乾）
   * 每項包含：id、name、category、price、unit、shortDesc、fullDesc、ingredients、feedingGuide、image、imageAlt、isSample
   */
  products: [
    {
      id: "meatball-chicken-pumpkin",
      name: "鮮嫩雞胸南瓜績肉丸",
      category: "主食肉丸",
      price: 280,
      unit: "150g／袋（約 25 顆）",
      shortDesc: "低脂臺灣雞胸搭配蒸熟栗子南瓜，手工捏製蒸烤，好咬不黏牙。（示例商品）",
      fullDesc:
        "專為刺蝟牙口與每日營養需求設計的基礎主食肉丸。嚴選去皮去油臺灣雞胸肉細絞，揉入高纖栗子南瓜泥慢火蒸熟定型。全程不加澱粉黏著劑、不加鹽與防腐劑，每顆直徑約 1.2 公分，方便刺蝟小口啃咬或剝碎拌入日常餐盤，解決刺蝟主食選擇過於單一的困擾。",
      ingredients: "臺灣去皮雞胸肉、栗子南瓜（100% 原型食材，無其他添加物）",
      feedingGuide: "建議每日依體重餵食 2–4 顆，可常溫退冰或微溫後剝小塊餵食。",
      image: "images/product-chicken-pumpkin.jpg",
      imageAlt: "淺口陶盤中擺放數顆金黃柔和色澤的鮮嫩雞胸南瓜績肉丸，旁有新鮮蒸南瓜丁",
      isSample: true
    },
    {
      id: "meatball-salmon-sweetpotato",
      name: "鮭魚地瓜元氣績肉丸",
      category: "主食肉丸",
      price: 320,
      unit: "150g／袋（約 25 顆）",
      shortDesc: "去刺鮭魚菲力佐台農 57 號黃地瓜，富含天然 Omega-3 呵護刺毛與皮膚。（示例商品）",
      fullDesc:
        "針對換刺期、皮膚容易乾燥的刺蝟研發。選用去刺去皮野生鮭魚菲力與蒸熟台農 57 號黃地瓜泥手工揉合，低溫烘焙鎖住天然魚香與 Omega-3 脂肪酸。無額外油脂、無人工色素與誘食劑，讓平時只吃乾飼料的刺蝟也能享受天然鮮魚主食。",
      ingredients: "去刺鮭魚菲力、台農 57 號黃地瓜（無鹽、無油、無防腐劑）",
      feedingGuide: "每週建議搭配主食輪替 2–3 次，未食用完畢請密封冷凍保存。",
      image: "images/product-salmon-sweetpotato.jpg",
      imageAlt: "暖陶邊迷你碗盛裝鮭魚地瓜元氣績肉丸，旁有蒸黃地瓜塊與亞麻布",
      isSample: true
    },
    {
      id: "functional-duck-broccoli",
      name: "鴨肉青花菜護胃績肉丸",
      category: "機能副食",
      price: 300,
      unit: "140g／袋（約 22 顆）",
      shortDesc: "低敏去皮鴨胸搭配細切熟青花菜，溫和好吸收，適合腸胃敏感刺寶。（示例商品）",
      fullDesc:
        "許多刺蝟容易對單一肉源敏感或偶爾軟便，我們特別以低敏鴨胸肉為基底，搭配清燙切碎的青花菜花蕾，打造溫和好消化的機能副食肉丸。無穀物、無乳製品與人工膠類，幫助日常飲食多樣化並維持理想便便狀態。",
      ingredients: "去皮鴨胸肉、清燙青花菜花蕾（無穀物、無人工膠類）",
      feedingGuide: "適合作為夜間主餐加菜或換食過渡期的溫和副食。",
      image: "images/product-duck-broccoli.jpg",
      imageAlt: "米色手作陶碟盛裝鴨肉青花菜護胃績肉丸，表面可見細緻綠色花椰菜碎點",
      isSample: true
    },
    {
      id: "snack-freeze-dried-chicken",
      name: "原肉雞丁冷凍乾燥脆粒",
      category: "點心凍乾",
      price: 240,
      unit: "60g／罐",
      shortDesc: "-40°C 真空凍乾鎖住鮮度，酥脆好剝碎，常溫好保存的安心加菜。（示例商品）",
      fullDesc:
        "想幫刺蝟加菜又擔心生鮮保存不易嗎？原肉雞丁凍乾採用 -40°C 急速冷凍乾燥技術，直接將純雞胸肉丁水分昇華，保留完整蛋白質與原始肉香。零甘油、零保鮮劑，可直接當作夜間探索零食，也能滴入溫開水還原成鮮嫩肉丁。",
      ingredients: "100% 臺灣雞胸肉（無任何調味料與保鮮劑）",
      feedingGuide: "乾吃請搭配充足飲水；亦可泡溫水 30 秒還原後拌餐。",
      image: "images/product-freeze-dried-chicken.jpg",
      imageAlt: "迷你陶碗與洞石杯墊上擺放多孔酥脆的原肉雞丁冷凍乾燥脆粒",
      isSample: true
    },
    {
      id: "snack-apple-chicken-chips",
      name: "蘋果雞肉雙拼無添加脆片",
      category: "點心凍乾",
      price: 190,
      unit: "50g／袋",
      shortDesc: "去籽富士蘋果薄片與純雞肉烘烤脆片，天然清甜香氣，親訓互動首選。（示例商品）",
      fullDesc:
        "取代高脂肪麵包蟲乾的健康獎勵點心！將去皮去籽富士蘋果切薄片，與純雞肉泥薄片一同低溫慢烘 12 小時。全程不加糖漿、不漂白、無防腐劑，清脆口感能滿足刺蝟啃咬樂趣，是建立親密信任與日常獎勵的安心選擇。",
      ingredients: "富士蘋果（去皮去籽）、純雞胸肉（無糖漬、無漂白）",
      feedingGuide: "作為互動親訓獎勵點心，建議每日 1–2 小片即可。",
      image: "images/product-apple-chicken-chips.jpg",
      imageAlt: "米白霧面陶盤盛裝烘烤後的薄片富士蘋果與純雞肉脆片",
      isSample: true
    }
  ],

  /**
   * 顧客評價（示例資料）
   */
  reviews: [
    {
      id: "rev-1",
      author: "刺刺麻麻 小芸（示例）",
      hedgehogName: "芋圓｜2 歲非洲迷你刺蝟",
      rating: 5,
      productBought: "鮮嫩雞胸南瓜績肉丸",
      comment: "以前只能一直買貓飼料配蟲乾，選擇真的超少。自從換成麻家績肉丸剝碎拌餐，芋圓每天晚上碗都舔得乾乾淨淨，成分只有肉跟南瓜讓人很放心！"
    },
    {
      id: "rev-2",
      author: "阿哲爸比（示例）",
      hedgehogName: "麻糬｜1 歲 4 個月",
      rating: 5,
      productBought: "鮭魚地瓜元氣績肉丸",
      comment: "換刺期皮膚比較乾的時候開始輪替鮭魚地瓜口味，沒有油膩味或奇怪香精味，包裝標示超透明，冷凍拿出來退冰就能餵很方便。"
    },
    {
      id: "rev-3",
      author: "刺蝟控 米琪（示例）",
      hedgehogName: "布丁｜3 歲老刺寶",
      rating: 5,
      productBought: "原肉雞丁冷凍乾燥脆粒",
      comment: "布丁年紀大了咬不太動硬飼料，這款雞丁凍乾泡一點溫水就變軟嫩，完全無添加不會造成腸胃負擔，已經回購第三次了。"
    }
  ],

  /**
   * 常見問題（固定 4 題，支援鍵盤操作展開）
   */
  faqs: [
    {
      id: "faq-1",
      question: "麻家績肉丸真的完全沒有添加物嗎？可以取代單一乾飼料嗎？",
      answer: "是的，全系列皆為 100% 原型食材手工製作，零防腐劑、零人工香料、零誘食劑與澱粉黏著劑。建議可將「主食肉丸」作為每日餐盤中的鮮食主餐，搭配適量專用飼料或輪替不同肉源（雞、鮭魚、鴨），讓刺蝟吃得更均衡多元。（示例說明）"
    },
    {
      id: "faq-2",
      question: "刺蝟一次該餵幾顆？牙口比較小或年紀大的刺寶怎麼吃？",
      answer: "一般成年刺蝟建議每次餵食 1–2 顆（約 1.2 公分大小），可視體重與活動量調整。若家中刺寶年紀較長或習慣小口進食，退冰微溫後用手輕輕撥碎或壓成肉泥即可輕鬆享用，凍乾系列也可泡溫水軟化。"
    },
    {
      id: "faq-3",
      question: "鮮食肉丸與點心凍乾要怎麼保存？保存期限多久？",
      answer: "因為完全不添加防腐劑，鮮食類肉丸建議「冷凍保存」可放 60 天，冷藏則建議 3 天內食用完畢；凍乾與脆片類請密封置於陰涼乾燥處，避免陽光直射，開封後建議 45 天內餵食完畢以維持最佳酥脆度。"
    },
    {
      id: "faq-4",
      question: "在網站選好預購清單後，要怎麼完成訂購？",
      answer: "本網站為純靜態預購整理工具，不收集線上刷卡資料。請於下方預購清單確認品項、數量與聯絡人暱稱後，點擊「複製明細」或「下載 .txt」，再貼到我們的官方 LINE 或 IG 私訊給客服，我們就會為您安排手工排單製作與寄送！（示例流程）"
    }
  ]
};
