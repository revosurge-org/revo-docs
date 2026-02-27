---
title: S2S 調試器
description: 測試 Prebid S2S 配置。生成並驗證 S2S 競價請求。
---

# S2S 調試

測試 Prebid.js S2S 配置接入方案：通過 Prebid Server 轉發競價請求。

## 配置參數

<ClientOnly>
<div class="s2s-dbg">
  <div class="controls">
    <div class="input-group">
      <label>Server URL</label>
      <input type="text" id="s2s-serverUrl" value="https://prebid-server.revosurge-test.com/" style="width: 380px;" />
    </div>
    <div class="input-group">
      <label>Account ID</label>
      <input type="text" id="s2s-accountId" value="test" style="width: 140px;" />
    </div>
    <div class="input-group">
      <label>Placement ID</label>
      <input type="text" id="s2s-placementId1" value="test-placement-1" />
    </div>
    <button id="s2s-runBtn">運行測試</button>
  </div>
</div>
</ClientOnly>

## 代碼預覽

根據上方配置參數自動生成的 Prebid.js S2S 接入代碼：

<ClientOnly>
<div class="s2s-dbg">
  <div class="card" style="margin-bottom: 24px;">
    <h3>生成的 JS 代碼</h3>
    <div id="s2s-codePreview" class="code-block"></div>
  </div>
</div>
</ClientOnly>

## 測試狀態

<ClientOnly>
<div class="s2s-dbg">
  <div class="grid">
    <div class="card">
      <h3>執行狀態</h3>
      <div>
        <div class="test-row"><span class="test-name">Prebid.js 加載</span><span class="status pending" id="s2s-status-prebid">等待測試</span></div>
        <div class="test-row"><span class="test-name">S2S 配置</span><span class="status pending" id="s2s-status-s2s">等待測試</span></div>
        <div class="test-row"><span class="test-name">競價請求</span><span class="status pending" id="s2s-status-auction">等待測試</span></div>
        <div class="test-row"><span class="test-name">廣告渲染</span><span class="status pending" id="s2s-status-render">等待測試</span></div>
      </div>
    </div>
    <div class="card">
      <h3>S2S 配置</h3>
      <div id="s2s-runtimeConfig" class="config-display">
        <div><span class="key">狀態:</span> <span class="val">未啓動</span></div>
      </div>
    </div>
  </div>
</div>
</ClientOnly>

## 廣告預覽

<ClientOnly>
<div class="s2s-dbg">
  <div class="card" style="margin-bottom: 24px;">
    <h3>測試廣告位 (300x250)</h3>
    <div class="ad-slot-wrapper" id="s2s-ad-wrapper-1">
      <div class="ad-slot-label">placement-id="<span id="s2s-label-pid-1">test-placement-1</span>"</div>
      <div id="s2s-ad-container-1" style="width:300px;height:250px;display:flex;align-items:center;justify-content:center;color:var(--vp-c-text-3);">
        等待競價...
      </div>
    </div>
  </div>
</div>
</ClientOnly>

## 日誌

<ClientOnly>
<div class="s2s-dbg">
  <div class="card" style="margin-bottom: 20px;">
    <div id="s2s-logBox" class="log-box"></div>
  </div>
</div>
</ClientOnly>

<script setup>
import { onMounted, nextTick } from 'vue'

onMounted(async () => {
  await nextTick()
  var logBox = document.getElementById('s2s-logBox');

  function escapeHtml(str) {
    var d = document.createElement('div');
    d.textContent = str;
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
    var serverUrl = document.getElementById('s2s-serverUrl').value.trim().replace(/\/+$/, '');
    var accountId = document.getElementById('s2s-accountId').value.trim();
    var pid1 = document.getElementById('s2s-placementId1').value.trim();

    var labelEl = document.getElementById('s2s-label-pid-1');
    if (labelEl) labelEl.textContent = pid1;

    var html = '';
    html += '<span class="hl-comment">// 1. 加載 Prebid.js</span>\n';
    html += '<span class="hl-tag">&lt;script</span> <span class="hl-attr">src</span>=<span class="hl-val">"prebid.js"</span><span class="hl-tag">&gt;&lt;/script&gt;</span>\n\n';
    html += '<span class="hl-comment">// 2. 配置 S2S 並啓動競價</span>\n';
    html += '<span class="hl-kw">var</span> <span class="hl-obj">s2sConfig</span> = {\n';
    html += '  <span class="hl-key">accountId</span>: <span class="hl-str">"' + escapeHtml(accountId) + '"</span>,\n';
    html += '  <span class="hl-key">bidders</span>: [<span class="hl-str">"revosurge"</span>],\n';
    html += '  <span class="hl-key">adapter</span>: <span class="hl-str">"prebidServer"</span>,\n';
    html += '  <span class="hl-key">enabled</span>: <span class="hl-num">true</span>,\n';
    html += '  <span class="hl-key">endpoint</span>: <span class="hl-str">"' + escapeHtml(serverUrl) + '/openrtb2/auction"</span>,\n';
    html += '  <span class="hl-key">timeout</span>: <span class="hl-num">3000</span>\n';
    html += '};\n\n';
    html += '<span class="hl-obj">pbjs</span>.<span class="hl-fn">setConfig</span>({ <span class="hl-key">s2sConfig</span>: s2sConfig });\n\n';
    html += '<span class="hl-obj">pbjs</span>.<span class="hl-fn">addAdUnits</span>([{\n';
    html += '  <span class="hl-key">code</span>: <span class="hl-str">"ad-slot-1"</span>,\n';
    html += '  <span class="hl-key">mediaTypes</span>: { <span class="hl-key">banner</span>: { <span class="hl-key">sizes</span>: [[<span class="hl-num">300</span>, <span class="hl-num">250</span>]] } },\n';
    html += '  <span class="hl-key">bids</span>: [{ <span class="hl-key">bidder</span>: <span class="hl-str">"revosurge"</span>, <span class="hl-key">params</span>: { <span class="hl-key">placementId</span>: <span class="hl-str">"' + escapeHtml(pid1) + '"</span> } }]\n';
    html += '}]);\n\n';
    html += '<span class="hl-obj">pbjs</span>.<span class="hl-fn">requestBids</span>({ <span class="hl-key">timeout</span>: <span class="hl-num">5000</span> });';

    var preview = document.getElementById('s2s-codePreview');
    if (preview) preview.innerHTML = html;
  }

  function updateRuntimeConfig(s2sConfig, adUnit) {
    var el = document.getElementById('s2s-runtimeConfig');
    if (!el) return;
    var html = '';
    html += '<div><span class="key">Endpoint:</span> <span class="val">' + escapeHtml(s2sConfig.endpoint) + '</span></div>';
    html += '<div><span class="key">帳號:</span> <span class="val">' + escapeHtml(s2sConfig.accountId) + '</span></div>';
    html += '<div><span class="key">競價方:</span> <span class="val">revosurge</span></div>';
    html += '<div><span class="key">超時:</span> <span class="val">' + s2sConfig.timeout + 'ms</span></div>';
    if (adUnit) {
      html += '<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--vp-c-divider);">';
      html += '<div style="font-weight:600;margin-bottom:4px;color:var(--vp-c-text-1);">廣告位:</div>';
      html += '<div><span class="key">' + escapeHtml(adUnit.code) + ':</span> ';
      html += '<span class="val">' + escapeHtml(adUnit.bids[0].params.placementId) + ' (300x250)</span></div>';
      html += '</div>';
    }
    el.innerHTML = html;
  }

  function runTest() {
    var btn = document.getElementById('s2s-runBtn');
    btn.disabled = true;
    btn.textContent = '測試中...';
    logBox.innerHTML = '';

    ['s2s-status-prebid', 's2s-status-s2s', 's2s-status-auction', 's2s-status-render'].forEach(function(id) {
      setStatus(id, 'pending', '等待中...');
    });

    var wrapper = document.getElementById('s2s-ad-wrapper-1');
    if (wrapper) wrapper.className = 'ad-slot-wrapper';
    var container = document.getElementById('s2s-ad-container-1');
    if (container) container.innerHTML = '等待競價...';

    var serverUrl = document.getElementById('s2s-serverUrl').value.trim().replace(/\/+$/, '');
    var accountId = document.getElementById('s2s-accountId').value.trim();
    var pid1 = document.getElementById('s2s-placementId1').value.trim();

    log('========== 開始 S2S 競價測試 ==========', 'info');
    log('Server URL: ' + serverUrl);
    log('Account ID: ' + accountId);
    log('Placement ID: ' + pid1 + ' (300x250)');

    if (!document.getElementById('s2s-prebid-script')) {
      var prebidScript = document.createElement('script');
      prebidScript.id = 's2s-prebid-script';
      prebidScript.async = true;
      prebidScript.src = 'https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/not-for-prod/prebid.js';
      document.body.appendChild(prebidScript);
    }

    waitForPrebid(function() {
      setStatus('s2s-status-prebid', 'success', '已加載 v' + (window.pbjs.version || '?'));
      log('Prebid.js 已加載，版本: ' + (window.pbjs.version || 'unknown'), 'success');

      var s2sConfig = {
        accountId: accountId,
        bidders: ['revosurge'],
        adapter: 'prebidServer',
        enabled: true,
        endpoint: serverUrl + '/openrtb2/auction',
        syncEndpoint: serverUrl + '/cookie_sync',
        timeout: 3000
      };

      var ortb2 = { device: { geo: { country: 'IND' } } };

      try {
        if (window.pbjs.adUnits && window.pbjs.adUnits.length > 0) {
          window.pbjs.removeAdUnit();
        }
      } catch (e) {}

      window.pbjs.que = window.pbjs.que || [];
      window.pbjs.que.push(function() {
        window.pbjs.setConfig({ debug: true, s2sConfig: s2sConfig, ortb2: ortb2 });

        setStatus('s2s-status-s2s', 'success', '已配置');
        log('S2S 配置已應用: ' + JSON.stringify(s2sConfig, null, 2), 'success');

        var adUnit = {
          code: 'ad-slot-1',
          mediaTypes: { banner: { sizes: [[300, 250]] } },
          bids: [{ bidder: 'revosurge', params: { placementId: pid1 } }]
        };
        adUnit.ortb2Imp = { banner: { w: 300, h: 250 } };

        updateRuntimeConfig(s2sConfig, adUnit);

        window.pbjs.addAdUnits([adUnit]);
        setStatus('s2s-status-auction', 'pending', '競價中...');
        log('廣告位已添加，開始發起競價請求...');

        window.pbjs.requestBids({
          timeout: 5000,
          bidsBackHandler: function() {
            log('Prebid.js 競價完成！');
            setStatus('s2s-status-auction', 'success', '競價完成');

            var winners = window.pbjs.getHighestCpmBids('ad-slot-1');
            var w = document.getElementById('s2s-ad-wrapper-1');
            var c = document.getElementById('s2s-ad-container-1');

            if (winners && winners.length > 0) {
              var win = winners[0];
              setStatus('s2s-status-render', 'success', '競價成功 $' + win.cpm.toFixed(4));
              log('勝出出價: ' + win.bidderCode + ' - CPM: $' + win.cpm.toFixed(4), 'success');
              if (w) w.className = 'ad-slot-wrapper has-bid';
              if (c) {
                if (win.ad) {
                  c.innerHTML = win.ad;
                } else {
                  c.innerHTML = '<div style="text-align:center;padding:20px;">'
                    + '<div style="color:var(--vp-c-green);font-size:18px;margin-bottom:8px;font-weight:600;">競價成功</div>'
                    + '<div style="color:var(--vp-c-text-2);font-size:13px;">'
                    + '競價方: ' + escapeHtml(win.bidderCode) + '<br/>'
                    + 'CPM: $' + win.cpm.toFixed(4) + '<br/>'
                    + '尺寸: ' + win.width + 'x' + win.height
                    + '</div></div>';
                }
              }
              log('========== 測試完成：競價成功 ==========', 'success');
            } else {
              setStatus('s2s-status-render', 'warn', '無出價');
              if (w) w.className = 'ad-slot-wrapper no-bid';
              if (c) {
                c.innerHTML = '<div style="text-align:center;padding:20px;">'
                  + '<div style="color:var(--vp-c-warning-1);font-size:16px;margin-bottom:8px;">已連接 - 無出價</div>'
                  + '<div style="color:var(--vp-c-text-2);font-size:12px;">S2S 通道正常，但未返回有效出價</div>'
                  + '</div>';
              }
              log('========== 測試完成：已連接但無出價(測試環境屬正常現象) ==========', 'warn');
            }

            btn.disabled = false;
            btn.textContent = '重新測試';
          }
        });
      });
    });
  }

  function waitForPrebid(callback) {
    if (typeof window.pbjs !== 'undefined') {
      callback();
      return;
    }
    setStatus('s2s-status-prebid', 'pending', '加載中...');
    log('等待 Prebid.js 加載...');
    var attempts = 0;
    var timer = setInterval(function() {
      attempts++;
      if (typeof window.pbjs !== 'undefined') {
        clearInterval(timer);
        callback();
      } else if (attempts >= 30) {
        clearInterval(timer);
        setStatus('s2s-status-prebid', 'error', '加載超時');
        log('Prebid.js 加載超時 (15s)', 'error');
        var runBtn = document.getElementById('s2s-runBtn');
        if (runBtn) {
          runBtn.disabled = false;
          runBtn.textContent = '重新測試';
        }
      }
    }, 500);
  }

  var runBtn = document.getElementById('s2s-runBtn');
  if (runBtn) runBtn.addEventListener('click', runTest);

  ['s2s-serverUrl', 's2s-accountId', 's2s-placementId1'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', updateCodePreview);
  });

  updateCodePreview();
})
</script>

<style>
.s2s-dbg h3 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 14px;
  color: var(--vp-c-text-1);
}

.s2s-dbg .controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 32px;
}

.s2s-dbg .input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.s2s-dbg .input-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.s2s-dbg .input-group input {
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

.s2s-dbg .input-group input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(52, 81, 178, 0.1);
}

.s2s-dbg button {
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

.s2s-dbg button:hover { background: var(--vp-c-brand-1); }

.s2s-dbg button:disabled {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-3);
  cursor: not-allowed;
  border: 1px solid var(--vp-c-divider);
}

.s2s-dbg .grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.s2s-dbg .card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 20px;
}

.s2s-dbg .status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.s2s-dbg .status.pending { background: var(--vp-c-bg-alt); color: var(--vp-c-text-2); }
.s2s-dbg .status.success { background: var(--vp-c-green-soft); color: var(--vp-c-green); }
.s2s-dbg .status.error { background: var(--vp-c-danger-soft); color: var(--vp-c-danger-1); }
.s2s-dbg .status.warn { background: var(--vp-c-warning-soft); color: var(--vp-c-warning-1); }

.s2s-dbg .status::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: currentColor;
}

.s2s-dbg .test-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.s2s-dbg .test-row:last-child { border-bottom: none; }

.s2s-dbg .test-name {
  font-size: 14px;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
}

.s2s-dbg .log-box {
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

.s2s-dbg .log-line { white-space: pre-wrap; word-break: break-all; }
.s2s-dbg .log-line.info { color: var(--vp-c-brand-1); }
.s2s-dbg .log-line.success { color: var(--vp-c-green); }
.s2s-dbg .log-line.error { color: var(--vp-c-danger-1); }
.s2s-dbg .log-line.warn { color: var(--vp-c-warning-1); }
.s2s-dbg .log-line .ts { color: var(--vp-c-text-3); margin-right: 8px; }

.s2s-dbg .ad-slot-wrapper {
  background: var(--vp-c-bg-alt);
  border: 2px dashed var(--vp-c-border);
  border-radius: 8px;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-2);
  font-size: 13px;
  overflow: hidden;
  padding: 12px;
}

.s2s-dbg .ad-slot-wrapper.has-bid {
  border-color: var(--vp-c-green);
  border-style: solid;
}

.s2s-dbg .ad-slot-wrapper.no-bid { border-color: var(--vp-c-warning-1); }

.s2s-dbg .ad-slot-label {
  font-size: 11px;
  color: var(--vp-c-text-3);
  margin-bottom: 8px;
  font-family: var(--vp-font-family-mono);
}

.s2s-dbg .code-block {
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

.s2s-dbg .code-block .hl-tag { color: #89b4fa; }
.s2s-dbg .code-block .hl-attr { color: #f9e2af; }
.s2s-dbg .code-block .hl-val { color: #a6e3a1; }
.s2s-dbg .code-block .hl-comment { color: #6c7086; }
.s2s-dbg .code-block .hl-key { color: #cba6f7; }
.s2s-dbg .code-block .hl-str { color: #a6e3a1; }
.s2s-dbg .code-block .hl-num { color: #fab387; }
.s2s-dbg .code-block .hl-kw { color: #cba6f7; }
.s2s-dbg .code-block .hl-fn { color: #89b4fa; }
.s2s-dbg .code-block .hl-obj { color: #f9e2af; }

.s2s-dbg .config-display {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.s2s-dbg .config-display .key { color: var(--vp-c-danger-1); }
.s2s-dbg .config-display .val { color: var(--vp-c-brand-1); }

@media (max-width: 768px) {
  .s2s-dbg .grid { grid-template-columns: 1fr; }
  .s2s-dbg .input-group input { width: 100% !important; }
}
</style>
