// ===== 十二直計算モジュール =====

// 十二直
const JUNICHOKU = [
    { 
        name: '建', 
        reading: 'たつ',
        meaning: '万物を建て生じる日',
        good: ['神仏祭祀', '婚礼', '開店', '移転', '柱立て', '棟上げ', '旅行', '新規事'],
        bad: ['屋敷内の土動かし'],
        isGood: true,
        isBad: false
    },
    { 
        name: '除', 
        reading: 'のぞく',
        meaning: '障害を除き去る日',
        good: ['医師への掛かり始め', '薬の飲み始め', '種まき', '井戸掘り'],
        bad: ['婚礼', '動土'],
        isGood: false,
        isBad: false
    },
    { 
        name: '満', 
        reading: 'みつ',
        meaning: '全てが満たされる日',
        good: ['婚礼', '祝い事', '移転', '旅行', '建築', '開店'],
        bad: ['動土', '薬の飲み始め', '服薬'],
        isGood: true,
        isBad: false
    },
    { 
        name: '平', 
        reading: 'たいら',
        meaning: '物事が平らかになる日',
        good: ['婚礼', '旅行', '道路修理', '壁塗り', '地固め'],
        bad: ['川や溝の掘削', '動土'],
        isGood: true,
        isBad: false
    },
    { 
        name: '定', 
        reading: 'さだん',
        meaning: '善悪が定まる日',
        good: ['婚礼', '開店', '建築', '移転', '井戸掘り', '契約'],
        bad: ['訴訟', '旅行', '樹木の植え替え'],
        isGood: true,
        isBad: false
    },
    { 
        name: '執', 
        reading: 'とる',
        meaning: '万物の活動が固まる日',
        good: ['祭祀', '婚礼', '造作', '種まき', '井戸掘り', '増改築'],
        bad: ['金銭出納', '財産整理', '旅行', '開店'],
        isGood: true,
        isBad: false
    },
    { 
        name: '破', 
        reading: 'やぶる',
        meaning: '物事を突破する日',
        good: ['訴訟', '出陣', '漁猟'],
        bad: ['婚礼', '祝い事', '契約', '神仏祭祀'],
        isGood: false,
        isBad: true
    },
    { 
        name: '危', 
        reading: 'あやぶ',
        meaning: '物事を危惧する日',
        good: ['なし'],
        bad: ['万事控えめに', '高所での作業', '船乗り', '登山', '旅行'],
        isGood: false,
        isBad: true
    },
    { 
        name: '成', 
        reading: 'なる',
        meaning: '物事が成就する日',
        good: ['婚礼', '開店', '建築', '移転', '種まき', '結納', '新規事'],
        bad: ['訴訟', '談判'],
        isGood: true,
        isBad: false
    },
    { 
        name: '納', 
        reading: 'おさん',
        meaning: '万物を納め入れる日',
        good: ['収穫', '購入', '結婚', '建築', '移転', '商品仕入れ'],
        bad: ['見合い', '婚礼', '葬儀'],
        isGood: true,
        isBad: false
    },
    { 
        name: '開', 
        reading: 'ひらく',
        meaning: '開き通じる日',
        good: ['建築', '移転', '開店', '婚礼', '祭祀'],
        bad: ['葬儀', '不浄事', '便所造り'],
        isGood: true,
        isBad: false
    },
    { 
        name: '閉', 
        reading: 'とづ',
        meaning: '閉じ塞がる日',
        good: ['建墓', '便所造り', '壁や穴のふさぎ', '金銭の収納'],
        bad: ['旅行', '婚礼', '開店', '建築'],
        isGood: false,
        isBad: false
    }
];

// 節月と十二支の対応
const SETSU_SHI = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];

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
 * 日の十二支インデックスを取得
 * @param {Date} date 
 * @returns {number}
 */
function getDayShiIndex(date) {
    // 基準日: 1900年1月31日（甲子の日）
    const epoch = new Date(1900, 0, 31);
    const diffTime = date.getTime() - epoch.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return ((diffDays % 12) + 12) % 12;
}

/**
 * 節月を取得
 * @param {Date} date 
 * @returns {number} 0-11 (寅月=0)
 */
function getSetsuMonth(date) {
    let month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 節入り日を取得
    const setsuDay = SETSUIRI_DAYS[month] || 5;
    
    // 節入り前なら前月として計算
    if (day < setsuDay) {
        month -= 1;
        if (month < 1) month = 12;
    }
    
    // 2月=寅月を0として計算
    return (month - 2 + 12) % 12;
}

/**
 * 十二直を計算
 * @param {Date} date 
 * @returns {Object}
 */
export function getJunichoku(date) {
    // 日の十二支インデックスを取得
    const dayShiIndex = getDayShiIndex(date);
    
    // 節月を取得
    const setsuMonth = getSetsuMonth(date);
    
    // 十二直の計算
    // 建は節の支と日の支が同じ時から始まる
    // 例：寅月の寅の日が「建」
    const junichokuIndex = (dayShiIndex - setsuMonth + 12) % 12;
    
    return JUNICHOKU[junichokuIndex];
}

/**
 * 十二直の一覧を取得
 */
export function getJunichokuList() {
    return JUNICHOKU;
}

/**
 * 吉の十二直かどうか
 * @param {Date} date 
 * @returns {boolean}
 */
export function isGoodJunichoku(date) {
    const junichoku = getJunichoku(date);
    return junichoku.isGood;
}

/**
 * 凶の十二直かどうか
 * @param {Date} date 
 * @returns {boolean}
 */
export function isBadJunichoku(date) {
    const junichoku = getJunichoku(date);
    return junichoku.isBad;
}
