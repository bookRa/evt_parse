"use strict";
const compileSurveyResults = () => {
    // Setup the gdrive
    const compiledResultsFolder = DriveSetup.initialzeFoldersAndResultsFile(Config.EC_FOLDER_ID, Config.RESULTS_SPREADSHEET_ID);
    const questionCategoryColors = TemplateFile.getQuestionCategoriesAndColors();
    const questionCategoriesLookup = TemplateFile.createQuestionCategoriesLookup();
    const [firstRespondantRow, lastRespondantRow] = ResultsFile.getRespondantRows();
    const [surveyMonkeyPrlimFields, questionsAndSubquestions] = ResultsFile.gatherQuestionsAndSubquestions();
    for (let respondantRow = firstRespondantRow; respondantRow <= lastRespondantRow; respondantRow++) {
        const respondantAnswers = ResultsFile.collectAnswersAndSubanswers(questionsAndSubquestions, respondantRow);
        const respondantName = ResultsFile.getRespondantName(respondantAnswers, respondantRow);
        const sheetsLookup = CompiledSheet.createCompiledSpreadsheetForRespondant(compiledResultsFolder, respondantName, questionCategoryColors);
        CompiledSheet.addPrelimDataToCompiledSheet(surveyMonkeyPrlimFields, respondantRow, sheetsLookup);
        CompiledSheet.addRespondantAnswersToCompiledSheet(respondantAnswers, questionCategoriesLookup, sheetsLookup);
        Format.formatCompiledSpreadsheet(sheetsLookup);
    }
};
//# sourceMappingURL=index.js.map