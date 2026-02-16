// ===== 吉凶日計算モジュール =====

import { getKanshi, isDayOfShi } from './kanshi.js';

// 六曜
const ROKUYO = [
    { name: '先勝', reading: 'せんしょう', meaning: '午前中は吉、午後は凶' },
    { name: '友引', reading: 'ともびき', meaning: '朝夕は吉、正午は凶。葬儀は避ける' },
    { name: '先負', reading: 'せんぶ', meaning: '午前中は凶、午後は吉' },
    { name: '仏滅', reading: 'ぶつめつ', meaning: '万事凶の日' },
    { name: '大安', reading: 'たいあん', meaning: '万事大吉の日' },
    { name: '赤口', reading: 'しゃっこう', meaning: '正午のみ吉、他は凶' }
];

// 一粒万倍日の日の干支パターン（月ごと）
const ICHIRYUMANBAI_PATTERNS = {
    1: ['丑', '午'],   // 寅月（2月の節入り後）
    2: ['酉', '寅'],   // 卯月
    3: ['子', '卯'],   // 辰月
    4: ['卯', '辰'],   // 巳月
    5: ['巳', '午'],   // 午月
    6: ['酉', '午'],   // 未月
    7: ['子', '未'],   // 申月
    8: ['卯', '申'],   // 酉月
    9: ['酉', '午'],   // 戌月
    10: ['酉', '戌'],  // 亥月
    11: ['亥', '子'],  // 子月
    12: ['子', '卯']   // 丑月
};

// 天赦日（2024-2026年）
const TENSHADAY = [
    // 2024年
    { year: 2024, month: 1, day: 1 },
    { year: 2024, month: 3, day: 15 },
    { year: 2024, month: 5, day: 30 },
    { year: 2024, month: 7, day: 29 },
    { year: 2024, month: 8, day: 12 },
    { year: 2024, month: 10, day: 11 },
    { year: 2024, month: 12, day: 26 },
    // 2025年
    { year: 2025, month: 1, day: 9 },
    { year: 2025, month: 3, day: 10 },
    { year: 2025, month: 5, day: 25 },
    { year: 2025, month: 7, day: 24 },
    { year: 2025, month: 8, day: 7 },
    { year: 2025, month: 10, day: 6 },
    { year: 2025, month: 12, day: 21 },
    // 2026年
    { year: 2026, month: 1, day: 4 },
    { year: 2026, month: 3, day: 21 },
    { year: 2026, month: 6, day: 5 },
    { year: 2026, month: 8, day: 18 },
    { year: 2026, month: 10, day: 1 },
    { year: 2026, month: 10, day: 17 },
    { year: 2026, month: 12, day: 16 }
];

// 不成就日のパターン（月の1-10日, 11-20日, 21-末日）
const FUJOJU_PATTERNS = {
    1: [3, 11, 19, 27],
    2: [2, 10, 18, 26],
    3: [1, 9, 17, 25],
    4: [4, 12, 20, 28],
    5: [5, 13, 21, 29],
    6: [6, 14, 22, 30],
    7: [3, 11, 19, 27],
    8: [2, 10, 18, 26],
    9: [1, 9, 17, 25],
    10: [4, 12, 20, 28],
    11: [5, 13, 21, 29],
    12: [6, 14, 22, 30]
};

// 十死日のパターン（月ごとの日の干支）
const JUSSHINICHI_PATTERNS = {
    1: '戌',   // 1月
    2: '辰',   // 2月
    3: '亥',   // 3月
    4: '巳',   // 4月
    5: '子',   // 5月
    6: '午',   // 6月
    7: '丑',   // 7月
    8: '未',   // 8月
    9: '寅',   // 9月
    10: '申',  // 10月
    11: '卯',  // 11月
    12: '酉'   // 12月
};

/**
 * 六曜を計算
 * @param {Date} date 
 * @returns {Object}
 */
export function getRokuyo(date) {
    // 旧暦の月日から計算（簡易版：グレゴリオ暦で近似）
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // (月 + 日) % 6 で六曜を計算（簡易版）
    const index = (month + day) % 6;
    
    return ROKUYO[index];
}

/**
 * 節月を取得
 * @param {Date} date 
 * @returns {number} 1-12
 */
function getSetsuMonth(date) {
    let month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 節入り日（概算）
    const setsuDays = [6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 7, 7];
    const setsuDay = setsuDays[month - 1];
    
    // 節入り前なら前月として計算
    if (day < setsuDay) {
        month -= 1;
        if (month < 1) month = 12;
    }
    
    return month;
}

/**
 * 一粒万倍日かどうか
 * @param {Date} date 
 * @returns {boolean}
 */
function isIchiryumanbai(date) {
    const setsuMonth = getSetsuMonth(date);
    const kanshi = getKanshi(date);
    const dayShiName = kanshi.day.shi.name;
    
    // 節月に対応する干支パターン
    const patterns = ICHIRYUMANBAI_PATTERNS[setsuMonth];
    
    return patterns && patterns.includes(dayShiName);
}

/**
 * 天赦日かどうか
 * @param {Date} date 
 * @returns {boolean}
 */
function isTenshaDay(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return TENSHADAY.some(d => 
        d.year === year && d.month === month && d.day === day
    );
}

/**
 * 寅の日かどうか
 * @param {Date} date 
 * @returns {boolean}
 */
function isToraNoHi(date) {
    return isDayOfShi(date, '寅');
}

/**
 * 巳の日かどうか
 * @param {Date} date 
 * @returns {boolean}
 */
function isMiNoHi(date) {
    return isDayOfShi(date, '巳');
}

/**
 * 己巳の日かどうか（60日に一度の超吉日）
 * @param {Date} date 
 * @returns {boolean}
 */
function isTsuchinotoMi(date) {
    const kanshi = getKanshi(date);
    return kanshi.day.kanshi === '己巳';
}

/**
 * 甲子の日かどうか（60日に一度）
 * @param {Date} date 
 * @returns {boolean}
 */
function isKinoene(date) {
    const kanshi = getKanshi(date);
    return kanshi.day.kanshi === '甲子';
}

/**
 * 大安かどうか
 * @param {Date} date 
 * @returns {boolean}
 */
function isTaian(date) {
    return getRokuyo(date).name === '大安';
}

/**
 * 仏滅かどうか
 * @param {Date} date 
 * @returns {boolean}
 */
function isButsumetsu(date) {
    return getRokuyo(date).name === '仏滅';
}

/**
 * 友引かどうか
 * @param {Date} date 
 * @returns {boolean}
 */
function isTomobiki(date) {
    return getRokuyo(date).name === '友引';
}

/**
 * 不成就日かどうか
 * @param {Date} date 
 * @returns {boolean}
 */
function isFujojubi(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const patterns = FUJOJU_PATTERNS[month];
    return patterns && patterns.includes(day);
}

/**
 * 十死日かどうか
 * @param {Date} date 
 * @returns {boolean}
 */
function isJusshinichi(date) {
    const month = date.getMonth() + 1;
    const pattern = JUSSHINICHI_PATTERNS[month];
    
    return isDayOfShi(date, pattern);
}

/**
 * 吉凶日を取得
 * @param {Date} date 
 * @returns {Array}
 */
export function getKichikuDays(date) {
    const days = [];
    
    // 吉日
    if (isTenshaDay(date)) {
        days.push({ name: '天赦日', isGood: true, priority: 1, description: '年に数回の最上吉日' });
    }
    
    if (isTsuchinotoMi(date)) {
        days.push({ name: '己巳の日', isGood: true, priority: 2, description: '60日に一度の弁財天縁日' });
    }
    
    if (isKinoene(date)) {
        days.push({ name: '甲子の日', isGood: true, priority: 3, description: '60日に一度の開運日' });
    }
    
    if (isIchiryumanbai(date)) {
        days.push({ name: '一粒万倍日', isGood: true, priority: 4, description: '始めたことが万倍になる日' });
    }
    
    if (isToraNoHi(date)) {
        days.push({ name: '寅の日', isGood: true, priority: 5, description: '金運アップの日' });
    }
    
    if (isMiNoHi(date)) {
        days.push({ name: '巳の日', isGood: true, priority: 6, description: '弁財天の縁日' });
    }
    
    // 凶日
    if (isFujojubi(date)) {
        days.push({ name: '不成就日', isGood: false, priority: 7, description: '事始めに不向きな日' });
    }
    
    if (isJusshinichi(date)) {
        days.push({ name: '十死日', isGood: false, priority: 8, description: '受死日に次ぐ凶日' });
    }
    
    // 優先度でソート
    days.sort((a, b) => a.priority - b.priority);
    
    return days;
}

/**
 * 六曜の一覧を取得
 */
export function getRokuyoList() {
    return ROKUYO;
}
