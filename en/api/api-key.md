---
title: API Key
description: API key authentication. Security, key rotation, secrets management.
---

# API Key

**For:** Developers, Admins

API keys authenticate requests to RevoSurge APIs.

## In this article
- What an API key is
- How to keep it safe
- Key rotation basics

## What an API key is
An API key identifies your account and authorizes API actions (e.g., sending S2S events).

## Keep it safe
- Do not commit keys into source control
- Store keys in environment variables or a secrets manager
- Restrict access to only required engineers/services

## Rotation (recommended)
- Rotate keys periodically (e.g., quarterly)
- Rotate immediately if exposure is suspected
