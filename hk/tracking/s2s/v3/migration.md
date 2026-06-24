---
title: 從 v2 遷移到 v3
sidebar_label: 從 v2 遷移
description: S2S 事件 v2 與 v3 之間的變更 — 信封、毫秒、型別化目錄 — 附欄位映射及切換步驟。
---

# 從 v2 遷移到 v3

**對象：** 維護現有 v2 整合的工程師

v2 與 v3 是**獨立的端點** — v2 保持不變地運作，因此你可以按自己的節奏遷移。沒有自動轉換：呼叫方直接傳送 v3 合約。

## 變更概覽

| 方面 | v2 | v3 |
|------|----|----|
| 端點 | `/v2/s2s/event`、`/v2/s2s/batch` | `/v3/s2s/event`、`/v3/s2s/batch` |
| 認證標頭 | `X-API-KEY` | `X-API-KEY`（不變） |
| 載荷結構 | 扁平物件 | [信封](/hk/tracking/s2s/v3/mandatory-properties)：`event` · `timestamp` · `identity` · `context` |
| 事件欄位 | `event_name` | `event` |
| `timestamp` | Unix **秒** | Unix **毫秒**（13 位數） |
| Identity | 頂層的 `client_user_id` | `identity{}` — `client_user_id` / `anonymous_id` 至少其中之一 |
| 歸因 | 頂層的 `click_id` | `identity.click_id` |
| 事件特定欄位 | 頂層 | 在 `context` 之內 |
| PII | （無） | 在 `context.privacy.*` 之下雜湊（SHA-256） |
| 事件名稱 | 自由字串 | **已登記**目錄事件（型別化並驗證） |
| 批次 | JSON 陣列 | JSON 陣列，**最多 600** |
| 成功 | `200` | `202`（`{ "status": "accepted", ... }`） |
| 錯誤 | 純文字 | 結構化 `code` + `violations[]`（`400` / `422` / `429`） |

## 載荷轉換

同一個 `deposit` 事件，前後對比：

::: code-group

```json [v2 (flat)]
{
  "client_user_id": "user_001",
  "click_id": "clk_998877",
  "event_name": "deposit",
  "timestamp": 1702963200,
  "ip_address": "203.0.113.1",
  "transaction_id": "tx_554433",
  "amount": 50.00,
  "currency": "USD"
}
```

```json [v3 (envelope)]
{
  "event": "deposit",
  "timestamp": 1702963200000,
  "identity": {
    "client_user_id": "user_001",
    "click_id": "clk_998877"
  },
  "context": {
    "ip_address": "203.0.113.1",
    "transaction_id": "tx_554433",
    "amount": 50.00,
    "currency": "USD"
  }
}
```

:::

## 欄位映射

| v2 (flat) | v3 (envelope) |
|-----------|---------------|
| `event_name` | `event` |
| `timestamp`（秒） | `timestamp`（× 1000 → 毫秒） |
| `client_user_id` | `identity.client_user_id` |
| `click_id` | `identity.click_id` |
| `ip_address` | `context.ip_address` |
| `amount`、`currency`、`transaction_id`、`is_crypto`、… | `context.*` |
| _（v3 新增）_ | `identity.anonymous_id`、`context.privacy.email_hash`、… |

## 遊戲：投注結算

v3 將一個已結算的投注建模為**單一 `bet` 事件**，內嵌 `bet_result` 及 `bet_result_amount` — 沒有獨立的 `win` / `loss` 事件。如果你的 v2 整合傳送了獨立的結算事件，請將它們合併為每張票券一個 `bet`。請參閱 [iGaming 事件 → `bet`](/hk/tracking/s2s/v3/events-igaming#bet)。

## 切換步驟

1. 確認你的 `X-API-KEY` 在 v3 下可用（相同金鑰、相同基礎 URL）。對於 iGaming 事件，確認你的產品已[訂閱](/hk/tracking/s2s/v3/catalog-governance)。
2. 將端點從 `/v2/...` 切換到 `/v3/...`。
3. 將載荷重構為信封（`event` / `timestamp` / `identity` / `context`）。
4. 將 `timestamp` 從秒轉換為**毫秒**。
5. 將 PII 移至 `context.privacy.*`，並作為 **SHA-256** 雜湊。
6. 使用[測試模式](/hk/tracking/s2s/v3/server-events-api)（`X-Test-Mode: true`）驗證 — 修正任何 `violations[]`。
7. 一次切換一種事件類型；在 v3 驗證通過前保留 v2 運作。

## 參考

- [伺服器事件 API (v3)](/hk/tracking/s2s/v3/server-events-api)
- [請求信封與基礎屬性](/hk/tracking/s2s/v3/mandatory-properties)
- [事件目錄與驗證](/hk/tracking/s2s/v3/catalog-governance)
- [標準事件](/hk/tracking/s2s/v3/events-standard) · [iGaming 事件](/hk/tracking/s2s/v3/events-igaming)
- [伺服器事件 API (v2)](/hk/tracking/s2s/server-events-api)
