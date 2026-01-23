// ダミーデータ
const mockCustomers = [
  { id: 1, name: '山田 太郎', company: '株式会社ABC商事', phone: '090-1234-5678', status: 'hot', lastContact: '2025-01-20', riskLevel: 'high', amount: '¥5,000,000', verified: true },
  { id: 2, name: '佐藤 花子', company: '田中建設株式会社', phone: '080-9876-5432', status: 'warm', lastContact: '2025-01-18', riskLevel: 'low', amount: '¥2,500,000', verified: true },
  { id: 3, name: '鈴木 一郎', company: '鈴木電機工業', phone: '070-5555-1234', status: 'cold', lastContact: '2025-01-10', riskLevel: 'medium', amount: '¥1,200,000', verified: false },
  { id: 4, name: '田中 美咲', company: 'グローバルテック', phone: '090-3333-7777', status: 'hot', lastContact: '2025-01-21', riskLevel: 'low', amount: '¥8,000,000', verified: true },
  { id: 5, name: '高橋 健一', company: 'ネクストイノベーション', phone: '080-1111-2222', status: 'warm', lastContact: '2025-01-15', riskLevel: 'high', amount: '¥3,500,000', verified: false },
];

const mockCallHistory = [
  { id: 1, name: '山田 太郎', time: '10:30', duration: '5:23', type: 'incoming', company: '株式会社ABC商事' },
  { id: 2, name: '佐藤 花子', time: '09:15', duration: '12:45', type: 'outgoing', company: '田中建設株式会社' },
  { id: 3, name: '不明', time: '昨日', duration: '0:45', type: 'missed', company: '' },
  { id: 4, name: '鈴木 一郎', time: '昨日', duration: '8:30', type: 'incoming', company: '鈴木電機工業' },
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
