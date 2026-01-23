// 通話中画面
let isMuted = false;
let isSpeaker = false;

function renderCallScreen(customer, phone) {
  const aiSuggestions = [
    '契約更新の提案タイミングです',
    '前回の課題をフォローアップ',
    'アップセル商品のご案内',
  ];

  return `
    <div class="screen call-screen">
      <div class="call-content">
        <span class="call-status">通話中</span>
        <span class="call-duration" id="call-duration">00:00</span>

        <div class="call-avatar">${customer?.name?.[0] || phone?.[0] || '?'}</div>
        <h2>${customer?.name || phone || '通話先'}</h2>
        ${customer?.company ? `<p>${customer.company}</p>` : ''}

        <div class="ai-assist-panel">
          <div class="ai-assist-header">
            ${getIcon('Sparkles')}
            <span>AI Live Assist</span>
          </div>
          <div class="ai-suggestions">
            ${aiSuggestions.map(suggestion => `
              <div class="ai-suggestion">
                ${getIcon('Zap')}
                <span>${suggestion}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="call-controls">
          <button class="control-btn ${isMuted ? 'active' : ''}" onclick="toggleMute()">
            ${isMuted ? getIcon('MicOff') : getIcon('Mic')}
            <span>ミュート</span>
          </button>
          <button class="control-btn ${isSpeaker ? 'active' : ''}" onclick="toggleSpeaker()">
            ${getIcon('Volume2')}
            <span>スピーカー</span>
          </button>
        </div>

        <button class="end-call-btn" onclick="endCall()">
          ${getIcon('PhoneOff')}
        </button>
      </div>
    </div>
  `;
}

function toggleMute() {
  isMuted = !isMuted;
  render();
}

function toggleSpeaker() {
  isSpeaker = !isSpeaker;
  render();
}
