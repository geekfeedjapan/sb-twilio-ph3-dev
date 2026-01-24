// 2要素認証画面
let twoFactorCode = '';
let twoFactorError = '';
let twoFactorMethod = 'sms'; // 'sms' | 'email' | 'app'
let resendTimer = 0;
let resendInterval = null;

function renderTwoFactorScreen() {
  const maskedPhone = '090-****-5678';
  const maskedEmail = 'yos****@example.com';

  const methodLabels = {
    sms: `SMS（${maskedPhone}）`,
    email: `メール（${maskedEmail}）`,
    app: '認証アプリ'
  };

  return `
    <div class="screen two-factor-screen">
      <div class="two-factor-container">
        <button class="back-btn-float" onclick="backToLogin()">
          ${getIcon('ChevronLeft')}
        </button>

        <div class="two-factor-header">
          <div class="two-factor-icon">
            ${getIcon('Shield')}
          </div>
          <h1>2段階認証</h1>
          <p>セキュリティのため、認証コードを入力してください</p>
        </div>

        <div class="two-factor-method">
          <span class="method-label">送信先:</span>
          <span class="method-value">${methodLabels[twoFactorMethod]}</span>
        </div>

        <form class="two-factor-form" onsubmit="handleTwoFactorSubmit(event)">
          ${twoFactorError ? `<div class="login-error">${getIcon('AlertTriangle')} ${twoFactorError}</div>` : ''}

          <div class="code-input-container">
            <input
              type="text"
              class="code-input"
              maxlength="6"
              placeholder="000000"
              value="${twoFactorCode}"
              oninput="updateTwoFactorCode(this.value)"
              autocomplete="one-time-code"
            />
          </div>

          <button type="submit" class="login-btn" ${twoFactorCode.length !== 6 ? 'disabled' : ''}>
            認証する
          </button>
        </form>

        <div class="two-factor-actions">
          <button class="resend-btn" onclick="resendCode()" ${resendTimer > 0 ? 'disabled' : ''}>
            ${resendTimer > 0 ? `コードを再送信（${resendTimer}秒）` : 'コードを再送信'}
          </button>

          <button class="alt-method-btn" onclick="showMethodSelector()">
            別の方法で認証
          </button>
        </div>

        <div class="two-factor-help">
          <p>コードが届かない場合は、迷惑メールフォルダをご確認ください。</p>
        </div>
      </div>
    </div>
  `;
}

function updateTwoFactorCode(value) {
  // 数字のみ許可
  twoFactorCode = value.replace(/[^0-9]/g, '').slice(0, 6);
  render();
}

function handleTwoFactorSubmit(event) {
  event.preventDefault();

  if (twoFactorCode.length !== 6) {
    twoFactorError = '6桁の認証コードを入力してください';
    render();
    return;
  }

  // デモ用: 任意の6桁コードで認証成功とする
  twoFactorError = '';
  twoFactorCode = '';

  // 認証成功 - ログイン完了
  completeLogin();
  render();
}

function backToLogin() {
  twoFactorCode = '';
  twoFactorError = '';
  AppState.pendingAuth = null;
  AppState.screenStack = [{ screen: 'login' }];
  clearResendTimer();
  render();
}

function resendCode() {
  if (resendTimer > 0) return;

  // デモ用: 再送信成功メッセージ
  alert('認証コードを再送信しました（デモ）');

  // 再送信タイマー開始（60秒）
  resendTimer = 60;
  resendInterval = setInterval(() => {
    resendTimer--;
    if (resendTimer <= 0) {
      clearResendTimer();
    }
    render();
  }, 1000);
  render();
}

function clearResendTimer() {
  if (resendInterval) {
    clearInterval(resendInterval);
    resendInterval = null;
  }
  resendTimer = 0;
}

function showMethodSelector() {
  const methods = ['sms', 'email', 'app'];
  const labels = { sms: 'SMS', email: 'メール', app: '認証アプリ' };

  const currentIndex = methods.indexOf(twoFactorMethod);
  const nextIndex = (currentIndex + 1) % methods.length;
  twoFactorMethod = methods[nextIndex];

  alert(`認証方法を「${labels[twoFactorMethod]}」に変更しました（デモ）`);
  render();
}
