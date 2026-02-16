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
    loadingOverlay: document.getElementById('loadingOverlay'),
    // 画像アップロード関連
    dropZone: document.getElementById('dropZone'),
    imageInput: document.getElementById('imageInput'),
    imagePreview: document.getElementById('imagePreview'),
    previewImg: document.getElementById('previewImg'),
    removeImage: document.getElementById('removeImage'),
    analyzeImageBtn: document.getElementById('analyzeImageBtn'),
    imageAnalysisStatus: document.getElementById('imageAnalysisStatus')
};

// ===== 状態管理 =====
let currentCalendarData = null;
let apiKey = localStorage.getItem('openai_api_key') || '';
let uploadedImageFile = null;
let recognizedCalendarData = null; // 画像認識で取得したデータ

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

// ===== 画像認識関連 =====

// 画像をBase64に変換
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// GPT-4o Vision APIで画像から暦情報を抽出
async function analyzeCalendarImage(imageFile) {
    const base64 = await fileToBase64(imageFile);
    
    const extractionPrompt = `この暦カレンダーのスクリーンショットから暦情報を読み取り、以下のJSON形式で正確に抽出してください。

必ず以下の形式でJSONのみを返してください（説明文は不要）：

{
  "date": "YYYY-MM-DD形式の日付",
  "kanshi": "干支（例：辛酉）",
  "gogyo": "五行（例：比和、相生、相剋）",
  "kyusei": "九星（例：四緑）",
  "rokuyo": "六曜（例：仏滅、大安）",
  "junichoku": "十二直（例：危、成、建）",
  "nijuhassyuku": "二十八宿（例：危、室）",
  "kichijitsu": ["吉日の配列（例：神吉日、大明日、月徳合日）"],
  "kyoujitsu": ["凶日の配列（例：八専、十死日、受死日）"]
}

画像に表示されている情報のみを抽出し、推測は行わないでください。`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{
                role: 'user',
                content: [
                    { type: 'text', text: extractionPrompt },
                    { 
                        type: 'image_url', 
                        image_url: { 
                            url: `data:image/${imageFile.type.split('/')[1]};base64,${base64}`,
                            detail: 'high'
                        }
                    }
                ]
            }],
            max_tokens: 1000
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || '画像認識に失敗しました');
    }

    const result = await response.json();
    const content = result.choices[0].message.content;
    
    // JSONを抽出（```json ... ```で囲まれている場合も対応）
    let jsonStr = content;
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
        jsonStr = jsonMatch[1];
    } else {
        // JSONブロックがない場合、{で始まる部分を探す
        const startIdx = content.indexOf('{');
        const endIdx = content.lastIndexOf('}');
        if (startIdx !== -1 && endIdx !== -1) {
            jsonStr = content.slice(startIdx, endIdx + 1);
        }
    }
    
    return JSON.parse(jsonStr);
}

// 認識結果を表示
function displayRecognizedData(data) {
    const statusEl = elements.imageAnalysisStatus;
    
    let html = '<div class="recognized-data">';
    html += '<div class="recognized-data-title">認識された暦情報</div>';
    html += '<div class="recognized-data-list">';
    html += `<div>日付: ${data.date || '不明'}</div>`;
    html += `<div>干支: ${data.kanshi || '不明'} | 五行: ${data.gogyo || '不明'}</div>`;
    html += `<div>九星: ${data.kyusei || '不明'} | 六曜: ${data.rokuyo || '不明'}</div>`;
    html += `<div>十二直: ${data.junichoku || '不明'} | 二十八宿: ${data.nijuhassyuku || '不明'}</div>`;
    if (data.kichijitsu && data.kichijitsu.length > 0) {
        html += `<div>吉日: ${data.kichijitsu.join('、')}</div>`;
    }
    if (data.kyoujitsu && data.kyoujitsu.length > 0) {
        html += `<div>凶日: ${data.kyoujitsu.join('、')}</div>`;
    }
    html += '</div></div>';
    
    statusEl.innerHTML = html;
    statusEl.className = 'analysis-status success';
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
        // 画像認識データがあれば優先して使用
        const result = await generateKaiunAction(currentCalendarData, apiKey, recognizedCalendarData);

        // 1. 暦情報（認識データがある場合はその旨を表示）
        let calendarSummaryText = result.calendarSummary;
        if (recognizedCalendarData) {
            calendarSummaryText = '【画像認識データを使用】\n' + calendarSummaryText;
        }
        elements.calendarOutput.textContent = calendarSummaryText;

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

// ===== 画像アップロード関連イベント =====

// ドラッグ&ドロップ
elements.dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.dropZone.classList.add('drag-over');
});

elements.dropZone.addEventListener('dragleave', () => {
    elements.dropZone.classList.remove('drag-over');
});

elements.dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.dropZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        handleImageSelect(files[0]);
    }
});

// ファイル選択
elements.imageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleImageSelect(e.target.files[0]);
    }
});

// 画像選択処理
function handleImageSelect(file) {
    uploadedImageFile = file;
    
    // プレビュー表示
    const reader = new FileReader();
    reader.onload = (e) => {
        elements.previewImg.src = e.target.result;
        elements.imagePreview.classList.remove('hidden');
        elements.dropZone.style.display = 'none';
        elements.analyzeImageBtn.disabled = !apiKey;
        elements.imageAnalysisStatus.innerHTML = '';
        recognizedCalendarData = null;
    };
    reader.readAsDataURL(file);
}

// 画像削除
elements.removeImage.addEventListener('click', () => {
    uploadedImageFile = null;
    recognizedCalendarData = null;
    elements.previewImg.src = '';
    elements.imagePreview.classList.add('hidden');
    elements.dropZone.style.display = 'block';
    elements.analyzeImageBtn.disabled = true;
    elements.imageAnalysisStatus.innerHTML = '';
    elements.imageInput.value = '';
});

// 画像解析ボタン
elements.analyzeImageBtn.addEventListener('click', async () => {
    if (!uploadedImageFile || !apiKey) {
        showNotification('画像とAPIキーを設定してください');
        return;
    }
    
    elements.analyzeImageBtn.disabled = true;
    elements.imageAnalysisStatus.innerHTML = '暦情報を認識中...';
    elements.imageAnalysisStatus.className = 'analysis-status loading';
    
    try {
        recognizedCalendarData = await analyzeCalendarImage(uploadedImageFile);
        displayRecognizedData(recognizedCalendarData);
        showNotification('暦情報を認識しました。この情報で開運アクションを生成します。');
    } catch (error) {
        console.error('Image analysis error:', error);
        elements.imageAnalysisStatus.innerHTML = 'エラー: ' + error.message;
        elements.imageAnalysisStatus.className = 'analysis-status error';
        recognizedCalendarData = null;
    } finally {
        elements.analyzeImageBtn.disabled = false;
    }
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
