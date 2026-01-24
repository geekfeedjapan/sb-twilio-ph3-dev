// 設定画面
function renderSettingsScreen() {
  const user = AppState.currentUser || mockUser;

  return `
    <div class="screen settings-screen">
      <header class="screen-header">
        <h1>設定</h1>
      </header>

      <div class="screen-content">
        <div class="settings-section">
          <h3>アカウント</h3>
          <div class="settings-item" onclick="navigate('user-profile')">
            ${getIcon('User')}
            <span class="settings-label">プロフィール</span>
            <span class="settings-value">${user.name}</span>
            ${getIcon('ChevronRight')}
          </div>
          <div class="settings-item">
            ${getIcon('Bell')}
            <span class="settings-label">通知設定</span>
            <span class="settings-value"></span>
            ${getIcon('ChevronRight')}
          </div>
          <div class="settings-item" onclick="navigate('user-profile')">
            ${getIcon('Key')}
            <span class="settings-label">セキュリティ</span>
            <span class="settings-status ${user.twoFactorEnabled ? 'connected' : ''}">
              2FA ${user.twoFactorEnabled ? 'オン' : 'オフ'}
            </span>
            ${getIcon('ChevronRight')}
          </div>
        </div>

        <div class="settings-section">
          <h3>連携</h3>
          <div class="settings-item">
            ${getIcon('Shield')}
            <span class="settings-label">Salesforce連携</span>
            <span class="settings-status connected">接続中</span>
            ${getIcon('ChevronRight')}
          </div>
          <div class="settings-item">
            ${getIcon('Phone')}
            <span class="settings-label">YouWire連携</span>
            <span class="settings-status connected">接続中</span>
            ${getIcon('ChevronRight')}
          </div>
        </div>

        <div class="settings-section">
          <h3>その他</h3>
          <div class="settings-item">
            ${getIcon('FileText')}
            <span class="settings-label">ヘルプ</span>
            ${getIcon('ChevronRight')}
          </div>
          <div class="settings-item">
            <span class="settings-label">バージョン</span>
            <span class="settings-value">1.0.0</span>
          </div>
        </div>

        <div class="settings-section logout-section">
          <button class="logout-btn" onclick="confirmLogout()">
            ${getIcon('LogOut')}
            <span>ログアウト</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function confirmLogout() {
  if (confirm('ログアウトしますか？')) {
    handleLogout();
  }
}

function handleLogout() {
  // 認証状態をリセット
  AppState.isAuthenticated = false;
  AppState.currentUser = null;
  AppState.pendingAuth = null;
  AppState.activeTab = 'home';
  AppState.screenStack = [{ screen: 'login' }];

  // 2FAタイマーをクリア
  if (typeof clearResendTimer === 'function') {
    clearResendTimer();
  }

  render();
}
