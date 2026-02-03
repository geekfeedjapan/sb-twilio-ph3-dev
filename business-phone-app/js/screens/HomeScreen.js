// ホーム画面
function renderHomeScreen() {
  const highPriorityNotifications = mockNotifications.filter(n => n.priority === 'high' && !n.read);
  const unreadNotificationCount = mockNotifications.filter(n => !n.read).length;

  // 今日のタスクを取得
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = mockTasks.filter(t => !t.completed && t.dueDate <= today);
  const overdueTasks = mockTasks.filter(t => !t.completed && t.dueDate < today);

  // 不在着信を取得
  const missedCalls = mockCallHistory.filter(c => c.type === 'missed' && c.name !== '不明');

  return `
    <div class="screen home-screen">
      <header class="screen-header">
        <h1>ホーム</h1>
        <div class="header-actions">
          <button class="icon-btn notification-btn" onclick="navigate('notifications')">
            ${getIcon('Bell')}
            ${unreadNotificationCount > 0 ? `<span class="notification-badge">${unreadNotificationCount}</span>` : ''}
          </button>
        </div>
      </header>

      <div class="screen-content">
        ${missedCalls.length > 0 ? `
          <section class="section">
            <h2 class="section-title">${getIcon('PhoneMissed')} 不在着信</h2>
            <div class="missed-call-cards">
              ${missedCalls.map(call => {
                const customer = mockCustomers.find(c => c.name === call.name);
                return `
                  <div class="missed-call-card" onclick="navigate('missed-call-action', { call: mockCallHistory.find(c => c.id === ${call.id}), customer: mockCustomers.find(c => c.name === '${call.name}') })">
                    <div class="missed-call-icon">${getIcon('PhoneMissed')}</div>
                    <div class="missed-call-info">
                      <span class="missed-call-name">${call.name}</span>
                      <span class="missed-call-company">${call.company}</span>
                    </div>
                    <div class="missed-call-meta">
                      <span class="missed-call-time">${call.date} ${call.time}</span>
                      <span class="missed-call-action-hint">対応する ${getIcon('ChevronRight')}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        ` : ''}

        ${todayTasks.length > 0 ? `
          <section class="section task-summary-section" onclick="navigate('tasks')">
            <h2 class="section-title">${getIcon('Calendar')} 今日のタスク</h2>
            <div class="task-summary-cards">
              ${overdueTasks.length > 0 ? `
                <div class="task-summary-card overdue">
                  <span class="task-count">${overdueTasks.length}</span>
                  <span class="task-label">期限切れ</span>
                </div>
              ` : ''}
              <div class="task-summary-card today">
                <span class="task-count">${todayTasks.length}</span>
                <span class="task-label">要対応</span>
              </div>
            </div>
            <div class="task-preview-list">
              ${todayTasks.slice(0, 2).map(task => `
                <div class="task-preview-item ${task.dueDate < today ? 'overdue' : ''}">
                  <div class="task-preview-icon">${getTaskIcon(task.type)}</div>
                  <div class="task-preview-content">
                    <span class="task-preview-title">${task.title}</span>
                    <span class="task-preview-customer">${task.customerName}</span>
                  </div>
                  <span class="task-preview-time">${task.dueTime}</span>
                </div>
              `).join('')}
            </div>
            <div class="view-all-link">すべて表示 ${getIcon('ChevronRight')}</div>
          </section>
        ` : ''}

        ${highPriorityNotifications.length > 0 ? `
          <section class="section">
            <h2 class="section-title">${getIcon('AlertTriangle')} 要対応</h2>
            <div class="alert-cards">
              ${highPriorityNotifications.map(n => `
                <div class="alert-card high" onclick="navigate('notifications')">
                  <div class="alert-icon">${getIcon('AlertTriangle')}</div>
                  <div class="alert-content">
                    <p>${n.message}</p>
                    <span class="alert-time">${n.time}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <section class="section">
          <h2 class="section-title">${getIcon('TrendingUp')} 本日のKPI</h2>
          <div class="kpi-grid">
            <div class="kpi-card">
              <span class="kpi-value">12</span>
              <span class="kpi-label">通話数</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-value">3</span>
              <span class="kpi-label">商談数</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-value">¥5.2M</span>
              <span class="kpi-label">受注見込</span>
            </div>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">${getIcon('Clock')} 直近のアクティビティ</h2>
          <div class="activity-list">
            ${mockCustomers.slice(0, 3).map(customer => `
              <div class="activity-item" onclick="navigate('customer-detail', { customer: mockCustomers.find(c => c.id === ${customer.id}) })">
                <div class="avatar">${customer.name[0]}</div>
                <div class="activity-info">
                  <span class="activity-name">${customer.name}</span>
                  <span class="activity-company">${customer.company}</span>
                </div>
                <span class="activity-time">${customer.lastContact}</span>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    </div>
  `;
}

// タスクタイプに応じたアイコンを取得
function getTaskIcon(type) {
  switch (type) {
    case 'follow_up_call': return getIcon('Phone');
    case 'send_quote': return getIcon('FileText');
    case 'send_materials': return getIcon('Send');
    case 'schedule_meeting': return getIcon('Calendar');
    case 'close_deal': return getIcon('CheckCircle');
    default: return getIcon('Clock');
  }
}
