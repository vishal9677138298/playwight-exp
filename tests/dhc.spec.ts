import { expect } from "@playwright/test";
import { waitTillVisibilityOfAll } from "../pages/Utils";
import { test } from "../setup/fixtures";

test.describe("dhc tests", () => {
  test.use({
      storageState: "./.auth/dhcUser.json"
  });
  test("email test", async ({ dhcPage }) => {
    await dhcPage.goto("https://dhcbeauty.in/account");
    await dhcPage.getByRole("link", { name: "Orders", exact: true }).click();
    await expect(dhcPage.locator('[class="chP-email"]')).toBeVisible();
    const email = await dhcPage.locator('[class="chP-email"]').innerText();
    console.log(email);
  });
  test("my profile test", async ({ dhcPage }) => {
    await dhcPage.goto("https://dhcbeauty.in/account");
    await dhcPage
      .getByRole("link", { name: new RegExp("Profile", "i") })
      .first()
      .click();
    await expect(dhcPage.getByText("My Information")).toBeVisible();
    const allInputFields = dhcPage.locator('[id="chMfFields"] input');
    await waitTillVisibilityOfAll(allInputFields);
    const allVals = await Promise.all(
      (
        await allInputFields.all()
      ).map(async (input) => await input.inputValue())
    );
    console.log(allVals);
  });

  test("add items to cart", async({dhcPage}) => {
    await dhcPage.goto("https://dhcbeauty.in/account");
    await dhcPage.getByRole('link', {name: "Shop", exact: true}).click();
    await dhcPage.getByText(/Add to cart/i).first().click();
  });

  test.afterAll("logout", async({dhcPage}) => {
    console.log("Full logout")
    await dhcPage.goto("https://dhcbeauty.in/account");
    await dhcPage.getByRole('button', {name: 'Logout'}).click();
    await expect(dhcPage.getByText('TOP CATEGORIES')).toBeVisible();
    await dhcPage.context().browser()?.close();
  });
});
