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
        events: getBookedEvents(),
        eventDidMount: function(info) {
            const eventType = info.event.extendedProps.eventType?.toLowerCase();
            if (eventType) {
                info.el.classList.add(`fc-event-${eventType}`);
            }
        },
        dayCellClassNames: function(arg) {
            const dateStr = arg.date.toISOString().split('T')[0];
            if (isDateBooked(dateStr)) {
                return ['booked-date'];
            } else {
                return ['available-date'];
            }
        }
    });
    calendar.render();

    // Add CSS classes for date highlighting
    const style = document.createElement('style');
    style.textContent = `
        .booked-date {
            background-color: #ffebee !important;
            color: #c62828 !important;
        }
        .available-date {
            background-color: #e8f5e9 !important;
            color: #2e7d32 !important;
        }
        .booked-date:hover {
            background-color: #ffcdd2 !important;
        }
        .available-date:hover {
            background-color: #c8e6c9 !important;
        }
        
        /* Event type specific colors */
        .fc-event-wedding {
            background-color: #ff80ab !important;
            border-color: #ff80ab !important;
        }
        .fc-event-birthday {
            background-color: #81d4fa !important;
            border-color: #81d4fa !important;
        }
        .fc-event-conference {
            background-color: #a5d6a7 !important;
            border-color: #a5d6a7 !important;
        }
        .fc-event-meeting {
            background-color: #b39ddb !important;
            border-color: #b39ddb !important;
        }
        .fc-event {
            color: white !important;
            font-weight: bold !important;
        }
    `;
    document.head.appendChild(style);

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
                date: document.getElementById('eventDate').value,
                location: document.getElementById('location').value
            };

            // Show summary modal before submission
            showSummaryModal(formData);
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

        // Validate location
        const location = document.getElementById('location');
        if (!location.value.trim()) {
            showError(location, 'Location is required');
            isValid = false;
        } else {
            removeError(location);
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

    // Function to get color based on event type
    function getEventColor(eventType) {
        const colors = {
            'wedding': '#ff80ab',
            'birthday': '#81d4fa',
            'conference': '#a5d6a7',
            'meeting': '#b39ddb'
        };
        return colors[eventType.toLowerCase()] || '#78909c';
    }

    // Get booked events (simulated data)
    function getBookedEvents() {
        return [
           
        ];
    }

    // Function to show booking summary modal
    function showSummaryModal(formData) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'summaryModal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Booking Summary</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="summary-item">
                            <strong>Name:</strong> ${formData.name}
                        </div>
                        <div class="summary-item">
                            <strong>Email:</strong> ${formData.email}
                        </div>
                        <div class="summary-item">
                            <strong>Phone:</strong> ${formData.phone}
                        </div>
                        <div class="summary-item">
                            <strong>Event Type:</strong> ${formData.eventType}
                        </div>
                        <div class="summary-item">
                            <strong>Number of Attendees:</strong> ${formData.attendees}
                        </div>
                        <div class="summary-item">
                            <strong>Location:</strong> ${formData.location}
                        </div>
                        <div class="summary-item">
                            <strong>Date:</strong> ${new Date(formData.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Edit</button>
                        <button type="button" class="btn btn-primary" id="confirmBookingBtn">Confirm Booking</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();

        // Add event listener for the confirm button
        const confirmBtn = modal.querySelector('#confirmBookingBtn');
        confirmBtn.addEventListener('click', function() {
            submitBooking(formData);
        });
        
        // Remove modal from DOM after it's hidden
        modal.addEventListener('hidden.bs.modal', function () {
            modal.remove();
        });
    }

    // Simulate form submission
    function submitBooking(formData) {
        // Close the summary modal
        const modal = document.getElementById('summaryModal');
        if (modal) {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        }
        
        // In a real application, this would be an API call
        console.log('Booking submitted:', formData);
        
        // Add the event to the calendar with a unique ID
        const eventId = 'event-' + Date.now();
        const newEvent = {
            id: eventId,
            title: formData.eventType.charAt(0).toUpperCase() + formData.eventType.slice(1),
            start: formData.date,
            allDay: true,
            extendedProps: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                attendees: formData.attendees,
                eventType: formData.eventType.toLowerCase(),
                location: formData.location
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
                        <i class="bi bi-person"></i>
                        <span>${event.extendedProps.name || 'Not specified'}</span>
                    </div>
                    <div class="detail-item">
                        <i class="bi bi-people"></i>
                        <span>${event.extendedProps.attendees || 'Not specified'} attendees</span>
                    </div>
                </div>
                <div class="event-actions">
                    <button class="btn btn-outline-primary" onclick="window.showEventDetails('${event.id}')">
                        <i class="bi bi-info-circle"></i> Details
                    </button>
                   
                </div>
            `;
            eventList.appendChild(eventCard);
        });
    }

    // Initialize the event list when the page loads
    updateEventList();

    // Helper function to get event description
  
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
                            <i class="bi bi-geo-alt"></i>
                            <strong>Location:</strong> ${event.extendedProps.location || 'Not specified'}
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