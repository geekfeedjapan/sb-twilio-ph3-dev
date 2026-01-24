# 営業向けコミュニケーションアプリ 技術アーキテクチャ設計書

## 1. 概要

### 1.1 設計方針
- **Twilio**: すべてのアクション・ビジネスロジックを担当
- **Salesforce**: データベース（CRM）として利用
- **外部AI API**: 高度な要約・推奨アクション生成

### 1.2 技術スタック

| レイヤー | 技術 |
|----------|------|
| フロントエンド | React Native / PWA |
| バックエンド | Twilio Functions (Node.js) |
| 通話基盤 | Twilio Voice SDK |
| 認証 | Twilio Verify |
| メッセージング | Twilio Messaging / Conversations |
| AI分析 | Twilio Voice Intelligence |
| AI要約 | OpenAI API / Claude API |
| 通知 | Twilio Notify |
| スケジューラ | Twilio Scheduler |
| データベース | Salesforce (CRM) |
| 録音保存 | Twilio Recording / YouWire（オプション） |

---

## 2. システムアーキテクチャ

### 2.1 全体構成図

```
┌─────────────────────────────────────────────────────────────────┐
│                       モバイルアプリ                             │
│                   (React Native / PWA)                          │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐       │
│  │  通話UI   │ │  顧客UI   │ │ メッセージ │ │  タスクUI  │       │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘       │
└────────┼─────────────┼─────────────┼─────────────┼──────────────┘
         │             │             │             │
         ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Twilio Platform                           │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Twilio Functions                      │    │
│  │              (サーバーレスバックエンド)                   │    │
│  │                                                          │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │ 認証API  │ │ 顧客API  │ │ 通話API  │ │タスクAPI │   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│  ┌───────────┐ ┌─────────────┴───────────┐ ┌───────────┐       │
│  │  Verify   │ │         Voice           │ │ Messaging │       │
│  │  (認証)   │ │  (通話 + Intelligence)  │ │  (SMS)    │       │
│  └───────────┘ └─────────────────────────┘ └───────────┘       │
│                                                                  │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐                     │
│  │  Notify   │ │ Scheduler │ │Conversations│                    │
│  │ (通知)    │ │(スケジュール)│ │ (チャット) │                    │
│  └───────────┘ └───────────┘ └───────────┘                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐
│   Salesforce    │ │  外部AI API │ │    YouWire      │
│     (CRM)       │ │ (要約生成)  │ │  (録音保存)     │
│                 │ │             │ │   オプション     │
│ - Contact       │ │ - OpenAI    │ │                 │
│ - Account       │ │ - Claude    │ │                 │
│ - Opportunity   │ │             │ │                 │
│ - Task          │ │             │ │                 │
│ - Activity      │ │             │ │                 │
└─────────────────┘ └─────────────┘ └─────────────────┘
```

### 2.2 データフロー

#### 2.2.1 通話フロー
```
[発信ボタン押下]
      │
      ▼
[Twilio Voice SDK] ──発信リクエスト──▶ [Twilio Voice]
      │                                      │
      │                                      ▼
      │                              [TwiML Webhook]
      │                                      │
      │                                      ▼
      │                              [Twilio Functions]
      │                                      │
      │                    ┌─────────────────┼─────────────────┐
      │                    ▼                 ▼                 ▼
      │           [Voice Intelligence] [Recording開始] [SF顧客情報取得]
      │                    │                 │
      │                    ▼                 │
      │           [リアルタイム文字起こし]    │
      │                    │                 │
      ▼                    ▼                 │
[通話中画面表示] ◀── [NGワード検出通知] ─────┘
      │
      ▼
[通話終了]
      │
      ▼
[Twilio Functions]
      │
      ├──▶ [Voice Intelligence] ──▶ [文字起こし完了]
      │                                    │
      │                                    ▼
      │                            [外部AI API]
      │                                    │
      │                                    ▼
      │                              [要約生成]
      │                                    │
      ▼                                    ▼
[Recording URL取得] ─────────────▶ [Salesforce Activity保存]
```

#### 2.2.2 認証フロー
```
[ログイン画面]
      │
      ├── Email/Password ──▶ [Twilio Functions]
      │                            │
      │                            ▼
      │                    [Salesforce認証情報検証]
      │                            │
      │                            ▼
      │                    [Twilio Verify]
      │                            │
      │                            ▼
      │                    [SMS/Email送信]
      │                            │
      ▼                            │
[2段階認証画面] ◀─────────────────┘
      │
      ├── 6桁コード入力 ──▶ [Twilio Verify検証]
      │                            │
      │                            ▼
      │                    [JWT発行]
      │                            │
      ▼                            │
[ホーム画面] ◀────────────────────┘
```

---

## 3. Twilio製品別仕様

### 3.1 Twilio Verify（認証）

#### 用途
- 2段階認証（SMS/Email/TOTP）
- 電話番号検証

#### 実装例
```javascript
// /functions/auth/send-verification.js
exports.handler = async function(context, event, callback) {
  const client = context.getTwilioClient();

  try {
    const verification = await client.verify.v2
      .services(context.VERIFY_SERVICE_SID)
      .verifications
      .create({
        to: event.phoneNumber,
        channel: event.channel || 'sms', // 'sms', 'email', 'totp'
        locale: 'ja'
      });

    callback(null, {
      success: true,
      status: verification.status
    });
  } catch (error) {
    callback(error);
  }
};

// /functions/auth/check-verification.js
exports.handler = async function(context, event, callback) {
  const client = context.getTwilioClient();

  try {
    const check = await client.verify.v2
      .services(context.VERIFY_SERVICE_SID)
      .verificationChecks
      .create({
        to: event.phoneNumber,
        code: event.code
      });

    if (check.status === 'approved') {
      // JWT発行
      const jwt = generateJWT(event.userId);
      callback(null, { success: true, token: jwt });
    } else {
      callback(null, { success: false, message: 'Invalid code' });
    }
  } catch (error) {
    callback(error);
  }
};
```

---

### 3.2 Twilio Voice（通話）

#### 用途
- 発信/着信処理
- 通話録音
- 通話制御（保留/転送/終了）

#### 実装例
```javascript
// /functions/voice/outbound-call.js
exports.handler = async function(context, event, callback) {
  const client = context.getTwilioClient();
  const VoiceResponse = require('twilio').twiml.VoiceResponse;

  try {
    // 発信
    const call = await client.calls.create({
      url: `https://${context.DOMAIN_NAME}/voice/connect`,
      to: event.toNumber,
      from: context.TWILIO_PHONE_NUMBER,
      record: true,
      recordingStatusCallback: `https://${context.DOMAIN_NAME}/voice/recording-complete`,
      statusCallback: `https://${context.DOMAIN_NAME}/voice/status`,
      // Voice Intelligence有効化
      machineDetection: 'Enable',
    });

    callback(null, {
      success: true,
      callSid: call.sid
    });
  } catch (error) {
    callback(error);
  }
};

// /functions/voice/connect.js (TwiML)
exports.handler = function(context, event, callback) {
  const VoiceResponse = require('twilio').twiml.VoiceResponse;
  const response = new VoiceResponse();

  // Voice Intelligence用のStream設定
  const connect = response.connect();
  connect.stream({
    url: `wss://${context.DOMAIN_NAME}/voice/stream`,
    name: 'voice-intelligence-stream'
  });

  // 通話接続
  response.dial({
    callerId: context.TWILIO_PHONE_NUMBER,
    record: 'record-from-answer-dual',
    recordingStatusCallback: `https://${context.DOMAIN_NAME}/voice/recording-complete`
  }, event.To);

  callback(null, response);
};

// /functions/voice/recording-complete.js
exports.handler = async function(context, event, callback) {
  const recordingUrl = event.RecordingUrl;
  const callSid = event.CallSid;

  // Salesforceに録音URL保存
  const sf = await getSalesforceConnection(context);
  await sf.sobject('Task').update({
    Id: event.taskId,
    Recording_URL__c: recordingUrl
  });

  callback(null, { success: true });
};
```

---

### 3.3 Twilio Voice Intelligence（AI分析）

#### 用途
- リアルタイム文字起こし
- キーワード検出
- 感情分析
- NGワード検出

#### 実装例
```javascript
// /functions/voice/transcription-webhook.js
exports.handler = async function(context, event, callback) {
  const transcriptSid = event.TranscriptSid;
  const client = context.getTwilioClient();

  try {
    // 文字起こし結果取得
    const transcript = await client.intelligence.v2
      .transcripts(transcriptSid)
      .fetch();

    // センテンス取得
    const sentences = await client.intelligence.v2
      .transcripts(transcriptSid)
      .sentences
      .list();

    // NGワードチェック
    const ngWords = context.NG_WORDS.split(',');
    const detectedNgWords = [];

    sentences.forEach(sentence => {
      ngWords.forEach(word => {
        if (sentence.text.includes(word)) {
          detectedNgWords.push({
            word: word,
            sentence: sentence.text,
            timestamp: sentence.startTime
          });
        }
      });
    });

    // NGワード検出時は通知
    if (detectedNgWords.length > 0) {
      await sendNgWordAlert(context, event.CallSid, detectedNgWords);
    }

    // 外部AI APIで要約生成
    const summary = await generateSummary(sentences);

    // Salesforceに保存
    const sf = await getSalesforceConnection(context);
    await sf.sobject('Activity__c').create({
      Call_SID__c: event.CallSid,
      Transcription__c: JSON.stringify(sentences),
      Summary__c: summary,
      NG_Words_Detected__c: detectedNgWords.length > 0
    });

    callback(null, { success: true });
  } catch (error) {
    callback(error);
  }
};

// AI要約生成
async function generateSummary(sentences) {
  const fullText = sentences.map(s =>
    `${s.participant === 'customer' ? '顧客' : '担当者'}: ${s.text}`
  ).join('\n');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{
        role: 'system',
        content: '以下の通話内容を日本語で3文以内に要約し、次のアクションを提案してください。'
      }, {
        role: 'user',
        content: fullText
      }],
      max_tokens: 500
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
```

---

### 3.4 Twilio Messaging（SMS）

#### 用途
- SMS送受信
- 通知メッセージ送信

#### 実装例
```javascript
// /functions/messaging/send-sms.js
exports.handler = async function(context, event, callback) {
  const client = context.getTwilioClient();

  try {
    const message = await client.messages.create({
      body: event.body,
      to: event.to,
      from: context.TWILIO_PHONE_NUMBER,
      statusCallback: `https://${context.DOMAIN_NAME}/messaging/status`
    });

    // Salesforceに保存
    const sf = await getSalesforceConnection(context);
    await sf.sobject('SMS_Log__c').create({
      To__c: event.to,
      Body__c: event.body,
      Message_SID__c: message.sid,
      Direction__c: 'outbound'
    });

    callback(null, {
      success: true,
      messageSid: message.sid
    });
  } catch (error) {
    callback(error);
  }
};

// /functions/messaging/incoming-sms.js (Webhook)
exports.handler = async function(context, event, callback) {
  const MessagingResponse = require('twilio').twiml.MessagingResponse;
  const response = new MessagingResponse();

  // 受信メッセージをSalesforceに保存
  const sf = await getSalesforceConnection(context);

  // 送信者の顧客情報を検索
  const contacts = await sf.sobject('Contact')
    .find({ Phone: event.From });

  await sf.sobject('SMS_Log__c').create({
    From__c: event.From,
    Body__c: event.Body,
    Message_SID__c: event.MessageSid,
    Direction__c: 'inbound',
    Contact__c: contacts.length > 0 ? contacts[0].Id : null
  });

  // 自動返信（オプション）
  // response.message('メッセージを受信しました。担当者より折り返しご連絡いたします。');

  callback(null, response);
};
```

---

### 3.5 Twilio Conversations（チャット管理）

#### 用途
- マルチチャネル会話管理
- 会話履歴の統合管理

#### 実装例
```javascript
// /functions/conversations/create-conversation.js
exports.handler = async function(context, event, callback) {
  const client = context.getTwilioClient();

  try {
    // 会話作成
    const conversation = await client.conversations.v1
      .conversations
      .create({
        friendlyName: `${event.customerName}との会話`,
        attributes: JSON.stringify({
          customerId: event.customerId,
          customerName: event.customerName
        })
      });

    // 参加者追加（顧客）
    await client.conversations.v1
      .conversations(conversation.sid)
      .participants
      .create({
        'messagingBinding.address': event.customerPhone,
        'messagingBinding.proxyAddress': context.TWILIO_PHONE_NUMBER
      });

    callback(null, {
      success: true,
      conversationSid: conversation.sid
    });
  } catch (error) {
    callback(error);
  }
};

// /functions/conversations/send-message.js
exports.handler = async function(context, event, callback) {
  const client = context.getTwilioClient();

  try {
    const message = await client.conversations.v1
      .conversations(event.conversationSid)
      .messages
      .create({
        author: event.agentId,
        body: event.body
      });

    callback(null, {
      success: true,
      messageSid: message.sid
    });
  } catch (error) {
    callback(error);
  }
};
```

---

### 3.6 Twilio Notify（プッシュ通知）

#### 用途
- モバイルプッシュ通知
- アラート通知

#### 実装例
```javascript
// /functions/notify/send-push.js
exports.handler = async function(context, event, callback) {
  const client = context.getTwilioClient();

  try {
    const notification = await client.notify.v1
      .services(context.NOTIFY_SERVICE_SID)
      .notifications
      .create({
        identity: event.userId,
        title: event.title,
        body: event.body,
        data: {
          type: event.notificationType,
          entityId: event.entityId
        },
        // iOS/Android両対応
        apn: {
          aps: {
            alert: {
              title: event.title,
              body: event.body
            },
            sound: 'default',
            badge: event.badgeCount || 1
          }
        },
        fcm: {
          notification: {
            title: event.title,
            body: event.body
          }
        }
      });

    // Salesforceに通知ログ保存
    const sf = await getSalesforceConnection(context);
    await sf.sobject('Notification__c').create({
      User__c: event.userId,
      Title__c: event.title,
      Body__c: event.body,
      Type__c: event.notificationType,
      Read__c: false
    });

    callback(null, { success: true });
  } catch (error) {
    callback(error);
  }
};

// NGワードアラート送信
async function sendNgWordAlert(context, callSid, detectedWords) {
  const client = context.getTwilioClient();

  // 通話中のエージェントを特定
  const call = await client.calls(callSid).fetch();
  const agentId = call.parameters?.agentId;

  await client.notify.v1
    .services(context.NOTIFY_SERVICE_SID)
    .notifications
    .create({
      identity: agentId,
      title: 'NGワード検出',
      body: `検出ワード: ${detectedWords.map(d => d.word).join(', ')}`,
      priority: 'high'
    });
}
```

---

### 3.7 Twilio Scheduler（スケジュール）

#### 用途
- リマインダー通知のスケジュール
- 定期タスク実行

#### 実装例
```javascript
// /functions/scheduler/schedule-reminder.js
exports.handler = async function(context, event, callback) {
  const client = context.getTwilioClient();

  try {
    // スケジュールされたSMS送信
    const message = await client.messages.create({
      messagingServiceSid: context.MESSAGING_SERVICE_SID,
      to: event.agentPhone,
      body: `【リマインダー】${event.customerName}様へ${event.taskTitle}`,
      scheduleType: 'fixed',
      sendAt: new Date(event.reminderDateTime).toISOString()
    });

    // Salesforce Taskを更新
    const sf = await getSalesforceConnection(context);
    await sf.sobject('Task').update({
      Id: event.taskId,
      Reminder_Scheduled__c: true,
      Reminder_Message_SID__c: message.sid
    });

    callback(null, {
      success: true,
      scheduledMessageSid: message.sid
    });
  } catch (error) {
    callback(error);
  }
};

// リマインダーキャンセル
// /functions/scheduler/cancel-reminder.js
exports.handler = async function(context, event, callback) {
  const client = context.getTwilioClient();

  try {
    await client.messages(event.messageSid).update({
      status: 'canceled'
    });

    callback(null, { success: true });
  } catch (error) {
    callback(error);
  }
};
```

---

## 4. Salesforce連携仕様

### 4.1 接続設定

```javascript
// /functions/utils/salesforce.js
const jsforce = require('jsforce');

let sfConnection = null;

async function getSalesforceConnection(context) {
  if (sfConnection && sfConnection.accessToken) {
    return sfConnection;
  }

  sfConnection = new jsforce.Connection({
    loginUrl: context.SF_LOGIN_URL || 'https://login.salesforce.com',
    version: '57.0'
  });

  await sfConnection.login(
    context.SF_USERNAME,
    context.SF_PASSWORD + context.SF_SECURITY_TOKEN
  );

  return sfConnection;
}

module.exports = { getSalesforceConnection };
```

### 4.2 オブジェクト構成

#### 標準オブジェクト
| オブジェクト | 用途 |
|-------------|------|
| Account | 企業情報 |
| Contact | 顧客担当者情報 |
| Opportunity | 商談情報 |
| Task | タスク/リマインダー |
| Event | 予定 |

#### カスタムオブジェクト
| オブジェクト | API名 | 用途 |
|-------------|-------|------|
| 活動履歴 | Activity__c | 通話・活動の詳細記録 |
| 通知 | Notification__c | アプリ内通知管理 |
| SMSログ | SMS_Log__c | SMS送受信履歴 |
| 通話ログ | Call_Log__c | 通話詳細記録 |

### 4.3 カスタムフィールド（Task）

| フィールド | API名 | 型 | 用途 |
|-----------|-------|-----|------|
| リマインダー設定済み | Reminder_Scheduled__c | Checkbox | スケジュール状態 |
| リマインダーメッセージSID | Reminder_Message_SID__c | Text | Twilio Message SID |
| 録音URL | Recording_URL__c | URL | YouWire/Twilio録音URL |
| 文字起こし | Transcription__c | Long Text | 通話文字起こし |
| AI要約 | AI_Summary__c | Text Area | AI生成要約 |

### 4.4 CRUD操作例

```javascript
// 顧客情報取得
async function getCustomer(context, customerId) {
  const sf = await getSalesforceConnection(context);
  return await sf.sobject('Contact').retrieve(customerId);
}

// 顧客検索
async function searchCustomers(context, keyword) {
  const sf = await getSalesforceConnection(context);
  return await sf.sobject('Contact')
    .find({
      $or: [
        { Name: { $like: `%${keyword}%` } },
        { 'Account.Name': { $like: `%${keyword}%` } }
      ]
    })
    .limit(50);
}

// 活動登録
async function createActivity(context, activityData) {
  const sf = await getSalesforceConnection(context);
  return await sf.sobject('Task').create({
    Subject: `通話: ${activityData.customerName}`,
    Description: activityData.note,
    WhoId: activityData.contactId,
    Status: 'Completed',
    Type: 'Call',
    Recording_URL__c: activityData.recordingUrl,
    AI_Summary__c: activityData.summary,
    ActivityDate: new Date().toISOString().split('T')[0]
  });
}

// タスク作成（リマインダー）
async function createTask(context, taskData) {
  const sf = await getSalesforceConnection(context);
  return await sf.sobject('Task').create({
    Subject: taskData.title,
    Description: taskData.note,
    WhoId: taskData.contactId,
    Status: 'Not Started',
    Priority: 'Normal',
    ActivityDate: taskData.dueDate,
    ReminderDateTime: `${taskData.dueDate}T${taskData.dueTime}:00.000Z`,
    IsReminderSet: true
  });
}

// 通知一覧取得
async function getNotifications(context, userId) {
  const sf = await getSalesforceConnection(context);
  return await sf.sobject('Notification__c')
    .find({ User__c: userId })
    .sort({ CreatedDate: -1 })
    .limit(50);
}
```

---

## 5. API仕様

### 5.1 エンドポイント一覧

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| POST | /auth/login | ログイン |
| POST | /auth/verify/send | 2段階認証コード送信 |
| POST | /auth/verify/check | 2段階認証コード検証 |
| GET | /customers | 顧客一覧取得 |
| GET | /customers/:id | 顧客詳細取得 |
| GET | /customers/search | 顧客検索 |
| POST | /voice/call | 発信 |
| POST | /voice/hangup | 通話終了 |
| GET | /voice/history | 通話履歴取得 |
| GET | /voice/recording/:id | 録音情報取得 |
| POST | /messaging/send | SMS送信 |
| GET | /conversations | 会話一覧取得 |
| GET | /conversations/:id/messages | メッセージ取得 |
| GET | /tasks | タスク一覧取得 |
| POST | /tasks | タスク作成 |
| PUT | /tasks/:id | タスク更新 |
| POST | /tasks/:id/complete | タスク完了 |
| GET | /notifications | 通知一覧取得 |
| PUT | /notifications/:id/read | 通知既読 |
| PUT | /notifications/read-all | 全通知既読 |
| POST | /activities | 活動登録 |

### 5.2 認証

すべてのAPIはJWT Bearer認証を使用。

```
Authorization: Bearer <jwt_token>
```

---

## 6. 環境変数

### 6.1 Twilio Functions環境変数

| 変数名 | 説明 |
|--------|------|
| ACCOUNT_SID | TwilioアカウントSID |
| AUTH_TOKEN | Twilio認証トークン |
| TWILIO_PHONE_NUMBER | Twilio電話番号 |
| VERIFY_SERVICE_SID | Twilio Verify Service SID |
| NOTIFY_SERVICE_SID | Twilio Notify Service SID |
| MESSAGING_SERVICE_SID | Twilio Messaging Service SID |
| VOICE_INTELLIGENCE_SID | Voice Intelligence Service SID |
| SF_USERNAME | Salesforceユーザー名 |
| SF_PASSWORD | Salesforceパスワード |
| SF_SECURITY_TOKEN | Salesforceセキュリティトークン |
| SF_LOGIN_URL | SalesforceログインURL |
| OPENAI_API_KEY | OpenAI APIキー |
| JWT_SECRET | JWT署名シークレット |
| NG_WORDS | NGワードリスト（カンマ区切り） |

---

## 7. セキュリティ要件

### 7.1 認証・認可
- JWT Bearer認証（有効期限: 24時間）
- Twilio Verify による2段階認証必須
- API Rate Limiting（100リクエスト/分/ユーザー）

### 7.2 データ保護
- 通信はすべてHTTPS
- Salesforce Shield による暗号化（オプション）
- 録音データは90日後に自動削除

### 7.3 監査ログ
- 全API呼び出しをログ記録
- Salesforceログイン履歴
- 通話録音アクセスログ

---

## 8. 非機能要件

### 8.1 パフォーマンス
| 項目 | 目標値 |
|------|--------|
| API応答時間 | < 500ms（95パーセンタイル） |
| 通話接続時間 | < 3秒 |
| 文字起こし遅延 | < 2秒 |

### 8.2 可用性
| 項目 | 目標値 |
|------|--------|
| システム稼働率 | 99.9% |
| 計画停止時間 | 月4時間以内 |

### 8.3 スケーラビリティ
- Twilio Functions: 自動スケール
- Salesforce API: 同時接続数に応じたライセンス

---

## 9. コスト見積もり

### 9.1 Twilio費用（月間）

| サービス | 単価 | 想定利用量 | 月額概算 |
|----------|------|-----------|----------|
| Voice（発信） | ¥2.5/分 | 10,000分 | ¥25,000 |
| Voice（着信） | ¥1/分 | 5,000分 | ¥5,000 |
| Voice Intelligence | ¥1.5/分 | 15,000分 | ¥22,500 |
| Verify | ¥9/認証 | 1,000回 | ¥9,000 |
| Messaging | ¥10/通 | 2,000通 | ¥20,000 |
| Functions | ¥0.0001/実行 | 500,000回 | ¥50 |
| Notify | ¥0.5/通知 | 10,000回 | ¥5,000 |
| 電話番号 | ¥1,100/月 | 1番号 | ¥1,100 |
| **合計** | | | **約¥87,650** |

### 9.2 その他費用

| 項目 | 月額概算 |
|------|----------|
| Salesforce（Enterprise） | ¥18,000/ユーザー |
| OpenAI API | ¥10,000〜30,000 |
| YouWire（オプション） | 要問合せ |

---

## 改訂履歴

| 版 | 日付 | 変更内容 |
|----|------|----------|
| 1.0 | 2025-01-24 | 初版作成 |
