// ユーザープロフィール画面
function renderUserProfileScreen() {
  const user = AppState.currentUser || mockUser;

  return `
    <div class="screen user-profile-screen">
      <header class="screen-header with-back">
        <button class="back-btn" onclick="goBack()">${getIcon('ChevronLeft')}</button>
        <h1>プロフィール</h1>
        <button class="icon-btn" onclick="editProfile()">${getIcon('MoreVertical')}</button>
      </header>

      <div class="screen-content">
        <div class="profile-section">
          <div class="profile-avatar-large">
            ${user.avatar ? `<img src="${user.avatar}" alt="${user.name}">` : user.name[0]}
            <button class="avatar-edit-btn" onclick="changeAvatar()">
              ${getIcon('Camera')}
            </button>
          </div>
          <h2 class="profile-name">${user.name}</h2>
          <p class="profile-role">${user.department} / ${user.position}</p>
        </div>

        <section class="section">
          <h3 class="section-title">基本情報</h3>
          <div class="info-list">
            <div class="info-row">
              <span class="info-label">${getIcon('Mail')} メールアドレス</span>
              <span class="info-value">${user.email}</span>
            </div>
            <div class="info-row">
              <span class="info-label">${getIcon('Phone')} 電話番号</span>
              <span class="info-value">${user.phone}</span>
            </div>
            <div class="info-row">
              <span class="info-label">${getIcon('Users')} 部署</span>
              <span class="info-value">${user.department}</span>
            </div>
            <div class="info-row">
              <span class="info-label">${getIcon('User')} 役職</span>
              <span class="info-value">${user.position}</span>
            </div>
          </div>
        </section>

        <section class="section">
          <h3 class="section-title">${getIcon('Shield')} セキュリティ</h3>
          <div class="settings-list">
            <div class="settings-item" onclick="changePassword()">
              ${getIcon('Lock')}
              <span class="settings-label">パスワード変更</span>
              ${getIcon('ChevronRight')}
            </div>
            <div class="settings-item" onclick="toggle2FA()">
              ${getIcon('Key')}
              <span class="settings-label">2段階認証</span>
              <span class="settings-status ${user.twoFactorEnabled ? 'connected' : ''}">
                ${user.twoFactorEnabled ? 'オン' : 'オフ'}
              </span>
              ${getIcon('ChevronRight')}
            </div>
            <div class="settings-item" onclick="showLoginHistory()">
              ${getIcon('Smartphone')}
              <span class="settings-label">ログイン履歴</span>
              ${getIcon('ChevronRight')}
            </div>
          </div>
        </section>

        <section class="section">
          <h3 class="section-title">${getIcon('Clock')} 最近のログイン</h3>
          <div class="login-history">
            ${user.loginHistory.map(log => `
              <div class="login-history-item">
                <div class="login-history-icon">
                  ${getIcon('Smartphone')}
                </div>
                <div class="login-history-info">
                  <span class="login-history-device">${log.device}</span>
                  <span class="login-history-location">${log.location}</span>
                </div>
                <span class="login-history-date">${log.date}</span>
              </div>
            `).join('')}
          </div>
        </section>

        <section class="section">
          <button class="danger-btn" onclick="confirmDeleteAccount()">
            アカウントを削除
          </button>
        </section>
      </div>
    </div>
  `;
}

function editProfile() {
  alert('プロフィール編集（デモ）');
}

function changeAvatar() {
  alert('アバター画像を変更（デモ）');
}

function changePassword() {
  alert('パスワード変更画面へ（デモ）');
}

function toggle2FA() {
  const user = AppState.currentUser || mockUser;
  const newState = !user.twoFactorEnabled;

  if (newState) {
    alert('2段階認証を有効にします（デモ）');
  } else {
    if (confirm('2段階認証を無効にしますか？セキュリティが低下します。')) {
      alert('2段階認証を無効にしました（デモ）');
    }
  }
}

function showLoginHistory() {
  alert('ログイン履歴の詳細（デモ）');
}

function confirmDeleteAccount() {
  if (confirm('本当にアカウントを削除しますか？この操作は取り消せません。')) {
    alert('アカウントが削除されました（デモ）');
    handleLogout();
  }
}
