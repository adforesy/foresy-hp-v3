import { readFileSync, writeFileSync } from 'fs';

const DEST = 'C:/Users/ta3i3/Documents/Claude Code/foresy/HP/Foresy-v2/';

const ICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M5 4 L5 14 M5 4 L13 4 M5 9 L11 9" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="14" cy="5" r="2" fill="#C96B3A"/></svg>`;

const QR_SVG = `<svg width="110" height="110" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" fill="white"/><rect x="4" y="4" width="36" height="36" rx="3" fill="#1A1A18"/><rect x="10" y="10" width="24" height="24" rx="2" fill="white"/><rect x="14" y="14" width="16" height="16" rx="1" fill="#1A1A18"/><rect x="80" y="4" width="36" height="36" rx="3" fill="#1A1A18"/><rect x="86" y="10" width="24" height="24" rx="2" fill="white"/><rect x="90" y="14" width="16" height="16" rx="1" fill="#1A1A18"/><rect x="4" y="80" width="36" height="36" rx="3" fill="#1A1A18"/><rect x="10" y="86" width="24" height="24" rx="2" fill="white"/><rect x="14" y="90" width="16" height="16" rx="1" fill="#1A1A18"/><rect x="46" y="4" width="6" height="6" fill="#1A1A18"/><rect x="56" y="4" width="6" height="6" fill="#1A1A18"/><rect x="66" y="4" width="6" height="6" fill="#1A1A18"/><rect x="46" y="14" width="6" height="6" fill="#1A1A18"/><rect x="66" y="14" width="6" height="6" fill="#1A1A18"/><rect x="46" y="24" width="16" height="6" fill="#1A1A18"/><rect x="76" y="46" width="6" height="36" fill="#1A1A18"/><rect x="86" y="46" width="16" height="6" fill="#1A1A18"/><rect x="96" y="56" width="6" height="16" fill="#1A1A18"/></svg>`;

const QR_BTN = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1" stroke="#5C5B56" stroke-width="1.4" fill="none"/><rect x="4" y="4" width="2" height="2" fill="#5C5B56"/><rect x="10" y="2" width="6" height="6" rx="1" stroke="#5C5B56" stroke-width="1.4" fill="none"/><rect x="12" y="4" width="2" height="2" fill="#5C5B56"/><rect x="2" y="10" width="6" height="6" rx="1" stroke="#5C5B56" stroke-width="1.4" fill="none"/><rect x="4" y="12" width="2" height="2" fill="#5C5B56"/><rect x="10" y="10" width="2" height="2" fill="#5C5B56"/><rect x="14" y="10" width="2" height="2" fill="#5C5B56"/><rect x="12" y="12" width="4" height="4" rx="0.5" fill="#5C5B56"/><rect x="10" y="14" width="2" height="2" fill="#5C5B56"/></svg>`;

const NAV_CSS = `
.nav-right{display:flex;align-items:center;gap:12px;}
.nav-qr-btn{width:36px;height:36px;border-radius:6px;border:1px solid var(--mist);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 200ms;}
.nav-qr-btn:hover{background:var(--bg-secondary);}
.nav-qr-panel{position:absolute;top:68px;right:40px;z-index:200;background:white;border:1px solid var(--mist);border-radius:10px;padding:20px;box-shadow:0 8px 32px rgba(0,0,0,0.12);display:none;flex-direction:column;align-items:center;gap:10px;min-width:160px;}
.nav-qr-panel.open{display:flex;}
.nav-qr-label{font-family:var(--font-mono);font-size:10px;color:var(--sage);letter-spacing:0.08em;text-align:center;}`;

const QR_JS = `<script>
function toggleQR(){document.getElementById('qr-panel').classList.toggle('open');}
document.addEventListener('click',(e)=>{if(!e.target.closest('.nav-qr-btn')&&!e.target.closest('#qr-panel')){var p=document.getElementById('qr-panel');if(p)p.classList.remove('open');}});
</script>`;

const makeNav = (active) => {
  const pages = [['services','サービス'],['works','実績'],['about','会社概要'],['faq','FAQ']];
  const links = pages.map(([p,lbl]) =>
    `      <a href="${p}.html"${p===active?' class="active"':''}>${lbl}</a>`
  ).join('\n');
  return `<nav style="position:relative;">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo">
      <div class="nav-logo-mark">${ICON}</div>
      Foresy
    </a>
    <div class="nav-links">
${links}
    </div>
    <div class="nav-right">
      <button class="nav-qr-btn" onclick="toggleQR()" aria-label="LINE QRコード">${QR_BTN}</button>
      <div class="nav-qr-panel" id="qr-panel">${QR_SVG}<span class="nav-qr-label">LINE 公式アカウント<br>友だち追加はこちら</span></div>
      <a href="contact.html" class="nav-cta">無料相談</a>
    </div>
  </div>
</nav>`;
};

const FOOTER = `<section style="background:#1A1A18;padding:72px 40px;text-align:center;"><p style="font-family:'DM Sans',sans-serif;font-weight:200;font-size:clamp(16px,2.5vw,32px);color:white;letter-spacing:-0.02em;margin-bottom:32px;line-height:1.8;">注文やお問合せ数、伸び悩んでいる。<br>広告費は出しているのに成果が見えない。<br>そのお悩み、一度聞かせてください。</p><a href="contact.html" style="background:#C96B3A;color:white;border:none;border-radius:6px;padding:14px 32px;font-size:16px;cursor:pointer;text-decoration:none;display:inline-block;">無料診断はこちら</a></section>
<footer style="background:#1A1A18;border-top:1px solid rgba(255,255,255,0.07);padding:40px 40px 28px;"><div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:40px;"><div><div style="font-size:18px;color:white;font-weight:300;margin-bottom:14px;display:flex;align-items:center;gap:8px;"><div style="width:26px;height:26px;background:#4A7A5A;border-radius:5px;display:flex;align-items:center;justify-content:center;">${ICON}</div>Foresy</div><p style="font-size:13px;color:rgba(245,243,238,0.45);line-height:1.9;">福岡県福岡市<br>adforesy@gmail.com</p></div><div><div style="font-size:10px;color:#7A9E87;letter-spacing:0.1em;margin-bottom:18px;text-transform:uppercase;">PAGES</div><ul style="list-style:none;"><li style="margin-bottom:10px;"><a href="services.html" style="color:rgba(245,243,238,0.55);text-decoration:none;font-size:14px;">サービス</a></li><li style="margin-bottom:10px;"><a href="works.html" style="color:rgba(245,243,238,0.55);text-decoration:none;font-size:14px;">実績</a></li><li style="margin-bottom:10px;"><a href="about.html" style="color:rgba(245,243,238,0.55);text-decoration:none;font-size:14px;">会社概要</a></li><li><a href="faq.html" style="color:rgba(245,243,238,0.55);text-decoration:none;font-size:14px;">FAQ</a></li></ul></div><div><div style="font-size:10px;color:#7A9E87;letter-spacing:0.1em;margin-bottom:18px;text-transform:uppercase;">CONTACT</div><ul style="list-style:none;"><li style="margin-bottom:10px;"><a href="mailto:adforesy@gmail.com" style="color:rgba(245,243,238,0.55);text-decoration:none;font-size:14px;">adforesy@gmail.com</a></li><li><a href="contact.html" style="color:rgba(245,243,238,0.55);text-decoration:none;font-size:14px;">お問い合わせ・無料相談</a></li></ul></div></div><div style="max-width:1200px;margin:28px auto 0;padding-top:20px;border-top:1px solid rgba(255,255,255,0.07);display:flex;justify-content:space-between;"><span style="font-size:11px;color:rgba(245,243,238,0.35);">&copy; 2024 Foresy. All rights reserved.</span><span style="font-size:11px;color:rgba(245,243,238,0.35);">福岡発の広告代理店</span></div></footer>`;

const SRCS = {
  services: 'C:/Users/ta3i3/AppData/Local/Temp/foresy-hp-v2/project/services.html',
  works:    'C:/Users/ta3i3/AppData/Local/Temp/foresy-hp-v2/project/works.html',
  about:    'C:/Users/ta3i3/AppData/Local/Temp/foresy-hp-v2/project/about.html',
  faq:      'C:/Users/ta3i3/AppData/Local/Temp/foresy-hp-v2/project/faq.html',
};

for (const [page, src] of Object.entries(SRCS)) {
  let html = readFileSync(src, 'utf8');
  html = html.replaceAll('href="index.html#footer-cta"', 'href="contact.html"');
  html = html.replaceAll('href="mailto:adforesy@gmail.com"', 'href="contact.html"');
  html = html.replace('</style>', NAV_CSS + '\n</style>');
  html = html.replace(/<nav>[\s\S]*?<\/nav>/, makeNav(page));
  html = html.replace(/<section style="background:var\(--bg-dark\)[\s\S]*<\/footer>/, FOOTER);
  html = html.replace('</body>', QR_JS + '\n</body>');
  writeFileSync(DEST + page + '.html', html, 'utf8');
  console.log('OK', page + '.html');
}
console.log('Done.');
