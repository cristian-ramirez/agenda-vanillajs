(function (document) {
    var date = new Date();

    var currentView = 'month';
    var days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    var buttonsView = document.querySelectorAll('.toggle__option');
    var eventTimeInputs = document.querySelectorAll('.event__time');
    var buttonsSave = document.getElementById('button__save');
    var eventDate = document.getElementById('eventDate');
    var eventTitle = document.getElementById('eventTitle');
    var calendar = document.getElementById('calendar__body');

    var setCurrentMonthLabel = function () {
        var currentMonth = document.getElementById('current-month');
        currentMonth.innerText = date.toLocaleString('en-us', { month: 'long', year: 'numeric' });
    }

    var getDaysOfMonth = function () {
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        return new Date(year, month, 0).getDate();
    }

    var getMonthData = function () {
        var year= date.getFullYear();
        var month = date.getMonth();
        var daysOfMonth = getDaysOfMonth(date);
        var firstDay = (new Date(year, month, 1)).getDay();
        var lastDay = (new Date(year, month + 1, 0)).getDay();
        var numWeeks = Math.ceil((firstDay + daysOfMonth) / 7);

        return {
            daysOfMonth: daysOfMonth,
            firstDay: firstDay,
            lastDay: lastDay,
            numWeeks: numWeeks
        }
    }

    var addEvent = function (ev) {
        var date = ev.target.dataset.date;

        buttonsSave.disabled = false;
        eventDate.value = date;
        eventTitle.disabled = false;
        eventTimeInputs.forEach(function (value) {
            value.disabled = false;
        });
    }

    var saveEvent = function () {
        console.log('button', eventTitle.value);
    }

    var renderMonth = function() {
        calendar.innerHTML = '';
        var data = getMonthData();
        var indexDay = 1;

        for(var indexWeek = 1; indexWeek <= data.numWeeks; indexWeek++) {
            var divWeek = document.createElement('div');
            divWeek.className = 'calendar__week';

            for(var i = 0; i < 7; i++) {
                var divDay = document.createElement('div');
                divDay.className = 'calendar__day day';

                if(i < data.firstDay && indexWeek === 1 || indexDay > data.daysOfMonth) {
                    divDay.className += ' disabled';
                } else {
                    divDay.onclick = addEvent;
                    divDay.dataset.date = indexDay.toString() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                    divDay.innerText = indexDay.toString();
                    indexDay++;
                }
                divWeek.appendChild(divDay);
            }

            calendar.appendChild(divWeek);
        }
    }

    var getRangeWeek = function () {
        var tmpDate = new Date();
        var today = date.getDay();

        var parseSunday = tmpDate.setDate(date.getDate() - today);
        var sunday = new Date(parseSunday);

        var parseSaturday = tmpDate.setDate(sunday.getDate() + 6);
        var saturday = new Date(parseSaturday);

        return {
            sunday: sunday,
            saturday: saturday,
        };
    }

    var renderWeek = function () {
        var range = getRangeWeek();
        var indexDay = range.sunday;
        var divWeek = document.createElement('div');

        calendar.innerHTML = '';
        divWeek.className = 'calendar__week week__view';

        var month = indexDay.getMonth();
        var day = indexDay.getDate();
        var year = indexDay.getFullYear();
        var nextDay = new Date(year, month, day);

        for(var i = 0; i < 7; i++) {
            var divDay = document.createElement('div');
            divDay.className = 'calendar__day day';

            if(nextDay.getMonth() !== date.getMonth()) {
                divDay.className += ' disabled';
            } else {
                divDay.onclick = addEvent;
                divDay.dataset.date = nextDay.getDate().toString() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                divDay.innerText = nextDay.getDate().toString();
            }

            nextDay.setDate(nextDay.getDate() + 1);
            divWeek.appendChild(divDay);
        }

        calendar.appendChild(divWeek);
    }

    var renderDay = function () {
        calendar.innerHTML = '';

        var divWeek = document.createElement('div');
        divWeek.className = 'calendar__week full day__view';

        var divDay = document.createElement('div');
        divDay.className = 'calendar__day day full';

        divDay.onclick = addEvent;
        divDay.dataset.date = date.getDate().toString() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

        divWeek.appendChild(divDay);

        calendar.appendChild(divWeek);
    }

    var toogleCalendar = function () {
        var render = {
            day: renderDay,
            week: renderWeek,
            month: renderMonth
        };
        render[currentView]();
    }

    var toogleHeader = function () {
        var header = document.getElementById('calendar__header');
        header.innerHTML = '';

        if(currentView === 'week' || currentView === 'month') {
            header.classList.remove('full');
            for(var i = 0; i < 7; i++) {
                var divDay = document.createElement('div');
                divDay.innerText = days[i];
                header.appendChild(divDay);
            }
        } else {
            var divDay = document.createElement('div');
            divDay.innerText = days[date.getDay()];
            header.classList.add('full');
            header.appendChild(divDay);
        }
    }

    var onClickView = function () {
        var view = this.dataset.view;
        if(view !== currentView) {
            buttonsView.forEach(function (button) {
                button.classList.remove('active');
            });

            this.classList.add('active');
            currentView = view;

            toogleCalendar();
            toogleHeader();
        }
    }

    var setEventButtons = function () {
        buttonsView.forEach(function (button) {
            button.addEventListener('click', onClickView);
        });

        buttonsSave.addEventListener('click', saveEvent)
    }

    var init = function () {
        setCurrentMonthLabel();
        setEventButtons();
        renderMonth();
    }

    init();
})(document);