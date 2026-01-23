// 顧客詳細画面
function renderCustomerDetailScreen(customer) {
  const riskColors = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };
  const riskLabels = { high: '高リスク', medium: '中リスク', low: '低リスク' };

  const timeline = [
    { type: 'call', time: '2025-01-20 10:30', content: '商品説明の電話', duration: '15:32' },
    { type: 'line', time: '2025-01-18 14:00', content: '見積書送付', channel: 'LINE' },
    { type: 'call', time: '2025-01-15 09:00', content: '初回ヒアリング', duration: '25:10' },
    { type: 'sms', time: '2025-01-10 11:30', content: 'アポイント確認SMS', channel: 'SMS' },
  ];

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
          <button class="action-btn email">
            ${getIcon('Mail')}
            <span>メール</span>
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
            ${timeline.map(item => `
              <div class="timeline-item ${item.type}">
                <div class="timeline-icon">
                  ${item.type === 'call' ? getIcon('Phone') : getIcon('MessageCircle')}
                </div>
                <div class="timeline-content">
                  <span class="timeline-time">${item.time}</span>
                  <p class="timeline-text">${item.content}</p>
                  ${item.duration ? `<span class="timeline-duration">${item.duration}</span>` : ''}
                  ${item.channel ? `<span class="timeline-channel">${item.channel}</span>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    </div>
  `;
}
