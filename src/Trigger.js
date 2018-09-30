import './Trigger.css';

export default class Trigger {
    constructor(elem, cb) {
        this.elem = elem;
        this.parent = elem.parentElement

        const subscribe = ()=> {
            elem.parentElement.classList.add('hide');

            this.timeout = setTimeout(() => {
                elem.parentElement.classList.add('hidden');
                cb();
            }, 5000);
        }

        const unsubscribe = () => {
            clearTimeout(this.timeout);
            
            elem.parentElement.classList.remove('hide');
        }

        this.elem.addEventListener('mousedown', subscribe);

        this.elem.addEventListener('mouseup', unsubscribe);
        this.elem.addEventListener('mouseout', unsubscribe);
    }
}