// タスク/リマインダー一覧画面
function renderTaskListScreen() {
  const today = new Date().toISOString().split('T')[0];

  // タスクを期限でソート（期限が近い順）
  const sortedTasks = [...mockTasks]
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate + 'T' + a.dueTime) - new Date(b.dueDate + 'T' + b.dueTime));

  // 今日のタスク
  const todayTasks = sortedTasks.filter(t => t.dueDate === today);

  // 今後のタスク（今日以降）
  const upcomingTasks = sortedTasks.filter(t => t.dueDate > today);

  // 期限切れのタスク
  const overdueTasks = sortedTasks.filter(t => t.dueDate < today);

  // 完了済みタスク
  const completedTasks = mockTasks.filter(t => t.completed);

  const getTaskTypeIcon = (type) => {
    switch (type) {
      case 'follow_up_call': return getIcon('Phone');
      case 'send_quote': return getIcon('FileText');
      case 'send_materials': return getIcon('Send');
      case 'schedule_meeting': return getIcon('Calendar');
      case 'close_deal': return getIcon('CheckCircle');
      default: return getIcon('Clock');
    }
  };

  const getTaskTypeLabel = (type) => {
    const labels = {
      follow_up_call: 'フォローアップ電話',
      send_quote: '見積書送付',
      send_materials: '資料送付',
      schedule_meeting: '打ち合わせ設定',
      close_deal: '契約締結'
    };
    return labels[type] || type;
  };

  const formatDueDate = (date, time) => {
    const d = new Date(date + 'T' + time);
    const options = { month: 'numeric', day: 'numeric', weekday: 'short' };
    const dateStr = d.toLocaleDateString('ja-JP', options);
    return `${dateStr} ${time}`;
  };

  const renderTaskItem = (task, isOverdue = false) => `
    <div class="task-item ${isOverdue ? 'overdue' : ''}" onclick="showTaskDetail(${task.id})">
      <div class="task-checkbox" onclick="event.stopPropagation(); toggleTaskComplete(${task.id})">
        ${task.completed ? getIcon('CheckCircle') : getIcon('Circle')}
      </div>
      <div class="task-content">
        <div class="task-header">
          <span class="task-type-badge">
            ${getTaskTypeIcon(task.type)}
            ${getTaskTypeLabel(task.type)}
          </span>
          ${isOverdue ? '<span class="overdue-badge">期限切れ</span>' : ''}
        </div>
        <div class="task-customer">
          <span class="task-customer-name">${task.customerName}</span>
          <span class="task-company">${task.company}</span>
        </div>
        ${task.note ? `<p class="task-note">${task.note}</p>` : ''}
        <div class="task-due">
          ${getIcon('Clock')} ${formatDueDate(task.dueDate, task.dueTime)}
        </div>
      </div>
      <button class="task-action-btn" onclick="event.stopPropagation(); callTaskCustomer(${task.customerId})">
        ${getIcon('Phone')}
      </button>
    </div>
  `;

  return `
    <div class="screen task-list-screen">
      <header class="screen-header with-back">
        <button class="back-btn" onclick="goBack()">${getIcon('ChevronLeft')}</button>
        <h1>タスク/リマインダー</h1>
        <button class="icon-btn" onclick="navigate('task-create')">${getIcon('Plus')}</button>
      </header>

      <div class="screen-content">
        <div class="task-info-banner">
          <p>${getIcon('Calendar')} フォローアップ予定を管理できます</p>
        </div>

        ${overdueTasks.length > 0 ? `
          <div class="task-section">
            <h3 class="task-section-title overdue">
              ${getIcon('AlertTriangle')} 期限切れ (${overdueTasks.length})
            </h3>
            <div class="task-list">
              ${overdueTasks.map(task => renderTaskItem(task, true)).join('')}
            </div>
          </div>
        ` : ''}

        ${todayTasks.length > 0 ? `
          <div class="task-section">
            <h3 class="task-section-title today">
              ${getIcon('Star')} 今日 (${todayTasks.length})
            </h3>
            <div class="task-list">
              ${todayTasks.map(task => renderTaskItem(task)).join('')}
            </div>
          </div>
        ` : ''}

        ${upcomingTasks.length > 0 ? `
          <div class="task-section">
            <h3 class="task-section-title upcoming">
              ${getIcon('Calendar')} 今後の予定 (${upcomingTasks.length})
            </h3>
            <div class="task-list">
              ${upcomingTasks.map(task => renderTaskItem(task)).join('')}
            </div>
          </div>
        ` : ''}

        ${sortedTasks.length === 0 ? `
          <div class="task-empty">
            ${getIcon('CheckCircle')}
            <p>予定されているタスクはありません</p>
            <button class="add-task-btn" onclick="navigate('task-create')">
              ${getIcon('Plus')} タスクを追加
            </button>
          </div>
        ` : ''}

        ${completedTasks.length > 0 ? `
          <div class="task-section completed-section">
            <h3 class="task-section-title completed" onclick="toggleCompletedTasks()">
              ${getIcon('Check')} 完了済み (${completedTasks.length})
              <span class="expand-icon">${getIcon('ChevronDown')}</span>
            </h3>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// タスク完了をトグル
function toggleTaskComplete(taskId) {
  const task = mockTasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    render();
  }
}

// タスク詳細を表示
function showTaskDetail(taskId) {
  const task = mockTasks.find(t => t.id === taskId);
  if (task) {
    const customer = mockCustomers.find(c => c.id === task.customerId);
    if (customer) {
      navigate('customer-detail', { customer });
    }
  }
}

// タスクの顧客に電話
function callTaskCustomer(customerId) {
  const customer = mockCustomers.find(c => c.id === customerId);
  if (customer) {
    navigate('dial', { customer });
  }
}

// 未完了タスク数を取得
function getPendingTaskCount() {
  const today = new Date().toISOString().split('T')[0];
  return mockTasks.filter(t => !t.completed && t.dueDate <= today).length;
}

// 今日のタスク数を取得
function getTodayTaskCount() {
  const today = new Date().toISOString().split('T')[0];
  return mockTasks.filter(t => !t.completed && t.dueDate === today).length;
}

// 新規タスクを追加
function addTask(taskData) {
  const newTask = {
    id: Date.now(),
    customerId: taskData.customerId,
    customerName: taskData.customerName,
    company: taskData.company,
    type: taskData.type,
    title: taskData.title,
    note: taskData.note || '',
    dueDate: taskData.dueDate,
    dueTime: taskData.dueTime || '09:00',
    createdAt: new Date().toISOString(),
    completed: false,
    activityId: taskData.activityId || null
  };
  mockTasks.unshift(newTask);
  return newTask;
}
