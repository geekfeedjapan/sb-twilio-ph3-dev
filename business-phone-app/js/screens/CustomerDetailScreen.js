// 顧客詳細画面
function renderCustomerDetailScreen(customer) {
  const riskColors = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };
  const riskLabels = { high: '高リスク', medium: '中リスク', low: '低リスク' };

  // 日時フォーマット用ヘルパー
  const formatDateTime = (isoString) => {
    const d = new Date(isoString);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${mm}/${dd} ${hh}:${mi}`;
  };

  // 顧客に関連する活動履歴を取得
  const customerActivities = mockActivities
    .filter(a => a.customerId === customer.id)
    .map(a => ({
      id: a.id,
      type: 'call',
      sortTime: a.createdAt,
      time: formatDateTime(a.createdAt),
      content: a.note,
      duration: a.duration,
      recordingUrl: a.recordingUrl,
      hasTranscription: true
    }));

  // 通話履歴からも取得
  const customerCalls = mockCallHistory
    .filter(c => c.name === customer.name)
    .map(c => ({
      id: c.id,
      type: 'call',
      sortTime: `${c.date}T${c.time}:00`,
      time: `${c.date} ${c.time}`,
      content: c.type === 'incoming' ? '着信' : c.type === 'outgoing' ? '発信' : '不在着信',
      duration: c.duration,
      recordingUrl: c.recordingUrl,
      hasTranscription: c.hasTranscription,
      callData: c
    }));

  // SMS/LINEメッセージ履歴を取得
  const channelLabels = { line: 'LINE', sms: 'SMS' };
  const directionLabels = { sent: '送信', received: '受信' };
  const customerMessages = (typeof mockMessageHistory !== 'undefined' ? mockMessageHistory : [])
    .filter(m => m.customerId === customer.id)
    .map(m => ({
      id: `msg-${m.id}`,
      type: m.channel,
      channel: channelLabels[m.channel] || m.channel,
      sortTime: m.createdAt,
      time: formatDateTime(m.createdAt),
      content: `【${directionLabels[m.direction]}】${m.message}`,
      direction: m.direction,
      messageData: m
    }));

  // 重複を避けて統合し、日時順にソート
  const timeline = [...customerActivities, ...customerCalls, ...customerMessages]
    .sort((a, b) => new Date(b.sortTime) - new Date(a.sortTime))
    .slice(0, 15); // 最新15件

  return `
    <div class="screen customer-detail-screen">
      <header class="screen-header with-back">
        <button class="back-btn" onclick="goBack()">${getIcon('ChevronLeft')}</button>
        <h1>顧客詳細</h1>
        <button class="icon-btn">${getIcon('MoreVertical')}</button>
      </header>

      <div class="screen-content">
        <div class="profile-card">
          <div class="profile-avatar">${customer.name[0]}</div>
          <div class="profile-info">
            <h2>${customer.name}</h2>
            <p>${customer.company}</p>
            <div class="profile-badges">
              ${customer.verified ? `<span class="badge verified">${getIcon('Shield')} 本人確認済</span>` : ''}
              <span class="badge risk" style="background: ${riskColors[customer.riskLevel]}">
                ${riskLabels[customer.riskLevel]}
              </span>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="action-btn call" onclick="navigate('dial', { customer: mockCustomers.find(c => c.id === ${customer.id}) })">
            ${getIcon('Phone')}
            <span>電話</span>
          </button>
          <button class="action-btn message" onclick="navigate('messaging', { customer: mockCustomers.find(c => c.id === ${customer.id}) })">
            ${getIcon('MessageCircle')}
            <span>メッセージ</span>
          </button>
          <button class="action-btn activity" onclick="addActivityForCustomer(${customer.id})">
            ${getIcon('FileText')}
            <span>活動登録</span>
          </button>
        </div>

        <section class="section">
          <h3 class="section-title">基本情報</h3>
          <div class="info-list">
            <div class="info-row">
              <span class="info-label">電話番号</span>
              <span class="info-value">${customer.phone}</span>
            </div>
            <div class="info-row">
              <span class="info-label">商談金額</span>
              <span class="info-value">${customer.amount}</span>
            </div>
            <div class="info-row">
              <span class="info-label">最終コンタクト</span>
              <span class="info-value">${customer.lastContact}</span>
            </div>
          </div>
        </section>

        <section class="section">
          <h3 class="section-title">${getIcon('Sparkles')} AI推奨アクション</h3>
          <div class="ai-recommendation">
            <p>前回の商談から3日経過しています。フォローアップの電話をお勧めします。</p>
            <button class="ai-action-btn" onclick="navigate('dial', { customer: mockCustomers.find(c => c.id === ${customer.id}) })">
              今すぐ電話する
            </button>
          </div>
        </section>

        <section class="section">
          <h3 class="section-title">${getIcon('Clock')} 対応履歴</h3>
          <div class="timeline">
            ${timeline.length > 0 ? timeline.map(item => `
              <div class="timeline-item ${item.type}">
                <div class="timeline-icon">
                  ${item.type === 'call' ? getIcon('Phone') : item.type === 'sms' ? getIcon('Smartphone') : getIcon('MessageCircle')}
                </div>
                <div class="timeline-content">
                  <span class="timeline-time">${item.time}</span>
                  <p class="timeline-text">${item.content}</p>
                  ${item.duration ? `<span class="timeline-duration">${getIcon('Clock')} ${item.duration}</span>` : ''}
                  ${item.channel ? `<span class="timeline-channel">${item.channel}</span>` : ''}

                  ${item.recordingUrl || item.hasTranscription ? `
                    <div class="timeline-actions">
                      ${item.recordingUrl ? `
                        <a href="${item.recordingUrl}" target="_blank" class="timeline-action-btn recording" onclick="event.stopPropagation()">
                          ${getIcon('Play')} 録音
                        </a>
                      ` : ''}
                      ${item.hasTranscription && item.callData ? `
                        <button class="timeline-action-btn transcript" onclick="showCallTranscript(${item.callData.id})">
                          ${getIcon('FileText')} 文字起こし
                        </button>
                      ` : ''}
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('') : `
              <div class="timeline-empty">
                <p>対応履歴がありません</p>
              </div>
            `}
          </div>
        </section>
      </div>
    </div>
  `;
}

// 顧客詳細画面から活動登録画面へ遷移
function addActivityForCustomer(customerId) {
  const customer = mockCustomers.find(c => c.id === customerId);
  if (customer) {
    navigate('activity-registration', {
      customer: customer,
      duration: null,
      transcription: null,
      recordingUrl: null
    });
  }
}
