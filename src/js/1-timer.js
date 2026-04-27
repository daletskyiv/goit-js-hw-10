import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  startTimerBtn: document.querySelector('[data-start]'),
  dateSelectionField: document.querySelector('#datetime-picker'),
  timerDays: document.querySelector('[data-days]'),
  timerHours: document.querySelector('[data-hours]'),
  timerMinutes: document.querySelector('[data-minutes]'),
  timerSeconds: document.querySelector('[data-seconds]'),
};

refs.startTimerBtn.disabled = true;

let userSelectedDate = null;
let intervalId = null;

const options = flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (Date.now() >= userSelectedDate.getTime()) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      refs.startTimerBtn.disabled = true;
      return;
    }
    refs.startTimerBtn.disabled = false;
  },
});

function startTimer() {
  refs.startTimerBtn.disabled = true;
  refs.dateSelectionField.disabled = true;
  intervalId = setInterval(() => {
    const diff = userSelectedDate - Date.now();

    if (diff <= 0) {
      stopTimer();
      refs.dateSelectionField.disabled = false;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(diff);

    refs.timerDays.textContent = addLeadingZero(days);
    refs.timerHours.textContent = addLeadingZero(hours);
    refs.timerMinutes.textContent = addLeadingZero(minutes);
    refs.timerSeconds.textContent = addLeadingZero(seconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(intervalId);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, 0);
}

refs.startTimerBtn.addEventListener('click', startTimer);
