import { spawnSync } from 'node:child_process';
import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const workspace=path.join(root,'MAGA-everything/02-code/armor-games');
const apps=['boxhead','impossible','burger-tycoon','chicken-invaders','chicken-invaders-original','swords-and-sandals'];
const build=spawnSync('npm',['run','build','--workspaces','--if-present','--','--base=./'],{cwd:workspace,stdio:'inherit'});
if(build.status!==0)process.exit(build.status??1);
const out=path.join(root,'dist');
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
await cp(path.join(root,'arcade'),out,{recursive:true});
for(const app of apps)await cp(path.join(workspace,'apps',app,'dist'),path.join(out,app),{recursive:true});
await mkdir(path.join(out,'hardest'),{recursive:true});
for(const name of ['index.html','engine.js','game.js','save.js','manifest.js','pars.js','levels'])await cp(path.join(root,'hardest',name),path.join(out,'hardest',name),{recursive:true});
await mkdir(path.join(out,'clashbound'),{recursive:true});
for(const name of ['index.html','cards.js','engine.js','ai.js','ui.js','style.css','art'])await cp(path.join(root,'tcg/prototype',name),path.join(out,'clashbound',name),{recursive:true,filter:source=>!source.endsWith('.cjs')});
const games=[...apps,'hardest','clashbound'];
for(const game of games){
 const file=path.join(out,game,'index.html');let html=await readFile(file,'utf8');
 html=html.replace('</head>','<link rel="icon" href="../favicon.svg"><script defer src="../return.js"></script></head>');
 await writeFile(file,html);
}
await writeFile(path.join(out,'release.json'),JSON.stringify({version:'1.0.0',distribution:'private',games},null,2)+'\n');
console.log(`\nBuilt ${games.length} games into dist/. Start with npm start.`);
