// Compiled using evt_parse 1.0.0 (TypeScript 4.7.2)
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
    ResultsFile.getRespondantRows = function () {
        Logger.log('🔢 Determining # of Respondants 🔢');
        var lastRow = ResultsFile.resultsSheet.getLastRow();
        return [3, lastRow];
    };
    /**
     *
     * @returns a collection of Default SM Questions along with a reference to questions and
     * their columns
     */
    ResultsFile.gatherQuestionsAndSubquestions = function () {
        Logger.log('🐒 Collecting SurveyMonkey Questions 🐒');
        var resultsSheet = ResultsFile.resultsSheet;
        // Survey Monkey prepends 9 cols of data
        var prelimData = resultsSheet
            .getRange(1, 1, 1, 9)
            .getValues()
            .flat()
            .map(function (v, idx) { return ({
            respondantData: v,
            column: idx + 1
        }); });
        var questions = [];
        var lastCol = resultsSheet.getLastColumn();
        var firstQuestionColumn = 10;
        var currQ;
        for (var col = firstQuestionColumn; col <= lastCol; col++) {
            var question = resultsSheet.getRange(1, col).getValue();
            var subquestion = resultsSheet.getRange(2, col).getValue();
            if (question) {
                if (currQ) {
                    questions.push(currQ);
                }
                currQ = {
                    question: question,
                    column: col,
                    subquestions: [{ question: subquestion, column: col }]
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
    ResultsFile.collectAnswersAndSubanswers = function (questionsAndSubquestions, respondantRow) {
        Logger.log('🔎 Collecting Respondant Answers 🔍');
        var answers = [];
        for (var _i = 0, questionsAndSubquestions_1 = questionsAndSubquestions; _i < questionsAndSubquestions_1.length; _i++) {
            var q = questionsAndSubquestions_1[_i];
            var subAnswers = q.subquestions
                .map(function (sq) {
                var subAnswer = ResultsFile.resultsSheet
                    .getRange(respondantRow, sq.column)
                    .getDisplayValue();
                return { subquestion: sq.question, answer: subAnswer };
            })
                .filter(function (sa) { return sa.answer !== ''; });
            answers.push({ question: q.question, answers: subAnswers });
        }
        return answers;
    };
    ResultsFile.getRespondantName = function (answers, respondantRow) {
        Logger.log('👋🏽 Determining Respondant Name 👋🏽');
        var name = answers.find(function (r) { return r.question === Config.FULL_NAME_QUESTION; });
        if (!name)
            return "Unnamed_".concat(respondantRow);
        // Hopefully just pull out first and last name
        else
            return name.answers[0].answer.trim().split(' ').slice(0, 2).join('_');
    };
})(ResultsFile || (ResultsFile = {}));
