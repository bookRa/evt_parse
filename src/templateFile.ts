/**
 *  Contains the namespace for parsing the Template file and
 * providing references to Question Types and colors
 */

namespace TemplateFile {
  export interface QuestionCategoryAndColor {
    category: string;
    color: string;
  }

  export interface QuestionCategoriesLookup {
    [key: string]: string[];
  }

  export const getQuestionCategoriesAndColors = (
    templateSpreadsheetId: string = Config.TEMPLATE_SPREADSHEET_ID,
    questionCatsSheetName: string = Config.TEMPLATE_CATEGORIES_SHEET_NAME
  ): QuestionCategoryAndColor[] => {
    Logger.log('❓ Gathering Question Categories and Colors❓');

    const templateSpreadsheet = SpreadsheetApp.openById(
      Config.TEMPLATE_SPREADSHEET_ID
    );
    const questionCategoriesSheet = templateSpreadsheet.getSheetByName(
      questionCatsSheetName
    );
    if (!questionCategoriesSheet) {
      throw new Error(
        `Could not find sheet with name ${questionCatsSheetName} in template file`
      );
    }
    const numQuestionCategories = questionCategoriesSheet.getLastRow();
    const questionCategoriesAndColors: QuestionCategoryAndColor[] = [];
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
  export const createQuestionCategoriesLookup = (
    templateFileId: string = Config.TEMPLATE_SPREADSHEET_ID,
    questionBankSheetName: string = Config.TEMPLATE_QUESTION_BANK_SHEET_NAME
  ): QuestionCategoriesLookup => {
    const templateQuestionBankSheet = SpreadsheetApp.openById(
      templateFileId
    ).getSheetByName(questionBankSheetName);

    if (!templateQuestionBankSheet) {
      throw new Error(
        `Could not find sheet with name ${questionBankSheetName} in template file`
      );
    }
    const lastRow = templateQuestionBankSheet.getLastRow();
    Logger.log(`📚 ${questionBankSheetName} has ${lastRow} rows`);
    const lastCol = Config.NUMBER_OF_EQUITY_FACTORS; // TODO: hardcoded for now based on Template file structure

    const lookup: {[key: string]: string[]} = {};

    for (let row = 2; row <= lastRow; row++) {
      const currQAndCategories = templateQuestionBankSheet.getRange(
        row,
        1,
        1,
        lastCol
      );
      Logger.log(`YO YO range is ${currQAndCategories.getValues()}`);
      const currQAndCategoriesValues = currQAndCategories.getValues();

      Logger.log('question categories: ', currQAndCategoriesValues);
      const flattendQnCats = currQAndCategoriesValues
        .flat()
        .filter(e => e !== '');
      Logger.log('flattened categories: ', flattendQnCats);

      const [q, ...categories] = flattendQnCats;
      const uniqueCats = [...new Set(categories)];
      Logger.log(
        `unique categories: for question ${q} -- ${JSON.stringify(uniqueCats)}`
      );
      lookup[q] = uniqueCats;
    }
    Logger.log('lookup: ', lookup);
    return lookup;
  };
}
