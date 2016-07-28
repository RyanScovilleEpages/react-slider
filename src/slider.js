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

    this.state = {
      activeIndex: props.data.initialActiveIndex,
      lazyLoadedArray: [props.data.initialActiveIndex - 1, props.data.initialActiveIndex, props.data.initialActiveIndex + 1],
      dX: 0,
      sliderWrapperWidth: 0,
      imagesLength: (props.data.images.length -1)
    }
  }

  static get defaultProps() {
    return {
      images: [],
      slideInterval: 2500,
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
    console.log('*********PREV')
    let prevIndex = (this.state.activeIndex - 1 >= 0)
      ? this.state.activeIndex - 1
      : 0
    this.setState({
      activeIndex: prevIndex,
      lazyLoadedArray: this.concatToLazyLoadedArray(prevIndex)
    })
  }

  onNext() {
    console.log('*********NEXT')
    let nextIndex = (this.state.activeIndex + 1 <= this.state.imagesLength)
      ? this.state.activeIndex + 1
      : this.state.imagesLength
    this.setState({
      activeIndex: nextIndex,
      lazyLoadedArray: this.concatToLazyLoadedArray(nextIndex)
    })
  }

  concatToLazyLoadedArray(index) {
    let lazyLoaded = this.state.lazyLoadedArray
    return (lazyLoaded.indexOf(index) === -1) ? lazyLoaded.concat(index) : lazyLoaded
  }

  onSwiping(e, dX, dY, absX, absY, v) {
    console.log(this.state.dX)
    // first slide, don't swipe left
    if (dX < 0 && this.state.activeIndex === 0) {
      this.setState({dX: 0})
      console.log('firstSlide')
      return true
    }

    // last slide, don't swipe right
    if (dX > 0 && this.state.activeIndex === this.state.imagesLength) {
      this.setState({dX: 0})
      console.log('lastSlide')
      return true
    }

    // look for a swipe and then prev/next
    if (absX > this.state.sliderWrapperWidth * 0.5) {
      this.setState({dX: 0})
      dX > 0 ? this.onNext() : this.onPrev()
      return true
    }

    this.setState({dX})
  }

  render() {
    const {data} = this.props
    return (
      <Swipeable className="slider-wrapper" onSwiping={this.onSwiping} ref="sliderWrapper">
        <div className="prev" onClick={() => this.onPrev()}>-</div>
        <div className="slider" style={{left: -((this.state.activeIndex * this.state.sliderWrapperWidth) + this.state.dX) + 'px'}}>
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

// <div ref={'slide_'+index} key={'slide_'+index} className="slide-inner" style={{backgroundImage: 'url('+image+')'}}/>


export default Slider;
