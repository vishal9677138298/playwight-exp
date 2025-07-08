import test from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../.auth/naukri.json");

test("bms simple test", async({page}) => {
    await page.goto('https://www.naukri.com/');
    await page.getByRole('link', { name: 'Login', exact: true }).click();
    await page.getByRole('textbox', { name: 'Enter your active Email ID /' }).fill('vishal9677138298@gmail.com');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Vine@2025');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await page.waitForTimeout(10000);
    await page.context().storageState({path: authFile});
});
