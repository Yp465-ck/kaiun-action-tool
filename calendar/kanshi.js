// ===== 干支計算モジュール =====

// 十干（じっかん）
const JIKKAN = [
    { name: '甲', reading: 'きのえ', gogyo: '木', yinyang: '陽' },
    { name: '乙', reading: 'きのと', gogyo: '木', yinyang: '陰' },
    { name: '丙', reading: 'ひのえ', gogyo: '火', yinyang: '陽' },
    { name: '丁', reading: 'ひのと', gogyo: '火', yinyang: '陰' },
    { name: '戊', reading: 'つちのえ', gogyo: '土', yinyang: '陽' },
    { name: '己', reading: 'つちのと', gogyo: '土', yinyang: '陰' },
    { name: '庚', reading: 'かのえ', gogyo: '金', yinyang: '陽' },
    { name: '辛', reading: 'かのと', gogyo: '金', yinyang: '陰' },
    { name: '壬', reading: 'みずのえ', gogyo: '水', yinyang: '陽' },
    { name: '癸', reading: 'みずのと', gogyo: '水', yinyang: '陰' }
];

// 十二支（じゅうにし）
const JUNISHI = [
    { name: '子', reading: 'ね', animal: '鼠' },
    { name: '丑', reading: 'うし', animal: '牛' },
    { name: '寅', reading: 'とら', animal: '虎' },
    { name: '卯', reading: 'う', animal: '兎' },
    { name: '辰', reading: 'たつ', animal: '龍' },
    { name: '巳', reading: 'み', animal: '蛇' },
    { name: '午', reading: 'うま', animal: '馬' },
    { name: '未', reading: 'ひつじ', animal: '羊' },
    { name: '申', reading: 'さる', animal: '猿' },
    { name: '酉', reading: 'とり', animal: '鶏' },
    { name: '戌', reading: 'いぬ', animal: '犬' },
    { name: '亥', reading: 'い', animal: '猪' }
];

// 六十干支
const ROKUJIKKANSHI = [];
for (let i = 0; i < 60; i++) {
    ROKUJIKKANSHI.push({
        index: i,
        kan: JIKKAN[i % 10],
        shi: JUNISHI[i % 12],
        kanshi: JIKKAN[i % 10].name + JUNISHI[i % 12].name
    });
}

// 節入り日（2024-2026年）簡易版
const SETSUIRI = {
    2024: [
        { month: 1, day: 6 },   // 小寒
        { month: 2, day: 4 },   // 立春
        { month: 3, day: 5 },   // 啓蟄
        { month: 4, day: 4 },   // 清明
        { month: 5, day: 5 },   // 立夏
        { month: 6, day: 5 },   // 芒種
        { month: 7, day: 6 },   // 小暑
        { month: 8, day: 7 },   // 立秋
        { month: 9, day: 7 },   // 白露
        { month: 10, day: 8 },  // 寒露
        { month: 11, day: 7 },  // 立冬
        { month: 12, day: 7 }   // 大雪
    ],
    2025: [
        { month: 1, day: 5 },
        { month: 2, day: 3 },
        { month: 3, day: 5 },
        { month: 4, day: 4 },
        { month: 5, day: 5 },
        { month: 6, day: 5 },
        { month: 7, day: 7 },
        { month: 8, day: 7 },
        { month: 9, day: 7 },
        { month: 10, day: 8 },
        { month: 11, day: 7 },
        { month: 12, day: 7 }
    ],
    2026: [
        { month: 1, day: 5 },
        { month: 2, day: 4 },
        { month: 3, day: 5 },
        { month: 4, day: 5 },
        { month: 5, day: 5 },
        { month: 6, day: 6 },
        { month: 7, day: 7 },
        { month: 8, day: 7 },
        { month: 9, day: 8 },
        { month: 10, day: 8 },
        { month: 11, day: 7 },
        { month: 12, day: 7 }
    ]
};

/**
 * 基準日からの経過日数を計算
 * @param {Date} date 
 * @returns {number}
 */
function getDaysSinceEpoch(date) {
    // 基準日: 1900年1月31日（甲子の日）
    const epoch = new Date(1900, 0, 31);
    const diffTime = date.getTime() - epoch.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 日干支を取得
 * @param {Date} date 
 * @returns {Object}
 */
function getDayKanshi(date) {
    const days = getDaysSinceEpoch(date);
    const index = ((days % 60) + 60) % 60;
    return ROKUJIKKANSHI[index];
}

/**
 * 月干支を取得（節入りを考慮）
 * @param {Date} date 
 * @returns {Object}
 */
function getMonthKanshi(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 節入り日を取得
    let setsuiri = SETSUIRI[year];
    if (!setsuiri) {
        // データがない年は概算
        setsuiri = SETSUIRI[2025];
    }
    
    // 節入り前かどうか判定
    let adjustedMonth = month;
    const setsuDay = setsuiri[month - 1]?.day || 5;
    if (day < setsuDay) {
        adjustedMonth = month - 1;
        if (adjustedMonth < 1) adjustedMonth = 12;
    }
    
    // 年干から月干を計算
    const yearKanshi = getYearKanshi(date);
    const yearKanIndex = JIKKAN.findIndex(k => k.name === yearKanshi.kan.name);
    
    // 月干の計算: (年干 * 2 + 月) % 10
    // 寅月（2月）を基準とする
    const baseMonthIndex = (adjustedMonth + 10) % 12; // 寅=0として計算
    const monthKanIndex = ((yearKanIndex % 5) * 2 + baseMonthIndex) % 10;
    const monthShiIndex = (adjustedMonth + 1) % 12; // 寅=0
    
    const kanshi = JIKKAN[monthKanIndex].name + JUNISHI[monthShiIndex].name;
    
    return {
        kan: JIKKAN[monthKanIndex],
        shi: JUNISHI[monthShiIndex],
        kanshi
    };
}

/**
 * 年干支を取得（立春を考慮）
 * @param {Date} date 
 * @returns {Object}
 */
function getYearKanshi(date) {
    let year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 節入りデータを取得
    let setsuiri = SETSUIRI[year];
    if (!setsuiri) setsuiri = SETSUIRI[2025];
    
    // 立春前は前年として計算
    const risshunDay = setsuiri[1]?.day || 4; // 2月の節入り
    if (month < 2 || (month === 2 && day < risshunDay)) {
        year -= 1;
    }
    
    // 年干支の計算（1984年=甲子年を基準）
    const baseYear = 1984;
    const index = ((year - baseYear) % 60 + 60) % 60;
    
    return ROKUJIKKANSHI[index];
}

/**
 * 干支情報を取得
 * @param {Date} date 
 * @returns {Object}
 */
export function getKanshi(date) {
    return {
        year: getYearKanshi(date),
        month: getMonthKanshi(date),
        day: getDayKanshi(date)
    };
}

/**
 * 干から五行を取得
 * @param {Object} kan 十干オブジェクト
 * @returns {Object}
 */
export function getGogyoFromKan(kan) {
    const gogyoMap = {
        '木': { name: '木', element: '木', strong: '木強' },
        '火': { name: '火', element: '火', strong: '火強' },
        '土': { name: '土', element: '土', strong: '土強' },
        '金': { name: '金', element: '金', strong: '金強' },
        '水': { name: '水', element: '水', strong: '水強' }
    };
    
    return gogyoMap[kan.gogyo] || { name: '不明', element: '不明', strong: '' };
}

/**
 * 十干の一覧を取得
 */
export function getJikkanList() {
    return JIKKAN;
}

/**
 * 十二支の一覧を取得
 */
export function getJunishiList() {
    return JUNISHI;
}

/**
 * 特定の干支かどうかをチェック
 * @param {Date} date 
 * @param {string} shiName 十二支の名前（例: '寅'）
 * @returns {boolean}
 */
export function isDayOfShi(date, shiName) {
    const dayKanshi = getDayKanshi(date);
    return dayKanshi.shi.name === shiName;
}
