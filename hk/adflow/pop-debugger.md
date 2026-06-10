---
title: Pop 調試器
description: 在瀏覽器中測試 adflow.js Pop（彈窗）廣告。配置 URL、帳號 ID、廣告位以驗證 S2S 競價。
---

# Pop 調試器

測試 adflow.js 對 **Pop（彈窗 / popunder）**廣告類型的支持：競價成功後，用戶首次點擊頁面任意位置時在後台打開中標廣告。

## 測試配置

<ClientOnly>
<div class="pop-dbg">
  <div class="controls">
    <div class="input-group">
      <label>Server URL</label>
      <input type="text" id="pop-serverUrl" value="https://prebid-server.revosurge-test.com/" style="width: 380px;" />
    </div>
    <div class="input-group">
      <label>Account ID</label>
      <input type="text" id="pop-accountId" value="test" style="width: 140px;" />
    </div>
    <div class="input-group">
      <label>Placement ID</label>
      <input type="text" id="pop-placementId" value="test-pop-1" />
    </div>
    <button id="pop-runBtn">運行測試</button>
  </div>
  <div id="pop-cta" class="pop-cta">
    廣告已就緒 —— 點擊頁面任意位置在後台打開彈窗廣告
  </div>
</div>
</ClientOnly>

## 代碼預覽

根據上方配置自動生成的接入代碼。Pop 廣告位與普通廣告位的唯一區別就是 `data-ad-type="pop"`，且無需 `width` / `height`：

<ClientOnly>
<div class="pop-dbg">
  <div class="card" style="margin-bottom: 24px;">
    <h3>生成的 HTML 代碼</h3>
    <div id="pop-codePreview" class="code-block"></div>
  </div>
</div>
</ClientOnly>

## 測試狀態

<ClientOnly>
<div class="pop-dbg">
  <div class="grid">
    <div class="card">
      <h3>執行狀態</h3>
      <div>
        <div class="test-row"><span class="test-name">腳本加載</span><span class="status pending" id="pop-status-script">等待測試</span></div>
        <div class="test-row"><span class="test-name">配置讀取</span><span class="status pending" id="pop-status-config">等待測試</span></div>
        <div class="test-row"><span class="test-name">廣告位發現</span><span class="status pending" id="pop-status-slots">等待測試</span></div>
        <div class="test-row"><span class="test-name">競價</span><span class="status pending" id="pop-status-auction">等待測試</span></div>
        <div class="test-row"><span class="test-name">中標</span><span class="status pending" id="pop-status-render">等待測試</span></div>
        <div class="test-row"><span class="test-name">後台彈窗</span><span class="status pending" id="pop-status-pop">等待測試</span></div>
      </div>
    </div>
    <div class="card">
      <h3>運行時配置</h3>
      <div id="pop-runtimeConfig" class="config-display">
        <div><span class="key">狀態:</span> <span class="val">未啟動</span></div>
      </div>
    </div>
  </div>
  <div class="card" style="margin-bottom: 24px;">
    <h3>解析結果</h3>
    <div id="pop-winningBid" class="config-display">
      <div><span class="key">狀態:</span> <span class="val">等待競價...</span></div>
    </div>
  </div>
</div>
</ClientOnly>

## 廣告預覽

<ClientOnly>
<div class="pop-dbg">
  <div class="card" style="margin-bottom: 24px;">
    <h3>Pop 廣告位（無頁內預覽）</h3>
    <p style="font-size:14px;color:var(--vp-c-text-2);margin:0;">
      Pop 廣告不在頁面內渲染。競價成功後，請<strong>點擊頁面任意位置</strong> —— adflow.js 會在後台打開中標廣告（彈窗 / popunder）。
      投放結果見上方「執行狀態」「後台彈窗」「解析結果」。
    </p>
    <div class="ad-slot-label" style="margin-top:10px;">隱藏佔位：data-ad-type="pop" · <span id="pop-label-pid">test-pop-1</span></div>
    <div id="pop-ad-container" style="display:none;"></div>
  </div>
</div>
</ClientOnly>

## 日誌

<ClientOnly>
<div class="pop-dbg">
  <div class="card" style="margin-bottom: 20px;">
    <div id="pop-logBox" class="log-box"></div>
  </div>
</div>
</ClientOnly>

<script setup>
import { onMounted, nextTick } from 'vue'

onMounted(async () => {
  await nextTick()
  var logBox = document.getElementById('pop-logBox');
  var auctionComplete = false; // adflow 輸出 "Auction complete" 時置位

  function escapeHtml(str) {
    var d = document.createElement('div');
    d.textContent = str == null ? '' : String(str);
    return d.innerHTML;
  }

  function log(msg, level) {
    level = level || 'info';
    var ts = new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 });
    var line = document.createElement('div');
    line.className = 'log-line ' + level;
    line.innerHTML = '<span class="ts">[' + ts + ']</span>' + escapeHtml(msg);
    logBox.appendChild(line);
    logBox.scrollTop = logBox.scrollHeight;
  }

  function setStatus(id, state, text) {
    var el = document.getElementById(id);
    if (!el) return;
    el.className = 'status ' + state;
    el.textContent = text;
  }

  function showCta() { document.getElementById('pop-cta').classList.add('show'); }
  function hideCta() { document.getElementById('pop-cta').classList.remove('show'); }

  function updateCodePreview() {
    var serverUrl = document.getElementById('pop-serverUrl').value.trim();
    var accountId = document.getElementById('pop-accountId').value.trim();
    var pid = document.getElementById('pop-placementId').value.trim();

    var labelEl = document.getElementById('pop-label-pid');
    if (labelEl) labelEl.textContent = pid;

    var html = '';
    html += '<span class="hl-comment">&lt;!-- 引入 adflow.js --&gt;</span>\n';
    html += '<span class="hl-tag">&lt;script</span> <span class="hl-attr">src</span>=<span class="hl-val">"https://assets.revosurge.com/js/adflow.min.js"</span>\n';
    html += '    <span class="hl-attr">data-server-url</span>=<span class="hl-val">"' + escapeHtml(serverUrl) + '"</span>\n';
    html += '    <span class="hl-attr">data-account-id</span>=<span class="hl-val">"' + escapeHtml(accountId) + '"</span>\n';
    html += '    <span class="hl-attr">data-debug</span><span class="hl-tag">&gt;&lt;/script&gt;</span>\n';
    html += '\n';
    html += '<span class="hl-comment">&lt;!-- Pop 廣告位（無需 width/height） --&gt;</span>\n';
    html += '<span class="hl-tag">&lt;iframe</span> <span class="hl-attr">data-adflow-ad</span>\n';
    html += '    <span class="hl-attr">data-placement-id</span>=<span class="hl-val">"' + escapeHtml(pid) + '"</span>\n';
    html += '    <span class="hl-attr">data-ad-type</span>=<span class="hl-val">"pop"</span><span class="hl-tag">&gt;&lt;/iframe&gt;</span>';

    var preview = document.getElementById('pop-codePreview');
    if (preview) preview.innerHTML = html;
  }

  function trackStatus(msg) {
    if (msg.indexOf('Initializing') !== -1) {
      setStatus('pop-status-script', 'success', '已加載');
      setStatus('pop-status-config', 'success', '已讀取');
    }
    if (msg.indexOf('Found') !== -1 && msg.indexOf('ad slot') !== -1) {
      var match = msg.match(/Found (\d+)/);
      setStatus('pop-status-slots', 'success', '發現 ' + (match ? match[1] : '') + ' 個廣告位');
    }
    if (msg.indexOf('Prebid.js loaded') !== -1 || msg.indexOf('Prebid.js already loaded') !== -1) {
      setStatus('pop-status-auction', 'pending', '競價中...');
    }
    if (msg.indexOf('Loading Prebid.js') !== -1) {
      setStatus('pop-status-auction', 'pending', '加載 Prebid...');
    }
    if (msg.indexOf('Auction complete') !== -1) {
      setStatus('pop-status-auction', 'success', '競價完成');
      auctionComplete = true;
    }
    if (msg.indexOf('won by') !== -1) {
      setStatus('pop-status-render', 'success', '已中標');
    }
    if (msg.indexOf('no bids') !== -1) {
      var el = document.getElementById('pop-status-render');
      if (el && (el.textContent === '等待測試' || el.textContent === '等待中...')) {
        setStatus('pop-status-render', 'warn', '無出價');
      }
    }
    if (msg.indexOf('Failed to load Prebid.js') !== -1) {
      setStatus('pop-status-auction', 'error', 'Prebid 加載失敗');
    }
    if (msg.indexOf('data-account-id is required') !== -1) {
      setStatus('pop-status-config', 'error', '缺少 account-id');
    }
    if (msg.indexOf('No valid') !== -1) {
      setStatus('pop-status-slots', 'error', '未發現廣告位');
    }
    // Pop 狀態由 adflow.js 自身日誌驅動
    if (msg.indexOf('Pop ad ready') !== -1) {
      setStatus('pop-status-pop', 'pending', '已就緒 · 點擊打開');
      showCta();
    }
    if (msg.indexOf('Pop ad opened') !== -1) {
      setStatus('pop-status-pop', 'success', '已打開');
      hideCta();
    }
    if (msg.indexOf('Pop ad blocked') !== -1) {
      setStatus('pop-status-pop', 'error', '被瀏覽器攔截');
    }
    if (msg.indexOf('Pop ad markup write failed') !== -1) {
      setStatus('pop-status-pop', 'warn', '寫入失敗');
    }
  }

  var origLog = console.log;
  var origWarn = console.warn;

  console.log = function() {
    origLog.apply(console, arguments);
    var msg = Array.prototype.slice.call(arguments).join(' ');
    if (msg.indexOf('[AdFlow]') !== -1) { log(msg, 'info'); trackStatus(msg); }
  };

  console.warn = function() {
    origWarn.apply(console, arguments);
    var msg = Array.prototype.slice.call(arguments).join(' ');
    if (msg.indexOf('[AdFlow]') !== -1) { log(msg, 'warn'); trackStatus(msg); }
  };

  function resetState() {
    logBox.innerHTML = '';
    auctionComplete = false;
    hideCta();
    ['pop-status-script', 'pop-status-config', 'pop-status-slots', 'pop-status-auction', 'pop-status-render', 'pop-status-pop'].forEach(function(id) {
      setStatus(id, 'pending', '等待中...');
    });
    document.getElementById('pop-winningBid').innerHTML =
      '<div><span class="key">狀態:</span> <span class="val">等待競價...</span></div>';
    document.getElementById('pop-runtimeConfig').innerHTML =
      '<div><span class="key">狀態:</span> <span class="val">運行中...</span></div>';

    if (window.__adflow) { try { delete window.__adflow; } catch (e) { window.__adflow = undefined; } }

    var old = document.getElementById('pop-adflow-script');
    if (old && old.parentNode) old.parentNode.removeChild(old);
  }

  function makePopIframe(container, pid) {
    container.innerHTML = '';
    var iframe = document.createElement('iframe');
    iframe.setAttribute('data-adflow-ad', '');
    iframe.setAttribute('data-placement-id', pid);
    iframe.setAttribute('data-ad-type', 'pop');
    iframe.style.border = 'none';
    iframe.style.display = 'none';
    container.appendChild(iframe);
    return iframe;
  }

  function injectAdflow(serverUrl, accountId, onload) {
    var script = document.createElement('script');
    script.id = 'pop-adflow-script';
    script.src = 'https://assets.revosurge.com/js/adflow.min.js';
    script.setAttribute('data-server-url', serverUrl);
    script.setAttribute('data-account-id', accountId);
    script.setAttribute('data-debug', '');
    script.onload = function() { log('adflow.js 加載完成', 'success'); if (onload) onload(); };
    script.onerror = function() {
      log('adflow.js 加載失敗！', 'error');
      setStatus('pop-status-script', 'error', '加載失敗');
      enableButtons();
    };
    log('注入 adflow.js 腳本...');
    document.body.appendChild(script);
  }

  function disableButtons() {
    var btn = document.getElementById('pop-runBtn');
    btn.disabled = true;
    btn.textContent = '測試中...';
  }

  function enableButtons() {
    var btn = document.getElementById('pop-runBtn');
    btn.disabled = false;
    btn.textContent = '重新測試';
  }

  function runLiveTest() {
    disableButtons();
    resetState();

    try { delete window.pbjs; } catch (e) { window.pbjs = undefined; }

    var serverUrl = document.getElementById('pop-serverUrl').value.trim();
    var accountId = document.getElementById('pop-accountId').value.trim();
    var pid = document.getElementById('pop-placementId').value.trim();

    log('========== 開始 Pop 實時競價測試 ==========', 'info');
    log('Server URL: ' + serverUrl);
    log('Account ID: ' + accountId);
    log('Placement ID: ' + pid + ' (pop)');

    makePopIframe(document.getElementById('pop-ad-container'), pid);

    injectAdflow(serverUrl, accountId, function() {
      updateRuntimeConfig();
      pollForCompletion();
    });
  }

  // Pop 落地頁解析（與 adflow.js extractPopUrl 保持一致）
  function extractPopUrl(bid) {
    if (!bid) return '';
    var candidates = [bid.adm, bid.ad, bid.ext && bid.ext.popurl];
    for (var i = 0; i < candidates.length; i++) {
      var c = candidates[i];
      if (typeof c !== 'string' || !c) continue;
      var s = c.trim();
      if (/^https?:\/\/\S+$/i.test(s)) return s;
      var stripped = s.replace(/<[^>]*>/g, '').trim();
      var m = stripped.match(/https?:\/\/\S+/i);
      if (m) return m[0];
    }
    return '';
  }

  function showWinningBid(bid) {
    if (!bid) {
      document.getElementById('pop-winningBid').innerHTML =
        '<div><span class="key">狀態:</span> <span class="val">無中標出價</span></div>';
      return;
    }
    var html = '<table class="asset-table">';
    var v = extractPopUrl(bid);
    html += '<tr><td class="asset-key">popurl</td><td class="asset-val' + (v ? '' : ' empty') + '">' + escapeHtml(v || '—') + '</td></tr>';
    html += '</table>';
    document.getElementById('pop-winningBid').innerHTML = html;
  }

  function updateRuntimeConfig() {
    var ads = window.__adflow;
    var el = document.getElementById('pop-runtimeConfig');
    if (!el) return;
    if (!ads || !ads.config) {
      el.innerHTML = '<div><span class="key">狀態:</span> <span class="val">未初始化</span></div>';
      return;
    }
    var c = ads.config;
    var html = '';
    html += '<div><span class="key">Version:</span> <span class="val">' + (ads.version || '-') + '</span></div>';
    html += '<div><span class="key">Server:</span> <span class="val">' + escapeHtml(c.serverUrl) + '</span></div>';
    html += '<div><span class="key">Account:</span> <span class="val">' + escapeHtml(c.accountId) + '</span></div>';
    html += '<div><span class="key">Bidder:</span> <span class="val">' + escapeHtml(c.bidder) + '</span></div>';
    if (ads.slots && ads.slots.length > 0) {
      html += '<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--vp-c-divider);">';
      html += '<div style="font-weight:600;margin-bottom:4px;color:var(--vp-c-text-1);">廣告位:</div>';
      ads.slots.forEach(function(slot) {
        html += '<div><span class="key">' + escapeHtml(slot.code) + ':</span> '
          + '<span class="val">' + escapeHtml(slot.placementId)
          + ' [' + escapeHtml(slot.adType || 'banner') + ']</span></div>';
      });
      html += '</div>';
    }
    el.innerHTML = html;
  }

  function popHasWinner() {
    try {
      var bids = window.pbjs && window.pbjs.getHighestCpmBids
        && window.pbjs.getHighestCpmBids('adflow-slot-0');
      return !!(bids && bids.length);
    } catch (e) { return false; }
  }

  function pollForCompletion() {
    var attempts = 0;
    var maxAttempts = 40; // 約 20 秒

    var timer = setInterval(function() {
      attempts++;
      updateRuntimeConfig();

      // Pop 不在頁內渲染；中標即視為成功（adflow 隨後等待首次點擊打開彈窗）
      if (popHasWinner()) {
        clearInterval(timer);
        finishTest(true);
        return;
      }
      if (auctionComplete) {
        clearInterval(timer);
        finishTest(popHasWinner());
        return;
      }
      if (attempts >= maxAttempts) {
        clearInterval(timer);
        log('測試超時 (20s)', 'warn');
        finishTest(popHasWinner());
      }
    }, 500);
  }

  function showWinningBidFromAuction() {
    try {
      var bids = window.pbjs && window.pbjs.getHighestCpmBids
        && window.pbjs.getHighestCpmBids('adflow-slot-0');
      if (bids && bids.length) showWinningBid(bids[0]);
    } catch (e) { /* ignore */ }
  }

  function finishTest(won) {
    if (won) {
      setStatus('pop-status-render', 'success', '已中標');
      showWinningBidFromAuction();
      log('========== 測試完成: 已中標 —— 點擊頁面任意位置在後台打開彈窗 ==========', 'success');
    } else {
      setStatus('pop-status-render', 'warn', '無出價');
      setStatus('pop-status-pop', 'pending', '無廣告');
      log('========== 測試完成: 無 Pop 出價返回（測試環境屬正常現象） ==========', 'warn');
    }
    enableButtons();
  }

  var runBtn = document.getElementById('pop-runBtn');
  if (runBtn) runBtn.addEventListener('click', runLiveTest);

  ['pop-serverUrl', 'pop-accountId', 'pop-placementId'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', updateCodePreview);
  });

  updateCodePreview();
})
</script>

<style>
.pop-dbg h3 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 14px;
  color: var(--vp-c-text-1);
}

.pop-dbg .controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 24px;
}

.pop-dbg .input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pop-dbg .input-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.pop-dbg .input-group input {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-family: var(--vp-font-family-mono);
  width: 280px;
  transition: border-color 0.2s;
}

.pop-dbg .input-group input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(52, 81, 178, 0.1);
}

.pop-dbg button {
  background: var(--vp-c-brand-2);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--vp-font-family-base);
  transition: background 0.2s;
}

.pop-dbg button:hover { background: var(--vp-c-brand-1); }

.pop-dbg button:disabled {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-3);
  cursor: not-allowed;
  border: 1px solid var(--vp-c-divider);
}

.pop-dbg .pop-cta {
  display: none;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
  border: 1px solid var(--vp-c-green);
  background: var(--vp-c-green-soft);
  color: var(--vp-c-green);
  cursor: pointer;
}

.pop-dbg .pop-cta.show { display: flex; }

.pop-dbg .grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.pop-dbg .card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 20px;
}

.pop-dbg .status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.pop-dbg .status.pending { background: var(--vp-c-bg-alt); color: var(--vp-c-text-2); }
.pop-dbg .status.success { background: var(--vp-c-green-soft); color: var(--vp-c-green); }
.pop-dbg .status.error { background: var(--vp-c-danger-soft); color: var(--vp-c-danger-1); }
.pop-dbg .status.warn { background: var(--vp-c-warning-soft); color: var(--vp-c-warning-1); }

.pop-dbg .status::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: currentColor;
}

.pop-dbg .test-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.pop-dbg .test-row:last-child { border-bottom: none; }

.pop-dbg .test-name {
  font-size: 14px;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
}

.pop-dbg .log-box {
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1.7;
}

.pop-dbg .log-line { white-space: pre-wrap; word-break: break-all; }
.pop-dbg .log-line.info { color: var(--vp-c-brand-1); }
.pop-dbg .log-line.success { color: var(--vp-c-green); }
.pop-dbg .log-line.error { color: var(--vp-c-danger-1); }
.pop-dbg .log-line.warn { color: var(--vp-c-warning-1); }
.pop-dbg .log-line .ts { color: var(--vp-c-text-3); margin-right: 8px; }

.pop-dbg .ad-slot-label {
  font-size: 11px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.pop-dbg .code-block {
  background: #1e1e2e;
  color: #cdd6f4;
  border-radius: 8px;
  padding: 16px 20px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
  white-space: pre;
}

.pop-dbg .code-block .hl-tag { color: #89b4fa; }
.pop-dbg .code-block .hl-attr { color: #f9e2af; }
.pop-dbg .code-block .hl-val { color: #a6e3a1; }
.pop-dbg .code-block .hl-comment { color: #6c7086; }

.pop-dbg .config-display {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.pop-dbg .config-display .key { color: var(--vp-c-danger-1); }
.pop-dbg .config-display .val { color: var(--vp-c-brand-1); }

.pop-dbg .asset-table { width: 100%; border-collapse: collapse; }

.pop-dbg .asset-table td {
  padding: 7px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 13px;
  vertical-align: top;
}

.pop-dbg .asset-table tr:last-child td { border-bottom: none; }

.pop-dbg .asset-table .asset-key {
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  width: 130px;
  white-space: nowrap;
}

.pop-dbg .asset-table .asset-val {
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  word-break: break-all;
}

.pop-dbg .asset-table .asset-val.empty { color: var(--vp-c-text-3); }

@media (max-width: 768px) {
  .pop-dbg .grid { grid-template-columns: 1fr; }
  .pop-dbg .input-group input { width: 100% !important; }
}
</style>
