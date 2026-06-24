---
title: Standard events (v3)
sidebar_label: Standard events
description: The S2S Events v3 Standard catalog — cross-industry events available to every product.
---

# Standard events

**Audience:** Engineers, technical integrators

Standard events (the `general.core` preset) are **auto-enabled for every product** — no subscription needed. They cover user lifecycle, verification & consent, and app lifecycle. For gaming-specific events see [iGaming events](/en/tracking/s2s/v3/events-igaming).

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
| `context.verification_method` | String | Suggested | One of `sms_otp` · `call` · `whatsapp`. |

### `marketing_consent_updated`

Send the full state of all four channels each time (including the default consent at signup).

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.allow_email` | Boolean | **Required** | Consent to email. |
| `context.allow_sms` | Boolean | **Required** | Consent to SMS. |
| `context.allow_push` | Boolean | **Required** | Consent to push. |
| `context.allow_whatsapp` | Boolean | **Required** | Consent to WhatsApp. |
| `context.update_source` | String | Suggested | One of `signup` · `settings_page` · `unsubscribe_link` · `support` · `admin`. |

### `account_blocked`

Exclude blocked accounts from LTV / churn models.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.block_reason` | String | **Required** | One of `fraud` · `bonus_abuse` · `multi_account` · `self_exclusion` · `compliance` · `payment_chargeback` · `other`. |
| `context.block_duration` | String | Suggested | One of `permanent` · `temporary` · `under_review`. |
| `context.expected_unblock_at` | Number | Suggested | UTC ms; for temporary blocks. |

### `account_unblocked`

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.unblock_reason` | String | **Required** | One of `review_passed` · `appeal_approved` · `temporary_expired` · `manual_admin` · `other`. |
| `context.previous_block_reason` | String | Suggested | Reason of the block being lifted. |

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

### `app_open`

Fired on app launch / foreground.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.platform` | String | **Required** | One of `ios` · `android` · `web`. |
| `context.app_version` | String | Suggested | App version. |
| `context.session_id` | String | Suggested | Session identifier. |

### `app_uninstall`

A strong churn signal (MMP detects via push-token expiry).

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.platform` | String | **Required** | One of `ios` · `android` · `web`. |
| `context.app_version` | String | Suggested | Last installed version. |

### `push_permission_updated`

Push reachability / opt-in signal.

| Field | Type | Requirement | Description |
|-------|------|-------------|-------------|
| `context.platform` | String | **Required** | One of `ios` · `android` · `web`. |
| `context.permission_status` | String | **Required** | One of `granted` · `denied` · `provisional` · `revoked`. |
