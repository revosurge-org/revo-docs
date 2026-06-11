---
title: In-page Push 調試器
description: 在瀏覽器中測試 adflow.js In-page Push（頁內推送）廣告。配置 URL、帳號 ID、廣告位以驗證 S2S 競價。
---

# In-page Push 調試器

測試 adflow.js 對 **In-page Push（頁內推送）**廣告類型的支持：競價請求與 Push 相同（圖片 + 標題 + 正文的原生格式），但**不彈系統通知、無需任何授權** —— 中標後 adflow.js 直接在**頁面居中位置**渲染一個廣告彈窗卡片。

## 測試配置

<ClientOnly>
<div class="ipush-dbg">
  <div class="controls">
    <div class="input-group">
      <label>Server URL</label>
      <input type="text" id="ipush-serverUrl" value="https://prebid-server.revosurge-test.com/" style="width: 380px;" />
    </div>
    <div class="input-group">
      <label>Account ID</label>
      <input type="text" id="ipush-accountId" value="test" style="width: 140px;" />
    </div>
    <div class="input-group">
      <label>Placement ID</label>
      <input type="text" id="ipush-placementId" value="test-push-1" />
    </div>
    <button id="ipush-runBtn">運行測試</button>
  </div>
</div>
</ClientOnly>

::: tip 無需授權
In-page Push 不使用瀏覽器通知，無需 HTTPS 或通知權限。中標後彈窗卡片直接渲染在本頁面居中位置，右上角帶關閉按鈕。
:::

## 代碼預覽

根據上方配置自動生成的接入代碼。頁內推送廣告位與普通廣告位的唯一區別就是 `data-ad-type="inpage-push"`；`width` / `height` 可選，定義請求的圖片尺寸（默認 492×328）：

<ClientOnly>
<div class="ipush-dbg">
  <div class="card" style="margin-bottom: 24px;">
    <h3>生成的 HTML 代碼</h3>
    <div id="ipush-codePreview" class="code-block"></div>
  </div>
</div>
</ClientOnly>

## 測試狀態

<ClientOnly>
<div class="ipush-dbg">
  <div class="grid">
    <div class="card">
      <h3>執行狀態</h3>
      <div>
        <div class="test-row"><span class="test-name">腳本加載</span><span class="status pending" id="ipush-status-script">等待測試</span></div>
        <div class="test-row"><span class="test-name">配置讀取</span><span class="status pending" id="ipush-status-config">等待測試</span></div>
        <div class="test-row"><span class="test-name">廣告位發現</span><span class="status pending" id="ipush-status-slots">等待測試</span></div>
        <div class="test-row"><span class="test-name">競價</span><span class="status pending" id="ipush-status-auction">等待測試</span></div>
        <div class="test-row"><span class="test-name">中標</span><span class="status pending" id="ipush-status-render">等待測試</span></div>
        <div class="test-row"><span class="test-name">頁內彈窗</span><span class="status pending" id="ipush-status-notify">等待測試</span></div>
      </div>
    </div>
    <div class="card">
      <h3>運行時配置</h3>
      <div id="ipush-runtimeConfig" class="config-display">
        <div><span class="key">狀態:</span> <span class="val">未啟動</span></div>
      </div>
    </div>
  </div>
  <div class="card" style="margin-bottom: 24px;">
    <h3>解析結果（__adflow.parseNative）</h3>
    <div id="ipush-parsedAssets" class="config-display">
      <div><span class="key">狀態:</span> <span class="val">等待競價...</span></div>
    </div>
  </div>
</div>
</ClientOnly>

## 廣告預覽

<ClientOnly>
<div class="ipush-dbg">
  <div class="card" style="margin-bottom: 24px;">
    <h3>頁內推送廣告位（彈窗在頁面居中渲染）</h3>
    <p style="font-size:14px;color:var(--vp-c-text-2);margin:0;">
      頁內推送廣告不在 iframe 內渲染。中標後 adflow.js 會在<strong>頁面居中位置</strong>彈出一個
      廣告卡片 —— 圖片全寬在上、標題正文在下、右上角帶關閉按鈕，點擊卡片即打開落地頁。
      投放結果見上方「執行狀態」「頁內彈窗」「解析結果」。
    </p>
    <div class="ad-slot-label" style="margin-top:10px;">隱藏佔位：data-ad-type="inpage-push" · <span id="ipush-label-pid">test-push-1</span></div>
    <div id="ipush-ad-container" style="display:none;"></div>
  </div>
</div>
</ClientOnly>

## 日誌

<ClientOnly>
<div class="ipush-dbg">
  <div class="card" style="margin-bottom: 20px;">
    <div id="ipush-logBox" class="log-box"></div>
  </div>
</div>
</ClientOnly>

<script setup>
import { onMounted, nextTick } from 'vue'

onMounted(async () => {
  await nextTick()
  var logBox = document.getElementById('ipush-logBox');
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

  function updateCodePreview() {
    var serverUrl = document.getElementById('ipush-serverUrl').value.trim();
    var accountId = document.getElementById('ipush-accountId').value.trim();
    var pid = document.getElementById('ipush-placementId').value.trim();

    var labelEl = document.getElementById('ipush-label-pid');
    if (labelEl) labelEl.textContent = pid;

    var html = '';
    html += '<span class="hl-comment">&lt;!-- 引入 adflow.js --&gt;</span>\n';
    html += '<span class="hl-tag">&lt;script</span> <span class="hl-attr">src</span>=<span class="hl-val">"https://assets.revosurge.com/js/adflow.min.js"</span>\n';
    html += '    <span class="hl-attr">data-server-url</span>=<span class="hl-val">"' + escapeHtml(serverUrl) + '"</span>\n';
    html += '    <span class="hl-attr">data-account-id</span>=<span class="hl-val">"' + escapeHtml(accountId) + '"</span>\n';
    html += '    <span class="hl-attr">data-debug</span><span class="hl-tag">&gt;&lt;/script&gt;</span>\n';
    html += '\n';
    html += '<span class="hl-comment">&lt;!-- In-page Push 廣告位（width/height 可選，默認 492×328） --&gt;</span>\n';
    html += '<span class="hl-tag">&lt;iframe</span> <span class="hl-attr">data-adflow-ad</span>\n';
    html += '    <span class="hl-attr">data-placement-id</span>=<span class="hl-val">"' + escapeHtml(pid) + '"</span>\n';
    html += '    <span class="hl-attr">data-ad-type</span>=<span class="hl-val">"inpage-push"</span>\n';
    html += '    <span class="hl-attr">width</span>=<span class="hl-val">"492"</span> <span class="hl-attr">height</span>=<span class="hl-val">"328"</span><span class="hl-tag">&gt;&lt;/iframe&gt;</span>';

    var preview = document.getElementById('ipush-codePreview');
    if (preview) preview.innerHTML = html;
  }

  function trackStatus(msg) {
    if (msg.indexOf('Initializing') !== -1) {
      setStatus('ipush-status-script', 'success', '已加載');
      setStatus('ipush-status-config', 'success', '已讀取');
    }
    if (msg.indexOf('Found') !== -1 && msg.indexOf('ad slot') !== -1) {
      var match = msg.match(/Found (\d+)/);
      setStatus('ipush-status-slots', 'success', '發現 ' + (match ? match[1] : '') + ' 個廣告位');
    }
    if (msg.indexOf('Prebid.js loaded') !== -1 || msg.indexOf('Prebid.js already loaded') !== -1) {
      setStatus('ipush-status-auction', 'pending', '競價中...');
    }
    if (msg.indexOf('Loading Prebid.js') !== -1) {
      setStatus('ipush-status-auction', 'pending', '加載 Prebid...');
    }
    if (msg.indexOf('Auction complete') !== -1) {
      setStatus('ipush-status-auction', 'success', '競價完成');
      auctionComplete = true;
    }
    if (msg.indexOf('won by') !== -1) {
      setStatus('ipush-status-render', 'success', '已中標');
    }
    if (msg.indexOf('no bids') !== -1) {
      var el = document.getElementById('ipush-status-render');
      if (el && (el.textContent === '等待測試' || el.textContent === '等待中...')) {
        setStatus('ipush-status-render', 'warn', '無出價');
      }
    }
    if (msg.indexOf('Failed to load Prebid.js') !== -1) {
      setStatus('ipush-status-auction', 'error', 'Prebid 加載失敗');
    }
    if (msg.indexOf('data-account-id is required') !== -1) {
      setStatus('ipush-status-config', 'error', '缺少 account-id');
    }
    if (msg.indexOf('No valid') !== -1) {
      setStatus('ipush-status-slots', 'error', '未發現廣告位');
    }
    // 頁內彈窗狀態由 adflow.js 自身日誌驅動
    if (msg.indexOf('In-page push popup shown') !== -1) {
      setStatus('ipush-status-notify', 'success', '已彈出');
    }
    if (msg.indexOf('has no renderable assets') !== -1) {
      setStatus('ipush-status-notify', 'error', '無可渲染素材');
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
    ['ipush-status-script', 'ipush-status-config', 'ipush-status-slots', 'ipush-status-auction', 'ipush-status-render', 'ipush-status-notify'].forEach(function(id) {
      setStatus(id, 'pending', '等待中...');
    });
    document.getElementById('ipush-parsedAssets').innerHTML =
      '<div><span class="key">狀態:</span> <span class="val">等待競價...</span></div>';
    document.getElementById('ipush-runtimeConfig').innerHTML =
      '<div><span class="key">狀態:</span> <span class="val">運行中...</span></div>';

    if (window.__adflow) { try { delete window.__adflow; } catch (e) { window.__adflow = undefined; } }

    var old = document.getElementById('ipush-adflow-script');
    if (old && old.parentNode) old.parentNode.removeChild(old);
  }

  function makePushIframe(container, pid) {
    container.innerHTML = '';
    var iframe = document.createElement('iframe');
    iframe.setAttribute('data-adflow-ad', '');
    iframe.setAttribute('data-placement-id', pid);
    iframe.setAttribute('data-ad-type', 'inpage-push');
    iframe.style.border = 'none';
    container.appendChild(iframe);
    return iframe;
  }

  function injectAdflow(serverUrl, accountId, onload) {
    var script = document.createElement('script');
    script.id = 'ipush-adflow-script';
    script.src = 'https://assets.revosurge.com/js/adflow.min.js';
    script.setAttribute('data-server-url', serverUrl);
    script.setAttribute('data-account-id', accountId);
    script.setAttribute('data-debug', '');
    // In-page Push 彈窗由 adflow.js 自行渲染，無需通知權限
    script.onload = function() { log('adflow.js 加載完成', 'success'); if (onload) onload(); };
    script.onerror = function() {
      log('adflow.js 加載失敗！', 'error');
      setStatus('ipush-status-script', 'error', '加載失敗');
      enableButtons();
    };
    log('注入 adflow.js 腳本...');
    document.body.appendChild(script);
  }

  function disableButtons() {
    var btn = document.getElementById('ipush-runBtn');
    btn.disabled = true;
    btn.textContent = '測試中...';
  }

  function enableButtons() {
    var btn = document.getElementById('ipush-runBtn');
    btn.disabled = false;
    btn.textContent = '重新測試';
  }

  function runLiveTest() {
    disableButtons();
    resetState();

    try { delete window.pbjs; } catch (e) { window.pbjs = undefined; }

    var serverUrl = document.getElementById('ipush-serverUrl').value.trim();
    var accountId = document.getElementById('ipush-accountId').value.trim();
    var pid = document.getElementById('ipush-placementId').value.trim();

    log('========== 開始 In-page Push 實時競價測試 ==========', 'info');
    log('Server URL: ' + serverUrl);
    log('Account ID: ' + accountId);
    log('Placement ID: ' + pid + ' (inpage-push)');

    makePushIframe(document.getElementById('ipush-ad-container'), pid);

    injectAdflow(serverUrl, accountId, function() {
      updateRuntimeConfig();
      pollForCompletion();
    });
  }

  // 解析結果面板（使用 __adflow.parseNative 鉤子）
  function showParsedAssets(bid) {
    var ads = window.__adflow;
    if (!ads || typeof ads.parseNative !== 'function') {
      document.getElementById('ipush-parsedAssets').innerHTML =
        '<div><span class="key">狀態:</span> <span class="val">parseNative 不可用（需 adflow.js ≥ 1.3.0）</span></div>';
      return;
    }
    var d;
    try { d = ads.parseNative(bid); }
    catch (e) {
      document.getElementById('ipush-parsedAssets').innerHTML =
        '<div><span class="key">錯誤:</span> <span class="val">' + escapeHtml(e.message) + '</span></div>';
      return;
    }

    function row(k, v, note) {
      var empty = v === '' || v == null || (Array.isArray(v) && v.length === 0);
      var display = Array.isArray(v) ? (v.length + ' 項') : (empty ? '—' : v);
      return '<tr><td class="asset-key">' + escapeHtml(k) + (note ? ' <span style="color:var(--vp-c-text-3)">' + note + '</span>' : '')
        + '</td><td class="asset-val' + (empty ? ' empty' : '') + '">' + escapeHtml(display) + '</td></tr>';
    }

    var pushMsg = d.body || d.sponsoredBy || d.cta || '';
    var pushIcon = d.icon || d.image || '';
    var html = '<table class="asset-table">';
    html += row('title', d.title);
    html += row('message', pushMsg, '= body||sponsoredBy||cta');
    html += row('image', d.image);
    html += row('icon', pushIcon);
    html += row('clickUrl', d.clickUrl);
    html += '</table>';
    document.getElementById('ipush-parsedAssets').innerHTML = html;
  }

  function updateRuntimeConfig() {
    var ads = window.__adflow;
    var el = document.getElementById('ipush-runtimeConfig');
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

  function pushHasWinner() {
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

      // In-page Push 不在 iframe 內渲染；中標即視為成功（adflow 隨後在頁面居中彈出卡片）
      if (pushHasWinner()) {
        clearInterval(timer);
        finishTest(true);
        return;
      }
      if (auctionComplete) {
        clearInterval(timer);
        finishTest(pushHasWinner());
        return;
      }
      if (attempts >= maxAttempts) {
        clearInterval(timer);
        log('測試超時 (20s)', 'warn');
        finishTest(pushHasWinner());
      }
    }, 500);
  }

  function showParsedAssetsFromAuction() {
    try {
      var bids = window.pbjs && window.pbjs.getHighestCpmBids
        && window.pbjs.getHighestCpmBids('adflow-slot-0');
      if (bids && bids.length) showParsedAssets(bids[0]);
    } catch (e) { /* ignore */ }
  }

  function finishTest(won) {
    if (won) {
      setStatus('ipush-status-render', 'success', '已中標');
      showParsedAssetsFromAuction();
      log('========== 測試完成: 已中標，頁內彈窗由 adflow.js 渲染 ==========', 'success');
    } else {
      setStatus('ipush-status-render', 'warn', '無出價');
      setStatus('ipush-status-notify', 'pending', '無廣告');
      log('========== 測試完成: 無 In-page Push 出價返回（測試環境屬正常現象） ==========', 'warn');
    }
    enableButtons();
  }

  var runBtn = document.getElementById('ipush-runBtn');
  if (runBtn) runBtn.addEventListener('click', runLiveTest);

  ['ipush-serverUrl', 'ipush-accountId', 'ipush-placementId'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', updateCodePreview);
  });

  updateCodePreview();
})
</script>

<style>
.ipush-dbg h3 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 14px;
  color: var(--vp-c-text-1);
}

.ipush-dbg .controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 24px;
}

.ipush-dbg .input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ipush-dbg .input-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.ipush-dbg .input-group input {
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

.ipush-dbg .input-group input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(52, 81, 178, 0.1);
}

.ipush-dbg button {
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

.ipush-dbg button:hover { background: var(--vp-c-brand-1); }

.ipush-dbg button:disabled {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-3);
  cursor: not-allowed;
  border: 1px solid var(--vp-c-divider);
}

.ipush-dbg .grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.ipush-dbg .card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 20px;
}

.ipush-dbg .status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.ipush-dbg .status.pending { background: var(--vp-c-bg-alt); color: var(--vp-c-text-2); }
.ipush-dbg .status.success { background: var(--vp-c-green-soft); color: var(--vp-c-green); }
.ipush-dbg .status.error { background: var(--vp-c-danger-soft); color: var(--vp-c-danger-1); }
.ipush-dbg .status.warn { background: var(--vp-c-warning-soft); color: var(--vp-c-warning-1); }

.ipush-dbg .status::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: currentColor;
}

.ipush-dbg .test-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.ipush-dbg .test-row:last-child { border-bottom: none; }

.ipush-dbg .test-name {
  font-size: 14px;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
}

.ipush-dbg .log-box {
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

.ipush-dbg .log-line { white-space: pre-wrap; word-break: break-all; }
.ipush-dbg .log-line.info { color: var(--vp-c-brand-1); }
.ipush-dbg .log-line.success { color: var(--vp-c-green); }
.ipush-dbg .log-line.error { color: var(--vp-c-danger-1); }
.ipush-dbg .log-line.warn { color: var(--vp-c-warning-1); }
.ipush-dbg .log-line .ts { color: var(--vp-c-text-3); margin-right: 8px; }

.ipush-dbg .ad-slot-label {
  font-size: 11px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.ipush-dbg .code-block {
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

.ipush-dbg .code-block .hl-tag { color: #89b4fa; }
.ipush-dbg .code-block .hl-attr { color: #f9e2af; }
.ipush-dbg .code-block .hl-val { color: #a6e3a1; }
.ipush-dbg .code-block .hl-comment { color: #6c7086; }

.ipush-dbg .config-display {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.ipush-dbg .config-display .key { color: var(--vp-c-danger-1); }
.ipush-dbg .config-display .val { color: var(--vp-c-brand-1); }

.ipush-dbg .asset-table { width: 100%; border-collapse: collapse; }

.ipush-dbg .asset-table td {
  padding: 7px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 13px;
  vertical-align: top;
}

.ipush-dbg .asset-table tr:last-child td { border-bottom: none; }

.ipush-dbg .asset-table .asset-key {
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  width: 130px;
  white-space: nowrap;
}

.ipush-dbg .asset-table .asset-val {
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  word-break: break-all;
}

.ipush-dbg .asset-table .asset-val.empty { color: var(--vp-c-text-3); }

@media (max-width: 768px) {
  .ipush-dbg .grid { grid-template-columns: 1fr; }
  .ipush-dbg .input-group input { width: 100% !important; }
}
</style>
