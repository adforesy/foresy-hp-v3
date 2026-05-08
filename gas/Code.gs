// ============================================================
// Google Apps Script - Foresyチャットログ受信 & スプレッドシート記録
// ============================================================
// 設定手順:
//   1. このコードを Google Apps Script に貼り付ける
//   2. SHEET_ID を実際のスプレッドシートIDに変更
//   3. SECRET_TOKEN を Vercel 環境変数 CHAT_LOG_SECRET と同じ値に変更
//   4. 「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」
//   5. 「次のユーザーとして実行」=「自分」、「アクセス」=「全員」で公開
//   6. 発行された URL を Vercel 環境変数 CHAT_LOG_WEBHOOK_URL に設定
// ============================================================

var SHEET_ID     = 'YOUR_SPREADSHEET_ID_HERE'; // ← スプレッドシートIDに変更
var SECRET_TOKEN = 'YOUR_SECRET_TOKEN_HERE';    // ← Vercel の CHAT_LOG_SECRET と同じ値に変更
var SHEET_NAME   = 'チャットログ';
var MAX_FIELD_LENGTH = 600;

// 電話番号・メールアドレス・郵便番号をマスクする
function maskPII(text) {
  if (typeof text !== 'string') return '';
  var masked = text;
  masked = masked.replace(/\d{2,4}[-\s]?\d{2,4}[-\s]?\d{4}/g, '[TEL]');
  masked = masked.replace(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');
  masked = masked.replace(/〒?\d{3}[-\s]?\d{4}/g, '[ZIPCODE]');
  return masked;
}

// 文字列として安全に取得（長さ制限付き）
function safeStr(v, maxLen) {
  var s = String(v || '');
  return s.slice(0, maxLen || MAX_FIELD_LENGTH);
}

function doPost(e) {
  try {
    var raw  = e.postData && e.postData.contents ? e.postData.contents : '{}';
    var data = JSON.parse(raw);

    // シークレットトークン検証
    if (!data.token || data.token !== SECRET_TOKEN) {
      return buildResponse(false);
    }

    var row = [
      new Date().toISOString(),              // タイムスタンプ（サーバー時刻）
      safeStr(data.pageUrl, 300),
      safeStr(data.sessionId, 64),
      safeStr(data.deviceType, 20),
      safeStr(data.eventType, 50),
      maskPII(safeStr(data.userMessage)),    // PII マスク済み
      safeStr(data.selectedQuestion, 200),
      maskPII(safeStr(data.botAnswer)),
      safeStr(data.matchedFaqId, 50),
      safeStr(data.matchedFaqTitle, 200),
      safeStr(data.source, 50),
    ];

    var ss    = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);

    // シートが存在しない場合は作成してヘッダー行を追加
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'timestamp', 'pageUrl', 'sessionId', 'deviceType',
        'eventType', 'userMessage', 'selectedQuestion', 'botAnswer',
        'matchedFaqId', 'matchedFaqTitle', 'source',
      ]);
    }

    sheet.appendRow(row);
    return buildResponse(true);

  } catch (err) {
    // エラーの詳細は外部に返さない
    return buildResponse(false);
  }
}

function buildResponse(ok) {
  var output = ContentService.createTextOutput(JSON.stringify({ ok: ok }));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
