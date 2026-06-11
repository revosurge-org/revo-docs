---
title: In-page Push Debugger
description: Test adflow.js In-page Push (centered popup) ads in-browser. Configure URL, account ID, placement to validate S2S bidding.
---

# In-page Push Debugger

Test adflow.js support for the **In-page Push (centered popup)** ad type: the auction request is identical to Push (a native creative with image + title + body), but it shows **no system notification and needs no permission** — on a win, adflow.js renders a popup card **centered on the page**.

## Configuration

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
    <button id="ipush-runBtn">Run Test</button>
  </div>
</div>
</ClientOnly>

::: tip No permission needed
In-page Push does not use browser notifications, so no HTTPS or notification permission is required. On a win, the popup card renders centered on this page with a close button in the corner.
:::

## Code Preview

Integration code generated from the settings above. An In-page Push slot differs from a regular slot only by `data-ad-type="inpage-push"`; `width` / `height` are optional and set the requested image size (default 492×328):

<ClientOnly>
<div class="ipush-dbg">
  <div class="card" style="margin-bottom: 24px;">
    <h3>Generated HTML Code</h3>
    <div id="ipush-codePreview" class="code-block"></div>
  </div>
</div>
</ClientOnly>

## Test Status

<ClientOnly>
<div class="ipush-dbg">
  <div class="grid">
    <div class="card">
      <h3>Execution Status</h3>
      <div>
        <div class="test-row"><span class="test-name">Script Load</span><span class="status pending" id="ipush-status-script">Waiting</span></div>
        <div class="test-row"><span class="test-name">Config Read</span><span class="status pending" id="ipush-status-config">Waiting</span></div>
        <div class="test-row"><span class="test-name">Slot Discovery</span><span class="status pending" id="ipush-status-slots">Waiting</span></div>
        <div class="test-row"><span class="test-name">S2S Auction</span><span class="status pending" id="ipush-status-auction">Waiting</span></div>
        <div class="test-row"><span class="test-name">Won</span><span class="status pending" id="ipush-status-render">Waiting</span></div>
        <div class="test-row"><span class="test-name">In-page Popup</span><span class="status pending" id="ipush-status-notify">Waiting</span></div>
      </div>
    </div>
    <div class="card">
      <h3>Runtime Config</h3>
      <div id="ipush-runtimeConfig" class="config-display">
        <div><span class="key">Status:</span> <span class="val">Not Started</span></div>
      </div>
    </div>
  </div>
  <div class="card" style="margin-bottom: 24px;">
    <h3>Parsed Assets (__adflow.parseNative)</h3>
    <div id="ipush-parsedAssets" class="config-display">
      <div><span class="key">Status:</span> <span class="val">Waiting for auction...</span></div>
    </div>
  </div>
</div>
</ClientOnly>

## Ad Slot

<ClientOnly>
<div class="ipush-dbg">
  <div class="card" style="margin-bottom: 24px;">
    <h3>In-page Push slot (popup renders centered on the page)</h3>
    <p style="font-size:14px;color:var(--vp-c-text-2);margin:0;">
      In-page Push ads are not rendered inside the iframe. On a win, adflow.js renders a popup card
      <strong>centered on the page</strong> — image full-width on top, title and body below, with a close
      button in the corner; clicking the card opens the landing page.
      See "Execution Status", "In-page Popup" and "Parsed Assets" above for the outcome.
    </p>
    <div class="ad-slot-label" style="margin-top:10px;">Hidden slot: data-ad-type="inpage-push" · <span id="ipush-label-pid">test-push-1</span></div>
    <div id="ipush-ad-container" style="display:none;"></div>
  </div>
</div>
</ClientOnly>

## Logs

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
  var auctionComplete = false; // set when adflow logs "Auction complete"

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
    html += '<span class="hl-comment">&lt;!-- Include adflow.js --&gt;</span>\n';
    html += '<span class="hl-tag">&lt;script</span> <span class="hl-attr">src</span>=<span class="hl-val">"https://assets.revosurge.com/js/adflow.min.js"</span>\n';
    html += '    <span class="hl-attr">data-server-url</span>=<span class="hl-val">"' + escapeHtml(serverUrl) + '"</span>\n';
    html += '    <span class="hl-attr">data-account-id</span>=<span class="hl-val">"' + escapeHtml(accountId) + '"</span>\n';
    html += '    <span class="hl-attr">data-debug</span><span class="hl-tag">&gt;&lt;/script&gt;</span>\n';
    html += '\n';
    html += '<span class="hl-comment">&lt;!-- In-page Push ad slot (width/height optional, default 492×328) --&gt;</span>\n';
    html += '<span class="hl-tag">&lt;iframe</span> <span class="hl-attr">data-adflow-ad</span>\n';
    html += '    <span class="hl-attr">data-placement-id</span>=<span class="hl-val">"' + escapeHtml(pid) + '"</span>\n';
    html += '    <span class="hl-attr">data-ad-type</span>=<span class="hl-val">"inpage-push"</span>\n';
    html += '    <span class="hl-attr">width</span>=<span class="hl-val">"492"</span> <span class="hl-attr">height</span>=<span class="hl-val">"328"</span><span class="hl-tag">&gt;&lt;/iframe&gt;</span>';

    var preview = document.getElementById('ipush-codePreview');
    if (preview) preview.innerHTML = html;
  }

  function trackStatus(msg) {
    if (msg.indexOf('Initializing') !== -1) {
      setStatus('ipush-status-script', 'success', 'Loaded');
      setStatus('ipush-status-config', 'success', 'Read');
    }
    if (msg.indexOf('Found') !== -1 && msg.indexOf('ad slot') !== -1) {
      var match = msg.match(/Found (\d+)/);
      setStatus('ipush-status-slots', 'success', 'Found ' + (match ? match[1] : '') + ' slot(s)');
    }
    if (msg.indexOf('Prebid.js loaded') !== -1 || msg.indexOf('Prebid.js already loaded') !== -1) {
      setStatus('ipush-status-auction', 'pending', 'Bidding...');
    }
    if (msg.indexOf('Loading Prebid.js') !== -1) {
      setStatus('ipush-status-auction', 'pending', 'Loading Prebid...');
    }
    if (msg.indexOf('Auction complete') !== -1) {
      setStatus('ipush-status-auction', 'success', 'Auction Complete');
      auctionComplete = true;
    }
    if (msg.indexOf('won by') !== -1) {
      setStatus('ipush-status-render', 'success', 'Won');
    }
    if (msg.indexOf('no bids') !== -1) {
      var el = document.getElementById('ipush-status-render');
      if (el && (el.textContent === 'Waiting' || el.textContent === 'Waiting...')) {
        setStatus('ipush-status-render', 'warn', 'No Bids');
      }
    }
    if (msg.indexOf('Failed to load Prebid.js') !== -1) {
      setStatus('ipush-status-auction', 'error', 'Prebid Load Failed');
    }
    if (msg.indexOf('data-account-id is required') !== -1) {
      setStatus('ipush-status-config', 'error', 'Missing account-id');
    }
    if (msg.indexOf('No valid') !== -1) {
      setStatus('ipush-status-slots', 'error', 'No Slots Found');
    }
    // In-page popup status, driven by adflow.js's own logs.
    if (msg.indexOf('In-page push popup shown') !== -1) {
      setStatus('ipush-status-notify', 'success', 'Shown');
    }
    if (msg.indexOf('has no renderable assets') !== -1) {
      setStatus('ipush-status-notify', 'error', 'No renderable assets');
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
      setStatus(id, 'pending', 'Waiting...');
    });
    document.getElementById('ipush-parsedAssets').innerHTML =
      '<div><span class="key">Status:</span> <span class="val">Waiting for auction...</span></div>';
    document.getElementById('ipush-runtimeConfig').innerHTML =
      '<div><span class="key">Status:</span> <span class="val">Running...</span></div>';

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
    // In-page Push renders the popup itself; no notification permission needed.
    script.onload = function() { log('adflow.js loaded', 'success'); if (onload) onload(); };
    script.onerror = function() {
      log('Failed to load adflow.js!', 'error');
      setStatus('ipush-status-script', 'error', 'Load Failed');
      enableButtons();
    };
    log('Injecting adflow.js script...');
    document.body.appendChild(script);
  }

  function disableButtons() {
    var btn = document.getElementById('ipush-runBtn');
    btn.disabled = true;
    btn.textContent = 'Testing...';
  }

  function enableButtons() {
    var btn = document.getElementById('ipush-runBtn');
    btn.disabled = false;
    btn.textContent = 'Re-test';
  }

  function runLiveTest() {
    disableButtons();
    resetState();

    try { delete window.pbjs; } catch (e) { window.pbjs = undefined; }

    var serverUrl = document.getElementById('ipush-serverUrl').value.trim();
    var accountId = document.getElementById('ipush-accountId').value.trim();
    var pid = document.getElementById('ipush-placementId').value.trim();

    log('========== Starting In-page Push live auction test ==========', 'info');
    log('Server URL: ' + serverUrl);
    log('Account ID: ' + accountId);
    log('Placement ID: ' + pid + ' (inpage-push)');

    makePushIframe(document.getElementById('ipush-ad-container'), pid);

    injectAdflow(serverUrl, accountId, function() {
      updateRuntimeConfig();
      pollForCompletion();
    });
  }

  // Parsed-assets panel (uses the __adflow.parseNative hook)
  function showParsedAssets(bid) {
    var ads = window.__adflow;
    if (!ads || typeof ads.parseNative !== 'function') {
      document.getElementById('ipush-parsedAssets').innerHTML =
        '<div><span class="key">Status:</span> <span class="val">parseNative unavailable (requires adflow.js ≥ 1.3.0)</span></div>';
      return;
    }
    var d;
    try { d = ads.parseNative(bid); }
    catch (e) {
      document.getElementById('ipush-parsedAssets').innerHTML =
        '<div><span class="key">Error:</span> <span class="val">' + escapeHtml(e.message) + '</span></div>';
      return;
    }

    function row(k, v, note) {
      var empty = v === '' || v == null || (Array.isArray(v) && v.length === 0);
      var display = Array.isArray(v) ? (v.length + ' item(s)') : (empty ? '—' : v);
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
      el.innerHTML = '<div><span class="key">Status:</span> <span class="val">Not Initialized</span></div>';
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
      html += '<div style="font-weight:600;margin-bottom:4px;color:var(--vp-c-text-1);">Slots:</div>';
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
    var maxAttempts = 40; // ~20s

    var timer = setInterval(function() {
      attempts++;
      updateRuntimeConfig();

      // In-page Push renders nothing in the iframe; success = a winning bid (adflow then shows the centered popup).
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
        log('Test timed out (20s)', 'warn');
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
      setStatus('ipush-status-render', 'success', 'Won');
      showParsedAssetsFromAuction();
      log('========== Test complete: won — in-page popup rendered by adflow.js ==========', 'success');
    } else {
      setStatus('ipush-status-render', 'warn', 'No Bids');
      setStatus('ipush-status-notify', 'pending', 'No ad');
      log('========== Test complete: no in-page push bid returned (normal for test env) ==========', 'warn');
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
