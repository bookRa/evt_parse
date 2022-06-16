/**
 * Contains the namespace for parsing the Survey Results file and
 * providing references to survey answers and respondants
 */
/// <reference types="google-apps-script" />
declare namespace ResultsFile {
    interface QuestionColumnAndSubquestion {
        question: string;
        column: number;
        subquestions: {
            question: string;
            column: number;
        }[];
    }
    interface SMPrelimData {
        respondantData: string;
        column: number;
    }
    interface AnswersAndSubanswers {
        question: string;
        answers: {
            subquestion: string;
            answer: string;
        }[];
    }
    const resultsSheet: GoogleAppsScript.Spreadsheet.Sheet;
    /**
     * Finds the first and last row for the respondants in the results spreadsheet
     */
    const getRespondantRows: () => [number, number];
    /**
     *
     * @returns a collection of Default SM Questions along with a reference to questions and
     * their columns
     */
    const gatherQuestionsAndSubquestions: () => [
        SMPrelimData[],
        QuestionColumnAndSubquestion[]
    ];
    /**
     *
     * @param questionsAndSubquestions: {@link QuestionColumnAndSubquestion}
     * @param respondantRow current respondant
     * @returns the compiled answers for the current respondant {@link AnswersAndSubanswers}
     */
    const collectAnswersAndSubanswers: (questionsAndSubquestions: QuestionColumnAndSubquestion[], respondantRow: number) => AnswersAndSubanswers[];
    const getRespondantName: (answers: AnswersAndSubanswers[], respondantRow: number) => string;
}
