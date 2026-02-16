// ===== OpenAI API連携・プロンプト構築モジュール v2.1 =====

import { GOGYO_ACTIONS } from '../logic/action-dict.js';
import { generateFlowText, generateLogicSummary } from '../logic/shujiku.js';

/**
 * 日付をフォーマット
 * @param {Date} date 
 * @returns {string}
 */
function formatDateJapanese(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekDay = weekDays[date.getDay()];
    return `${year}年${month}月${day}日（${weekDay}）`;
}

/**
 * 暦情報をテキストにまとめる
 * @param {Object} calendarData 
 * @returns {string}
 */
function summarizeCalendarData(calendarData) {
    const lines = [];
    
    // 日付
    lines.push(`📅 ${formatDateJapanese(calendarData.date)}`);
    lines.push('');
    
    // 月相
    let moonLine = `【月相】${calendarData.moonPhase.name}`;
    if (calendarData.moonPhase.zodiac) {
        moonLine += `（${calendarData.moonPhase.zodiac}座）`;
    }
    if (calendarData.moonPhase.isNewMoon || calendarData.moonPhase.isFullMoon) {
        moonLine += ' ★重要';
    }
    lines.push(moonLine);
    
    // 十二直
    lines.push(`【十二直】${calendarData.junichoku.name}（${calendarData.junichoku.reading}）`);
    
    // 干支・五行
    lines.push(`【日干支】${calendarData.kanshi.day.kanshi}（五行: ${calendarData.gogyo.name}）`);
    
    // 九星
    lines.push(`【九星】${calendarData.kyusei.day.name}`);
    
    // 吉凶日
    if (calendarData.kichikuDays.length > 0) {
        const goodDays = calendarData.kichikuDays.filter(d => d.isGood).map(d => d.name);
        const badDays = calendarData.kichikuDays.filter(d => !d.isGood).map(d => d.name);
        if (goodDays.length > 0) {
            lines.push(`【吉日】${goodDays.join('、')}`);
        }
        if (badDays.length > 0) {
            lines.push(`【凶日】${badDays.join('、')}`);
        }
    }
    
    // 惑星逆行
    if (calendarData.retrograde && calendarData.retrograde.length > 0) {
        const planets = calendarData.retrograde.map(r => r.planet);
        lines.push(`【惑星逆行中】${planets.join('、')}`);
    }
    
    return lines.join('\n');
}

/**
 * 文章に使ってOKな吉凶日を取得
 */
function getDisplayableKichikuDays(kichikuDays) {
    const displayable = [
        '一粒万倍日', '天赦日', '甲子の日', '寅の日', '巳の日', '己巳の日', '大安'
    ];
    return kichikuDays.filter(d => displayable.includes(d.name));
}

/**
 * OpenAI APIにリクエストを送信
 * @param {string} prompt 
 * @param {string} apiKey 
 * @returns {Promise<string>}
 */
async function callOpenAI(prompt, apiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: `あなたは暦ロジックを人間に伝わるストーリー文章に変換する編集者です。

【あなたの役割】
Instagramストーリー用の「今日の開運アクション」の本文を作成すること。
アクション1行目は既に決まっているので、それに続く本文のみを作成する。

【絶対厳守ルール】
1. 「縁起が良いからやる」という説明は禁止。エネルギーの性質を翻訳して行動に落とすこと。
2. 十二直の名前（建の日、危の日など）は文章に使わない。
3. ネガティブな吉凶日（十死日、不成就日、仏滅）は文章に入れない。
4. 断定的な未来予測は避ける（「〜になります」→「〜しやすくなります」）。
5. 「静かに」など不自然な表現は避ける。
6. 投資・大きな出費を無条件で推奨しない。

【文章に使ってOKな吉凶日】
新月、満月、上弦、下弦、一粒万倍日、天赦日、甲子の日、寅の日、巳の日、大安

【文章スタイル】
- 親しみやすく、でも軽すぎない
- 絵文字は最後に1つだけ
- エネルギーの翻訳 → 因果接続 → ハードル下げ → 締め`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

/**
 * 開運アクションを生成
 * @param {Object} calendarData 暦情報
 * @param {string} apiKey OpenAI APIキー
 * @returns {Promise<Object>}
 */
export async function generateKaiunAction(calendarData, apiKey) {
    const shujiku = calendarData.shujiku;
    const gogyo = calendarData.gogyo;
    const gogyoActions = GOGYO_ACTIONS[gogyo.element];
    
    // 表示可能な吉凶日を取得
    const displayableDays = getDisplayableKichikuDays(calendarData.kichikuDays);
    
    // プロンプトを構築
    const prompt = `
以下の情報に基づいて、Instagram用ストーリー本文を作成してください。

=== アクション1行目（既に決定済み） ===
${shujiku.concreteAction}

=== 暦情報 ===
${summarizeCalendarData(calendarData)}

=== 判定フロー ===
${generateFlowText(shujiku)}

=== 主軸 ===
${shujiku.mainAxis}

=== 文章に使えるキーワード ===
${displayableDays.length > 0 ? displayableDays.map(d => d.name).join('、') : '特になし'}
${calendarData.moonPhase.isNewMoon ? `新月（${calendarData.moonPhase.zodiac}座）` : ''}
${calendarData.moonPhase.isFullMoon ? `満月（${calendarData.moonPhase.zodiac}座）` : ''}

=== 出力形式 ===
以下の形式で本文のみを出力してください（アクション1行目は含めない）。

[エネルギー翻訳 1行]
[因果接続 1〜2行]
[ハードル下げ or 選択肢]
[締め + 絵文字1つ]

例：
今日は寅の日。
動いた分だけ巡りが生まれます。
勢いが強いので大きく賭けず、
小さく始めるのが◎💰
`;

    try {
        const bodyText = await callOpenAI(prompt, apiKey);
        
        // Instagram用完成形を組み立て
        const instagramText = `${shujiku.icon} 今日の開運アクション
${shujiku.concreteAction}

${bodyText.trim()}`;
        
        return {
            // 判定ロジック要約
            calendarSummary: generateLogicSummary(calendarData, shujiku),
            
            // 抽象版アクション
            abstractAction: shujiku.abstractAction,
            
            // Instagram用完成形
            instagramText,
            
            // 裏ロジック
            flowText: generateFlowText(shujiku),
            
            // 詳細情報
            shujiku,
            calendarData
        };
        
    } catch (error) {
        console.error('OpenAI API Error:', error);
        
        // APIエラー時はローカルで簡易生成
        return generateFallbackAction(calendarData);
    }
}

/**
 * フォールバック用のローカル生成
 * @param {Object} calendarData 
 * @returns {Object}
 */
function generateFallbackAction(calendarData) {
    const shujiku = calendarData.shujiku;
    const gogyo = calendarData.gogyo;
    
    // 表示可能な吉凶日を取得
    const displayableDays = getDisplayableKichikuDays(calendarData.kichikuDays);
    
    // 本文を生成
    let bodyText = '';
    
    // 吉日がある場合
    if (displayableDays.length > 0) {
        const dayName = displayableDays[0].name;
        bodyText = `今日は${dayName}。\n${shujiku.mainAxis}のエネルギーが流れています。\n小さな一歩でOK、\n動いた分だけ流れが生まれます✨`;
    }
    // 新月の場合
    else if (calendarData.moonPhase.isNewMoon) {
        bodyText = `今日は${calendarData.moonPhase.zodiac}座の新月。\n種まきにぴったりのタイミング。\n完璧じゃなくてOK、\n書いた瞬間から動き始めます🌱`;
    }
    // 満月の場合
    else if (calendarData.moonPhase.isFullMoon) {
        bodyText = `今日は${calendarData.moonPhase.zodiac}座の満月。\n満ちたものを味わうタイミング。\n今あるものに感謝を向けると、\n流れが安定しやすくなります🌕`;
    }
    // 通常の場合
    else {
        bodyText = `今日は${shujiku.mainAxis}のエネルギー。\n${shujiku.details?.junichokuMeaning?.verb || '整える'}ことで\n流れが良くなりやすい日。\n小さな一歩でOK✨`;
    }
    
    // Instagram用完成形を組み立て
    const instagramText = `${shujiku.icon} 今日の開運アクション
${shujiku.concreteAction}

${bodyText}`;
    
    return {
        // 判定ロジック要約
        calendarSummary: generateLogicSummary(calendarData, shujiku),
        
        // 抽象版アクション
        abstractAction: shujiku.abstractAction,
        
        // Instagram用完成形
        instagramText,
        
        // 裏ロジック
        flowText: generateFlowText(shujiku),
        
        // 詳細情報
        shujiku,
        calendarData
    };
}
