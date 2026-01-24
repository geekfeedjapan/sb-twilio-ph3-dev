// ダミーデータ

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
    name: '不明',
    time: '18:20',
    date: '2025-01-23',
    duration: '0:45',
    type: 'missed',
    company: '',
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

const mockNotifications = [
  { id: 1, type: 'risk', message: '山田太郎様との通話でNGワード検出', time: '10分前', priority: 'high' },
  { id: 2, type: 'task', message: '佐藤花子様 フォローアップ期限', time: '1時間前', priority: 'medium' },
  { id: 3, type: 'info', message: '新規リード: 鈴木電機工業', time: '2時間前', priority: 'low' },
];
