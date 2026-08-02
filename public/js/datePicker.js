// const Booking = require("/Users/MohdS/OneDrive/Desktop/Coding/BACKEND/MAJORPROJECT/models/booking.js");

document.addEventListener('DOMContentLoaded', async () => {
    // --- Element Selections ---
    const listingIdEl = document.getElementById("listing-id");
    if (!listingIdEl) return;
    const listingId = listingIdEl.value;
    const checkinField = document.getElementById('checkin-field');
    const checkoutField = document.getElementById('checkout-field');
    const datePickerModal = document.getElementById('date-picker-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const clearDatesBtn = document.getElementById('clear-dates-btn');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const calendar1El = document.getElementById('calendar-1');
    const calendar2El = document.getElementById('calendar-2');
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    const modalCheckinField = document.getElementById('modal-checkin-field');
    const modalCheckoutField = document.getElementById('modal-checkout-field');
    const modalCheckinDate = document.getElementById('modal-checkin-date');
    const modalCheckoutDate = document.getElementById('modal-checkout-date');

    const guestsPicker = document.getElementById('guests-picker');
    const guestSelectorDropdown = document.getElementById('guest-selector-dropdown');
    const guestsSummary = document.getElementById('guests-summary');
    const closeGuestsBtn = document.getElementById('close-guests-btn');
    const adultsCountEl = document.getElementById('adults-count');
    const childrenCountEl = document.getElementById('children-count');
    const infantsCountEl = document.getElementById('infants-count');
    const counterBtns = document.querySelectorAll('.counter-btn');
    const clearGuestsBtn = document.getElementById('clear-guests-btn');

    // --- State Variables ---
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let checkinDate = null;
    let checkoutDate = null;
    let guestCounts = { adults: 1, children: 0, infants: 0 };

    // --- Date Picker Logic ---
    const openModal = () => {
        datePickerModal.style.display = 'block';
        updateActiveDateField();
    };
    const closeModal = () => {
        datePickerModal.style.display = 'none';
    };
    checkinField.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal();
    });
    checkoutField.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal();
    });
    closeModalBtn.addEventListener('click', closeModal);

    let unavailableRanges = [];
    async function loadUnavailableDates(listingId){
        const response = await fetch(`/listings/${listingId}/bookings/unavailable`);
        const bookings = await response.json();
        unavailableRanges = bookings.map(b => ({
            start: new Date(b.checkIn),
            end: new Date(b.checkOut),
        }));
    };


    // CORRECTED: This function now has the right logic
    const updateActiveDateField = () => {
        if (!checkinDate) {
            // If no check-in date is selected, CHECK-IN is active.
            modalCheckinField.classList.add('active');
            modalCheckoutField.classList.remove('active');
        } else {
            // If a check-in date IS selected, CHECKOUT is active.
            modalCheckinField.classList.remove('active');
            modalCheckoutField.classList.add('active');
        }
    };

    const renderCalendar = (element, year, month) => {
        // console.log(Booking.find({$and: [{checkIn: {$gt: ISODate("2025-06-30")}}, {checkOut: {$lte: ISODate("2025-07-31")}}]}));
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const header = `<div class="calendar-header">${monthNames[month]} ${year}</div>`;
        const weekDays = `<div class="week-days">${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => `<div>${d}</div>`).join('')}</div>`;
        let daysGrid = '<div class="days-grid">';
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 0; i < firstDay; i++) {
            daysGrid += '<div class="day empty"></div>';
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDate = new Date(year, month, i);
            dayDate.setHours(0, 0, 0, 0); // normalize time

            let classes = 'day';

            const isPast = dayDate < today;
            const isCheckin = checkinDate && dayDate.getTime() === checkinDate.getTime();
            const isCheckout = checkoutDate && dayDate.getTime() === checkoutDate.getTime();
            const isInRange = checkinDate && checkoutDate && dayDate > checkinDate && dayDate < checkoutDate;

            const isUnavailable = unavailableRanges.some(range =>
                dayDate >= range.start && dayDate < range.end // checkout is exclusive
            );

            if (isPast || isUnavailable) classes += ' disabled';
            if (isCheckin) classes += ' selected range-start';
            if (isCheckout) classes += ' selected range-end';
            if (isInRange) classes += ' in-range';

            daysGrid += `<div class="${classes}" data-date="${dayDate.toISOString()}">${i}</div>`;
        }

        daysGrid += '</div>';
        element.innerHTML = header + weekDays + daysGrid;
    };

    const renderCalendars = () => {
        renderCalendar(calendar1El, currentYear, currentMonth);
        let nextMonth = currentMonth + 1;
        let nextYear = currentYear;
        if (nextMonth > 11) {
            nextMonth = 0;
            nextYear++;
        }
        renderCalendar(calendar2El, nextYear, nextMonth);
    };

    const handleDateClick = (e) => {
        if (!e.target.classList.contains('day') || e.target.classList.contains('disabled') || e.target.classList.contains('empty')) return;
        const selectedDate = new Date(e.target.dataset.date);
        if (!checkinDate || (checkinDate && checkoutDate)) {
            checkinDate = selectedDate;
            checkoutDate = null;
        } else if (selectedDate > checkinDate) {
            checkoutDate = selectedDate;
        } else {
            checkinDate = selectedDate;
            checkoutDate = null;
        }
        updateInputs();
        renderCalendars();
        updateActiveDateField();
    };

    const updateInputs = () => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        // Added year
        if (checkinDate) {
            const formatted = checkinDate.toLocaleDateString('en-US', options);
            checkinInput.value = formatted;
            modalCheckinDate.textContent = formatted;
        } else {
            checkinInput.value = 'Add date';
            modalCheckinDate.textContent = 'Add date';
        }
        if (checkoutDate) {
            const formatted = checkoutDate.toLocaleDateString('en-US', options);
            checkoutInput.value = formatted;
            modalCheckoutDate.textContent = formatted;
        } else {
            checkoutInput.value = 'Add date';
            modalCheckoutDate.textContent = 'Add date';
        }
    };


    clearDatesBtn.addEventListener('click', () => {
        checkinDate = null;
        checkoutDate = null;
        updateInputs();
        renderCalendars();
        updateActiveDateField();
    });

    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendars();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendars();
    });

    calendar1El.addEventListener('click', handleDateClick);
    calendar2El.addEventListener('click', handleDateClick);

    // --- Guest Selector Logic ---
    let maxGuests;
    async function getMaxGuests(listingId){
        const response = await fetch(`/listings/${listingId}/getMaxGuests`);
        const data = await response.json();
        maxGuests = data.maxGuests;
    }

    const openGuestsDropdown = () => {
        guestSelectorDropdown.style.display = 'flex';
        guestsPicker.classList.add('active');
    };
    const closeGuestsDropdown = () => {
        guestSelectorDropdown.style.display = 'none';
        guestsPicker.classList.remove('active');
    };
    guestsPicker.addEventListener('click', (e) => {
        e.stopPropagation();
        if (guestSelectorDropdown.style.display === 'none') {
            openGuestsDropdown();
        } else {
            closeGuestsDropdown();
        }
    });
    closeGuestsBtn.addEventListener('click', closeGuestsDropdown);
    document.addEventListener('click', (e) => {
        if (!guestsPicker.contains(e.target) && !guestSelectorDropdown.contains(e.target)) {
            closeGuestsDropdown();
        }
    });
    document.addEventListener('click', (e) => {
        if(datePickerModal.style.display === 'block' && !datePickerModal.contains(e.target)){
            closeModal();
        }
    });
    datePickerModal.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    const updateGuestUI = () => {
        const totalGuests = guestCounts.adults + guestCounts.children;
        const infantText = guestCounts.infants > 0 ? `, ${guestCounts.infants} infant${guestCounts.infants > 1 ? 's' : ''}` : '';
        guestsSummary.textContent = `${totalGuests} guest${totalGuests > 1 ? 's' : ''}${infantText}`;
        adultsCountEl.textContent = guestCounts.adults;
        childrenCountEl.textContent = guestCounts.children;
        infantsCountEl.textContent = guestCounts.infants;
        document.querySelector(`[data-type="adults"][data-action="decrease"]`).disabled = guestCounts.adults <= 1;
        document.querySelector(`[data-type="adults"][data-action="increase"]`).disabled = guestCounts.adults >= maxGuests;
        document.querySelector(`[data-type="children"][data-action="decrease"]`).disabled = guestCounts.children <= 0;
        document.querySelector(`[data-type="infants"][data-action="decrease"]`).disabled = guestCounts.infants <= 0;

        document.getElementById("guests").value = totalGuests;
    };

    counterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            const action = btn.dataset.action;
            if (action === 'increase') {
                guestCounts[type]++;
            } else if (action === 'decrease') {
                guestCounts[type]--;
            }
            updateGuestUI();
        });
    });

    clearGuestsBtn.addEventListener('click', () => {
        guestCounts = { adults: 1, children: 0, infants: 0 };
        updateGuestUI();
    });

    // --- Initial Renders on Page Load ---
    await getMaxGuests(listingId);
    await loadUnavailableDates(listingId);
    renderCalendars();
    updateActiveDateField();
    updateGuestUI();
});