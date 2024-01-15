import React from 'react';
import { withResizeDetector } from 'react-resize-detector';

const SVG = require('../../util/svg.js');

/* 
https://stackoverflow.com/questions/21064101/understanding-offsetwidth-clientwidth-scrollwidth-and-height-respectively
*/

class HorizontalScrollable extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            mouseOver: false
        }

        this.scroll = React.createRef();

        this.navigate = this.navigate.bind(this);
        this.setNavigationVisibility = this.setNavigationVisibility.bind(this);
    }

    navigate(dir, speed, dist, step){
        let body = this.scroll.current.querySelector('.horizontal-scroll-body');

        let scrollAmount = 0;

        let updateNav = this.setNavigationVisibility;

        var slideTimer = setInterval(function(){
            if(dir === 'left'){
                body.scrollLeft -= step;
            } else {
                body.scrollLeft += step;
            }
            scrollAmount += step;
            if(scrollAmount >= dist || body.scrollLeft == 0 || Math.floor(body.scrollLeft) == Math.floor(body.scrollWidth-body.clientWidth)){
                updateNav();
                window.clearInterval(slideTimer);
            }
        }, speed);
    }

    componentDidMount(){
        window.addEventListener("resize", this.setNavigationVisibility);
        this.setNavigationVisibility();
    }
    
    componentWillUnmount() {
        window.removeEventListener("resize", this.setNavigationVisibility);
    }

    componentDidUpdate(){
        this.setNavigationVisibility();
    }

    setNavigationVisibility(){
        let scroll = this.scroll.current;
        let body = scroll.querySelector('.horizontal-scroll-body');
        if (body === null) return;
        let prev = body.querySelector('.horizontal-scroll-prev');
        let next = body.querySelector('.horizontal-scroll-next');

        let scrollVal = body.scrollLeft;
        let fullWidth = body.scrollWidth;
        let viewportWidth = body.clientWidth;

        if ((scrollVal == 0 && prev) || !this.state.mouseOver)
            prev.classList.add('d-none');
        else if (prev)
            prev.classList.remove('d-none');
        
        if ((Math.floor(scrollVal) == Math.floor(fullWidth-viewportWidth) && next) || !this.state.mouseOver)
            next.classList.add('d-none');
        else if (next)
            next.classList.remove('d-none');
    }

    render(){
        const tot_time = 400;
        const dist = (evt) => evt.currentTarget.parentElement.parentElement.clientWidth*.75;
        const step = (evt) => Math.ceil(evt.currentTarget.parentElement.parentElement.clientWidth/64);
        const speed = (evt) => Math.floor(tot_time / (dist(evt) / step(evt)));
        const scroll = (dir, evt) => this.navigate(dir, speed(evt), dist(evt), step(evt));
        return <>
            <div class="horizontal-scroll" ref={this.scroll} onMouseOver={() => {this.setState({mouseOver: true})}} onMouseLeave={() => {this.setState({mouseOver: false})}}>
                <div class="horizontal-scroll-body">
                    <button type="button" class="horizontal-scroll-prev" onClick={evt => scroll('left', evt)}>
                        <SVG.CaretLeftFill w="1.2em" h="1.2em"/>
                    </button>
                    {this.props.children}
                    <button type="button" class="horizontal-scroll-next" onClick={evt => scroll('right', evt)}>
                        <SVG.CaretRightFill w="1.2em" h="1.2em"/>
                    </button>
                </div>
            </div>
        </>
    }

}

export default withResizeDetector(HorizontalScrollable);