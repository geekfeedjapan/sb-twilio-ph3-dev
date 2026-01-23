// 顧客一覧画面
let customerSearchQuery = '';
let customerFilter = 'all';

function renderCustomerListScreen() {
  const statusColors = { hot: '#ef4444', warm: '#f59e0b', cold: '#3b82f6' };
  const statusLabels = { hot: 'HOT', warm: 'WARM', cold: 'COLD' };
  
  const filteredCustomers = mockCustomers.filter(c => {
    const matchesSearch = c.name.includes(customerSearchQuery) || c.company.includes(customerSearchQuery);
    const matchesFilter = customerFilter === 'all' || c.status === customerFilter;
    return matchesSearch && matchesFilter;
  });

  return `
    <div class="screen customer-list-screen">
      <header class="screen-header">
        <h1>顧客</h1>
      </header>

      <div class="screen-content">
        <div class="search-bar">
          ${getIcon('Search')}
          <input type="text" placeholder="顧客名・会社名で検索" value="${customerSearchQuery}" oninput="updateCustomerSearch(this.value)">
        </div>

        <div class="filter-tabs">
          ${['all', 'hot', 'warm', 'cold'].map(f => `
            <button class="filter-tab ${customerFilter === f ? 'active' : ''}" onclick="setCustomerFilter('${f}')">
              ${f === 'all' ? 'すべて' : statusLabels[f]}
            </button>
          `).join('')}
        </div>

        <div class="customer-list">
          ${filteredCustomers.map(customer => `
            <div class="customer-item" onclick="navigate('customer-detail', { customer: mockCustomers.find(c => c.id === ${customer.id}) })">
              <div class="customer-avatar">${customer.name[0]}</div>
              <div class="customer-info">
                <div class="customer-header">
                  <span class="customer-name">${customer.name}</span>
                  <span class="status-badge" style="background: ${statusColors[customer.status]}">
                    ${statusLabels[customer.status]}
                  </span>
                </div>
                <span class="customer-company">${customer.company}</span>
                <div class="customer-meta">
                  <span class="customer-amount">${customer.amount}</span>
                  <span class="customer-date">最終: ${customer.lastContact}</span>
                </div>
              </div>
              ${getIcon('ChevronRight')}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function updateCustomerSearch(value) {
  customerSearchQuery = value;
  render();
}

function setCustomerFilter(filter) {
  customerFilter = filter;
  render();
}
