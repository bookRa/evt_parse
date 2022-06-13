/**
 * Contains the namespace for creating the compiled results spreadsheet
 */

interface RefSheetLookup {
  category: string;
  color: string;
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
}

namespace CompiledSheet {
  export const createCompiledSpreadsheetForRespondant = (
    compiledResultsFolder: GoogleAppsScript.Drive.Folder,
    respondantName: string,
    questionCategoriesAndColors: TemplateFile.QuestionCategoryAndColor[]
  ): RefSheetLookup[] => {
    Logger.log(
      `🪄 Creating Compiled Spreadsheet for Respondant ${respondantName} 🪄 `
    );
    const compiledResultsSpreadsheetName = `${respondantName}_Compiled`;
    const compiledFile = SpreadsheetApp.create(compiledResultsSpreadsheetName);
    DriveApp.getFileById(compiledFile.getId()).moveTo(compiledResultsFolder);

    const refSheetLookups: RefSheetLookup[] = [];

    for (const qCat of questionCategoriesAndColors) {
      const sheet = compiledFile.insertSheet(qCat.category);
      sheet.setTabColor(qCat.color);
      refSheetLookups.push({...qCat, sheet});
    }

    //delete the default sheet
    const allSheets = compiledFile.getSheets();
    compiledFile.deleteSheet(allSheets[0]);
    return refSheetLookups;
  };

  /**
   * Takes all the prelim data and adds it to the compiled file Respondant Info Sheet
   */
  export const addPrelimDataToCompiledSheet = (
    prelimFields: ResultsFile.SMPrelimData[],
    respondantRow: number,
    sheetsLookup: RefSheetLookup[]
  ) => {
    Logger.log('📃 Adding Preliminary Data to Respondant Info 📃');
    const compiledRespondantInfoSheet = getSheetByCategory(
      'Respondant Info',
      sheetsLookup
    );

    const prependData = [];
    for (const prelimField of prelimFields) {
      const smData = ResultsFile.resultsSheet.getRange(
        respondantRow,
        prelimField.column
      );
      if (!smData.isBlank()) {
        prependData.push(
          [prelimField.respondantData, 'SurveyMonkey Data'],
          ['', smData.getValue()]
        );
      }
    }
    compiledRespondantInfoSheet
      .getRange(1, 1, prependData.length, 2)
      .setValues(prependData);
  };

  export const addRespondantAnswersToCompiledSheet = (
    collectedAnswers: ResultsFile.AnswersAndSubanswers[],
    questionCategoriesLookup: TemplateFile.QuestionCategoriesLookup,
    sheetsLookup: RefSheetLookup[]
  ) => {
    Logger.log('✅ Adding Answers to Compiled Spreadsheet ✅');
    Logger.log('using the following collected Answers');
    Logger.log(collectedAnswers);
    Logger.log('using the following questionCategoriesLookup');
    Logger.log(questionCategoriesLookup);
    for (const answer of collectedAnswers) {
      const {question, answers} = answer;
      let categories = questionCategoriesLookup[question];
      if (!categories || !categories.length) {
        // Logger.log(`Found an uncategorized question: ${question}`);
        categories = ['Uncategorized'];
      }
      const categorySheets = categories.map(cat =>
        getSheetByCategory(cat, sheetsLookup)
      );
      for (const sheet of categorySheets) {
        addQnAToSheet(sheet, question, answers);
      }
    }
  };

  /**
   * Adds a question to first column, and then adds all answers alongside it
   */
  const addQnAToSheet = (
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    question: string,
    answers: {subquestion: string; answer: string}[]
  ) => {
    // Logger.log(`📝 Adding Question ${question} to Sheet ${sheet.getName()} 📝`);
    const questionsArray = answers.map(a => a.subquestion);
    questionsArray.unshift(question);
    const answersArray = answers.map(a => a.answer);
    answersArray.unshift('');
    sheet.appendRow(questionsArray);
    sheet.appendRow(answersArray);
  };

  /**
   * Utility function to lookup sheet tab by its category
   */
  const getSheetByCategory = (
    tabName: string,
    lookup: RefSheetLookup[]
  ): GoogleAppsScript.Spreadsheet.Sheet => {
    const sheet = lookup.find(qCat => qCat.category === tabName);
    if (!sheet) {
      throw new Error(`Could not find sheet with category ${tabName}`);
    }
    return sheet.sheet;
  };
}
