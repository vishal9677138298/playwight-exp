import { Locator, Page } from "@playwright/test";
import { SearchFilter } from "../../types/filter.type";
import { HomePage } from "../HomePage";
import { PageObj } from "../PageObj";

export class SearchFilters extends PageObj {

  private homePage: HomePage;

  async applyFilters(filersToApply: SearchFilter): Promise<HomePage> {
    for (let filter in filersToApply) {
      await this.getFiltersUnder(filter)
        .filter({ hasText: new RegExp(filersToApply[filter], "i") })
        .first()
        .click();
    }
    return new HomePage(this.page);
  }

  async getAppliedFilters(): Promise<string[]> {
    return (await this.getFiltersUnder("Your filters")
      .allInnerTexts())
      .map(filters => filters.toLowerCase())
  }

  private getFiltersUnder(filterHeader: string): Locator {
    const xpathForFilter =
    "xpath=//following-sibling::ul//li//*[@data-selenium='filter-item-text']";
    return this.page
        .locator("h3", { hasText: new RegExp(filterHeader, "i") })
        .first()
        .locator("xpath=/ancestor::legend")
        .locator(xpathForFilter);
  }
}
