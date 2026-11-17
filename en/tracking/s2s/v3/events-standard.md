---
title: Standard events (v3)
sidebar_label: Standard events
description: The S2S Events v3 Standard catalog — cross-industry events available to every product.
---

# Standard events

**Audience:** Engineers, technical integrators

Standard events (the `general.core` preset) are **auto-enabled for every product** — no subscription needed. They cover user lifecycle, verification & consent, and app lifecycle. For gaming-specific events see [iGaming events](/en/tracking/s2s/v3/events-igaming).

For crypto exchanges and wallets, see [Crypto events](/en/tracking/s2s/v3/events-crypto).

Every event also carries the [base properties](/en/tracking/s2s/v3/mandatory-properties) (`event`, `timestamp`, `identity.client_user_id`, `context.ip_address`). The tables below list **only the fields specific to each event**.

<script setup>
import { s2sV3Events } from '../../../../.vitepress/theme/data/s2s-v3-events'
</script>

## Interactive explorer

Pick an event to see its fields and a ready-to-send envelope. Toggle "Required only", then copy as JSON or cURL.

<EventPayloadExplorer :events="s2sV3Events" scope="standard" lang="en" />

## User Lifecycle

### `register`

A new user account is created.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.user_agent` | String | Suggested | Browser / device user-agent string. |
| `context.privacy.email_hash` | String | Suggested | SHA-256 of email (lowercased & trimmed). Never plaintext. |
| `context.privacy.phone_hash` | String | Suggested | SHA-256 of E.164-normalized phone. Never plaintext. |
| `context.privacy.marketing_consent` | Boolean | Suggested | Whether the user consents to marketing. |
| `context.attribution.install_source` | String | Suggested | Install / acquisition source. |
| `context.phone_country_code` | String | Suggested | E.164 country calling code (e.g. `+55`). |
| `context.consent_timestamp` | Number | Suggested | Last consent change, UTC ms. |
| `context.attribution.utm_source` | String | Suggested | UTM source. |
| `context.attribution.utm_medium` | String | Suggested | UTM medium. |
| `context.attribution.utm_campaign` | String | Suggested | UTM campaign. |
| `context.attribution.utm_content` | String | Suggested | UTM content. |
| `context.attribution.utm_term` | String | Suggested | UTM term. |
| `context.device_brand` | String | Suggested | Brand of the device used to complete registration, e.g. Apple or Samsung. |
| `context.device_model` | String | Suggested | Reported model identifier of the registration device; preserve the original value, e.g. `iPhone15,3` or `SM-S918B/DS`. |
| `context.platform` | String | Suggested | Registration environment: one of `web` · `android` · `ios`. |
| `context.os` | String | Suggested | Operating system of the registration device, e.g. Android, iOS, Windows, Linux or Mac OS X. These examples are not a closed enum. |

### `referral_register`

A registration attributed to a referral — carries the referrer's user id.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.referral_client_user_id` | String | Suggested | The referrer's `client_user_id` (the user who referred this registration). |
| `context.device_brand` | String | Suggested | Brand of the **new user's** registration device, e.g. Apple or Samsung. |
| `context.device_model` | String | Suggested | Reported model identifier of the **new user's** registration device; preserve the original value, e.g. `iPhone15,3` or `SM-S918B/DS`. |
| `context.platform` | String | Suggested | Environment in which the **new user** completed registration: one of `web` · `android` · `ios`. |
| `context.os` | String | Suggested | Operating system of the **new user's** registration device, e.g. Android, iOS, Windows, Linux or Mac OS X. These examples are not a closed enum. |

### Registration device collection {#registration-device}

These four device fields apply to both `register` and `referral_register` through S2S v3 and [Partner Postback v2](/en/tracking/postback/partner-postback#v2-registration-device). All four are **String / Suggested**: send the fields you can obtain. Omitting some or all of them does not reject an otherwise valid registration event. Supplied values must still satisfy their type and, for `platform`, the exact lowercase allowed values above.

- Capture the device actually used to complete **this registration**. For `referral_register`, `identity.client_user_id` identifies the newly registered user; `context.referral_client_user_id` identifies the referrer. The device fields describe the **new user**, not the referrer.
- Do not substitute a device from a different login. Capture the registration-time values even if delivery is delayed.
- Preserve the reported model identifier. Do not infer a specific model from screen resolution alone.
- Omit unavailable fields; do not send empty strings or `-`. The sender must enforce device ownership and this omission rule. The backend does not establish the actual source device or consistently remove placeholder strings.

To validate, dry-run each event with all four fields, with a subset, and with none. Check that original model identifiers survive in the echoed envelope. Wrong JSON types or an invalid `platform` return S2S `400 VALIDATION_ERROR`; Partner Postback v2 uses `422 VALIDATION_ERROR` for catalog type/enum violations. A successful synthetic request verifies acceptance, not that the real registration flow collects the correct device.

### `login`

A user authenticates into your platform.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.user_agent` | String | Suggested | Browser / device user-agent string. |

## Verification & Consent

### `email_verified`

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.email_hash` | String | Suggested | SHA-256 of email. Never plaintext. |
| `context.verification_method` | String | Suggested | One of `link` · `otp` · `magic_link`. |

### `phone_verified`

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.phone_hash` | String | Suggested | SHA-256 of phone. Never plaintext. |
| `context.phone_country_code` | String | Suggested | E.164 country calling code (e.g. `+91`). |
| `context.verification_method` | String | Suggested | Prefer `sms_otp` · `voice_call` · `whatsapp_otp`. (`call` · `whatsapp` still accepted but deprecated.) |

### `marketing_consent_updated`

Send the full state of all four channels each time (including the default consent at signup).

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.allow_email` | Boolean | **Required** | Consent to email. |
| `context.allow_sms` | Boolean | **Required** | Consent to SMS. |
| `context.allow_push` | Boolean | **Required** | Consent to push. |
| `context.allow_whatsapp` | Boolean | **Required** | Consent to WhatsApp. |
| `context.update_source` | String | Suggested | One of `signup` · `settings_page` · `unsubscribe_link` · `support` · `admin`. |

## App Lifecycle

> [!NOTE]
> App lifecycle events apply to native App / APK advertisers and usually originate from the mobile SDK / MMP. For these events `client_user_id` (and `ip_address` on `app_install`) is **downgraded to Suggested**, since the user may be anonymous before registering — use `identity.anonymous_id` instead.

### `app_install`

Fired once when the app is first installed & opened.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.platform` | String | **Required** | One of `ios` · `android` · `web`. |
| `context.app_version` | String | Suggested | App version on install. |
| `context.attribution.install_source` | String | Suggested | Media source / channel (from MMP). |
| `context.device_id` | String | Suggested | Device identifier. |
| `context.store` | String | Suggested | Install store: `app_store` · `play_store` · `apk_direct`. |
| `context.campaign_id` | String | Suggested | Campaign ID (from MMP). |
| `context.is_reattribution` | Boolean | Suggested | `true` if reinstall / reattribution. |

### `app_open`

Fired on app launch / foreground.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.platform` | String | **Required** | One of `ios` · `android` · `web`. |
| `context.app_version` | String | Suggested | App version. |
| `context.session_id` | String | Suggested | Session identifier. |
| `context.is_first_open` | Boolean | Suggested | `true` for first open after install. |

### `app_uninstall`

A strong churn signal (MMP detects via push-token expiry).

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.platform` | String | **Required** | One of `ios` · `android` · `web`. |
| `context.app_version` | String | Suggested | Last installed version. |
| `context.days_since_install` | Number | Suggested | Days from install to uninstall. |

### `push_permission_updated`

Push reachability / opt-in signal.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.platform` | String | **Required** | One of `ios` · `android` · `web`. |
| `context.permission_status` | String | **Required** | One of `granted` · `denied` · `provisional` · `revoked`. |
| `context.push_enabled` | Boolean | Suggested | `true` if push permission granted. |
| `context.update_source` | String | Suggested | What triggered the change: `system_prompt` · `settings` · `onboarding`. |
