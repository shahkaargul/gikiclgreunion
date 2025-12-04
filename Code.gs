// ============================================
// GIKI School and College Reunion 2025
// Google Apps Script Backend
// ============================================

// CONFIGURATION - REPLACE WITH YOUR IDs
var SPREADSHEET_ID = '1t0J-X_kUTKgwgiPgMguUIQ9xso3eBVM38xu2WWYsmew';  // New dedicated spreadsheet
var PAYMENT_FOLDER_ID = '1aw434BZnea2HJT7QOAMVjnNis1Uu3izp';  // Folder for payment receipts
var CNIC_FOLDER_ID = '1PZMuSm0XWvlgvmUijNorV5HE2XaMHx_C';  // Folder for CNIC/Form-B files

function doPost(e) {
  try {
    // Parse incoming JSON data
    var data = JSON.parse(e.postData.contents);
    
    // Get the specific spreadsheet by ID
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getSheetByName('Registrations') || spreadsheet.getSheets()[0];
    
    // Generate unique Ticket ID
    var ticketID = 'GIKI-2025-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMddHHmmss');
    
    // Get the Drive folders
    var paymentFolder = DriveApp.getFolderById(PAYMENT_FOLDER_ID);
    var cnicFolder = DriveApp.getFolderById(CNIC_FOLDER_ID);
    
    // === UPLOAD PAYMENT PROOF ===
    var paymentProofUrl = '';
    if (data.file && data.fileName) {
      var paymentBlob = Utilities.newBlob(
        Utilities.base64Decode(data.file), 
        data.mimeType, 
        ticketID + '_payment_' + data.fileName
      );
      var paymentFile = paymentFolder.createFile(paymentBlob);
      paymentProofUrl = paymentFile.getUrl();
    }
    
    // === UPLOAD CNIC FILE ===
    var cnicFileUrl = '';
    if (data.cnicFile && data.cnicFileName) {
      var cnicBlob = Utilities.newBlob(
        Utilities.base64Decode(data.cnicFile), 
        data.cnicMimeType, 
        ticketID + '_cnic_' + data.cnicFileName
      );
      var cnicFile = cnicFolder.createFile(cnicBlob);
      cnicFileUrl = cnicFile.getUrl();
    }
    
    // === SAVE TO SHEET ===
    sheet.appendRow([
      new Date(),                    // Timestamp
      ticketID,                       // Ticket ID
      data.name,                      // Name
      data.email,                     // Email
      data.phone,                     // Phone
      data.batch,                     // Batch/Subject
      data.type,                      // Category (with fee)
      data.senderDetails,             // Sender Account Details
      paymentProofUrl,                // Payment Proof URL
      cnicFileUrl                     // CNIC File URL
    ]);
    
    // === RETURN SUCCESS ===
    return ContentService
      .createTextOutput(JSON.stringify({
        result: 'success',
        id: ticketID
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // === RETURN ERROR ===
    return ContentService
      .createTextOutput(JSON.stringify({
        result: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// TICKET VERIFICATION SYSTEM
// ============================================

function doGet(e) {
  try {
    var action = e.parameter.action;
    var ticketId = e.parameter.id;
    
    if (!ticketId) {
      return jsonResponse({
        result: 'error',
        message: 'No ticket ID provided'
      });
    }
    
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getSheetByName('Registrations') || spreadsheet.getSheets()[0];
    var data = sheet.getDataRange().getValues();
    
    // Find the ticket (skip header row)
    var ticketRow = -1;
    for (var i = 1; i < data.length; i++) {
      if (data[i][1] === ticketId) { // Column B (index 1) = Ticket ID
        ticketRow = i;
        break;
      }
    }
    
    if (ticketRow === -1) {
      return jsonResponse({
        result: 'error',
        message: 'Ticket not found in our records'
      });
    }
    
    // Handle different actions
    if (action === 'verify') {
      // Return ticket information
      var ticket = {
        id: data[ticketRow][1],
        name: data[ticketRow][2],
        email: data[ticketRow][3],
        phone: data[ticketRow][4],
        batch: data[ticketRow][5],
        category: data[ticketRow][6],
        registrationDate: Utilities.formatDate(new Date(data[ticketRow][0]), Session.getScriptTimeZone(), 'MMM d, yyyy'),
        status: data[ticketRow][10] || 'valid' // Column K (index 10) = Status
      };
      
      return jsonResponse({
        result: 'success',
        ticket: ticket
      });
      
    } else if (action === 'admit') {
      // Mark ticket as used
      var statusColumn = 11; // Column K
      var currentStatus = sheet.getRange(ticketRow + 1, statusColumn).getValue();
      
      if (currentStatus === 'used') {
        return jsonResponse({
          result: 'error',
          message: 'This ticket has already been used for entry'
        });
      }
      
      // Update status and entry time
      sheet.getRange(ticketRow + 1, statusColumn).setValue('used');
      sheet.getRange(ticketRow + 1, statusColumn + 1).setValue(new Date()); // Column L = Entry Time
      
      return jsonResponse({
        result: 'success',
        message: 'Entry recorded successfully'
      });
      
    } else {
      return jsonResponse({
        result: 'error',
        message: 'Invalid action'
      });
    }
    
  } catch (error) {
    return jsonResponse({
      result: 'error',
      message: error.toString()
    });
  }
}

// Helper function to return JSON response
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Helper function to initialize the spreadsheet with headers
function setupSpreadsheet() {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName('Registrations');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Registrations');
  }
  
  // Check if headers already exist
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'Ticket ID',
      'Full Name',
      'Email',
      'Phone',
      'Batch/Subject',
      'Category',
      'Sender Details',
      'Payment Proof URL',
      'CNIC File URL',
      'Status',
      'Entry Time'
    ]);
    
    // Format header row
    var headerRange = sheet.getRange(1, 1, 1, 12);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#a8304e');
    headerRange.setFontColor('#ffffff');
    
    // Auto-resize columns
    for (var i = 1; i <= 12; i++) {
      sheet.autoResizeColumn(i);
    }
    
    Logger.log('Spreadsheet setup complete!');
  } else {
    Logger.log('Headers already exist.');
  }
}
