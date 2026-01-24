// 2要素認証画面
let twoFactorCode = ['', '', '', '', '', ''];
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
            ${[0, 1, 2, 3, 4, 5].map(i => `
              <input
                type="text"
                inputmode="numeric"
                class="code-input-digit"
                maxlength="1"
                id="code-digit-${i}"
                value="${twoFactorCode[i]}"
                oninput="handleCodeInput(${i}, this)"
                onkeydown="handleCodeKeydown(event, ${i})"
                onpaste="handleCodePaste(event)"
                onfocus="this.select()"
                autocomplete="${i === 0 ? 'one-time-code' : 'off'}"
              />
            `).join('')}
          </div>

          <button type="submit" class="login-btn" ${twoFactorCode.join('').length !== 6 ? 'disabled' : ''}>
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

function handleCodeInput(index, input) {
  const value = input.value.replace(/[^0-9]/g, '');

  if (value.length > 0) {
    twoFactorCode[index] = value.slice(-1);

    // 次のフィールドに自動フォーカス
    if (index < 5) {
      const nextInput = document.getElementById(`code-digit-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  } else {
    twoFactorCode[index] = '';
  }

  render();

  // フォーカスを維持
  setTimeout(() => {
    if (value.length > 0 && index < 5) {
      const nextInput = document.getElementById(`code-digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    } else {
      const currentInput = document.getElementById(`code-digit-${index}`);
      if (currentInput) currentInput.focus();
    }
  }, 0);
}

function handleCodeKeydown(event, index) {
  // バックスペースで前のフィールドに戻る
  if (event.key === 'Backspace' && twoFactorCode[index] === '' && index > 0) {
    event.preventDefault();
    const prevInput = document.getElementById(`code-digit-${index - 1}`);
    if (prevInput) {
      twoFactorCode[index - 1] = '';
      render();
      setTimeout(() => {
        const input = document.getElementById(`code-digit-${index - 1}`);
        if (input) input.focus();
      }, 0);
    }
  }

  // 左右矢印キーでフィールド間移動
  if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault();
    const prevInput = document.getElementById(`code-digit-${index - 1}`);
    if (prevInput) prevInput.focus();
  }
  if (event.key === 'ArrowRight' && index < 5) {
    event.preventDefault();
    const nextInput = document.getElementById(`code-digit-${index + 1}`);
    if (nextInput) nextInput.focus();
  }
}

function handleCodePaste(event) {
  event.preventDefault();
  const pastedData = (event.clipboardData || window.clipboardData).getData('text');
  const digits = pastedData.replace(/[^0-9]/g, '').slice(0, 6);

  for (let i = 0; i < 6; i++) {
    twoFactorCode[i] = digits[i] || '';
  }

  render();

  // 最後に入力されたフィールドにフォーカス
  setTimeout(() => {
    const focusIndex = Math.min(digits.length, 5);
    const input = document.getElementById(`code-digit-${focusIndex}`);
    if (input) input.focus();
  }, 0);
}

function handleTwoFactorSubmit(event) {
  event.preventDefault();

  const code = twoFactorCode.join('');
  if (code.length !== 6) {
    twoFactorError = '6桁の認証コードを入力してください';
    render();
    return;
  }

  // デモ用: 任意の6桁コードで認証成功とする
  twoFactorError = '';
  twoFactorCode = ['', '', '', '', '', ''];

  // 認証成功 - ログイン完了
  completeLogin();
  render();
}

function backToLogin() {
  twoFactorCode = ['', '', '', '', '', ''];
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
