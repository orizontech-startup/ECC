#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const registryPath = path.join(__dirname,'..','..','orizon','registry','PROJECTS.json');
const metricsPath = path.join(__dirname,'..','..','orizon','metrics','events.json');
const outDir = path.join(__dirname,'..','..','orizon','control-plane');
fs.mkdirSync(outDir,{recursive:true});
const registry = JSON.parse(fs.readFileSync(registryPath,'utf8'));
const metrics = fs.existsSync(metricsPath) ? JSON.parse(fs.readFileSync(metricsPath,'utf8')) : [];
const rows = registry.projects.map(p=>{
  const m = metrics.filter(x=>x.project===p.repo).slice(-1)[0] || {};
  return `<tr><td>${p.repo}</td><td>${p.role||''}</td><td>${m.go_live_state||'UNKNOWN'}</td><td>${m.notes||''}</td></tr>`;
}).join('');
const html = `<!doctype html><html><head><meta charset="utf-8"><title>Orizon Engineering Control Plane</title><style>body{font-family:system-ui;margin:32px;background:#0b0b0b;color:#eee}table{border-collapse:collapse;width:100%}td,th{border:1px solid #333;padding:10px;text-align:left}th{background:#181818}.muted{color:#999}</style></head><body><h1>Orizon Engineering Control Plane</h1><p class="muted">Generated ${new Date().toISOString()}</p><table><thead><tr><th>Project</th><th>Role</th><th>Go-live</th><th>Latest note</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
fs.writeFileSync(path.join(outDir,'index.html'),html);
console.log(path.join(outDir,'index.html'));
