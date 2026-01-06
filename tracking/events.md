---
title: User Events and Activities
sidebar_label: Events
---

# User Events and Activities

User Events are business actions that RevoSurge tracks and aggregates.  
They are used for analytics and (when supported) optimization targets in AdWave.

## Common event examples
- Register
- FirstTimeDeposit (FTD)
- Deposit / Purchase
- Login
- Custom events

## Event status
Each event can have a status indicating whether it is reliable and recent enough:
- **Live**: event is receiving data and can be used in campaign flows where Live is required
- **Inactive / Not ready**: insufficient or no recent event data

## Best practice
For performance campaigns, always validate at least:
- Register
- Deposit / FTD (if your business model uses deposit as primary conversion)
