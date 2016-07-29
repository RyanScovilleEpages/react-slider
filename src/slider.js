import React from 'react';
import ReactDOM from 'react-dom';
import './css/slider.css';
import Swipeable from 'react-swipeable';
import TimerMixin from 'react-timer-mixin';

class Slider extends React.Component {

  constructor(props) {
    super();
    this.onPrev = this.onPrev.bind(this);
    this.onNext = this.onNext.bind(this);
    this.concatToLazyLoadedArray = this.concatToLazyLoadedArray.bind(this);
    this.handleSwiping = this.handleSwiping.bind(this);
    this.handleSwiped = this.handleSwiped.bind(this);
    this.updateActiveIndex = this.updateActiveIndex.bind(this);
    this.updateSliderWidth = this.updateSliderWidth.bind(this);

    this.state = {
      activeIndex: props.data.initialActiveIndex,
      lazyLoadedArray: [props.data.initialActiveIndex - 1, props.data.initialActiveIndex, props.data.initialActiveIndex + 1],
      dX: 0,
      sliderWrapperWidth: window.innerWidth,
      imagesLength: (props.data.images.length -1),
      sliding: false,
      autoplay: props.data.autoplay,
      autoplayDelay: props.data.autoplayDelay,
      dragging: false
    }
  }

  static get defaultProps() {
    return {
      images: [],
      slideInterval: 1500,
      showBullets: true,
      initialActiveIndex: 0,
      lazyLoadImages: 1,
      autoplay: true,
      autoplayDelay: 5000
    }
  }

  componentDidMount() {
    // find the width of the swiper wrapper
    this.setState({sliderWrapperWidth: ReactDOM.findDOMNode(this.refs.sliderWrapper).offsetWidth})
    window.addEventListener('resize', this.updateSliderWidth)
    this.autoplay()
  }

  autoplay() {
    TimerMixin.setTimeout(
      () => { if (!this.state.dragging) { this.onNext(); this.autoplay() }},
      this.state.autoplayDelay
    );
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSliderWidth);
  }

  updateSliderWidth() {
    this.setState({sliderWrapperWidth: window.innerWidth})
  }

  onPrev() {
    let prevIndex = (this.state.activeIndex - 1 >= 0)
      ? this.state.activeIndex - 1
      : this.state.imagesLength
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
      : 0
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

  handleSwiping(e, dX, dY, absX, absY, v) {
    this.setState({sliding: false, dragging: true})
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

  handleSwiped(e, x, y, isFlick) { /*eslint no-unused-expressions: [2, { allowTernary: true }]*/
    // look for a swipe and then prev/next
    Math.abs(x) > (this.state.sliderWrapperWidth * 0.5)
      ? (x > 0) ? this.onNext() : this.onPrev()
      : this.setState({dX: 0, sliding: false, dragging: false}) // snap back to image
  }

  updateActiveIndex(index) {
    this.setState({activeIndex: index,
      lazyLoadedArray: this.concatToLazyLoadedArray(index)})
  }

  render() {
    const {data} = this.props
    return (
      <Swipeable className="slider-wrapper"
                 onSwiping={this.handleSwiping}
                 onSwiped={this.handleSwiped}
                 ref="sliderWrapper">
        <div className="prev" onClick={() => this.onPrev()}/>
        <div className="slider"
             style={{left: -((this.state.activeIndex * this.state.sliderWrapperWidth) + this.state.dX) + 'px',
             transition: 'left ' + (this.state.sliding ? (data.slideInterval / 1000) + 's' : 0 + 's'),
             width: (this.state.sliderWrapperWidth * (this.state.imagesLength + 1)) + 'px'}}>
          {data.images.map((image, index) =>
            <div className="slide"
                 key={'image_'+index}
                 style={{width: this.state.sliderWrapperWidth + 'px'}}>
              <div key={'slide_'+index}
                   className="slide-inner"
                   style={{width: this.state.sliderWrapperWidth + 'px',
                   backgroundImage: 'url(' + ((this.state.lazyLoadedArray.indexOf(index) === -1) ? '/src/img/spinner.gif' : image) + ')'}}
              />
            </div>
          )}
        </div>
        <div className="buttons">
          {data.images.map((image, index) =>
            <div key={'button_'+index}
                 className={this.state.activeIndex === index ? 'button active' : 'button'}
                 onClick={() => this.updateActiveIndex(index)}/>
          )}
        </div>
        <div className="next" onClick={() => this.onNext()}/>
      </Swipeable>
    )
  }
}

export default Slider;
