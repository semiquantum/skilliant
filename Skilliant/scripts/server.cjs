const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();
const port = Number(process.env.PORT || 5173);
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.ico':'image/x-icon'};
function safePath(urlPath){
  let decoded; try { decoded=decodeURIComponent(urlPath.split('?')[0]); } catch { return null; }
  if(decoded.includes('..')) return null;
  const file = path.join(root, decoded === '/' ? 'index.html' : decoded.replace(/^\//,''));
  return file.startsWith(root) ? file : null;
}
const server=http.createServer((req,res)=>{
  const file=safePath(req.url||'/');
  if(!file) return res.writeHead(400).end('Bad Request');
  fs.stat(file,(err,stat)=>{
    if(!err && stat.isFile()) return fs.readFile(file,(e,data)=>{if(e)return res.writeHead(500).end('Server Error');res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);});
    // SPA fallback for hash-less routes.
    fs.readFile(path.join(root,'index.html'),(e,data)=>{if(e)return res.writeHead(404).end('Not Found');res.writeHead(200,{'Content-Type':mime['.html'],'Cache-Control':'no-cache'});res.end(data);});
  });
});
server.listen(port,'127.0.0.1',()=>console.log(`Skilliant Admin running at http://localhost:${port}`));
