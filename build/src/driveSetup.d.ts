declare namespace DriveSetup {
    /**
     * TODO: Currently we're assuming that results are in a single file
     * in  a single folder. Will have to modify when we compile answer scoring
     **/
    const initialzeFoldersAndResultsFile: (rootFolderId: string, resultsSpreadsheetId: string) => GoogleAppsScript.Drive.Folder;
}
