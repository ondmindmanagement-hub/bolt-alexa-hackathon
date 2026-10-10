/* BOLT for Alexa+: local deterministic simulation. No Amazon SDK or real actions. */
export const FIXTURE=Object.freeze({
  orderId:"U-1042",
  sources:[
    {name:"OMS",status:"Shipped",time:"10:08",ref:"OMS-DEMO-018"},
    {name:"Carrier",status:"Delivery delayed",time:"10:19",ref:"CARRIER-DEMO-142"},
    {name:"Warehouse",status:"Departed",time:"09:55",ref:"WMS-DEMO-307"}
  ]
});
const dangerous=/\b(delete|erase|purge|wipe|transfer money|pay |shutdown|disable security|password)\b/i;
const sending=/\b(send|email|notify|message|tell the customer)\b/i;
const editing=/\b(change|update|modify|set priority|mark as|escalate)\b/i;
const summarizing=/\b(summary|summarize|brief|draft|report)\b/i;
const reading=/\b(status|what happened|where is|track|check|show|explain|why|order)\b/i;

export function classifyUtterance(raw){
  if(typeof raw!=="string"||!raw.trim()||raw.length>600) return {type:"invalid",decision:"deny",reason:"Empty or oversized request."};
  if(dangerous.test(raw))return {type:"dangerous_operation",decision:"deny",reason:"Destructive, financial, or security-sensitive operation blocked."};
  if(sending.test(raw))return {type:"send_message",decision:"approval_required",reason:"A real outbound message would need an explicit human decision."};
  if(editing.test(raw))return {type:"change_setting",decision:"approval_required",reason:"Changing external records would need an explicit human decision."};
  if(summarizing.test(raw))return {type:"draft_summary",decision:"allow",reason:"Draft created locally; no message sent."};
  if(reading.test(raw))return {type:"read_status",decision:"allow",reason:"Reading bundled synthetic records only."};
  return {type:"unknown",decision:"deny",reason:"Unrecognized request. Default-deny policy."};
}
export function createSession(){return {sequence:0,pending:null,history:[],lastResult:null};}
function event(seq,type,title,description){
  return {id:"LOG-"+String(seq).padStart(3,"0"),sequence:seq,type,title,description};
}
function resultFor(type){
  if(type==="read_status")return {headline:"Conflicting source updates",detail:"OMS: shipped. Carrier: delivery delayed. No automatic customer commitment.",sources:FIXTURE.sources};
  if(type==="draft_summary")return {headline:"Draft ready — not sent",detail:"Order U-1042 departed the warehouse. The carrier reports a delay. Review ETA before informing the customer.",sources:FIXTURE.sources};
  if(type==="send_message")return {headline:"Message approval simulated",detail:"No email or SMS was sent. This was a local human-review rehearsal.",sources:FIXTURE.sources};
  if(type==="change_setting")return {headline:"Record update approval simulated",detail:"No order record was changed. This was a local human-review rehearsal.",sources:FIXTURE.sources};
  return {headline:"Blocked",detail:"No operation executed.",sources:[]};
}
export function submitUtterance(state,utterance){
  if(state.pending)throw Error("Resolve the pending request before starting another.");
  const policy=classifyUtterance(utterance),seq=state.sequence+1;
  const action={reference:"REQ-"+String(seq).padStart(3,"0"),utterance:String(utterance).trim(),...policy};
  const out={...state,sequence:seq};
  if(policy.decision==="approval_required"){
    out.pending=action;
    out.lastResult={kind:"pending",headline:"Human approval required",detail:policy.reason,sources:FIXTURE.sources,action};
    out.history=[event(seq,"approval_required",action.reference,policy.reason),...state.history].slice(0,60);
  }else if(policy.decision==="deny"){
    out.lastResult={kind:"denied",headline:"Request denied",detail:policy.reason,sources:[],action};
    out.history=[event(seq,"denied",action.reference,policy.reason),...state.history].slice(0,60);
  }else{
    out.lastResult={kind:"allowed",...resultFor(action.type),action};
    out.history=[event(seq,"read_only",action.reference,policy.reason),...state.history].slice(0,60);
  }
  return out;
}
export function resolveApproval(state,decision,confirmation=""){
  const action=state.pending;
  if(!action)throw Error("No pending approval.");
  if(!["approve","reject"].includes(decision))throw Error("Invalid review decision.");
  if(decision==="approve"&&confirmation!=="APPROVE "+action.reference)throw Error("Exact approval phrase required: APPROVE "+action.reference);
  const seq=state.sequence+1,out={...state,sequence:seq,pending:null};
  if(decision==="reject"){
    out.lastResult={kind:"rejected",headline:"Request rejected",detail:"No external operation executed.",sources:FIXTURE.sources,action};
    out.history=[event(seq,"rejected",action.reference,"Human rejected the proposed action."),...state.history].slice(0,60);
  }else{
    out.lastResult={kind:"simulated_approval",...resultFor(action.type),action};
    out.history=[event(seq,"simulated_approval",action.reference,"Human reviewed; simulated approval only. Zero external operations."),...state.history].slice(0,60);
  }
  return out;
}
export function countByType(state){
  return {interactions:state.history.length,approvals:state.history.filter(x=>x.type==="simulated_approval").length,blocked:state.history.filter(x=>x.type==="denied"||x.type==="rejected").length,externalOperations:0};
}
export function exportSession(state){
  return JSON.stringify({disclaimer:"Synthetic local-only demo; not Alexa+ integration or production audit",metrics:countByType(state),events:state.history},null,2);
}
