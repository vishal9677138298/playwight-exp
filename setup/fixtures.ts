import {test as base, Page} from "@playwright/test"
import { HomePage } from "../pages/HomePage";
import { BlazeLogin } from "../pages/BlazeLogin";
import { log } from "console";
import { config } from "../app.config";

type Pages = {
    homePage: HomePage,
    blazeLogin: BlazeLogin,
    dhcPage: Page
}

const maximize = async (page: Page) => {
    await page.setViewportSize({
        width: 1920,
        height: 1080
    });
}
export const test = base.extend<Pages>({
    homePage: async({page}, use) => {
        await maximize(page);
        await page.goto(config.url.agoda);
        await use(new HomePage(page));
    },
    blazeLogin: async({page}, use) => {
        await maximize(page);
        const loginPage = new BlazeLogin(page);
        await loginPage.login({
            username: "vishal9677",
            password: "Vine@2025"
        });
        await use(loginPage);
        await loginPage.logout();
    },
    dhcPage: async({browser}, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await maximize(page);
        await use(page);
    }
});
