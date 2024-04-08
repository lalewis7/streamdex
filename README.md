# **Streamdex**

<p align="center">
<a href="https://streamdex.net"><img width="100" height="100" src="https://raw.githubusercontent.com/lalewis7/streamdex/main/client/public/streamdex-icon.svg"></a>
</p>

## **Objectives**

The popularity of streaming services has grown exponentially in the past decade, making subscriptions to various platforms a necessity to have access to all your favorite releases. Many movies and TV shows are exclusive to each service – especially as they’ve moved from just carrying these titles to now producing them – making it sometimes hard to find where certain titles are available to stream. Streamdex solves this problem. Using our service, you can check which streaming services are offering your favorite movies and TV shows and be directed to watch them instantly. In addition to showing the offerings of various streaming services, we also let users check the availability in different countries. Streamdex also strives to help users decide what to watch by giving tailored recommendations and showing new and popular releases. Streamdex aims to consolidate the cluttered world of streaming services to get you watching quicker.

## **Future**

Streamdex is currently in an alpha state and is missing a lot of the core functionality that it needs to fulfill its purpose. We are in the process of autonomously propagating our database using web-scraping bots. Everything has been hardcoded to give a template of what the site will look like when our service is ready for release. With the addition of bots, we will be able to ensure that our data is reliable and accurate. Once we start to fill our databases, we will start implementing algorithms to give users custom recommendations on the browse, new, and popular tabs for titles we think they might like. Additionally, we want to expand the list of streaming services we offer to include every major service. With these additions, along with some other minor changes, we hope that Streamdex will help its users find and watch all their favorite titles.

---

## **The Stack**

### Hosting

Streamdex uses Amazon Web Services (AWS) for hosting all of its systems. To the run website, we are currently using these AWS services: EC2, RDS, S3, Route 53, Certificate Manager, and CloudFront.

### Backend API

The backend API consists of an express +node.js server that connects to a MySQL database. We run an Amazon EC2 instance, which proxies all web requests through nginx to our node.js server. Our EC2 instance is connected to an Amazon RDS database running MySQL.

### Frontend

Streamdex has two frontend react websites: our public website and a private administrator website used for making edits to the database. Both websites run as a single static site that is compiled using create-react-app running on Amazon S3.

### Web scraping bot

We are in the development of adding a web scraping bot to help propagate our database and keep our data up to date. We are going to use puppeteer running on a node.js server to have data autonomously added to our database.

---

## **Getting Started**

### Clone Repository

- Clone this repository to your local machine.

### Database Setup

1. Download [MySQL Workbench](https://dev.mysql.com/downloads/workbench/), a visual tool for database management, to make setting up the MySQL database easier.

2. Download [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) and follow installation instructions to setup the database.

3. Import the sample schema by going to `Server > Data Import` in the menu bar.
    - Select "Import from Self-Contained File" and select the sample schema from `/misc/db-saves/sample.sql` in the repository.
    - Under "Default Schema to be Imported To" create a new schema and name it "streamdex".
    - Make sure that the type of import is set to "Dump Structure and Data".
    - Click "Start Import".

4. Setup a new user by going to `Server > Users and Privilges` in the menu bar.
    - Select "Add Account" in the bottom left corner.
    - Under the Login tabe set the login name to "api" and password to "password".
    - Under the Administrative Rights tab select the DBA role.
    - Click "Apply".

### Node Express API

1. In a terminal move to the `/api` directory in the repository.

2. Install all dependencies with `npm install`.

3. Run the server with `node app.js`.

### Frontend Website

1. In a terminal move to the `/client` directory in the repository.

2. Install all dependencies with `npm install`.

3. Run the server with `npm start`.

### Admin Website

1. In a terminal move to the `/client-admin` directory in the repository.

2. Install all dependencies with `npm install`.

3. Run the server with `npm start`.

4. If it prompts to select a different port select yes.

5. Use the existing admin user to login.
    - username: `admin`
    - password: `password123`

## **Deploying Changes**

> All credentials and saved keys can be found at the [Streamdex Credential Repository](https://github.com/lalewis7/streamdex-cred).
