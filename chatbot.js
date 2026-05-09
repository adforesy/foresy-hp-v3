(function () {
  'use strict';

  // ============================================================
  // FAQ データ（編集はこのブロックを変更してください）
  // ============================================================
  var FAQ_DATA = [
    {
      id: 'start-ads',
      title: '広告を始めたい',
      keywords: ['始めたい', 'はじめたい', '開始', 'スタート', '新規', '初めて', 'これから', '初回'],
      answer: 'Google広告・LINEヤフー広告のどちらも対応しています。\n\n初期設定費 ¥50,000（一回のみ）＋ 月次管理費 ¥30,000/月からスタートできます。\n\n業種・目的・予算をお聞きして最適な方法をご提案しますので、まずはお気軽にご相談ください。',
      ctas: [{ label: '無料相談を申し込む', href: 'contact.html' }],
    },
    {
      id: 'improve-ads',
      title: '今の広告を改善したい',
      keywords: ['改善', '最適化', '効率', '費用対効果', 'ROAS', 'CPA', '成果が出ない', '効果がない', '無駄', '悪い', '引き継ぎ'],
      answer: '現在の広告アカウントを拝見して、課題を診断します。\n\n・無駄なクリックの削除\n・入札戦略の見直し\n・キーワード精査\n\n週次チェックと月1〜2回の最適化で費用を抑えながら成果を高めます。既存アカウントの引き継ぎも対応可能です。',
      ctas: [{ label: '無料相談を申し込む', href: 'contact.html' }],
    },
    {
      id: 'report-analytics',
      title: 'レポート・分析が大変',
      keywords: ['レポート', '分析', 'データ', 'GA4', 'Looker Studio', 'ダッシュボード', '可視化', '自動化', '手間', '面倒', '確認'],
      answer: 'GA4 × Looker Studioで、毎月自動更新されるダッシュボードを構築します。\n\n「どのキーワードから問い合わせが来たか」「費用対効果が改善しているか」を一目で確認できます。\n\nレポート共有は月次管理費に含まれています。',
      ctas: [{ label: 'サービス詳細を見る', href: 'services.html' }, { label: '相談する', href: 'contact.html' }],
    },
    {
      id: 'lp-measurement',
      title: 'LPや計測を整えたい',
      keywords: ['LP', 'ランディングページ', '計測', 'GTM', 'タグ', 'コンバージョン', 'HP', 'ホームページ', '制作', 'サイト', 'tracking'],
      answer: 'LP制作・GTM設定・コンバージョン計測の設計をワンストップで対応します。\n\n「広告は出しているが問い合わせが計測できていない」「LPの訴求を見直したい」といったご相談も歓迎です。\n\n詳しくはサービスページをご覧ください。',
      ctas: [{ label: 'サービス詳細を見る', href: 'services.html' }, { label: '相談する', href: 'contact.html' }],
    },
    {
      id: 'price',
      title: '料金を知りたい',
      keywords: ['料金', '費用', 'いくら', '価格', '値段', '金額', '月額', '初期費用', '円', 'お金', 'コスト'],
      answer: '料金体系はシンプルです。\n\n・初期設定費：¥50,000（一回のみ）\n・月次管理費：¥30,000/月（最低3ヶ月〜）\n\n広告費（媒体費）はお客様のクレジットカード直接払いのため、Foresyへのお支払いはこの2種類のみです。\n\n媒体費が¥150,000/月を超えると、媒体費の20%の手数料制にも移行できます。',
      ctas: [{ label: 'サービス詳細を見る', href: 'services.html' }, { label: '相談する', href: 'contact.html' }],
    },
    {
      id: 'budget',
      title: '予算はいくら必要？',
      keywords: ['予算', '広告費', '媒体費', '月いくら', 'いくらから', '最低', '目安', '少ない', '小さい'],
      answer: '媒体費（広告費）の目安は月¥30,000〜¥100,000です。\n\n業種・地域・競合状況によって適正な予算は異なります。\n\n「この予算で始めて大丈夫か？」は無料相談でお気軽にご確認ください。費用対効果を正直にお伝えします。',
      ctas: [{ label: '無料相談を申し込む', href: 'contact.html' }],
    },
    {
      id: 'contract-flow',
      title: '契約の流れを知りたい',
      keywords: ['契約', '流れ', '手続き', '申し込み', '始め方', 'プロセス', 'ステップ', 'どうすれば', 'どうやって', 'いつから'],
      answer: '契約の流れはこちらです。\n\n① 無料相談（オンライン or メール）\n② ご提案・お見積もり\n③ ご契約・初期設定費のお支払い\n④ アカウント開設 or 引き継ぎ\n⑤ 運用開始\n\n最短1週間程度で運用を始められます。',
      ctas: [{ label: '無料相談を申し込む', href: 'contact.html' }],
    },
    {
      id: 'cancel',
      title: '途中でやめられますか？',
      keywords: ['解約', '辞める', 'やめる', '途中', 'キャンセル', '契約期間', '縛り', '期間', '何ヶ月', '3ヶ月'],
      answer: '最低契約期間は3ヶ月です。\n\n3ヶ月以降は毎月更新で、1ヶ月前の申し出で解約できます。\n\n3ヶ月で方向性を確認しながら進めるスタイルなので、まずは試していただくことができます。',
      ctas: [{ label: '詳しく相談する', href: 'contact.html' }],
    },
    {
      id: 'self-operation',
      title: '自分でもできますか？',
      keywords: ['自分', '自社', 'セルフ', '一人', '社内', 'インハウス', '自分でも', '自分でやる', '代理店なし', '独学'],
      answer: 'もちろん自分で運用することも可能です。\n\nただし、設定ミスや最適化の遅れで広告費を無駄にするケースも多くあります。\n\nForesyでは進捗をわかりやすく共有するスタイルで、「丸投げ」ではなく「一緒に運用する」感覚で進めます。',
      ctas: [{ label: '無料相談する', href: 'contact.html' }],
    },
    {
      id: 'consult',
      title: 'まず相談だけしたい',
      keywords: ['相談', '聞きたい', '問い合わせ', '質問', '確認', '話だけ', '聞くだけ', 'まず', 'とりあえず'],
      answer: 'もちろんです。無理な売り込みは一切しません。\n\n現状の課題をお聞きして、広告が有効かどうか正直にお伝えします。「まずは話を聞いてみたい」という段階でも大歓迎です。',
      ctas: [{ label: '無料相談を申し込む', href: 'contact.html' }],
    },
  ];

  // ============================================================
  // 定数
  // ============================================================
  var MAX_INPUT_LENGTH = 500;
  var MAX_SENDS_PER_SESSION = 30;
  var SEND_THROTTLE_MS = 2500;
  var FALLBACK_ANSWER = '詳しい内容は個別にご確認します。お問い合わせフォームよりお気軽にご相談ください。';
  var FALLBACK_CTAS = [{ label: 'お問い合わせ', href: 'contact.html' }];
  var PII_ANSWER = '個人情報の入力はお控えください。お問い合わせフォームよりお送りください。';

  // ============================================================
  // 状態
  // ============================================================
  var isOpen = false;
  var sessionId = 'sess_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  var sendCount = 0;
  var lastSendTime = 0;
  var deviceType = /Mobi|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop';

  // ============================================================
  // CSS 注入
  // ============================================================
  function injectStyles() {
    var css = [
      /* アニメーション */
      '@keyframes cb-pulse{0%,100%{box-shadow:0 4px 16px rgba(74,122,90,.45),0 0 0 0 rgba(74,122,90,.35);}60%{box-shadow:0 4px 16px rgba(74,122,90,.45),0 0 0 10px rgba(74,122,90,0);}}',
      /* ボタン */
      '#chatbot-btn{position:fixed;bottom:24px;right:24px;height:52px;padding:0 20px 0 16px;border-radius:26px;background:#4A7A5A;border:none;cursor:pointer;display:flex;align-items:center;gap:8px;box-shadow:0 4px 16px rgba(74,122,90,.45);z-index:9000;transition:transform .2s,box-shadow .2s;animation:cb-pulse 2.4s ease-in-out 1s 3;}',
      '#chatbot-btn:hover{transform:translateY(-2px);box-shadow:0 6px 22px rgba(74,122,90,.55);animation:none;}',
      '#chatbot-btn.is-open{display:none;}',
      '#chatbot-btn-label{color:#fff;font-size:14px;font-weight:600;font-family:inherit;white-space:nowrap;letter-spacing:.02em;}',
      /* パネル */
      '#chatbot-panel{position:fixed;bottom:92px;right:24px;width:360px;height:540px;background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.16);z-index:9000;display:flex;flex-direction:column;overflow:hidden;transition:opacity .2s,transform .2s;}',
      '#chatbot-panel.hidden{opacity:0;pointer-events:none;transform:translateY(12px);}',
      /* ヘッダー */
      '.cb-header{background:#2E5038;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}',
      '.cb-header-info{display:flex;align-items:center;gap:10px;}',
      '.cb-avatar{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;}',
      '.cb-title{color:#fff;font-weight:700;font-size:14px;margin:0;line-height:1.3;}',
      '.cb-sub{color:rgba(255,255,255,.75);font-size:11px;margin:0;}',
      '.cb-close{background:rgba(255,255,255,.15);border:none;color:#fff;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}',
      '.cb-close:hover{background:rgba(255,255,255,.3);}',
      /* メッセージエリア */
      '#cb-messages{flex:1;overflow-y:auto;padding:14px 12px;background:#F5F3EE;display:flex;flex-direction:column;gap:10px;}',
      '.cb-msg{display:flex;flex-direction:column;max-width:88%;}',
      '.cb-msg--bot{align-self:flex-start;}',
      '.cb-msg--user{align-self:flex-end;}',
      '.cb-bubble{padding:10px 13px;border-radius:14px;font-size:13px;line-height:1.65;word-break:break-word;}',
      '.cb-msg--bot .cb-bubble{background:#fff;color:#1A1A18;border-radius:4px 14px 14px 14px;box-shadow:0 1px 4px rgba(0,0,0,.07);}',
      '.cb-msg--user .cb-bubble{background:#4A7A5A;color:#fff;border-radius:14px 14px 4px 14px;}',
      '.cb-ctas{display:flex;flex-wrap:wrap;gap:6px;margin-top:7px;}',
      '.cb-cta-btn{background:#fff;border:1.5px solid #4A7A5A;color:#4A7A5A;border-radius:20px;padding:5px 13px;font-size:12px;font-weight:600;text-decoration:none;cursor:pointer;transition:background .15s,color .15s;white-space:nowrap;}',
      '.cb-cta-btn:hover{background:#4A7A5A;color:#fff;}',
      /* クイック質問 */
      '#cb-quick{padding:8px 12px;background:#fff;border-top:1px solid #EDEAE3;display:flex;gap:6px;overflow-x:auto;flex-shrink:0;scroll-behavior:smooth;}',
      '#cb-quick::-webkit-scrollbar{height:3px;}',
      '#cb-quick::-webkit-scrollbar-track{background:#F5F3EE;}',
      '#cb-quick::-webkit-scrollbar-thumb{background:#C8D9CC;border-radius:2px;}',
      '.cb-q-btn{flex-shrink:0;background:#f0f7f3;border:1.5px solid #C8D9CC;color:#2E5038;border-radius:20px;padding:5px 12px;font-size:12px;cursor:pointer;white-space:nowrap;transition:background .15s;}',
      '.cb-q-btn:hover{background:#C8D9CC;}',
      /* 入力エリア */
      '.cb-input-wrap{display:flex;align-items:flex-end;gap:7px;padding:10px 12px;border-top:1px solid #EDEAE3;background:#fff;flex-shrink:0;}',
      '#cb-input{flex:1;resize:none;border:1.5px solid #d1d5db;border-radius:10px;padding:8px 10px;font-size:13px;font-family:inherit;line-height:1.5;max-height:90px;min-height:38px;outline:none;transition:border-color .2s;}',
      '#cb-input:focus{border-color:#4A7A5A;box-shadow:0 0 0 3px rgba(74,122,90,.1);}',
      '#cb-send{background:#4A7A5A;border:none;color:#fff;border-radius:10px;width:38px;height:38px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:background .15s;}',
      '#cb-send:hover{background:#2E5038;}',
      '#cb-send:disabled{background:#9ca3af;cursor:not-allowed;}',
      '#cb-charcount{padding:2px 12px 7px;font-size:10px;color:#9B9991;text-align:right;background:#fff;flex-shrink:0;}',
      /* モバイル */
      '@media(max-width:640px){',
      '#chatbot-btn{bottom:16px;right:12px;height:46px;padding:0 16px 0 13px;gap:6px;}',
      '#chatbot-btn-label{font-size:13px;}',
      '#chatbot-panel{bottom:72px;left:0;right:0;width:100%;height:calc(100dvh - 80px);border-radius:20px 20px 0 0;}',
      '}',
    ].join('');
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ============================================================
  // PII 検出・マスク
  // ============================================================
  var PII_PATTERNS = [
    /\d{2,4}[-\s]?\d{2,4}[-\s]?\d{4}/,
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/,
    /〒?\d{3}[-\s]?\d{4}/,
  ];

  function hasPII(text) {
    return PII_PATTERNS.some(function (re) { return re.test(text); });
  }

  function maskPII(text) {
    var masked = text;
    masked = masked.replace(/\d{2,4}[-\s]?\d{2,4}[-\s]?\d{4}/g, '[TEL]');
    masked = masked.replace(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');
    masked = masked.replace(/〒?\d{3}[-\s]?\d{4}/g, '[ZIPCODE]');
    return masked;
  }

  // ============================================================
  // FAQ マッチング
  // ============================================================
  function generateAnswer(query) {
    var q = query.toLowerCase();
    for (var j = 0; j < FAQ_DATA.length; j++) {
      var faq = FAQ_DATA[j];
      for (var k = 0; k < faq.keywords.length; k++) {
        if (q.includes(faq.keywords[k].toLowerCase())) {
          return { answer: faq.answer, faq: faq, ctas: faq.ctas };
        }
      }
    }
    return { answer: FALLBACK_ANSWER, faq: null, ctas: FALLBACK_CTAS };
  }

  // ============================================================
  // ログ送信（/api/chat-log 経由でGASに転送）
  // ============================================================
  function logEvent(data) {
    try {
      fetch('/api/chat-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageUrl: window.location.href,
          sessionId: sessionId,
          deviceType: deviceType,
          source: 'chatbot',
          eventType: data.eventType || 'message',
          userMessage: data.userMessage || '',
          selectedQuestion: data.selectedQuestion || '',
          botAnswer: data.botAnswer || '',
          matchedFaqId: data.matchedFaqId || '',
          matchedFaqTitle: data.matchedFaqTitle || '',
        }),
      }).catch(function () {});
    } catch (e) {}
  }

  // ============================================================
  // UI 構築
  // ============================================================
  var messagesEl, inputEl, sendBtn, charCount, panelEl, btnEl;

  function createUI() {
    /* ボタン */
    btnEl = document.createElement('button');
    btnEl.id = 'chatbot-btn';
    btnEl.setAttribute('aria-label', 'チャットを開く');
    btnEl.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>' +
      '<span id="chatbot-btn-label">広告を相談する</span>';
    document.body.appendChild(btnEl);

    /* パネル */
    panelEl = document.createElement('div');
    panelEl.id = 'chatbot-panel';
    panelEl.setAttribute('role', 'dialog');
    panelEl.setAttribute('aria-label', 'Foresy 広告相談チャット');
    panelEl.classList.add('hidden');
    panelEl.innerHTML = [
      '<div class="cb-header">',
      '  <div class="cb-header-info">',
      '    <div class="cb-avatar" aria-hidden="true">',
      '      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
      '    </div>',
      '    <div>',
      '      <p class="cb-title">Foresy 広告相談</p>',
      '      <p class="cb-sub">広告・LP・計測のご質問にお答えします</p>',
      '    </div>',
      '  </div>',
      '  <button class="cb-close" id="chatbot-close" aria-label="閉じる">✕</button>',
      '</div>',
      '<div id="cb-messages"></div>',
      '<div id="cb-quick"></div>',
      '<div class="cb-input-wrap">',
      '  <textarea id="cb-input" rows="1" maxlength="500" placeholder="ご質問を入力してください..." aria-label="メッセージ入力"></textarea>',
      '  <button id="cb-send" aria-label="送信">',
      '    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>',
      '  </button>',
      '</div>',
      '<div id="cb-charcount">0 / 500</div>',
    ].join('');
    document.body.appendChild(panelEl);

    messagesEl = document.getElementById('cb-messages');
    inputEl    = document.getElementById('cb-input');
    sendBtn    = document.getElementById('cb-send');
    charCount  = document.getElementById('cb-charcount');

    renderQuickButtons();
    bindEvents();
  }

  function renderQuickButtons() {
    var container = document.getElementById('cb-quick');
    if (!container) return;
    container.innerHTML = '';
    FAQ_DATA.forEach(function (faq) {
      var btn = document.createElement('button');
      btn.className = 'cb-q-btn';
      btn.textContent = faq.title;
      btn.addEventListener('click', function () { handleQuickButton(faq); });
      container.appendChild(btn);
    });
  }

  // ============================================================
  // メッセージ追加（テキストはすべて textContent で安全にレンダリング）
  // ============================================================
  function addMessage(role, text, ctas) {
    var wrap = document.createElement('div');
    wrap.className = 'cb-msg cb-msg--' + role;

    var bubble = document.createElement('div');
    bubble.className = 'cb-bubble';
    text.split('\n').forEach(function (line, i) {
      if (i > 0) bubble.appendChild(document.createElement('br'));
      bubble.appendChild(document.createTextNode(line));
    });
    wrap.appendChild(bubble);

    if (ctas && ctas.length > 0) {
      var ctaDiv = document.createElement('div');
      ctaDiv.className = 'cb-ctas';
      ctas.forEach(function (cta) {
        var a = document.createElement('a');
        a.className = 'cb-cta-btn';
        a.textContent = cta.label;
        a.href = cta.href;
        ctaDiv.appendChild(a);
      });
      wrap.appendChild(ctaDiv);
    }

    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // ============================================================
  // ウェルカムメッセージ
  // ============================================================
  function showWelcome() {
    addMessage(
      'bot',
      'こんにちは。Google広告・LINEヤフー広告・LP制作・計測設計など、お気軽にご質問ください。\nよくある質問から選ぶこともできます。',
      []
    );
  }

  // ============================================================
  // 送信処理
  // ============================================================
  function handleQuickButton(faq) {
    addMessage('user', faq.title, []);
    addMessage('bot', faq.answer, faq.ctas);
    logEvent({
      eventType: 'quick_button',
      selectedQuestion: faq.title,
      botAnswer: faq.answer,
      matchedFaqId: faq.id,
      matchedFaqTitle: faq.title,
    });
  }

  function handleFreeInput() {
    var text = inputEl.value.trim();
    if (!text || text.length > MAX_INPUT_LENGTH) return;

    /* 連投制限 */
    var now = Date.now();
    if (now - lastSendTime < SEND_THROTTLE_MS) {
      addMessage('bot', '少し間を空けてから送信してください。', []);
      return;
    }
    if (sendCount >= MAX_SENDS_PER_SESSION) {
      addMessage('bot', '本日のご質問の上限に達しました。お問い合わせフォームよりご連絡ください。', FALLBACK_CTAS);
      return;
    }

    /* PII チェック */
    if (hasPII(text)) {
      addMessage('user', '（個人情報を含む入力）', []);
      addMessage('bot', PII_ANSWER, [{ label: 'お問い合わせフォーム', href: 'contact.html' }]);
      inputEl.value = '';
      charCount.textContent = '0 / 500';
      return;
    }

    lastSendTime = now;
    sendCount++;

    addMessage('user', text, []);
    inputEl.value = '';
    inputEl.style.height = 'auto';
    charCount.textContent = '0 / 500';

    var result = generateAnswer(text);
    addMessage('bot', result.answer, result.ctas);

    logEvent({
      eventType: 'free_input',
      userMessage: maskPII(text),
      botAnswer: result.answer,
      matchedFaqId: result.faq ? result.faq.id : '',
      matchedFaqTitle: result.faq ? result.faq.title : '',
    });
  }

  // ============================================================
  // パネル開閉
  // ============================================================
  function togglePanel(forceState) {
    isOpen = typeof forceState === 'boolean' ? forceState : !isOpen;
    if (isOpen) {
      panelEl.classList.remove('hidden');
      btnEl.classList.add('is-open');
      inputEl.focus();
    } else {
      panelEl.classList.add('hidden');
      btnEl.classList.remove('is-open');
    }
  }

  // ============================================================
  // イベントバインド
  // ============================================================
  function bindEvents() {
    btnEl.addEventListener('click', function () { togglePanel(); });
    document.getElementById('chatbot-close').addEventListener('click', function () { togglePanel(false); });

    inputEl.addEventListener('input', function () {
      var len = inputEl.value.length;
      charCount.textContent = len + ' / 500';
      charCount.style.color = len > 450 ? '#ef4444' : '#9B9991';
      inputEl.style.height = 'auto';
      inputEl.style.height = Math.min(inputEl.scrollHeight, 90) + 'px';
    });

    /* Enter 送信（Shift+Enter は改行） */
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleFreeInput();
      }
    });

    sendBtn.addEventListener('click', function () { handleFreeInput(); });

    /* パネル外クリックで閉じる */
    document.addEventListener('click', function (e) {
      if (isOpen && !panelEl.contains(e.target) && !btnEl.contains(e.target)) {
        togglePanel(false);
      }
    });
  }

  // ============================================================
  // 初期化
  // ============================================================
  function init() {
    injectStyles();
    createUI();
    showWelcome();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
