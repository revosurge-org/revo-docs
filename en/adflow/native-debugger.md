---
title: Native Debugger
description: Test adflow.js Native (inline card) ads in-browser. Configure URL, account ID, placement to validate S2S bidding.
---

# Native Debugger

Test adflow.js support for the **Native (inline card)** ad type: the auction request is the same native creative as Push (image + title + body), but the ad does not pop up — on a win, adflow.js inserts a card **inline at the slot's position**, blending with the surrounding content.

## Configuration

<ClientOnly>
<div class="nat-dbg">
  <div class="controls">
    <div class="input-group">
      <label>Server URL</label>
      <input type="text" id="nat-serverUrl" value="https://prebid-server.revosurge-test.com/" style="width: 380px;" />
    </div>
    <div class="input-group">
      <label>Account ID</label>
      <input type="text" id="nat-accountId" value="test" style="width: 140px;" />
    </div>
    <div class="input-group">
      <label>Placement ID</label>
      <input type="text" id="nat-placementId" value="test-native-1" />
    </div>
    <button id="nat-runBtn">Run Test</button>
  </div>
</div>
</ClientOnly>

::: tip No permission needed
Native ads do not use browser notifications, so no HTTPS or notification permission is required. On a win, the card renders inline right inside the ad slot below — image on top, title and body below, with no close button.
:::

## Code Preview

Integration code generated from the settings above. A Native slot differs from a regular slot only by `data-ad-type="native"`; `width` / `height` are optional and set the requested image size (default 492×328):

<ClientOnly>
<div class="nat-dbg">
  <div class="card" style="margin-bottom: 24px;">
    <h3>Generated HTML Code</h3>
    <div id="nat-codePreview" class="code-block"></div>
  </div>
</div>
</ClientOnly>

## Test Status

<ClientOnly>
<div class="nat-dbg">
  <div class="grid">
    <div class="card">
      <h3>Execution Status</h3>
      <div>
        <div class="test-row"><span class="test-name">Script Load</span><span class="status pending" id="nat-status-script">Waiting</span></div>
        <div class="test-row"><span class="test-name">Config Read</span><span class="status pending" id="nat-status-config">Waiting</span></div>
        <div class="test-row"><span class="test-name">Slot Discovery</span><span class="status pending" id="nat-status-slots">Waiting</span></div>
        <div class="test-row"><span class="test-name">S2S Auction</span><span class="status pending" id="nat-status-auction">Waiting</span></div>
        <div class="test-row"><span class="test-name">Won</span><span class="status pending" id="nat-status-render">Waiting</span></div>
        <div class="test-row"><span class="test-name">Inline Card</span><span class="status pending" id="nat-status-notify">Waiting</span></div>
      </div>
    </div>
    <div class="card">
      <h3>Runtime Config</h3>
      <div id="nat-runtimeConfig" class="config-display">
        <div><span class="key">Status:</span> <span class="val">Not Started</span></div>
      </div>
    </div>
  </div>
  <div class="card" style="margin-bottom: 24px;">
    <h3>Parsed Assets (__adflow.parseNative)</h3>
    <div id="nat-parsedAssets" class="config-display">
      <div><span class="key">Status:</span> <span class="val">Waiting for auction...</span></div>
    </div>
  </div>
</div>
</ClientOnly>

## Ad Slot

<ClientOnly>
<div class="nat-dbg">
  <div class="card" style="margin-bottom: 24px;">
    <h3>Native slot (card renders inline right here)</h3>
    <p style="font-size:14px;color:var(--vp-c-text-2);margin:0;">
      Native ads do not pop up. On a win, adflow.js inserts a card
      (image + title + body, no close button) <strong>inline at the slot's position</strong> in this container;
      clicking the card opens the landing page.
      See "Execution Status", "Inline Card" and "Parsed Assets" above for the outcome.
    </p>
    <div class="ad-slot-label" style="margin-top:10px;">Slot: data-ad-type="native" · <span id="nat-label-pid">test-native-1</span></div>
    <div id="nat-ad-container"></div>
  </div>
</div>
</ClientOnly>

## Logs

<ClientOnly>
<div class="nat-dbg">
  <div class="card" style="margin-bottom: 20px;">
    <div id="nat-logBox" class="log-box"></div>
  </div>
</div>
</ClientOnly>

<script setup>
import { onMounted, nextTick } from 'vue'

onMounted(async () => {
  await nextTick()
  var logBox = document.getElementById('nat-logBox');
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
    var serverUrl = document.getElementById('nat-serverUrl').value.trim();
    var accountId = document.getElementById('nat-accountId').value.trim();
    var pid = document.getElementById('nat-placementId').value.trim();

    var labelEl = document.getElementById('nat-label-pid');
    if (labelEl) labelEl.textContent = pid;

    var html = '';
    html += '<span class="hl-comment">&lt;!-- Include adflow.js --&gt;</span>\n';
    html += '<span class="hl-tag">&lt;script</span> <span class="hl-attr">src</span>=<span class="hl-val">"https://assets.revosurge.com/js/adflow.min.js"</span>\n';
    html += '    <span class="hl-attr">data-server-url</span>=<span class="hl-val">"' + escapeHtml(serverUrl) + '"</span>\n';
    html += '    <span class="hl-attr">data-account-id</span>=<span class="hl-val">"' + escapeHtml(accountId) + '"</span>\n';
    html += '    <span class="hl-attr">data-debug</span><span class="hl-tag">&gt;&lt;/script&gt;</span>\n';
    html += '\n';
    html += '<span class="hl-comment">&lt;!-- Native ad slot (width/height optional, default 492×328) --&gt;</span>\n';
    html += '<span class="hl-tag">&lt;iframe</span> <span class="hl-attr">data-adflow-ad</span>\n';
    html += '    <span class="hl-attr">data-placement-id</span>=<span class="hl-val">"' + escapeHtml(pid) + '"</span>\n';
    html += '    <span class="hl-attr">data-ad-type</span>=<span class="hl-val">"native"</span>\n';
    html += '    <span class="hl-attr">width</span>=<span class="hl-val">"492"</span> <span class="hl-attr">height</span>=<span class="hl-val">"328"</span><span class="hl-tag">&gt;&lt;/iframe&gt;</span>';

    var preview = document.getElementById('nat-codePreview');
    if (preview) preview.innerHTML = html;
  }

  function trackStatus(msg) {
    if (msg.indexOf('Initializing') !== -1) {
      setStatus('nat-status-script', 'success', 'Loaded');
      setStatus('nat-status-config', 'success', 'Read');
    }
    if (msg.indexOf('Found') !== -1 && msg.indexOf('ad slot') !== -1) {
      var match = msg.match(/Found (\d+)/);
      setStatus('nat-status-slots', 'success', 'Found ' + (match ? match[1] : '') + ' slot(s)');
    }
    if (msg.indexOf('Prebid.js loaded') !== -1 || msg.indexOf('Prebid.js already loaded') !== -1) {
      setStatus('nat-status-auction', 'pending', 'Bidding...');
    }
    if (msg.indexOf('Loading Prebid.js') !== -1) {
      setStatus('nat-status-auction', 'pending', 'Loading Prebid...');
    }
    if (msg.indexOf('Auction complete') !== -1) {
      setStatus('nat-status-auction', 'success', 'Auction Complete');
      auctionComplete = true;
    }
    if (msg.indexOf('won by') !== -1) {
      setStatus('nat-status-render', 'success', 'Won');
    }
    if (msg.indexOf('no bids') !== -1) {
      var el = document.getElementById('nat-status-render');
      if (el && (el.textContent === 'Waiting' || el.textContent === 'Waiting...')) {
        setStatus('nat-status-render', 'warn', 'No Bids');
      }
    }
    if (msg.indexOf('Failed to load Prebid.js') !== -1) {
      setStatus('nat-status-auction', 'error', 'Prebid Load Failed');
    }
    if (msg.indexOf('data-account-id is required') !== -1) {
      setStatus('nat-status-config', 'error', 'Missing account-id');
    }
    if (msg.indexOf('No valid') !== -1) {
      setStatus('nat-status-slots', 'error', 'No Slots Found');
    }
    // Inline card status, driven by adflow.js's own logs.
    if (msg.indexOf('Native ad shown') !== -1) {
      setStatus('nat-status-notify', 'success', 'Shown');
    }
    if (msg.indexOf('has no renderable assets') !== -1) {
      setStatus('nat-status-notify', 'error', 'No renderable assets');
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
    ['nat-status-script', 'nat-status-config', 'nat-status-slots', 'nat-status-auction', 'nat-status-render', 'nat-status-notify'].forEach(function(id) {
      setStatus(id, 'pending', 'Waiting...');
    });
    document.getElementById('nat-parsedAssets').innerHTML =
      '<div><span class="key">Status:</span> <span class="val">Waiting for auction...</span></div>';
    document.getElementById('nat-runtimeConfig').innerHTML =
      '<div><span class="key">Status:</span> <span class="val">Running...</span></div>';

    if (window.__adflow) { try { delete window.__adflow; } catch (e) { window.__adflow = undefined; } }

    var old = document.getElementById('nat-adflow-script');
    if (old && old.parentNode) old.parentNode.removeChild(old);
  }

  function makeNativeIframe(container, pid) {
    container.innerHTML = '';
    var iframe = document.createElement('iframe');
    iframe.setAttribute('data-adflow-ad', '');
    iframe.setAttribute('data-placement-id', pid);
    iframe.setAttribute('data-ad-type', 'native');
    iframe.setAttribute('width', '492');
    iframe.setAttribute('height', '328');
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    container.appendChild(iframe);
    return iframe;
  }

  function injectAdflow(serverUrl, accountId, onload) {
    var script = document.createElement('script');
    script.id = 'nat-adflow-script';
    script.src = 'https://assets.revosurge.com/js/adflow.min.js';
    script.setAttribute('data-server-url', serverUrl);
    script.setAttribute('data-account-id', accountId);
    script.setAttribute('data-debug', '');
    // Native renders the inline card itself; no notification permission needed.
    script.onload = function() { log('adflow.js loaded', 'success'); if (onload) onload(); };
    script.onerror = function() {
      log('Failed to load adflow.js!', 'error');
      setStatus('nat-status-script', 'error', 'Load Failed');
      enableButtons();
    };
    log('Injecting adflow.js script...');
    document.body.appendChild(script);
  }

  function disableButtons() {
    var btn = document.getElementById('nat-runBtn');
    btn.disabled = true;
    btn.textContent = 'Testing...';
  }

  function enableButtons() {
    var btn = document.getElementById('nat-runBtn');
    btn.disabled = false;
    btn.textContent = 'Re-test';
  }

  function runLiveTest() {
    disableButtons();
    resetState();

    try { delete window.pbjs; } catch (e) { window.pbjs = undefined; }

    var serverUrl = document.getElementById('nat-serverUrl').value.trim();
    var accountId = document.getElementById('nat-accountId').value.trim();
    var pid = document.getElementById('nat-placementId').value.trim();

    log('========== Starting Native live auction test ==========', 'info');
    log('Server URL: ' + serverUrl);
    log('Account ID: ' + accountId);
    log('Placement ID: ' + pid + ' (native)');

    makeNativeIframe(document.getElementById('nat-ad-container'), pid);

    injectAdflow(serverUrl, accountId, function() {
      updateRuntimeConfig();
      pollForCompletion();
    });
  }

  // Parsed-assets panel (uses the __adflow.parseNative hook)
  function showParsedAssets(bid) {
    var ads = window.__adflow;
    if (!ads || typeof ads.parseNative !== 'function') {
      document.getElementById('nat-parsedAssets').innerHTML =
        '<div><span class="key">Status:</span> <span class="val">parseNative unavailable (requires adflow.js ≥ 1.3.0)</span></div>';
      return;
    }
    var d;
    try { d = ads.parseNative(bid); }
    catch (e) {
      document.getElementById('nat-parsedAssets').innerHTML =
        '<div><span class="key">Error:</span> <span class="val">' + escapeHtml(e.message) + '</span></div>';
      return;
    }

    function row(k, v, note) {
      var empty = v === '' || v == null || (Array.isArray(v) && v.length === 0);
      var display = Array.isArray(v) ? (v.length + ' item(s)') : (empty ? '—' : v);
      return '<tr><td class="asset-key">' + escapeHtml(k) + (note ? ' <span style="color:var(--vp-c-text-3)">' + note + '</span>' : '')
        + '</td><td class="asset-val' + (empty ? ' empty' : '') + '">' + escapeHtml(display) + '</td></tr>';
    }

    var nativeMsg = d.body || d.sponsoredBy || d.cta || '';
    var nativeImage = d.image || d.icon || '';
    var html = '<table class="asset-table">';
    html += row('title', d.title);
    html += row('message', nativeMsg, '= body||sponsoredBy||cta');
    html += row('image', nativeImage, '= image||icon');
    html += row('clickUrl', d.clickUrl);
    html += '</table>';
    document.getElementById('nat-parsedAssets').innerHTML = html;
  }

  function updateRuntimeConfig() {
    var ads = window.__adflow;
    var el = document.getElementById('nat-runtimeConfig');
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

  function nativeHasWinner() {
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

      // Native renders nothing in the iframe itself; success = a winning bid (adflow then inserts the inline card).
      if (nativeHasWinner()) {
        clearInterval(timer);
        finishTest(true);
        return;
      }
      if (auctionComplete) {
        clearInterval(timer);
        finishTest(nativeHasWinner());
        return;
      }
      if (attempts >= maxAttempts) {
        clearInterval(timer);
        log('Test timed out (20s)', 'warn');
        finishTest(nativeHasWinner());
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
      setStatus('nat-status-render', 'success', 'Won');
      showParsedAssetsFromAuction();
      log('========== Test complete: won — native card rendered inline by adflow.js ==========', 'success');
    } else {
      setStatus('nat-status-render', 'warn', 'No Bids');
      setStatus('nat-status-notify', 'pending', 'No ad');
      log('========== Test complete: no native bid returned (normal for test env) ==========', 'warn');
    }
    enableButtons();
  }

  var runBtn = document.getElementById('nat-runBtn');
  if (runBtn) runBtn.addEventListener('click', runLiveTest);

  ['nat-serverUrl', 'nat-accountId', 'nat-placementId'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', updateCodePreview);
  });

  updateCodePreview();
})
</script>

<style>
.nat-dbg h3 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 14px;
  color: var(--vp-c-text-1);
}

.nat-dbg .controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 24px;
}

.nat-dbg .input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nat-dbg .input-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.nat-dbg .input-group input {
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

.nat-dbg .input-group input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(52, 81, 178, 0.1);
}

.nat-dbg button {
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

.nat-dbg button:hover { background: var(--vp-c-brand-1); }

.nat-dbg button:disabled {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-3);
  cursor: not-allowed;
  border: 1px solid var(--vp-c-divider);
}

.nat-dbg .grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.nat-dbg .card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 20px;
}

.nat-dbg .status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.nat-dbg .status.pending { background: var(--vp-c-bg-alt); color: var(--vp-c-text-2); }
.nat-dbg .status.success { background: var(--vp-c-green-soft); color: var(--vp-c-green); }
.nat-dbg .status.error { background: var(--vp-c-danger-soft); color: var(--vp-c-danger-1); }
.nat-dbg .status.warn { background: var(--vp-c-warning-soft); color: var(--vp-c-warning-1); }

.nat-dbg .status::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: currentColor;
}

.nat-dbg .test-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.nat-dbg .test-row:last-child { border-bottom: none; }

.nat-dbg .test-name {
  font-size: 14px;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
}

.nat-dbg .log-box {
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

.nat-dbg .log-line { white-space: pre-wrap; word-break: break-all; }
.nat-dbg .log-line.info { color: var(--vp-c-brand-1); }
.nat-dbg .log-line.success { color: var(--vp-c-green); }
.nat-dbg .log-line.error { color: var(--vp-c-danger-1); }
.nat-dbg .log-line.warn { color: var(--vp-c-warning-1); }
.nat-dbg .log-line .ts { color: var(--vp-c-text-3); margin-right: 8px; }

.nat-dbg .ad-slot-label {
  font-size: 11px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.nat-dbg .code-block {
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

.nat-dbg .code-block .hl-tag { color: #89b4fa; }
.nat-dbg .code-block .hl-attr { color: #f9e2af; }
.nat-dbg .code-block .hl-val { color: #a6e3a1; }
.nat-dbg .code-block .hl-comment { color: #6c7086; }

.nat-dbg .config-display {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.nat-dbg .config-display .key { color: var(--vp-c-danger-1); }
.nat-dbg .config-display .val { color: var(--vp-c-brand-1); }

.nat-dbg .asset-table { width: 100%; border-collapse: collapse; }

.nat-dbg .asset-table td {
  padding: 7px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 13px;
  vertical-align: top;
}

.nat-dbg .asset-table tr:last-child td { border-bottom: none; }

.nat-dbg .asset-table .asset-key {
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  width: 130px;
  white-space: nowrap;
}

.nat-dbg .asset-table .asset-val {
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  word-break: break-all;
}

.nat-dbg .asset-table .asset-val.empty { color: var(--vp-c-text-3); }

@media (max-width: 768px) {
  .nat-dbg .grid { grid-template-columns: 1fr; }
  .nat-dbg .input-group input { width: 100% !important; }
}
</style>
