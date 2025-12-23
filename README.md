# 🎓 GIKI School and College Networking Reunion 2025

> A complete event registration and ticket verification system for the GIKI School and College Networking Reunion 2025.

![Event Date](https://img.shields.io/badge/Event%20Date-27%20December%202025-a8304e)
![Registration Deadline](https://img.shields.io/badge/Deadline-10%20December%202025-d4b578)
![Status](https://img.shields.io/badge/Status-Active-10b981)

---

## 📋 Overview

This project provides a complete solution for managing event registrations including:
- **Online Registration Form** with payment proof upload
- **Automatic E-Ticket Generation** with QR code
- **Ticket Verification System** for event entry
- **Google Sheets Integration** for data storage

---

## ✨ Features

### Registration Form (`payment.html`)
- 📝 Comprehensive registration form with validation
- 💳 Payment instructions with bank details
- 📎 File upload for payment receipts (PDF/Image, max 10MB)
- 🪪 CNIC/Form-B/School Badge upload for verification
- 🎫 Automatic e-ticket generation with QR code
- 🖨️ Print/Save ticket functionality
- 📱 Fully responsive design

### Ticket Verification (`verify.html`)
- 🔍 QR code scanning verification
- ✅ Real-time ticket status checking
- 🚪 One-click admit entry functionality
- ⚠️ Duplicate entry prevention
- 🎉 Celebration animation on successful admission
- 📊 Status badges (Valid, Used, Admitted)

---

## 📁 Project Structure

```
paymentform/
├── payment.html         # Main registration form page
├── styles.css           # Styles for registration form
├── script.js            # JavaScript for registration form
├── verify.html          # Ticket verification page
├── verify-styles.css    # Styles for verification page
├── verify-script.js     # JavaScript for verification page
└── README.md            # This file
```

---

## 🛠️ Setup & Configuration

### 1. Google Apps Script Setup

Both the registration form and verification system require a Google Apps Script Web App. Update the script URL in:

**`script.js`** (Line 4):
```javascript
var SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
```

**`verify-script.js`** (Line 6):
```javascript
var VERIFY_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
```

### 2. Bank Details

Update the payment instructions in `payment.html` with your actual bank details:
- Bank Name
- Account Title
- Account Number (IBAN)

### 3. Contact Information

Update the footer contact details in `payment.html`:
- Email address
- Phone number

---

## 🚀 Deployment

### Option 1: Static Hosting
Upload all files to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting
- Any web server

### Option 2: Local Testing
Simply open `payment.html` in a web browser. Note that file uploads and API calls require a web server for full functionality.

---

## 📝 Registration Categories & Fees

| Category | Fee |
|----------|-----|
| Alumni/Former Student | PKR 1,500 |
| Current Student | PKR 1,000 |
| Former Teacher (Former Staff) | PKR 1,500 |
| Current Teacher | PKR 1,500 |
| Child (under 12) | PKR 800 |
| Spouse | PKR 800 |
| Administrative Staff | PKR 1,500 |
| Support Staff | Free |
| Open Contribution | Any Amount |

---

## 🔄 How It Works

### Registration Flow
1. User fills out registration form
2. Uploads payment receipt and CNIC
3. Selects category and confirms details
4. Form submits data to Google Apps Script
5. Script stores data in Google Sheets & Drive
6. Unique ticket ID generated
7. E-ticket displayed with QR code
8. User can print/save ticket

### Verification Flow
1. Staff scans QR code on ticket
2. System fetches ticket data from Google Sheets
3. Displays attendee information and status
4. Staff clicks "Admit Entry" for valid tickets
5. System marks ticket as used
6. Confetti celebration on success
7. Ready for next scan

---

## 🎨 Design Features

- **Modern UI** with gradient backgrounds
- **Glassmorphism** effects
- **Smooth animations** and transitions
- **Premium color palette** (Maroon, Gold, Blue)
- **Google Fonts** (Inter, Crimson Text)
- **Mobile-first responsive design**
- **Print-optimized ticket layout**

---

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

---

## 🔐 Security Notes

- CNIC data is kept confidential
- Files are stored securely in Google Drive
- Payment verification is manual
- No refund policy clearly stated
- QR codes link to verification system

---

## 📞 Contact

For technical support or inquiries:
- 📧 Email: contactshahkaar@gmail.com
- 📱 Phone: +92 300 5159901

---

## 📄 License

This project is created for GIKI School and College Alumni Association.

© 2025 GIKI School and College Alumni Association. All rights reserved.

---

## 🙏 Acknowledgments

- **SweetAlert2** - Beautiful alert dialogs
- **QRCode.js** - QR code generation
- **Google Apps Script** - Backend processing
- **Google Fonts** - Typography

---

<div align="center">

**Made with ❤️ for GIKI Alumni**

*Reconnect • Reminisce • Celebrate*

</div>
