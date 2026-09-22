import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium } from '@playwright/test';
const base='http://127.0.0.1:4173';
let server;
async function ready(){try{return(await fetch(base+'/release.json')).ok;}catch{return false;}}
if(!await ready()){
 server=spawn(process.execPath,['tooling/serve.mjs'],{stdio:'inherit'});
 for(let i=0;i<100&&!await ready();i++)await new Promise(resolve=>setTimeout(resolve,100));
 if(!await ready()){server.kill();throw Error('Release server did not start. Run npm run build first.');}
}
const env={...process.env,CHROMIUM_PATH:process.env.CHROMIUM_PATH??(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':chromium.executablePath()),BOXHEAD_URL:base+'/boxhead/?debug',ARCADE_URL:base,SAS_URL:base+'/swords-and-sandals/',TCG_URL:base+'/clashbound/'};
const tasks=[
 ['node_modules/@playwright/test/cli.js','test'],
 ['--test','MAGA-everything/02-code/armor-games/apps/boxhead/tests/release.test.mjs'],
 ['--test','MAGA-everything/02-code/armor-games/packages/shmup-core/tests/browser.test.mjs'],
 ['hardest/browser-check.mjs'],
 ['MAGA-everything/02-code/armor-games/apps/swords-and-sandals/tests/browser.mjs'],
 ['tcg/prototype/tests/browser.mjs'],
];
try{
 for(const args of process.argv.includes('--deep')?tasks.slice(1):tasks){console.log(`\nBrowser gate: ${args.join(' ')}`);await new Promise((resolve,reject)=>{const p=spawn(process.execPath,args,{stdio:'inherit',env});p.on('error',reject);p.on('exit',code=>code===0?resolve():reject(Error(`Browser check exited ${code}`)));});}
}finally{server?.kill();}
