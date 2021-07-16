import React, { useEffect, useRef } from 'react';
import {motion, useViewportScroll} from 'framer-motion';

const SVG = require('../../util/svg.js');

class HorizontalScrollable extends React.Component {

    constructor(props){
        super(props);

        this.scroll = React.createRef();

        this.navigate = this.navigate.bind(this);
        this.setNavigationVisibility = this.setNavigationVisibility.bind(this);
    }

    // navigate(delta){
    //     let scroll = this.scroll.current;
    //     let body = scroll.querySelector('.horizontal-scroll-body');

    //     body.scrollLeft += delta;

    //     this.setNavigationVisibility();
    // }

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

    // navigate(delta, t){
    //     let scroll = this.scroll.current;
    //     let body = scroll.querySelector('.horizontal-scroll-body');

    //     let scrollVal = body.scrollLeft;
    //     let fullWidth = body.scrollWidth;
    //     let width = body.offsetWidth;
    //     let maxVal = fullWidth - width;

    //     let interval = t/delta;

    //     let dist = delta;

    //     if (scrollVal - delta < 0)
    //         dist = scrollVal;
    //     if (scrollVal + delta > maxVal)
    //         dist = maxVal - scrollVal;

    //     const move = () => {
    //         console.log('move');
    //         body.scrollLeft += delta/Math.abs(delta);
    //         dist--;
    //         if (scrollVal <= 0 || scrollVal >= maxVal || dist <= 0) 
    //             this.setNavigationVisibility();
    //         else
    //             setTimeout(move, interval);
    //     }

    //     move();
    // }

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
                    <button class="horizontal-scroll-prev" onClick={() => {this.navigate('left', speed, dist, step)}}><SVG.CaretLeftFill w="1.2em" h="1.2em"/></button>
                    {this.props.children}
                    <button class="horizontal-scroll-next" onClick={() => {this.navigate('right', speed, dist, step)}}><SVG.CaretRightFill w="1.2em" h="1.2em"/></button>
                </div>
            </div>
        </>
    }

}

// export default function HorizontalScrollable(props){
//     //const { scrollXProgress } = useViewportScroll()
//     const scroll = useRef(null);

//     const setNavigationVisibility = () => {
//         let body = scroll.current.querySelector('.horizontal-scroll-body');
//         if (body === null) return;
//         let prev = body.querySelector('.horizontal-scroll-prev');
//         let next = body.querySelector('.horizontal-scroll-next');
//         let scrollVal = body.scrollLeft;
//         let fullWidth = body.scrollWidth;
//         let width = body.offsetWidth;
//         if (scrollVal == 0 && prev)
//             prev.classList.add('d-none');
//         else if (prev)
//             prev.classList.remove('d-none');
//         if (Math.floor(scrollVal) == Math.floor(fullWidth-width) && next)
//             next.classList.add('d-none');
//         else if (next)
//             next.classList.remove('d-none');
//     }

//     useEffect(() => {
//         window.addEventListener("resize", setNavigationVisibility);
//         setNavigationVisibility();
//         return () => {
//             window.removeEventListener("resize", setNavigationVisibility);
//         };
//     });

//     return <>
//         <div class="horizontal-scroll" ref={scroll}>
//             <motion.div class="horizontal-scroll-body" style={{contentOffsetX: 20}}>
//                 <button class="horizontal-scroll-prev" onClick={() => {}}><SVG.CaretLeftFill w="1.2em" h="1.2em"/></button>
//                 {props.children}
//                 <button class="horizontal-scroll-next" onClick={() => {}}><SVG.CaretRightFill w="1.2em" h="1.2em"/></button>
//             </motion.div>
//         </div>
//     </>
// }

export default HorizontalScrollable;