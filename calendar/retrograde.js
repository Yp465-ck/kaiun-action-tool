// ===== 惑星逆行データモジュール =====

// 惑星逆行期間データ（2024-2026年）
const RETROGRADE_PERIODS = [
    // 水星逆行（年3-4回）
    // 2024年
    { planet: '水星', planetEn: 'Mercury', start: '2024-04-01', end: '2024-04-25', 
      effect: 'コミュニケーション、契約、旅行に注意', importance: 'high' },
    { planet: '水星', planetEn: 'Mercury', start: '2024-08-05', end: '2024-08-28', 
      effect: 'コミュニケーション、契約、旅行に注意', importance: 'high' },
    { planet: '水星', planetEn: 'Mercury', start: '2024-11-26', end: '2024-12-15', 
      effect: 'コミュニケーション、契約、旅行に注意', importance: 'high' },
    
    // 2025年
    { planet: '水星', planetEn: 'Mercury', start: '2025-03-15', end: '2025-04-07', 
      effect: 'コミュニケーション、契約、旅行に注意', importance: 'high' },
    { planet: '水星', planetEn: 'Mercury', start: '2025-07-18', end: '2025-08-11', 
      effect: 'コミュニケーション、契約、旅行に注意', importance: 'high' },
    { planet: '水星', planetEn: 'Mercury', start: '2025-11-09', end: '2025-11-29', 
      effect: 'コミュニケーション、契約、旅行に注意', importance: 'high' },
    
    // 2026年
    { planet: '水星', planetEn: 'Mercury', start: '2026-02-26', end: '2026-03-20', 
      effect: 'コミュニケーション、契約、旅行に注意', importance: 'high' },
    { planet: '水星', planetEn: 'Mercury', start: '2026-06-29', end: '2026-07-23', 
      effect: 'コミュニケーション、契約、旅行に注意', importance: 'high' },
    { planet: '水星', planetEn: 'Mercury', start: '2026-10-24', end: '2026-11-13', 
      effect: 'コミュニケーション、契約、旅行に注意', importance: 'high' },
    
    // 金星逆行（約1.5年に1回）
    // 2025年
    { planet: '金星', planetEn: 'Venus', start: '2025-03-02', end: '2025-04-13', 
      effect: '恋愛、お金、美容関連の見直し期間', importance: 'medium' },
    
    // 火星逆行（約2年に1回）
    // 2024年
    { planet: '火星', planetEn: 'Mars', start: '2024-12-06', end: '2025-02-24', 
      effect: 'エネルギー、行動力の低下に注意', importance: 'medium' },
    // 2026年
    { planet: '火星', planetEn: 'Mars', start: '2026-12-01', end: '2027-02-17', 
      effect: 'エネルギー、行動力の低下に注意', importance: 'medium' },
    
    // 木星逆行（年1回、約4ヶ月）
    // 2024年
    { planet: '木星', planetEn: 'Jupiter', start: '2024-10-09', end: '2025-02-04', 
      effect: '成長・拡大のペースダウン、内省の時期', importance: 'low' },
    // 2025年
    { planet: '木星', planetEn: 'Jupiter', start: '2025-11-11', end: '2026-03-11', 
      effect: '成長・拡大のペースダウン、内省の時期', importance: 'low' },
    
    // 土星逆行（年1回、約4.5ヶ月）
    // 2024年
    { planet: '土星', planetEn: 'Saturn', start: '2024-06-29', end: '2024-11-15', 
      effect: '制限・責任の見直し、過去の清算', importance: 'low' },
    // 2025年
    { planet: '土星', planetEn: 'Saturn', start: '2025-07-13', end: '2025-11-28', 
      effect: '制限・責任の見直し、過去の清算', importance: 'low' },
    // 2026年
    { planet: '土星', planetEn: 'Saturn', start: '2026-07-27', end: '2026-12-11', 
      effect: '制限・責任の見直し、過去の清算', importance: 'low' },
    
    // 天王星逆行（年1回、約5ヶ月）
    // 2024年
    { planet: '天王星', planetEn: 'Uranus', start: '2024-09-01', end: '2025-01-30', 
      effect: '革新・変革の内省期間', importance: 'low' },
    // 2025年
    { planet: '天王星', planetEn: 'Uranus', start: '2025-09-06', end: '2026-02-04', 
      effect: '革新・変革の内省期間', importance: 'low' },
    // 2026年
    { planet: '天王星', planetEn: 'Uranus', start: '2026-09-11', end: '2027-02-08', 
      effect: '革新・変革の内省期間', importance: 'low' },
    
    // 海王星逆行（年1回、約5ヶ月）
    // 2024年
    { planet: '海王星', planetEn: 'Neptune', start: '2024-07-02', end: '2024-12-07', 
      effect: '夢・幻想の再確認期間', importance: 'low' },
    // 2025年
    { planet: '海王星', planetEn: 'Neptune', start: '2025-07-04', end: '2025-12-10', 
      effect: '夢・幻想の再確認期間', importance: 'low' },
    // 2026年
    { planet: '海王星', planetEn: 'Neptune', start: '2026-07-08', end: '2026-12-13', 
      effect: '夢・幻想の再確認期間', importance: 'low' },
    
    // 冥王星逆行（年1回、約5ヶ月）
    // 2024年
    { planet: '冥王星', planetEn: 'Pluto', start: '2024-05-02', end: '2024-10-12', 
      effect: '変容・再生の深い内省期間', importance: 'low' },
    // 2025年
    { planet: '冥王星', planetEn: 'Pluto', start: '2025-05-04', end: '2025-10-14', 
      effect: '変容・再生の深い内省期間', importance: 'low' },
    // 2026年
    { planet: '冥王星', planetEn: 'Pluto', start: '2026-05-06', end: '2026-10-16', 
      effect: '変容・再生の深い内省期間', importance: 'low' }
];

/**
 * 日付が期間内かどうかをチェック
 * @param {Date} date 
 * @param {string} startStr 
 * @param {string} endStr 
 * @returns {boolean}
 */
function isDateInRange(date, startStr, endStr) {
    const start = new Date(startStr + 'T00:00:00');
    const end = new Date(endStr + 'T23:59:59');
    return date >= start && date <= end;
}

/**
 * 指定日の惑星逆行を取得
 * @param {Date} date 
 * @returns {Array}
 */
export function getRetrograde(date) {
    const retrogrades = [];
    
    for (const period of RETROGRADE_PERIODS) {
        if (isDateInRange(date, period.start, period.end)) {
            retrogrades.push({
                planet: period.planet,
                planetEn: period.planetEn,
                effect: period.effect,
                importance: period.importance,
                startDate: period.start,
                endDate: period.end
            });
        }
    }
    
    // 重要度でソート（high > medium > low）
    const importanceOrder = { high: 0, medium: 1, low: 2 };
    retrogrades.sort((a, b) => importanceOrder[a.importance] - importanceOrder[b.importance]);
    
    return retrogrades;
}

/**
 * 水星逆行中かどうか
 * @param {Date} date 
 * @returns {boolean}
 */
export function isMercuryRetrograde(date) {
    const retrogrades = getRetrograde(date);
    return retrogrades.some(r => r.planet === '水星');
}

/**
 * 金星逆行中かどうか
 * @param {Date} date 
 * @returns {boolean}
 */
export function isVenusRetrograde(date) {
    const retrogrades = getRetrograde(date);
    return retrogrades.some(r => r.planet === '金星');
}

/**
 * 火星逆行中かどうか
 * @param {Date} date 
 * @returns {boolean}
 */
export function isMarsRetrograde(date) {
    const retrogrades = getRetrograde(date);
    return retrogrades.some(r => r.planet === '火星');
}

/**
 * 重要な逆行（水星・金星・火星）があるかどうか
 * @param {Date} date 
 * @returns {boolean}
 */
export function hasImportantRetrograde(date) {
    const retrogrades = getRetrograde(date);
    return retrogrades.some(r => r.importance === 'high' || r.importance === 'medium');
}

/**
 * 全ての逆行期間データを取得
 */
export function getAllRetrogradePeriods() {
    return RETROGRADE_PERIODS;
}
