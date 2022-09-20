import React from 'react';

import Footer from '../../comps/Footer/Footer.js';

class Contact extends React.Component {

    render(){
        return <>
            <div class="h-100 flex-grow-1">
                <div class="container h-100">
                    <div class="row mt-5">
                        <div class="col d-flex flex-column justify-content-center my-4">
                            <h2 class="text-center text-nunito-eb">Contact Us</h2>
                            <h6 class="text-center">Need to get in touch with us? Send any inquires about Streamdex to <a href="mailto: steamdex1@gmail.com">steamdex1@gmail.com</a>.</h6>
                        </div>
                        <div class="col my-4 text-center">
                            <h3 class="text-center mb-3 text-nunito-eb">Owner/Lead designer</h3>
                            <a href="https://www.linkedin.com/in/arthur-lewis/" target="blank" rel="noopener noreferrer">
                                <img class="rounded-3" src="./linkedin.jpg" alt="..." style={{maxWidth: '350px'}} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    }

}

export default Contact;