// Get ticket ID from URL parameter
var urlParams = new URLSearchParams(window.location.search);
var ticketId = urlParams.get('id');

// Configuration - REPLACE WITH YOUR WEB APP URL
var VERIFY_URL = 'https://script.google.com/macros/s/AKfycbwLk24SbUvu4zqRD5gFpJdMw-CCDvsn-HXfNpcMFXXOOTGK-ynHBOKSgffK7v-aQtedYw/exec';

if (!ticketId) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('no-id-state').style.display = 'block';
} else {
    verifyTicket(ticketId);
}

async function verifyTicket(id) {
    try {
        var response = await fetch(VERIFY_URL + '?action=verify&id=' + encodeURIComponent(id));
        var data = await response.json();

        if (data.result === 'success' && data.ticket) {
            showTicketInfo(data.ticket);
        } else {
            showError('Ticket Not Found', data.message || 'This ticket does not exist in our records.');
        }
    } catch (error) {
        console.error('Verification Error:', error);
        showError('Verification Failed', 'Unable to verify ticket. Please check your internet connection and try again.');
    }
}

function showTicketInfo(ticket) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('ticket-info').style.display = 'block';
    document.getElementById('actions').style.display = 'flex';

    // Fill in ticket data
    document.getElementById('ticket-id').textContent = ticket.id;
    document.getElementById('attendee-name').textContent = ticket.name;
    document.getElementById('category').textContent = ticket.category;
    document.getElementById('email').textContent = ticket.email;
    document.getElementById('phone').textContent = ticket.phone;
    document.getElementById('registration-date').textContent = ticket.registrationDate;

    // Set status
    var statusBadge = document.getElementById('status-badge');
    var statusText = document.getElementById('status-text');
    var admitBtn = document.getElementById('admit-btn');

    if (ticket.status === 'used') {
        statusBadge.className = 'status-badge used';
        statusText.textContent = 'Already Used';
        admitBtn.disabled = true;
        admitBtn.innerHTML = '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg> Already Admitted';
    } else {
        statusBadge.className = 'status-badge valid';
        statusText.textContent = 'Valid Ticket';
    }
}

function showError(title, message) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error-state').style.display = 'block';
    document.getElementById('error-title').textContent = title;
    document.getElementById('error-message').textContent = message;

    // Show scan another button
    document.getElementById('actions').style.display = 'flex';
    document.getElementById('admit-btn').style.display = 'none';
}

async function admitAttendee() {
    var admitBtn = document.getElementById('admit-btn');
    admitBtn.disabled = true;
    admitBtn.innerHTML = '<span style="display:inline-block;width:20px;height:20px;border:3px solid rgba(255,255,255,0.3);border-radius:50%;border-top-color:white;animation:spin 0.8s linear infinite;"></span> Processing...';

    try {
        var response = await fetch(VERIFY_URL + '?action=admit&id=' + encodeURIComponent(ticketId));
        var data = await response.json();

        if (data.result === 'success') {
            // Success!
            admitBtn.innerHTML = '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg> Entry Recorded!';
            admitBtn.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';

            // Update status badge
            var statusBadge = document.getElementById('status-badge');
            var statusText = document.getElementById('status-text');
            statusBadge.className = 'status-badge admitted';
            statusText.textContent = 'Admitted';

            // Celebrate!
            celebrate();

            // Auto reload after 4 seconds
            setTimeout(function () {
                location.reload();
            }, 4000);
        } else {
            alert('Failed to record entry: ' + data.message);
            admitBtn.disabled = false;
            admitBtn.innerHTML = '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg> Admit Entry';
        }
    } catch (error) {
        console.error('Admit Error:', error);
        alert('Error recording entry. Please try again.');
        admitBtn.disabled = false;
        admitBtn.innerHTML = '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg> Admit Entry';
    }
}

function celebrate() {
    var colors = ['#a8304e', '#d4b578', '#5a7ba6', '#10b981', '#f59e0b', '#8b5cf6'];
    var celebration = document.getElementById('celebration');

    for (var i = 0; i < 50; i++) {
        var confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.width = (Math.random() * 10 + 5) + 'px';
        confetti.style.height = (Math.random() * 10 + 5) + 'px';
        celebration.appendChild(confetti);

        // Remove after animation
        setTimeout(function () {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 3000);
    }
}
