// 活動登録画面
let activityNote = '';
let activityType = 'call';
let activityResult = 'connected';
let activityNextAction = '';
let activityTranscriptExpanded = false;
let activityReminderEnabled = false;
let activityReminderDate = '';
let activityReminderTime = '09:00';

function renderActivityRegistrationScreen(customer, duration, transcription, recordingUrl) {
  const resultOptions = [
    { value: 'connected', label: '接続・会話あり' },
    { value: 'no_answer', label: '不在・留守電' },
    { value: 'busy', label: '話中' },
    { value: 'callback', label: '折り返し依頼' }
  ];

  const nextActionOptions = [
    { value: '', label: '選択してください' },
    { value: 'follow_up_call', label: 'フォローアップ電話' },
    { value: 'send_quote', label: '見積書送付' },
    { value: 'send_materials', label: '資料送付' },
    { value: 'schedule_meeting', label: '打ち合わせ設定' },
    { value: 'close_deal', label: '契約締結' },
    { value: 'none', label: 'なし' }
  ];

  // 文字起こし要約をデフォルトでメモにセット
  if (activityNote === '' && transcription && transcription.summary) {
    activityNote = transcription.summary;
  }

  return `
    <div class="screen activity-registration-screen">
      <header class="screen-header with-back">
        <button class="back-btn" onclick="skipActivityRegistration()">${getIcon('X')}</button>
        <h1>活動登録</h1>
        <button class="header-save-btn" onclick="saveActivity()">保存</button>
      </header>

      <div class="screen-content">
        <div class="activity-call-info">
          <div class="activity-customer">
            <div class="customer-avatar">${customer.name[0]}</div>
            <div class="customer-details">
              <span class="customer-name">${customer.name}</span>
              <span class="customer-company">${customer.company}</span>
            </div>
          </div>
          <div class="activity-call-meta">
            ${duration ? `<span class="call-duration">${getIcon('Clock')} ${duration}</span>` : ''}
            <span class="call-date">${new Date().toLocaleDateString('ja-JP')}</span>
          </div>
        </div>

        ${recordingUrl ? `
          <div class="recording-section">
            <h3 class="section-label">${getIcon('Play')} 通話録音</h3>
            <a href="${recordingUrl}" target="_blank" class="recording-link">
              ${getIcon('ExternalLink')} YouWireで録音を再生
            </a>
          </div>
        ` : ''}

        ${transcription ? `
          <div class="transcription-section">
            <div class="transcription-header" onclick="toggleTranscript()">
              <h3 class="section-label">${getIcon('FileText')} AI文字起こし</h3>
              <span class="expand-icon">${activityTranscriptExpanded ? getIcon('ChevronUp') : getIcon('ChevronDown')}</span>
            </div>

            <div class="transcription-summary">
              <strong>要約:</strong>
              <p>${transcription.summary}</p>
            </div>

            ${activityTranscriptExpanded ? `
              <div class="transcription-full">
                <strong>全文:</strong>
                <div class="transcription-text">
                  ${transcription.fullText.map(line => `
                    <p class="transcript-line ${line.speaker}">
                      <span class="speaker-label">${line.speaker === 'agent' ? '担当者' : '顧客'}:</span>
                      ${line.text}
                    </p>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <div class="form-section">
          <label class="section-label">通話結果</label>
          <div class="result-options">
            ${resultOptions.map(opt => `
              <button
                class="result-option ${activityResult === opt.value ? 'active' : ''}"
                onclick="setActivityResult('${opt.value}')"
              >
                ${opt.label}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="form-section">
          <label class="section-label">${transcription ? 'メモ（AI要約から編集可）' : 'メモ'}</label>
          <textarea
            class="activity-note-input"
            placeholder="活動内容のメモを入力..."
            oninput="updateActivityNote(this.value)"
          >${activityNote}</textarea>
        </div>

        <div class="form-section">
          <label class="section-label">次のアクション</label>
          <select class="next-action-select" onchange="setNextAction(this.value)">
            ${nextActionOptions.map(opt => `
              <option value="${opt.value}" ${activityNextAction === opt.value ? 'selected' : ''}>
                ${opt.label}
              </option>
            `).join('')}
          </select>
        </div>

        ${activityNextAction && activityNextAction !== 'none' ? `
          <div class="form-section reminder-section">
            <div class="reminder-toggle">
              <label class="section-label">${getIcon('Bell')} リマインダー設定</label>
              <button class="toggle-btn ${activityReminderEnabled ? 'active' : ''}" onclick="toggleReminder()">
                ${activityReminderEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            ${activityReminderEnabled ? `
              <div class="reminder-settings">
                <div class="reminder-quick-options">
                  <button class="quick-option-btn ${isReminderQuickOption(1) ? 'active' : ''}" onclick="setReminderQuick(1)">明日</button>
                  <button class="quick-option-btn ${isReminderQuickOption(3) ? 'active' : ''}" onclick="setReminderQuick(3)">3日後</button>
                  <button class="quick-option-btn ${isReminderQuickOption(7) ? 'active' : ''}" onclick="setReminderQuick(7)">1週間後</button>
                </div>
                <div class="reminder-datetime">
                  <input type="date" class="reminder-date-input" value="${activityReminderDate}" onchange="setReminderDate(this.value)" min="${getTomorrowDate()}" />
                  <input type="time" class="reminder-time-input" value="${activityReminderTime}" onchange="setReminderTime(this.value)" />
                </div>
                <p class="reminder-preview">
                  ${activityReminderDate ? `${getIcon('Clock')} ${formatReminderPreview(activityReminderDate, activityReminderTime)}` : '日時を選択してください'}
                </p>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <button class="save-activity-btn" onclick="saveActivity()">
          ${getIcon('Check')} 活動を保存
        </button>
      </div>
    </div>
  `;
}

function toggleTranscript() {
  activityTranscriptExpanded = !activityTranscriptExpanded;
  render();
}

function setActivityResult(result) {
  activityResult = result;
  render();
}

function updateActivityNote(value) {
  activityNote = value;
}

function setNextAction(action) {
  activityNextAction = action;
  // アクションを変更したらリマインダーをリセット
  if (!action || action === 'none') {
    activityReminderEnabled = false;
  }
  render();
}

function toggleReminder() {
  activityReminderEnabled = !activityReminderEnabled;
  if (activityReminderEnabled && !activityReminderDate) {
    // デフォルトで1週間後を設定
    setReminderQuick(7);
  }
  render();
}

function setReminderDate(date) {
  activityReminderDate = date;
}

function setReminderTime(time) {
  activityReminderTime = time;
}

function setReminderQuick(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  activityReminderDate = date.toISOString().split('T')[0];
  render();
}

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

function isReminderQuickOption(days) {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + days);
  return activityReminderDate === targetDate.toISOString().split('T')[0];
}

function formatReminderPreview(date, time) {
  const d = new Date(date + 'T' + time);
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  const dateStr = d.toLocaleDateString('ja-JP', options);
  return `${dateStr} ${time} にリマインド`;
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

function saveActivity() {
  const currentScreen = getCurrentScreen();

  // 活動データを保存（デモ用）
  const activity = {
    id: Date.now(),
    customerId: currentScreen.customer.id,
    customerName: currentScreen.customer.name,
    company: currentScreen.customer.company,
    type: 'call',
    result: activityResult,
    note: activityNote,
    nextAction: activityNextAction,
    duration: currentScreen.duration,
    recordingUrl: currentScreen.recordingUrl,
    transcription: currentScreen.transcription,
    createdAt: new Date().toISOString()
  };

  // mockActivitiesに追加
  if (typeof mockActivities !== 'undefined') {
    mockActivities.unshift(activity);
  }

  // リマインダーが有効な場合はタスクを作成
  if (activityReminderEnabled && activityReminderDate && activityNextAction && activityNextAction !== 'none') {
    const task = {
      id: Date.now() + 1,
      customerId: currentScreen.customer.id,
      customerName: currentScreen.customer.name,
      company: currentScreen.customer.company,
      type: activityNextAction,
      title: getNextActionLabel(activityNextAction),
      note: activityNote.substring(0, 50) + (activityNote.length > 50 ? '...' : ''),
      dueDate: activityReminderDate,
      dueTime: activityReminderTime,
      createdAt: new Date().toISOString(),
      completed: false,
      activityId: activity.id
    };

    if (typeof mockTasks !== 'undefined') {
      mockTasks.unshift(task);
    }

    alert(`活動を保存しました。${formatReminderPreview(activityReminderDate, activityReminderTime)}（デモ）`);
  } else {
    alert('活動を保存しました（デモ）');
  }

  // 状態リセット
  resetActivityForm();

  // 前の画面に戻る（顧客詳細から来た場合）または ホームに戻る
  if (AppState.screenStack.length > 1) {
    AppState.screenStack.pop();
    render();
  } else {
    AppState.activeTab = 'home';
    AppState.screenStack = [{ screen: 'home' }];
    render();
  }
}

function skipActivityRegistration() {
  resetActivityForm();
  // 前の画面に戻る
  if (AppState.screenStack.length > 1) {
    AppState.screenStack.pop();
    render();
  } else {
    AppState.activeTab = 'home';
    AppState.screenStack = [{ screen: 'home' }];
    render();
  }
}

function resetActivityForm() {
  activityNote = '';
  activityType = 'call';
  activityResult = 'connected';
  activityNextAction = '';
  activityTranscriptExpanded = false;
  activityReminderEnabled = false;
  activityReminderDate = '';
  activityReminderTime = '09:00';
}
