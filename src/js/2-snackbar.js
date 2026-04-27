import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  generatorForm: document.querySelector('.form'),
};

refs.generatorForm.addEventListener('submit', onPromiseGeneratorSubmit);

function onPromiseGeneratorSubmit(event) {
  event.preventDefault();

  const delay = event.target.elements.delay.value;
  const value = event.target.elements.state.value;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then(delay => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(delay => {
      iziToast.error({
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
      });
    });

  refs.generatorForm.reset();
}
