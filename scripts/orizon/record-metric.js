#!/usr/bin/env node
const fs=require('fs'), path=require('path');
const args=process.argv.slice(2);
const get=(k,d='')=>{const i=args.indexOf('--'+k);return i>=0?args[i+1]:d};
const project=get('project'), mission=get('mission','unknown');
if(!project){console.error('Missing --project');process.exit(2)}
const root=path.join(__dirname,'..','..','orizon','metrics');
fs.mkdirSync(root,{recursive:true});
const file=path.join(root,'events.json');
const events=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):[];
events.push({
 project, task_id:get('task',Date.now().toString()), mission_type:mission,
 started_at:get('started',''), completed_at:new Date().toISOString(),
 wall_clock_minutes:Number(get('minutes','0')), agents_used:get('agents','').split(',').filter(Boolean),
 retries:Number(get('retries','0')), tests_run:Number(get('tests-run','0')),
 tests_passed:Number(get('tests-passed','0')), runtime_validated:get('runtime','false')==='true',
 security_gate:get('security','NOT_RUN'), go_live_state:get('go-live','NOT_ASSESSED'),
 post_release_regression:get('regression','false')==='true', notes:get('notes','')
});
fs.writeFileSync(file,JSON.stringify(events,null,2)+'\n');
console.log('metric recorded:',project,mission);
