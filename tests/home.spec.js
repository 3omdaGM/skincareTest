import {test,expect} from '@playwright/test';
test('homepage loads original media and all three sections without browser errors',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.locator('h1')).toHaveText('Unlockyour skin’spotential');
 await expect(page.locator('main > section')).toHaveCount(3);
 expect(await page.locator('img[data-asset]').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);
 expect(errors).toEqual([]);
});
test('preview dialogs are honest, keyboard accessible and restore focus',async({page})=>{
 await page.goto('/');
 for(const [panel,text] of [['analyze','no photo is captured'],['contact','No messages'],['app','haven’t been announced']]){
  const trigger=page.locator(`[data-panel="${panel}"]:visible`).first();await trigger.click();
  await expect(page.locator('dialog')).toBeVisible();await expect(page.locator('.panel-body')).toContainText(text);
  await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.querySelector('dialog').contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');await expect(page.locator('dialog')).not.toBeVisible();await expect(trigger).toBeFocused();
 }
});
test('mobile menu links navigate and close, with no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 await page.locator('.menu-button').click();await expect(page.locator('#mobile-nav')).toBeVisible();
 await page.locator('#mobile-nav a[href="#ai-guidance"]').click();await expect(page.locator('#mobile-nav')).toBeHidden();await expect(page).toHaveURL(/#ai-guidance/);
 for(const width of [320,375,390,768,1024,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});
test('scroll reveals split copy and progressively emphasizes the statement',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/');
 expect(await page.locator('.word.emphasized').count()).toBe(0);
 await page.locator('#ai-guidance').scrollIntoViewIfNeeded();await expect(page.locator('.ai-copy')).toHaveClass(/visible/);await expect(page.locator('.beauty-copy')).toHaveClass(/visible/);
 await page.locator('#philosophy').scrollIntoViewIfNeeded();await expect.poll(()=>page.locator('.word.emphasized').count()).toBe(await page.locator('.word').count());
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await expect.poll(()=>page.locator('.word.emphasized').count()).toBe(0);
});
test('reduced motion keeps all content readable and disables animations',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 expect(await page.locator('.word.emphasized').count()).toBe(await page.locator('.word').count());
 expect(await page.locator('.scan-box').first().evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
 expect(await page.locator('.badge').first().evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
});
