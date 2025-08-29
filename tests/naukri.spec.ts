import { expect, test } from "@playwright/test";
import { waitTillVisibilityOfAll } from "../pages/Utils";

test.describe("naukri tests", () => {
  test.use({
    storageState: "./.auth/naukri.json",
    viewport: {
      width: 1920,
      height: 1080,
    },
  });

  test("key skills test", async ({ page }) => {
    await page.goto("https://www.naukri.com/");
    await page.getByRole("link", { name: "View profile" }).click();
    const allKeySkills = page.locator("[id='lazyKeySkills'] .prefill span");
    await waitTillVisibilityOfAll(allKeySkills);
    await expect.poll(() => allKeySkills.count(), {timeout: 5000}).toBeGreaterThan(1);
    const skills = await allKeySkills.allInnerTexts();
    console.log(skills);
  });

  test("nvites test", async ({ page }) => {
    await page.goto("https://www.naukri.com/mnjuser/inbox");
    const allNviteJobs = page.locator(".inbox-job-card span.title");
    await expect
      .poll(async () => await allNviteJobs.count(), { timeout: 10000 })
      .toBeGreaterThan(3);
    await waitTillVisibilityOfAll(allNviteJobs);
    const testt = await allNviteJobs.allInnerTexts();
    console.log(testt);
  });

  test("Search jobs", async({page}) => {
    const searchFor = "software testing";
    await page.goto("https://www.naukri.com/");
    await page.getByText("Search jobs here").click();
    await page.getByRole("textbox", {name: /Enter keyword/i}).fill(searchFor);
    await page.getByRole('listitem').filter({hasText: new RegExp(searchFor, 'i')}).first().click({timeout: 5000});
    await page.getByRole("textbox", {name: /Select experience/i}).click();
    await page.getByRole('listitem', { name: '7 years', exact: true }).click();
    await page.getByRole("textbox", {name: "Enter location"}).fill("chennai");
    await page.getByRole("listitem").filter({hasText: "Chennai"}).click();
    await page.getByRole('button', {name: /search/i}).click();
    const allJobsLocator = page.locator('h2 a');
    await expect.poll(async () => await allJobsLocator.count(), {timeout: 5000}).toEqual(20);
    const allJobs = await page.locator('h2 a').allInnerTexts();
    console.log(allJobs);
  });
});
