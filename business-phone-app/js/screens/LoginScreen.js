// ログイン画面
let loginEmail = '';
let loginPassword = '';
let showPassword = false;
let loginError = '';

function renderLoginScreen() {
  return `
    <div class="screen login-screen">
      <div class="login-container">
        <div class="login-logo">
          ${getIcon('Phone')}
          <h1>Business Phone</h1>
          <p>営業向けビジネスフォンアプリ</p>
        </div>

        <form class="login-form" onsubmit="handleLogin(event)">
          ${loginError ? `<div class="login-error">${getIcon('AlertTriangle')} ${loginError}</div>` : ''}

          <div class="form-group">
            <label for="email">メールアドレス</label>
            <div class="input-wrapper">
              ${getIcon('Mail')}
              <input
                type="email"
                id="email"
                placeholder="example@company.com"
                value="${loginEmail}"
                onchange="updateLoginEmail(this.value)"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">パスワード</label>
            <div class="input-wrapper">
              ${getIcon('Lock')}
              <input
                type="${showPassword ? 'text' : 'password'}"
                id="password"
                placeholder="パスワードを入力"
                value="${loginPassword}"
                onchange="updateLoginPassword(this.value)"
                required
              />
              <button type="button" class="toggle-password" onclick="togglePasswordVisibility()">
                ${showPassword ? getIcon('EyeOff') : getIcon('Eye')}
              </button>
            </div>
          </div>

          <button type="submit" class="login-btn">ログイン</button>

          <a href="#" class="forgot-password" onclick="handleForgotPassword(event)">パスワードをお忘れの方</a>
        </form>

        <div class="login-footer">
          <p>アカウントをお持ちでない方は</p>
          <a href="#" onclick="handleSignUp(event)">新規登録</a>
        </div>
      </div>
    </div>
  `;
}

function updateLoginEmail(value) {
  loginEmail = value;
}

function updateLoginPassword(value) {
  loginPassword = value;
}

function togglePasswordVisibility() {
  showPassword = !showPassword;
  render();
}

function handleLogin(event) {
  event.preventDefault();

  // バリデーション
  if (!loginEmail || !loginPassword) {
    loginError = 'メールアドレスとパスワードを入力してください';
    render();
    return;
  }

  // デモ用: 任意の入力でログイン成功とする
  // 実際の実装ではAPIコールを行う
  loginError = '';

  // 2要素認証が有効な場合は2FA画面へ
  if (mockUser.twoFactorEnabled) {
    AppState.pendingAuth = { email: loginEmail };
    AppState.screenStack = [{ screen: 'two-factor' }];
  } else {
    // 2FAが無効な場合は直接ログイン
    completeLogin();
  }

  render();
}

function handleForgotPassword(event) {
  event.preventDefault();
  alert('パスワードリセットメールを送信しました（デモ）');
}

function handleSignUp(event) {
  event.preventDefault();
  alert('新規登録画面へ（デモ）');
}

function completeLogin() {
  AppState.isAuthenticated = true;
  AppState.currentUser = mockUser;
  AppState.activeTab = 'home';
  AppState.screenStack = [{ screen: 'home' }];
  // ログイン情報をリセット
  loginEmail = '';
  loginPassword = '';
  loginError = '';
  showPassword = false;
}
