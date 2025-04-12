document.addEventListener('DOMContentLoaded', function() {
    // Initialize calendar
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        selectable: true,
        select: function(info) {
            const selectedDate = info.startStr;
            document.getElementById('eventDate').value = selectedDate;
            
            // Check if date is available
            if (isDateBooked(selectedDate)) {
                alert('This date is already booked. Please select another date.');
                return;
            }
        },
        eventClick: function(info) {
            showEventDetails(info.event.id);
        },
        events: getBookedEvents()
    });
    calendar.render();

    // Form validation and submission
    const bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                eventType: document.getElementById('eventType').value,
                attendees: document.getElementById('attendees').value,
                date: document.getElementById('eventDate').value
            };

            // Simulate form submission
            submitBooking(formData);
        }
    });

    // Form validation function
    function validateForm() {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[\d\s-]{10,}$/;

        // Validate name
        const name = document.getElementById('name');
        if (!name.value.trim()) {
            showError(name, 'Name is required');
            isValid = false;
        } else {
            removeError(name);
        }

        // Validate email
        const email = document.getElementById('email');
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        } else {
            removeError(email);
        }

        // Validate phone
        const phone = document.getElementById('phone');
        if (!phone.value.trim()) {
            showError(phone, 'Phone number is required');
            isValid = false;
        } else if (!phoneRegex.test(phone.value)) {
            showError(phone, 'Please enter a valid phone number');
            isValid = false;
        } else {
            removeError(phone);
        }

        // Validate event type
        const eventType = document.getElementById('eventType');
        if (!eventType.value) {
            showError(eventType, 'Please select an event type');
            isValid = false;
        } else {
            removeError(eventType);
        }

        // Validate attendees
        const attendees = document.getElementById('attendees');
        if (!attendees.value || attendees.value < 1) {
            showError(attendees, 'Please enter a valid number of attendees');
            isValid = false;
        } else {
            removeError(attendees);
        }

        // Validate date
        const eventDate = document.getElementById('eventDate');
        if (!eventDate.value) {
            showError(eventDate, 'Please select a date');
            isValid = false;
        } else if (isDateBooked(eventDate.value)) {
            showError(eventDate, 'This date is already booked');
            isValid = false;
        } else {
            removeError(eventDate);
        }

        return isValid;
    }

    // Helper functions for form validation
    function showError(element, message) {
        element.classList.add('is-invalid');
        let feedback = element.nextElementSibling;
        if (!feedback || !feedback.classList.contains('invalid-feedback')) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            element.parentNode.insertBefore(feedback, element.nextSibling);
        }
        feedback.textContent = message;
    }

    function removeError(element) {
        element.classList.remove('is-invalid');
        const feedback = element.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.remove();
        }
    }

    // Get booked events (simulated data)
    function getBookedEvents() {
        return [
            {
                id: 'event-1',
                title: 'Conference',
                start: '2024-04-15',
                allDay: true
            },
            {
                id: 'event-2',
                title: 'Wedding',
                start: '2024-04-20',
                allDay: true
            }
        ];
    }

    // Simulate form submission
    function submitBooking(formData) {
        // In a real application, this would be an API call
        console.log('Booking submitted:', formData);
        
        // Add the event to the calendar with a unique ID
        const eventId = 'event-' + Date.now();
        const newEvent = {
            id: eventId,
            title: formData.eventType,
            start: formData.date,
            allDay: true,
            extendedProps: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                attendees: formData.attendees
            }
        };
        
        calendar.addEvent(newEvent);

        // Update the event list
        updateEventList();

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success';
        successMessage.textContent = 'Booking successful! We will contact you shortly.';
        bookingForm.appendChild(successMessage);
        successMessage.style.display = 'block';

        // Reset form
        bookingForm.reset();
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    // Check if a date is already booked
    function isDateBooked(date) {
        const events = calendar.getEvents();
        return events.some(event => event.startStr === date);
    }

    // Update the event list
    function updateEventList() {
        const eventList = document.getElementById('eventList');
        eventList.innerHTML = '';
        
        const events = calendar.getEvents();
        
        if (events.length === 0) {
            eventList.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-calendar-event"></i>
                    <div>
                        <h4>No Events Scheduled</h4>
                        <p class="mb-0">Be the first to book an event! Select a date from the calendar to get started.</p>
                    </div>
                </div>
            `;
            return;
        }

        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <div class="event-header">
                    <h3 class="event-title">${event.title}</h3>
                    <span class="event-date">
                        <i class="bi bi-calendar"></i>
                        ${new Date(event.start).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>
                <div class="event-details">
                    <div class="detail-item">
                        <i class="bi bi-clock"></i>
                        <span>All Day Event</span>
                    </div>
                    <div class="detail-item">
                        <i class="bi bi-people"></i>
                        <span>Open for Booking</span>
                    </div>
                    <div class="detail-item">
                        <i class="bi bi-info-circle"></i>
                        <span>${getEventDescription(event.title)}</span>
                    </div>
                </div>
                <div class="event-actions">
                    <button class="btn btn-outline-primary" onclick="window.showEventDetails('${event.id}')">
                        <i class="bi bi-info-circle"></i> Details
                    </button>
                    <button class="btn btn-primary" onclick="window.bookThisEvent('${event.id}')">
                        <i class="bi bi-calendar-plus"></i> Book Now
                    </button>
                </div>
            `;
            eventList.appendChild(eventCard);
        });
    }

    // Initialize the event list when the page loads
    updateEventList();

    // Helper function to get event description
    function getEventDescription(eventType) {
        const descriptions = {
            'wedding': 'Perfect for your special day with full venue decoration',
            'birthday': 'Celebrate in style with our party packages',
            'conference': 'Professional setup with AV equipment included',
            'meeting': 'Business meeting facilities with refreshments'
        };
        return descriptions[eventType.toLowerCase()] || 'Custom event package available';
    }

    // Show event details in a modal
    function showEventDetails(eventId) {
        const event = calendar.getEventById(eventId);
        if (!event) return;

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'eventModal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${event.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="event-detail-item">
                            <i class="bi bi-calendar"></i>
                            <strong>Date:</strong>
                            ${new Date(event.start).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                        <div class="event-detail-item">
                            <i class="bi bi-clock"></i>
                            <strong>Time:</strong> All Day Event
                        </div>
                        <div class="event-detail-item">
                            <i class="bi bi-person"></i>
                            <strong>Booked By:</strong> ${event.extendedProps.name || 'Not specified'}
                        </div>
                        <div class="event-detail-item">
                            <i class="bi bi-envelope"></i>
                            <strong>Email:</strong> ${event.extendedProps.email || 'Not specified'}
                        </div>
                        <div class="event-detail-item">
                            <i class="bi bi-telephone"></i>
                            <strong>Contact:</strong> ${event.extendedProps.phone || 'Not specified'}
                        </div>
                        <div class="event-detail-item">
                            <i class="bi bi-people"></i>
                            <strong>Attendees:</strong> ${event.extendedProps.attendees || 'Not specified'}
                        </div>
                        <div class="event-detail-item">
                            <i class="bi bi-info-circle"></i>
                            <strong>Description:</strong> ${getEventDescription(event.title)}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="window.bookThisEvent('${event.id}')">Book Now</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
        
        // Remove modal from DOM after it's hidden
        modal.addEventListener('hidden.bs.modal', function () {
            modal.remove();
        });
    }

    // Function to handle booking from event card
    function bookThisEvent(eventId) {
        const event = calendar.getEventById(eventId);
        if (event) {
            document.getElementById('eventDate').value = event.startStr;
            document.getElementById('eventType').value = event.title.toLowerCase();
            // Scroll to the booking form
            document.getElementById('bookingForm').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Make functions available globally
    window.showEventDetails = showEventDetails;
    window.bookThisEvent = bookThisEvent;
}); 