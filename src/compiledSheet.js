// Compiled using evt_parse 1.0.0 (TypeScript 4.7.2)
/**
 * Contains the namespace for creating the compiled results spreadsheet
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var CompiledSheet;
(function (CompiledSheet) {
    CompiledSheet.createCompiledSpreadsheetForRespondant = function (compiledResultsFolder, respondantName, questionCategoriesAndColors) {
        Logger.log("\uD83E\uDE84 Creating Compiled Spreadsheet for Respondant ".concat(respondantName, " \uD83E\uDE84 "));
        var compiledResultsSpreadsheetName = "".concat(respondantName, "_Compiled");
        var compiledFile = SpreadsheetApp.create(compiledResultsSpreadsheetName);
        DriveApp.getFileById(compiledFile.getId()).moveTo(compiledResultsFolder);
        var refSheetLookups = [];
        for (var _i = 0, questionCategoriesAndColors_1 = questionCategoriesAndColors; _i < questionCategoriesAndColors_1.length; _i++) {
            var qCat = questionCategoriesAndColors_1[_i];
            var sheet = compiledFile.insertSheet(qCat.category);
            sheet.setTabColor(qCat.color);
            refSheetLookups.push(__assign(__assign({}, qCat), { sheet: sheet }));
        }
        //delete the default sheet
        var allSheets = compiledFile.getSheets();
        compiledFile.deleteSheet(allSheets[0]);
        return refSheetLookups;
    };
    /**
     * Takes all the prelim data and adds it to the compiled file Respondant Info Sheet
     */
    CompiledSheet.addPrelimDataToCompiledSheet = function (prelimFields, respondantRow, sheetsLookup) {
        Logger.log('📃 Adding Preliminary Data to Respondant Info 📃');
        var compiledRespondantInfoSheet = getSheetByCategory('Respondant Info', sheetsLookup);
        var prependData = [];
        for (var _i = 0, prelimFields_1 = prelimFields; _i < prelimFields_1.length; _i++) {
            var prelimField = prelimFields_1[_i];
            var smData = ResultsFile.resultsSheet.getRange(respondantRow, prelimField.column);
            if (!smData.isBlank()) {
                prependData.push([prelimField.respondantData, 'SurveyMonkey Data'], ['', smData.getValue()]);
            }
        }
        compiledRespondantInfoSheet
            .getRange(1, 1, prependData.length, 2)
            .setValues(prependData);
    };
    CompiledSheet.addRespondantAnswersToCompiledSheet = function (collectedAnswers, questionCategoriesLookup, sheetsLookup) {
        Logger.log('✅ Adding Answers to Compiled Spreadsheet ✅');
        Logger.log('using the following collected Answers');
        Logger.log(collectedAnswers);
        Logger.log('using the following questionCategoriesLookup');
        Logger.log(questionCategoriesLookup);
        for (var _i = 0, collectedAnswers_1 = collectedAnswers; _i < collectedAnswers_1.length; _i++) {
            var answer = collectedAnswers_1[_i];
            var question = answer.question, answers = answer.answers;
            var categories = questionCategoriesLookup[question];
            if (!categories || !categories.length) {
                // Logger.log(`Found an uncategorized question: ${question}`);
                categories = ['Uncategorized'];
            }
            var categorySheets = categories.map(function (cat) {
                return getSheetByCategory(cat, sheetsLookup);
            });
            for (var _a = 0, categorySheets_1 = categorySheets; _a < categorySheets_1.length; _a++) {
                var sheet = categorySheets_1[_a];
                addQnAToSheet(sheet, question, answers);
            }
        }
    };
    /**
     * Adds a question to first column, and then adds all answers alongside it
     */
    var addQnAToSheet = function (sheet, question, answers) {
        // Logger.log(`📝 Adding Question ${question} to Sheet ${sheet.getName()} 📝`);
        var questionsArray = answers.map(function (a) { return a.subquestion; });
        questionsArray.unshift(question);
        var answersArray = answers.map(function (a) { return a.answer; });
        answersArray.unshift('');
        sheet.appendRow(questionsArray);
        sheet.appendRow(answersArray);
    };
    /**
     * Utility function to lookup sheet tab by its category
     */
    var getSheetByCategory = function (tabName, lookup) {
        var sheet = lookup.find(function (qCat) { return qCat.category === tabName; });
        if (!sheet) {
            throw new Error("Could not find sheet with category ".concat(tabName));
        }
        return sheet.sheet;
    };
})(CompiledSheet || (CompiledSheet = {}));
