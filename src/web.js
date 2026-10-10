import {createSession,submitUtterance,resolveApproval,countByType,exportSession} from "./simulator.js";
const $ = id => document.getElementById(id);
let state=createSession();
function text(node,value){node.textContent=String(value);}
function make(tag,className,content){
  const e=document.createElement(tag);if(className)e.className=className;
  if(content!==undefined)text(e,content);return e;
}
function render(){
 const r=state.lastResult;
 const status=r?.kind||"idle";
 text($("decisionChip"),status.replaceAll("_"," ").toUpperCase());
 $("decisionChip").className="chip "+status;
 text($("resultHeading"),r?.headline||"Nothing executed. Your decision comes first.");
 text($("resultCopy"),r?.detail||"Submit a request to see the policy decision and source evidence.");
 const pending=state.pending;
 $("pendingApproval").classList.toggle("hidden",!pending);
 text($("approvalPhrase"),pending?"APPROVE "+pending.reference:"");
 $("prompt").disabled=Boolean(pending);
 $("promptForm").querySelector("button[type=submit]").disabled=Boolean(pending);
 document.querySelectorAll("[data-prompt]").forEach(b=>b.disabled=Boolean(pending));
 const m=countByType(state);
 text($("metricInteractions"),m.interactions);
 text($("metricApprovals"),m.approvals);
 text($("metricBlocked"),m.blocked);
 const history=$("history");history.replaceChildren();
 if(!state.history.length)history.append(make("p","muted","No actions reviewed yet."));
 for(const e of state.history){
   const el=make("div","history-item");
   el.append(make("strong","",e.type.replaceAll("_"," ").toUpperCase()+" · "+e.title));
   el.append(make("small","",e.description));
   history.append(el);
 }
}
function showError(message){text($("feedback"),message);}
function submit(prompt){
 try{
   state=submitUtterance(state,prompt);
   $("prompt").value="";
   $("approvalInput").value="";
   showError("");
   render();
 }catch(e){showError(e.message);}
}
$("promptForm").addEventListener("submit",e=>{
 e.preventDefault();
 submit($("prompt").value);
});
document.querySelectorAll("[data-prompt]").forEach(b=>{
 b.addEventListener("click",()=>submit(b.dataset.prompt));
});
$("approveButton").addEventListener("click",()=>{
 try{
   state=resolveApproval(state,"approve",$("approvalInput").value);
   $("approvalInput").value="";showError("");render();
 }catch(e){showError(e.message);}
});
$("rejectButton").addEventListener("click",()=>{
 try{
   state=resolveApproval(state,"reject");
   $("approvalInput").value="";showError("");render();
 }catch(e){showError(e.message);}
});
$("resetButton").addEventListener("click",()=>{
 state=createSession();$("prompt").value="";$("approvalInput").value="";showError("");render();
});
$("exportButton").addEventListener("click",()=>{
 const blob=new Blob([exportSession(state)],{type:"application/json"});
 const url=URL.createObjectURL(blob);
 const a=make("a");a.href=url;a.download="unfire-alexa-simulation-audit.json";
 document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
});
render();
