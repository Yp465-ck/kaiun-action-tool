// ===== 九星気学計算モジュール =====

// 九星
const KYUSEI = [
    { number: 1, name: '一白水星', element: '水', color: '白', direction: '北' },
    { number: 2, name: '二黒土星', element: '土', color: '黒', direction: '南西' },
    { number: 3, name: '三碧木星', element: '木', color: '碧', direction: '東' },
    { number: 4, name: '四緑木星', element: '木', color: '緑', direction: '南東' },
    { number: 5, name: '五黄土星', element: '土', color: '黄', direction: '中央' },
    { number: 6, name: '六白金星', element: '金', color: '白', direction: '北西' },
    { number: 7, name: '七赤金星', element: '金', color: '赤', direction: '西' },
    { number: 8, name: '八白土星', element: '土', color: '白', direction: '北東' },
    { number: 9, name: '九紫火星', element: '火', color: '紫', direction: '南' }
];

// 節入り日（簡易版）
const SETSUIRI_DAYS = {
    1: 6,   // 小寒
    2: 4,   // 立春
    3: 6,   // 啓蟄
    4: 5,   // 清明
    5: 6,   // 立夏
    6: 6,   // 芒種
    7: 7,   // 小暑
    8: 8,   // 立秋
    9: 8,   // 白露
    10: 8,  // 寒露
    11: 7,  // 立冬
    12: 7   // 大雪
};

/**
 * 年九星を計算
 * @param {Date} date 
 * @returns {Object}
 */
function getYearKyusei(date) {
    let year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 立春前は前年として計算
    const risshunDay = SETSUIRI_DAYS[2] || 4;
    if (month < 2 || (month === 2 && day < risshunDay)) {
        year -= 1;
    }
    
    // 年九星の計算
    // 2024年は三碧木星
    // 九星は1から9まで逆順で巡る
    const baseYear = 2024;
    const baseKyusei = 3; // 三碧木星
    
    const diff = year - baseYear;
    let kyuseiNumber = baseKyusei - (diff % 9);
    
    // 範囲を1-9に調整
    while (kyuseiNumber < 1) kyuseiNumber += 9;
    while (kyuseiNumber > 9) kyuseiNumber -= 9;
    
    return KYUSEI[kyuseiNumber - 1];
}

/**
 * 月九星を計算
 * @param {Date} date 
 * @returns {Object}
 */
function getMonthKyusei(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 節入り日を取得
    const setsuDay = SETSUIRI_DAYS[month] || 5;
    
    // 節入り前なら前月として計算
    if (day < setsuDay) {
        month -= 1;
        if (month < 1) {
            month = 12;
            year -= 1;
        }
    }
    
    // 年の九星グループを計算（1,4,7年 / 2,5,8年 / 3,6,9年）
    const yearKyusei = getYearKyusei(date);
    const yearGroup = yearKyusei.number % 3; // 0, 1, 2
    
    // 月九星の基準値（2月を基準）
    // グループ0(3,6,9): 2月=八白土星
    // グループ1(1,4,7): 2月=二黒土星
    // グループ2(2,5,8): 2月=五黄土星
    const baseMonthKyusei = [8, 2, 5][yearGroup];
    
    // 2月からの経過月数
    let monthsFromFeb = month - 2;
    if (monthsFromFeb < 0) monthsFromFeb += 12;
    
    // 月九星は逆順で巡る
    let kyuseiNumber = baseMonthKyusei - monthsFromFeb;
    
    // 範囲を1-9に調整
    while (kyuseiNumber < 1) kyuseiNumber += 9;
    while (kyuseiNumber > 9) kyuseiNumber -= 9;
    
    return KYUSEI[kyuseiNumber - 1];
}

/**
 * 日九星を計算
 * @param {Date} date 
 * @returns {Object}
 */
function getDayKyusei(date) {
    // 基準日: 2024年2月4日 = 八白土星
    const baseDate = new Date(2024, 1, 4);
    const baseKyusei = 8;
    
    // 経過日数を計算
    const diffTime = date.getTime() - baseDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // 日九星は逆順で巡る（9日周期）
    let kyuseiNumber = baseKyusei - (diffDays % 9);
    
    // 範囲を1-9に調整
    while (kyuseiNumber < 1) kyuseiNumber += 9;
    while (kyuseiNumber > 9) kyuseiNumber -= 9;
    
    return KYUSEI[kyuseiNumber - 1];
}

/**
 * 九星情報を取得
 * @param {Date} date 
 * @returns {Object}
 */
export function getKyusei(date) {
    return {
        year: getYearKyusei(date),
        month: getMonthKyusei(date),
        day: getDayKyusei(date)
    };
}

/**
 * 九星の一覧を取得
 */
export function getKyuseiList() {
    return KYUSEI;
}

/**
 * 特定の九星かどうかをチェック
 * @param {Date} date 
 * @param {number} kyuseiNumber 九星の番号（1-9）
 * @returns {boolean}
 */
export function isDayOfKyusei(date, kyuseiNumber) {
    const dayKyusei = getDayKyusei(date);
    return dayKyusei.number === kyuseiNumber;
}

/**
 * 三碧木星の日かどうか
 * @param {Date} date 
 * @returns {boolean}
 */
export function isSanpeki(date) {
    return isDayOfKyusei(date, 3);
}

/**
 * 九紫火星の日かどうか
 * @param {Date} date 
 * @returns {boolean}
 */
export function isKyushi(date) {
    return isDayOfKyusei(date, 9);
}
