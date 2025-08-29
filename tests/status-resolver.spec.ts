import { expect, Page, test } from "@playwright/test";
import {testStatus} from "../app/test-status"

test("Pass or fail the suite", async ({page}) => {
    switch(testStatus.status){
        case "FAIL":
            expect(1).toEqual(2);
        case "PASS":
            expect("PASS").toEqual("PASS");
    }
} );
