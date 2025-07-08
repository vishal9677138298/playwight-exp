import {test as setup} from "@playwright/test";
import { BlazeLogin } from "../pages/BlazeLogin";
import path from "path";
import fs from 'fs';//how does it work without braces
import { config } from "../app.config";

const authFile = path.join(__dirname,"../.auth/user.json");

setup('authenticate', async({page})=> {
    const login = new BlazeLogin(page);
    await login.login(config.creds.blaze);
    fs.mkdirSync(path.dirname(authFile), { recursive: true });
    await page.context().storageState({path: authFile});
});
