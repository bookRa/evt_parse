// Compiled using evt_parse 1.0.0 (TypeScript 4.7.2)
var DriveSetup;
(function (DriveSetup) {
    /**
     * TODO: Currently we're assuming that results are in a single file
     * in  a single folder. Will have to modify when we compile answer scoring
     **/
    DriveSetup.initialzeFoldersAndResultsFile = function (rootFolderId, resultsSpreadsheetId) {
        Logger.log('📁 Creating Folder Structure 📂');
        var equityFolder = DriveApp.getFolderById(rootFolderId);
        if (!equityFolder) {
            throw new Error("Could not find folder with id ".concat(rootFolderId));
        }
        var resultsFolderName = DriveApp.getFileById(resultsSpreadsheetId)
            .getParents()
            .next()
            .getName();
        var compiledResultsFolderName = "".concat(resultsFolderName, "_Compiled");
        // Create Sibling Compiled FOlder
        var compiledFolder = equityFolder.createFolder(compiledResultsFolderName);
        return compiledFolder;
    };
})(DriveSetup || (DriveSetup = {}));
