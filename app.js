/**
 * JNP Wealth Tracker - Core Application Logic (app.js)
 */

// ==========================================================================
// Application State & Sample Data Setup
// ==========================================================================
const AppState = {
    transactions: [],
    portfolio: [],
    exchangeRate: 35.0, // Default USD/THB rate
    selectedMonth: "",
    currentPage: 1,
    itemsPerPage: 10,
    charts: {
        monthlyOverview: null,
        categoryBreakdown: null
    }
};

// Default Sample Data (Matches the user's April 2026 data for instant premium experience)
const SampleTransactions = [
    // Income (รายรับ) - 2026-04
    { id: 't_inc_1', date: '2026-04-01', name: 'เงินพิเศษ', type: 'income', category: 'เงินพิเศษ', amount: 5000.0, period: '2026-04' },
    { id: 't_inc_2', date: '2026-04-07', name: 'เงินรายสัปดาห์', type: 'income', category: 'เงินเดือนหลัก', amount: 1200.0, period: '2026-04' },
    { id: 't_inc_3', date: '2026-04-07', name: 'เงินพิเศษ', type: 'income', category: 'เงินพิเศษ', amount: 500.0, period: '2026-04' },
    { id: 't_inc_4', date: '2026-04-15', name: 'เงินรายสัปดาห์', type: 'income', category: 'เงินเดือนหลัก', amount: 1200.0, period: '2026-04' },
    { id: 't_inc_5', date: '2026-04-20', name: 'เงินรายสัปดาห์', type: 'income', category: 'เงินเดือนหลัก', amount: 1200.0, period: '2026-04' },
    { id: 't_inc_6', date: '2026-04-28', name: 'เงินรายสัปดาห์', type: 'income', category: 'เงินเดือนหลัก', amount: 1200.0, period: '2026-04' },
    
    // Expense (รายจ่าย) - 2026-04
    { id: 't_exp_1', date: '2026-04-02', name: 'ครีมบำรุงผิว', type: 'expense', category: 'อื่น ๆ ในชีวิตแมน', amount: 139.0, period: '2026-04' },
    { id: 't_exp_2', date: '2026-04-01', name: 'ลงทุน QQQ', type: 'expense', category: 'ลงทุน', amount: 300.0, period: '2026-04' },
    { id: 't_exp_3', date: '2026-04-03', name: 'ค่าข้าวกลางวัน', type: 'expense', category: 'ค่าข้าว', amount: 70.0, period: '2026-04' },
    { id: 't_exp_4', date: '2026-04-05', name: 'ซื้อขนมเซเว่น', type: 'expense', category: 'อื่น ๆ ในชีวิตแมน', amount: 136.0, period: '2026-04' },
    { id: 't_exp_5', date: '2026-04-04', name: 'icloud รายเดือน', type: 'expense', category: 'อื่น ๆ ในชีวิตแมน', amount: 39.0, period: '2026-04' },
    { id: 't_exp_6', date: '2026-04-05', name: 'ค่าข้าวเย็น', type: 'expense', category: 'ค่าข้าว', amount: 77.0, period: '2026-04' },
    { id: 't_exp_7', date: '2026-04-06', name: 'เติมเงินเกมมือถือ', type: 'expense', category: 'เติมเกม', amount: 325.0, period: '2026-04' },
    { id: 't_exp_8', date: '2026-04-06', name: 'ค่าก๋วยเตี๋ยว', type: 'expense', category: 'ค่าข้าว', amount: 97.0, period: '2026-04' },
    { id: 't_exp_9', date: '2026-04-07', name: 'ข้าวราดแกง', type: 'expense', category: 'ค่าข้าว', amount: 85.0, period: '2026-04' },
    { id: 't_exp_10', date: '2026-04-07', name: 'ขนมคบเคี้ยว', type: 'expense', category: 'อื่น ๆ ในชีวิตแมน', amount: 78.0, period: '2026-04' },
    { id: 't_exp_11', date: '2026-04-07', name: 'ซื้อหุ้น ASTS', type: 'expense', category: 'ลงทุน', amount: 600.0, period: '2026-04' },
    { id: 't_exp_12', date: '2026-04-08', name: 'ข้าวผัดกระเพรา', type: 'expense', category: 'ค่าข้าว', amount: 90.0, period: '2026-04' },
    { id: 't_exp_13', date: '2026-04-09', name: 'ข้าวขาหมู', type: 'expense', category: 'ค่าข้าว', amount: 75.0, period: '2026-04' },
    { id: 't_exp_14', date: '2026-04-10', name: 'ค่าเรียนมวย Monthpass', type: 'expense', category: 'อื่น ๆ ในชีวิตแมน', amount: 513.6, period: '2026-04' },
    { id: 't_exp_15', date: '2026-04-10', name: 'ข้าว + น้ำส้ม', type: 'expense', category: 'ค่าข้าว', amount: 140.0, period: '2026-04' },
    { id: 't_exp_16', date: '2026-04-14', name: 'ข้าว 2 มื้อวันสงกรานต์', type: 'expense', category: 'ค่าข้าว', amount: 195.0, period: '2026-04' },
    { id: 't_exp_17', date: '2026-04-16', name: 'ปิ้งย่างหมูกระทะ', type: 'expense', category: 'ค่าข้าว', amount: 706.0, period: '2026-04' },
    { id: 't_exp_18', date: '2026-04-17', name: 'ข้าวหน้าเป็ด', type: 'expense', category: 'ค่าข้าว', amount: 85.0, period: '2026-04' },
    { id: 't_exp_19', date: '2026-04-18', name: 'ค่าน้ำดื่ม', type: 'expense', category: 'ค่าข้าว', amount: 20.0, period: '2026-04' },
    { id: 't_exp_20', date: '2026-04-20', name: 'ซื้อหุ้น ASTS เพิ่ม', type: 'expense', category: 'ลงทุน', amount: 500.0, period: '2026-04' },
    { id: 't_exp_21', date: '2026-04-21', name: 'ข้าวแกงใต้', type: 'expense', category: 'ค่าข้าว', amount: 90.0, period: '2026-04' },
    { id: 't_exp_22', date: '2026-04-23', name: 'ข้าวไข่เจียว', type: 'expense', category: 'ค่าข้าว', amount: 70.0, period: '2026-04' },
    { id: 't_exp_23', date: '2026-04-23', name: 'นมโปรตีนเวย์', type: 'expense', category: 'อื่น ๆ ในชีวิตแมน', amount: 59.0, period: '2026-04' },
    { id: 't_exp_24', date: '2026-04-24', name: 'ข้าวผัดปู + นม', type: 'expense', category: 'ค่าข้าว', amount: 124.0, period: '2026-04' },
    { id: 't_exp_25', date: '2026-04-25', name: 'ข้าวแกง 2 มื้อ + นม', type: 'expense', category: 'ค่าข้าว', amount: 168.0, period: '2026-04' },
    { id: 't_exp_26', date: '2026-04-26', name: 'ซื้อนมจืดเมจิ', type: 'expense', category: 'ค่าข้าว', amount: 49.0, period: '2026-04' },
    { id: 't_exp_27', date: '2026-04-27', name: 'ข้าวหน้าหมูแดง', type: 'expense', category: 'ค่าข้าว', amount: 174.0, period: '2026-04' },
    { id: 't_exp_28', date: '2026-04-27', name: 'ค่าตัดผมชาย', type: 'expense', category: 'อื่น ๆ ในชีวิตแมน', amount: 300.0, period: '2026-04' },
    { id: 't_exp_29', date: '2026-04-27', name: 'ลงทุน ASTS สะสม', type: 'expense', category: 'ลงทุน', amount: 500.0, period: '2026-04' },
    { id: 't_exp_30', date: '2026-04-28', name: 'ข้าวมันไก่ผสม', type: 'expense', category: 'ค่าข้าว', amount: 158.0, period: '2026-04' },
    { id: 't_exp_31', date: '2026-04-29', name: 'อาหารเที่ยงที่ทำงาน', type: 'expense', category: 'ค่าข้าว', amount: 91.0, period: '2026-04' },
    { id: 't_exp_32', date: '2026-04-30', name: 'ซื้อครีมทาหน้าสิว', type: 'expense', category: 'อื่น ๆ ในชีวิตแมน', amount: 208.0, period: '2026-04' },
    { id: 't_exp_33', date: '2026-04-30', name: 'ก๋วยเตี๋ยวต้มยำ + น้ำเก๊กฮวย', type: 'expense', category: 'ค่าข้าว', amount: 145.0, period: '2026-04' },
    
    // Investment logs (การลงทุน) - 2026-04
    { id: 't_inv_1', date: '2026-04-02', name: 'QQQ', type: 'investment', category: 'ETF', amount: 299.85, period: '2026-04', action: 'ซื้อ' },
    { id: 't_inv_2', date: '2026-04-20', name: 'ASTS', type: 'investment', category: 'หุ้น', amount: 318.96, period: '2026-04', action: 'ซื้อ' },
    { id: 't_inv_3', date: '2026-04-24', name: 'LLY', type: 'investment', category: 'หุ้น', amount: 323.05, period: '2026-04', action: 'ซื้อ' },
    { id: 't_inv_4', date: '2026-04-27', name: 'ASTS', type: 'investment', category: 'หุ้น', amount: 450.99, period: '2026-04', action: 'ซื้อ' },
    { id: 't_inv_5', date: '2026-04-29', name: 'ASTS', type: 'investment', category: 'หุ้น', amount: 1619.90, period: '2026-04', action: 'ซื้อ' },
    { id: 't_inv_6', date: '2026-04-29', name: 'LLY', type: 'investment', category: 'หุ้น', amount: 486.10, period: '2026-04', action: 'ซื้อ' }
];

const SamplePortfolio = [
    { id: 'p1', ticker: 'ASTS', name: 'AST SpaceMobile, Inc.', shares: 52.72, cost: 75.72, currency: 'USD', currentPrice: 88.10 },
    { id: 'p2', ticker: 'QQQ', name: 'Invesco QQQ Trust (Nasdaq 100)', shares: 10.95, cost: 476.89, currency: 'USD', currentPrice: 701.53 },
    { id: 'p3', ticker: 'LLY', name: 'Eli Lilly and Company', shares: 3.51, cost: 860.20, currency: 'USD', currentPrice: 1017.68 },
    { id: 'p6', ticker: 'EOSE', name: 'Eos Energy Enterprises, Inc.', shares: 738.27, cost: 2.40, currency: 'USD', currentPrice: 6.88 },
    { id: 'p7', ticker: 'ทอง', name: 'ทองคำแท่ง / ทองคำ', shares: 0.473, cost: 50597.57, currency: 'THB', currentPrice: 146934.46 },
    { id: 'p8', ticker: 'NFLX', name: 'Netflix, Inc.', shares: 2.12, cost: 654.37, currency: 'USD', currentPrice: 89.33 }
];

const CategoryOptions = {
    income: ['เงินเดือนหลัก', 'เงินพิเศษ', 'โบนัส', 'ปันผล', 'อื่น ๆ'],
    expense: ['ค่าข้าว', 'อื่น ๆ ในชีวิตแมน', 'เติมเกม', 'ลงทุน', 'ค่าเดินทาง', 'ช้อปปิ้ง', 'ของใช้ในบ้าน', 'อื่น ๆ'],
    investment: ['หุ้น', 'ETF', 'ทอง', 'กองทุนรวม', 'คริปโต', 'อื่น ๆ']
};

// ==========================================================================
// Initialization & Lifecycle
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initApp();
    setupEventListeners();
});

function initApp() {
    console.log("Initializing JNP Wealth Tracker...");
    
    // Load from LocalStorage or use defaults
    const storedTx = localStorage.getItem("jnp_transactions");
    const storedPort = localStorage.getItem("jnp_portfolio");
    const storedRate = localStorage.getItem("jnp_exchange_rate");
    
    if (storedTx) {
        AppState.transactions = JSON.parse(storedTx);
    } else {
        AppState.transactions = [...SampleTransactions];
        localStorage.setItem("jnp_transactions", JSON.stringify(AppState.transactions));
    }
    
    if (storedPort) {
        AppState.portfolio = JSON.parse(storedPort);
        
        // One-time migration/cleanup: keep only active assets as requested by user
        if (!localStorage.getItem("jnp_portfolio_cleaned_v2")) {
            const activeTickers = ['ASTS', 'QQQ', 'LLY', 'NFLX', 'EOSE', 'ทอง'];
            AppState.portfolio = AppState.portfolio.filter(asset => activeTickers.includes(asset.ticker.toUpperCase()));
            localStorage.setItem("jnp_portfolio", JSON.stringify(AppState.portfolio));
            localStorage.setItem("jnp_portfolio_cleaned_v2", "true");
        }
        
        // One-time migration: correct stock prices for LLY, EOSE, ทอง, NFLX, and QQQ
        if (!localStorage.getItem("jnp_portfolio_prices_corrected_v3")) {
            AppState.portfolio.forEach(asset => {
                const ticker = asset.ticker.toUpperCase().trim();
                if (ticker === 'LLY') asset.currentPrice = 1017.68;
                else if (ticker === 'EOSE') asset.currentPrice = 6.88;
                else if (ticker === 'ทอง') asset.currentPrice = 69500.00;
                else if (ticker === 'NFLX') asset.currentPrice = 89.33;
                else if (ticker === 'QQQ') asset.currentPrice = 701.53;
            });
            localStorage.setItem("jnp_portfolio", JSON.stringify(AppState.portfolio));
            localStorage.setItem("jnp_portfolio_prices_corrected_v3", "true");
        }
        
        // One-time migration: Convert Gold (ทอง) from Baht to Ounce (oz)
        if (!localStorage.getItem("jnp_portfolio_gold_to_oz_v4")) {
            AppState.portfolio.forEach(asset => {
                const ticker = asset.ticker.toUpperCase().trim();
                if (ticker === 'ทอง' || ticker === 'GOLD') {
                    const originalShares = asset.shares;
                    asset.shares = Math.round((originalShares * 0.473) * 10000) / 10000;
                    asset.cost = Math.round((asset.cost / 0.473) * 100) / 100;
                    asset.currentPrice = Math.round((asset.currentPrice / 0.473) * 100) / 100;
                    console.log(`Migrated gold asset (${ticker}) from Baht to Ounce. Shares: ${originalShares} -> ${asset.shares}, Cost: ${asset.cost}`);
                }
            });
            localStorage.setItem("jnp_portfolio", JSON.stringify(AppState.portfolio));
            localStorage.setItem("jnp_portfolio_gold_to_oz_v4", "true");
        }
    } else {
        AppState.portfolio = [...SamplePortfolio];
        localStorage.setItem("jnp_portfolio", JSON.stringify(AppState.portfolio));
        localStorage.setItem("jnp_portfolio_cleaned_v2", "true");
        localStorage.setItem("jnp_portfolio_prices_corrected_v3", "true");
        localStorage.setItem("jnp_portfolio_gold_to_oz_v4", "true");
    }

    if (storedRate) {
        AppState.exchangeRate = parseFloat(storedRate);
    } else {
        AppState.exchangeRate = 35.25;
        localStorage.setItem("jnp_exchange_rate", AppState.exchangeRate.toString());
    }
    
    // Get unique months list for selectors
    populateMonthSelectors();
    
    // Set default selected month to the latest available month
    const months = getAvailableMonths();
    if (months.length > 0) {
        AppState.selectedMonth = months[0]; // First element is the latest month due to desc sort
        document.getElementById("global-month-select").value = AppState.selectedMonth;
    }
    
    // Sync UI
    updateDashboardUI();
    renderTransactionsTable();
    renderPortfolioTable();
    updateCategoryDropdown('expense'); // Default select type in form
    
    // Auto sync live prices in background silently on start
    syncPortfolioPrices(true);
}

// ==========================================================================
// Navigation & Sub-Tabs handling
// ==========================================================================
function setupEventListeners() {
    // Menu Tab Switching
    document.querySelectorAll(".nav-item").forEach(button => {
        button.addEventListener("click", () => {
            const targetTab = button.getAttribute("data-tab");
            switchTab(targetTab);
        });
    });
    
    // Global Month Selector changed
    document.getElementById("global-month-select").addEventListener("change", (e) => {
        AppState.selectedMonth = e.target.value;
        updateDashboardUI();
        renderTransactionsTable();
    });
    
    // Quick Add Button clicks (Opens modal)
    document.getElementById("btn-quick-add").addEventListener("click", () => {
        openQuickAddModal();
    });
    
    document.getElementById("modal-close-add").addEventListener("click", () => {
        closeModal("modal-quick-add");
    });
    
    // Trigger Sync live prices
    document.getElementById("btn-sync-prices").addEventListener("click", () => {
        syncPortfolioPrices();
    });
    
    // Form Transaction submit handler
    document.getElementById("form-transaction").addEventListener("submit", (e) => {
        e.preventDefault();
        saveTransaction();
    });
    
    // Form transaction type change dynamically updates categories
    document.getElementById("tx-type").addEventListener("change", (e) => {
        updateCategoryDropdown(e.target.value);
    });
    
    // Dynamic dropdown "Other/Custom" handler
    document.getElementById("tx-category").addEventListener("change", (e) => {
        const container = document.getElementById("custom-cat-container");
        if (e.target.value === 'อื่น ๆ') {
            container.style.display = 'block';
            document.getElementById("tx-custom-category").setAttribute("required", "required");
        } else {
            container.style.display = 'none';
            document.getElementById("tx-custom-category").removeAttribute("required");
        }
    });
    
    // Cancel Edit transaction button
    document.getElementById("btn-cancel-edit").addEventListener("click", () => {
        resetTransactionForm();
    });
    
    // Search and Filter transactions
    document.getElementById("tx-search").addEventListener("input", () => {
        AppState.currentPage = 1;
        renderTransactionsTable();
    });
    
    document.getElementById("tx-type-filter").addEventListener("change", () => {
        AppState.currentPage = 1;
        renderTransactionsTable();
    });
    
    // View All links on dashboard widgets
    document.getElementById("btn-view-all-tx").addEventListener("click", () => {
        switchTab("transactions");
    });
    
    document.getElementById("btn-view-all-portfolio").addEventListener("click", () => {
        switchTab("portfolio");
    });
    
    // Portfolio Asset modal triggers
    document.getElementById("btn-add-asset").addEventListener("click", () => {
        openAssetModal();
    });
    
    document.getElementById("modal-close-asset").addEventListener("click", () => {
        closeModal("modal-asset");
    });
    
    document.getElementById("btn-close-asset-form").addEventListener("click", () => {
        closeModal("modal-asset");
    });
    
    document.getElementById("form-asset").addEventListener("submit", (e) => {
        e.preventDefault();
        saveAsset();
    });
    
    // Dynamic asset unit label update based on ticker input
    const tickerInput = document.getElementById("asset-ticker");
    const sharesLabel = document.getElementById("shares-unit-label");
    if (tickerInput && sharesLabel) {
        const updateUnitLabel = () => {
            const val = tickerInput.value.trim().toUpperCase();
            if (val === 'ทอง' || val === 'GOLD') {
                sharesLabel.innerText = "(ออนซ์ / oz)";
                sharesLabel.className = "text-warning";
            } else {
                sharesLabel.innerText = "(หุ้น / หุ้นกู้)";
                sharesLabel.className = "text-muted";
            }
        };
        tickerInput.addEventListener("input", updateUnitLabel);
        
        // Hook into open modal action to reset / update unit label
        document.getElementById("btn-add-asset").addEventListener("click", () => {
            setTimeout(updateUnitLabel, 50);
        });
    }
    
    // Data backup and restore buttons
    document.getElementById("btn-export-json").addEventListener("click", exportDataToJSON);
    
    document.getElementById("btn-trigger-import-json").addEventListener("click", () => {
        document.getElementById("json-import-file").click();
    });
    
    document.getElementById("json-import-file").addEventListener("change", importDataFromJSON);
    
    document.getElementById("btn-clear-all-data").addEventListener("click", clearAllUserData);
    
    // Setup drag and drop for Excel files
    setupExcelImport();
}

function switchTab(tabId) {
    // Toggle active buttons
    document.querySelectorAll(".nav-item").forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
    });
    
    // Toggle active sections
    document.querySelectorAll(".tab-panel").forEach(panel => {
        panel.classList.toggle("active", panel.id === `tab-${tabId}`);
    });
    
    // Update headers based on active tab
    const title = document.getElementById("current-page-title");
    const subtitle = document.getElementById("current-page-subtitle");
    
    if (tabId === 'dashboard') {
        title.innerText = "แดชบอร์ดสรุปผล";
        subtitle.innerText = "ภาพรวมความมั่งคั่ง รายรับ รายจ่าย และการลงทุนของคุณ";
        updateDashboardUI(); // redraw charts on tab focus
    } else if (tabId === 'transactions') {
        title.innerText = "บันทึกรายรับ - รายจ่าย";
        subtitle.innerText = "จัดระเบียบรายการเดินบัญชี เพิ่ม ลบ แก้ไข รายการและเงินออมรายเดือน";
        renderTransactionsTable();
    } else if (tabId === 'portfolio') {
        title.innerText = "พอร์ตการลงทุน & สินทรัพย์";
        subtitle.innerText = "ติดตามมูลค่าตลาด หุ้นต่างประเทศ กองทุนรวม ทองคำ และผลตอบแทนสะสม";
        renderPortfolioTable();
    } else if (tabId === 'data-mgmt') {
        title.innerText = "จัดการฐานข้อมูล & สำรองไฟล์";
        subtitle.innerText = "นำเข้าไฟล์ชีตรายรับรายจ่ายเดิมของ JNP หรือแบคอัพสำรองข้อมูลเป็นไฟล์เก็บไว้";
    }
}

// ==========================================================================
// Dashboard Calculations & Charts Rendering
// ==========================================================================
function updateDashboardUI() {
    const selectedMonth = AppState.selectedMonth;
    
    // Filter monthly transactions
    const monthlyTx = AppState.transactions.filter(t => t.period === selectedMonth);
    
    let totalIncome = 0;
    let totalExpense = 0;
    let totalInvestment = 0;
    
    monthlyTx.forEach(t => {
        if (t.type === 'income') totalIncome += t.amount;
        else if (t.type === 'expense') totalExpense += t.amount;
        else if (t.type === 'investment') totalInvestment += t.amount;
    });
    
    const netBalance = totalIncome - totalExpense;
    
    // Set text outputs
    document.getElementById("dash-total-income").innerText = formatTHB(totalIncome);
    document.getElementById("dash-total-expense").innerText = formatTHB(totalExpense);
    document.getElementById("dash-net-balance").innerText = formatTHB(netBalance);
    document.getElementById("dash-total-invest").innerText = formatTHB(totalInvestment);
    
    // Visual indicators for net balance
    const balanceStatus = document.getElementById("dash-balance-status");
    if (netBalance >= 0) {
        balanceStatus.innerText = "รักษาวินัยการเงินได้ดี 🟢";
        balanceStatus.className = "trend-up";
    } else {
        balanceStatus.innerText = "ยอดใช้จ่ายเกินรายรับในเดือนนี้ ⚠️";
        balanceStatus.className = "trend-down";
    }
    
    // Investment Ratio calculation
    const investRatio = document.getElementById("dash-invest-ratio");
    if (totalIncome > 0) {
        const pct = ((totalInvestment / totalIncome) * 100).toFixed(1);
        investRatio.innerText = `คิดเป็น ${pct}% ของรายรับสะสม`;
        investRatio.className = "trend-up";
    } else {
        investRatio.innerText = "ไม่มีสัดส่วนคำนวณเนื่องจากยังไม่มีรายรับ";
        investRatio.className = "text-muted";
    }
    
    // Render Dashboard Sub-tables
    renderDashboardRecentTransactions(monthlyTx.slice(0, 5));
    renderDashboardMiniPortfolio();
    
    // Render Charts
    renderMonthlyOverviewChart();
    renderCategoryBreakdownChart(monthlyTx.filter(t => t.type === 'expense'));
}

function renderDashboardRecentTransactions(recentTx) {
    const tbody = document.querySelector("#table-recent-transactions tbody");
    tbody.innerHTML = "";
    
    if (recentTx.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">ไม่มีประวัติรายการในเดือนนี้</td></tr>`;
        return;
    }
    
    recentTx.forEach(tx => {
        const typeClass = tx.type === 'income' ? 'text-success' : tx.type === 'investment' ? 'text-indigo' : '';
        const prefix = tx.type === 'income' ? '+' : '-';
        
        tbody.innerHTML += `
            <tr>
                <td>${formatDateShort(tx.date)}</td>
                <td><strong>${tx.name}</strong></td>
                <td><span class="badge ${tx.type === 'income' ? 'badge-income' : tx.type === 'investment' ? 'badge-investment' : 'badge-expense'}">${tx.category}</span></td>
                <td class="text-right ${typeClass}">${prefix}${formatTHB(tx.amount)}</td>
            </tr>
        `;
    });
}

function renderDashboardMiniPortfolio() {
    const tbody = document.querySelector("#table-recent-portfolio tbody");
    tbody.innerHTML = "";
    
    // Take top 5 assets by value
    const sortedAssets = [...AppState.portfolio]
        .map(asset => {
            const costTHB = asset.currency === 'USD' ? asset.cost * asset.shares * AppState.exchangeRate : asset.cost * asset.shares;
            const currentPriceTHB = asset.currency === 'USD' ? asset.currentPrice * AppState.exchangeRate : asset.currentPrice;
            const valueTHB = asset.shares * currentPriceTHB;
            const profitTHB = valueTHB - costTHB;
            
            return {
                ticker: asset.ticker,
                costTHB,
                valueTHB,
                profitTHB
            };
        })
        .sort((a, b) => b.valueTHB - a.valueTHB)
        .slice(0, 5);
        
    if (sortedAssets.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">ไม่มีข้อมูลในพอร์ตโฟลิโอ</td></tr>`;
        return;
    }
    
    sortedAssets.forEach(a => {
        const profitClass = a.profitTHB >= 0 ? 'text-success' : 'text-danger';
        const sign = a.profitTHB >= 0 ? '+' : '';
        
        tbody.innerHTML += `
            <tr>
                <td>
                    <div class="dashboard-asset-cell">
                        <div class="asset-logo-wrapper mini">
                            ${getAssetLogo(a.ticker)}
                        </div>
                        <strong>${a.ticker}</strong>
                    </div>
                </td>
                <td class="text-right">${formatTHB(a.costTHB)}</td>
                <td class="text-right">${formatTHB(a.valueTHB)}</td>
                <td class="text-right ${profitClass}">${sign}${formatTHB(a.profitTHB)}</td>
            </tr>
        `;
    });
}

// Chart 1: Monthly comparison trends
function renderMonthlyOverviewChart() {
    const ctx = document.getElementById('chart-monthly-overview').getContext('2d');
    
    // Get last 6 active months
    const allMonths = getAvailableMonths().slice(0, 6).reverse(); // reverse to chronological
    
    const incomes = [];
    const expenses = [];
    const investments = [];
    
    allMonths.forEach(m => {
        const txs = AppState.transactions.filter(t => t.period === m);
        let inc = 0, exp = 0, inv = 0;
        txs.forEach(t => {
            if (t.type === 'income') inc += t.amount;
            else if (t.type === 'expense') exp += t.amount;
            else if (t.type === 'investment') inv += t.amount;
        });
        incomes.push(inc);
        expenses.push(exp);
        investments.push(inv);
    });
    
    if (AppState.charts.monthlyOverview) {
        AppState.charts.monthlyOverview.destroy();
    }
    
    AppState.charts.monthlyOverview = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: allMonths,
            datasets: [
                {
                    label: 'รายรับ (Income)',
                    data: incomes,
                    backgroundColor: 'rgba(16, 185, 129, 0.65)',
                    borderColor: '#10b981',
                    borderWidth: 1.5,
                    borderRadius: 4
                },
                {
                    label: 'รายจ่าย (Expense)',
                    data: expenses,
                    backgroundColor: 'rgba(244, 63, 94, 0.65)',
                    borderColor: '#f43f5e',
                    borderWidth: 1.5,
                    borderRadius: 4
                },
                {
                    label: 'เงินลงทุน (Investment)',
                    data: investments,
                    backgroundColor: 'rgba(99, 102, 241, 0.65)',
                    borderColor: '#6366f1',
                    borderWidth: 1.5,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#94a3b8', font: { family: 'Outfit, Noto Sans Thai', size: 11 } }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8' }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) { return '฿' + value.toLocaleString(); }
                    }
                }
            }
        }
    });
}

// Chart 2: Category distribution
function renderCategoryBreakdownChart(monthlyExpenses) {
    const ctx = document.getElementById('chart-category-breakdown').getContext('2d');
    
    const catMap = {};
    monthlyExpenses.forEach(e => {
        catMap[e.category] = (catMap[e.category] || 0) + e.amount;
    });
    
    const labels = Object.keys(catMap);
    const data = Object.values(catMap);
    
    if (AppState.charts.categoryBreakdown) {
        AppState.charts.categoryBreakdown.destroy();
    }
    
    if (labels.length === 0) {
        // Draw empty indicator state
        AppState.charts.categoryBreakdown = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['ไม่มีข้อมูลสำหรับเดือนนี้'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['rgba(255, 255, 255, 0.08)'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#64748b' } }
                }
            }
        });
        return;
    }
    
    // Harmonized custom palette for categories
    const colors = [
        '#6366f1', '#38bdf8', '#ec4899', '#f59e0b', 
        '#10b981', '#a855f7', '#14b8a6', '#f43f5e',
        '#64748b', '#84cc16'
    ];
    
    AppState.charts.categoryBreakdown = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: '#1e293b',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#94a3b8', font: { family: 'Outfit, Noto Sans Thai', size: 10 } }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const val = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const pct = ((val / total) * 100).toFixed(1);
                            return `${context.label}: ฿${val.toLocaleString()} (${pct}%)`;
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });
}

// ==========================================================================
// TAB 2: Transactions management UI Logic
// ==========================================================================
function renderTransactionsTable() {
    const searchQuery = document.getElementById("tx-search").value.toLowerCase();
    const typeFilter = document.getElementById("tx-type-filter").value;
    const selectedMonth = AppState.selectedMonth;
    
    // Filter
    let filtered = AppState.transactions.filter(t => t.period === selectedMonth);
    
    if (typeFilter !== 'all') {
        filtered = filtered.filter(t => t.type === typeFilter);
    }
    
    if (searchQuery !== '') {
        filtered = filtered.filter(t => t.name.toLowerCase().includes(searchQuery));
    }
    
    // Sort chronological desc (latest date first)
    filtered.sort((a, b) => b.date.localeCompare(a.date));
    
    // Paginate
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / AppState.itemsPerPage) || 1;
    
    if (AppState.currentPage > totalPages) AppState.currentPage = totalPages;
    
    const startIndex = (AppState.currentPage - 1) * AppState.itemsPerPage;
    const paginatedItems = filtered.slice(startIndex, startIndex + AppState.itemsPerPage);
    
    const tbody = document.getElementById("tx-list-body");
    tbody.innerHTML = "";
    
    if (paginatedItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">ไม่พบข้อมูลรายชื่อประวัติเดินบัญชีที่ระบุ</td></tr>`;
        renderPaginationUI(totalItems, totalPages);
        return;
    }
    
    paginatedItems.forEach(tx => {
        const typeClass = tx.type === 'income' ? 'text-success' : tx.type === 'investment' ? 'text-indigo' : '';
        const prefix = tx.type === 'income' ? '+' : '-';
        const typeText = tx.type === 'income' ? 'รายรับ 📈' : tx.type === 'investment' ? 'เงินลงทุน 🚀' : 'รายจ่าย 📉';
        const badgeType = tx.type === 'income' ? 'badge-income' : tx.type === 'investment' ? 'badge-investment' : 'badge-expense';
        
        tbody.innerHTML += `
            <tr>
                <td>${formatDateMedium(tx.date)}</td>
                <td><strong>${tx.name}</strong></td>
                <td><span class="badge ${badgeType}">${typeText}</span></td>
                <td>${tx.category}</td>
                <td class="text-right ${typeClass}"><strong>${prefix}${formatTHB(tx.amount)}</strong></td>
                <td class="text-center">
                    <div class="btn-action-group">
                        <button class="btn-action btn-edit-action" onclick="editTransaction('${tx.id}')">✏️</button>
                        <button class="btn-action btn-delete-action" onclick="deleteTransaction('${tx.id}')">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    renderPaginationUI(totalItems, totalPages);
}

function renderPaginationUI(totalItems, totalPages) {
    const container = document.getElementById("tx-pagination");
    container.innerHTML = "";
    
    if (totalItems === 0) return;
    
    const startIndex = (AppState.currentPage - 1) * AppState.itemsPerPage + 1;
    const endIndex = Math.min(AppState.currentPage * AppState.itemsPerPage, totalItems);
    
    let btnControls = `<div class="pagination-info">แสดงรายการที่ ${startIndex}-${endIndex} จากทั้งหมด ${totalItems} รายการ</div>`;
    
    btnControls += `<div class="pagination-controls">`;
    btnControls += `<button class="btn btn-secondary btn-sm" ${AppState.currentPage === 1 ? 'disabled' : ''} onclick="changePage(${AppState.currentPage - 1})">ก่อนหน้า</button>`;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= AppState.currentPage - 1 && i <= AppState.currentPage + 1)) {
            btnControls += `<button class="btn ${i === AppState.currentPage ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="changePage(${i})">${i}</button>`;
        } else if (i === 2 || i === totalPages - 1) {
            btnControls += `<span style="padding:4px 8px; color:var(--text-muted);">...</span>`;
        }
    }
    
    btnControls += `<button class="btn btn-secondary btn-sm" ${AppState.currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${AppState.currentPage + 1})">ถัดไป</button>`;
    btnControls += `</div>`;
    
    container.innerHTML = btnControls;
}

window.changePage = function(page) {
    AppState.currentPage = page;
    renderTransactionsTable();
};

function updateCategoryDropdown(type) {
    const dropdown = document.getElementById("tx-category");
    dropdown.innerHTML = "";
    
    const categories = CategoryOptions[type] || [];
    categories.forEach(cat => {
        dropdown.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
    
    // Hide custom input initially
    document.getElementById("custom-cat-container").style.display = 'none';
    document.getElementById("tx-custom-category").removeAttribute("required");
}

function saveTransaction() {
    const id = document.getElementById("tx-id").value;
    const date = document.getElementById("tx-date").value;
    const name = document.getElementById("tx-name").value.trim();
    const type = document.getElementById("tx-type").value;
    let category = document.getElementById("tx-category").value;
    const amount = parseFloat(document.getElementById("tx-amount").value);
    
    if (category === 'อื่น ๆ') {
        category = document.getElementById("tx-custom-category").value.trim();
        if (category === '') category = 'อื่น ๆ';
    }
    
    const period = date.substring(0, 7); // yyyy-mm
    
    if (id === "") {
        // Create new
        const newTx = {
            id: 't_' + Date.now(),
            date,
            name,
            type,
            category,
            amount,
            period
        };
        AppState.transactions.push(newTx);
    } else {
        // Edit existing
        const idx = AppState.transactions.findIndex(t => t.id === id);
        if (idx !== -1) {
            AppState.transactions[idx] = {
                ...AppState.transactions[idx],
                date,
                name,
                type,
                category,
                amount,
                period
            };
        }
    }
    
    // Save, update UI
    localStorage.setItem("jnp_transactions", JSON.stringify(AppState.transactions));
    
    // Add new period to dropdown if it didn't exist
    populateMonthSelectors();
    
    // Re-focus on the period of transaction saved
    AppState.selectedMonth = period;
    document.getElementById("global-month-select").value = period;
    
    // Reset Form
    resetTransactionForm();
    closeModal("modal-quick-add");
    
    // Refresh
    updateDashboardUI();
    renderTransactionsTable();
}

window.editTransaction = function(id) {
    const tx = AppState.transactions.find(t => t.id === id);
    if (!tx) return;
    
    // Switch to Transactions Tab if editing from dashboard
    switchTab("transactions");
    
    // Fill Form inputs
    document.getElementById("tx-id").value = tx.id;
    document.getElementById("tx-date").value = tx.date;
    document.getElementById("tx-name").value = tx.name;
    document.getElementById("tx-type").value = tx.type;
    
    // Update Category Options dropdown first
    updateCategoryDropdown(tx.type);
    
    const categorySelect = document.getElementById("tx-category");
    const isStandardCat = CategoryOptions[tx.type].includes(tx.category);
    
    if (isStandardCat) {
        categorySelect.value = tx.category;
        document.getElementById("custom-cat-container").style.display = 'none';
        document.getElementById("tx-custom-category").removeAttribute("required");
    } else {
        categorySelect.value = 'อื่น ๆ';
        document.getElementById("custom-cat-container").style.display = 'block';
        document.getElementById("tx-custom-category").value = tx.category;
        document.getElementById("tx-custom-category").setAttribute("required", "required");
    }
    
    document.getElementById("tx-amount").value = tx.amount;
    
    // Form Visuals update
    document.getElementById("form-tx-title").innerText = "แก้ไขธุรกรรมการเงิน";
    document.getElementById("btn-save-tx").innerText = "อัปเดตข้อมูล";
    document.getElementById("btn-cancel-edit").style.display = 'inline-flex';
}

window.deleteTransaction = function(id) {
    if (!confirm("คุณต้องการลบรายการการเงินนี้ใช่หรือไม่?")) return;
    
    AppState.transactions = AppState.transactions.filter(t => t.id !== id);
    localStorage.setItem("jnp_transactions", JSON.stringify(AppState.transactions));
    
    // Refresh
    populateMonthSelectors();
    updateDashboardUI();
    renderTransactionsTable();
}

function resetTransactionForm() {
    document.getElementById("tx-id").value = "";
    document.getElementById("tx-date").value = new Date().toISOString().split('T')[0];
    document.getElementById("tx-name").value = "";
    document.getElementById("tx-type").value = "expense";
    updateCategoryDropdown("expense");
    document.getElementById("tx-amount").value = "";
    
    document.getElementById("form-tx-title").innerText = "เพิ่มธุรกรรมใหม่";
    document.getElementById("btn-save-tx").innerText = "บันทึกรายการ";
    document.getElementById("btn-cancel-edit").style.display = 'none';
}

// ==========================================================================
// TAB 3: Portfolio Tracker UI Logic & Integrations
// ==========================================================================
function getAssetLogo(ticker) {
    const cleanTicker = ticker.trim().toUpperCase();
    if (cleanTicker === 'ทอง' || cleanTicker === 'GOLD') {
        return `
            <svg class="asset-logo-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="url(#goldGrad)" stroke="#d97706" stroke-width="1.5"/>
                <circle cx="32" cy="32" r="22" fill="none" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3 3"/>
                <path d="M22 28H42M26 36H38M30 44H34M24 20H40" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
                <defs>
                    <linearGradient id="goldGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stop-color="#fbbf24"/>
                        <stop offset="50%" stop-color="#f59e0b"/>
                        <stop offset="100%" stop-color="#b45309"/>
                    </linearGradient>
                </defs>
            </svg>
        `;
    }
    
    const logoUrl = `https://financialmodelingprep.com/image-stock/${cleanTicker}.png`;
    return `
        <img class="asset-logo-img" src="${logoUrl}" alt="${cleanTicker}" onload="this.nextElementSibling.style.display='none';" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="asset-logo-fallback" style="display:flex;">${cleanTicker.substring(0, 2)}</div>
    `;
}

function renderPortfolioTable() {
    const tbody = document.getElementById("portfolio-list-body");
    tbody.innerHTML = "";
    
    let totalCostTHB = 0;
    let totalValueTHB = 0;
    
    if (AppState.portfolio.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted">ไม่มีสินทรัพย์การลงทุนในตารางเวลานี้</td></tr>`;
        updatePortfolioTotalsUI(0, 0);
        return;
    }
    
    AppState.portfolio.forEach(asset => {
        // Calculations in absolute currency and base currency (THB)
        const costPerUnit = asset.cost;
        const totalCostUnits = asset.cost * asset.shares;
        
        const currentPriceUnits = asset.currentPrice;
        const currentValueUnits = asset.currentPrice * asset.shares;
        
        const profitUnits = currentValueUnits - totalCostUnits;
        const profitPct = totalCostUnits > 0 ? (profitUnits / totalCostUnits) * 100 : 0.0;
        
        // Convert to base currency (THB) for aggregate totals
        let costTHB = totalCostUnits;
        let valueTHB = currentValueUnits;
        
        if (asset.currency === 'USD') {
            costTHB = totalCostUnits * AppState.exchangeRate;
            valueTHB = currentValueUnits * AppState.exchangeRate;
        }
        
        totalCostTHB += costTHB;
        totalValueTHB += valueTHB;
        
        // Formatting variables
        const cSign = asset.currency === 'USD' ? '$' : '฿';
        const profitClass = profitUnits >= 0 ? 'text-success' : 'text-danger';
        const sign = profitUnits >= 0 ? '+' : '';
        
        const isGold = asset.ticker.toUpperCase().trim() === 'ทอง' || asset.ticker.toUpperCase().trim() === 'GOLD';
        const sharesDisplay = asset.shares.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 4}) + (isGold ? ' oz' : '');
        
        tbody.innerHTML += `
            <tr>
                <td>
                    <div class="asset-logo-wrapper">
                        ${getAssetLogo(asset.ticker)}
                    </div>
                </td>
                <td>
                    <strong>${asset.name}</strong>
                    <div style="font-size:10px; color:var(--text-muted); margin-top:2px;">
                        สกุลเงินหลัก: <span class="text-warning">${asset.currency}</span>
                    </div>
                </td>
                <td class="text-right font-outfit">${sharesDisplay}</td>
                <td class="text-right font-outfit">${cSign}${costPerUnit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td class="text-right font-outfit"><strong>${cSign}${totalCostUnits.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></td>
                <td class="text-right font-outfit text-indigo">${cSign}${currentPriceUnits.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td class="text-right font-outfit text-blue"><strong>${cSign}${currentValueUnits.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></td>
                <td class="text-right font-outfit ${profitClass}">
                    <strong>${sign}${cSign}${profitUnits.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
                    <div style="font-size:10px; font-weight:600;">${sign}${profitPct.toFixed(2)}%</div>
                </td>
                <td class="text-center">
                    <div class="btn-action-group">
                        <button class="btn-action btn-edit-action" onclick="editAsset('${asset.id}')">✏️</button>
                        <button class="btn-action btn-delete-action" onclick="deleteAsset('${asset.id}')">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    updatePortfolioTotalsUI(totalCostTHB, totalValueTHB);
}

function updatePortfolioTotalsUI(costTHB, valueTHB) {
    const profitTHB = valueTHB - costTHB;
    const profitPct = costTHB > 0 ? (profitTHB / costTHB) * 100 : 0.0;
    
    document.getElementById("port-total-cost").innerText = formatTHB(costTHB);
    document.getElementById("port-total-value").innerText = formatTHB(valueTHB);
    
    const profitUI = document.getElementById("port-total-profit");
    const sign = profitTHB >= 0 ? '+' : '';
    const textClass = profitTHB >= 0 ? 'text-success' : 'text-danger';
    
    profitUI.innerText = `${sign}${formatTHB(profitTHB)} (${sign}${profitPct.toFixed(2)}%)`;
    profitUI.className = `p-summary-value ${textClass}`;
}

async function syncPortfolioPrices(silent = false) {
    const syncBtn = document.getElementById("btn-sync-prices");
    const originalText = syncBtn.innerHTML;
    
    if (!silent) {
        syncBtn.innerHTML = "🔄 กำลังอัปเดตราคา...";
        syncBtn.disabled = true;
    } else {
        syncBtn.classList.add("syncing-silent");
    }
    
    try {
        // 1. Fetch live currency rates (USD -> THB)
        console.log("Fetching live exchange rates...");
        const rateResponse = await fetch("https://open.er-api.com/v6/latest/USD");
        if (rateResponse.ok) {
            const rateData = await rateResponse.json();
            const liveRate = rateData.rates.THB;
            if (liveRate) {
                AppState.exchangeRate = liveRate;
                localStorage.setItem("jnp_exchange_rate", liveRate.toString());
                console.log(`Live USD/THB rate: ${liveRate}`);
            }
        }
        
        let updatedAny = false;
        
        // 2. Fetch US stock quotes
        const usAssets = AppState.portfolio.filter(a => a.currency === 'USD');
        if (usAssets.length > 0) {
            console.log("Fetching US Stock prices via public chart API...");
            
            const fetchPromises = usAssets.map(async (asset) => {
                try {
                    const ticker = asset.ticker.toUpperCase();
                    const yahooApiUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`;
                    const corsProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(yahooApiUrl)}`;
                    
                    const response = await fetch(corsProxyUrl);
                    if (response.ok) {
                        const proxyData = await response.json();
                        const yahooData = JSON.parse(proxyData.contents);
                        const result = yahooData.chart?.result?.[0];
                        const livePrice = result?.meta?.regularMarketPrice;
                        
                        if (livePrice) {
                            const idx = AppState.portfolio.findIndex(a => a.ticker.toUpperCase() === ticker);
                            if (idx !== -1) {
                                AppState.portfolio[idx].currentPrice = livePrice;
                                console.log(`Updated ${ticker} price: $${livePrice}`);
                                updatedAny = true;
                            }
                        }
                    }
                } catch (err) {
                    console.warn(`Failed to fetch price for ${asset.ticker}:`, err);
                }
            });
            
            await Promise.all(fetchPromises);
        }
        
        // 3. Fetch Gold spot price (XAU/USD via GC=F ticker)
        const goldAssetIdx = AppState.portfolio.findIndex(a => {
            const ticker = a.ticker.toUpperCase().trim();
            return ticker === 'ทอง' || ticker === 'GOLD';
        });
        
        if (goldAssetIdx !== -1) {
            console.log("Fetching live Gold spot price (GC=F) via public chart API...");
            try {
                const yahooApiUrl = `https://query1.finance.yahoo.com/v8/finance/chart/GC=F`;
                const corsProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(yahooApiUrl)}`;
                
                const response = await fetch(corsProxyUrl);
                if (response.ok) {
                    const proxyData = await response.json();
                    const yahooData = JSON.parse(proxyData.contents);
                    const result = yahooData.chart?.result?.[0];
                    const goldSpotUSD = result?.meta?.regularMarketPrice;
                    
                    if (goldSpotUSD) {
                        // Calculate price per troy ounce (oz) in THB
                        const exchangeRate = AppState.exchangeRate || 35.0; // fallback
                        const rawThaiGoldPrice = goldSpotUSD * exchangeRate;
                        
                        // Rounding: round to 2 decimal places for precise international gold spot values
                        const calculatedPrice = Math.round(rawThaiGoldPrice * 100) / 100;
                        
                        AppState.portfolio[goldAssetIdx].currentPrice = calculatedPrice;
                        console.log(`Updated Gold price: ฿${calculatedPrice} per oz (Spot: $${goldSpotUSD}/oz, Exchange: ${exchangeRate.toFixed(4)})`);
                        updatedAny = true;
                    }
                }
            } catch (err) {
                console.warn("Failed to fetch Gold spot price:", err);
            }
        }
        
        // Save and notify
        if (updatedAny) {
            localStorage.setItem("jnp_portfolio", JSON.stringify(AppState.portfolio));
            if (!silent) {
                alert(`อัปเดตราคาหุ้นและราคาทองคำเรียลไทม์สำเร็จ! (เรทแลกเปลี่ยนล่าสุด: 1 USD = ฿${AppState.exchangeRate.toFixed(2)})`);
            } else {
                console.log("Silent pricing sync completed successfully.");
            }
        } else {
            if (!silent) {
                alert(`ไม่มีข้อมูลสินทรัพย์ที่รองรับการอัปเดตราคาอัตโนมัติ (เรทแลกเปลี่ยนล่าสุด: 1 USD = ฿${AppState.exchangeRate.toFixed(2)})`);
            }
        }
        
        // Refresh tables and charts
        renderPortfolioTable();
        updateDashboardUI();
    } catch (e) {
        console.error("Pricing sync error:", e);
        if (!silent) {
            alert("ขออภัย! ไม่สามารถดึงราคาล่าสุดได้ชั่วคราวเนื่องจากปัญหาเครือข่าย กรุณาลองใหม่อีกครั้ง");
        }
    } finally {
        if (!silent) {
            syncBtn.innerHTML = originalText;
            syncBtn.disabled = false;
        } else {
            syncBtn.classList.remove("syncing-silent");
        }
    }
}

function saveAsset() {
    const id = document.getElementById("asset-id").value;
    const ticker = document.getElementById("asset-ticker").value.trim().toUpperCase();
    const name = document.getElementById("asset-name").value.trim();
    const shares = parseFloat(document.getElementById("asset-shares").value);
    const cost = parseFloat(document.getElementById("asset-cost").value);
    const currency = document.getElementById("asset-currency").value;
    
    // Read optional currentPrice, fallback to cost
    const currentPriceInput = document.getElementById("asset-current-price").value;
    const currentPrice = currentPriceInput !== "" ? parseFloat(currentPriceInput) : cost;
    
    if (id === "") {
        const newAsset = {
            id: 'asset_' + Date.now(),
            ticker,
            name,
            shares,
            cost,
            currency,
            currentPrice
        };
        AppState.portfolio.push(newAsset);
    } else {
        const idx = AppState.portfolio.findIndex(a => a.id === id);
        if (idx !== -1) {
            AppState.portfolio[idx] = {
                ...AppState.portfolio[idx],
                ticker,
                name,
                shares,
                cost,
                currency,
                currentPrice
            };
        }
    }
    
    localStorage.setItem("jnp_portfolio", JSON.stringify(AppState.portfolio));
    closeModal("modal-asset");
    renderPortfolioTable();
    updateDashboardUI();
}

window.editAsset = function(id) {
    const asset = AppState.portfolio.find(a => a.id === id);
    if (!asset) return;
    
    // Fill Form inputs
    document.getElementById("asset-id").value = asset.id;
    document.getElementById("asset-ticker").value = asset.ticker;
    document.getElementById("asset-name").value = asset.name;
    document.getElementById("asset-shares").value = asset.shares;
    document.getElementById("asset-cost").value = asset.cost;
    document.getElementById("asset-currency").value = asset.currency;
    document.getElementById("asset-current-price").value = asset.currentPrice;
    
    document.getElementById("modal-asset-title").innerText = "แก้ไขสินทรัพย์ในพอร์ตโฟลิโอ";
    document.getElementById("btn-save-asset").innerText = "อัปเดตข้อมูลสินทรัพย์";
    
    // Dispatch input event to update unit label
    const tickerInput = document.getElementById("asset-ticker");
    if (tickerInput) {
        tickerInput.dispatchEvent(new Event('input'));
    }
    
    openModal("modal-asset");
}

window.deleteAsset = function(id) {
    if (!confirm("คุณต้องการลบสินทรัพย์ตัวนี้ออกจากพอร์ตใช่หรือไม่?")) return;
    
    AppState.portfolio = AppState.portfolio.filter(a => a.id !== id);
    localStorage.setItem("jnp_portfolio", JSON.stringify(AppState.portfolio));
    
    renderPortfolioTable();
    updateDashboardUI();
}

function openAssetModal() {
    document.getElementById("asset-id").value = "";
    document.getElementById("asset-ticker").value = "";
    document.getElementById("asset-name").value = "";
    document.getElementById("asset-shares").value = "";
    document.getElementById("asset-cost").value = "";
    document.getElementById("asset-currency").value = "USD";
    document.getElementById("asset-current-price").value = "";
    
    document.getElementById("modal-asset-title").innerText = "เพิ่มสินทรัพย์ในพอร์ตการลงทุน";
    document.getElementById("btn-save-asset").innerText = "บันทึกสินทรัพย์";
    
    openModal("modal-asset");
}

// ==========================================================================
// TAB 4: Drag and drop Excel parser binding
// ==========================================================================
function setupExcelImport() {
    const zone = document.getElementById("excel-drop-zone");
    const fileInput = document.getElementById("excel-file-input");
    const statusDiv = document.getElementById("excel-import-status");
    
    zone.addEventListener("click", () => fileInput.click());
    
    zone.addEventListener("dragover", (e) => {
        e.preventDefault();
        zone.classList.add("drag-over");
    });
    
    zone.addEventListener("dragleave", () => {
        zone.classList.remove("drag-over");
    });
    
    zone.addEventListener("drop", (e) => {
        e.preventDefault();
        zone.classList.remove("drag-over");
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleExcelFile(files[0], statusDiv);
        }
    });
    
    fileInput.addEventListener("change", (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleExcelFile(files[0], statusDiv);
        }
    });
}

function handleExcelFile(file, statusDiv) {
    if (!file.name.endsWith(".xlsx")) {
        showStatus(statusDiv, "กรุณาอัปโหลดไฟล์ Excel นามสกุล .xlsx เท่านั้นครับ", "error");
        return;
    }
    
    showStatus(statusDiv, "⚙️ กำลังประมวลผลไฟล์และคำนวณข้อมูล...", "info");
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const buffer = e.target.result;
            const parsed = await ExcelParser.parseWorkbook(buffer);
            
            if (parsed.transactions.length === 0 && parsed.portfolio.length === 0) {
                showStatus(statusDiv, "⚠️ ไม่พบตารางข้อมูลในระบบ หน้าชีต 'สรุปข้อมูลรายเดือน' หรือ 'สรุปข้อมูลการออม+ลงทุน' ของคุณ กรุณาเช็คความถูกต้องโครงสร้างไฟล์ครับ", "error");
                return;
            }
            
            // Merge transactions (prevent exact duplicates based on date, name, and amount)
            let importedTxCount = 0;
            parsed.transactions.forEach(newTx => {
                const isDup = AppState.transactions.some(oldTx => 
                    oldTx.date === newTx.date && 
                    oldTx.name === newTx.name && 
                    oldTx.amount === newTx.amount
                );
                
                if (!isDup) {
                    AppState.transactions.push(newTx);
                    importedTxCount++;
                }
            });
            
            // Merge portfolio assets (prevent duplicates based on ticker)
            let importedAssetCount = 0;
            parsed.portfolio.forEach(newAsset => {
                const existingIdx = AppState.portfolio.findIndex(oldAsset => 
                    oldAsset.ticker.toUpperCase() === newAsset.ticker.toUpperCase()
                );
                
                if (existingIdx === -1) {
                    AppState.portfolio.push(newAsset);
                    importedAssetCount++;
                } else {
                    // Update the shares and cost amount if it was found
                    const existingAsset = AppState.portfolio[existingIdx];
                    if (existingAsset.shares && existingAsset.shares > 0) {
                        existingAsset.cost = newAsset.cost / existingAsset.shares;
                        existingAsset.currentPrice = newAsset.currentPrice / existingAsset.shares;
                    } else {
                        existingAsset.cost = newAsset.cost;
                        existingAsset.currentPrice = newAsset.currentPrice;
                        existingAsset.shares = 1;
                    }
                    importedAssetCount++;
                }
            });
            
            // Save state
            localStorage.setItem("jnp_transactions", JSON.stringify(AppState.transactions));
            localStorage.setItem("jnp_portfolio", JSON.stringify(AppState.portfolio));
            
            // Update app
            populateMonthSelectors();
            
            const months = getAvailableMonths();
            if (months.length > 0) {
                AppState.selectedMonth = months[0];
                document.getElementById("global-month-select").value = AppState.selectedMonth;
            }
            
            showStatus(statusDiv, `🎉 นำเข้าข้อมูลเสร็จสิ้น! ได้ทำการนำเข้ารายรับรายจ่ายใหม่ ${importedTxCount} รายการ และปรับปรุงพอร์ตโฟลิโอ ${importedAssetCount} สินทรัพย์`, "success");
            
            // Refresh visuals
            updateDashboardUI();
            renderTransactionsTable();
            renderPortfolioTable();
            
            // Auto switch tab to dashboard to show results
            setTimeout(() => {
                switchTab("dashboard");
                statusDiv.style.display = "none";
            }, 3000);
            
        } catch (error) {
            console.error("File reading error:", error);
            showStatus(statusDiv, `เกิดข้อผิดพลาดในการนำเข้าไฟล์: ${error.message}`, "error");
        }
    };
    
    reader.readAsArrayBuffer(file);
}

function showStatus(div, message, type) {
    div.style.display = "block";
    div.className = `import-status import-status-${type}`;
    div.innerHTML = message;
}

// ==========================================================================
// Helper Utility Functions
// ==========================================================================
function getAvailableMonths() {
    const monthsSet = new Set();
    AppState.transactions.forEach(t => {
        if (t.period) monthsSet.add(t.period);
    });
    
    // Return sorted descending (e.g. 2026-04, 2026-03)
    return Array.from(monthsSet).sort((a, b) => b.localeCompare(a));
}

function populateMonthSelectors() {
    const select = document.getElementById("global-month-select");
    const currentVal = select.value;
    select.innerHTML = "";
    
    const months = getAvailableMonths();
    if (months.length === 0) {
        select.innerHTML = `<option value="">ไม่มีข้อมูล</option>`;
        return;
    }
    
    months.forEach(m => {
        select.innerHTML += `<option value="${m}">${formatPeriodName(m)}</option>`;
    });
    
    if (months.includes(currentVal)) {
        select.value = currentVal;
    } else {
        select.value = months[0];
        AppState.selectedMonth = months[0];
    }
}

function formatPeriodName(periodStr) {
    const parts = periodStr.split('-');
    if (parts.length !== 2) return periodStr;
    
    const yr = parts[0];
    const mo = parseInt(parts[1], 10);
    const monthsThai = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    return `${monthsThai[mo-1]} ${parseInt(yr) + 543}`; // convert to Buddhist Calendar
}

function formatTHB(num) {
    return '฿' + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDateShort(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return `${d.getDate()}/${d.getMonth()+1}`;
}

function formatDateMedium(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const monthsThaiShort = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    return `${d.getDate()} ${monthsThaiShort[d.getMonth()]} ${d.getFullYear() + 543}`;
}

// ==========================================================================
// Modal Utilities
// ==========================================================================
function openModal(modalId) {
    document.getElementById(modalId).classList.add("active");
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove("active");
}

function openQuickAddModal() {
    const modalFormContainer = document.getElementById("modal-form-container");
    const originalForm = document.getElementById("form-transaction");
    
    // Clear and reset form before editing/adding
    resetTransactionForm();
    
    // Move form inside modal body
    modalFormContainer.appendChild(originalForm);
    
    openModal("modal-quick-add");
}

// Intercept clicks outside of modal contents to close them safely
window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
        e.target.classList.remove("active");
        
        // If closing the quick add transaction modal, make sure to move the form back to its tab panel
        if (e.target.id === 'modal-quick-add') {
            const form = document.getElementById("form-transaction");
            const rightPanel = document.querySelector(".transactions-layout .form-panel");
            if (rightPanel && form) {
                rightPanel.appendChild(form);
            }
        }
    }
});

// ==========================================================================
// Data Backup (JSON Export & Restore) & Reset functions
// ==========================================================================
function exportDataToJSON() {
    const dataStr = JSON.stringify({
        transactions: AppState.transactions,
        portfolio: AppState.portfolio,
        exchangeRate: AppState.exchangeRate,
        version: "2.0"
    }, null, 2);
    
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `jnp_wealth_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importDataFromJSON(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const data = JSON.parse(evt.target.result);
            
            if (!data.transactions || !data.portfolio) {
                alert("ไฟล์รูปแบบ JSON นี้ไม่ถูกต้องสำหรับการกู้คืนข้อมูลของระบบ JNP Wealth Tracker");
                return;
            }
            
            if (confirm("การอัปโหลดไฟล์นี้จะเขียนทับข้อมูลประวัติการเงินที่มีอยู่ในปัจจุบันทั้งหมด ต้องการดำเนินการต่อหรือไม่?")) {
                AppState.transactions = data.transactions;
                AppState.portfolio = data.portfolio;
                AppState.exchangeRate = data.exchangeRate || 35.25;
                
                localStorage.setItem("jnp_transactions", JSON.stringify(AppState.transactions));
                localStorage.setItem("jnp_portfolio", JSON.stringify(AppState.portfolio));
                localStorage.setItem("jnp_exchange_rate", AppState.exchangeRate.toString());
                
                populateMonthSelectors();
                
                // Set default month to first available
                const months = getAvailableMonths();
                if (months.length > 0) {
                    AppState.selectedMonth = months[0];
                    document.getElementById("global-month-select").value = AppState.selectedMonth;
                }
                
                alert("กู้คืนข้อมูลสำเร็จเรียบร้อยแล้ว!");
                
                // Refresh
                updateDashboardUI();
                renderTransactionsTable();
                renderPortfolioTable();
                
                switchTab("dashboard");
            }
        } catch (err) {
            alert(`ไม่สามารถเปิดอ่านไฟล์สำรองนี้ได้เนื่องจาก: ${err.message}`);
        }
    };
    reader.readAsText(file);
}

function clearAllUserData() {
    if (!confirm("⚠️ คำเตือน: คุณแน่ใจว่าต้องการล้างฐานข้อมูลผู้ใช้ทั้งหมดใช่หรือไม่? ข้อมูลประวัติการเงิน พอร์ต หุ้น และการออมของคุณจะหายไปทั้งหมดและไม่สามารถกู้คืนได้ ยกเว้นในกรณีที่มีไฟล์สำรองข้อมูล")) return;
    
    if (confirm("ต้องการดำเนินการขั้นสุดท้ายเพื่อล้างข้อมูลและเริ่มต้นระบบใหม่ทั้งหมด?")) {
        localStorage.removeItem("jnp_transactions");
        localStorage.removeItem("jnp_portfolio");
        localStorage.removeItem("jnp_exchange_rate");
        
        AppState.transactions = [];
        AppState.portfolio = [];
        AppState.exchangeRate = 35.25;
        
        alert("ล้างระบบเรียบร้อยแล้ว! แอปพลิเคชันได้ทำการรีเซ็ตข้อมูลทั้งหมดกลับสู่ค่าว่างเปล่า");
        location.reload();
    }
}
