"use strict";
/**
 *  Contains the namespace for parsing the Template file and
 * providing references to Question Types and colors
 */
var TemplateFile;
(function (TemplateFile) {
    TemplateFile.getQuestionCategoriesAndColors = (templateSpreadsheetId = Config.TEMPLATE_SPREADSHEET_ID, questionCatsSheetName = Config.TEMPLATE_CATEGORIES_SHEET_NAME) => {
        Logger.log("❓ Gathering Question Categories and Colors❓");
        const templateSpreadsheet = SpreadsheetApp.openById(Config.TEMPLATE_SPREADSHEET_ID);
        const questionCategoriesSheet = templateSpreadsheet.getSheetByName(questionCatsSheetName);
        if (!questionCategoriesSheet) {
            throw new Error(`Could not find sheet with name ${questionCatsSheetName} in template file`);
        }
        const numQuestionCategories = questionCategoriesSheet.getLastRow();
        const questionCategoriesAndColors = [];
        for (let row = 2; row <= numQuestionCategories; row++) {
            const currCat = questionCategoriesSheet.getRange(row, 1);
            const qCatObj = {
                category: currCat.getValue(),
                color: currCat.getBackground(),
            };
            questionCategoriesAndColors.push(qCatObj);
        }
        return questionCategoriesAndColors;
    };
    /**
     *
     * @param templateFileId
     * @param questionBankSheetName
     * @returns an object of the form: { "XYZ Question" : ["Culture", "Systems", "Respondant Info"]}
     */
    TemplateFile.createQuestionCategoriesLookup = (templateFileId = Config.TEMPLATE_SPREADSHEET_ID, questionBankSheetName = Config.TEMPLATE_QUESTION_BANK_SHEET_NAME) => {
        const templateQuestionBankSheet = SpreadsheetApp.openById(templateFileId).getSheetByName(questionBankSheetName);
        if (!templateQuestionBankSheet) {
            throw new Error(`Could not find sheet with name ${questionBankSheetName} in template file`);
        }
        const lastRow = templateQuestionBankSheet.getLastRow();
        Logger.log(`📚 ${questionBankSheetName} has ${lastRow} rows`);
        const lastCol = Config.NUMBER_OF_EQUITY_FACTORS; // TODO: hardcoded for now based on Template file structure
        const lookup = {};
        for (let row = 2; row <= lastRow; row++) {
            const currQAndCategories = templateQuestionBankSheet.getRange(row, 1, 1, lastCol);
            Logger.log(`YO YO range is ${currQAndCategories.getValues()}`);
            const currQAndCategoriesValues = currQAndCategories.getValues();
            Logger.log("question categories: ", JSON.stringify(currQAndCategories));
            const flattendQnCats = currQAndCategoriesValues
                .flat()
                .filter((e) => e !== "");
            Logger.log("flattened categories: ", JSON.stringify(flattendQnCats));
            const [q, ...categories] = flattendQnCats;
            const catSet = new Set(categories);
            Logger.log("catSet: ", JSON.stringify(catSet));
            const uniqueCats = [...catSet];
            Logger.log(`unique categories: for question ${q} -- ${JSON.stringify(uniqueCats)}`);
            lookup[q] = uniqueCats;
        }
        Logger.log("lookup: ", lookup);
        return lookup;
    };
})(TemplateFile || (TemplateFile = {}));
//# sourceMappingURL=templateFile.js.map