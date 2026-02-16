// ===== 開運アクション生成エンジン v2.1 =====
// 点数制廃止版：優先 → 抑制 → 補正 → 統合

/**
 * 十二直の本来の意味（動詞で定義）
 */
const JUNICHOKU_MEANINGS = {
    '建': { verb: '始める・立ち上げる', direction: 'expand', risk: null },
    '除': { verb: '取り除く・外す', direction: 'remove', risk: null },
    '満': { verb: '満ちる・満たす', direction: 'fulfill', risk: null },
    '平': { verb: '平らにする・整える', direction: 'balance', risk: null },
    '定': { verb: '定着させる・決める', direction: 'settle', risk: null },
    '執': { verb: '固める・継続する', direction: 'maintain', risk: null },
    '破': { verb: '突破する・切る', direction: 'break', risk: null },
    '危': { verb: '慎重に扱う・確認する', direction: 'careful', risk: 'caution' },
    '成': { verb: '実らせる・成就させる', direction: 'achieve', risk: null },
    '納': { verb: '受け取る・収める', direction: 'receive', risk: null },
    '開': { verb: '開く・通じさせる', direction: 'open', risk: null },
    '閉': { verb: '閉じる・守る', direction: 'close', risk: null }
};

/**
 * 五行の意味とリスク
 */
const GOGYO_MEANINGS = {
    '木': { verb: '伸びる・成長する', strengthen: 'growth', risk: '伸びすぎ注意' },
    '火': { verb: '勢いづく・行動する', strengthen: 'momentum', risk: '勢いでやりすぎ注意' },
    '土': { verb: '安定する・土台を作る', strengthen: 'stability', risk: '動けなくなる注意' },
    '金': { verb: '切る・決断する', strengthen: 'decision', risk: '切りすぎ注意' },
    '水': { verb: '内省する・流れる', strengthen: 'reflection', risk: '停滞注意' }
};

/**
 * 吉凶日の性質
 */
const KICHIKU_PROPERTIES = {
    // 吉日（方向補正）
    '一粒万倍日': { type: 'good', property: '育つ・広がる', direction: 'expand' },
    '天赦日': { type: 'good', property: '許される・始められる', direction: 'start' },
    '甲子の日': { type: 'good', property: 'サイクルの原点・ゼロから始める', direction: 'reset' },
    '寅の日': { type: 'good', property: '循環・出て戻る', direction: 'circulate' },
    '巳の日': { type: 'good', property: '弁財天の縁日', direction: 'fortune' },
    '己巳の日': { type: 'good', property: '最強の弁財天縁日', direction: 'fortune' },
    // 凶日（抑制要素）
    '十死日': { type: 'bad', property: '勢いNG・小さく', suppress: true },
    '不成就日': { type: 'bad', property: '新規抑制・確認優先', suppress: true },
    '八専': { type: 'bad', property: '偏りやすい・慎重に', suppress: true },
    // 六曜
    '大安': { type: 'good', property: '万事吉', direction: 'all' },
    '仏滅': { type: 'bad', property: '控えめに', suppress: true }
};

/**
 * 九星の意味（フィールド）
 */
const KYUSEI_MEANINGS = {
    '一白水星': { field: '交流・内省', property: '深い関係性が動く' },
    '二黒土星': { field: '土台・受容', property: '支える力が強まる' },
    '三碧木星': { field: '発信・勢い', property: '声や行動が広がる' },
    '四緑木星': { field: '言葉・情報', property: '情報が広がりやすい' },
    '五黄土星': { field: '中心・変化', property: '大きな変化が起きやすい' },
    '六白金星': { field: '直感・決断', property: '天からの気づきがある' },
    '七赤金星': { field: '喜び・人脈', property: '楽しみや出会いがある' },
    '八白土星': { field: '変化・蓄積', property: '区切りや変化が起きる' },
    '九紫火星': { field: '注目・知性', property: '評価や発見がある' }
};

/**
 * 五行の補強特性（ロジック要約用）
 */
const GOGYO_STRENGTHS = {
    '木': '成長が得意',
    '火': '行動が得意',
    '土': '安定が得意',
    '金': '精査が得意',
    '水': '内省が得意'
};

/**
 * 6ステップ判定フローを実行
 * @param {Object} calendarData 暦情報
 * @returns {Object} 判定結果
 */
export function determineShujiku(calendarData) {
    const { moonPhase, junichoku, kichikuDays, gogyo, kyusei, rokuyo } = calendarData;
    
    // 判定フローの記録
    const flow = {
        step1: null, // 天体イベント
        step2: null, // 十二直
        step3: null, // 吉凶日
        step4: null, // 凶要素による抑制
        step5: null, // 五行
        step6: null  // 統合結果
    };
    
    // ===== STEP1: 強い天体イベント確認 =====
    let hasMajorCelestialEvent = false;
    let celestialEventInfo = null;
    
    if (moonPhase.isNewMoon) {
        hasMajorCelestialEvent = true;
        celestialEventInfo = {
            type: '新月',
            zodiac: moonPhase.zodiac,
            direction: '種まき・始まり',
            icon: '🌑'
        };
        flow.step1 = `新月（${moonPhase.zodiac}座）→ 主軸候補に昇格`;
    } else if (moonPhase.isFullMoon) {
        hasMajorCelestialEvent = true;
        celestialEventInfo = {
            type: '満月',
            zodiac: moonPhase.zodiac,
            direction: '満ちる・手放し',
            icon: '🌕'
        };
        flow.step1 = `満月（${moonPhase.zodiac}座）→ 主軸候補に昇格`;
    } else if (moonPhase.isFirstQuarter) {
        hasMajorCelestialEvent = true;
        celestialEventInfo = {
            type: '上弦の月',
            direction: '行動・拡大',
            icon: '🌓'
        };
        flow.step1 = '上弦の月 → 主軸候補に昇格';
    } else if (moonPhase.isLastQuarter) {
        hasMajorCelestialEvent = true;
        celestialEventInfo = {
            type: '下弦の月',
            direction: '手放し・整理',
            icon: '🌗'
        };
        flow.step1 = '下弦の月 → 主軸候補に昇格';
    } else {
        flow.step1 = '天体イベントなし → 十二直が主軸';
    }
    
    // ===== STEP2: 十二直の本来の意味を確認 =====
    const junichokuName = junichoku.name;
    const junichokuMeaning = JUNICHOKU_MEANINGS[junichokuName] || { verb: '不明', direction: 'unknown' };
    flow.step2 = `${junichokuName} → 「${junichokuMeaning.verb}」`;
    
    // ===== STEP3: 強い吉凶日の性質を確認 =====
    const goodDays = [];
    const badDays = [];
    
    if (kichikuDays && kichikuDays.length > 0) {
        for (const day of kichikuDays) {
            const prop = KICHIKU_PROPERTIES[day.name];
            if (prop) {
                if (prop.type === 'good') {
                    goodDays.push({ name: day.name, ...prop });
                } else if (prop.type === 'bad') {
                    badDays.push({ name: day.name, ...prop });
                }
            }
        }
    }
    
    // 六曜のチェック
    if (rokuyo) {
        const rokuyoProp = KICHIKU_PROPERTIES[rokuyo.name];
        if (rokuyoProp) {
            if (rokuyoProp.type === 'good') {
                goodDays.push({ name: rokuyo.name, ...rokuyoProp });
            } else if (rokuyoProp.type === 'bad') {
                badDays.push({ name: rokuyo.name, ...rokuyoProp });
            }
        }
    }
    
    if (goodDays.length > 0) {
        flow.step3 = goodDays.map(d => `${d.name} → 「${d.property}」`).join('、');
    } else if (badDays.length > 0) {
        flow.step3 = badDays.map(d => `${d.name} → 「${d.property}」（抑制）`).join('、');
    } else {
        flow.step3 = '強い吉凶日なし';
    }
    
    // ===== STEP4: 凶要素があれば"抑制"をかける =====
    let hasSuppress = badDays.length > 0;
    let suppressReason = null;
    
    if (hasSuppress) {
        suppressReason = badDays.map(d => d.property).join('、');
        flow.step4 = `抑制をかける → 「${suppressReason}」`;
    } else {
        flow.step4 = '凶要素なし';
    }
    
    // ===== STEP5: 五行で"強弱とリスク"を確認 =====
    const gogyoElement = gogyo?.element || '不明';
    const gogyoMeaning = GOGYO_MEANINGS[gogyoElement] || { verb: '不明', risk: null };
    
    flow.step5 = `${gogyoElement}強 → 「${gogyoMeaning.verb}」`;
    if (gogyoMeaning.risk) {
        flow.step5 += `（${gogyoMeaning.risk}）`;
    }
    
    // ===== STEP6: 統合 =====
    const integration = integrateEnergy({
        hasMajorCelestialEvent,
        celestialEventInfo,
        junichokuName,
        junichokuMeaning,
        goodDays,
        badDays,
        hasSuppress,
        suppressReason,
        gogyoElement,
        gogyoMeaning,
        moonPhase
    });
    
    flow.step6 = integration.summary;
    
    // 結果を返す
    return {
        // 主軸情報
        mainAxis: integration.mainAxis,
        abstractAction: integration.abstractAction,
        concreteAction: integration.concreteAction,
        
        // アイコン
        icon: integration.icon,
        
        // 判定フロー
        flow,
        
        // 詳細情報
        details: {
            hasMajorCelestialEvent,
            celestialEventInfo,
            junichokuName,
            junichokuMeaning,
            goodDays,
            badDays,
            hasSuppress,
            suppressReason,
            gogyoElement,
            gogyoMeaning
        },
        
        // 矛盾調整があったか
        hasConflict: integration.hasConflict,
        conflictResolution: integration.conflictResolution
    };
}

/**
 * エネルギーを統合して主軸を決定
 */
function integrateEnergy(data) {
    const {
        hasMajorCelestialEvent,
        celestialEventInfo,
        junichokuName,
        junichokuMeaning,
        goodDays,
        badDays,
        hasSuppress,
        gogyoElement,
        gogyoMeaning,
        moonPhase
    } = data;
    
    let mainAxis = junichokuMeaning.verb;
    let abstractAction = '';
    let concreteAction = '';
    let icon = getIconForGogyo(gogyoElement);
    let summary = '';
    let hasConflict = false;
    let conflictResolution = null;
    
    // 月相アイコンの決定
    if (hasMajorCelestialEvent && celestialEventInfo) {
        icon = celestialEventInfo.icon;
    } else {
        // 月齢に基づくアイコン
        icon = getMoonPhaseIcon(moonPhase);
    }
    
    // ===== 矛盾調整 =====
    
    // パターン1: 閉 + 一粒万倍日
    if (junichokuName === '閉' && goodDays.some(d => d.name === '一粒万倍日')) {
        hasConflict = true;
        conflictResolution = '閉（閉じる）+ 一粒万倍日（育つ）→ 新規ではなく既存を育てる';
        mainAxis = '既存を育てる';
        abstractAction = '昨日までに始めたことを、もう一歩進める。';
        concreteAction = 'やりかけのタスクを、1つ片付ける。';
        summary = '矛盾調整 → 「新規ではなく既存を育てる」';
    }
    // パターン2: 満 + 凶日（十死日・不成就日）
    else if (junichokuName === '満' && hasSuppress) {
        hasConflict = true;
        conflictResolution = '満（満ちる）+ 凶日 → 増やさず今あるもので満たす';
        mainAxis = '今あるもので満たす';
        abstractAction = '今あるものに、丁寧に向き合う。';
        concreteAction = '持っているものを、1つ褒める。';
        summary = '矛盾調整 → 「今あるもので満たす」';
    }
    // パターン3: 建 + 火強（勢いリスク）
    else if (junichokuName === '建' && gogyoElement === '火') {
        hasConflict = true;
        conflictResolution = '建（始める）+ 火強（勢い）→ 小さく始める';
        mainAxis = '小さく始める';
        
        // 寅の日があるか
        if (goodDays.some(d => d.name === '寅の日')) {
            abstractAction = '未来につながることを、小さく始める。';
            concreteAction = '気になっていたことに、5分だけ手をつける。';
            summary = '統合 → 「小さく始める」（寅の日で循環）';
        } else {
            abstractAction = '未来につながることを、小さく始める。';
            concreteAction = '気になっていたことに、5分だけ手をつける。';
            summary = '統合 → 「小さく始める」';
        }
    }
    // パターン4: 危 + 一粒万倍日
    else if (junichokuName === '危' && goodDays.some(d => d.name === '一粒万倍日')) {
        hasConflict = true;
        conflictResolution = '危（慎重に）+ 一粒万倍日（育つ）→ 確認してから始める';
        mainAxis = '確認してから始める';
        abstractAction = '確認してから、1つ始める。';
        concreteAction = '条件を確認してから、申し込む。';
        summary = '矛盾調整 → 「確認してから始める」';
    }
    // パターン5: 開 + 凶日
    else if (junichokuName === '開' && hasSuppress) {
        hasConflict = true;
        conflictResolution = '開（開く）+ 凶日 → 慎重に開く';
        mainAxis = '慎重に開く';
        abstractAction = '慎重に、1つ開く。';
        concreteAction = '確認してから、新しいことに手をつける。';
        summary = '矛盾調整 → 「慎重に開く」';
    }
    // パターン6: 新月当日
    else if (hasMajorCelestialEvent && celestialEventInfo?.type === '新月') {
        mainAxis = '種をまく';
        abstractAction = 'やりたいことを、形にする。';
        concreteAction = 'やりたいことを1つ、紙に書く。';
        summary = `新月（${celestialEventInfo.zodiac}座）+ ${junichokuName} → 「種をまく」`;
    }
    // パターン7: 満月当日
    else if (hasMajorCelestialEvent && celestialEventInfo?.type === '満月') {
        mainAxis = '満たす・手放す';
        abstractAction = '満ちたものを味わい、不要なものを手放す。';
        concreteAction = '感謝を1つ書き出し、不要なものを1つ捨てる。';
        summary = `満月（${celestialEventInfo.zodiac}座）+ ${junichokuName} → 「満たす・手放す」`;
    }
    // パターン8: 通常パターン（十二直ベース）
    else {
        const result = getDefaultAction(junichokuName, junichokuMeaning, gogyoElement, gogyoMeaning, goodDays, hasSuppress);
        mainAxis = result.mainAxis;
        abstractAction = result.abstractAction;
        concreteAction = result.concreteAction;
        summary = result.summary;
    }
    
    return {
        mainAxis,
        abstractAction,
        concreteAction,
        icon,
        summary,
        hasConflict,
        conflictResolution
    };
}

/**
 * デフォルトのアクションを取得（十二直ベース）
 */
function getDefaultAction(junichokuName, junichokuMeaning, gogyoElement, gogyoMeaning, goodDays, hasSuppress) {
    const actions = {
        '建': {
            mainAxis: '始める',
            abstractAction: '新しいことを、1つ始める。',
            concreteAction: '気になっていたことに、5分だけ手をつける。',
            summary: '建 → 「始める」'
        },
        '除': {
            mainAxis: '取り除く',
            abstractAction: '引っかかっていたものを、1つ外す。',
            concreteAction: '「もういいかも」と思うものを、1つ捨てる。',
            summary: '除 → 「取り除く」'
        },
        '満': {
            mainAxis: '満たす',
            abstractAction: '今あるもので、満たされる。',
            concreteAction: '持っているものを、1つ褒める。',
            summary: '満 → 「満たす」'
        },
        '平': {
            mainAxis: '整える',
            abstractAction: '目の前の1つを、整える。',
            concreteAction: '机の上を、5分だけ片付ける。',
            summary: '平 → 「整える」'
        },
        '定': {
            mainAxis: '定着させる',
            abstractAction: '決めたことを、もう一度やる。',
            concreteAction: 'いつものルーティンを、丁寧にやる。',
            summary: '定 → 「定着させる」'
        },
        '執': {
            mainAxis: '継続する',
            abstractAction: '続けていることを、もう一歩進める。',
            concreteAction: '習慣にしていることを、今日もやる。',
            summary: '執 → 「継続する」'
        },
        '破': {
            mainAxis: '切る',
            abstractAction: '迷っていたものを、1つ切る。',
            concreteAction: '「もういいかも」と思うものを、1つやめる。',
            summary: '破 → 「切る」'
        },
        '危': {
            mainAxis: '確認する',
            abstractAction: '決める前に、1つ確認する。',
            concreteAction: '条件や予定を、もう一度見直す。',
            summary: '危 → 「確認する」'
        },
        '成': {
            mainAxis: '実らせる',
            abstractAction: 'やってきたことを、形にする。',
            concreteAction: '進めていたことを、1つ完了させる。',
            summary: '成 → 「実らせる」'
        },
        '納': {
            mainAxis: '受け取る',
            abstractAction: '入ってくるものを、受け取る。',
            concreteAction: '届いたものを、丁寧に開ける。',
            summary: '納 → 「受け取る」'
        },
        '開': {
            mainAxis: '開く',
            abstractAction: '新しい扉を、1つ開く。',
            concreteAction: '気になっていたことを、調べてみる。',
            summary: '開 → 「開く」'
        },
        '閉': {
            mainAxis: '守る',
            abstractAction: '今あるものを、守る。',
            concreteAction: '大切なものを、丁寧に扱う。',
            summary: '閉 → 「守る」'
        }
    };
    
    const defaultAction = actions[junichokuName] || {
        mainAxis: '整える',
        abstractAction: '目の前の1つを、整える。',
        concreteAction: '机の上を、5分だけ片付ける。',
        summary: '十二直不明 → デフォルト「整える」'
    };
    
    // 吉日による補正
    if (goodDays.length > 0) {
        const goodDayNames = goodDays.map(d => d.name).join('、');
        defaultAction.summary += `（${goodDayNames}で補正）`;
    }
    
    // 抑制による補正
    if (hasSuppress) {
        defaultAction.summary += '（凶要素で抑制）';
    }
    
    return defaultAction;
}

/**
 * 五行に基づくアイコンを取得
 */
function getIconForGogyo(element) {
    const icons = {
        '木': '🌱',
        '火': '🔥',
        '土': '🌏',
        '金': '⚔',
        '水': '🌊'
    };
    return icons[element] || '✨';
}

/**
 * 月齢に基づくアイコンを取得
 */
function getMoonPhaseIcon(moonPhase) {
    if (!moonPhase) return '✨';
    
    const age = moonPhase.age || 0;
    
    if (age < 1.85) return '🌑';      // 新月
    if (age < 5.53) return '🌒';      // 三日月
    if (age < 9.22) return '🌓';      // 上弦
    if (age < 12.91) return '🌔';     // 十三夜
    if (age < 16.61) return '🌕';     // 満月
    if (age < 20.30) return '🌖';     // 十八夜
    if (age < 23.99) return '🌗';     // 下弦
    if (age < 27.68) return '🌘';     // 二十六夜
    return '🌑';                       // 新月前
}

/**
 * 判定フローを文字列で出力
 * @param {Object} result determineShujikuの結果
 * @returns {string}
 */
export function generateFlowText(result) {
    const { flow } = result;
    
    const lines = [
        '【判定フロー】',
        `STEP1: ${flow.step1}`,
        `STEP2: ${flow.step2}`,
        `STEP3: ${flow.step3}`,
        `STEP4: ${flow.step4}`,
        `STEP5: ${flow.step5}`,
        `STEP6: ${flow.step6}`
    ];
    
    return lines.join('\n');
}

/**
 * 主軸判定の詳細な理由を生成（後方互換性のため）
 * @param {Object} shujiku 主軸情報
 * @returns {string} 理由の説明文
 */
export function generateShujikuReason(shujiku) {
    if (shujiku.flow) {
        return generateFlowText(shujiku);
    }
    return `主軸: ${shujiku.mainAxis}`;
}

/**
 * 判定ロジックを構造化された要約形式で出力
 * @param {Object} calendarData 暦情報
 * @param {Object} shujikuResult determineShujikuの結果
 * @returns {string} 構造化されたロジック要約
 */
export function generateLogicSummary(calendarData, shujikuResult) {
    const lines = [];
    
    // ===== 主軸 =====
    const junichokuName = calendarData.junichoku?.name || '不明';
    const junichokuMeaning = JUNICHOKU_MEANINGS[junichokuName];
    let mainAxisText = `主軸：${junichokuName}`;
    if (junichokuMeaning) {
        // 動詞から簡潔な表現を抽出（「〜する」を取り除く）
        const shortVerb = junichokuMeaning.verb.split('・')[0].replace(/する$/, '');
        mainAxisText += `（${shortVerb}）`;
    }
    
    // 天体イベントがある場合は主軸を上書き
    if (shujikuResult.details?.celestialEventInfo) {
        const event = shujikuResult.details.celestialEventInfo;
        if (event.type === '新月') {
            mainAxisText = `主軸：新月（${event.zodiac}座）→ 種まき`;
        } else if (event.type === '満月') {
            mainAxisText = `主軸：満月（${event.zodiac}座）→ 満ちる・手放し`;
        } else if (event.type === '上弦の月') {
            mainAxisText = `主軸：上弦の月 → 行動・拡大`;
        } else if (event.type === '下弦の月') {
            mainAxisText = `主軸：下弦の月 → 手放し・整理`;
        }
    }
    lines.push(mainAxisText);
    
    // ===== 抑制 =====
    const suppressElements = [];
    if (shujikuResult.details?.badDays && shujikuResult.details.badDays.length > 0) {
        for (const day of shujikuResult.details.badDays) {
            suppressElements.push(`${day.name}（${day.property}）`);
        }
    }
    if (suppressElements.length > 0) {
        lines.push(`抑制：${suppressElements.join('・')}`);
    }
    
    // ===== 補強 =====
    const kanshi = calendarData.kanshi?.day?.kanshi || '';
    const gogyoName = calendarData.gogyo?.name || '';
    if (kanshi && gogyoName) {
        const gogyoStrength = GOGYO_STRENGTHS[gogyoName] || '';
        lines.push(`補強：${kanshi}＝${gogyoName}（${gogyoStrength}）`);
    }
    
    // ===== フィールド =====
    const kyuseiName = calendarData.kyusei?.day?.name || '';
    if (kyuseiName) {
        const kyuseiMeaning = KYUSEI_MEANINGS[kyuseiName];
        if (kyuseiMeaning) {
            // 九星から数字部分を抽出（例：「四緑木星」→「四緑」）
            const shortKyusei = kyuseiName.replace(/[木火土金水]星$/, '');
            lines.push(`フィールド：${shortKyusei}（${kyuseiMeaning.field}）`);
        }
    }
    
    // ===== 結論 =====
    lines.push('');
    lines.push('➡️ よって、最も効果が高く万人ができるアクションは');
    lines.push(`「${shujikuResult.concreteAction}」`);
    
    // ===== 理由 =====
    lines.push('');
    const reasons = generateActionReasons(calendarData, shujikuResult);
    for (const reason of reasons) {
        lines.push(`・${reason}`);
    }
    
    return lines.join('\n');
}

/**
 * アクションの理由を生成
 * @param {Object} calendarData 
 * @param {Object} shujikuResult 
 * @returns {string[]}
 */
function generateActionReasons(calendarData, shujikuResult) {
    const reasons = [];
    
    // 1. 時間的な実行可能性
    reasons.push('5分以内でできる');
    
    // 2. 主軸との関連
    const junichokuName = calendarData.junichoku?.name || '';
    const gogyoName = calendarData.gogyo?.name || '';
    const kyuseiName = calendarData.kyusei?.day?.name || '';
    
    // 主軸に基づく理由
    if (junichokuName === '危') {
        const shortKyusei = kyuseiName.replace(/[木火土金水]星$/, '');
        reasons.push(`誤送信・誤解を減らす（${junichokuName}＋${shortKyusei}の事故回避）`);
    } else if (junichokuName === '建' || junichokuName === '開') {
        reasons.push('新しい一歩を踏み出せる');
    } else if (junichokuName === '除' || junichokuName === '破') {
        reasons.push('不要なものを手放せる');
    } else if (junichokuName === '定' || junichokuName === '執') {
        reasons.push('土台が固まる');
    } else if (junichokuName === '満' || junichokuName === '成') {
        reasons.push('今あるものが満たされる');
    } else if (junichokuName === '平') {
        reasons.push('バランスが整う');
    }
    
    // 五行に基づく理由
    if (gogyoName === '金') {
        reasons.push('金の精査力を活かす');
    } else if (gogyoName === '木') {
        reasons.push('成長のエネルギーを活かす');
    } else if (gogyoName === '火') {
        reasons.push('行動力を活かす');
    } else if (gogyoName === '土') {
        reasons.push('安定のエネルギーを活かす');
    } else if (gogyoName === '水') {
        reasons.push('内省力を活かす');
    }
    
    // 「やめろ」ではなく前に進める
    reasons.push('"やめろ"ではなく前に進める');
    
    return reasons;
}
