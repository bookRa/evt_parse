namespace DriveSetup {
  /**
   * TODO: Currently we're assuming that results are in a single file
   * in  a single folder. Will have to modify when we compile answer scoring
   **/
  export const initialzeFoldersAndResultsFile = (
    rootFolderId: string,
    resultsSpreadsheetId: string
  ): GoogleAppsScript.Drive.Folder => {
    Logger.log("📁 Creating Folder Structure 📂");

    const equityFolder = DriveApp.getFolderById(rootFolderId);
    if (!equityFolder) {
      throw new Error(`Could not find folder with id ${rootFolderId}`);
    }

    const resultsFolderName = DriveApp.getFileById(resultsSpreadsheetId)
      .getParents()
      .next()
      .getName();

    const compiledResultsFolderName = `${resultsFolderName}_Compiled`;

    // Create Sibling Compiled FOlder
    const compiledFolder = equityFolder.createFolder(compiledResultsFolderName);
    return compiledFolder;
  };
}
