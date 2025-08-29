import { test as dhcAuthSetup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../.auth/dhcUser.json");
dhcAuthSetup.use({
  headless: false
});

dhcAuthSetup("dhc auth setup", async ({ page }) => {
  await page.goto("https://dhcbeauty.in/");
  await page.getByRole("link", { name: "My Account" }).click();
  const iframe = page.frameLocator('iframe#cmessage_form_iframe');
  await expect(iframe.getByPlaceholder("Enter your Email ID")).toBeVisible({timeout: 30000});
  await iframe
    .locator("[class='close_icon']")
    .click();
  await page.getByRole("spinbutton").click();
  await page.getByRole("spinbutton").fill("8667292746");
  await page.getByRole("button", { name: "Request OTP" }).click();
  await page.waitForTimeout(30000);
  await page.context().storageState({path: authFile});
});
