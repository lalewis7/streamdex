import React from 'react';

import Footer from '../../comps/Footer/Footer.js';

class About extends React.Component {

    render(){
        return <>
            <div class="h-100 flex-grow-1">
                <div class="container my-4">
                    <div class="row">
                        <div class="col">
                            <h2 class="text-center text-nunito-eb">About Streamdex</h2>
                            <h6 class="text-center">Helping users discover and watch their favorite titles from one convenient location.</h6>
                        </div>
                    </div>
                    <div class="row my-3">
                        <div class="col">
                            <h4>Objectives</h4>
                            <p>The popularity of streaming services has grown exponentially in the past decade, making subscriptions to various 
                                platforms a necessity to have access to all your favorite releases. Many movies and TV shows are exclusive to 
                                each service &#x2013; especially as they&#x2019;ve moved from just carrying these titles to now producing them &#x2013; making it 
                                sometimes hard to find where certain titles are available to stream. Streamdex solves this problem. Using our 
                                service, you can check which streaming services are offering your favorite movies and TV shows and be directed 
                                to watch them instantly. In addition to showing the offerings of various streaming services, we also let users 
                                check the availability in different countries. Streamdex also strives to help users decide what to watch by giving 
                                tailored recommendations and showing new and popular releases. Streamdex aims to consolidate the cluttered world 
                                of streaming services to get you watching quicker.</p>
                        </div>
                    </div>
                    <div class="row my-3">
                        <div class="col">
                            <h4>Future</h4>
                            <p>Streamdex is currently in an alpha state and is missing a lot of the core functionality that it needs to fulfill its purpose. 
                                We are in the process of autonomously propagating our database using web-scraping bots. Everything has been hardcoded to 
                                give a template of what the site will look like when our service is ready for release. With the addition of bots, we will
                                 be able to ensure that our data is reliable and accurate. Once we start to fill our databases, we will start implementing 
                                 algorithms to give users custom recommendations on the browse, new, and popular tabs for titles we think they might like. 
                                 Additionally, we want to expand the list of streaming services we offer to include every major service. With these additions, 
                                 along with some other minor changes, we hope that Streamdex will help its users find and watch all their favorite titles.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    }

}

export default About;