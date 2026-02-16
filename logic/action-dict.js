// ===== ゆい式｜アクション辞書 =====

/**
 * 主軸タイプ別アクション辞書
 * 各主軸に対応する具体的なアクションとNG行動を定義
 */
export const ACTION_DICT = {
    // 🪨 整える日（削る・切る）
    totoneru: {
        name: '整える',
        icon: '🪨',
        energy: '削る・修正',
        direction: '減らす',
        actions: [
            '不要な習慣を1つやめる',
            '返信を片付ける',
            '机・バッグを整理する',
            '迷ってる予定をキャンセルする',
            'サブスクを見直す',
            '余計な5分を削る',
            '未読メールを整理する',
            'スマホのアプリを整理する',
            'クローゼットの不用品を1つ手放す',
            'SNSのフォローを整理する',
            '財布の中を整える',
            'デスクトップを整理する'
        ],
        ng: ['新規スタート', '衝動決断', '大きな契約', '新しい習慣を始める'],
        description: '不要なものを削ぎ落とし、シンプルにする日'
    },
    
    // 🌱 増やす日（種まき・拡大）
    fuyasu: {
        name: '増やす',
        icon: '🌱',
        energy: '拡大・種まき',
        direction: '増やす',
        actions: [
            '気になる講座に申し込む',
            '投稿を1本出す',
            '目標を紙に書く',
            '新しい人に連絡する',
            '小さな挑戦をする',
            '未来につながる1歩を踏み出す',
            '欲しいものリストを作る',
            'やりたいことを書き出す',
            'ビジョンボードに画像を追加する',
            '新しい本を買う',
            '学びたいことを調べる',
            '次の旅行先を決める'
        ],
        ng: ['迷って止まる', '何も形にしない', '考えすぎて行動しない'],
        description: '新しいことを始め、可能性を広げる日'
    },
    
    // 🏗 固める日（定着・安定）
    katameru: {
        name: '固める',
        icon: '🏗',
        energy: '継続・安定',
        direction: '定着',
        actions: [
            'ルーティンを守る',
            '同じことをもう一度やる',
            '家計を見直す',
            '基礎作業に集中する',
            '土台を整える',
            'いつも使う場所を整える',
            '習慣を継続する',
            'いつもの道を歩く',
            'お気に入りの店に行く',
            '信頼できる人と話す',
            '基本に立ち返る',
            'コツコツ作業を進める'
        ],
        ng: ['気分で方向転換', '急な予定変更', '衝動的な決断'],
        description: '今あるものを大切にし、安定させる日'
    },
    
    // 🔥 動かす日（発信・挑戦）
    ugokasu: {
        name: '動かす',
        icon: '🔥',
        energy: '発信・挑戦',
        direction: '行動',
        actions: [
            '発信する',
            '人に会う',
            '連絡をとる',
            '意見を言う',
            '運動する',
            '行動量を増やす',
            '声をかける',
            '誘いに乗る',
            '外出する',
            '自分から提案する',
            '積極的に動く',
            'チャンスに飛び込む'
        ],
        ng: ['受け身すぎる', '様子見ばかり', '引きこもる'],
        description: 'エネルギーを外に向け、積極的に動く日'
    },
    
    // 🌊 守る日（慎重・精査）
    mamoru: {
        name: '守る',
        icon: '🌊',
        energy: '慎重・内省',
        direction: '確認',
        actions: [
            '再確認する',
            '条件をしっかり読む',
            '一呼吸おく',
            '感情を整える',
            '数字を見直す',
            '大きな決断は精査する',
            '情報を集める',
            '人の意見を聞く',
            '立ち止まって考える',
            '直感を大切にする',
            '違和感を見逃さない',
            '急がず焦らず'
        ],
        ng: ['即決', '勢い契約', '焦った行動', '衝動的な返事'],
        description: '慎重に行動し、大切なものを守る日'
    }
};

/**
 * 五行別アクション補正辞書
 * 日の五行に応じた追加アクション・キーワード
 */
export const GOGYO_ACTIONS = {
    // 🌳 木が強い日
    木: {
        name: '木',
        icon: '🌳',
        strong: '木強',
        actions: [
            '新しいことを始める',
            '種をまく',
            '伸ばす',
            '未来の計画を立てる',
            '成長につながる行動',
            '学びを深める'
        ],
        colors: ['緑', 'エメラルド', '青緑'],
        keywords: ['成長', '発展', '新芽', '春', '始まり']
    },
    
    // 🔥 火が強い日
    火: {
        name: '火',
        icon: '🔥',
        strong: '火強',
        actions: [
            '発信する',
            '目立つ行動をする',
            '運動する',
            '情熱を表現する',
            'プレゼンをする',
            'アピールする'
        ],
        colors: ['赤', 'オレンジ', 'ピンク'],
        keywords: ['情熱', '活力', '表現', '夏', '輝き']
    },
    
    // 🌏 土が強い日
    土: {
        name: '土',
        icon: '🌏',
        strong: '土強',
        actions: [
            '整理する',
            '家や机を片付ける',
            'ルーティンを守る',
            '安定させる',
            '基盤を作る',
            '地に足をつける'
        ],
        colors: ['ベージュ', 'ブラウン', '黄土色', 'アイボリー'],
        keywords: ['安定', '土台', '信頼', '中心', '守り']
    },
    
    // ⚔ 金が強い日
    金: {
        name: '金',
        icon: '⚔',
        strong: '金強',
        actions: [
            '断捨離する',
            '決断する',
            '仕分けする',
            '切る',
            '終わらせる',
            'けじめをつける'
        ],
        colors: ['白', 'シルバー', 'ゴールド'],
        keywords: ['切断', '決断', '終結', '秋', 'けじめ']
    },
    
    // 🌊 水が強い日
    水: {
        name: '水',
        icon: '🌊',
        strong: '水強',
        actions: [
            '休む',
            '内省する',
            '情報を整理する',
            '塩風呂・浄化する',
            '流れに身を任せる',
            'インプットする'
        ],
        colors: ['紺', '黒', '水色', '深い青'],
        keywords: ['休息', '浄化', '冬', '静寂', '蓄える']
    }
};

/**
 * 主軸タイプのキーを取得
 * @param {string} name 主軸の名前
 * @returns {string} キー
 */
export function getShujikuKey(name) {
    const keyMap = {
        '整える': 'totoneru',
        '増やす': 'fuyasu',
        '固める': 'katameru',
        '動かす': 'ugokasu',
        '守る': 'mamoru'
    };
    return keyMap[name] || 'totoneru';
}

/**
 * 主軸とゴギョウからアクションを取得
 * @param {string} shujikuKey 主軸のキー
 * @param {string} gogyoElement 五行の要素
 * @returns {Object} アクション情報
 */
export function getActionsForDay(shujikuKey, gogyoElement) {
    const shujikuActions = ACTION_DICT[shujikuKey];
    const gogyoActions = GOGYO_ACTIONS[gogyoElement];
    
    return {
        mainActions: shujikuActions.actions,
        gogyoActions: gogyoActions ? gogyoActions.actions : [],
        ng: shujikuActions.ng,
        colors: gogyoActions ? gogyoActions.colors : [],
        keywords: gogyoActions ? gogyoActions.keywords : []
    };
}
