/* In google docs, navigate to Extensions > Apps Script and create a new script.
Then, create a Time-driven trigger to run the script at whatever interval you specify.

This script will require a Google account to grant permissions to things like the DriveApp.
*/

function updateLastModifiedDate() {
    var doc = DocumentApp.getActiveDocument();
    var docFile = DriveApp.getFileById(doc.getId());
    var body = doc.getBody();
    var lastUpdatedText = 'Last updated on: ';
    var currentDate = new Date();
    
    // Get the document's last updated time using DriveApp
    var lastUpdated = docFile.getLastUpdated();
    
    // Check if the document was updated within the timeframe (below uses 1 hour). Match this with the trigger.
    var threshold = 60 * 60 * 1000; // Timeframe in milliseconds (mintes * seconds * milliseconds)
    if (currentDate - lastUpdated > threshold) {
      Logger.log("Document has not been updated within the timeframe.");
      return;
    }
    
    // Get the current date as a string
    var dateString = currentDate.toDateString();
    
    // Find the location of the "Last updated on:" text
    var text = body.getText();
    var startIndex = text.indexOf(lastUpdatedText);
    
    // If the "Last updated on:" text is found, update the date
    if (startIndex !== -1) {
      var endIndex = text.indexOf('\n', startIndex);
      if (endIndex === -1) endIndex = text.length; // If no newline is found, it's the end of the document
      
      // Replace the existing "Last updated on:" with new date
      body.replaceText(text.substring(startIndex, endIndex), lastUpdatedText + dateString)
      Logger.log('"Last updated on:" date updated in the document');
    } else {
      // If no "Last updated on:" text is found, log a message
      Logger.log('No "Last updated on:" text found in the document.');
    }
  }
  