const policy = {
  allowedActions: new Set(["read_status", "draft_summary", "request_approval"]),
  requiresApproval: new Set(["send_message", "change_setting"])
};

export function governAction(action) {
  if (policy.allowedActions.has(action.type)) {
    return { decision: "allow", reason: "Action is inside the low-risk allowlist." };
  }
  if (policy.requiresApproval.has(action.type)) {
    return { decision: "approval_required", reason: "Human approval is required before execution." };
  }
  return { decision: "deny", reason: "Action is outside the configured policy." };
}

export function runGovernedWorkflow(plan) {
  return plan.map((action, index) => ({
    step: index + 1,
    action,
    ...governAction(action)
  }));
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const sampleAlexaPlan = [
    { type: "read_status", payload: { source: "demo" } },
    { type: "draft_summary", payload: { audience: "user" } },
    { type: "send_message", payload: { channel: "demo" } }
  ];
  console.log(JSON.stringify(runGovernedWorkflow(sampleAlexaPlan), null, 2));
}