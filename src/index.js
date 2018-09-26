import './App';
import registerServiceWorker from './registerServiceWorker';

import './index.css';
import './links.css';
import './terminal.css';
import './message.css';
import './Map';
import Countdown from './Countdown';

const START = new Date(2018, 9, 13, 16);

new Countdown(document.querySelector('#timer'), START);

registerServiceWorker();
