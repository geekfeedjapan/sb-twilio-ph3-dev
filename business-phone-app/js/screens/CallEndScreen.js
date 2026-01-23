// 通話終了画面
function renderCallEndScreen(customer, duration) {
  const aiSummary = {
    summary: '商品説明を実施。価格面での検討を希望。来週までに見積書送付予定。',
    keywords: ['価格検討', '見積書', '来週フォロー'],
    nextAction: 'フォローアップ電話（1週間後）',
  };

  return `
    <div class="screen call-end-screen">
      <header class="screen-header">
        <h1>通話終了</h1>
      </header>

      <div class="screen-content">
        <div class="end-profile">
          <div class="end-avatar">${customer?.name?.[0] || '?'}</div>
          <h2>${customer?.name || '通話先'}</h2>
          ${customer?.company ? `<p>${customer.company}</p>` : ''}
          <span class="end-duration">${duration || '00:00'}</span>
        </div>

        <div class="ai-summary-card">
          <h3>${getIcon('Sparkles')} AI通話要約</h3>
          <p class="summary-text">${aiSummary.summary}</p>

          <div class="summary-keywords">
            <span class="keywords-label">キーワード</span>
            <div class="keywords-list">
              ${aiSummary.keywords.map(kw => `
                <span class="keyword-tag">${kw}</span>
              `).join('')}
            </div>
          </div>

          <div class="next-action">
            <span class="next-label">推奨アクション</span>
            <p>${aiSummary.nextAction}</p>
          </div>
        </div>

        <div class="end-actions">
          <button class="secondary-btn">
            ${getIcon('Calendar')}
            フォロー予定を登録
          </button>
          <button class="secondary-btn">
            ${getIcon('FileText')}
            詳細を編集
          </button>
          <button class="primary-btn" onclick="callEndDone()">
            完了
          </button>
        </div>
      </div>
    </div>
  `;
}
