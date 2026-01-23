// 発信確認画面
function renderDialScreen(customer, phone) {
  const displayName = customer?.name || phone || '発信先';
  const displayCompany = customer?.company || '';
  const displayPhone = customer?.phone || phone || '';
  const customerId = customer?.id;

  return `
    <div class="screen dial-screen">
      <header class="screen-header with-back">
        <button class="back-btn" onclick="goBack()">${getIcon('ChevronLeft')}</button>
        <h1>発信確認</h1>
      </header>

      <div class="screen-content dial-content">
        <div class="dial-profile">
          <div class="dial-avatar">${displayName[0]}</div>
          <h2>${displayName}</h2>
          ${displayCompany ? `<p class="dial-company">${displayCompany}</p>` : ''}
          <p class="dial-phone">${displayPhone}</p>
        </div>

        ${customer ? `
          <div class="dial-info-card">
            <h3>${getIcon('Sparkles')} CRM情報</h3>
            <div class="dial-info-row">
              <span>商談金額</span>
              <span>${customer.amount}</span>
            </div>
            <div class="dial-info-row">
              <span>最終コンタクト</span>
              <span>${customer.lastContact}</span>
            </div>
            ${customer.verified ? `
              <div class="dial-verified">
                ${getIcon('Shield')} 本人確認済み
              </div>
            ` : ''}
          </div>
        ` : ''}

        <div class="dial-actions-large">
          <button class="cancel-btn" onclick="goBack()">キャンセル</button>
          <button class="call-btn-large" onclick="navigate('calling', { customer: ${customerId ? `mockCustomers.find(c => c.id === ${customerId})` : 'null'}, phone: '${displayPhone}' })">
            ${getIcon('Phone')}
            発信する
          </button>
        </div>
      </div>
    </div>
  `;
}
