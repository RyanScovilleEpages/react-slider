import React from 'react';
import ReactDOM from 'react-dom';
import './css/slider.css';
import Swipeable from 'react-swipeable';

class Slider extends React.Component {

  constructor(props) {
    super();
    this.onPrev = this.onPrev.bind(this);
    this.onNext = this.onNext.bind(this);
    this.concatToLazyLoadedArray = this.concatToLazyLoadedArray.bind(this);
    this.onSwiping = this.onSwiping.bind(this);
    this.onSwiped = this.onSwiped.bind(this);

    this.state = {
      activeIndex: props.data.initialActiveIndex,
      lazyLoadedArray: [props.data.initialActiveIndex - 1, props.data.initialActiveIndex, props.data.initialActiveIndex + 1],
      dX: 0,
      sliderWrapperWidth: 0,
      imagesLength: (props.data.images.length -1),
      sliding: false
    }
  }

  static get defaultProps() {
    return {
      images: [],
      slideInterval: 1500,
      showBullets: true,
      initialActiveIndex: 0,
      lazyLoadImages: 1
    }
  }

  componentDidMount() {
    // find the width of the swiper wrapper
    this.setState({sliderWrapperWidth: ReactDOM.findDOMNode(this.refs.sliderWrapper).offsetWidth})
  }

  onPrev() {
    let prevIndex = (this.state.activeIndex - 1 >= 0)
      ? this.state.activeIndex - 1
      : 0
    this.setState({
      dX: 0,
      activeIndex: prevIndex,
      lazyLoadedArray: this.concatToLazyLoadedArray(prevIndex),
      sliding: true
    })

  }

  onNext() {
    let nextIndex = (this.state.activeIndex + 1 <= this.state.imagesLength)
      ? this.state.activeIndex + 1
      : this.state.imagesLength
    this.setState({
      dX: 0,
      activeIndex: nextIndex,
      lazyLoadedArray: this.concatToLazyLoadedArray(nextIndex),
      sliding: true
    })
  }

  concatToLazyLoadedArray(index) {
    let lazyLoaded = this.state.lazyLoadedArray
    return (lazyLoaded.indexOf(index) === -1) ? lazyLoaded.concat(index) : lazyLoaded
  }

  onSwiping(e, dX, dY, absX, absY, v) {
    this.setState({sliding: false})
    // first slide, don't swipe left
    if (dX < 0 && this.state.activeIndex === 0) {
      this.setState({dX: 0})
      return true
    }

    // last slide, don't swipe right
    if (dX > 0 && this.state.activeIndex === this.state.imagesLength) {
      this.setState({dX: 0})
      return true
    }
    this.setState({dX})
  }

  onSwiped(e, x, y, isFlick) {
    // look for a swipe and then prev/next
    if (Math.abs(x) > this.state.sliderWrapperWidth * 0.5) {
      this.setState({dX: 0})
      x > 0 ? this.onNext() : this.onPrev()
      return true
    } else {
      // snap back to image
      this.setState({dX: 0, sliding: false})
    }
  }

  render() {
    const {data} = this.props
    return (
      <Swipeable className="slider-wrapper" onSwiping={this.onSwiping} onSwiped={this.onSwiped} ref="sliderWrapper">
        <div className="prev" onClick={() => this.onPrev()}>-</div>
        <div className="slider"
             style={{left: -((this.state.activeIndex * this.state.sliderWrapperWidth) + this.state.dX) + 'px',
             transition: 'left ' + (this.state.sliding ? data.slideInterval / 1000 + 's' : 0 + 's')}}>
          {data.images.map((image, index) =>
            <div className="slide" key={'image_'+index}>
              <div key={'slide_'+index}
                   className="slide-inner"
                   style={{backgroundImage: 'url(' + ((this.state.lazyLoadedArray.indexOf(index) === -1) ? '/src/img/spinner.gif' : image) + ')'}}
              />
            </div>
          )}
        </div>
        <div className="next" onClick={() => this.onNext()}>+</div>
      </Swipeable>
    )
  }
}

export default Slider;
