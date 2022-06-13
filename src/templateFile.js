// Compiled using evt_parse 1.0.0 (TypeScript 4.7.2)
/**
 *  Contains the namespace for parsing the Template file and
 * providing references to Question Types and colors
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var TemplateFile;
(function (TemplateFile) {
    TemplateFile.getQuestionCategoriesAndColors = function (templateSpreadsheetId, questionCatsSheetName) {
        if (templateSpreadsheetId === void 0) { templateSpreadsheetId = Config.TEMPLATE_SPREADSHEET_ID; }
        if (questionCatsSheetName === void 0) { questionCatsSheetName = Config.TEMPLATE_CATEGORIES_SHEET_NAME; }
        Logger.log('❓ Gathering Question Categories and Colors❓');
        var templateSpreadsheet = SpreadsheetApp.openById(Config.TEMPLATE_SPREADSHEET_ID);
        var questionCategoriesSheet = templateSpreadsheet.getSheetByName(questionCatsSheetName);
        if (!questionCategoriesSheet) {
            throw new Error("Could not find sheet with name ".concat(questionCatsSheetName, " in template file"));
        }
        var numQuestionCategories = questionCategoriesSheet.getLastRow();
        var questionCategoriesAndColors = [];
        for (var row = 2; row <= numQuestionCategories; row++) {
            var currCat = questionCategoriesSheet.getRange(row, 1);
            var qCatObj = {
                category: currCat.getValue(),
                color: currCat.getBackground()
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
    TemplateFile.createQuestionCategoriesLookup = function (templateFileId, questionBankSheetName) {
        if (templateFileId === void 0) { templateFileId = Config.TEMPLATE_SPREADSHEET_ID; }
        if (questionBankSheetName === void 0) { questionBankSheetName = Config.TEMPLATE_QUESTION_BANK_SHEET_NAME; }
        var templateQuestionBankSheet = SpreadsheetApp.openById(templateFileId).getSheetByName(questionBankSheetName);
        if (!templateQuestionBankSheet) {
            throw new Error("Could not find sheet with name ".concat(questionBankSheetName, " in template file"));
        }
        var lastRow = templateQuestionBankSheet.getLastRow();
        Logger.log("\uD83D\uDCDA ".concat(questionBankSheetName, " has ").concat(lastRow, " rows"));
        var lastCol = Config.NUMBER_OF_EQUITY_FACTORS; // TODO: hardcoded for now based on Template file structure
        var lookup = {};
        for (var row = 2; row <= lastRow; row++) {
            var currQAndCategories = templateQuestionBankSheet.getRange(row, 1, 1, lastCol);
            Logger.log("YO YO range is ".concat(currQAndCategories.getValues()));
            var currQAndCategoriesValues = currQAndCategories.getValues();
            Logger.log('question categories: ', currQAndCategories);
            var flattendQnCats = currQAndCategoriesValues
                .flat()
                .filter(function (e) { return e !== ''; });
            Logger.log('flattened categories: ', flattendQnCats);
            var q = flattendQnCats[0], categories = flattendQnCats.slice(1);
            var uniqueCats = __spreadArray([], new Set(categories), true);
            Logger.log("unique categories: for question ".concat(q, " -- ").concat(JSON.stringify(uniqueCats)));
            lookup[q] = uniqueCats;
        }
        Logger.log('lookup: ', lookup);
        return lookup;
    };
})(TemplateFile || (TemplateFile = {}));
