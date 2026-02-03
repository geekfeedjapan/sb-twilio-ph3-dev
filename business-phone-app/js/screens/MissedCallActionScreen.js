// 不在着信アクション画面（AI提案）
function renderMissedCallActionScreen(call, customer) {
  // 顧客情報に基づいたAI提案を生成
  const aiSuggestions = getMissedCallAISuggestions(call, customer);

  return `
    <div class="screen missed-call-action-screen">
      <header class="screen-header with-back">
        <button class="back-btn" onclick="goBack()">${getIcon('ChevronLeft')}</button>
        <h1>不在着信対応</h1>
        <div></div>
      </header>

      <div class="screen-content">
        <div class="missed-call-detail-card">
          <div class="missed-call-detail-avatar">${call.name[0]}</div>
          <div class="missed-call-detail-info">
            <h2>${call.name}</h2>
            <p>${call.company}</p>
            <div class="missed-call-detail-meta">
              ${getIcon('PhoneMissed')}
              <span>${call.date} ${call.time} 不在着信</span>
            </div>
          </div>
        </div>

        ${customer ? `
          <div class="missed-call-customer-summary">
            <div class="customer-summary-row">
              <span class="customer-summary-label">商談金額</span>
              <span class="customer-summary-value">${customer.amount}</span>
            </div>
            <div class="customer-summary-row">
              <span class="customer-summary-label">最終コンタクト</span>
              <span class="customer-summary-value">${customer.lastContact}</span>
            </div>
            <div class="customer-summary-row">
              <span class="customer-summary-label">ステータス</span>
              <span class="customer-summary-value status-${customer.status}">${customer.status === 'hot' ? 'ホット' : customer.status === 'warm' ? 'ウォーム' : 'コールド'}</span>
            </div>
          </div>
        ` : ''}

        <div class="ai-suggest-section">
          <div class="ai-suggest-header">
            ${getIcon('Sparkles')}
            <h3>AIおすすめアクション</h3>
          </div>
          <p class="ai-suggest-reason">${aiSuggestions.reason}</p>

          <div class="ai-action-cards">
            ${aiSuggestions.actions.map((action, index) => `
              <div class="ai-action-card ${index === 0 ? 'recommended' : ''}" onclick="${action.onclick}">
                <div class="ai-action-card-header">
                  <div class="ai-action-icon ${action.type}">${action.icon}</div>
                  <div class="ai-action-info">
                    <span class="ai-action-title">${action.title}</span>
                    <span class="ai-action-desc">${action.description}</span>
                  </div>
                  ${index === 0 ? '<span class="ai-recommend-badge">おすすめ</span>' : ''}
                </div>
                ${action.preview ? `
                  <div class="ai-action-preview">
                    <span class="preview-label">提案メッセージ:</span>
                    <p>${action.preview}</p>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <div class="missed-call-other-actions">
          <button class="secondary-btn" onclick="navigate('customer-detail', { customer: mockCustomers.find(c => c.name === '${call.name}') })">
            ${getIcon('Users')} 顧客詳細を見る
          </button>
        </div>
      </div>
    </div>
  `;
}

// 不在着信に対するAI提案を生成
function getMissedCallAISuggestions(call, customer) {
  const customerName = call.name;
  const isHot = customer && customer.status === 'hot';
  const isHighRisk = customer && customer.riskLevel === 'high';

  // 顧客ステータスに応じた提案理由
  let reason;
  if (isHot && isHighRisk) {
    reason = `${customerName}様はホット案件かつ高リスクの顧客です。早急に折り返し対応することで、案件の進展と信頼回復が期待できます。`;
  } else if (isHot) {
    reason = `${customerName}様はホット案件の顧客です。商談の重要な局面にあるため、速やかな折り返しをお勧めします。`;
  } else if (isHighRisk) {
    reason = `${customerName}様は高リスク顧客です。不在着信への迅速な対応が信頼維持に重要です。まず折り返し、難しい場合はメッセージでの連絡をお勧めします。`;
  } else {
    reason = `${customerName}様からの不在着信です。状況に応じて最適な対応方法をお選びください。`;
  }

  const actions = [
    {
      type: 'call',
      icon: getIcon('Phone'),
      title: '折り返し電話',
      description: isHot ? '最優先で対応してください' : '直接お話しすることで迅速に対応できます',
      preview: null,
      onclick: `navigate('dial', { customer: mockCustomers.find(c => c.name === '${customerName}') })`
    },
    {
      type: 'sms',
      icon: getIcon('Smartphone'),
      title: 'SMSを送信',
      description: '電話が難しい場合の代替手段',
      preview: `${customerName}様、先ほどはお電話に出られず失礼いたしました。ご都合のよいお時間にお知らせいただければ、改めてご連絡いたします。`,
      onclick: `executeMissedCallAction('sms', '${customerName}')`
    },
    {
      type: 'line',
      icon: getIcon('MessageCircle'),
      title: 'LINEを送信',
      description: 'カジュアルに素早く連絡',
      preview: `${customerName}様、お電話いただきありがとうございます。お手すきの際にお返事いただけますと幸いです。`,
      onclick: `executeMissedCallAction('line', '${customerName}')`
    }
  ];

  return { reason, actions };
}

// 不在着信アクション実行（SMS/LINE送信の確認）
function executeMissedCallAction(channel, customerName) {
  const channelLabel = channel === 'sms' ? 'SMS' : 'LINE';
  const customer = mockCustomers.find(c => c.name === customerName);

  if (confirm(`${customerName}様に${channelLabel}でメッセージを送信しますか？`)) {
    alert(`${channelLabel}メッセージを送信しました。`);
    if (customer) {
      navigate('messaging', { customer: customer });
    } else {
      goBack();
    }
  }
}
