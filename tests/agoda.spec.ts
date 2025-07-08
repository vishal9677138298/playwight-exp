import { expect, Page } from "@playwright/test";
import { SearchFilter } from "../types/filter.type";
import { test } from "../setup/fixtures";

test.describe("agoda practice tests", () => {
  test.use({
    viewport: {
      width: 1920,
      height: 1080,
    },
  });

  test("search error", async ({ page, homePage }) => {
    await homePage.search();
    await expect(page.getByText(homePage.copies.searchError)).toBeVisible();
  });

  test("filtering functionality", {
    tag: '@filtering'
  }, async ({ homePage }) => {
    const filtersToBeApplied: SearchFilter = {
      "property type": "resort",
      "room offers": "breakfast included",
      "payment options": "free cancellation",
      "property facilities": "swimming pool",
      "room amenities": "air conditioning",
    };
    const dropdownOptions = await homePage.getDropDownOptions();
    await homePage.selectDropDownOption(dropdownOptions[1]);
    await homePage.search();
    await homePage.searchFilter().applyFilters(filtersToBeApplied);
    const appliedFilters = await homePage.searchFilter().getAppliedFilters();
    expect(new Set(Object.values(filtersToBeApplied))).toEqual(
      new Set(appliedFilters)
    );
  });

  [
    { fromDate: new Date(2025, 8, 3), toDate: new Date(2025, 8, 13) },
    { fromDate: new Date(2025, 7, 18), toDate: new Date(2025, 7, 20) },
    { fromDate: new Date(2025, 9, 15), toDate: new Date(2025, 9, 30) },
  ].forEach(dr => {
    test(`test date filtering ${dr.fromDate.toISOString()}`, {
      tag: '@dateFiltering'
    }, async ({ homePage }) => {
      const {fromDate, toDate} = dr;
      const dateFilter = homePage.dateFilter(fromDate, toDate);
      await dateFilter.applyFilter();
      expect(await dateFilter.getSelectedDateColor()).toEqual({
        fromDateColor: "rgb(32, 103, 218)",
        toDateColor: "rgb(32, 103, 218)",
      });
    });
  });

});
