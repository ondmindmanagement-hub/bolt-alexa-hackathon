import { governAction } from "./index.js";

const cases = [
  ["read_status", "allow"],
  ["send_message", "approval_required"],
  ["unknown_action", "deny"]
];

for (const [type, expected] of cases) {
  const actual = governAction({ type }).decision;
  if (actual !== expected) throw new Error(type + ": expected " + expected + ", got " + actual);
}

console.log("3/3 governance tests passed");