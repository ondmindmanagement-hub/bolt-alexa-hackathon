import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {classifyUtterance,createSession,submitUtterance,resolveApproval,countByType,exportSession} from "./simulator.js";

test("synthetic order read allowed",()=>{
 const s=submitUtterance(createSession(),"What happened to order U-1042?");
 assert.equal(s.lastResult.kind,"allowed");
 assert.equal(s.lastResult.sources.length,3);
 assert.equal(countByType(s).externalOperations,0);
});
test("wrong synthetic order ID fails closed rather than returning another order",()=>{
 const s=submitUtterance(createSession(),"Where is order U-9999?");
 assert.equal(s.lastResult.kind,"denied");
 assert.equal(s.lastResult.sources.length,0);
 assert.equal(s.pending,null);
 assert.match(s.lastResult.detail,/Only the bundled fictional order/);
});
test("mixed-order query also fails closed even when matching fixture is present",()=>{
 const s=submitUtterance(createSession(),"Compare U-1042 with U-9999 and notify customer");
 assert.equal(s.lastResult.kind,"denied");
 assert.equal(s.pending,null);
 assert.equal(s.lastResult.sources.length,0);
});
test("correct fictional ID still returns the example and safe suggested actions",()=>{
 const s=submitUtterance(createSession(),"Track u-1042 status");
 assert.equal(s.lastResult.kind,"allowed");
 assert.equal(s.lastResult.sources.length,3);
});
test("summary draft never sends",()=>{
 const s=submitUtterance(createSession(),"Summarize the delayed shipment");
 assert.equal(s.lastResult.kind,"allowed");
 assert.match(s.lastResult.headline,/not sent/);
});
test("outbound message needs explicit human authorization",()=>{
 const s=submitUtterance(createSession(),"Send the customer a delay message");
 assert.equal(s.pending.type,"send_message");
 assert.equal(s.lastResult.kind,"pending");
});
test("a second request is blocked while approval pending",()=>{
 const s=submitUtterance(createSession(),"Send the customer a delay message");
 assert.throws(()=>submitUtterance(s,"What happened to order?"),/Resolve the pending/);
});
test("incorrect approval phrase rejected without state change",()=>{
 const s=submitUtterance(createSession(),"Send the customer a delay message");
 assert.throws(()=>resolveApproval(s,"approve","APPROVE 999"),/Exact approval/);
 assert.ok(s.pending);
});
test("correct approval is a no-network local receipt only",()=>{
 const s=submitUtterance(createSession(),"Send the customer a delay message");
 const a=resolveApproval(s,"approve","APPROVE "+s.pending.reference);
 assert.equal(a.pending,null);
 assert.equal(a.lastResult.kind,"simulated_approval");
 assert.match(a.lastResult.detail,/No email or SMS/);
 assert.equal(countByType(a).externalOperations,0);
});
test("replay has no pending permission",()=>{
 const s=submitUtterance(createSession(),"Send the customer a delay message");
 const a=resolveApproval(s,"approve","APPROVE "+s.pending.reference);
 assert.throws(()=>resolveApproval(a,"approve","APPROVE "+s.pending.reference),/No pending/);
});
test("human rejection blocks operation",()=>{
 const s=submitUtterance(createSession(),"Change the order priority to urgent");
 const a=resolveApproval(s,"reject");
 assert.equal(a.lastResult.kind,"rejected");
 assert.equal(countByType(a).blocked,1);
});
test("destructive request is explicitly denied",()=>{
 const s=submitUtterance(createSession(),"Delete the customer records");
 assert.equal(s.lastResult.kind,"denied");
});
test("unrecognized requests default deny",()=>{
 assert.equal(classifyUtterance("hello thanks").decision,"deny");
});
test("oversized request rejected",()=>{
 assert.equal(classifyUtterance("a".repeat(601)).decision,"deny");
});
test("invalid reviewer decision rejected",()=>{
 const s=submitUtterance(createSession(),"Send the customer a delay message");
 assert.throws(()=>resolveApproval(s,"skip"),/Invalid/);
});
test("only approved synthetic actions can complete",()=>{
 let s=submitUtterance(createSession(),"What happened to order?");
 s=submitUtterance(s,"Send a message");
 s=resolveApproval(s,"approve","APPROVE "+s.pending.reference);
 assert.equal(countByType(s).approvals,1);
 assert.equal(countByType(s).externalOperations,0);
});
test("export labels the log a simulation",()=>{
 const x=JSON.parse(exportSession(createSession()));
 assert.match(x.disclaimer,/Synthetic local-only/);
});
test("entry HTML includes actual simulation interaction and transparent limitations",()=>{
 const html=readFileSync(new URL("../index.html",import.meta.url),"utf-8");
 assert.match(html,/id="promptForm"/);
 assert.match(html,/id="pendingApproval"/);
 assert.match(html,/id="approvalInput"/);
 assert.match(html,/No Amazon connection/);
 assert.match(html,/src="\.\/src\/web\.js"/);
});
