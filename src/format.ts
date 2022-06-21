namespace Format {
  export const formatCompiledSpreadsheet = (
    sheetsLookup: RefSheetLookup[]
  ): void => {
    Logger.log("🦋 Making everything look pretty 🦋");
    for (const s of sheetsLookup) {
      const { category, color, sheet } = s;
      sheet.insertRows(1, 2);
      const fullSheetRange = sheet.getDataRange();
      if (!fullSheetRange.isBlank()) {
        let numCols = sheet.getLastColumn();
        if (numCols < 2) numCols = 2;

        // set column widths to avoid too much side-scrolling
        // Set question widths to 220 because they're longer
        // (assuming <10 subanswers, 160 should be resonable)
        const questionWidth = 220;
        const subquestionWidth = 160;
        sheet.setColumnWidths(1, 1, questionWidth);
        sheet.setColumnWidths(2, (numCols - 1) || 1, subquestionWidth);
        const headersRange = sheet.getRange(1, 1, 2, 2);
        // add the title row and [question, answer] row
        headersRange.setValues([
          [category, ""],
          ["Question", "Answers"],
        ]);
        // Do a merge on title header row
        sheet.getRange(1, 1, 1, numCols).merge();
        // Merge the Answers header
        sheet.getRange(2, 2, 1, numCols - 1).merge();
        // Set formatting on all cells: centered, auto-width, wrapping, bold headers/questions
        fullSheetRange
          .setHorizontalAlignment("center")
          .setVerticalAlignment("middle")
          .setWrap(true);
        for (let boldRow = 1; boldRow < sheet.getLastRow(); boldRow += 2) {
          const currRow = sheet.getRange(boldRow, 1, 1, numCols);
          currRow.setFontWeight("bold");
        }
        // Apply beautiful colors 🤩
        const lighterColor = alterColor(color, 11);
        const superLightColor = alterColor(color, 98);
        // Logger.log(`Theme color for ${color} is ${colorTheme.getColorType()}`)
        fullSheetRange
          .applyRowBanding()
          .setFirstRowColor(superLightColor)
          .setSecondRowColor(lighterColor)
          .setHeaderRowColor(color);
      }
    }
  };
  /**
 * Utility function to make a color slightly lighter
 * positive tint => lighter, negative => darker
         From https://stackoverflow.com/a/13532993
         */
  const alterColor = (color: string, tintPercent: number) => {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = (R * (100 + tintPercent)) / 100;
    G = (G * (100 + tintPercent)) / 100;
    B = (B * (100 + tintPercent)) / 100;

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    const RR =
      R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
    const GG =
      G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
    const BB =
      B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);

    return "#" + RR + GG + BB;
  };
}
