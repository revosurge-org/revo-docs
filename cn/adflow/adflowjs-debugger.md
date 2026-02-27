---
title: adflow.js 调试器
---

# adflow.js 测试

测试 adflow.js 一键接入方案：只需引入脚本 + 放置 iframe 标签即可完成 Prebid S2S 竞价。

## 配置参数

<ClientOnly>
<div class="adflowjs-dbg">
  <div class="controls">
    <div class="input-group">
      <label>Server URL</label>
      <input type="text" id="af-serverUrl" value="https://prebid-server.revosurge-test.com/" style="width: 380px;" />
    </div>
    <div class="input-group">
      <label>Account ID</label>
      <input type="text" id="af-accountId" value="test" style="width: 140px;" />
    </div>
    <div class="input-group">
      <label>Placement ID</label>
      <input type="text" id="af-placementId1" value="test-placement-1" />
    </div>
    <button id="af-runBtn">运行测试</button>
  </div>
</div>
</ClientOnly>

## 代码预览

根据上方配置参数自动生成的接入代码，客户只需复制以下代码即可接入：

<ClientOnly>
<div class="adflowjs-dbg">
  <div class="card" style="margin-bottom: 24px;">
    <h3>生成的 HTML 代码</h3>
    <div id="af-codePreview" class="code-block"></div>
  </div>
</div>
</ClientOnly>

## 测试状态

<ClientOnly>
<div class="adflowjs-dbg">
  <div class="grid">
    <div class="card">
      <h3>执行状态</h3>
      <div>
        <div class="test-row"><span class="test-name">脚本加载</span><span class="status pending" id="af-status-script">等待测试</span></div>
        <div class="test-row"><span class="test-name">配置读取</span><span class="status pending" id="af-status-config">等待测试</span></div>
        <div class="test-row"><span class="test-name">广告位发现</span><span class="status pending" id="af-status-slots">等待测试</span></div>
        <div class="test-row"><span class="test-name">Prebid.js 加载</span><span class="status pending" id="af-status-prebid">等待测试</span></div>
        <div class="test-row"><span class="test-name">S2S 竞价</span><span class="status pending" id="af-status-auction">等待测试</span></div>
        <div class="test-row"><span class="test-name">广告渲染</span><span class="status pending" id="af-status-render">等待测试</span></div>
      </div>
    </div>
    <div class="card" id="af-runtime-config">
      <h3>运行时配置</h3>
      <div id="af-runtimeConfig" class="config-display">
        <div><span class="key">状态:</span> <span class="val">未启动</span></div>
      </div>
    </div>
  </div>
</div>
</ClientOnly>

## 广告预览

<ClientOnly>
<div class="adflowjs-dbg">
  <div class="card" style="margin-bottom: 24px;">
    <h3>测试广告位 (300x250)</h3>
    <div class="ad-slot-wrapper" id="af-ad-wrapper-1">
      <div class="ad-slot-label">data-placement-id="<span id="af-label-pid-1">test-placement-1</span>"</div>
      <div id="af-ad-container-1" style="width:300px;height:250px;display:flex;align-items:center;justify-content:center;color:var(--vp-c-text-3);">
        等待竞价...
      </div>
    </div>
  </div>
</div>
</ClientOnly>

## 日志

<ClientOnly>
<div class="adflowjs-dbg">
  <div class="card" style="margin-bottom: 20px;">
    <div id="af-logBox" class="log-box"></div>
  </div>
</div>
</ClientOnly>

<script setup>
import { onMounted, nextTick } from 'vue'

onMounted(async () => {
  await nextTick()
  var logBox = document.getElementById('af-logBox');

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
    var serverUrl = document.getElementById('af-serverUrl').value.trim();
    var accountId = document.getElementById('af-accountId').value.trim();
    var pid1 = document.getElementById('af-placementId1').value.trim();

    var labelEl = document.getElementById('af-label-pid-1');
    if (labelEl) labelEl.textContent = pid1;

    var html = '';
    html += '<span class="hl-comment">&lt;!-- Include adflow.js --&gt;</span>\n';
    html += '<span class="hl-tag">&lt;script</span> <span class="hl-attr">src</span>=<span class="hl-val">"adflow.min.js"</span>\n';
    html += '    <span class="hl-attr">data-server-url</span>=<span class="hl-val">"' + escapeHtml(serverUrl) + '"</span>\n';
    html += '    <span class="hl-attr">data-account-id</span>=<span class="hl-val">"' + escapeHtml(accountId) + '"</span>\n';
    html += '    <span class="hl-attr">data-debug</span><span class="hl-tag">&gt;&lt;/script&gt;</span>\n';
    html += '\n';
    html += '<span class="hl-comment">&lt;!-- Ad Slot: 300x250 --&gt;</span>\n';
    html += '<span class="hl-tag">&lt;iframe</span> <span class="hl-attr">data-adflow-ad</span>\n';
    html += '    <span class="hl-attr">data-placement-id</span>=<span class="hl-val">"' + escapeHtml(pid1) + '"</span>\n';
    html += '    <span class="hl-attr">width</span>=<span class="hl-val">"300"</span> <span class="hl-attr">height</span>=<span class="hl-val">"250"</span><span class="hl-tag">&gt;&lt;/iframe&gt;</span>';

    var preview = document.getElementById('af-codePreview');
    if (preview) preview.innerHTML = html;
  }

  function trackStatus(msg) {
    if (msg.indexOf('Initializing') !== -1) {
      setStatus('af-status-script', 'success', '已加载');
      setStatus('af-status-config', 'success', '已读取');
    }
    if (msg.indexOf('Found') !== -1 && msg.indexOf('ad slot') !== -1) {
      var match = msg.match(/Found (\d+)/);
      setStatus('af-status-slots', 'success', '发现 ' + (match ? match[1] : '') + ' 个广告位');
    }
    if (msg.indexOf('Prebid.js loaded') !== -1 || msg.indexOf('Prebid.js already loaded') !== -1) {
      setStatus('af-status-prebid', 'success', '已加载');
    }
    if (msg.indexOf('Loading Prebid.js') !== -1) {
      setStatus('af-status-prebid', 'pending', '加载中...');
    }
    if (msg.indexOf('S2S config') !== -1) {
      setStatus('af-status-auction', 'pending', '竞价中...');
    }
    if (msg.indexOf('Auction complete') !== -1) {
      setStatus('af-status-auction', 'success', '竞价完成');
    }
    if (msg.indexOf('won by') !== -1) {
      setStatus('af-status-render', 'success', '已渲染');
    }
    if (msg.indexOf('no bids') !== -1) {
      var el = document.getElementById('af-status-render');
      if (el && (el.textContent === '等待测试' || el.textContent === '竞价中...')) {
        setStatus('af-status-render', 'warn', '无出价');
      }
    }
    if (msg.indexOf('Failed to load Prebid.js') !== -1) {
      setStatus('af-status-prebid', 'error', '加载失败');
    }
    if (msg.indexOf('data-account-id is required') !== -1) {
      setStatus('af-status-config', 'error', '缺少 account-id');
    }
    if (msg.indexOf('No valid') !== -1) {
      setStatus('af-status-slots', 'error', '未找到广告位');
    }
  }

  var origLog = console.log;
  var origWarn = console.warn;

  console.log = function() {
    origLog.apply(console, arguments);
    var msg = Array.prototype.slice.call(arguments).join(' ');
    if (msg.indexOf('[AdFlow]') !== -1) {
      log(msg, 'info');
      trackStatus(msg);
    }
  };

  console.warn = function() {
    origWarn.apply(console, arguments);
    var msg = Array.prototype.slice.call(arguments).join(' ');
    if (msg.indexOf('[AdFlow]') !== -1) {
      log(msg, 'warn');
      trackStatus(msg);
    }
  };

  function updateRuntimeConfig() {
    var ads = window.__adflow;
    var el = document.getElementById('af-runtimeConfig');
    if (!el) return;
    if (!ads || !ads.config) {
      el.innerHTML = '<div><span class="key">状态:</span> <span class="val">未初始化</span></div>';
      return;
    }
    var c = ads.config;
    var html = '';
    html += '<div><span class="key">版本:</span> <span class="val">' + (ads.version || '-') + '</span></div>';
    html += '<div><span class="key">服务器:</span> <span class="val">' + escapeHtml(c.serverUrl) + '</span></div>';
    html += '<div><span class="key">账号:</span> <span class="val">' + escapeHtml(c.accountId) + '</span></div>';
    html += '<div><span class="key">竞价方:</span> <span class="val">' + escapeHtml(c.bidder) + '</span></div>';
    html += '<div><span class="key">超时:</span> <span class="val">' + c.timeout + 'ms</span></div>';
    html += '<div><span class="key">调试:</span> <span class="val">' + c.debug + '</span></div>';
    if (ads.slots && ads.slots.length > 0) {
      html += '<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--vp-c-divider);">';
      html += '<div style="font-weight:600;margin-bottom:4px;color:var(--vp-c-text-1);">广告位:</div>';
      ads.slots.forEach(function(slot) {
        html += '<div><span class="key">' + escapeHtml(slot.code) + ':</span> '
          + '<span class="val">' + escapeHtml(slot.placementId)
          + ' (' + slot.width + 'x' + slot.height + ')</span></div>';
      });
      html += '</div>';
    }
    el.innerHTML = html;
  }

  function pollForCompletion(btn) {
    var attempts = 0;
    var maxAttempts = 40;
    var timer = setInterval(function() {
      attempts++;
      updateRuntimeConfig();
      var iframe = document.querySelector('#af-ad-container-1 iframe[data-adflow-ad]');
      var wrapper = document.getElementById('af-ad-wrapper-1');
      var done = false;
      var rendered = false;
      if (iframe) {
        if (iframe.style.display === 'none') {
          done = true;
          if (wrapper) wrapper.className = 'ad-slot-wrapper no-bid';
        } else {
          try {
            var doc = iframe.contentWindow.document;
            var body = doc.body;
            if (body && body.innerHTML && body.innerHTML.length > 10) {
              done = true;
              rendered = true;
              if (wrapper) wrapper.className = 'ad-slot-wrapper has-bid';
            }
          } catch (e) {
            if (iframe.srcdoc && iframe.srcdoc.length > 0) {
              done = true;
              rendered = true;
              if (wrapper) wrapper.className = 'ad-slot-wrapper has-bid';
            }
          }
        }
      }
      if (done) {
        clearInterval(timer);
        if (rendered) {
          setStatus('af-status-render', 'success', '广告已渲染');
          log('========== 测试完成：竞价成功 ==========', 'success');
        } else {
          setStatus('af-status-render', 'warn', '无出价');
          log('========== 测试完成：已连接但无出价（测试环境属正常现象） ==========', 'warn');
        }
        btn.disabled = false;
        btn.textContent = '重新测试';
        return;
      }
      if (attempts >= maxAttempts) {
        clearInterval(timer);
        log('测试超时 (20s)', 'warn');
        setStatus('af-status-render', 'warn', '无出价');
        btn.disabled = false;
        btn.textContent = '重新测试';
      }
    }, 500);
  }

  function runTest() {
    var btn = document.getElementById('af-runBtn');
    btn.disabled = true;
    btn.textContent = '测试中...';
    logBox.innerHTML = '';

    ['af-status-script', 'af-status-config', 'af-status-slots', 'af-status-prebid', 'af-status-auction', 'af-status-render'].forEach(function(id) {
      setStatus(id, 'pending', '等待中...');
    });

    var wrapper = document.getElementById('af-ad-wrapper-1');
    if (wrapper) wrapper.className = 'ad-slot-wrapper';

    if (window.__adflow) delete window.__adflow;
    if (window.pbjs) {
      try { if (window.pbjs.adUnits) window.pbjs.removeAdUnit(); } catch (e) {}
    }

    var serverUrl = document.getElementById('af-serverUrl').value.trim();
    var accountId = document.getElementById('af-accountId').value.trim();
    var pid1 = document.getElementById('af-placementId1').value.trim();

    log('========== 开始 adflow.js 测试 ==========', 'info');
    log('Server URL: ' + serverUrl);
    log('Account ID: ' + accountId);
    log('Placement ID: ' + pid1 + ' (300x250)');

    var container1 = document.getElementById('af-ad-container-1');
    container1.innerHTML = '';

    var iframe1 = document.createElement('iframe');
    iframe1.setAttribute('data-adflow-ad', '');
    iframe1.setAttribute('data-placement-id', pid1);
    iframe1.setAttribute('width', '300');
    iframe1.setAttribute('height', '250');
    iframe1.style.border = 'none';
    container1.appendChild(iframe1);

    log('已创建 <iframe data-adflow-ad> 元素');

    var oldScript = document.getElementById('af-adflow-script');
    if (oldScript) oldScript.parentNode.removeChild(oldScript);

    var script = document.createElement('script');
    script.id = 'af-adflow-script';
    script.src = '/adflow/adflow.min.js';
    script.setAttribute('data-server-url', serverUrl);
    script.setAttribute('data-account-id', accountId);
    script.setAttribute('data-debug', '');

    script.onload = function() {
      log('adflow.js 已加载', 'success');
      updateRuntimeConfig();
      pollForCompletion(btn);
    };
    script.onerror = function() {
      log('adflow.js 加载失败！', 'error');
      setStatus('af-status-script', 'error', '加载失败');
      btn.disabled = false;
      btn.textContent = '重新测试';
    };

    log('正在注入 adflow.js 脚本...');
    document.body.appendChild(script);
  }

  var runBtn = document.getElementById('af-runBtn');
  if (runBtn) runBtn.addEventListener('click', runTest);

  ['af-serverUrl', 'af-accountId', 'af-placementId1'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', updateCodePreview);
  });

  updateCodePreview();
})
</script>

<style>
.adflowjs-dbg h3 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 14px;
  color: var(--vp-c-text-1);
}

.adflowjs-dbg .controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 32px;
}

.adflowjs-dbg .input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.adflowjs-dbg .input-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.adflowjs-dbg .input-group input {
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

.adflowjs-dbg .input-group input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(52, 81, 178, 0.1);
}

.adflowjs-dbg button {
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

.adflowjs-dbg button:hover { background: var(--vp-c-brand-1); }

.adflowjs-dbg button:disabled {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-3);
  cursor: not-allowed;
  border: 1px solid var(--vp-c-divider);
}

.adflowjs-dbg .grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.adflowjs-dbg .card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 20px;
}

.adflowjs-dbg .status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.adflowjs-dbg .status.pending { background: var(--vp-c-bg-alt); color: var(--vp-c-text-2); }
.adflowjs-dbg .status.success { background: var(--vp-c-green-soft); color: var(--vp-c-green); }
.adflowjs-dbg .status.error { background: var(--vp-c-danger-soft); color: var(--vp-c-danger-1); }
.adflowjs-dbg .status.warn { background: var(--vp-c-warning-soft); color: var(--vp-c-warning-1); }

.adflowjs-dbg .status::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: currentColor;
}

.adflowjs-dbg .test-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.adflowjs-dbg .test-row:last-child { border-bottom: none; }

.adflowjs-dbg .test-name {
  font-size: 14px;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
}

.adflowjs-dbg .log-box {
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

.adflowjs-dbg .log-line { white-space: pre-wrap; word-break: break-all; }
.adflowjs-dbg .log-line.info { color: var(--vp-c-brand-1); }
.adflowjs-dbg .log-line.success { color: var(--vp-c-green); }
.adflowjs-dbg .log-line.error { color: var(--vp-c-danger-1); }
.adflowjs-dbg .log-line.warn { color: var(--vp-c-warning-1); }
.adflowjs-dbg .log-line .ts { color: var(--vp-c-text-3); margin-right: 8px; }

.adflowjs-dbg .ad-slot-wrapper {
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

.adflowjs-dbg .ad-slot-wrapper.has-bid {
  border-color: var(--vp-c-green);
  border-style: solid;
}

.adflowjs-dbg .ad-slot-wrapper.no-bid { border-color: var(--vp-c-warning-1); }

.adflowjs-dbg .ad-slot-label {
  font-size: 11px;
  color: var(--vp-c-text-3);
  margin-bottom: 8px;
  font-family: var(--vp-font-family-mono);
}

.adflowjs-dbg .code-block {
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

.adflowjs-dbg .code-block .hl-tag { color: #89b4fa; }
.adflowjs-dbg .code-block .hl-attr { color: #f9e2af; }
.adflowjs-dbg .code-block .hl-val { color: #a6e3a1; }
.adflowjs-dbg .code-block .hl-comment { color: #6c7086; }

.adflowjs-dbg .config-display {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.adflowjs-dbg .config-display .key { color: var(--vp-c-danger-1); }
.adflowjs-dbg .config-display .val { color: var(--vp-c-brand-1); }

@media (max-width: 768px) {
  .adflowjs-dbg .grid { grid-template-columns: 1fr; }
  .adflowjs-dbg .input-group input { width: 100% !important; }
}
</style>
