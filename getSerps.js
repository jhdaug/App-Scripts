/*
 * =========== This is a Google App Script ==================
 * This function collects search engine result pages (SERP) from a keyword list
 * and saves the results to a Google Spreadsheet.
 * Sheets:
 * - keyword_sheet: list with keywords
 * - result_sheet: sheet for the SERPs
 * - configurations_sheet: custom search engine id and api key
 *
 * API key from https://console.developers.google.com/
 * Custom earch engine id from https://cse.google.com/cse
 */
function getSerps() {

  //get file from Drive by Id
  var file = DriveApp.getFileById('xxxx');

  //open file
  var spreadsheet = SpreadsheetApp.open(file);

  //open sheets
  var keyword_sheet = spreadsheet.getSheetByName("Keywords");
  var result_sheet = spreadsheet.getSheetByName("SERP");
  var configurations_sheet = spreadsheet.getSheetByName("Configurations");

  //last row
  var last_row = result_sheet.getLastRow();

  //header
  if(result_sheet.getRange("A1").isBlank()){
      result_sheet.getRange("A1:L1").setValues([["Date","Keyword","SERP/1","SERP/2",
                                                 "SERP/3","SERP/4","SERP/5","SERP/6",
                                                 "SERP/7","SERP/8","SERP/9","SERP/10"]]);
  }

  //Search URL
  var URL = "https://www.googleapis.com/customsearch/v1"
  var API_KEY = "?key=" + configurations_sheet.getRange(2,2).getValue();
  var SEARCH_ENGINE_ID = "&cx=" + configurations_sheet.getRange(1,2).getValue();
  var COUNTRY = "&cr=countryDE"
  var QUERY = "&q=";

  var engine_url = URL + API_KEY + SEARCH_ENGINE_ID + COUNTRY + QUERY;

  //get keywords
  var keyword_range = keyword_sheet.getRange("A1:A4");
  var keywords = keyword_range.getValues();

  /*
   * loop through keywords and save links from SERPs
   * to the Google spreadsheet
   */
  for(var i = 0; i < keywords.length; i++){
    var keyword = keywords[i][0];
    var query = engine_url + keyword;

    var response = UrlFetchApp.fetch(query).getContentText();
    var data = JSON.parse(response);

    result_sheet.getRange(last_row + i + 1, 1).setValue(new Date());
    result_sheet.getRange(last_row + i + 1, 2).setValue(keyword);

    //loop through items in the JSON response
    for (var j = 0; j < 10; j++){
      result_sheet.getRange(last_row + i + 1, j+3).setValue(data.items[j].link);
    }
  }
}
