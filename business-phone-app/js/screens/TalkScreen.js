// トーク画面
function renderTalkScreen() {
  return `
    <div class="screen talk-screen">
      <header class="screen-header">
        <h1>トーク</h1>
      </header>

      <div class="screen-content">
        <div class="conversation-list">
          ${mockConversations.map(conv => `
            <div class="conversation-item" onclick="navigate('messaging', { customer: mockCustomers.find(c => c.name === '${conv.name}') })">
              <div class="conv-avatar">
                ${conv.name[0]}
                <span class="channel-badge ${conv.channel}">
                  ${conv.channel === 'line' ? 'L' : 'S'}
                </span>
              </div>
              <div class="conv-info">
                <div class="conv-header">
                  <span class="conv-name">${conv.name}</span>
                  <span class="conv-time">${conv.time}</span>
                </div>
                <span class="conv-company">${conv.company}</span>
                <p class="conv-message">${conv.lastMessage}</p>
              </div>
              ${conv.unread > 0 ? `<span class="unread-badge">${conv.unread}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
