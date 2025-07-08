import { expect, Page } from "@playwright/test";
import { PageObj } from "../PageObj";
import { getCssValue } from "../Utils";

export class DateFilter extends PageObj {
  from: Date;
  to: Date;

  constructor(page: Page, dateRange: {
    from: Date,
    to: Date
  }){
    super(page);
    this.from = dateRange.from;
    this.to = dateRange.to;
  }
  private async refreshDates() {
    let displayedFrom = await this.page
      .locator(".DayPicker-Caption")
      .nth(0)
      .innerText();
    let displayedTo = await this.page
      .locator(".DayPicker-Caption")
      .nth(1)
      .innerText();
    return {
      displayedFrom: new Date(displayedFrom),
      displayedTo: new Date(displayedTo),
    };
  }

  private async isPresentOnScreen() {
    let { displayedFrom, displayedTo } = await this.refreshDates();
    const isPresent = (toCheck: Date) =>
      toCheck.getMonth() == displayedFrom.getMonth() ||
      toCheck.getMonth() == displayedTo.getMonth();
    return isPresent(this.from) && isPresent(this.to);
  }

  async getSelectedDateColor() {
    await this.page.locator("[data-selenium='checkInText']").click();
    const fromDate = this.page.locator(
      `[data-selenium-date="${this.from.toISOString().slice(0, 10)}"]`
    );
    const toDate = this.page.locator(
      `[data-selenium-date="${this.to.toISOString().slice(0, 10)}"]`
    );

    const fromDateColor = await getCssValue({
      element: fromDate.locator("..").locator(".."),
      pseudoElement: "::before",
      properties: ["background-color"],
    });

    const toDateColor = await getCssValue({
      element: toDate.locator("..").locator(".."),
      pseudoElement: "::before",
      properties: ["background-color"],
    });
    return {
      fromDateColor: fromDateColor["background-color"],
      toDateColor: toDateColor["background-color"]
    }
  }

  async applyFilter() {
    await this.page.locator("[data-selenium='checkInText']").click();
    const selectDates = async () => {
      const clickDate = async(dateToBeSelected: Date) => {
        const date_to_be_selected = this.page.locator(
          `[data-selenium-date="${dateToBeSelected.toISOString().slice(0, 10)}"]`
        );
        await date_to_be_selected.click();
      };
      await clickDate(this.from);
      await clickDate(this.to);
    };
    if (await this.isPresentOnScreen()) {
      await selectDates();
    } else {
      await this.navigateToMonth();
      await selectDates();
    }
  }

  private async navigateToMonth() {
    let { displayedFrom, displayedTo } = await this.refreshDates();
    const navigate = async (navigationButtonLabel: string) => {
      let canSelect = false;
      do {
        const element = this.page.locator('[data-selenium="calendar-next-month-button"]');
        await expect(element).toBeVisible();
        await element.click();
        canSelect = await this.isPresentOnScreen();
      } while (!canSelect);
    };
    if (this.from.getMonth() > displayedTo.getMonth()) {
      await navigate("Next Month");
    } else if (this.from.getMonth() < displayedFrom.getMonth()) {
      await navigate("Previous Month");
    }
  }
}
