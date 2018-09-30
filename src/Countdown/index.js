const INTERVALS = [1000, 60, 60, 24, 7];


function d2(v) {
    return ('0' + v).substr(-2);
}


function plural(n, f) {n %= 100; if (n > 10 && n < 20) return f[2]; n %= 10; return f[n > 1 && n < 5 ? 1 : n === 1 ? 0 : 2]}

export default class Countdown {
    constructor(elem, start) {
        this._iterate = this._iterate.bind(this);
        this._start = start;
        this._elem = elem;

        this._iterate();
    }

    render() {
        const {
            direction,
            weeks,
            days,
            hours,
            minutes,
            seconds
        } = this._offset();


        if (direction === 1) {
            const result = ['Через'];

            if (weeks) {
                result.push(weeks + ' ' + plural(weeks, ['неделю', 'недели', 'недель']));
            }
            if (days) {
                result.push(days + ' ' + plural(days, ['день', 'дня', 'дней']));
            }

            return `${result.join(' ')} ${d2(hours)}ч ${d2(minutes)}м ${d2(seconds)}с`;
        } else {
            return 'Времени не осталось';
        }
    }

    /**
     * Выполняет проверку дат и выводит оставшееся время
     */
    _iterate() {
        this._elem.innerHTML = this.render();

        if (this._offset().direction !== 1) {
            return;
        }

        this._timeout = setTimeout(this._iterate, 1000);
    }

    /**
     * Вычисляет расстояние между датами
     * @param {Date} [from]
     * @returns {Object}
     */
    _offset(from) {
        from = from || new Date();

        let offset = (this._start - from);
        let direction = offset > 0 ? 1 : offset < 0 ? -1 : 0;

        offset = Math.abs(offset);

        let result = INTERVALS.map(function(value) {
            var result = offset % value;

            offset = (offset - result) / value;

            return result;
        });

        return {
            milliseconds: result[0],
            seconds: result[1],
            minutes: result[2],
            hours: result[3],
            days: result[4],
            weeks: offset,
            direction: direction
        };
    }
}