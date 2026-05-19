/**
 * 一度だけ実行してリフレッシュトークンを取得するスクリプト。
 * 取得後は .env に GOOGLE_REFRESH_TOKEN を追加してください。
 */
import { OAuth2Client } from 'google-auth-library';
import http from 'http';
import { parse } from 'url';
import 'dotenv/config';

const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('エラー: .env に OAUTH_CLIENT_ID と OAUTH_CLIENT_SECRET を設定してください');
  process.exit(1);
}

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/analytics.readonly'],
});

console.log('\n以下のURLをブラウザで開いて adforesy@gmail.com でログインしてください:\n');
console.log(authUrl);
console.log('\n');

// 認証コードを受け取るローカルサーバー
const server = http.createServer(async (req, res) => {
  const { query } = parse(req.url, true);
  if (!query.code) return;

  try {
    const { tokens } = await client.getToken(query.code);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h2>認証成功！ターミナルに戻ってください。</h2>');
    server.close();

    console.log('✓ 認証成功！');
    console.log('\n.env に以下の行を追加してください:\n');
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log('');
  } catch (err) {
    res.writeHead(500);
    res.end('エラーが発生しました: ' + err.message);
    console.error('エラー:', err.message);
  }
});

server.listen(3000, () => {
  console.log('ブラウザで認証後、このターミナルにリフレッシュトークンが表示されます...');
});
