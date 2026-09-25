#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const [,, title, problem, resolution, scope='general'] = process.argv;
if (!title || !problem || !resolution) {
  console.error('Usage: node capture-learning.js <title> <problem> <resolution> [scope]');
  process.exit(2);
}
const root = path.join(process.cwd(), '.orizon', 'learning');
fs.mkdirSync(root, {recursive:true});
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const file = path.join(root, slug + '.json');
const entry = {title, scope, problem, resolution, captured_at:new Date().toISOString()};
fs.writeFileSync(file, JSON.stringify(entry,null,2)+'\n');
console.log(file);
