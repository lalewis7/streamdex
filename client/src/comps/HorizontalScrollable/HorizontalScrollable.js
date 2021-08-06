import React from 'react';

const SVG = require('../../util/svg.js');

class HorizontalScrollable extends React.Component {

    constructor(props){
        super(props);

        this.scroll = React.createRef();

        this.navigate = this.navigate.bind(this);
        this.setNavigationVisibility = this.setNavigationVisibility.bind(this);
    }

    navigate(dir, speed, dist, step){
        let body = this.scroll.current.querySelector('.horizontal-scroll-body');

        let scrollAmount = 0;

        let updateNav = this.setNavigationVisibility;

        var slideTimer = setInterval(function(){
            if(dir == 'left'){
                body.scrollLeft -= step;
            } else {
                body.scrollLeft += step;
            }
            scrollAmount += step;
            if(scrollAmount >= dist){
                updateNav();
                window.clearInterval(slideTimer);
            }
        }, speed);
    }

    componentDidMount(){
        this.setNavigationVisibility();
        window.addEventListener("resize", this.setNavigationVisibility);
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
        let width = body.offsetWidth;
        if (scrollVal == 0 && prev)
            prev.classList.add('d-none');
        else if (prev)
            prev.classList.remove('d-none');
        if (Math.floor(scrollVal) == Math.floor(fullWidth-width) && next)
            next.classList.add('d-none');
        else if (next)
            next.classList.remove('d-none');
    }

    render(){
        const speed = 8, dist = 150, step = 8;
        return <>
            <div class="horizontal-scroll" ref={this.scroll}>
                <div class="horizontal-scroll-body">
                    <button class="horizontal-scroll-prev" onClick={(evt) => {this.navigate('left', speed, evt.target.parentElement.parentElement.offsetWidth*.75, evt.target.parentElement.parentElement.offsetWidth/64)}}><SVG.CaretLeftFill w="1.2em" h="1.2em"/></button>
                    {this.props.children}
                    <button class="horizontal-scroll-next" onClick={(evt) => {this.navigate('right', speed, evt.target.parentElement.parentElement.offsetWidth*.75, evt.target.parentElement.parentElement.offsetWidth/64)}}><SVG.CaretRightFill w="1.2em" h="1.2em"/></button>
                </div>
            </div>
        </>
    }

}

export default HorizontalScrollable;