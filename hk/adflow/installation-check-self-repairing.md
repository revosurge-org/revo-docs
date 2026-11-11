---
title: AdFlow 安裝檢查失敗自助排查與文檔入口
description: 排查 AdFlow 安裝檢查未收到請求的問題，核對頁面與廣告位代碼，並聯絡人工支援。
---

# AdFlow 安裝檢查失敗自助排查與文檔入口

## 背景與結論

AdFlow 安裝檢查只查詢指定網站與廣告位在檢查視窗內是否有真實 Bid Request 到達 Prebid Server，不會主動製造請求。未查到匹配請求只能說明「本次未查到」，不能單憑這一結果斷定代碼未生效、廣告沒有返回或網站無法展示。用戶安裝代碼後需要在已發布的目標頁面開啟或重新載入頁面並觸發該廣告位；儲存或發布操作本身不保證站長已開啟的頁面自動重新載入。

## 目標

在安裝檢查失敗卡片提供一個明顯但輕量的自助排查入口，跳轉 RevoSurge 文檔中心 AdFlow 目錄的「安裝代碼失敗 QA」。用戶按症狀排查，仍無法解決時使用現有客服聯絡方式。保留原有「稍後再試」文案，不在檢查介面承諾固定等待分鐘數。

## 範圍與交互

1. AdFlow 兩步集成代碼右側的安裝檢查：檢查失敗（本次未收到匹配請求）時，在失敗原因卡片底部顯示文字連結「安裝遇到問題？查看排查指南」；點擊後新分頁開啟文檔，保留 AdFlow 目前檢查狀態。成功態不顯示此入口。
2. 文檔中心 AdFlow 目錄在「S2S 調試器」下新增「安裝代碼失敗 QA」，路徑建議為 `/hk/adflow/install-check-qa`；中文版可後續對應 `/cn/adflow/install-check-qa`。
3. 文檔頁先說明安裝檢查的成功邊界：匹配的真實 Bid Request 被 Prebid Server 收到；NO_BID、競價篩選、廣告未展示不等於安裝失敗。
4. 無法直接讀取用戶網頁或瀏覽器 Console 時，系統只展示可證實的「未收到匹配請求」，不自動歸因為某一種錯誤。

## 自助排查內容

| 現象或可能原因                                               | 用戶自查與解決                                               |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 代碼只儲存到編輯器、預覽或測試環境，正式頁面尚未發布；舊頁面未重新載入或受快取影響 | 確認修改已發布到目標環境；在目標廣告位所在的公開頁面重新開啟或重新載入，並確認頁面實際載入到新代碼。發布動作不會一概刷新已開啟的頁面。 |
| 共用腳本或廣告位代碼漏裝、裝在錯誤頁面、放錯範本             | 對照 AdFlow 的兩步代碼，確認共用腳本和該廣告位代碼都存在於目標頁面；同一網站範本的共用腳本只裝一次。 |
| 帳號 ID、廣告位 ID、代碼屬性與 AdFlow 中的目標對象不一致     | 從對應網站及廣告位重新複製正式代碼，核對 `data-account-id`、`data-placement-id` 等屬性；不要混用範例代碼或其他帳號的代碼。 |
| 頁面已開啟但廣告位尚未觸發                                   | 捲動至廣告位、完成頁面必要互動，或依網站的延遲載入/單頁應用邏輯觸發；在瀏覽器網絡面板確認有請求，再回 AdFlow 重查。 |
| 腳本沒有載入或執行                                           | 在瀏覽器開發者工具的 Network/Console 查看腳本載入、JavaScript 錯誤、CSP 攔截或網絡阻斷；請網站開發者修復設定。僅在自己的測試瀏覽器暫時排除擴充功能的攔截影響，不要求一般訪客關閉安全功能。 |
| 請求已發出，但本次檢查尚未檢索到                             | 稍後再試，確認檢查的是同一網站、同一廣告位以及正確的頁面；資料處理有短暫延遲。 |
| 有 Bid Request 但沒有廣告                                    | 安裝檢查已通過；NO_BID、格式/尺寸/需求匹配或後續渲染問題應在廣告投放排查中處理，不作為代碼安裝失敗。 |
| 廣告位狀態為 pending（待驗證）或 disabled（已停用）          | 在 AdFlow 後台確認廣告位狀態為 active。新建的廣告位預設為 pending，需要代碼安裝成功並觸發驗證後才會變為 active。如果狀態為 disabled，手動啟用或聯絡管理員。 |
| 網站狀態不是 active                                          | 安裝檢查的前置條件是網站（Website）處於 active 狀態且未被刪除。在 AdFlow 網站管理中確認對應網站已啟用。如果網站被停用，該網站下所有廣告位的檢查都會失敗。 |
| 帳號狀態為 disabled                                          | 帳號被停用後，所有廣告位的檢查請求都不會被查詢。確認 AdFlow 帳號處於 active 狀態；如顯示已停用，聯絡管理員恢復。 |
| 檢查結果顯示「未知」（unknown）                                | 當報表通道不可用（adflow.reporting.enabled=false）或 datapulse/reporting 服務故障時，檢查回傳「未知」而非「未查到」。這不是安裝問題，是系統暫時無法核查。稍後再試；如持續出現請聯絡客服。 |
| 廣告位的 externalPlacementId 尚未同步                        | 安裝檢查透過 PL_XXXXXX 格式的外部 ID 去 BQ 匹配競價請求。如果廣告位剛建立，外部 ID 可能尚未同步到數據管道。建立後等待 1-2 分鐘再觸發檢查。 |
| BQ 競價請求鏡像有數據延遲                                    | 檢查的資料源是 kafka.bid_requests_raw_recent（BigQuery 中的競價請求鏡像表），從 Prebid Server 收到請求到 BQ 可查存在分鐘級延遲。剛觸發的請求可能需要等待 2-5 分鐘後才能被檢查到。 |
| publisher ID (AC_XXXXXX) 與代碼中的不一致                    | BQ 核查按 externalAccountId（格式 AC_XXXXXX）+ externalPlacementId（格式 PL_XXXXXX）精確匹配。確認頁面代碼中的 data-account-id 和 data-placement-id 與 AdFlow 後台顯示的值完全一致，不要手動修改 ID。 |
| 檢查視窗內確實沒有匹配請求（數據管道側確認）                 | 安裝檢查只查詢指定網站與廣告位在檢查視窗內是否有真實 Bid Request 到達 Prebid Server，不會主動製造請求。如果頁面已正確安裝但檢查仍失敗，在瀏覽器 Network 面板確認是否有發往 prebid-server.revosurge.com 的請求，以及請求中是否攜帶了正確的 publisher/placement ID。 |

## 人工支援

仍未解決時，引導用戶透過 AdFlow 右下角現有客服聯絡。建議提供網站網域、實際頁面 URL、廣告位 ID、代碼發布時間、最近檢查時間及瀏覽器 Network/Console 的相關截圖；不要傳送密碼、金鑰或用戶私隱資料。

當用戶聯絡客服時，建議提供以下代碼級診斷資訊：
AdFlow 後台截圖：廣告位狀態（pending/active/disabled）、網站狀態
檢查結果顯示：recent_request_seen / not_seen_yet / unknown
瀏覽器 Network 面板截圖：發往 Prebid Server 的請求 URL 和回應狀態碼
頁面原始碼：確認 data-account-id、data-placement-id 屬性值
廣告位建立時間：判斷是否處於同步延遲視窗

## 驗收標準

- 第一次點擊「檢查網站請求」的示範顯示失敗及排查連結；第二次點擊顯示成功，並明確「收到真實 Bid Request」，不承諾廣告展示。
- 失敗連結進入文檔中心 AdFlow → S2S 調試器下方的「安裝代碼失敗 QA」；可返回 AdFlow，檢查狀態保留。
- 文檔涵蓋發布/重新載入、兩段代碼、ID、觸發條件、腳本與網絡阻斷、短暫延遲、NO_BID 與展示區分、人工支援。
- 只讀檢查真實請求，不偽造測試流量；未收到請求時不臆斷唯一失敗原因。

## 參考

- [RevoSurge Publisher Integration Guide](https://docs.revosurge.com/en/adflow/integration-guide)
- [MDN：Location.reload()](https://developer.mozilla.org/en-US/docs/Web/API/Location/reload)
- [MDN：CSP script-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src)
- [Prebid：requestBids](https://docs.prebid.org/dev-docs/publisher-api-reference/requestBids.html)
- [Prebid：getNoBids](https://docs.prebid.org/dev-docs/publisher-api-reference/getNoBids.html)

狀態：產品 review 通過，已同步 Linear Backlog；技術實作、錯誤可觀測性與文檔發布安排待開發評估。