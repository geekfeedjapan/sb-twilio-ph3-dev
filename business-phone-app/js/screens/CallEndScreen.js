// 通話終了画面
function renderCallEndScreen(customer, duration) {
  // デモ用のAI文字起こしデータ
  const transcription = {
    summary: '商品説明を実施。価格面での検討を希望。来週までに見積書送付予定。次回は決裁者同席での打ち合わせを提案。',
    fullText: [
      { speaker: 'agent', text: 'お世話になっております。株式会社〇〇の田中です。先日ご依頼いただいた商品についてご説明させていただきたくお電話いたしました。' },
      { speaker: 'customer', text: 'ありがとうございます。ちょうど検討を進めていたところでした。' },
      { speaker: 'agent', text: '弊社のサービスは月額5万円からご利用いただけまして、初期費用は現在キャンペーンで無料となっております。' },
      { speaker: 'customer', text: 'なるほど。価格面は社内で検討が必要ですね。見積書をいただけますか？' },
      { speaker: 'agent', text: 'かしこまりました。来週中にお送りいたします。ご検討のほど、よろしくお願いいたします。' },
      { speaker: 'customer', text: '次回は上司も同席させたいので、打ち合わせの日程も調整させてください。' },
    ],
    keywords: ['価格検討', '見積書', '来週フォロー', '決裁者同席'],
    nextAction: 'フォローアップ電話（1週間後）',
  };

  // YouWire録音URL（デモ用）
  const recordingUrl = `https://softbank.youwire.jp/recording/${Date.now()}`;

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

        <div class="recording-link-card">
          <a href="${recordingUrl}" target="_blank" class="recording-play-link">
            ${getIcon('Play')} YouWireで録音を再生
          </a>
        </div>

        <div class="ai-summary-card">
          <h3>${getIcon('Sparkles')} AI文字起こし要約</h3>
          <p class="summary-text">${transcription.summary}</p>

          <div class="summary-keywords">
            <span class="keywords-label">キーワード</span>
            <div class="keywords-list">
              ${transcription.keywords.map(kw => `
                <span class="keyword-tag">${kw}</span>
              `).join('')}
            </div>
          </div>

          <div class="next-action">
            <span class="next-label">推奨アクション</span>
            <p>${transcription.nextAction}</p>
          </div>
        </div>

        <div class="end-actions">
          <button class="primary-btn" onclick="goToActivityRegistration()">
            ${getIcon('FileText')} 活動を登録
          </button>
          <button class="secondary-btn" onclick="callEndDone()">
            スキップ
          </button>
        </div>
      </div>
    </div>
  `;
}

function goToActivityRegistration() {
  const currentScreen = getCurrentScreen();

  // 文字起こしデータを生成（デモ用）
  const transcription = {
    summary: '商品説明を実施。価格面での検討を希望。来週までに見積書送付予定。次回は決裁者同席での打ち合わせを提案。',
    fullText: [
      { speaker: 'agent', text: 'お世話になっております。株式会社〇〇の田中です。先日ご依頼いただいた商品についてご説明させていただきたくお電話いたしました。' },
      { speaker: 'customer', text: 'ありがとうございます。ちょうど検討を進めていたところでした。' },
      { speaker: 'agent', text: '弊社のサービスは月額5万円からご利用いただけまして、初期費用は現在キャンペーンで無料となっております。' },
      { speaker: 'customer', text: 'なるほど。価格面は社内で検討が必要ですね。見積書をいただけますか？' },
      { speaker: 'agent', text: 'かしこまりました。来週中にお送りいたします。ご検討のほど、よろしくお願いいたします。' },
      { speaker: 'customer', text: '次回は上司も同席させたいので、打ち合わせの日程も調整させてください。' },
    ]
  };
  const recordingUrl = `https://softbank.youwire.jp/recording/${Date.now()}`;

  // 活動登録画面に遷移
  AppState.screenStack.pop();
  navigate('activity-registration', {
    customer: currentScreen.customer,
    duration: currentScreen.duration,
    transcription: transcription,
    recordingUrl: recordingUrl
  });
}

