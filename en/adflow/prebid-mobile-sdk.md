---
title: Prebid Mobile SDK (In-App)
description: Use Prebid Mobile SDK in a native iOS or Android app. The SDK can render the winning ad directly or pass bids to Google Ad Manager.
---

# Prebid Mobile SDK (In-App) {#prebid-mobile-sdk}

To monetize a native iOS or Android app, use the open-source [Prebid Mobile SDK](https://docs.prebid.org/prebid-mobile/prebid-mobile.html). The SDK sends bid requests from the app to the Revosurge Prebid Server (the same server used by [S2S Configuration](./s2s-integration#s2s-integration)), then either renders the winning ad itself or passes the bid to your ad server (such as GAM).

::: info Integration methods
- **Prebid-rendered (no ad server)** — The SDK runs the auction and renders the winning ad. Simplest option when you don't use an ad server.
- **GAM (bidding only)** — The SDK fetches bids and attaches price key-values to the GAM request. GAM decides which ad serves.
:::

::: tip
The examples below target Prebid Mobile SDK **3.x**. In 3.0, `setPrebidServerHost()` / `Host.createCustomHost()` were removed. Pass the Prebid Server URL to `initializeSdk()` instead.
:::

## Prerequisites {#pbm-prerequisites}

- An AdFlow account with an **Account ID**
- A **Config ID** for each ad slot (the stored impression ID on the Revosurge Prebid Server), provided by your Revosurge contact
- Android: `minSdkVersion` 21 or higher; iOS: iOS 12.0 or later

## Install the SDK {#pbm-install}

::: code-group

```groovy [Android (Gradle)]
dependencies {
    implementation 'org.prebid:prebid-mobile-sdk:3.+'

    // Only needed for the GAM Prebid-rendered method
    implementation 'org.prebid:prebid-mobile-sdk-gam-event-handlers:3.+'
}
```

```ruby [iOS (CocoaPods)]
target 'MyApp' do
    pod 'PrebidMobile'

    # Only needed for the GAM Prebid-rendered method
    pod 'PrebidMobileGAMEventHandlers'
end
```

:::

iOS also supports Swift Package Manager: add `https://github.com/prebid/prebid-mobile-ios` as a package dependency.

## Initialize the SDK {#pbm-init}

Initialize once at app startup (in `Application.onCreate()` on Android, or `application(_:didFinishLaunchingWithOptions:)` on iOS), on the main thread.

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

| Parameter | Required | Description |
| --- | --- | --- |
| Prebid Server URL | Required | `https://prebid-server.revosurge.com/openrtb2/auction` |
| Account ID | Required | Account ID assigned by Revosurge (same as `accountId` in S2S) |
| Timeout | Optional | Bid request timeout in milliseconds, recommended 2000-3000 |

## Banner (Prebid-rendered) {#pbm-banner}

Without an ad server, create a `BannerView` with the Config ID and size, add it to your layout, and call `loadAd()`.

::: code-group

```kotlin [Android (Kotlin)]
import org.prebid.mobile.AdSize
import org.prebid.mobile.api.rendering.BannerView

val bannerView = BannerView(context, "your-config-id", AdSize(320, 50))
bannerView.setAutoRefreshDelay(30)   // Seconds, optional
adContainer.addView(bannerView)
bannerView.loadAd()

// Call bannerView.destroy() in onDestroy() to release resources
```

```swift [iOS (Swift)]
import PrebidMobile

let bannerView = BannerView(
    frame: CGRect(origin: .zero, size: CGSize(width: 320, height: 50)),
    configID: "your-config-id",
    adSize: CGSize(width: 320, height: 50)
)
bannerView.delegate = self
bannerView.refreshInterval = 30   // Seconds, optional
adContainer.addSubview(bannerView)
bannerView.loadAd()
```

:::

## Interstitial (Prebid-rendered) {#pbm-interstitial}

Load the interstitial first, then show it after it has loaded.

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

## GAM Integration (Bidding Only) {#pbm-gam}

If your app already uses Google Ad Manager, use `BannerAdUnit` + `fetchDemand()`: Prebid fetches bids from the Revosurge Prebid Server and writes `hb_*` key-values into the GAM request, then GAM decides the final ad. You need matching Prebid line items in GAM (same as the web [GAM integration](./s2s-integration#s2s-gam)).

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
    // Load GAM regardless of the Prebid result
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
    // Load GAM regardless of the Prebid result
    gamBanner.load(request)
}
```

:::

::: info
For GAM interstitial, rewarded, video, and native formats, the GAM Prebid-rendered method, and other ad servers (AdMob, AppLovin MAX), see the official [Prebid Mobile docs](https://docs.prebid.org/prebid-mobile/prebid-mobile.html). Keep using the Revosurge Prebid Server URL, Account ID, and Config IDs in all of them.
:::

## Testing & Debugging {#pbm-testing}

::: code-group

```kotlin [Android (Kotlin)]
PrebidMobile.setPbsDebug(true)                    // Return debug info in the Prebid Server response
PrebidMobile.setLogLevel(PrebidMobile.LogLevel.DEBUG)
```

```swift [iOS (Swift)]
Prebid.shared.pbsDebug = true                     // Return debug info in the Prebid Server response
Prebid.shared.logLevel = .debug
```

:::

**Common Checklist**

| Check Item | Description |
| --- | --- |
| Did SDK initialization succeed? | The `initializeSdk` callback should return `SUCCEEDED`; otherwise check the server URL and network |
| Is the Account ID correct? | It must match the Account ID assigned by Revosurge |
| Is the Config ID correct? | An unknown Config ID returns no bids; confirm it with your Revosurge contact |
| Does the size match? | The ad size must match the size configured for the Config ID |
| Remove debug settings before release | Turn off `pbsDebug` and set a lower log level for production builds |

**Q: Why am I not receiving any bids in the app?**

1. The SDK was not initialized, or the ad was requested before initialization finished
2. The Account ID or Config ID is wrong
3. The timeout is too short (at least 2000ms recommended)
4. On iOS, the App Tracking Transparency prompt was not shown, so no IDFA is sent, which can lower fill rate

---

For technical support, please contact the Revosurge technical team.
