// Compiled using evt_parse 1.0.0 (TypeScript 4.7.2)
var compileSurveyResults = function () {
    // Setup the gdrive
    var compiledResultsFolder = DriveSetup.initialzeFoldersAndResultsFile(Config.EC_FOLDER_ID, Config.RESULTS_SPREADSHEET_ID);
    var questionCategoryColors = TemplateFile.getQuestionCategoriesAndColors();
    var questionCategoriesLookup = TemplateFile.createQuestionCategoriesLookup();
    var _a = ResultsFile.getRespondantRows(), firstRespondantRow = _a[0], lastRespondantRow = _a[1];
    var _b = ResultsFile.gatherQuestionsAndSubquestions(), surveyMonkeyPrlimFields = _b[0], questionsAndSubquestions = _b[1];
    for (var respondantRow = firstRespondantRow; respondantRow <= lastRespondantRow; respondantRow++) {
        var respondantAnswers = ResultsFile.collectAnswersAndSubanswers(questionsAndSubquestions, respondantRow);
        var respondantName = ResultsFile.getRespondantName(respondantAnswers, respondantRow);
        var sheetsLookup = CompiledSheet.createCompiledSpreadsheetForRespondant(compiledResultsFolder, respondantName, questionCategoryColors);
        CompiledSheet.addPrelimDataToCompiledSheet(surveyMonkeyPrlimFields, respondantRow, sheetsLookup);
        CompiledSheet.addRespondantAnswersToCompiledSheet(respondantAnswers, questionCategoriesLookup, sheetsLookup);
    }
};
