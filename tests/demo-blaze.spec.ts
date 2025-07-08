import {test} from "@playwright/test";
import { BlazeLogin } from "../pages/BlazeLogin";
import { BlazeHome } from "../pages/BlazeHome";
import { config } from "../app.config";

test.describe("blaze tests", () => {

    test("checking login state", async({page}) => {
        const blazeHome = new BlazeHome(page);
        await page.goto(config.url.blaze);
        await blazeHome.addProductsToCart("Nokia lumia 1520");
    });

    test("list cart", async({page}) => {
        const blazeHome = new BlazeHome(page);
        await page.goto(config.url.blaze);
        const items = await blazeHome.listCart();
        console.log(items);
    });
});
