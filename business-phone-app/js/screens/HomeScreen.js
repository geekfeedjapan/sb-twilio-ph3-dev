// ホーム画面
function renderHomeScreen() {
  const highPriorityNotifications = mockNotifications.filter(n => n.priority === 'high');
  
  return `
    <div class="screen home-screen">
      <header class="screen-header">
        <h1>ホーム</h1>
        <div class="header-actions">
          <button class="icon-btn">${getIcon('Bell')}</button>
        </div>
      </header>
      
      <div class="screen-content">
        <section class="section">
          <h2 class="section-title">${getIcon('AlertTriangle')} 要対応</h2>
          <div class="alert-cards">
            ${highPriorityNotifications.map(n => `
              <div class="alert-card high">
                <div class="alert-icon">${getIcon('AlertTriangle')}</div>
                <div class="alert-content">
                  <p>${n.message}</p>
                  <span class="alert-time">${n.time}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

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
