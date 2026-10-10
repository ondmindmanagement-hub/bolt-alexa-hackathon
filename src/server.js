/* Zero-dependency local static server for public simulator; no external APIs. */
import {createServer} from "node:http";
import {readFile} from "node:fs/promises";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const files=new Map([
  ["/",["index.html","text/html; charset=utf-8"]],
  ["/index.html",["index.html","text/html; charset=utf-8"]],
  ["/styles.css",["styles.css","text/css; charset=utf-8"]],
  ["/src/web.js",["src/web.js","text/javascript; charset=utf-8"]],
  ["/src/simulator.js",["src/simulator.js","text/javascript; charset=utf-8"]],
]);
export function serve(port=8080){
 const app=createServer(async(req,res)=>{
   const path=(req.url||"").split("?")[0];
   const item=files.get(path);
   res.setHeader("Cache-Control","no-store");
   res.setHeader("X-Content-Type-Options","nosniff");
   res.setHeader("Content-Security-Policy","default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'none'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
   if((req.method!=="GET"&&req.method!=="HEAD")||!item){res.writeHead(404);res.end("Not found");return;}
   try{
     const content=await readFile(resolve(root,item[0]));
     res.writeHead(200,{"Content-Type":item[1]});
     res.end(req.method==="HEAD"?undefined:content);
   }catch{res.writeHead(500);res.end("Internal error");}
 });
 return new Promise(resolvePromise=>app.listen(port,"127.0.0.1",()=>resolvePromise(app)));
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const port=Number(process.env.PORT||8080);
 if(!Number.isInteger(port)||port<1024||port>65535){console.error("PORT must be 1024..65535");process.exitCode=2;}
 else serve(port).then(()=>console.log("BOLT Alexa+ simulator at http://127.0.0.1:"+port));
}
