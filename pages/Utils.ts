import { Locator, Page, expect } from '@playwright/test'

export async function switchWindow (
  page: Page,
  triggerFunction: () => Promise<void>
): Promise<Page> {
  triggerFunction()
  const newPage = await page.context().waitForEvent('page')
  await newPage.bringToFront()
  return newPage
}

export async function getCssValue (params: {
  element: Locator
  pseudoElement?: string
  properties: string[]
}): Promise<Record<string, string>> {
  const { element, pseudoElement, properties } = params
  return await element.evaluate(
    (el, { properties, pseudoElement }) => {
      let propertyValues: Record<string, string> = {}
      const elementStyle = window.getComputedStyle(el, pseudoElement)
      properties.map(
        property =>
          (propertyValues[property] = elementStyle.getPropertyValue(property))
      )
      return propertyValues
    },
    { properties, pseudoElement }
  )
}

export async function waitTillVisibilityOfAll(locator: Locator ){
  (await locator.all()).forEach(element => expect(element).toBeVisible())
}

export async function countToBe(page: Page) {
  page.locator('.inbox-job-card span.title').waitFor({state: 'visible'});
}
