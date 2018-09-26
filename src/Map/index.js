import './map.css';

const point = [
    59.861254,
    30.453476
];

const center = [
    59.862744,
    30.459965
];

/* global ymaps:true */
ymaps.ready(function() {
    var map = new ymaps.Map('map', {
        center,
        zoom: 14,
        controls: ['zoomControl']
    });
    map.geoObjects.add(new ymaps.GeoObject({
        geometry: {
            type: 'Point',
            coordinates: point
        },
        properties: {
            iconContent: 'Вам сюда',
            hintContent: 'Начало в 16:00'
        }
    }, {preset: 'islands#redStretchyIcon'})
    );
});