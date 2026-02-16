// ===== 開運アクション生成ツール v2.1 - メインアプリケーション =====

// モジュールのインポート
import { getMoonPhase } from './calendar/moon-phase.js';
import { getKanshi, getGogyoFromKan } from './calendar/kanshi.js';
import { getKyusei } from './calendar/kyusei.js';
import { getJunichoku } from './calendar/junichoku.js';
import { getNijuhassyuku } from './calendar/nijuhassyuku.js';
import { getKichikuDays, getRokuyo } from './calendar/kichiku-days.js';
import { getRetrograde } from './calendar/retrograde.js';
import { determineShujiku } from './logic/shujiku.js';
import { generateKaiunAction } from './ai/generator.js';

// ===== DOM要素の取得 =====
const elements = {
    dateInput: document.getElementById('dateInput'),
    todayBtn: document.getElementById('todayBtn'),
    eventsDisplay: document.getElementById('eventsDisplay'),
    apiKeyInput: document.getElementById('apiKeyInput'),
    toggleApiKey: document.getElementById('toggleApiKey'),
    saveApiKey: document.getElementById('saveApiKey'),
    apiStatus: document.getElementById('apiStatus'),
    generateBtn: document.getElementById('generateBtn'),
    // 新しい出力エリア
    calendarOutput: document.getElementById('calendarOutput'),
    abstractOutput: document.getElementById('abstractOutput'),
    instagramOutput: document.getElementById('instagramOutput'),
    logicOutput: document.getElementById('logicOutput'),
    copyInstagramBtn: document.getElementById('copyInstagramBtn'),
    copyLogicBtn: document.getElementById('copyLogicBtn'),
    notification: document.getElementById('notification'),
    notificationText: document.getElementById('notificationText'),
    loadingOverlay: document.getElementById('loadingOverlay')
};

// ===== 状態管理 =====
let currentCalendarData = null;
let apiKey = localStorage.getItem('openai_api_key') || '';

// ===== ユーティリティ関数 =====
function showNotification(message) {
    elements.notificationText.textContent = message;
    elements.notification.classList.remove('hidden');
    elements.notification.classList.add('show');
    setTimeout(() => {
        elements.notification.classList.remove('show');
        setTimeout(() => {
            elements.notification.classList.add('hidden');
        }, 300);
    }, 3000);
}

function showLoading() {
    elements.loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    elements.loadingOverlay.classList.add('hidden');
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// ===== 暦情報の取得と表示 =====
function getCalendarData(date) {
    const moonPhase = getMoonPhase(date);
    const kanshi = getKanshi(date);
    const kyusei = getKyusei(date);
    const junichoku = getJunichoku(date);
    const nijuhassyuku = getNijuhassyuku(date);
    const kichikuDays = getKichikuDays(date);
    const rokuyo = getRokuyo(date);
    const retrograde = getRetrograde(date);
    const gogyo = getGogyoFromKan(kanshi.day.kan);

    // 主軸判定（新しい6ステップフロー）
    const shujiku = determineShujiku({
        moonPhase,
        junichoku,
        kichikuDays,
        gogyo,
        kyusei,
        rokuyo
    });

    return {
        date,
        moonPhase,
        kanshi,
        kyusei,
        junichoku,
        nijuhassyuku,
        kichikuDays,
        rokuyo,
        retrograde,
        gogyo,
        shujiku
    };
}

function renderCalendarData(data) {
    if (!data) {
        elements.eventsDisplay.innerHTML = '<p class="placeholder-text">日付を選択すると暦情報が表示されます</p>';
        return;
    }

    let html = '<div class="event-list">';

    // 月相
    const moonClass = data.moonPhase.isNewMoon || data.moonPhase.isFullMoon ? 'highlight' : '';
    html += `
        <div class="event-item ${moonClass}">
            <span class="event-icon">${data.moonPhase.isNewMoon ? '🌑' : data.moonPhase.isFullMoon ? '🌕' : data.moonPhase.icon}</span>
            <div class="event-content">
                <div class="event-label">月相</div>
                <div class="event-value">${data.moonPhase.name}</div>
                ${data.moonPhase.zodiac ? `<div class="event-detail">${data.moonPhase.zodiac}座</div>` : ''}
            </div>
        </div>
    `;

    // 干支
    html += `
        <div class="event-item">
            <span class="event-icon">📅</span>
            <div class="event-content">
                <div class="event-label">日干支</div>
                <div class="event-value">${data.kanshi.day.kanshi}</div>
                <div class="event-detail">五行: ${data.gogyo.name}（${data.gogyo.element}）</div>
            </div>
        </div>
    `;

    // 九星
    html += `
        <div class="event-item">
            <span class="event-icon">⭐</span>
            <div class="event-content">
                <div class="event-label">日の九星</div>
                <div class="event-value">${data.kyusei.day.name}</div>
            </div>
        </div>
    `;

    // 十二直
    const junichokuClass = data.junichoku.isGood ? 'highlight' : data.junichoku.isBad ? 'warning' : '';
    html += `
        <div class="event-item ${junichokuClass}">
            <span class="event-icon">🔮</span>
            <div class="event-content">
                <div class="event-label">十二直</div>
                <div class="event-value">${data.junichoku.name}</div>
                <div class="event-detail">${data.junichoku.meaning}</div>
            </div>
        </div>
    `;

    // 二十八宿
    html += `
        <div class="event-item">
            <span class="event-icon">✨</span>
            <div class="event-content">
                <div class="event-label">二十八宿</div>
                <div class="event-value">${data.nijuhassyuku.name}</div>
                <div class="event-detail">${data.nijuhassyuku.meaning}</div>
            </div>
        </div>
    `;

    // 六曜
    html += `
        <div class="event-item">
            <span class="event-icon">📆</span>
            <div class="event-content">
                <div class="event-label">六曜</div>
                <div class="event-value">${data.rokuyo.name}</div>
            </div>
        </div>
    `;

    // 吉凶日
    if (data.kichikuDays.length > 0) {
        const goodDays = data.kichikuDays.filter(d => d.isGood);
        const badDays = data.kichikuDays.filter(d => !d.isGood);

        if (goodDays.length > 0) {
            html += `
                <div class="event-item highlight">
                    <span class="event-icon">🎯</span>
                    <div class="event-content">
                        <div class="event-label">吉日</div>
                        <div class="event-value">${goodDays.map(d => d.name).join('、')}</div>
                    </div>
                </div>
            `;
        }

        if (badDays.length > 0) {
            html += `
                <div class="event-item warning">
                    <span class="event-icon">⚠️</span>
                    <div class="event-content">
                        <div class="event-label">凶日</div>
                        <div class="event-value">${badDays.map(d => d.name).join('、')}</div>
                    </div>
                </div>
            `;
        }
    }

    // 惑星逆行
    if (data.retrograde.length > 0) {
        html += `
            <div class="event-item warning">
                <span class="event-icon">🪐</span>
                <div class="event-content">
                    <div class="event-label">惑星逆行中</div>
                    <div class="event-value">${data.retrograde.map(r => r.planet).join('、')}</div>
                </div>
            </div>
        `;
    }

    html += '</div>';

    // 主軸表示（新しいフォーマット）
    html += `
        <div class="shujiku-display">
            <div class="shujiku-label">今日の主軸</div>
            <div class="shujiku-value">${data.shujiku.icon} ${data.shujiku.mainAxis}</div>
            ${data.shujiku.hasConflict ? `<div class="shujiku-direction">⚠ 矛盾調整あり</div>` : ''}
        </div>
    `;

    elements.eventsDisplay.innerHTML = html;
}

// ===== 開運アクション生成 =====
async function generateAction() {
    if (!currentCalendarData) {
        showNotification('日付を選択してください');
        return;
    }

    if (!apiKey) {
        showNotification('APIキーを設定してください');
        return;
    }

    showLoading();

    try {
        const result = await generateKaiunAction(currentCalendarData, apiKey);

        // 1. 暦情報
        elements.calendarOutput.textContent = result.calendarSummary;

        // 2. 抽象版アクション
        elements.abstractOutput.innerHTML = `<p>${result.abstractAction}</p>`;

        // 3. Instagram用ストーリー文章
        elements.instagramOutput.value = result.instagramText;

        // 4. 裏ロジック解説
        elements.logicOutput.value = result.flowText;

        // コピーボタンを有効化
        elements.copyInstagramBtn.disabled = false;
        elements.copyLogicBtn.disabled = false;

        showNotification('開運アクションを生成しました');
    } catch (error) {
        console.error('Generation error:', error);
        showNotification('生成に失敗しました: ' + error.message);
    } finally {
        hideLoading();
    }
}

// ===== イベントリスナー =====
// 日付選択
elements.dateInput.addEventListener('change', (e) => {
    const selectedDate = new Date(e.target.value + 'T00:00:00');
    currentCalendarData = getCalendarData(selectedDate);
    renderCalendarData(currentCalendarData);
    updateGenerateButton();
});

// 今日ボタン
elements.todayBtn.addEventListener('click', () => {
    const today = new Date();
    elements.dateInput.value = formatDate(today);
    currentCalendarData = getCalendarData(today);
    renderCalendarData(currentCalendarData);
    updateGenerateButton();
});

// APIキー表示切替
elements.toggleApiKey.addEventListener('click', () => {
    const input = elements.apiKeyInput;
    input.type = input.type === 'password' ? 'text' : 'password';
});

// APIキー保存
elements.saveApiKey.addEventListener('click', () => {
    const key = elements.apiKeyInput.value.trim();
    if (key && key.startsWith('sk-')) {
        apiKey = key;
        localStorage.setItem('openai_api_key', key);
        elements.apiStatus.textContent = 'APIキーを保存しました';
        elements.apiStatus.className = 'api-status success';
        updateGenerateButton();
    } else {
        elements.apiStatus.textContent = '有効なAPIキーを入力してください';
        elements.apiStatus.className = 'api-status error';
    }
});

// 生成ボタン
elements.generateBtn.addEventListener('click', generateAction);

// コピーボタン
elements.copyInstagramBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(elements.instagramOutput.value).then(() => {
        showNotification('Instagram用文章をコピーしました');
    });
});

elements.copyLogicBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(elements.logicOutput.value).then(() => {
        showNotification('裏ロジック解説をコピーしました');
    });
});

// 生成ボタンの状態更新
function updateGenerateButton() {
    elements.generateBtn.disabled = !currentCalendarData || !apiKey;
}

// ===== 初期化 =====
function init() {
    try {
        // 保存されたAPIキーがあれば表示
        if (apiKey) {
            elements.apiKeyInput.value = apiKey;
            elements.apiStatus.textContent = 'APIキーが設定されています';
            elements.apiStatus.className = 'api-status success';
        }

        // 今日の日付をデフォルトに
        const today = new Date();
        elements.dateInput.value = formatDate(today);
        currentCalendarData = getCalendarData(today);
        renderCalendarData(currentCalendarData);
        updateGenerateButton();
    } catch (error) {
        console.error('初期化エラー:', error);
    }
}

// DOMが読み込まれてから初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
