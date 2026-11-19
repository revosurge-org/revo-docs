---
title: Prebid Mobile SDK（App 內接入）
description: 在原生 iOS 或 Android App 中使用 Prebid Mobile SDK。SDK 可直接渲染得標廣告，也可以將競價結果交給 Google Ad Manager。
---

# Prebid Mobile SDK（App 內接入） {#prebid-mobile-sdk}

如需在原生 iOS / Android App 中變現，請使用開源的 [Prebid Mobile SDK](https://docs.prebid.org/prebid-mobile/prebid-mobile.html)。SDK 從 App 向 Revosurge Prebid Server（與 [S2S 配置接入](./s2s-integration#s2s-integration) 使用同一個服務）發起競價請求，然後由 SDK 直接渲染中標廣告，或將競價結果交給你的廣告服務器（如 GAM）。

::: info 接入方式
- **Prebid 渲染（無廣告服務器）** — SDK 完成競價並渲染中標廣告。未使用廣告服務器時最簡單的方式。
- **GAM（僅競價）** — SDK 獲取競價，並將價格 key-value 寫入 GAM 請求，由 GAM 決定最終投放的廣告。
:::

::: tip
以下示例基於 Prebid Mobile SDK **3.x**。3.0 起已移除 `setPrebidServerHost()` / `Host.createCustomHost()`，改為在 `initializeSdk()` 中傳入 Prebid Server 地址。
:::

## 前置條件 {#pbm-prerequisites}

- 已開通 AdFlow 賬號並獲取 **Account ID**
- 每個廣告位對應的 **Config ID**（Revosurge Prebid Server 上的 stored impression ID），由 Revosurge 對接人提供
- Android：`minSdkVersion` 21 及以上；iOS：iOS 12.0 及以上

## 安裝 SDK {#pbm-install}

::: code-group

```groovy [Android (Gradle)]
dependencies {
    implementation 'org.prebid:prebid-mobile-sdk:3.+'

    // 僅 GAM Prebid 渲染方式需要
    implementation 'org.prebid:prebid-mobile-sdk-gam-event-handlers:3.+'
}
```

```ruby [iOS (CocoaPods)]
target 'MyApp' do
    pod 'PrebidMobile'

    # 僅 GAM Prebid 渲染方式需要
    pod 'PrebidMobileGAMEventHandlers'
end
```

:::

iOS 也支持 Swift Package Manager：添加 `https://github.com/prebid/prebid-mobile-ios` 作為依賴即可。

## 初始化 SDK {#pbm-init}

在 App 啟動時於主線程初始化一次（Android 在 `Application.onCreate()` 中，iOS 在 `application(_:didFinishLaunchingWithOptions:)` 中）。

::: code-group

```kotlin [Android (Kotlin)]
import org.prebid.mobile.PrebidMobile
import org.prebid.mobile.api.data.InitializationStatus

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        PrebidMobile.setPrebidServerAccountId("your-account-id")
        PrebidMobile.setTimeoutMillis(3000)

        PrebidMobile.initializeSdk(
            applicationContext,
            "https://prebid-server.revosurge.com/openrtb2/auction"
        ) { status ->
            if (status == InitializationStatus.SUCCEEDED) {
                Log.d("Prebid", "SDK initialized")
            } else {
                Log.e("Prebid", "SDK init error: $status ${status.description}")
            }
        }
    }
}
```

```swift [iOS (Swift)]
import PrebidMobile

func application(_ application: UIApplication,
                 didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    Prebid.shared.prebidServerAccountId = "your-account-id"
    Prebid.shared.timeoutMillis = 3000

    Prebid.initializeSDK(serverURL: "https://prebid-server.revosurge.com/openrtb2/auction") { status, error in
        if status == .succeeded {
            print("Prebid SDK initialized")
        } else if let error = error {
            print("Prebid SDK init error: \(error.localizedDescription)")
        }
    }
    return true
}
```

:::

| 參數 | 是否必填 | 說明 |
| --- | --- | --- |
| Prebid Server 地址 | 必填 | `https://prebid-server.revosurge.com/openrtb2/auction` |
| Account ID | 必填 | Revosurge 分配的賬戶 ID（與 S2S 中的 `accountId` 相同） |
| 超時時間 | 可選 | 競價請求超時（毫秒），建議 2000-3000 |

## Banner（Prebid 渲染）{#pbm-banner}

不使用廣告服務器時，用 Config ID 和尺寸創建 `BannerView`，添加到布局中並調用 `loadAd()`。

::: code-group

```kotlin [Android (Kotlin)]
import org.prebid.mobile.AdSize
import org.prebid.mobile.api.rendering.BannerView

val bannerView = BannerView(context, "your-config-id", AdSize(320, 50))
bannerView.setAutoRefreshDelay(30)   // 單位秒，可選
adContainer.addView(bannerView)
bannerView.loadAd()

// 在 onDestroy() 中調用 bannerView.destroy() 釋放資源
```

```swift [iOS (Swift)]
import PrebidMobile

let bannerView = BannerView(
    frame: CGRect(origin: .zero, size: CGSize(width: 320, height: 50)),
    configID: "your-config-id",
    adSize: CGSize(width: 320, height: 50)
)
bannerView.delegate = self
bannerView.refreshInterval = 30   // 單位秒，可選
adContainer.addSubview(bannerView)
bannerView.loadAd()
```

:::

## 插屏（Prebid 渲染）{#pbm-interstitial}

先加載插屏廣告，加載完成後再展示。

::: code-group

```kotlin [Android (Kotlin)]
import org.prebid.mobile.api.exceptions.AdException
import org.prebid.mobile.api.rendering.InterstitialAdUnit
import org.prebid.mobile.api.rendering.listeners.InterstitialAdUnitListener

val interstitial = InterstitialAdUnit(context, "your-config-id")
interstitial.setInterstitialAdUnitListener(object : InterstitialAdUnitListener {
    override fun onAdLoaded(adUnit: InterstitialAdUnit?) {
        adUnit?.show()
    }
    override fun onAdFailed(adUnit: InterstitialAdUnit?, e: AdException?) {
        Log.e("Prebid", "Interstitial failed: ${e?.message}")
    }
    override fun onAdDisplayed(adUnit: InterstitialAdUnit?) {}
    override fun onAdClicked(adUnit: InterstitialAdUnit?) {}
    override fun onAdClosed(adUnit: InterstitialAdUnit?) {}
})
interstitial.loadAd()
```

```swift [iOS (Swift)]
import PrebidMobile

class ViewController: UIViewController, InterstitialAdUnitDelegate {
    var interstitial: InterstitialRenderingAdUnit!

    func loadInterstitial() {
        interstitial = InterstitialRenderingAdUnit(configID: "your-config-id")
        interstitial.delegate = self
        interstitial.loadAd()
    }

    func interstitialDidReceiveAd(_ interstitial: InterstitialRenderingAdUnit) {
        interstitial.show(from: self)
    }

    func interstitial(_ interstitial: InterstitialRenderingAdUnit,
                      didFailToReceiveAdWithError error: Error?) {
        print("Interstitial failed: \(error?.localizedDescription ?? "")")
    }
}
```

:::

## GAM 集成（僅競價）{#pbm-gam}

如果 App 已使用 Google Ad Manager，請使用 `BannerAdUnit` + `fetchDemand()`：Prebid 從 Revosurge Prebid Server 獲取競價並將 `hb_*` key-value 寫入 GAM 請求，最終由 GAM 決定投放的廣告。需要在 GAM 中配置對應的 Prebid Line Item（與網頁端 [GAM 集成](./s2s-integration#s2s-gam) 相同）。

::: code-group

```kotlin [Android (Kotlin)]
import org.prebid.mobile.BannerAdUnit

val adUnit = BannerAdUnit("your-config-id", 300, 250)

val gamView = AdManagerAdView(context).apply {
    adUnitId = "/1234567/example/banner"
    setAdSizes(AdSize.MEDIUM_RECTANGLE)
}
adContainer.addView(gamView)

val request = AdManagerAdRequest.Builder().build()
adUnit.fetchDemand(request) { resultCode ->
    // 無論 Prebid 結果如何都加載 GAM
    gamView.loadAd(request)
}
```

```swift [iOS (Swift)]
import PrebidMobile
import GoogleMobileAds

let adUnit = BannerAdUnit(configId: "your-config-id", size: CGSize(width: 300, height: 250))

let gamBanner = AdManagerBannerView(adSize: AdSizeMediumRectangle)
gamBanner.adUnitID = "/1234567/example/banner"
gamBanner.rootViewController = self
adContainer.addSubview(gamBanner)

let request = AdManagerRequest()
adUnit.fetchDemand(adObject: request) { resultCode in
    // 無論 Prebid 結果如何都加載 GAM
    gamBanner.load(request)
}
```

:::

::: info
GAM 插屏、激勵、視頻、原生等格式，GAM Prebid 渲染方式，以及其他廣告服務器（AdMob、AppLovin MAX）的接入，請參考官方 [Prebid Mobile 文檔](https://docs.prebid.org/prebid-mobile/prebid-mobile.html)。所有方式均使用上述 Revosurge Prebid Server 地址、Account ID 和 Config ID。
:::

## 測試與調試 {#pbm-testing}

::: code-group

```kotlin [Android (Kotlin)]
PrebidMobile.setPbsDebug(true)                    // Prebid Server 響應中返回調試資訊
PrebidMobile.setLogLevel(PrebidMobile.LogLevel.DEBUG)
```

```swift [iOS (Swift)]
Prebid.shared.pbsDebug = true                     // Prebid Server 響應中返回調試資訊
Prebid.shared.logLevel = .debug
```

:::

**常見檢查項**

| 檢查項 | 說明 |
| --- | --- |
| SDK 是否初始化成功？ | `initializeSdk` 回調應返回 `SUCCEEDED`，否則檢查服務地址和網絡 |
| Account ID 是否正確？ | 需與 Revosurge 分配的 Account ID 一致 |
| Config ID 是否正確？ | 未知的 Config ID 不會返回競價，請與 Revosurge 對接人確認 |
| 尺寸是否匹配？ | 廣告尺寸需與 Config ID 配置的尺寸一致 |
| 發佈前關閉調試 | 生產包中關閉 `pbsDebug` 並調低日誌級別 |

**Q: 為什麼 App 中收不到競價？**

1. SDK 未初始化，或在初始化完成前就請求了廣告
2. Account ID 或 Config ID 填寫錯誤
3. 超時設置過短（建議至少 2000ms）
4. iOS 未彈出 App Tracking Transparency 授權，無法傳遞 IDFA，可能導致填充率降低

---

如需技术支持，请联系 Revosurge 技术团队。
