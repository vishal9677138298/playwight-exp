import { Page } from "@playwright/test";
import { SearchFilter } from "../../types/filter.type";
import { HomePage } from "../HomePage";
import { PageObj } from "../PageObj";

export class SearchFilters extends PageObj {
  private xpathForFilter =
    "xpath=//following-sibling::ul//li//*[@data-selenium='filter-item-text']";
  private homePage: HomePage;

  async applyFilters(filersToApply: SearchFilter): Promise<HomePage> {
    for (let filter in filersToApply) {
      await this.page
        .locator("h3", { hasText: new RegExp(filter, "i") })
        .locator("..")
        .locator(this.xpathForFilter)
        .filter({ hasText: new RegExp(filersToApply[filter], "i") })
        .first()
        .click();
    }
    return new HomePage(this.page);
  }

  async getAppliedFilters(): Promise<string[]> {
    return (await this.page
      .locator("h3", { hasText: "Your filters" })
      .first()
      .locator("..")
      .locator(this.xpathForFilter)
      .allInnerTexts())
      .map(filters => filters.toLowerCase())
  }
}
