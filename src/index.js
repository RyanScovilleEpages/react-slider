import React from 'react';
import ReactDOM from 'react-dom';
import Slider from './slider';
import './index.css';

const slideData = {
  images:
    ['/src/img/01.jpg',
    '/src/img/02.jpg',
    '/src/img/03.jpg',
    '/src/img/04.png',
    '/src/img/05.jpg'],
  initialActiveIndex: 2,
  slideInterval: 1000,
  showBullets: true,
  autoplay: true,
  autoplayDelay: 5000,
  looping: true
}

ReactDOM.render(
    <Slider data={slideData} />,
  document.getElementById('root')
);

