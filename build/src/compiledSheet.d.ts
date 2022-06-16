/**
 * Contains the namespace for creating the compiled results spreadsheet
 */
/// <reference types="google-apps-script" />
interface RefSheetLookup {
    category: string;
    color: string;
    sheet: GoogleAppsScript.Spreadsheet.Sheet;
}
declare namespace CompiledSheet {
    const createCompiledSpreadsheetForRespondant: (compiledResultsFolder: GoogleAppsScript.Drive.Folder, respondantName: string, questionCategoriesAndColors: TemplateFile.QuestionCategoryAndColor[]) => RefSheetLookup[];
    /**
     * Takes all the prelim data and adds it to the compiled file Respondant Info Sheet
     */
    const addPrelimDataToCompiledSheet: (prelimFields: ResultsFile.SMPrelimData[], respondantRow: number, sheetsLookup: RefSheetLookup[]) => void;
    const addRespondantAnswersToCompiledSheet: (collectedAnswers: ResultsFile.AnswersAndSubanswers[], questionCategoriesLookup: TemplateFile.QuestionCategoriesLookup, sheetsLookup: RefSheetLookup[]) => void;
}
