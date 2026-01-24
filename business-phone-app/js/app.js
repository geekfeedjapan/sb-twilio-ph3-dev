// アプリケーション状態管理
const AppState = {
  // 認証状態
  isAuthenticated: false,
  currentUser: null,
  pendingAuth: null,

  // ナビゲーション状態
  activeTab: 'home',
  screenStack: [{ screen: 'login' }],

  // 通話状態
  showIncomingCall: false,
  incomingCustomer: null,
  callDuration: 0,
  callTimer: null
};

// 現在の画面を取得
function getCurrentScreen() {
  return AppState.screenStack[AppState.screenStack.length - 1];
}

// 画面遷移
function navigate(screen, params = {}) {
  AppState.screenStack.push({ screen, ...params });
  render();
}

// 戻る
function goBack() {
  if (AppState.screenStack.length > 1) {
    AppState.screenStack.pop();
    render();
  }
}

// タブ切り替え
function changeTab(tab) {
  if (!AppState.isAuthenticated) return;

  AppState.activeTab = tab;
  AppState.screenStack = [{ screen: tab }];
  render();
}

// 着信シミュレーション
function simulateIncomingCall() {
  if (!AppState.isAuthenticated) return;

  AppState.incomingCustomer = mockCustomers[0];
  AppState.showIncomingCall = true;
  render();
}

// 着信応答
function answerCall() {
  AppState.showIncomingCall = false;
  navigate('calling', { customer: AppState.incomingCustomer });
}

// 着信拒否
function declineCall() {
  AppState.showIncomingCall = false;
  AppState.incomingCustomer = null;
  render();
}

// 通話終了
function endCall() {
  const currentScreen = getCurrentScreen();
  if (AppState.callTimer) {
    clearInterval(AppState.callTimer);
    AppState.callTimer = null;
  }
  const duration = formatDuration(AppState.callDuration);
  AppState.callDuration = 0;
  AppState.screenStack.pop();
  navigate('call-end', { customer: currentScreen.customer, duration });
}

// 通話終了後の完了
function callEndDone() {
  AppState.activeTab = 'home';
  AppState.screenStack = [{ screen: 'home' }];
  render();
}

// 通話時間フォーマット
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 通話タイマー開始
function startCallTimer() {
  AppState.callDuration = 0;
  AppState.callTimer = setInterval(() => {
    AppState.callDuration++;
    const durationEl = document.getElementById('call-duration');
    if (durationEl) {
      durationEl.textContent = formatDuration(AppState.callDuration);
    }
  }, 1000);
}

// ボトムナビを表示するかどうか
function shouldShowBottomNav() {
  if (!AppState.isAuthenticated) return false;

  const currentScreen = getCurrentScreen();
  const hideNavScreens = ['calling', 'dial', 'customer-detail', 'messaging', 'call-end', 'incoming', 'user-profile', 'activity-registration', 'call-detail'];
  return !hideNavScreens.includes(currentScreen.screen) && !AppState.showIncomingCall;
}

// メイン描画
function render() {
  const app = document.getElementById('app');
  const currentScreen = getCurrentScreen();

  let content = '';

  // 認証されていない場合はログイン関連画面を表示
  if (!AppState.isAuthenticated) {
    switch (currentScreen.screen) {
      case 'two-factor':
        content = renderTwoFactorScreen();
        break;
      case 'login':
      default:
        content = renderLoginScreen();
    }
  } else if (AppState.showIncomingCall) {
    content = renderIncomingCallScreen(AppState.incomingCustomer);
  } else {
    switch (currentScreen.screen) {
      case 'home':
        content = renderHomeScreen();
        break;
      case 'customers':
        content = renderCustomerListScreen();
        break;
      case 'customer-detail':
        content = renderCustomerDetailScreen(currentScreen.customer);
        break;
      case 'phone':
        content = renderPhoneScreen();
        break;
      case 'talk':
        content = renderTalkScreen();
        break;
      case 'messaging':
        content = renderMessagingScreen(currentScreen.customer);
        break;
      case 'dial':
        content = renderDialScreen(currentScreen.customer, currentScreen.phone);
        break;
      case 'calling':
        content = renderCallScreen(currentScreen.customer, currentScreen.phone);
        startCallTimer();
        break;
      case 'call-end':
        content = renderCallEndScreen(currentScreen.customer, currentScreen.duration);
        break;
      case 'settings':
        content = renderSettingsScreen();
        break;
      case 'user-profile':
        content = renderUserProfileScreen();
        break;
      case 'activity-registration':
        content = renderActivityRegistrationScreen(
          currentScreen.customer,
          currentScreen.duration,
          currentScreen.transcription,
          currentScreen.recordingUrl
        );
        break;
      case 'call-detail':
        content = renderCallDetailScreen(currentScreen.call);
        break;
      default:
        content = renderHomeScreen();
    }
  }

  // ボトムナビ
  if (shouldShowBottomNav()) {
    content += renderBottomNav();
    content += renderDemoFab();
  }

  app.innerHTML = content;
}

// ボトムナビ描画
function renderBottomNav() {
  const tabs = [
    { id: 'home', icon: 'Home', label: 'ホーム' },
    { id: 'customers', icon: 'Users', label: '顧客' },
    { id: 'phone', icon: 'Phone', label: '電話' },
    { id: 'talk', icon: 'MessageCircle', label: 'トーク' },
    { id: 'settings', icon: 'Settings', label: '設定' },
  ];

  return `
    <nav class="bottom-nav">
      ${tabs.map(tab => `
        <button class="nav-item ${AppState.activeTab === tab.id ? 'active' : ''}" onclick="changeTab('${tab.id}')">
          ${getIcon(tab.icon)}
          <span>${tab.label}</span>
        </button>
      `).join('')}
    </nav>
  `;
}

// デモFAB描画
function renderDemoFab() {
  return `
    <button class="demo-fab" onclick="simulateIncomingCall()" title="着信デモ">
      ${getIcon('PhoneIncoming')}
    </button>
  `;
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  render();
});
