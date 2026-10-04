# BOLT for Alexa+ - Amazon Developer Hackathon

BOLT for Alexa+ is a hackathon adapter exploring governed AI workflows for conversational experiences.

## Goal

Connect an Alexa+ interaction to a bounded workflow layer so actions can be allowed automatically when low-risk, escalated for explicit human approval, denied when outside policy, and logged with a structured execution decision.

This repository contains only the open-source hackathon adapter and demo harness. It does not publish proprietary BOLT core source code.

## Run

Use npm start to run the demo and npm test to run governance tests.

The current scaffold uses simulated Alexa-style actions so the governance model can be tested independently while the device/service integration is developed.

## Architecture

Alexa+ interaction -> adapter -> policy decision -> allow / approval / deny -> execution trace

## Planned hackathon integration

1. Receive a structured request from the Alexa+ experience.
2. Translate the request into explicit workflow actions.
3. Apply BOLT-style policy and approval rules.
4. Return a safe response or approval request.
5. Record the execution decision for traceability.

## Team

Omar Baró - Founder, Unfire

https://unfire.technology