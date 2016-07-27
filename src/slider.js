import React from 'react';
import './css/slider.css';

class Slider extends React.Component {

  constructor(props) {
    super();
    this.onPrev = this.onPrev.bind(this);
    this.onNext = this.onNext.bind(this);

    this.state = {
      activeIndex: '-200%'
    }
  }

  static get propTypes() {
    return {}
  }

  static get defaultProps() {
    return {
      data: {
        images: [],
        slideInterval: 2500,
        showBullets: true,
        activeIndex: 0
      }
    };
  }

  onPrev() {
    console.log('prev')
  }

  onNext() {
    console.log('next')
  }

  render() {
    const {data} = this.props;
    return (
      <div className="slider-wrapper">
        <div className="prev" onClick={() => this.onPrev()}>-</div>
        <div className="slider" style={{left: this.state.activeIndex}}>
          {data.images.map((image, index) =>
            <div className="slide" key={'image_'+index}>
              <div ref={'slide_'+index} key={'slide_'+index} className="slide-inner" style={{backgroundImage: 'url('+image+')'}}/>
            </div>
          )}
        </div>
        <div className="next" onClick={() => this.onNext()}>+</div>
      </div>
    )
  }
}

export default Slider;
