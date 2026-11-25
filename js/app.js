/**
 * 麻家績肉丸 — 主程式邏輯（js/app.js）
 * 遵循 AGENTS.md：純原生 JS、無外部依賴、使用 textContent 安全寫入 DOM、支援鍵盤無障礙。
 */

(function () {
  "use strict";

  const STORAGE_KEY = "majiagi_preorder_cart_v1";
  const data = window.MAJIAGI_DATA;
  if (!data) return;

  const state = {
    selectedCategory: "全部",
    searchQuery: "",
    activeModalProductId: null,
    lastFocusedElement: null,
    campaignActive: false,
    appliedPromoCode: "",
    cart: loadCartFromStorage()
  };

  /* -------------------------------------------------------
     DOM 參照
     ------------------------------------------------------- */
  const menuToggleBtn = document.getElementById("menu-toggle");
  const primaryNav = document.getElementById("primary-nav");
  const navLinks = document.querySelectorAll(".nav-link");

  const campaignBanner = document.getElementById("campaign-banner");
  const campaignBadge = document.getElementById("campaign-badge");
  const campaignTitle = document.getElementById("campaign-title");
  const cdDays = document.getElementById("cd-days");
  const cdHours = document.getElementById("cd-hours");
  const cdMinutes = document.getElementById("cd-minutes");
  const cdSeconds = document.getElementById("cd-seconds");
  const promoCodeDisplay = document.getElementById("promo-code-display");
  const copyPromoBtn = document.getElementById("copy-promo-btn");
  const promoFeedback = document.getElementById("promo-feedback");

  const filterButtons = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("product-search");
  const catalogResultCount = document.getElementById("catalog-result-count");
  const productGrid = document.getElementById("product-grid");
  const emptyCatalogState = document.getElementById("empty-catalog-state");
  const resetFiltersBtn = document.getElementById("reset-filters-btn");

  const reviewsGrid = document.getElementById("reviews-grid");
  const faqList = document.getElementById("faq-list");

  const modalBackdrop = document.getElementById("product-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalCloseSecondaryBtn = document.getElementById("modal-close-secondary-btn");
  const modalImg = document.getElementById("modal-product-img");
  const modalCategory = document.getElementById("modal-product-category");
  const modalTitle = document.getElementById("modal-product-title");
  const modalPrice = document.getElementById("modal-product-price");
  const modalUnit = document.getElementById("modal-product-unit");
  const modalDesc = document.getElementById("modal-product-desc");
  const modalIngredients = document.getElementById("modal-product-ingredients");
  const modalFeeding = document.getElementById("modal-product-feeding");
  const modalAddCartBtn = document.getElementById("modal-add-cart-btn");

  const navCartBadge = document.getElementById("nav-cart-badge");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartEmptyNotice = document.getElementById("cart-empty-notice");
  const clearCartBtn = document.getElementById("clear-cart-btn");
  const promoInput = document.getElementById("preorder-promo-input");
  const applyPromoBtn = document.getElementById("apply-promo-btn");
  const promoApplyStatus = document.getElementById("promo-apply-status");
  const summarySubtotal = document.getElementById("summary-subtotal");
  const summaryDiscount = document.getElementById("summary-discount");
  const summaryTotal = document.getElementById("summary-total");
  const nicknameInput = document.getElementById("customer-nickname");
  const noteInput = document.getElementById("customer-note");
  const orderSummaryPreview = document.getElementById("order-summary-preview");
  const preorderErrorMsg = document.getElementById("preorder-error-msg");
  const preorderSuccessMsg = document.getElementById("preorder-success-msg");
  const copyOrderBtn = document.getElementById("copy-order-btn");
  const downloadOrderBtn = document.getElementById("download-order-btn");

  /* -------------------------------------------------------
     工具函式
     ------------------------------------------------------- */
  function formatCurrency(amount) {
    return "NT$ " + Number(amount).toLocaleString("zh-TW");
  }

  function padTwo(num) {
    return String(Math.max(0, num)).padStart(2, "0");
  }

  function findProductById(id) {
    return data.products.find(function (item) {
      return item.id === id;
    });
  }

  async function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.left = "-9999px";
    document.body.appendChild(helper);
    helper.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(helper);
    if (!ok) {
      throw new Error("無法自動複製文字");
    }
  }

  /* -------------------------------------------------------
     localStorage 預購清單存取（只保存商品 ID 與數量）
     ------------------------------------------------------- */
  function loadCartFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(function (entry) {
          return (
            entry &&
            typeof entry.id === "string" &&
            Number.isInteger(entry.qty) &&
            entry.qty > 0 &&
            Boolean(findProductById(entry.id))
          );
        })
        .map(function (entry) {
          return { id: entry.id, qty: entry.qty };
        });
    } catch (e) {
      return [];
    }
  }

  function saveCartToStorage() {
    try {
      const sanitized = state.cart.map(function (entry) {
        return { id: entry.id, qty: entry.qty };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    } catch (e) {
      // 忽略私密瀏覽等儲存空間受限情形
    }
  }

  /* -------------------------------------------------------
     手機版導覽選單展開與關閉
     ------------------------------------------------------- */
  function setMobileMenuOpen(isOpen) {
    primaryNav.classList.toggle("is-open", isOpen);
    menuToggleBtn.setAttribute("aria-expanded", String(isOpen));
  }

  function initNavigation() {
    menuToggleBtn.addEventListener("click", function () {
      const currentlyOpen = menuToggleBtn.getAttribute("aria-expanded") === "true";
      setMobileMenuOpen(!currentlyOpen);
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setMobileMenuOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && primaryNav.classList.contains("is-open")) {
        setMobileMenuOpen(false);
        menuToggleBtn.focus();
      }
    });
  }

  /* -------------------------------------------------------
     限時活動倒數計時器與優惠碼複製
     ------------------------------------------------------- */
  function updateCampaignTimer() {
    const campaign = data.campaign;
    const endMs = Date.parse(campaign.endTime);
    const nowMs = Date.now();
    const diffMs = endMs - nowMs;

    campaignBadge.textContent = campaign.badge;
    promoCodeDisplay.textContent = campaign.promoCode;

    if (Number.isNaN(endMs) || diffMs <= 0) {
      state.campaignActive = false;
      campaignBanner.classList.add("is-expired");
      campaignBadge.textContent = "活動已結束（示例）";
      campaignTitle.textContent = "本次限時優惠活動已結束，歡迎關注下一波新品預購。";
      cdDays.textContent = "00";
      cdHours.textContent = "00";
      cdMinutes.textContent = "00";
      cdSeconds.textContent = "00";
      copyPromoBtn.disabled = true;
      copyPromoBtn.textContent = "已結束";
      if (state.appliedPromoCode === campaign.promoCode) {
        state.appliedPromoCode = "";
        renderCartAndSummary();
      }
      return;
    }

    state.campaignActive = true;
    campaignBanner.classList.remove("is-expired");
    campaignTitle.textContent = campaign.title;
    copyPromoBtn.disabled = false;

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    cdDays.textContent = padTwo(days);
    cdHours.textContent = padTwo(hours);
    cdMinutes.textContent = padTwo(minutes);
    cdSeconds.textContent = padTwo(seconds);
  }

  function initCampaign() {
    updateCampaignTimer();
    if (state.campaignActive) {
      state.appliedPromoCode = data.campaign.promoCode;
      promoInput.value = data.campaign.promoCode;
      promoApplyStatus.textContent = "已自動帶入進行中優惠碼：" + data.campaign.promoCode + "（" + data.campaign.discountLabel + "）";
    }
    setInterval(updateCampaignTimer, 1000);

    copyPromoBtn.addEventListener("click", async function () {
      if (!state.campaignActive) return;
      const code = data.campaign.promoCode;
      try {
        await copyTextToClipboard(code);
        promoFeedback.textContent = "已複製優惠碼「" + code + "」，並已幫您套用至下方預購清單！";
        copyPromoBtn.textContent = "已複製 ✓";
        state.appliedPromoCode = code;
        promoInput.value = code;
        promoApplyStatus.textContent = "已套用優惠碼：" + code + "（" + data.campaign.discountLabel + "）";
        renderCartAndSummary();
        setTimeout(function () {
          if (state.campaignActive) {
            copyPromoBtn.textContent = "複製優惠碼";
          }
        }, 2000);
      } catch (err) {
        promoFeedback.textContent = "無法自動複製，請手動輸入優惠碼：" + code;
      }
    });
  }

  /* -------------------------------------------------------
     商品型錄渲染（使用 textContent 安全填入所有文字）
     ------------------------------------------------------- */
  function getFilteredProducts() {
    const keyword = state.searchQuery.trim().toLowerCase();
    return data.products.filter(function (product) {
      const matchCategory =
        state.selectedCategory === "全部" || product.category === state.selectedCategory;
      if (!matchCategory) return false;
      if (!keyword) return true;

      const haystack = [
        product.name,
        product.category,
        product.shortDesc,
        product.fullDesc,
        product.ingredients
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }

  function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";

    const img = document.createElement("img");
    img.className = "product-card-img";
    img.src = product.image;
    img.alt = product.imageAlt;
    img.loading = "lazy";

    const body = document.createElement("div");
    body.className = "product-card-body";

    const meta = document.createElement("div");
    meta.className = "product-card-meta";

    const categoryTag = document.createElement("span");
    categoryTag.className = "product-category-tag";
    categoryTag.textContent = product.category;

    const priceEl = document.createElement("span");
    priceEl.className = "product-price";
    priceEl.textContent = formatCurrency(product.price);

    meta.appendChild(categoryTag);
    meta.appendChild(priceEl);

    const titleEl = document.createElement("h3");
    titleEl.className = "product-card-title";
    titleEl.textContent = product.name;

    const descEl = document.createElement("p");
    descEl.className = "product-card-desc";
    descEl.textContent = product.shortDesc;

    const actions = document.createElement("div");
    actions.className = "product-card-actions";

    const detailBtn = document.createElement("button");
    detailBtn.type = "button";
    detailBtn.className = "btn btn-secondary btn-sm";
    detailBtn.textContent = "查看詳情";
    detailBtn.addEventListener("click", function () {
      openProductModal(product.id, detailBtn);
    });

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "btn btn-primary btn-sm";
    addBtn.textContent = "加入預購";
    addBtn.addEventListener("click", function () {
      addToCart(product.id, addBtn);
    });

    actions.appendChild(detailBtn);
    actions.appendChild(addBtn);

    body.appendChild(meta);
    body.appendChild(titleEl);
    body.appendChild(descEl);
    body.appendChild(actions);

    card.appendChild(img);
    card.appendChild(body);
    return card;
  }

  function renderProducts() {
    const filtered = getFilteredProducts();
    productGrid.textContent = "";

    if (filtered.length === 0) {
      emptyCatalogState.hidden = false;
      catalogResultCount.textContent = "目前共有 0 項符合條件的商品。";
      return;
    }

    emptyCatalogState.hidden = true;
    catalogResultCount.textContent =
      "顯示 " + filtered.length + " 項商品（共 " + data.products.length + " 項示例商品）";

    filtered.forEach(function (product) {
      productGrid.appendChild(createProductCard(product));
    });
  }

  function initCatalogFilters() {
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.selectedCategory = btn.getAttribute("data-category") || "全部";
        filterButtons.forEach(function (other) {
          const isSelected = other === btn;
          other.classList.toggle("is-active", isSelected);
          other.setAttribute("aria-pressed", String(isSelected));
        });
        renderProducts();
      });
    });

    searchInput.addEventListener("input", function () {
      state.searchQuery = searchInput.value;
      renderProducts();
    });

    resetFiltersBtn.addEventListener("click", function () {
      state.selectedCategory = "全部";
      state.searchQuery = "";
      searchInput.value = "";
      filterButtons.forEach(function (btn) {
        const isAll = btn.getAttribute("data-category") === "全部";
        btn.classList.toggle("is-active", isAll);
        btn.setAttribute("aria-pressed", String(isAll));
      });
      renderProducts();
      searchInput.focus();
    });

    renderProducts();
  }

  /* -------------------------------------------------------
     商品詳情彈窗（Esc 與點擊背景關閉，textContent 渲染）
     ------------------------------------------------------- */
  function openProductModal(productId, triggerEl) {
    const product = findProductById(productId);
    if (!product) return;

    state.activeModalProductId = product.id;
    state.lastFocusedElement = triggerEl || document.activeElement;

    modalImg.src = product.image;
    modalImg.alt = product.imageAlt;
    modalCategory.textContent = product.category;
    modalTitle.textContent = product.name;
    modalPrice.textContent = formatCurrency(product.price);
    modalUnit.textContent = "規格：" + product.unit;
    modalDesc.textContent = product.fullDesc;
    modalIngredients.textContent = product.ingredients;
    modalFeeding.textContent = product.feedingGuide;

    modalBackdrop.hidden = false;
    document.body.style.overflow = "hidden";
    modalCloseBtn.focus();
  }

  function closeProductModal() {
    if (modalBackdrop.hidden) return;
    modalBackdrop.hidden = true;
    document.body.style.overflow = "";
    state.activeModalProductId = null;

    if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === "function") {
      state.lastFocusedElement.focus();
    }
  }

  function initModal() {
    modalCloseBtn.addEventListener("click", closeProductModal);
    modalCloseSecondaryBtn.addEventListener("click", closeProductModal);

    modalBackdrop.addEventListener("click", function (event) {
      if (event.target === modalBackdrop) {
        closeProductModal();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modalBackdrop.hidden) {
        closeProductModal();
      }
    });

    modalAddCartBtn.addEventListener("click", function () {
      if (!state.activeModalProductId) return;
      addToCart(state.activeModalProductId, modalAddCartBtn);
      closeProductModal();
    });
  }

  /* -------------------------------------------------------
     顧客評價與 4 題 FAQ 渲染（使用 textContent，FAQ 支援鍵盤操作）
     ------------------------------------------------------- */
  function renderReviews() {
    reviewsGrid.textContent = "";
    data.reviews.forEach(function (rev) {
      const card = document.createElement("article");
      card.className = "review-card";

      const stars = document.createElement("div");
      stars.className = "review-stars";
      stars.setAttribute("aria-label", "評價 " + rev.rating + " 顆星");
      stars.textContent = "★".repeat(rev.rating);

      const comment = document.createElement("p");
      comment.className = "review-comment";
      comment.textContent = "「" + rev.comment + "」";

      const footer = document.createElement("div");
      footer.className = "review-footer";

      const author = document.createElement("span");
      author.className = "review-author";
      author.textContent = rev.author;

      const meta = document.createElement("span");
      meta.textContent = rev.hedgehogName + "｜購入：" + rev.productBought;

      footer.appendChild(author);
      footer.appendChild(meta);

      card.appendChild(stars);
      card.appendChild(comment);
      card.appendChild(footer);
      reviewsGrid.appendChild(card);
    });
  }

  function renderFaqs() {
    faqList.textContent = "";
    data.faqs.forEach(function (faq, index) {
      const item = document.createElement("div");
      item.className = "faq-item";

      const heading = document.createElement("h3");
      heading.style.margin = "0";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "faq-question-btn";
      btn.id = "faq-btn-" + faq.id;
      const panelId = "faq-panel-" + faq.id;
      btn.setAttribute("aria-expanded", index === 0 ? "true" : "false");
      btn.setAttribute("aria-controls", panelId);

      const qText = document.createElement("span");
      qText.textContent = faq.question;

      const icon = document.createElement("span");
      icon.className = "faq-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "+";

      btn.appendChild(qText);
      btn.appendChild(icon);
      heading.appendChild(btn);

      const panel = document.createElement("div");
      panel.className = "faq-answer-panel";
      panel.id = panelId;
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", btn.id);
      panel.hidden = index !== 0;

      const ansP = document.createElement("p");
      ansP.textContent = faq.answer;
      panel.appendChild(ansP);

      btn.addEventListener("click", function () {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!expanded));
        panel.hidden = expanded;
      });

      item.appendChild(heading);
      item.appendChild(panel);
      faqList.appendChild(item);
    });
  }

  /* -------------------------------------------------------
     預購清單計算、localStorage 同步與明細匯出
     ------------------------------------------------------- */
  function addToCart(productId, feedbackBtn) {
    const existing = state.cart.find(function (entry) {
      return entry.id === productId;
    });
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({ id: productId, qty: 1 });
    }
    saveCartToStorage();
    renderCartAndSummary();
    hideOrderAlerts();

    if (feedbackBtn) {
      const originalText = feedbackBtn.textContent;
      feedbackBtn.textContent = "已加入 ✓";
      setTimeout(function () {
        feedbackBtn.textContent = originalText;
      }, 1200);
    }
  }

  function updateItemQty(productId, delta) {
    const idx = state.cart.findIndex(function (entry) {
      return entry.id === productId;
    });
    if (idx === -1) return;
    state.cart[idx].qty += delta;
    if (state.cart[idx].qty <= 0) {
      state.cart.splice(idx, 1);
    }
    saveCartToStorage();
    renderCartAndSummary();
    hideOrderAlerts();
  }

  function removeItemFromCart(productId) {
    state.cart = state.cart.filter(function (entry) {
      return entry.id !== productId;
    });
    saveCartToStorage();
    renderCartAndSummary();
    hideOrderAlerts();
  }

  function calculateTotals() {
    let subtotal = 0;
    let totalQty = 0;

    state.cart.forEach(function (entry) {
      const product = findProductById(entry.id);
      if (product) {
        subtotal += product.price * entry.qty;
        totalQty += entry.qty;
      }
    });

    const isValidPromo =
      state.campaignActive &&
      state.appliedPromoCode.trim().toUpperCase() === data.campaign.promoCode.toUpperCase();

    const finalTotal = isValidPromo
      ? Math.round(subtotal * data.campaign.discountRate)
      : subtotal;
    const discountAmount = subtotal - finalTotal;

    return {
      totalQty: totalQty,
      subtotal: subtotal,
      discountAmount: discountAmount,
      finalTotal: finalTotal,
      promoApplied: isValidPromo ? data.campaign.promoCode : ""
    };
  }

  function buildOrderText() {
    const totals = calculateTotals();
    const nickname = nicknameInput.value.trim();
    const note = noteInput.value.trim();

    if (state.cart.length === 0) {
      return "（尚未選擇預購商品，請先於上方商品型錄加入品項）";
    }

    const lines = [
      "【麻家績肉丸｜預購明細】",
      "聯絡人暱稱：" + (nickname || "（請填寫暱稱）"),
      "--------------------------------"
    ];

    state.cart.forEach(function (entry, idx) {
      const product = findProductById(entry.id);
      if (!product) return;
      const lineTotal = product.price * entry.qty;
      lines.push(
        (idx + 1) + ". " + product.name + " × " + entry.qty + "（" + formatCurrency(lineTotal) + "）"
      );
    });

    lines.push("--------------------------------");
    lines.push("商品總數：" + totals.totalQty + " 件");
    lines.push("商品小計：" + formatCurrency(totals.subtotal));
    lines.push("使用優惠碼：" + (totals.promoApplied || "未使用"));
    if (totals.discountAmount > 0) {
      lines.push("優惠折抵：- " + formatCurrency(totals.discountAmount));
    }
    lines.push("優惠後預估金額：" + formatCurrency(totals.finalTotal));
    lines.push("備註：" + (note || "無"));
    lines.push("--------------------------------");
    lines.push("※ 本明細由麻家績肉丸靜態網站產生，請直接貼至品牌 LINE 或 IG 確認排單。");

    return lines.join("\n");
  }

  function renderCartAndSummary() {
    const totals = calculateTotals();
    navCartBadge.textContent = String(totals.totalQty);

    cartItemsContainer.textContent = "";
    if (state.cart.length === 0) {
      cartEmptyNotice.hidden = false;
    } else {
      cartEmptyNotice.hidden = true;
      state.cart.forEach(function (entry) {
        const product = findProductById(entry.id);
        if (!product) return;

        const row = document.createElement("div");
        row.className = "cart-item";

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const nameEl = document.createElement("span");
        nameEl.className = "cart-item-name";
        nameEl.textContent = product.name;

        const unitPriceEl = document.createElement("span");
        unitPriceEl.className = "cart-item-unit-price";
        unitPriceEl.textContent = formatCurrency(product.price) + "／份";

        info.appendChild(nameEl);
        info.appendChild(unitPriceEl);

        const controls = document.createElement("div");
        controls.className = "cart-item-controls";

        const stepper = document.createElement("div");
        stepper.className = "qty-stepper";

        const minusBtn = document.createElement("button");
        minusBtn.type = "button";
        minusBtn.className = "qty-btn";
        minusBtn.textContent = "−";
        minusBtn.setAttribute("aria-label", "減少 " + product.name + " 數量");
        minusBtn.addEventListener("click", function () {
          updateItemQty(product.id, -1);
        });

        const qtyVal = document.createElement("span");
        qtyVal.className = "qty-value";
        qtyVal.textContent = String(entry.qty);

        const plusBtn = document.createElement("button");
        plusBtn.type = "button";
        plusBtn.className = "qty-btn";
        plusBtn.textContent = "+";
        plusBtn.setAttribute("aria-label", "增加 " + product.name + " 數量");
        plusBtn.addEventListener("click", function () {
          updateItemQty(product.id, 1);
        });

        stepper.appendChild(minusBtn);
        stepper.appendChild(qtyVal);
        stepper.appendChild(plusBtn);

        const rightGroup = document.createElement("div");
        rightGroup.style.display = "flex";
        rightGroup.style.alignItems = "center";
        rightGroup.style.gap = "0.65rem";

        const lineTotalEl = document.createElement("span");
        lineTotalEl.className = "cart-item-subtotal";
        lineTotalEl.textContent = formatCurrency(product.price * entry.qty);

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "btn-text-danger";
        removeBtn.textContent = "移除";
        removeBtn.setAttribute("aria-label", "移除 " + product.name);
        removeBtn.addEventListener("click", function () {
          removeItemFromCart(product.id);
        });

        rightGroup.appendChild(lineTotalEl);
        rightGroup.appendChild(removeBtn);

        controls.appendChild(stepper);
        controls.appendChild(rightGroup);

        row.appendChild(info);
        row.appendChild(controls);
        cartItemsContainer.appendChild(row);
      });
    }

    summarySubtotal.textContent = formatCurrency(totals.subtotal);
    summaryDiscount.textContent = "- " + formatCurrency(totals.discountAmount);
    summaryTotal.textContent = formatCurrency(totals.finalTotal);
    orderSummaryPreview.value = buildOrderText();
  }

  function hideOrderAlerts() {
    preorderErrorMsg.hidden = true;
    preorderErrorMsg.textContent = "";
    preorderSuccessMsg.hidden = true;
    preorderSuccessMsg.textContent = "";
  }

  function showOrderError(message, focusTarget) {
    preorderSuccessMsg.hidden = true;
    preorderErrorMsg.textContent = message;
    preorderErrorMsg.hidden = false;
    if (focusTarget && typeof focusTarget.focus === "function") {
      focusTarget.focus();
    }
  }

  function showOrderSuccess(message) {
    preorderErrorMsg.hidden = true;
    preorderSuccessMsg.textContent = message;
    preorderSuccessMsg.hidden = false;
  }

  function validatePreorderBeforeExport() {
    if (state.cart.length === 0) {
      showOrderError("預購清單目前是空的，請先加入至少一項商品再匯出明細。", searchInput);
      return false;
    }
    if (!nicknameInput.value.trim()) {
      showOrderError("請輸入聯絡人暱稱（不可空白），方便我們於 LINE 或 IG 核對訂單。", nicknameInput);
      return false;
    }
    return true;
  }

  function initPreorder() {
    clearCartBtn.addEventListener("click", function () {
      state.cart = [];
      saveCartToStorage();
      renderCartAndSummary();
      hideOrderAlerts();
    });

    applyPromoBtn.addEventListener("click", function () {
      const code = promoInput.value.trim();
      if (!code) {
        state.appliedPromoCode = "";
        promoApplyStatus.textContent = "已清除優惠碼，改以原價計算。";
        renderCartAndSummary();
        return;
      }
      if (!state.campaignActive) {
        state.appliedPromoCode = "";
        promoApplyStatus.textContent = "目前限時活動已結束，無法套用活動優惠碼。";
        renderCartAndSummary();
        return;
      }
      if (code.toUpperCase() === data.campaign.promoCode.toUpperCase()) {
        state.appliedPromoCode = data.campaign.promoCode;
        promoInput.value = data.campaign.promoCode;
        promoApplyStatus.textContent = "已成功套用優惠碼：" + data.campaign.promoCode + "（" + data.campaign.discountLabel + "）";
      } else {
        state.appliedPromoCode = "";
        promoApplyStatus.textContent = "查無此優惠碼，請確認是否為「" + data.campaign.promoCode + "」。";
      }
      renderCartAndSummary();
    });

    nicknameInput.addEventListener("input", function () {
      hideOrderAlerts();
      orderSummaryPreview.value = buildOrderText();
    });

    noteInput.addEventListener("input", function () {
      orderSummaryPreview.value = buildOrderText();
    });

    copyOrderBtn.addEventListener("click", async function () {
      if (!validatePreorderBeforeExport()) return;
      const text = buildOrderText();
      orderSummaryPreview.value = text;
      try {
        await copyTextToClipboard(text);
        showOrderSuccess("已成功複製預購明細！請直接前往品牌 LINE 或 IG 貼上私訊我們。");
      } catch (err) {
        showOrderError("瀏覽器不支援自動複製，請直接全選上方預購明細文字手動複製。", orderSummaryPreview);
      }
    });

    downloadOrderBtn.addEventListener("click", function () {
      if (!validatePreorderBeforeExport()) return;
      const text = buildOrderText();
      orderSummaryPreview.value = text;

      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeDate = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = "麻家績肉丸-預購明細-" + safeDate + ".txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showOrderSuccess("已下載預購明細 .txt 檔案！您可將檔案內容貼至品牌 LINE 或 IG。");
    });

    renderCartAndSummary();
  }

  /* -------------------------------------------------------
     初始化全部模組
     ------------------------------------------------------- */
  initNavigation();
  initCampaign();
  initCatalogFilters();
  initModal();
  renderReviews();
  renderFaqs();
  initPreorder();
})();
