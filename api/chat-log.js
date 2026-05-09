const MAX_FIELD_LENGTH = 600;

// フロントエンドから受け取り、GAS WebhookにSecretトークンを付与して転送する
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false });
  }

  const webhookUrl = process.env.CHAT_LOG_WEBHOOK_URL;
  const secret     = process.env.CHAT_LOG_SECRET;

  // 環境変数未設定の場合はログをスキップ（開発環境対応）
  if (!webhookUrl || !secret) {
    console.log('[chat-log] env vars missing: webhookUrl=', !!webhookUrl, 'secret=', !!secret);
    return res.status(200).json({ ok: true });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ ok: false }); }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false });
  }

  const str = (v) => String(v || '').slice(0, MAX_FIELD_LENGTH);

  const payload = {
    token:             secret,
    pageUrl:           str(body.pageUrl),
    sessionId:         str(body.sessionId).slice(0, 64),
    deviceType:        str(body.deviceType).slice(0, 20),
    eventType:         str(body.eventType).slice(0, 50),
    userMessage:       str(body.userMessage),
    selectedQuestion:  str(body.selectedQuestion),
    botAnswer:         str(body.botAnswer),
    matchedFaqId:      str(body.matchedFaqId).slice(0, 50),
    matchedFaqTitle:   str(body.matchedFaqTitle).slice(0, 200),
    source:            str(body.source).slice(0, 50),
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
      signal:  controller.signal,
    });
    clearTimeout(timeout);
    const responseText = await response.text();
    console.log('[chat-log] GAS status=', response.status, 'body=', responseText);
    return res.status(200).json({ ok: response.ok });
  } catch (err) {
    console.log('[chat-log] fetch error:', err.message);
    return res.status(200).json({ ok: false });
  }
};
