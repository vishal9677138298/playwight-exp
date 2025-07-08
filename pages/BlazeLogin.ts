import { PageObj } from "./PageObj";
import {config} from "../app.config"
import { expect } from "@playwright/test";

export class BlazeLogin extends PageObj{
    async login(creds: {
        username: string,
        password: string
    }){
        const {username, password} = creds;
        await this.page.goto(config.url.blaze);
        await this.page.getByRole("link", {name: "Log in"}).click();
        await this.page.locator('input[id="loginusername"]').fill(username);
        await this.page.locator('input[id="loginpassword"]').fill(password);
        await this.page.getByRole("button", {name: "Log in"}).click();
        await expect(this.page.getByRole("link", {name: `Welcome ${username.toLowerCase()}` })).toBeVisible();
    }

    async logout(){
        console.log("Logging out");
        await this.page.getByRole("link", {name: "Log out"}).click();
    }

    async isLoggedIn(){
        const userName = config.creds.blaze.username.toLowerCase();
        await this.page.locator(`//*[text()='Welcome ${userName}']`).waitFor();
    }
}
