// ============================================
// CONFIGURATION - REPLACE WITH YOUR URL
// ============================================
var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLk24SbUvu4zqRD5gFpJdMw-CCDvsn-HXfNpcMFXXOOTGK-ynHBOKSgffK7v-aQtedYw/exec';

// Base URL for verification page (change this to your hosted verify.html location)
var VERIFY_PAGE_URL = window.location.href.replace('payment.html', 'verify.html');
// ============================================

// File Upload - CNIC
function updateCNICFileName(input) {
    var label = document.getElementById('cnicFileLabel');
    var previewContainer = document.getElementById('cnic-preview-container');
    var previewImage = document.getElementById('cnic-preview-image');

    if (input.files && input.files[0]) {
        var file = input.files[0];

        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            Swal.fire('Error', 'File size must be less than 10 MB', 'error');
            input.value = '';
            return;
        }

        label.textContent = "Selected: " + file.name;
        label.style.color = "var(--primary)";
        label.style.fontWeight = "600";

        // Show Preview for images
        if (file.type.startsWith('image/')) {
            var reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewContainer.style.display = 'block';
            }
            reader.readAsDataURL(file);
        } else {
            previewContainer.style.display = 'none';
        }
    } else {
        label.textContent = "Upload CNIC (PDF or Image, Max 10 MB)";
        label.style.color = "#777";
        label.style.fontWeight = "normal";
        previewContainer.style.display = 'none';
        previewImage.src = "";
    }
}

// File Upload - Payment Receipt
function updateFileName(input) {
    var label = document.getElementById('fileLabel');
    var previewContainer = document.getElementById('preview-container');
    var previewImage = document.getElementById('preview-image');

    if (input.files && input.files[0]) {
        var file = input.files[0];

        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            Swal.fire('Error', 'File size must be less than 10 MB', 'error');
            input.value = '';
            return;
        }

        label.textContent = "Selected: " + file.name;
        label.style.color = "var(--primary)";
        label.style.fontWeight = "600";

        // Show Preview for images
        if (file.type.startsWith('image/')) {
            var reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewContainer.style.display = 'block';
            }
            reader.readAsDataURL(file);
        } else {
            previewContainer.style.display = 'none';
        }
    } else {
        label.textContent = "Upload Payment Receipt (PDF or Image, Max 10 MB)";
        label.style.color = "#777";
        label.style.fontWeight = "normal";
        previewContainer.style.display = 'none';
        previewImage.src = "";
    }
}

// Convert file to Base64
function toBase64(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            // Remove the "data:*/*;base64," prefix
            var result = reader.result.split(',')[1];
            resolve(result);
        };
        reader.onerror = function (error) {
            reject(error);
        };
    });
}

// Form Submission Handler
document.getElementById('regForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    var submitBtn = document.querySelector('.btn-submit');
    var originalBtnText = submitBtn.innerHTML;

    // 1. Collect Data
    var name = document.getElementById('fullName').value.trim();
    var email = document.getElementById('email').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var batch = document.getElementById('batch').value.trim();
    var typeInput = document.querySelector('input[name="regType"]:checked');
    var type = typeInput ? typeInput.value : null;
    var senderDetails = document.getElementById('senderDetails').value.trim();
    var cnicFileInput = document.getElementById('cnicFile');
    var cnicFile = cnicFileInput.files[0];
    var fileInput = document.getElementById('paymentProof');
    var file = fileInput.files[0];

    // Validation
    if (!file) {
        Swal.fire('Error', 'Please upload a payment receipt.', 'error');
        return;
    }

    if (!cnicFile) {
        Swal.fire('Error', 'Please upload your CNIC/Form-B/School Badge.', 'error');
        return;
    }

    if (!type) {
        Swal.fire('Error', 'Please select a category.', 'error');
        return;
    }

    // 2. Show Loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';

    Swal.fire({
        title: 'Registering...',
        html: '<p>Uploading your documents and generating ticket.</p><p style="font-size: 0.85rem; color: #888; margin-top: 10px;">This may take a moment...</p>',
        allowOutsideClick: false,
        didOpen: function () {
            Swal.showLoading();
        }
    });

    try {
        // 3. Convert Files to Base64
        var base64 = await toBase64(file);
        var cnicBase64 = await toBase64(cnicFile);

        // 4. Prepare Payload
        var payload = {
            name: name,
            email: email,
            phone: phone,
            batch: batch,
            type: type,
            senderDetails: senderDetails,
            file: base64,
            fileName: file.name,
            mimeType: file.type,
            cnicFile: cnicBase64,
            cnicFileName: cnicFile.name,
            cnicMimeType: cnicFile.type
        };

        // 5. Send to Google Apps Script
        var response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        var responseData = await response.json();

        if (responseData.result === 'success') {
            // 6. Success Handling
            Swal.fire({
                icon: 'success',
                title: 'Registration Confirmed!',
                text: 'Your ticket is ready. Please save or print it.',
                timer: 2500,
                showConfirmButton: false
            });

            // Generate the ticket
            generateTicket(name, type, responseData.id);

        } else {
            throw new Error(responseData.message || 'Unknown error occurred');
        }

    } catch (error) {
        console.error('Registration Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            html: '<p>' + error.message + '</p><p style="font-size: 0.85rem; color: #888; margin-top: 10px;">Please try again or contact support.</p>',
            confirmButtonColor: '#a8304e'
        });
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});

// Generate Ticket with QR Code
function generateTicket(name, type, id) {
    // Hide Form, Show Ticket
    document.getElementById('registration-view').style.display = 'none';
    document.getElementById('ticket-container').style.display = 'block';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fill Data
    document.getElementById('ticketName').textContent = name;
    document.getElementById('ticketType').textContent = type;
    document.getElementById('ticketID').textContent = id;

    // Generate QR Code
    var qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = ""; // Clear previous

    // Create verification URL that links to verify.html page
    var verificationUrl = VERIFY_PAGE_URL + '?id=' + encodeURIComponent(id);

    new QRCode(qrContainer, {
        text: verificationUrl,
        width: 150,
        height: 150,
        colorDark: "#a8304e",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    console.log('Ticket Generated Successfully!');
    console.log('Verification URL:', verificationUrl);
}

// Reset form for new registration
function resetForm() {
    document.getElementById('regForm').reset();
    document.getElementById('registration-view').style.display = 'block';
    document.getElementById('ticket-container').style.display = 'none';

    // Reset file labels
    document.getElementById('fileLabel').textContent = "Upload Payment Receipt (PDF or Image, Max 10 MB)";
    document.getElementById('fileLabel').style.color = "#777";
    document.getElementById('fileLabel').style.fontWeight = "normal";
    document.getElementById('cnicFileLabel').textContent = "Upload CNIC (PDF or Image, Max 10 MB)";
    document.getElementById('cnicFileLabel').style.color = "#777";
    document.getElementById('cnicFileLabel').style.fontWeight = "normal";

    // Hide previews
    document.getElementById('preview-container').style.display = 'none';
    document.getElementById('cnic-preview-container').style.display = 'none';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
