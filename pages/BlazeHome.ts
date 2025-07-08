import { expect } from "@playwright/test";
import { BlazeLogin } from "./BlazeLogin";
import { PageObj } from "./PageObj";

export class BlazeHome extends PageObj {
    private loginPage = new BlazeLogin(this.page);
    async addProductsToCart(product: string){
        await this.loginPage.isLoggedIn();
        await this.page.getByRole("link", {name: new RegExp("Home", 'i')}).click();
        await this.page.getByRole("link", {name: new RegExp(product, 'i')}).click();
        await this.page.getByRole("link", {name: /Add to cart/i}).click();
        this.page.on('dialog', async dialog => {
            const message = dialog.message();
            console.log(message);
            await dialog.accept();
        });
    }

    async listCart(){
        await this.loginPage.isLoggedIn();
        await this.page.getByRole("link", {name: "Cart", exact: true}).click();
        await expect(this.page.locator("//tr[@class='success']//td[2]").first()).toBeVisible();
        return await this.page.locator("//tr[@class='success']//td[2]").allInnerTexts();
    }
}
