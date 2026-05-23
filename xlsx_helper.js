/**
 * JNP Wealth Tracker - Excel Import Helper (xlsx_helper.js)
 * uses SheetJS (XLSX) to extract income, expense, and portfolio data
 */

const ExcelParser = {
    /**
     * Parses the Excel file and extracts transactions and portfolio data
     * @param {ArrayBuffer} arrayBuffer 
     * @returns {Promise<{transactions: Array, portfolio: Array}>}
     */
    parseWorkbook: function(arrayBuffer) {
        return new Promise((resolve, reject) => {
            try {
                const data = new Uint8Array(arrayBuffer);
                const workbook = XLSX.read(data, { type: 'array', cellDates: true, dateNF: 'yyyy-mm-dd' });
                
                console.log("Excel Sheets Found:", workbook.SheetNames);
                
                let transactions = [];
                let portfolio = [];
                
                // 1. Process Monthly Summary Sheet
                const monthlySheetName = workbook.SheetNames.find(name => name.includes("สรุปข้อมูลรายเดือน"));
                if (monthlySheetName) {
                    const sheet = workbook.Sheets[monthlySheetName];
                    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
                    
                    transactions = this.extractTransactions(rows);
                    console.log(`Extracted ${transactions.length} transactions from ${monthlySheetName}`);
                } else {
                    console.warn("Could not find 'สรุปข้อมูลรายเดือน' sheet.");
                }
                
                // 2. Process Portfolio Sheet
                const portfolioSheetName = workbook.SheetNames.find(name => name.includes("สรุปข้อมูลการออม+ลงทุน") || name.includes("สรุปข้อมูลการออม"));
                if (portfolioSheetName) {
                    const sheet = workbook.Sheets[portfolioSheetName];
                    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
                    
                    portfolio = this.extractPortfolio(rows);
                    console.log(`Extracted ${portfolio.length} portfolio assets from ${portfolioSheetName}`);
                } else {
                    console.warn("Could not find portfolio summary sheet.");
                }
                
                resolve({ transactions, portfolio });
            } catch (error) {
                console.error("Error parsing workbook:", error);
                reject(error);
            }
        });
    },

    /**
     * Extracts Income, Expenses, and Investments from the monthly summary rows
     * @param {Array[]} rows 
     * @returns {Array} List of transaction objects
     */
    extractTransactions: function(rows) {
        const transactions = [];
        
        // The headers reside around row index 15 (0-indexed)
        // Data starts from index 16 onwards.
        if (rows.length <= 16) return [];
        
        // Loop through rows starting from index 16
        for (let i = 16; i < rows.length; i++) {
            const row = rows[i];
            if (!row) continue;
            
            // --- 1. INCOME EXTRACTION (Cols 1 to 5) ---
            // Index 1: วันที่, 2: ชื่อรายการ, 3: จำนวนเงิน, 4: กลุ่ม, 5: Year-Month
            if (row[1] != null && row[2] != null && row[3] != null) {
                const dateStr = this.formatExcelDate(row[1]);
                const amount = parseFloat(row[3]);
                if (dateStr && !isNaN(amount) && amount > 0) {
                    transactions.push({
                        id: 'inc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                        date: dateStr,
                        name: String(row[2]).trim(),
                        type: 'income',
                        category: row[4] ? String(row[4]).trim() : 'เงินเดือนหลัก',
                        amount: amount,
                        period: row[5] ? String(row[5]).trim() : dateStr.substring(0, 7)
                    });
                }
            }
            
            // --- 2. EXPENSE EXTRACTION (Cols 7 to 11) ---
            // Index 7: วันที่, 8: ชื่อรายการ, 9: จำนวนเงิน, 10: กลุ่ม, 11: Year-Month
            if (row[7] != null && row[8] != null && row[9] != null) {
                const dateStr = this.formatExcelDate(row[7]);
                const amount = parseFloat(row[9]);
                if (dateStr && !isNaN(amount) && amount > 0) {
                    transactions.push({
                        id: 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                        date: dateStr,
                        name: String(row[8]).trim(),
                        type: 'expense',
                        category: row[10] ? String(row[10]).trim() : 'อื่น ๆ ในชีวิตแมน',
                        amount: amount,
                        period: row[11] ? String(row[11]).trim() : dateStr.substring(0, 7)
                    });
                }
            }
            
            // --- 3. INVESTMENT EXTRACTION (Cols 13 to 18) ---
            // Index 13: วันที่, 14: ชื่อรายการ, 15: จำนวนเงิน, 16: ซื้อ/ขาย, 17: กลุ่ม, 18: Year-Month
            if (row[13] != null && row[14] != null && row[15] != null) {
                const dateStr = this.formatExcelDate(row[13]);
                const amount = parseFloat(row[15]);
                if (dateStr && !isNaN(amount) && amount > 0) {
                    const action = row[16] ? String(row[16]).trim() : 'ซื้อ';
                    transactions.push({
                        id: 'inv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                        date: dateStr,
                        name: String(row[14]).trim() + (action === 'ขาย' ? ' (ขาย)' : ''),
                        type: 'investment',
                        category: row[17] ? String(row[17]).trim() : 'หุ้น',
                        amount: amount,
                        period: row[18] ? String(row[18]).trim() : dateStr.substring(0, 7),
                        action: action // "ซื้อ" or "ขาย"
                    });
                }
            }
        }
        
        return transactions;
    },

    /**
     * Extracts stock portfolio items from the summary rows
     * @param {Array[]} rows 
     * @returns {Array} List of asset objects
     */
    extractPortfolio: function(rows) {
        const assets = [];
        
        // In portfolio sheet:
        // Index 1: ชื่อรายการ, 2: จำนวนเงินลงทุน (เงินต้น), 3: มูลค่าปัจจุบัน, 4: Cap Gain, 5: Growth %
        // Header starts at row 0 (ชื่อรายการ)
        // Data is from index 1 onwards
        if (rows.length <= 1) return [];
        
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row[1] == null) continue;
            
            const ticker = String(row[1]).trim().toUpperCase();
            if (ticker === '' || ticker === 'ชื่อรายการ' || ticker === 'รวม' || ticker.includes('มูลค่า')) continue;
            
            const costAmount = parseFloat(row[2]);
            const currentValue = row[3] != null ? parseFloat(row[3]) : costAmount;
            
            if (!isNaN(costAmount) && costAmount > 0) {
                // Determine currency based on ticker symbol
                // US stock symbols are usually alphabets. Gold ("ทอง") or domestic portfolios are in THB.
                let currency = 'USD';
                let fullName = ticker;
                
                if (ticker === 'ทอง' || ticker.includes('PORT') || ticker.includes('RANKING') || ticker.includes('JITTA')) {
                    currency = 'THB';
                }
                
                if (ticker === 'VOO') fullName = 'Vanguard S&P 500 ETF';
                else if (ticker === 'QQQ') fullName = 'Invesco QQQ Trust (Nasdaq 100)';
                else if (ticker === 'NVDA') fullName = 'NVIDIA Corporation';
                else if (ticker === 'JEPQ') fullName = 'JPMorgan Nasdaq Equity Premium Income ETF';
                else if (ticker === 'LLY') fullName = 'Eli Lilly and Company';
                else if (ticker === 'EOSE') fullName = 'Eos Energy Enterprises, Inc.';
                else if (ticker === 'ASTS') fullName = 'AST SpaceMobile, Inc.';
                else if (ticker === 'NFLX') fullName = 'Netflix, Inc.';
                else if (ticker === 'ทอง') fullName = 'ทองคำแท่ง / ทองคำ';
                
                // Estimate starting shares if not provided (assume cost basis = 1 share for simplicity, 
                // user can adjust this later in the UI, or we can approximate it).
                // If they have QQQ cost = 5221.94, let's keep shares = costAmount.
                // Let's set initial shares as 1, and set purchase price = costAmount
                // OR we can set shares = 1 and average cost = costAmount.
                // Actually, if we fetch stock prices later in USD, let's set a reasonable share estimate 
                // if we know the stock's current price, or just set shares to be updated.
                // For safety: let's save the costAmount as the primary key.
                const isGold = ticker === 'ทอง' || ticker === 'GOLD';
                assets.push({
                    id: 'asset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                    ticker: ticker,
                    name: fullName,
                    shares: isGold ? 0.473 : 1, // 1 Baht weight is approx 0.473 oz
                    cost: isGold ? Math.round((costAmount / 0.473) * 100) / 100 : costAmount,
                    currency: currency,
                    currentPrice: isGold ? Math.round((currentValue / 0.473) * 100) / 100 : currentValue
                });
            }
        }
        
        return assets;
    },

    /**
     * Formats an Excel date value (either Date object or serialized serial number) into yyyy-mm-dd
     * @param {any} val 
     * @returns {string|null} Date string or null if invalid
     */
    formatExcelDate: function(val) {
        if (!val) return null;
        
        if (val instanceof Date) {
            return val.toISOString().split('T')[0];
        }
        
        // If it's a string, try parsing it
        if (typeof val === 'string') {
            const cleanStr = val.trim();
            if (cleanStr.match(/^\d{4}-\d{2}-\d{2}/)) {
                return cleanStr.substring(0, 10);
            }
            
            const parsed = Date.parse(cleanStr);
            if (!isNaN(parsed)) {
                return new Date(parsed).toISOString().split('T')[0];
            }
        }
        
        // If it's Excel numeric serial number
        if (typeof val === 'number') {
            const date = new Date(Math.round((val - 25569) * 86400 * 1000));
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        }
        
        return null;
    }
};
