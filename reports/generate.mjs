import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __dir = dirname(fileURLToPath(import.meta.url));
const clients = JSON.parse(readFileSync(join(__dir, 'clients.json'), 'utf8'));

// 認証：OAuth2リフレッシュトークン → サービスアカウントJSON → ADC の順で試行
import { OAuth2Client } from 'google-auth-library';

function buildAuthClient() {
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (refreshToken) {
    const oauth2 = new OAuth2Client(
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET
    );
    oauth2.setCredentials({ refresh_token: refreshToken });
    return { authClient: oauth2 };
  }
  const keyFilename = process.env.GA4_SERVICE_ACCOUNT_JSON;
  if (keyFilename) return { keyFilename };
  return {}; // ADC フォールバック
}

const ga4 = new BetaAnalyticsDataClient(buildAuthClient());

// ---- データ取得 ------------------------------------------------

async function fetchKPI(propertyId, startDate, endDate) {
  const [res] = await ga4.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'conversions' },
      { name: 'sessionConversionRate' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
    ],
  });
  const row = res.rows?.[0]?.metricValues ?? [];
  return {
    sessions: Number(row[0]?.value ?? 0),
    users: Number(row[1]?.value ?? 0),
    conversions: Number(row[2]?.value ?? 0),
    cvr: Number(row[3]?.value ?? 0),
    avgDuration: Number(row[4]?.value ?? 0),
    bounceRate: Number(row[5]?.value ?? 0),
  };
}

async function fetchDailyTrend(propertyId, startDate, endDate) {
  const [res] = await ga4.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'sessions' }, { name: 'conversions' }],
    orderBys: [{ dimension: { dimensionName: 'date' } }],
  });
  return (res.rows ?? []).map(r => ({
    date: r.dimensionValues[0].value,
    sessions: Number(r.metricValues[0].value),
    conversions: Number(r.metricValues[1].value),
  }));
}

async function fetchChannelMix(propertyId, startDate, endDate) {
  const [res] = await ga4.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 8,
  });
  return (res.rows ?? []).map(r => ({
    channel: r.dimensionValues[0].value,
    sessions: Number(r.metricValues[0].value),
  }));
}

async function fetchDeviceMix(propertyId, startDate, endDate) {
  const [res] = await ga4.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'deviceCategory' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
  });
  return (res.rows ?? []).map(r => ({
    device: r.dimensionValues[0].value,
    sessions: Number(r.metricValues[0].value),
  }));
}

async function fetchTopPages(propertyId, startDate, endDate) {
  const [res] = await ga4.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'landingPage' }],
    metrics: [{ name: 'sessions' }, { name: 'conversions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10,
  });
  return (res.rows ?? []).map(r => ({
    page: r.dimensionValues[0].value,
    sessions: Number(r.metricValues[0].value),
    conversions: Number(r.metricValues[1].value),
  }));
}

// ---- HTML 生成 ------------------------------------------------

function formatDate(yyyymmdd) {
  return `${yyyymmdd.slice(0, 4)}/${yyyymmdd.slice(4, 6)}/${yyyymmdd.slice(6, 8)}`;
}

function pct(n) { return (n * 100).toFixed(1) + '%'; }
function num(n) { return Math.round(n).toLocaleString('ja-JP'); }
function dur(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}分${String(s).padStart(2, '0')}秒`;
}

function buildHTML(client, period, kpi, daily, channels, devices, pages) {
  const channelColors = [
    '#4A7A5A','#7A9E87','#C8D9CC','#C96B3A','#E8A87C',
    '#1A1A18','#5C5B56','#9B9991',
  ];

  const dailyLabels = JSON.stringify(daily.map(d => formatDate(d.date)));
  const dailySessions = JSON.stringify(daily.map(d => d.sessions));
  const dailyConversions = JSON.stringify(daily.map(d => d.conversions));
  const channelLabels = JSON.stringify(channels.map(c => c.channel));
  const channelData = JSON.stringify(channels.map(c => c.sessions));
  const channelColorsJSON = JSON.stringify(channelColors.slice(0, channels.length));
  const deviceLabels = JSON.stringify(devices.map(d => d.device));
  const deviceData = JSON.stringify(devices.map(d => d.sessions));

  const pageRows = pages.map(p => `
    <tr>
      <td class="page-url">${p.page}</td>
      <td class="num">${num(p.sessions)}</td>
      <td class="num">${num(p.conversions)}</td>
      <td class="num">${p.sessions > 0 ? pct(p.conversions / p.sessions) : '0.0%'}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${client.name} — Foresy 月次レポート ${period.label}</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"></script>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --forest:#4A7A5A;--sage:#7A9E87;--mist:#C8D9CC;--cta:#C96B3A;
  --bg:#F5F3EE;--bg2:#EDEAE3;--bg3:#E5E1D8;--dark:#1A1A18;
  --text:#1A1A18;--text2:#5C5B56;--muted:#9B9991;
  --font:'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif;
  --mono:'DM Mono','Courier New',monospace;
}
body{font-family:var(--font);background:var(--bg);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased;}

/* ヘッダー */
.header{background:var(--dark);padding:32px 48px;display:flex;justify-content:space-between;align-items:center;}
.header-logo{color:white;font-size:22px;font-weight:300;letter-spacing:-0.02em;}
.header-logo span{color:var(--sage);font-family:var(--mono);font-size:11px;letter-spacing:0.1em;display:block;margin-bottom:4px;}
.header-meta{text-align:right;}
.header-client{color:white;font-size:20px;font-weight:300;}
.header-period{color:rgba(255,255,255,0.45);font-family:var(--mono);font-size:11px;margin-top:4px;}

/* メインコンテンツ */
.main{max-width:1100px;margin:0 auto;padding:40px 48px;}

/* KPI カード */
.kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:40px;}
@media(max-width:700px){.kpi-grid{grid-template-columns:repeat(2,1fr);}}
.kpi-card{background:white;border:1px solid var(--mist);border-radius:10px;padding:24px;}
.kpi-label{font-family:var(--mono);font-size:9px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;}
.kpi-value{font-size:32px;font-weight:200;color:var(--text);letter-spacing:-0.02em;line-height:1;}
.kpi-value.accent{color:var(--forest);}
.kpi-sub{font-size:11px;color:var(--muted);margin-top:6px;}

/* セクション */
.section{margin-bottom:40px;}
.section-title{font-size:12px;font-weight:400;color:var(--muted);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid var(--mist);}

/* チャートグリッド */
.chart-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;}
@media(max-width:700px){.chart-grid{grid-template-columns:1fr;}}
.chart-card{background:white;border:1px solid var(--mist);border-radius:10px;padding:24px;}
.chart-card.wide{grid-column:1/-1;}
.chart-wrap{position:relative;height:220px;}

/* テーブル */
.data-table{width:100%;border-collapse:collapse;font-size:13px;}
.data-table th{font-family:var(--mono);font-size:9px;color:var(--muted);letter-spacing:0.08em;text-transform:uppercase;text-align:left;padding:8px 12px;border-bottom:2px solid var(--mist);}
.data-table th.num,.data-table td.num{text-align:right;}
.data-table td{padding:10px 12px;border-bottom:1px solid var(--mist);color:var(--text2);}
.data-table tr:last-child td{border-bottom:none;}
.data-table tr:hover td{background:var(--bg);}
.page-url{font-family:var(--mono);font-size:11px;max-width:400px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

/* フッター */
.footer{background:var(--dark);padding:24px 48px;display:flex;justify-content:space-between;align-items:center;margin-top:48px;}
.footer-note{font-size:11px;color:rgba(255,255,255,0.35);}
.footer-brand{font-size:11px;color:rgba(255,255,255,0.35);font-family:var(--mono);}
</style>
</head>
<body>

<header class="header">
  <div class="header-logo">
    <span>MONTHLY REPORT</span>
    Foresy
  </div>
  <div class="header-meta">
    <div class="header-client">${client.name}</div>
    <div class="header-period">${period.label} &nbsp;|&nbsp; GA4: ${client.propertyId}</div>
  </div>
</header>

<main class="main">

  <!-- KPI サマリー -->
  <div class="section">
    <p class="section-title">サマリー — ${period.start} 〜 ${period.end}</p>
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">セッション数</div>
        <div class="kpi-value">${num(kpi.sessions)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">ユーザー数</div>
        <div class="kpi-value">${num(kpi.users)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">コンバージョン数</div>
        <div class="kpi-value accent">${num(kpi.conversions)}</div>
        <div class="kpi-sub">CVR ${pct(kpi.cvr)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">平均セッション時間</div>
        <div class="kpi-value" style="font-size:24px;">${dur(kpi.avgDuration)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">直帰率</div>
        <div class="kpi-value" style="font-size:24px;">${pct(kpi.bounceRate)}</div>
      </div>
    </div>
  </div>

  <!-- 日別トレンド -->
  <div class="section">
    <p class="section-title">日別トレンド</p>
    <div class="chart-card">
      <div class="chart-wrap">
        <canvas id="chartDaily"></canvas>
      </div>
    </div>
  </div>

  <!-- チャネル × デバイス -->
  <div class="section">
    <p class="section-title">流入チャネル / デバイス</p>
    <div class="chart-grid">
      <div class="chart-card">
        <div class="chart-wrap">
          <canvas id="chartChannel"></canvas>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-wrap">
          <canvas id="chartDevice"></canvas>
        </div>
      </div>
    </div>
  </div>

  <!-- ランディングページ -->
  <div class="section">
    <p class="section-title">流入ページ TOP10</p>
    <div class="chart-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>ランディングページ</th>
            <th class="num">セッション</th>
            <th class="num">CV</th>
            <th class="num">CVR</th>
          </tr>
        </thead>
        <tbody>${pageRows}</tbody>
      </table>
    </div>
  </div>

</main>

<footer class="footer">
  <span class="footer-note">※ このレポートは GA4 Data API により自動生成されています。数値はすべて対象期間の合計値です。</span>
  <span class="footer-brand">Foresy · adforesy@gmail.com</span>
</footer>

<script>
const dailyLabels = ${dailyLabels};
const dailySessions = ${dailySessions};
const dailyConversions = ${dailyConversions};
const channelLabels = ${channelLabels};
const channelData = ${channelData};
const channelColors = ${channelColorsJSON};
const deviceLabels = ${deviceLabels};
const deviceData = ${deviceData};

Chart.defaults.font.family = "'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif";
Chart.defaults.color = '#9B9991';

// 日別トレンド（折れ線）
new Chart(document.getElementById('chartDaily'), {
  type: 'line',
  data: {
    labels: dailyLabels,
    datasets: [
      {
        label: 'セッション',
        data: dailySessions,
        borderColor: '#1A1A18',
        backgroundColor: 'rgba(26,26,24,0.05)',
        borderWidth: 2,
        pointRadius: 3,
        tension: 0.3,
        fill: true,
        yAxisID: 'yLeft',
      },
      {
        label: 'CV',
        data: dailyConversions,
        borderColor: '#4A7A5A',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 3,
        tension: 0.3,
        yAxisID: 'yRight',
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { position: 'top', align: 'end', labels: { boxWidth: 12, font: { size: 11 } } } },
    scales: {
      x: { grid: { color: 'rgba(200,217,204,0.3)' }, ticks: { font: { size: 10 }, maxTicksLimit: 10 } },
      yLeft: { position: 'left', grid: { color: 'rgba(200,217,204,0.3)' }, ticks: { font: { size: 10 } } },
      yRight: { position: 'right', grid: { drawOnChartArea: false }, ticks: { font: { size: 10 } } },
    },
  },
});

// チャネル別（ドーナツ）
new Chart(document.getElementById('chartChannel'), {
  type: 'doughnut',
  data: {
    labels: channelLabels,
    datasets: [{ data: channelData, backgroundColor: channelColors, borderWidth: 2, borderColor: '#F5F3EE' }],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: { position: 'right', labels: { boxWidth: 10, font: { size: 11 }, padding: 12 } },
      title: { display: true, text: '流入チャネル', font: { size: 11, weight: 'normal' }, padding: { bottom: 12 } },
    },
  },
});

// デバイス別（横棒）
new Chart(document.getElementById('chartDevice'), {
  type: 'bar',
  data: {
    labels: deviceLabels,
    datasets: [{ label: 'セッション', data: deviceData, backgroundColor: ['#4A7A5A','#7A9E87','#C8D9CC'], borderRadius: 4 }],
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'デバイス別', font: { size: 11, weight: 'normal' }, padding: { bottom: 12 } },
    },
    scales: {
      x: { grid: { color: 'rgba(200,217,204,0.3)' }, ticks: { font: { size: 10 } } },
      y: { grid: { display: false }, ticks: { font: { size: 12 } } },
    },
  },
});
</script>
</body>
</html>`;
}

// ---- メイン ------------------------------------------------

async function main() {
  // 引数: [YYYYMM] [slug]
  // 例: node generate.mjs          → 前月・全クライアント
  //     node generate.mjs 202503   → 2025年3月・全クライアント
  //     node generate.mjs 202503 foresy-test → 2025年3月・指定クライアントのみ
  const [,, argPeriod, argSlug] = process.argv;

  let y, m;
  if (argPeriod) {
    if (!/^\d{6}$/.test(argPeriod)) {
      console.error('エラー: 期間は YYYYMM 形式で指定してください（例: 202503）');
      process.exit(1);
    }
    y = parseInt(argPeriod.slice(0, 4), 10);
    m = parseInt(argPeriod.slice(4, 6), 10);
  } else {
    const now = new Date();
    y = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    m = now.getMonth() === 0 ? 12 : now.getMonth();
  }

  const startDate = `${y}-${String(m).padStart(2, '0')}-01`;
  const lastDay = new Date(y, m, 0).getDate();
  const endDate = `${y}-${String(m).padStart(2, '0')}-${lastDay}`;
  const label = `${y}年${m}月`;
  const period = { start: startDate, end: endDate, label };

  let targets = clients;
  if (argSlug) {
    targets = clients.filter(c => c.slug === argSlug);
    if (targets.length === 0) {
      console.error(`エラー: slug "${argSlug}" が clients.json に見つかりません`);
      process.exit(1);
    }
  }

  const outDir = join(__dir, 'output');
  mkdirSync(outDir, { recursive: true });

  for (const client of targets) {
    console.log(`\n▶ ${client.name} (GA4: ${client.propertyId})`);
    try {
      const [kpi, daily, channels, devices, pages] = await Promise.all([
        fetchKPI(client.propertyId, startDate, endDate),
        fetchDailyTrend(client.propertyId, startDate, endDate),
        fetchChannelMix(client.propertyId, startDate, endDate),
        fetchDeviceMix(client.propertyId, startDate, endDate),
        fetchTopPages(client.propertyId, startDate, endDate),
      ]);

      const html = buildHTML(client, period, kpi, daily, channels, devices, pages);
      const yyyymm = `${y}${String(m).padStart(2, '0')}`;
      const filename = `${client.slug}-${yyyymm}.html`;
      writeFileSync(join(outDir, filename), html, 'utf8');
      console.log(`  ✓ 生成完了: reports/output/${filename}`);
      console.log(`    セッション: ${num(kpi.sessions)} / CV: ${num(kpi.conversions)} / CVR: ${pct(kpi.cvr)}`);
    } catch (err) {
      console.error(`  ✗ エラー: ${err.message}`);
    }
  }

  console.log('\n完了しました。output/ フォルダのHTMLをVercelにデプロイしてください。');
}

main();
