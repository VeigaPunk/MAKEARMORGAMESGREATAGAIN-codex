import { test, expect } from '@playwright/test';
const games=['boxhead','impossible','burger-tycoon','chicken-invaders','chicken-invaders-original','swords-and-sandals','hardest','clashbound'];
for(const width of [1280,390])for(const game of games)test(`${game} production assets and ${width===390?'phone':'desktop'} viewport`,async({page})=>{
 await page.setViewportSize({width,height:width===390?844:800});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));page.on('response',res=>{if(res.status()>=400)errors.push(`${res.status()} ${res.url()}`);});
 await page.goto(`/${game}/?debug`);await page.waitForTimeout(600);
 await expect(page.locator('body')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 const ready=await page.evaluate(()=>!!document.querySelector('canvas, #deckselect'));
 expect(ready).toBe(true);expect(errors).toEqual([]);
 await expect(page.getByRole('link',{name:'Return to the arcade'})).toBeVisible();
});
test('Impossible three-course campaign with keyboard presses, unlocks, save, retry',async({page})=>{
 // The full 107-second campaign renders every animation frame. Hosted CI's
 // software Chromium needs more wall time than the locally accelerated run.
 test.setTimeout(360_000);
 await page.clock.install();await page.goto('/impossible/?debug');await page.getByRole('button',{name:'Start run',exact:true}).click();
 await page.evaluate(()=>{
  const marks=[1330,1790,2300,2880,3290,3840,4280,4920,5490,6240,6750,7000,7250,7750,8400,8990,9300];let next=0,release=false;
  function play(){const r=window.__maga.runner;if(release){window.dispatchEvent(new KeyboardEvent('keyup',{code:'Space',bubbles:true}));release=false;}if(r.x>=marks[next]&&r.state==='running'){window.dispatchEvent(new KeyboardEvent('keydown',{code:'Space',bubbles:true}));release=true;next++;}if(r.state==='running')requestAnimationFrame(play);}
  requestAnimationFrame(play);
 });
 await page.clock.runFor(29_000);
 expect(await page.evaluate(()=>({state:window.__maga.state,deaths:window.__maga.runner.deaths}))).toEqual({state:'clear',deaths:0});
 await expect(page.getByRole('heading',{name:'Impossible? Done.'})).toBeVisible();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('maga:impossible:best-progress')))).toBe(1);
 const tapes=[
 [940,1340,1880,2950,3190,3380,4050,5090,5820,6440,7350,7590,7780,8450,9480,9890,11250,11490,11680],
 [1050,1290,1480,2250,3180,3590,4250,5350,5590,5780,6350,6590,6780,7950,8590,9320,10650,10890,11080,11850,12780,13250,13490,13680]
 ];
 for(let course=1;course<=2;course++){
  await page.getByRole('button',{name:'Next course',exact:true}).click();
  await page.evaluate(marks=>{let next=0,release=false;function play(){const r=window.__maga.runner;if(release){window.dispatchEvent(new KeyboardEvent('keyup',{code:'Space',bubbles:true}));release=false;}if(r.x>=marks[next]&&r.state==='running'){window.dispatchEvent(new KeyboardEvent('keydown',{code:'Space',bubbles:true}));release=true;next++;}if(r.state==='running')requestAnimationFrame(play);}requestAnimationFrame(play);},tapes[course-1]);
  await page.clock.runFor(course===1?36_000:42_000);
  expect(await page.evaluate(()=>({state:window.__maga.state,deaths:window.__maga.runner.deaths}))).toEqual({state:'clear',deaths:0});
 }
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('maga:impossible:course-records')))).toEqual([1,1,1]);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('maga:impossible:unlocked')))).toBe(3);
 await page.getByRole('button',{name:'Run again',exact:true}).click();await page.clock.runFor(100);
 expect(await page.evaluate(()=>window.__maga.runner.attempt)).toBe(1);
});
test('Impossible short taps, toolbar focus, pause and practice save separation',async({page})=>{
 await page.clock.install();await page.goto('/impossible/?debug');await page.getByRole('button',{name:'Practice with checkpoints'}).click();
 await page.getByRole('button',{name:'Sound on',exact:true}).click();await page.keyboard.press('Space');await page.clock.runFor(64);
 expect(await page.evaluate(()=>window.__maga.y)).toBeLessThan(396);
 await page.keyboard.press('Escape');const x=await page.evaluate(()=>window.__maga.x);await page.clock.runFor(1000);expect(await page.evaluate(()=>window.__maga.x)).toBe(x);
 await page.keyboard.press('Escape');await page.clock.runFor(64);expect(await page.evaluate(()=>window.__maga.x)).toBeGreaterThan(x);
 await page.evaluate(()=>{const cv=document.querySelector('canvas');const r=cv.getBoundingClientRect();cv.dispatchEvent(new PointerEvent('pointerdown',{pointerId:1,clientX:r.x+100,clientY:r.y+100,bubbles:true}));cv.dispatchEvent(new PointerEvent('pointerup',{pointerId:1,clientX:r.x+100,clientY:r.y+100,bubbles:true}));});
 await page.clock.runFor(4500);expect(await page.evaluate(()=>window.__maga.runner.attempt)).toBeGreaterThan(1);
 expect(await page.evaluate(()=>localStorage.getItem('maga:impossible:best-progress'))).toBeNull();
});
test('Burger real actions, keyboard pause, save reload, mobile tabs and collapse retry',async({page})=>{
 await page.clock.install();await page.goto('/burger-tycoon/?debug');await page.getByRole('button',{name:'Open for business'}).click();
 await page.getByRole('button',{name:/Plant soy/}).click();expect(await page.evaluate(()=>window.__maga.sim.s.crops)).toBeGreaterThan(30);
 await page.keyboard.press('Escape');expect(await page.evaluate(()=>window.__maga.paused)).toBe(true);
 await page.keyboard.press('Escape');expect(await page.evaluate(()=>window.__maga.paused)).toBe(false);
 await page.getByRole('button',{name:/Clear rainforest/}).click();await page.getByRole('button',{name:/Use cheap feed/}).click();await page.getByRole('button',{name:/Cut corners/}).click();
 await page.clock.runFor(2400);await page.reload();await page.getByRole('button',{name:'Continue company'}).click();
 expect(await page.evaluate(()=>window.__maga.sim.s.dirty)).toEqual({deforest:1,cheapFeed:1,cutCorners:1});
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'4 Headquarters',exact:true}).click();await expect(page.locator('.operation.selected h2')).toHaveText('Headquarters');
 await page.clock.runFor(90_000);await expect(page.getByRole('heading',{name:'The public has spoken.'})).toBeVisible();
 await page.getByRole('button',{name:'Build another company'}).click();expect(await page.evaluate(()=>window.__maga.sim.s.over)).toBe(false);
});
test('Shared input drops held controls on blur and accepts short taps',async({page})=>{
 await page.goto('/boxhead/?debug');await page.waitForFunction(()=>window.__maga);
 await page.keyboard.down('KeyW');expect(await page.evaluate(()=>window.__maga.input.isDown('up'))).toBe(true);
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));expect(await page.evaluate(()=>window.__maga.input.isDown('up'))).toBe(false);
});

test('Two players own independent fire keys',async({page})=>{
 await page.goto('/boxhead/?debug');await page.waitForFunction(()=>window.__maga);
 await page.evaluate(()=>window.__maga.input.setMode('versus'));
 await page.keyboard.down('KeyJ');expect(await page.evaluate(()=>window.__maga.input.isDown('fire'))).toBe(false);expect(await page.evaluate(()=>window.__maga.input.isDown2('fireLeft'))).toBe(true);await page.keyboard.up('KeyJ');
});
test('Arcade collection links, covers, and nested navigation',async({page})=>{
 const errors=[];page.on('response',res=>{if(res.status()>=400)errors.push(res.url());});await page.goto('/');await expect(page.locator('.card')).toHaveCount(8);await page.locator('footer').scrollIntoViewIfNeeded();await page.waitForTimeout(250);expect(await page.locator('.cover img').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);expect(errors).toEqual([]);
 await page.getByRole('link').filter({hasText:'The Impossible Game'}).click();await expect(page).toHaveURL(/impossible/);await page.getByRole('link',{name:'Return to the arcade'}).click();await expect(page.locator('.card')).toHaveCount(8);
});
