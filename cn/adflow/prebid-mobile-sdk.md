---
title: Prebid Mobile SDK（App 内接入）
description: 在原生 iOS 或 Android App 中使用 Prebid Mobile SDK。SDK 可直接渲染中标广告，也可以将竞价结果交给 Google Ad Manager。
---

# Prebid Mobile SDK（App 内接入） {#prebid-mobile-sdk}

如需在原生 iOS / Android App 中变现，请使用开源的 [Prebid Mobile SDK](https://docs.prebid.org/prebid-mobile/prebid-mobile.html)。SDK 从 App 向 Revosurge Prebid Server（与 [S2S 配置接入](./s2s-integration#s2s-integration) 使用同一个服务）发起竞价请求，然后由 SDK 直接渲染中标广告，或将竞价结果交给你的广告服务器（如 GAM）。

::: info 接入方式
- **Prebid 渲染（无广告服务器）** — SDK 完成竞价并渲染中标广告。未使用广告服务器时最简单的方式。
- **GAM（仅竞价）** — SDK 获取竞价，并将价格 key-value 写入 GAM 请求，由 GAM 决定最终投放的广告。
:::

::: tip
以下示例基于 Prebid Mobile SDK **3.x**。3.0 起已移除 `setPrebidServerHost()` / `Host.createCustomHost()`，改为在 `initializeSdk()` 中传入 Prebid Server 地址。
:::

## 前置条件 {#pbm-prerequisites}

- 已开通 AdFlow 账号并获取 **Account ID**
- 每个广告位对应的 **Config ID**（Revosurge Prebid Server 上的 stored impression ID），由 Revosurge 对接人提供
- Android：`minSdkVersion` 21 及以上；iOS：iOS 12.0 及以上

## 安装 SDK {#pbm-install}

::: code-group

```groovy [Android (Gradle)]
dependencies {
    implementation 'org.prebid:prebid-mobile-sdk:3.+'

    // 仅 GAM Prebid 渲染方式需要
    implementation 'org.prebid:prebid-mobile-sdk-gam-event-handlers:3.+'
}
```

```ruby [iOS (CocoaPods)]
target 'MyApp' do
    pod 'PrebidMobile'

    # 仅 GAM Prebid 渲染方式需要
    pod 'PrebidMobileGAMEventHandlers'
end
```

:::

iOS 也支持 Swift Package Manager：添加 `https://github.com/prebid/prebid-mobile-ios` 作为依赖即可。

## 初始化 SDK {#pbm-init}

在 App 启动时于主线程初始化一次（Android 在 `Application.onCreate()` 中，iOS 在 `application(_:didFinishLaunchingWithOptions:)` 中）。

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

| 参数 | 是否必填 | 说明 |
| --- | --- | --- |
| Prebid Server 地址 | 必填 | `https://prebid-server.revosurge.com/openrtb2/auction` |
| Account ID | 必填 | Revosurge 分配的账户 ID（与 S2S 中的 `accountId` 相同） |
| 超时时间 | 可选 | 竞价请求超时（毫秒），建议 2000-3000 |

## Banner（Prebid 渲染）{#pbm-banner}

不使用广告服务器时，用 Config ID 和尺寸创建 `BannerView`，添加到布局中并调用 `loadAd()`。

::: code-group

```kotlin [Android (Kotlin)]
import org.prebid.mobile.AdSize
import org.prebid.mobile.api.rendering.BannerView

val bannerView = BannerView(context, "your-config-id", AdSize(320, 50))
bannerView.setAutoRefreshDelay(30)   // 单位秒，可选
adContainer.addView(bannerView)
bannerView.loadAd()

// 在 onDestroy() 中调用 bannerView.destroy() 释放资源
```

```swift [iOS (Swift)]
import PrebidMobile

let bannerView = BannerView(
    frame: CGRect(origin: .zero, size: CGSize(width: 320, height: 50)),
    configID: "your-config-id",
    adSize: CGSize(width: 320, height: 50)
)
bannerView.delegate = self
bannerView.refreshInterval = 30   // 单位秒，可选
adContainer.addSubview(bannerView)
bannerView.loadAd()
```

:::

## 插屏（Prebid 渲染）{#pbm-interstitial}

先加载插屏广告，加载完成后再展示。

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

## GAM 集成（仅竞价）{#pbm-gam}

如果 App 已使用 Google Ad Manager，请使用 `BannerAdUnit` + `fetchDemand()`：Prebid 从 Revosurge Prebid Server 获取竞价并将 `hb_*` key-value 写入 GAM 请求，最终由 GAM 决定投放的广告。需要在 GAM 中配置对应的 Prebid Line Item（与网页端 [GAM 集成](./s2s-integration#s2s-gam) 相同）。

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
    // 无论 Prebid 结果如何都加载 GAM
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
    // 无论 Prebid 结果如何都加载 GAM
    gamBanner.load(request)
}
```

:::

::: info
GAM 插屏、激励、视频、原生等格式，GAM Prebid 渲染方式，以及其他广告服务器（AdMob、AppLovin MAX）的接入，请参考官方 [Prebid Mobile 文档](https://docs.prebid.org/prebid-mobile/prebid-mobile.html)。所有方式均使用上述 Revosurge Prebid Server 地址、Account ID 和 Config ID。
:::

## 测试与调试 {#pbm-testing}

::: code-group

```kotlin [Android (Kotlin)]
PrebidMobile.setPbsDebug(true)                    // Prebid Server 响应中返回调试信息
PrebidMobile.setLogLevel(PrebidMobile.LogLevel.DEBUG)
```

```swift [iOS (Swift)]
Prebid.shared.pbsDebug = true                     // Prebid Server 响应中返回调试信息
Prebid.shared.logLevel = .debug
```

:::

**常见检查项**

| 检查项 | 说明 |
| --- | --- |
| SDK 是否初始化成功？ | `initializeSdk` 回调应返回 `SUCCEEDED`，否则检查服务地址和网络 |
| Account ID 是否正确？ | 需与 Revosurge 分配的 Account ID 一致 |
| Config ID 是否正确？ | 未知的 Config ID 不会返回竞价，请与 Revosurge 对接人确认 |
| 尺寸是否匹配？ | 广告尺寸需与 Config ID 配置的尺寸一致 |
| 发布前关闭调试 | 生产包中关闭 `pbsDebug` 并调低日志级别 |

**Q: 为什么 App 中收不到竞价？**

1. SDK 未初始化，或在初始化完成前就请求了广告
2. Account ID 或 Config ID 填写错误
3. 超时设置过短（建议至少 2000ms）
4. iOS 未弹出 App Tracking Transparency 授权，无法传递 IDFA，可能导致填充率降低

---

如需技术支持，请联系 Revosurge 技术团队。
