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
                            <p>As the popularity of streaming services has grown in the past decade, it has become a necessity to have accounts on many of 
                                these services to have access to your favorite releases. Many of these titles are exclusive to each service making it hard 
                                to find their availability and watch. Streamdex aims to solve that by being a one stop guide to the availability of every 
                                title on all the popular streaming platforms. Using our service, you can check what streaming services are offering your 
                                favorite movies and shows and watch them instantly. Along with showing the different streaming services offering each title we 
                                also let users check the availability for different countries outside of their own. Streamdex also strives to help users decide 
                                what to watch by giving personal recommendations, showing what is popular and new on their streaming services. Streamdex aims to 
                                consolidate the cluttered world of multiple streaming services and to let you watch your favorite releases quicker.</p>
                        </div>
                    </div>
                    <div class="row my-3">
                        <div class="col">
                            <h4>Future</h4>
                            <p>Streamdex is currently in an Alpha state and is missing a lot of the core functionality that it needs to fulfill its purpose. 
                                The first change we want to add it autonomously propagate our database using web-scraping bots. Currently everything has been 
                                hardcoded to give an idea of what the site will look like when our service is ready for market. With the addition of bots, we 
                                will be able to ensure that our data is reliable and accurate. Once we start to fill our databases, we will start implementing 
                                algorithms to give users custom recommendations on the browse, new, and popular tabs for titles we think they might like. 
                                Additionally, we want to expand the list of streaming services we offer to include every major service. With these additions along 
                                with some other minor changes we hope to have Streamdex ready for market.</p>
                        </div>
                    </div>
                    {/*
                    <div class="row my-3">
                        <div class="col">
                            <h3 class="text-center text-nunito-eb">Technical Information</h3>
                        </div>
                    </div>
                    <div class="row mb-5">
                        <div class="col-md-2 text-center my-2">
                            <img class="rounded-3" src="./aws.jpg" alt="..." style={{maxWidth: '100px'}} />
                        </div>
                        <div class="col-md-10">
                            <h4>Hosting</h4>
                            <p>Streamdex uses <a href="https://aws.amazon.com/" target="blank" rel="noopener noreferrer">Amazon Web Services (AWS)</a> for hosting all its systems. To the run website we are currently using these AWS services: 
                                EC2, RDS, S3, Route 53, Certificate Manager, and CloudFront.</p>
                        </div>
                    </div>
                    <div class="row my-5">
                        <div class="col-md-2 order-md-2 text-center my-2">
                            <div class="d-flex h-100 flex-column justify-content-center align-items-center">
                                <img class="rounded-3" src="./nodejs.jpg" alt="..." style={{maxWidth: '100px'}} />
                            </div>
                        </div>
                        <div class="col-md-10">
                            <h4>Backend API</h4>
                            <p>The backend API consists of an <a href="https://expressjs.com/" target="blank" rel="noopener noreferrer">express</a> + 
                            <a href="https://nodejs.org/en/" target="blank" rel="noopener noreferrer">node.js</a> server which connects to a MySQL database. 
                            We run an Amazon EC2 instance which proxies 
                                all web requests through <a href="https://www.nginx.com/" target="blank" rel="noopener noreferrer">nginx</a> to our node.js 
                                server. Our EC2 instance is connected to an Amazon RDS database running MySQL.</p>
                        </div>
                    </div>
                    <div class="row my-5">
                        <div class="col-md-2 text-center my-2">
                            <img class="rounded-3" src="./react.svg" alt="..." style={{maxWidth: '100px'}} />
                        </div>
                        <div class="col-md-10">
                            <h4>Frontend</h4>
                            <p>Streamdex has two frontend <a href="https://reactjs.org/" target="blank" rel="noopener noreferrer">react</a> websites: our public 
                            website and a private administrator website for making edits to the database. 
                                Both run as a single static site compiled using <a href="https://create-react-app.dev/" target="blank" rel="noopener noreferrer">
                                    create-react-app</a> running on Amazon S3. </p>
                        </div>
                    </div>
                    <div class="row my-5">
                        <div class="col-md-2 order-md-2 text-center my-2">
                            <img class="rounded-3" src="./puppeteer.png" alt="..." style={{maxWidth: '100px'}} />
                        </div>
                        <div class="col-md-10">
                            <h4>Web scraping bot</h4>
                            <p>Currently we are in the development of adding a web scraping bot to help propagate our database and keep our data up to date. We 
                                are going to use <a href="https://pptr.dev/" target="blank" rel="noopener noreferrer">puppeteer</a> running on a node.js server 
                                to have data autonomously be added to our database.</p>
                        </div>
                    </div>
                    */}
                </div>
            </div>
            <Footer />
        </>
    }

}

export default About;