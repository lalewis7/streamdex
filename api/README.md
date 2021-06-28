# Streamdex Backend API

## Database design

### Users

- `users(id, handle, email, password, country, locked, admin)`
- `userstreams(user, platform)`
- `tokens(token, user, created, expires)`
- `rating(user, title, upvote)`
- `resetpassword(user, code, created, expires, valid)`

### Title

- `title(title_id, title, type, cover_image, maturity_rating, trailer, description)`
- `titlegenre(title_id, genre)`
- `movies(title_id, rel_date, runtime)`
- `season(title_id, season_id, season_number, rel_date)`
- `episode(season_id, episode_id, episode_number, name, runtime, description)`

### Links

- `link(title_id, platform, link)`
- `movielink(title_id, platform, country, rel_date, available)`
- `seasonlink(title_id, platform, season_id, country, rel_date, available)`
- `episodelink(title_id, platform, episode_id, country, rel_date, available)`

## API design

`/auth` => use login credentials to be granted token for further use of the api
- `[GET]` email/handle and password in header returns valid token for user
- `[POST]` 405
- `[PUT]` 405
- `[DELETE]` 405

`/users` => make changes to users
- `[GET]` get all users, uses pagination with p query, can search for users with q query
- `[POST]` create new user
- `[PUT]` 405
- `[DELETE]` 405

`/users/:userId` => makes changes to individual user
- `[GET]` get content of user (only allowed for admins and that user)
- `[POST]` 405
- `[PUT]` make edits to user (only allowed for owner and admins)
- `[DELETE]` delete an account

`/titles` => handle all details with titles
- `[GET]` get all titles, uses pagination with p query, can search for titles with q query
- `[POST]` create new title (only allowed for admins)
- `[PUT]` 405
- `[DELETE]` 405

`/titles/:titleId` => makes changes to individual titles
- `[GET]` get title information
- `[POST]` 405
- `[PUT]` make changes to titles (admin reserved)
- `[DELETE]` remove the title


## Code Structure

### Controllers

Each controller exports functions that make calls to its respective mysql table. Use `util.dbPromise` to return a mysql request as a promise.

### Models

Models make up the structure of the data. They use controllers to interact with the database and are used by the model_functions to access the data. They are responsible for protecting individual pieces of data while the routes gatekeep the request completely. Models are the gateway between controllers and routes.

### User Model
```json
{
    "user_id": "1c581b86ede9a221a821881cac96693e",
    "handle": "account123",
    "email": "sample@mail.com",
    "password": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    "admin": false,
    "country": "USA",
    "streams": ["netflix", "hulu"]
}
```

### Title
```json
{
    "title_id": "7e3ff9765e6310664a1e983bc454589cc577bd3230e95f5e511c274b50c49c2e",
    "title": "Frozen",
    "type": "movie",
    "thumbnail": "frozen.png",
    "maturity": "PG",
    "description": "Animated kids movie about princess in frozen castle",
    /* For logged in users */
    "available": true,
    "available_in_country": false
}
```

### Title - Movie Model
```json
{
    "title_id": "7e3ff9765e6310664a1e983bc454589cc577bd3230e95f5e511c274b50c49c2e",
    "title": "Frozen",
    "type": "movie",
    "thumbnail": "frozen.png",
    "maturity": "PG",
    "description": "Animated kids movie about princess in frozen castle",
    "rel_date": "",
    "trailer": "R-cdIvgBCWY",
    "runtime": 132,
    "genres": [
        "kids", "animated"
    ],
    "links": [
        {
            "platform": "netflix",
            "link": "https://www.google.com/"
        }
    ],
    "availability": [
        {
            "platform": "netflix",
            "countries": ["USA"]
        }
    ]
}
```

### Title - Show Model
```json
{
    "title_id": "5e3ff9765e6310664a1e983bc454589cc577bd3230e95f5e511c274b50c49c2e",
    "title": "Spongebob Squarepants",
    "type": "series",
    "cover_image": "spongebob.png",
    "maturity_rating": "PG",
    "description": "Animated kids show about a sponge that lives under the sea",
    "links": [
        {
            "platform": "netflix",
            "link": "https://www.google.com/"
        }
    ],
    "seasons":[
        {
            "season_id": "5e3ff9765e6310664a1e983bc45458",
            "season_number": 1,
            "rel_date": "",
            "trailer": "R-cdIvgBCWY",
            "availability": [
                {
                    "platform": "netflix",
                    "countries": ["USA", "UK"]
                }
            ],
            "episodes": [
                {
                    "episode_number": 1,
                    "name": "pineapple under the sea",
                    "runtime": 24,
                    "description": "spongebob squarepants lives in a pineapple",
                    "availability": [
                        {
                            "platform": "netflix",
                            "countries": ["USA", "UK"]
                        }
                    ]
                }
            ]
        }
    ],
    "genres": [
        "kids", "animated"
    ],
}
```

### models/model.js

`model.Model` is the parent class for all model classes. It takes in an array of `model.Attribute` instances that organize the structure of the model. The built in functions to edit the data in the model should not make any promises. The model itself is strictly for handling data, use additional methods (`init()`, `insert()`, `save()`, & `delete()`) to edit/get data from the database.

### Model Functions

Model functions contains methods that work as an intermediary between the routes and the models so that the route code is simple and only focuses on authentication/authorization handling.

### Routes

Routes are the entry point for all calls made to the API. There should be a route for every call made to the API. Routes also contain the logic for whether a request is allowed or not, and should deny entry to invalid or unauthorized requests. Routes will use model functions to interact with the data.

