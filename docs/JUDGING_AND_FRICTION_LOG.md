# BOLT for Alexa+ — reproduction checklist and implementation friction

11 October 2026 · Amazon Developer Hackathon · simulated-experience path

This is an honest engineering diary, not a claim of running the gated Alexa+ SDK, production MCP services, AWS, an Alexa device, or a customer deployment. The official rules explicitly allow a web-based simulated Alexa+ experience as an alternative. No source or video here proves actual Alexa+ runtime integration.

## Judge quickstart

1. Use Node.js 20+ and run `npm test` (18 simulator tests + 3 additional governance tests after October 11 changes).
2. Run `npm start` and open http://127.0.0.1:8080/ or use the public static preview: https://ondmindmanagement-hub.github.io/bolt-alexa-hackathon/.
3. Try: `What happened to order U-1042?` — should show three fictional source reports.
4. Try: `Send the customer a delay message` — should require explicit simulated human approval, with no network message.
5. Type an incorrect confirmation, then `APPROVE REQ-002` for the *current* request number shown on screen. The resulting action is explicitly simulated, not sent.
6. Try: `Delete the customer records` — should be denied.
7. Try: `Where is order U-9999?` — should deny rather than leak the unrelated U-1042 fixture.
8. Export the demonstration log and confirm the synthetic-data disclaimer.

The sequence number shown by the app is authoritative; do not assume the example request ID is always REQ-002 after other actions.

## Friction log: actual development/submission observations

| Date | Task | Expected | Actual and severity | Workaround, current status, and suggested improvement |
|---|---|---|---|---|
| Oct 10 | Determine a viable Alexa+ implementation route. | Hackathon participants could directly test track preview SDKs or find a clearly documented alternative. | The official FAQ states gated Alexa+ add-on developer tools are limited to selected partners (not open to participants). **High for direct integration**, not a runtime bug. | Used the explicitly permitted simulation path with publicly testable source and synthetic data. Suggest foregrounding the simulated-experience option beside each SDK link and a minimal simulation starter. |
| Oct 10 | Edit legal entrant status and tool feedback in an already-submitted Devpost entry. | Save should persist; re-opening should show updated values. | Values appeared to revert after Save & continue despite SUBMITTED/5-of-5 status and no validation message. **High** for entry correctness. | Reported to support in the original thread. On Oct 11 a fresh edit-route visit and independent reload showed Individual, N/A, the correct separate open-source commit, and updated feedback persisted; support was informed that it could no longer be reproduced. A visible 'saved at' timestamp or explicit field diff would reduce ambiguity. |
| Oct 10–11 | Meet official embedded-video requirement. | A working prototype video could be submitted using any stable, publicly accessible direct URL. | Official rules explicitly require a public YouTube or Vimeo link. The working 65-second captioned demo was produced and is public on GitHub Pages, but is **not** a qualifying embedded platform by itself. **High, still open**. | Video: https://ondmindmanagement-hub.github.io/bolt-alexa-hackathon/demo/Unfire_BOLT_Alexa_Simulation_2026.mp4 . The Devpost Video field must be replaced with the same demonstration uploaded to YouTube or Vimeo before the deadline. No alternate-platform exception is claimed. |

## Concrete product feedback (on tools actually used)

- **Worked well:** Vanilla JavaScript, Node.js and GitHub Pages let judges reproduce a deterministic, zero-credential simulation. A readable public URL and clear default-deny policies reduce the chance of confusing a concept demo with a production integration.
- **Needed improvement:** Direct Amazon preview integration is currently unavailable to general hackathon participants; a clearer simulated-experience quickstart and more explicit save acknowledgments would lower entry friction.
- **Onboarding:** The team used the public Alexa+ alternative after consulting the official rules and FAQ; it did not onboard to a gated Amazon SDK.
- **Would use these tools again?** Yes for early prototyping and independent interface review. No claim that a real Alexa+ production deployment would require zero authentication or external integrations.
- **Critical limitations:** typed input is classified by deterministic rules, not a model; no speech recognition, independent user authentication, WMS integration, durable audit store, production model or outbound customer action.

This friction log is voluntarily provided for transparency. Eligibility for any judging bonus is for the organizers alone to determine.

Official rules: https://amazonappdev2026.devpost.com/rules
Official FAQ: https://amazonappdev2026.devpost.com/details/faqs
