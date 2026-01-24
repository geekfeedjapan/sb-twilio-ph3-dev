// 通話詳細画面
function renderCallDetailScreen(call) {
  // デモ用の文字起こしデータ
  const transcription = {
    summary: '商品説明を実施。価格面での検討を希望。来週までに見積書送付予定。',
    fullText: [
      { speaker: 'agent', text: 'お世話になっております。株式会社〇〇の田中です。' },
      { speaker: 'customer', text: 'ありがとうございます。お待ちしておりました。' },
      { speaker: 'agent', text: '本日は先日ご依頼いただいた商品について、詳しくご説明させていただければと思います。' },
      { speaker: 'customer', text: 'はい、ぜひお願いします。' },
      { speaker: 'agent', text: '弊社のサービスは月額5万円からご利用いただけます。初期費用は現在キャンペーンで無料です。' },
      { speaker: 'customer', text: 'なるほど。価格面は社内で検討させてください。見積書をいただけますか？' },
      { speaker: 'agent', text: 'かしこまりました。来週中にお送りいたします。' },
    ]
  };

  // 関連する活動を取得
  const relatedActivity = mockActivities.find(a =>
    a.customerName === call.name && a.recordingUrl === call.recordingUrl
  );

  return `
    <div class="screen call-detail-screen">
      <header class="screen-header with-back">
        <button class="back-btn" onclick="goBack()">${getIcon('ChevronLeft')}</button>
        <h1>通話詳細</h1>
        <div></div>
      </header>

      <div class="screen-content">
        <div class="call-detail-header">
          <div class="call-detail-avatar">${call.name[0]}</div>
          <div class="call-detail-info">
            <h2>${call.name}</h2>
            <p>${call.company || '不明'}</p>
          </div>
        </div>

        <div class="call-detail-meta">
          <div class="meta-item">
            <span class="meta-label">日時</span>
            <span class="meta-value">${call.date} ${call.time}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">通話時間</span>
            <span class="meta-value">${call.duration}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">種別</span>
            <span class="meta-value">
              ${call.type === 'incoming' ? '着信' : call.type === 'outgoing' ? '発信' : '不在着信'}
            </span>
          </div>
        </div>

        ${call.recordingUrl ? `
          <div class="call-detail-section">
            <h3>${getIcon('Play')} 通話録音</h3>
            <a href="${call.recordingUrl}" target="_blank" class="recording-play-btn">
              ${getIcon('ExternalLink')} YouWireで録音を再生
            </a>
          </div>
        ` : ''}

        ${call.hasTranscription ? `
          <div class="call-detail-section">
            <h3>${getIcon('Sparkles')} AI文字起こし</h3>
            <div class="transcription-summary-box">
              <strong>要約</strong>
              <p>${transcription.summary}</p>
            </div>

            <div class="transcription-full-box">
              <strong>会話内容</strong>
              <div class="transcript-lines">
                ${transcription.fullText.map(line => `
                  <div class="transcript-line ${line.speaker}">
                    <span class="speaker-badge">${line.speaker === 'agent' ? '担当者' : '顧客'}</span>
                    <p>${line.text}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        ` : ''}

        ${relatedActivity ? `
          <div class="call-detail-section">
            <h3>${getIcon('FileText')} 活動記録</h3>
            <div class="activity-record-box">
              <div class="activity-result">
                <span class="result-label">結果:</span>
                <span class="result-value">${getResultLabel(relatedActivity.result)}</span>
              </div>
              <div class="activity-note-display">
                <span class="note-label">メモ:</span>
                <p>${relatedActivity.note}</p>
              </div>
              ${relatedActivity.nextAction ? `
                <div class="activity-next">
                  <span class="next-label">次のアクション:</span>
                  <span class="next-value">${getNextActionLabel(relatedActivity.nextAction)}</span>
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}

        <div class="call-detail-actions">
          <button class="action-btn" onclick="navigate('dial', { customer: mockCustomers.find(c => c.name === '${call.name}') })">
            ${getIcon('Phone')} 発信
          </button>
        </div>
      </div>
    </div>
  `;
}

function getResultLabel(result) {
  const labels = {
    connected: '接続・会話あり',
    no_answer: '不在・留守電',
    busy: '話中',
    callback: '折り返し依頼'
  };
  return labels[result] || result;
}

function getNextActionLabel(action) {
  const labels = {
    follow_up_call: 'フォローアップ電話',
    send_quote: '見積書送付',
    send_materials: '資料送付',
    schedule_meeting: '打ち合わせ設定',
    close_deal: '契約締結',
    none: 'なし'
  };
  return labels[action] || action;
}
