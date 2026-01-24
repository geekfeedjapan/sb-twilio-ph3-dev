// 通知一覧画面（システム通知）
function renderNotificationListScreen() {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'risk': return getIcon('AlertTriangle');
      case 'system': return getIcon('CheckCircle');
      case 'info': return getIcon('Info');
      default: return getIcon('Bell');
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      default: return 'priority-low';
    }
  };

  return `
    <div class="screen notification-list-screen">
      <header class="screen-header with-back">
        <button class="back-btn" onclick="goBack()">${getIcon('ChevronLeft')}</button>
        <h1>通知一覧</h1>
        ${unreadCount > 0 ? `
          <button class="header-action-btn" onclick="markAllNotificationsRead()">
            すべて既読
          </button>
        ` : '<div></div>'}
      </header>

      <div class="screen-content">
        <div class="notification-info-banner">
          <p>${getIcon('Info')} システムからの通知・アラートが表示されます</p>
        </div>

        ${unreadCount > 0 ? `
          <div class="notification-section">
            <h3 class="notification-section-title">未読 (${unreadCount})</h3>
            <div class="notification-list">
              ${mockNotifications.filter(n => !n.read).map(notification => `
                <div class="notification-item ${getPriorityClass(notification.priority)} unread"
                     onclick="markNotificationRead(${notification.id})">
                  <div class="notification-icon ${notification.type}">
                    ${getNotificationIcon(notification.type)}
                  </div>
                  <div class="notification-content">
                    <p class="notification-message">${notification.message}</p>
                    <span class="notification-time">${notification.time}</span>
                  </div>
                  <div class="notification-unread-dot"></div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="notification-section">
          <h3 class="notification-section-title">
            ${unreadCount > 0 ? '既読' : 'すべての通知'}
          </h3>
          <div class="notification-list">
            ${mockNotifications.filter(n => n.read).length > 0 ?
              mockNotifications.filter(n => n.read).map(notification => `
                <div class="notification-item ${getPriorityClass(notification.priority)}">
                  <div class="notification-icon ${notification.type}">
                    ${getNotificationIcon(notification.type)}
                  </div>
                  <div class="notification-content">
                    <p class="notification-message">${notification.message}</p>
                    <span class="notification-time">${notification.time}</span>
                  </div>
                </div>
              `).join('') : `
                <div class="notification-empty">
                  <p>通知はありません</p>
                </div>
              `}
          </div>
        </div>
      </div>
    </div>
  `;
}

// 通知を既読にする
function markNotificationRead(notificationId) {
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    render();
  }
}

// すべての通知を既読にする
function markAllNotificationsRead() {
  mockNotifications.forEach(n => n.read = true);
  render();
}

// 未読通知数を取得
function getUnreadNotificationCount() {
  return mockNotifications.filter(n => !n.read).length;
}
