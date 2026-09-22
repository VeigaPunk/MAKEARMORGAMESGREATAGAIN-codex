import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
const systemBrowser=process.env.CHROMIUM_PATH??(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
export default defineConfig({
 testDir:'./verification/browser',timeout:90_000,expect:{timeout:15_000},fullyParallel:false,workers:1,
 reporter:[['list'],['html',{outputFolder:'verification/browser-report',open:'never'}]],
 use:{baseURL:'http://127.0.0.1:4173',viewport:{width:1280,height:800},screenshot:'only-on-failure',trace:'retain-on-failure'},
 projects:[{name:'chromium',use:{browserName:'chromium',launchOptions:{executablePath:systemBrowser,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}}},{name:'firefox',use:{browserName:'firefox'}}],
 webServer:{command:'npm start',url:'http://127.0.0.1:4173',reuseExistingServer:true,timeout:30_000}
});
