import React from 'react';
import './css/slider.css';

class Slider extends React.Component {

  constructor(props) {
    super();
    this.onPrev = this.onPrev.bind(this);
    this.onNext = this.onNext.bind(this);

    this.state = {
      activeIndex: props.data.initialActiveIndex
    }
  }

  static get propTypes() {
    return {}
  }

  static get defaultProps() {
    return {
      images: [],
      slideInterval: 2500,
      showBullets: true,
      initialActiveIndex: 0
    }
  }

  onPrev() {
    let prevIndex = (this.state.activeIndex - 1 >= 0) ? this.state.activeIndex - 1 : 0
    this.setState({
      activeIndex: prevIndex
    })
  }

  onNext() {
    let nextIndex = (this.state.activeIndex + 1 <= this.props.data.images.length - 1)
      ? this.state.activeIndex + 1
      : this.props.data.images.length -1
    this.setState({
      activeIndex: nextIndex
    })
  }

  render() {
    const {data} = this.props
    return (
      <div className="slider-wrapper">
        <div className="prev" onClick={() => this.onPrev()}>-</div>
        <div className="slider" style={{left: -(this.state.activeIndex * 100) + '%'}}>
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
