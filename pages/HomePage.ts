import { PageObj } from './PageObj'
import { expect } from '@playwright/test'
import { SearchFilters } from './components/SearchFilters'
import { switchWindow } from './Utils'
import { DateFilter } from './components/DateFilter'

export class HomePage extends PageObj {
  copies = {
    searchError:
      'Please enter the name of a country, city, airport, neighborhood, landmark, or property to proceed.'
  }

  async search (): Promise<HomePage> {
    await this.page.getByText('SEARCH', { exact: true }).click()
    return this
  }

  async getDropDownOptions (): Promise<string[]> {
    await this.page
      .getByRole('combobox', {
        name: 'Enter a destination or property',
        exact: true
      })
      .click()
    await expect(
      this.page.getByText('Destinations in India', { exact: true })
    ).toBeVisible()
    const elements = await this.page
      .locator('[role="option"][id^="autocomplete"]')
      .all()
    return await Promise.all(
      elements.map(
        async locator =>
          await locator.getByRole('button').locator('p').first().innerText()
      )
    )
  }

  async selectDropDownOption (name: string): Promise<HomePage> {
    await this.page.getByRole('button', { name }).click()
    await this.page.getByRole('button', { name: /Check-in/i }).click()
    return this
  }

  async openResult (number: number) {
    const hotelIdentifier = '[data-selenium="hotel-name"]'
    await expect(
      this.page.getByRole('group', { name: 'Property Card' }).first()
    ).toBeVisible()
    await this.scrollTillResult(number)
    return await switchWindow(this.page, async () =>
      this.page.locator(hotelIdentifier).nth(number).click()
    )
  }

  searchFilter (): SearchFilters {
    return new SearchFilters(this.page)
  }

  dateFilter (from: Date, to: Date) {
    return new DateFilter(this.page, {from, to})
  }

  private async scrollTillResult (resultNumber: number) {
    let isNotVisible = true
    const hotelIdentifier = '[data-selenium="hotel-name"]'
    do {
      await this.page.evaluate(() => window.scrollBy(0, 400))
      try {
        await this.page
          .locator(hotelIdentifier)
          .nth(resultNumber)
          .waitFor({ state: 'attached', timeout: 1000 })
        isNotVisible = false
      } catch {
        isNotVisible = true
      }
    } while (isNotVisible)
  }
}
