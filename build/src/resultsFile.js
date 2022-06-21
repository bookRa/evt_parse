"use strict";
/**
 * Contains the namespace for parsing the Survey Results file and
 * providing references to survey answers and respondants
 */
var ResultsFile;
(function (ResultsFile) {
    ResultsFile.resultsSheet = SpreadsheetApp.openById(Config.RESULTS_SPREADSHEET_ID).getSheets()[0];
    /**
     * Finds the first and last row for the respondants in the results spreadsheet
     */
    ResultsFile.getRespondantRows = () => {
        Logger.log("🔢 Determining # of Respondants 🔢");
        const lastRow = ResultsFile.resultsSheet.getLastRow();
        return [3, lastRow];
    };
    /**
     *
     * @returns a collection of Default SM Questions along with a reference to questions and
     * their columns
     */
    ResultsFile.gatherQuestionsAndSubquestions = () => {
        Logger.log("🐒 Collecting SurveyMonkey Questions 🐒");
        const resultsSheet = ResultsFile.resultsSheet;
        // Survey Monkey prepends 9 cols of data
        const prelimData = resultsSheet
            .getRange(1, 1, 1, 9)
            .getValues()
            .flat()
            .map((v, idx) => ({
            respondantData: v,
            column: idx + 1,
        }));
        const questions = [];
        const lastCol = resultsSheet.getLastColumn();
        const firstQuestionColumn = 10;
        let currQ;
        for (let col = firstQuestionColumn; col <= lastCol; col++) {
            const question = resultsSheet.getRange(1, col).getValue();
            const subquestion = resultsSheet.getRange(2, col).getValue();
            if (question) {
                if (currQ) {
                    questions.push(currQ);
                }
                currQ = {
                    question,
                    column: col,
                    subquestions: [{ question: subquestion, column: col }],
                };
            }
            else if (currQ) {
                currQ.subquestions.push({ question: subquestion, column: col });
            }
        }
        if (currQ) {
            questions.push(currQ);
        }
        return [prelimData, questions];
    };
    /**
     *
     * @param questionsAndSubquestions: {@link QuestionColumnAndSubquestion}
     * @param respondantRow current respondant
     * @returns the compiled answers for the current respondant {@link AnswersAndSubanswers}
     */
    ResultsFile.collectAnswersAndSubanswers = (questionsAndSubquestions, respondantRow) => {
        Logger.log("🔎 Collecting Respondant Answers 🔍");
        const answers = [];
        for (const q of questionsAndSubquestions) {
            const subAnswers = q.subquestions
                .map((sq) => {
                const subAnswer = ResultsFile.resultsSheet
                    .getRange(respondantRow, sq.column)
                    .getDisplayValue();
                return { subquestion: sq.question, answer: subAnswer };
            })
                .filter((sa) => sa.answer !== "");
            answers.push({ question: q.question, answers: subAnswers });
        }
        return answers;
    };
    ResultsFile.getRespondantName = (answers, respondantRow) => {
        Logger.log("👋🏽 Determining Respondant Name 👋🏽");
        const name = answers.find((r) => r.question === Config.FULL_NAME_QUESTION);
        if (!name)
            return `Unnamed_${respondantRow}`;
        // Hopefully just pull out first and last name
        else
            return name.answers[0].answer.trim().split(" ").slice(0, 2).join("_");
    };
})(ResultsFile || (ResultsFile = {}));
//# sourceMappingURL=resultsFile.js.map