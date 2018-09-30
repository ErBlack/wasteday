import './App';
import registerServiceWorker from './registerServiceWorker';

import './index.css';
import './terminal.css';
import './message.css';
import './Map';
import Countdown from './Countdown';
import Trigger from './Trigger';

const START = new Date(2018, 9, 13, 16);

new Countdown(document.querySelector('#timer'), START);

const terminals = Array.from(document.querySelectorAll('.terminal'));

document.querySelectorAll('.trigger').forEach((elem) => new Trigger(elem, () => {
    if (terminals.every((t) => t.classList.contains('hidden'))) {
        document.body.dispatchEvent(new CustomEvent('wasteday:start'));
    }
}));

document.body.addEventListener('wasteday:restart', () => terminals.forEach((t) => {
    t.classList.remove('hidden');
    t.classList.remove('hide');
}));

registerServiceWorker();
