// ===== 月相計算モジュール =====

// 黄道十二宮
const ZODIAC_SIGNS = [
    { name: '牡羊', start: 0 },
    { name: '牡牛', start: 30 },
    { name: '双子', start: 60 },
    { name: '蟹', start: 90 },
    { name: '獅子', start: 120 },
    { name: '乙女', start: 150 },
    { name: '天秤', start: 180 },
    { name: '蠍', start: 210 },
    { name: '射手', start: 240 },
    { name: '山羊', start: 270 },
    { name: '水瓶', start: 300 },
    { name: '魚', start: 330 }
];

/**
 * ユリウス日を計算
 * @param {Date} date 
 * @returns {number}
 */
function toJulianDay(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    let y = year;
    let m = month;
    
    if (m <= 2) {
        y -= 1;
        m += 12;
    }
    
    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    
    return Math.floor(365.25 * (y + 4716)) + 
           Math.floor(30.6001 * (m + 1)) + 
           day + b - 1524.5;
}

/**
 * 月齢を計算（0-29.53日のサイクル）
 * @param {Date} date 
 * @returns {number}
 */
function getMoonAge(date) {
    const jd = toJulianDay(date);
    // 基準新月: 2000年1月6日 18:14 UTC (JD 2451550.26)
    const refNewMoon = 2451550.26;
    const lunarCycle = 29.530588853; // 朔望月
    
    const daysSinceRef = jd - refNewMoon;
    const moonAge = daysSinceRef % lunarCycle;
    
    return moonAge < 0 ? moonAge + lunarCycle : moonAge;
}

/**
 * 太陽の黄経を計算（簡易版）
 * @param {Date} date 
 * @returns {number}
 */
function getSunLongitude(date) {
    const jd = toJulianDay(date);
    const t = (jd - 2451545.0) / 36525; // J2000.0からの経過世紀
    
    // 太陽の平均黄経
    let L0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
    L0 = L0 % 360;
    if (L0 < 0) L0 += 360;
    
    // 太陽の平均近点角
    let M = 357.52911 + 35999.05029 * t - 0.0001537 * t * t;
    M = M % 360;
    if (M < 0) M += 360;
    const Mrad = M * Math.PI / 180;
    
    // 中心差
    const C = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(Mrad) +
              (0.019993 - 0.000101 * t) * Math.sin(2 * Mrad) +
              0.000289 * Math.sin(3 * Mrad);
    
    // 太陽の真黄経
    let sunLong = L0 + C;
    sunLong = sunLong % 360;
    if (sunLong < 0) sunLong += 360;
    
    return sunLong;
}

/**
 * 月の黄経を計算（簡易版）
 * @param {Date} date 
 * @returns {number}
 */
function getMoonLongitude(date) {
    const jd = toJulianDay(date);
    const t = (jd - 2451545.0) / 36525;
    
    // 月の平均黄経
    let L = 218.3165 + 481267.8813 * t;
    L = L % 360;
    if (L < 0) L += 360;
    
    // 月の平均近点角
    let M = 134.9634 + 477198.8675 * t;
    M = M % 360;
    if (M < 0) M += 360;
    const Mrad = M * Math.PI / 180;
    
    // 主要な摂動項
    const correction = 6.289 * Math.sin(Mrad);
    
    let moonLong = L + correction;
    moonLong = moonLong % 360;
    if (moonLong < 0) moonLong += 360;
    
    return moonLong;
}

/**
 * 黄経から星座を取得
 * @param {number} longitude 
 * @returns {string}
 */
function getZodiacFromLongitude(longitude) {
    for (let i = ZODIAC_SIGNS.length - 1; i >= 0; i--) {
        if (longitude >= ZODIAC_SIGNS[i].start) {
            return ZODIAC_SIGNS[i].name;
        }
    }
    return ZODIAC_SIGNS[0].name;
}

/**
 * 月相を取得
 * @param {Date} date 
 * @returns {Object}
 */
export function getMoonPhase(date) {
    const moonAge = getMoonAge(date);
    const lunarCycle = 29.530588853;
    
    // 月相の判定（許容誤差1日）
    const tolerance = 1.0;
    
    let phase = '';
    let icon = '';
    let isNewMoon = false;
    let isFullMoon = false;
    let isFirstQuarter = false;
    let isLastQuarter = false;
    let zodiac = null;
    
    // 新月（0日付近）
    if (moonAge < tolerance || moonAge > lunarCycle - tolerance) {
        phase = '新月';
        icon = '🌑';
        isNewMoon = true;
        zodiac = getZodiacFromLongitude(getMoonLongitude(date));
    }
    // 上弦（7.38日付近）
    else if (Math.abs(moonAge - lunarCycle / 4) < tolerance) {
        phase = '上弦の月';
        icon = '🌓';
        isFirstQuarter = true;
    }
    // 満月（14.77日付近）
    else if (Math.abs(moonAge - lunarCycle / 2) < tolerance) {
        phase = '満月';
        icon = '🌕';
        isFullMoon = true;
        zodiac = getZodiacFromLongitude(getMoonLongitude(date));
    }
    // 下弦（22.15日付近）
    else if (Math.abs(moonAge - lunarCycle * 3 / 4) < tolerance) {
        phase = '下弦の月';
        icon = '🌗';
        isLastQuarter = true;
    }
    // その他の月相
    else if (moonAge < lunarCycle / 4) {
        phase = '三日月（増）';
        icon = '🌒';
    }
    else if (moonAge < lunarCycle / 2) {
        phase = '十日月';
        icon = '🌔';
    }
    else if (moonAge < lunarCycle * 3 / 4) {
        phase = '十八夜月';
        icon = '🌖';
    }
    else {
        phase = '二十六夜月';
        icon = '🌘';
    }
    
    return {
        name: phase,
        icon,
        age: Math.round(moonAge * 10) / 10,
        isNewMoon,
        isFullMoon,
        isFirstQuarter,
        isLastQuarter,
        zodiac,
        isStrongPhase: isNewMoon || isFullMoon || isFirstQuarter || isLastQuarter
    };
}
