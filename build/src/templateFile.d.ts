/**
 *  Contains the namespace for parsing the Template file and
 * providing references to Question Types and colors
 */
declare namespace TemplateFile {
    interface QuestionCategoryAndColor {
        category: string;
        color: string;
    }
    interface QuestionCategoriesLookup {
        [key: string]: string[];
    }
    const getQuestionCategoriesAndColors: (templateSpreadsheetId?: string, questionCatsSheetName?: string) => QuestionCategoryAndColor[];
    /**
     *
     * @param templateFileId
     * @param questionBankSheetName
     * @returns an object of the form: { "XYZ Question" : ["Culture", "Systems", "Respondant Info"]}
     */
    const createQuestionCategoriesLookup: (templateFileId?: string, questionBankSheetName?: string) => QuestionCategoriesLookup;
}
