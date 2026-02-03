// ダミーデータ

// 日付ヘルパー関数（デモ用に相対日付を生成）
function getRelativeDate(daysOffset) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

function getRelativeDateTime(daysOffset, time = '10:00') {
  return `${getRelativeDate(daysOffset)}T${time}:00`;
}

function formatRelativeDate(daysOffset) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toLocaleDateString('ja-JP');
}

// ログインユーザー情報
const mockUser = {
  id: 1,
  name: '吉田 太郎',
  email: 'yoshida@example.com',
  phone: '090-1234-5678',
  department: '営業部',
  position: '主任',
  avatar: null,
  twoFactorEnabled: true,
  twoFactorMethod: 'sms', // 'sms' | 'email' | 'app'
  lastLogin: '2025-01-24 09:30',
  loginHistory: [
    { date: '2025-01-24 09:30', device: 'iPhone 15', location: '東京都' },
    { date: '2025-01-23 08:45', device: 'MacBook Pro', location: '東京都' },
    { date: '2025-01-22 10:15', device: 'iPhone 15', location: '大阪府' },
  ]
};

const mockCustomers = [
  { id: 1, name: '山田 太郎', company: '株式会社ABC商事', phone: '090-1234-5678', status: 'hot', lastContact: '2025-01-20', riskLevel: 'high', amount: '¥5,000,000', verified: true },
  { id: 2, name: '佐藤 花子', company: '田中建設株式会社', phone: '080-9876-5432', status: 'warm', lastContact: '2025-01-18', riskLevel: 'low', amount: '¥2,500,000', verified: true },
  { id: 3, name: '鈴木 一郎', company: '鈴木電機工業', phone: '070-5555-1234', status: 'cold', lastContact: '2025-01-10', riskLevel: 'medium', amount: '¥1,200,000', verified: false },
  { id: 4, name: '田中 美咲', company: 'グローバルテック', phone: '090-3333-7777', status: 'hot', lastContact: '2025-01-21', riskLevel: 'low', amount: '¥8,000,000', verified: true },
  { id: 5, name: '高橋 健一', company: 'ネクストイノベーション', phone: '080-1111-2222', status: 'warm', lastContact: '2025-01-15', riskLevel: 'high', amount: '¥3,500,000', verified: false },
];

const mockCallHistory = [
  {
    id: 1,
    name: '山田 太郎',
    time: '10:30',
    date: '2025-01-24',
    duration: '5:23',
    type: 'incoming',
    company: '株式会社ABC商事',
    recordingUrl: 'https://softbank.youwire.jp/recording/rec001',
    hasTranscription: true
  },
  {
    id: 2,
    name: '佐藤 花子',
    time: '09:15',
    date: '2025-01-24',
    duration: '12:45',
    type: 'outgoing',
    company: '田中建設株式会社',
    recordingUrl: 'https://softbank.youwire.jp/recording/rec002',
    hasTranscription: true
  },
  {
    id: 3,
    name: '高橋 健一',
    time: '18:20',
    date: '2025-01-24',
    duration: '0:00',
    type: 'missed',
    company: 'ネクストイノベーション',
    recordingUrl: null,
    hasTranscription: false
  },
  {
    id: 6,
    name: '田中 美咲',
    time: '16:45',
    date: '2025-01-24',
    duration: '0:00',
    type: 'missed',
    company: 'グローバルテック',
    recordingUrl: null,
    hasTranscription: false
  },
  {
    id: 4,
    name: '鈴木 一郎',
    time: '14:00',
    date: '2025-01-23',
    duration: '8:30',
    type: 'incoming',
    company: '鈴木電機工業',
    recordingUrl: 'https://softbank.youwire.jp/recording/rec004',
    hasTranscription: true
  },
  {
    id: 5,
    name: '田中 美咲',
    time: '11:30',
    date: '2025-01-22',
    duration: '15:20',
    type: 'outgoing',
    company: 'グローバルテック',
    recordingUrl: 'https://softbank.youwire.jp/recording/rec005',
    hasTranscription: true
  },
];

// 活動履歴
const mockActivities = [
  {
    id: 1,
    customerId: 1,
    customerName: '山田 太郎',
    company: '株式会社ABC商事',
    type: 'call',
    result: 'connected',
    note: '商品説明を実施。価格面での検討を希望。来週までに見積書送付予定。',
    nextAction: 'send_quote',
    duration: '5:23',
    recordingUrl: 'https://softbank.youwire.jp/recording/rec001',
    createdAt: '2025-01-24T10:30:00'
  },
  {
    id: 2,
    customerId: 2,
    customerName: '佐藤 花子',
    company: '田中建設株式会社',
    type: 'call',
    result: 'connected',
    note: '契約内容の最終確認。来週月曜に契約締結予定。決裁は完了済み。',
    nextAction: 'close_deal',
    duration: '12:45',
    recordingUrl: 'https://softbank.youwire.jp/recording/rec002',
    createdAt: '2025-01-24T09:15:00'
  },
  {
    id: 3,
    customerId: 4,
    customerName: '田中 美咲',
    company: 'グローバルテック',
    type: 'call',
    result: 'connected',
    note: '新規プロジェクトの提案。興味あり。詳細資料を希望。',
    nextAction: 'send_materials',
    duration: '15:20',
    recordingUrl: 'https://softbank.youwire.jp/recording/rec005',
    createdAt: '2025-01-22T11:30:00'
  },
];

const mockConversations = [
  { id: 1, name: '山田 太郎', lastMessage: '見積書をご確認ください', time: '10:30', unread: 2, channel: 'line', company: '株式会社ABC商事' },
  { id: 2, name: '佐藤 花子', lastMessage: 'お電話ありがとうございました', time: '09:15', unread: 0, channel: 'sms', company: '田中建設株式会社' },
  { id: 3, name: '田中 美咲', lastMessage: '契約書について確認です', time: '昨日', unread: 1, channel: 'line', company: 'グローバルテック' },
];

// メッセージ対応履歴（SMS/LINE）
const mockMessageHistory = [
  {
    id: 1,
    customerId: 1,
    customerName: '山田 太郎',
    channel: 'line',
    direction: 'sent',
    message: '見積書をお送りいたします。ご確認のほどよろしくお願いいたします。',
    createdAt: '2025-01-24T14:05:00'
  },
  {
    id: 2,
    customerId: 1,
    customerName: '山田 太郎',
    channel: 'line',
    direction: 'received',
    message: 'ありがとうございます。確認して折り返しご連絡いたします。',
    createdAt: '2025-01-24T14:10:00'
  },
  {
    id: 3,
    customerId: 2,
    customerName: '佐藤 花子',
    channel: 'sms',
    direction: 'sent',
    message: '先ほどはお電話ありがとうございました。契約書を本日中にお送りいたします。',
    createdAt: '2025-01-24T09:30:00'
  },
  {
    id: 4,
    customerId: 2,
    customerName: '佐藤 花子',
    channel: 'sms',
    direction: 'received',
    message: 'お世話になっております。契約書の受領確認いたしました。',
    createdAt: '2025-01-23T16:00:00'
  },
  {
    id: 5,
    customerId: 4,
    customerName: '田中 美咲',
    channel: 'line',
    direction: 'received',
    message: '契約書について確認したい点がございます。お手すきの際にご連絡いただけますか。',
    createdAt: '2025-01-23T11:00:00'
  },
  {
    id: 6,
    customerId: 4,
    customerName: '田中 美咲',
    channel: 'line',
    direction: 'sent',
    message: 'ご連絡ありがとうございます。本日15時にお電話させていただきます。',
    createdAt: '2025-01-23T11:30:00'
  },
  {
    id: 7,
    customerId: 3,
    customerName: '鈴木 一郎',
    channel: 'sms',
    direction: 'sent',
    message: '先日はお打ち合わせありがとうございました。提案資料を改めてお送りいたします。',
    createdAt: '2025-01-22T17:00:00'
  },
  {
    id: 8,
    customerId: 5,
    customerName: '高橋 健一',
    channel: 'line',
    direction: 'received',
    message: '来週のミーティングの日程を調整させてください。',
    createdAt: '2025-01-21T10:00:00'
  },
];

const mockNotifications = [
  { id: 1, type: 'risk', message: '山田太郎様との通話でNGワード検出', time: '10分前', timestamp: '2025-01-24T10:20:00', priority: 'high', read: false },
  { id: 2, type: 'system', message: '佐藤花子様との契約が承認されました', time: '1時間前', timestamp: '2025-01-24T09:30:00', priority: 'medium', read: false },
  { id: 3, type: 'info', message: '新規リード: 鈴木電機工業', time: '2時間前', timestamp: '2025-01-24T08:30:00', priority: 'low', read: true },
  { id: 4, type: 'risk', message: '高橋健一様のリスクレベルが上昇', time: '3時間前', timestamp: '2025-01-24T07:30:00', priority: 'high', read: true },
  { id: 5, type: 'info', message: '本日の目標達成率: 80%', time: '昨日', timestamp: '2025-01-23T18:00:00', priority: 'low', read: true },
];

// タスク/リマインダー（ユーザーが設定したフォローアップ予定）
// 注: 日付は相対日付で動的に生成（デモが日付に依存しないように）
const mockTasks = [
  {
    id: 1,
    customerId: 1,
    customerName: '山田 太郎',
    company: '株式会社ABC商事',
    type: 'follow_up_call',
    title: 'フォローアップ電話',
    note: '見積書について確認の電話',
    dueDate: getRelativeDate(7), // 1週間後
    dueTime: '10:00',
    createdAt: getRelativeDateTime(0, '10:30'),
    completed: false,
    activityId: 1
  },
  {
    id: 2,
    customerId: 2,
    customerName: '佐藤 花子',
    company: '田中建設株式会社',
    type: 'close_deal',
    title: '契約締結',
    note: '契約書の最終確認と締結',
    dueDate: getRelativeDate(3), // 3日後
    dueTime: '14:00',
    createdAt: getRelativeDateTime(0, '09:15'),
    completed: false,
    activityId: 2
  },
  {
    id: 3,
    customerId: 4,
    customerName: '田中 美咲',
    company: 'グローバルテック',
    type: 'send_materials',
    title: '資料送付',
    note: '詳細提案資料をメールで送付',
    dueDate: getRelativeDate(1), // 明日
    dueTime: '09:00',
    createdAt: getRelativeDateTime(-2, '11:30'),
    completed: false,
    activityId: 3
  },
  {
    id: 4,
    customerId: 3,
    customerName: '鈴木 一郎',
    company: '鈴木電機工業',
    type: 'follow_up_call',
    title: 'フォローアップ電話',
    note: '先月の提案について再度連絡',
    dueDate: getRelativeDate(0), // 今日
    dueTime: '15:00',
    createdAt: getRelativeDateTime(-4, '10:00'),
    completed: false,
    activityId: null
  },
];
