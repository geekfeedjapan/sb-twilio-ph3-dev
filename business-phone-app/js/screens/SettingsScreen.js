// 設定画面
function renderSettingsScreen() {
  return `
    <div class="screen settings-screen">
      <header class="screen-header">
        <h1>設定</h1>
      </header>

      <div class="screen-content">
        <div class="settings-section">
          <h3>アカウント</h3>
          <div class="settings-item">
            ${getIcon('User')}
            <span class="settings-label">プロフィール</span>
            <span class="settings-value">吉田 太郎</span>
            ${getIcon('ChevronRight')}
          </div>
          <div class="settings-item">
            ${getIcon('Bell')}
            <span class="settings-label">通知設定</span>
            <span class="settings-value"></span>
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
      </div>
    </div>
  `;
}
