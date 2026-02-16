// ===== 二十八宿計算モジュール =====

// 二十八宿
const NIJUHASSYUKU = [
    { name: '角', reading: 'かく', meaning: '衣類の裁断、柱建て、普請造作、結婚に吉', isGood: true },
    { name: '亢', reading: 'こう', meaning: '衣類の仕立て、物品購入、種まきに吉', isGood: true },
    { name: '氐', reading: 'てい', meaning: '結婚、開店、酒造り、新規事に吉', isGood: true },
    { name: '房', reading: 'ぼう', meaning: '婚礼、旅行、移転、柱立て、棟上げに大吉', isGood: true },
    { name: '心', reading: 'しん', meaning: '神仏祭祀、移転、旅行に吉。但し造作、結婚は凶', isGood: false },
    { name: '尾', reading: 'び', meaning: '婚礼、開店、移転、造作、新規事業に吉', isGood: true },
    { name: '箕', reading: 'き', meaning: '動土、池掘り、仕入れ、集金、改築に吉', isGood: true },
    { name: '斗', reading: 'と', meaning: '土掘り、開店、造作に吉', isGood: true },
    { name: '牛', reading: 'ぎゅう', meaning: '移転、旅行、金談に吉', isGood: true },
    { name: '女', reading: 'じょ', meaning: '稽古始め、お披露目に吉。訴訟、結婚は凶', isGood: false },
    { name: '虚', reading: 'きょ', meaning: '入学、習い事始めに吉。相談事、造作は凶', isGood: false },
    { name: '危', reading: 'き', meaning: '壁塗り、船乗り、酒造りに吉。衣類の裁断は凶', isGood: false },
    { name: '室', reading: 'しつ', meaning: '婚礼、祝い事、祈願、棟上げに大吉', isGood: true },
    { name: '壁', reading: 'へき', meaning: '開店、旅行、婚礼、衣類の仕立て、新規事業に大吉', isGood: true },
    { name: '奎', reading: 'けい', meaning: '柱立て、棟上げ、井戸掘り、神仏祭祀、旅行に吉', isGood: true },
    { name: '婁', reading: 'ろう', meaning: '動土、造作、縁談、契約、造園、衣類の仕立てに吉', isGood: true },
    { name: '胃', reading: 'い', meaning: '開店、移転、求職に吉', isGood: true },
    { name: '昴', reading: 'ぼう', meaning: '神仏祭祀、祝い事、開店、新規事業に吉', isGood: true },
    { name: '畢', reading: 'ひつ', meaning: '稽古始め、田畑の仕事、不動産取引に吉', isGood: true },
    { name: '觜', reading: 'し', meaning: '稽古始め、運搬始めに吉。造作は凶', isGood: false },
    { name: '参', reading: 'しん', meaning: '仕入れ、納入、取引始め、祝い事に吉', isGood: true },
    { name: '井', reading: 'せい', meaning: '神仏祭祀、種まき、動土、普請に吉', isGood: true },
    { name: '鬼', reading: 'き', meaning: '婚礼以外は大吉。特に公事に良い', isGood: true },
    { name: '柳', reading: 'りゅう', meaning: '物事を断るに吉。婚礼、新規事業は凶', isGood: false },
    { name: '星', reading: 'せい', meaning: '乗馬始め、治療始め、便所造りに吉。婚礼、葬儀は凶', isGood: false },
    { name: '張', reading: 'ちょう', meaning: '婚礼、就職、見合い、神仏祭祀、祝い事に大吉', isGood: true },
    { name: '翼', reading: 'よく', meaning: '種まき、耕作始め、植え替え、入学に吉', isGood: true },
    { name: '軫', reading: 'しん', meaning: '棟上げ、建築、井戸掘り、神仏祭祀、婚礼に吉', isGood: true }
];

/**
 * 二十八宿を計算
 * @param {Date} date 
 * @returns {Object}
 */
export function getNijuhassyuku(date) {
    // 基準日: 2024年1月1日 = 虚宿
    const baseDate = new Date(2024, 0, 1);
    const baseIndex = 10; // 虚宿
    
    // 経過日数を計算
    const diffTime = date.getTime() - baseDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // 二十八宿は28日周期
    const index = ((baseIndex + diffDays) % 28 + 28) % 28;
    
    return NIJUHASSYUKU[index];
}

/**
 * 二十八宿の一覧を取得
 */
export function getNijuhassyukuList() {
    return NIJUHASSYUKU;
}

/**
 * 吉の二十八宿かどうか
 * @param {Date} date 
 * @returns {boolean}
 */
export function isGoodNijuhassyuku(date) {
    const nijuhassyuku = getNijuhassyuku(date);
    return nijuhassyuku.isGood;
}
