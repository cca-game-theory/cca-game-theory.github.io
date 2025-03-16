import {Browser, Page} from "puppeteer";
import puppeteer from "puppeteer";
const CONCURRENT = 20;
const times = 5;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    /** @type {Page[]} */
    const tabs = await Promise.all((new Array(CONCURRENT)).fill(0).map(() => browser.newPage()));
    let allResults = [];
    for(let i = 0; i < times; i ++){
        const results = await Promise.all(tabs.map(async (tab, index) => {
            await tab.goto(`http://localhost:6969/Slots/index.html`);
            await tab.waitForSelector("canvas");
            
            // await tab.screenshot({path: `./run/media/raymond/Data/Coding/cca-game-theory.github.io/screenshots/${i}_${index}.png`});
            // await tab.waitFor(1000);
            const randomWaitMs1 = Math.floor(Math.random() * 1000);
            const randomWaitMs2 = Math.floor(Math.random() * 1000);
            const randomWaitMs3 = Math.floor(Math.random() * 1000);
            await sleep(1000);
            await tab.keyboard.press("Enter");
            await sleep(randomWaitMs1);
            await tab.keyboard.press("Space");
            await sleep(randomWaitMs2);
            await tab.keyboard.press("Space");
            await sleep(randomWaitMs3);
            await tab.keyboard.press("Space");
            const tries = 1000;
            for(let i = 0; i < tries; i ++){
                if(await tab.evaluate(() => checkFinalized())){
                    break;
                }
                await sleep(5);
            }
            // get result
            const won = await tab.evaluate(() => {
                return checkWin();
            });
            const canvas = await tab.$("canvas");
            await canvas.screenshot({
                path: `./runs/${i}_${index}.png`
            });
            return won;
        }));

        console.log(i, " iteration ", results);
        allResults = allResults.concat(results);
    }
    await browser.close();
    console.log("win proportion", allResults.filter(x => x).length, "/",allResults.length,  " = ", allResults.filter(x => x).length / allResults.length);
})();