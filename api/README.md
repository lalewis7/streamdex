# Streamdex Backend API

Guide to the Streamdex backend API.

# Route Map

URL | GET | POST | PUT | DELETE
--- | --- | --- | --- | --- |
`/auth` | **200** | 405 | 405 | 405 |
`/users` | **200** | **201** | 405 | 405 |
`/users/:userId` | **200** | 405 | **200** | **200** |
`/users/:userId/rating/:titleId` | **200** | **201** | 405 | **200** |
`/titles` | **200** | **201** | 405 | 405 |
`/titles/:titleId` | **200** | 405 | **200** | **200** |
`/titles/:titleId/links` | **200** | 405 | 405 | 405 |
`/titles/:titleId/links/:linkId` | **200** | **201** | 405 | **200** |
`/titles/:titleId/availability` | **200** | 405 | 405 | 405 |
`/titles/:titleId/availability/:platform` | **200** | **201** | 405 | 405 |
`/titles/:titleId/seasons` | **200** | **201** | 405 | 405 |
`/seasons/:seasonId` | **200** | 405 | **200** | **200** |
`/seasons/:seasonId/availability` | **200** | 405 | 405 | 405 |
`/seasons/:seasonId/availability/:platform` | **200** | **201** | 405 | 405 |
`/seasons/:seasonId/episodes` | **200** | **201** | 405 | 405 |
`/episodes/:episodeId` | **200** | 405 | **200** | **200** |
`/episodes/:episodeId/availability` | **200** | 405 | 405 | 405 |
`/episodes/:episodeId/availability/:platform` | **200** | **201** | 405 | 405 |
`/lists` | 405 | **201** | 405 | 405 |
`/lists/:listId` | **200** | 405 | **200** | **200** |
`/pages/:page` | **200** | 405 | 405 | 405 |
`/images` | **200** | **201** | 405 | 405 |
`/images/:image` | **200** | 405 | **200** | **200** |
`/images/:image/info` | **200** | 405 | 405 | 405 |
`/bots` | **200** | **201** | 405 | 405 |
`/bots/:botId` | **200** | 405 | **200** | **200** |
`/bots/:botId/tasks` | **200** | **201** | 405 | 405 |
`/tasks/:taskId` | **200** | 405 | **200** | **200** |
`/links` | **200** | **201** | 405 | 405 |
`/links/:linkId` | **200** | 405 | **200** | **200** |
`/links/:linkdId/snapshots` | **200** | **201** | 405 | 405 |
`/snapshots/:snapshotId` | **200** | 405 | 405 | **200** |

# Routes

## Authentication

`[GET] /auth`

Authenticate user with the API by passing credentials to this route and in return recieve a token to use for authorization on all further requests.

### Header
Pass the user credentials in the header of the request.
```json
{
    "user": "username",
    "password": "user password"
}
```

### Response
The response will be your token that should be in the header of all future requests. Along with your user id.
```json
{
    "user_id": "28eb5ad4bdc905f3",
    "token": "394b214186c911228914798b84c1e7a2781dd5b8713a36245edbe2e55d9e2478fd26a6e0d28b987fb186c958d9ca626a66d725b287e1d4fe474e815735e16968"
}
```

## Get Users

`[GET] /users ?query=user1&page=1&limit=20`

Get a list of all the users. 

**Requires Authentication and Administrator Rights.**

### Variables
- query: a search query to search over any indexed fields.
- page: the page number to respond with.
- limit: the limit of results to show per page.

### Response
```json
[
    {
        "user_id": "28eb5ad4bdc905f3",
        "handle": "user1",
        "email": "sample@mail.com",
        "admin": true,
        "country": "USA",
        "streams": ["netflix", "hulu"]
    },
    {
        "user_id": "fg54h6sj2bhjgfds",
        "handle": "user2",
        "email": "sample@mail.com",
        "admin": false,
        "country": "UK",
        "streams": ["amazon_prime"]
    },
    {
        "user_id": "fdhfejbcds786m5g",
        "handle": "user3",
        "email": "sample@mail.com",
        "admin": false,
        "country": "CA",
        "streams": ["disney_plus"]
    }
]
```

## Create New User

`[POST] /users`

Create a new user account.

### Request Body

Pass the data for the user in the request body.
```json
{
    "handle": "user1",
    "email": "sample@mail.com",
    "password": "password123",
    "country": "USA",
    "streams": ["netflix", "hulu"]
}
```

## Get User Info

`[GET] /users/:userId`

Get the info of the user.

**Requires Authentication and Administrator Rights or Ownership of the Account.**

### Response
```json
{
    "user_id": "28eb5ad4bdc905f3",
    "handle": "user1",
    "email": "sample@mail.com",
    "admin": true,
    "country": "USA",
    "streams": ["netflix", "hulu"]
}
```

## Edit User Info

`[PUT] /users/:userId`

Edit a users info.

**Requires Authentication and Administrator Rights or Ownership of the Account.**

### Request Body
Pass the data for the user in the request body.
```json
{
    "handle": "user1",
    "email": "sample@mail.com",
    "password": "password123",
    "country": "USA",
    "streams": ["netflix", "hulu"]
}
```

## Delete User

`[DELETE] /users/:userId`

Delete a user.

**Requires Authentication and Administrator Rights or Ownership of the Account.**

## Get a User Rating on a Title

`[GET] /users/:userId/ratings/:titleId`

Get the current rating a user has on a title.

**Requires Authentication and Administrator Rights or Ownership of the Account.**

### Response
```json
{
    "positive": true
}
```

## Create/Edit User Rating on a Title

`[POST] /users/:userId/ratings/:titleId`

Create a new user rating on a title.

**Requires Authentication and Administrator Rights or Ownership of the Account.**

### Request Body
```json
{
    "positive": true
}
```

## Delete User Rating on a Title

`[DELETE] /users/:userId/ratings/:titleId`

Delete user rating on a title.

**Requires Authentication and Administrator Rights or Ownership of the Account.**

## Get Titles

`[GET] /titles ?query=name&page=1&limit=20`

Get a list of titles.

### Variables
- query: a search query to search over any indexed fields.
- page: the page number to respond with.
- limit: the limit of results to show per page.

### Response
```json
[
    {
        "title_id": "7e3ff9765e6310664a1e983bc454589cc577bd3230e95f5e511c274b50c49c2e",
        "title": "Frozen",
        "type": "movie",
        "thumbnail": "9cc577bd3230e95",
        "maturity": "PG",
        "description": "Animated kids movie about princess in frozen castle",
        /* For logged in users */
        "available": true
    },
    {
        "title_id": "gr8nd4ghjklh310664a1e983bc454589cc577bd3230e95f5e511c274b50c49c2e",
        "title": "Game of Thrones",
        "type": "show",
        "thumbnail": "d2f577bd3230e95",
        "maturity": "R",
        "description": "Great Show",
        /* For logged in users */
        "available": true
    }
]
```

## Create a Title

`[POST] /titles/:titleId`

Create a new title.

**Requires Authentication and Administrator Rights.**

### Request Body
```json
{
    "title": "Frozen",
    "type": "movie",
    "thumbnail": "9cc577bd3230e95",
    "maturity": "PG",
    "description": "Animated kids movie about princess in frozen castle"
}
```

## Get Title Info

`[GET] /titles/:titleId`

Get the content of a title.

### Movie Response
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

### Series/Show Response
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

## Edit Title Info

`[PUT] /titles/:titleId`

Edit a title info.

**Requires Authentication and Administrator Rights.**

### Request Body
```json
{
    "title": "Frozen",
    "type": "movie",
    "thumbnail": "9cc577bd3230e95",
    "maturity": "PG",
    "description": "Animated kids movie about princess in frozen castle"
}
```

## Delete Title

`[DELETE] /titles/:titleId`

Deletes a title.

**Requires Authentication and Administrator Rights.**

## Get Title Links

`[GET] /titles/:titleId/links`

Get any associated links with this title and what platform they come from.

### Response
```json
[
    {
        "platform": "netflix",
        "link": "https://www.google.com/"
    },
    {
        "platform": "imdb",
        "link": "https://www.sample.com/"
    }
]
```

## Add Link to Title

`[POST] /titles/:titleId/links/:linkId`

Add a link to a title.

**Requires Authentication and Administrator Rights.**

## Remove Link from Title

`[DELETE] /titles/:titleId/links/:linkId`

Removies a link from a title.

**Requires Authentication and Administrator Rights.**

## Get Title Availability

`[GET] /titles/:titleId/availability`

Gets a title streaming service availability.

### Response
```json
[
    {
        "platform": "netflix",
        "countries": ["US", "CA"]
    },
    {
        "platform": "hulu",
        "countries": ["US"]
    }
]
```

## Update Availability Settings

`[POST] /titles/:titleId/availability/:platform`

Updates the availability of a platform.

**Requires Authentication and Administrator Rights.**

### Request Body
```json
{
    "country": "US",
    "available": true
}
```

## Get Title Seasons

`[GET] /titles/:titleId/seasons`

Gets all the seasons for a show.

### Response
```json
[
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
]
```

## Create a new Season

`[POST] /titles/:titleId/seasons`

Creates a new season for a title.

**Requires Authentication and Administrator Rights.**

## Request Body

```json
{
    "season_number": 1,
    "rel_date": "",
    "trailer": "R-cdIvgBCWY"
}
```

## Get Season Item

`[GET] /seasons/:seasonId`

Gets a seaon item.

### Response
```json
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
```

## Edit Season Info

`[PUT] /seasons/:seasonId`

Edits a season info.

### Request Body
```json
{
    "season_number": 1,
    "rel_date": "",
    "trailer": "R-cdIvgBCWY"
}
```

## Delete Season

`[DELETE] /seasons/:seasonId`

Deletes a season.

## Get Season Availability

`[GET] /seasons/:seasonId/availability`

Gets the availability of the season.

### Response
```json
[
    {
        "platform": "netflix",
        "countries": ["US", "CA"]
    },
    {
        "platform": "hulu",
        "countries": ["US"]
    }
]
```

## Update Season Availability Settings

`[POST] /seasons/:seasonId/availability/:platform`

Updates the availability of a platform.

**Requires Authentication and Administrator Rights.**

### Request Body
```json
{
    "country": "US",
    "available": true
}
```

## Get Episodes of Season

`[GET] /seasons/:seasonId/episodes`

Gets all the episodes for a season.

### Response
```json
[
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
```

## Create a New Episode

`[POST] /seasons/:seasonId/episodes`

Creates a new episode for a season.

**Requires Authentication and Administrator Rights.**

### Request Body
```json
{
    "episode_number": 1,
    "name": "pineapple under the sea",
    "runtime": 24,
    "description": "spongebob squarepants lives in a pineapple"
}
```

## Get Episode Item

`[GET] /episodes/:episodeId`

Get the contents of a episode

### Response
```json
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
```

## Edit Episode Info

`[PUT] /episodes/:episodeId`

Edit the info of a episode.

**Requires Authentication and Administrator Rights.**

### Request Body
```json
{
    "episode_number": 1,
    "name": "pineapple under the sea",
    "runtime": 24,
    "description": "spongebob squarepants lives in a pineapple"
}
```

## Delete Episode

`[DELETE] /episodes/:episodeId`

Delete a episode.

**Requires Authentication and Administrator Rights.**

## Get Episode Availability

`[GET] /episodes/:episodeId/availability`

Gets the availability of the episode.

### Response
```json
[
    {
        "platform": "netflix",
        "countries": ["US", "CA"]
    },
    {
        "platform": "hulu",
        "countries": ["US"]
    }
]
```

## Update Episode Availability Settings

`[POST] /episodes/:episodeId/availability/:platform`

Updates the availability of a platform.

**Requires Authentication and Administrator Rights.**

### Request Body
```json
{
    "country": "US",
    "available": true
}
```

## Create New List

`[POST] /lists`

Create a new List.

**Requires Authentication and Administrator Rights.**

### Request Body
```json
{
    "name": "Top 10 Movies",
    "updated_last": 21312930002,
    "titles": [
        /* Titles in order. */
    ]
}
```

## Get a List

`[GET] /lists/:listId`

Get a list.

### Response
```json
{
    "id": "45i2j3h2",
    "name": "Top 10 Movies",
    "updated_last": 21312930002,
    "titles": [
        /* Titles in order. */
    ]
}
```

## Edit List

`[PUT] /lists/:listId`

Edit a list.

**Requires Authentication and Administrator Rights.**

### Request Body
```json
{
    "name": "Top 10 Movies",
    "updated_last": 21312930002,
    "titles": [
        /* Titles in order. */
    ]
}
```

## Delete a List

`[DELETE] /lists/:listId`

Delete a list.

**Requires Authentication and Administrator Rights.**

## Get Page Info

`[GET] /pages/:pageName`

Get a page item for website, new, browse, popular.

### Response
```json
[
    {
        "name": "Top 10 Movies",
        "updated_last": 21312930002,
        "titles": [
            /* Titles in order. */
        ]
    }
]
```

## Get Images

`[GET] /images ?query=marvel&page=1&limit=20`

Get a list of images info.

**Requires Authentication and Administrator Rights.**

### Variables
- query: a search query to search over any indexed fields.
- page: the page number to respond with.
- limit: the limit of results to show per page.

### Response
```json
[
    {
        "id": "321jioh312oji",
        "filename": "321jioh312oji.png",
        "description": "marvel, avengers",
        "public": true
    },
    {
        "id": "e2d112d12dd11d",
        "filename": "e2d112d12dd11d.png",
        "description": "rick and morty",
        "public": true
    }
]
```

## Upload Image

`[POST] /images`

Upload a image.

**Requires Authentication and Administrator Rights.**

## Get a Image

`[GET] /images/:imageId`

Get the content of the image. Returns the image and no json.

**Requires Authentication and Administrator Rights If Not Public.**

## Edit Image Info

`[PUT] /images/:imageId`

Edit the settings for the image.

**Requires Authentication and Administrator Rights.**

### Request Body
```json
{
    "description": "rick and morty",
    "public": true
}
```

## Delete Image

`[DELETE] /images/:imageId`

Delete a image.

**Requires Authentication and Administrator Rights.**

## Get Image Info

`[GET] /images/:imageId/info`

Gets the settings for the image.

**Requires Authentication and Administrator Rights.**

### Response
```json
{
    "id": "321jioh312oji",
    "filename": "321jioh312oji.png",
    "description": "marvel, avengers",
    "public": true
}
```

## Get Bot Configuration

`[GET] /bot`

Get the bot configuration.

**Requires Authentication and Administrator Rights.**

## Response
```json
{
    "running": true,
    "threads": 8
}
```

## Edit Bot Configuration

`[PUT] /bot`

Edit the bot configuration.

**Requires Authentication and Administrator Rights.**

### Request Body
```json
{
    "running": true,
    "threads": 8
}
```

## Get Queries

`[GET] /queries ?query=avatar&page=1&limit=20`

Get list of queries.

### Response
```json
[
    {
        "query": "avatar",
        "last_checked": 21979837189312
    },
    {
        "query": "avatar: the last airbender",
        "last_checked": 378109382913801
    }
]
```

## Create a Query

`[POST] /queries`

Create a query

**Requires Authentication and Administrator Rights.**

### Request Body
```json
{
    "query": "avatar"
}
```

## Get a Query

`[GET] /queries/:query`

Get a query.

## Response
```json
{
    "query": "avatar: the last airbender",
    "last_checked": 378109382913801
}
```

## Edit a Query

`[PUT] /queries/:query`

Edit a query.

### Request Body
```json
{
    "last_checked": 378109382913801
}
```

## Delete a Query

`[DELETE] /links/:query`

Delete a query.

## Get Tasks

`[GET] /tasks`

Get tasks.

**Requires Authentication and Administrator Rights.**

### Response
```json
[
    {
        "id": "dh1uo2d1noud1",
        "link_id": "gg1oidh1od1d",
        "type": "imdb.snapshot",
        "started": 21979837189312,
        "ended": 378109382913801,
        "status": "completed"
    },
    {
        "id": "dh1uo2d1noud1",
        "link_id": "gg1oidh1od1d",
        "type": "imdb.links",
        "started": 21979837189312,
        "ended": 378109382913801,
        "status": "completed"
    }
]
```

## Create a Task

`[POST] /tasks`

Create a task

**Requires Authentication and Administrator Rights.**

### Request Body
```json
{
    "link_id": "gg1oidh1od1d",
    "type": "imdb.snapshot",
    "status": "pending"
}
```

## Get Task

`[GET] /tasks/:taskId`

Get task info.

**Requires Authentication and Administrator Rights.**

### Response
```json
{
    "id": "dh1uo2d1noud1",
    "link_id": "gg1oidh1od1d",
    "type": "imdb.snapshot",
    "started": 21979837189312,
    "ended": 378109382913801,
    "status": "completed"
}
```

## Edit Task Info

`[PUT] /tasks/:taskId`

Edit a tasks info.

**Requires Authentication and Administrator Rights.**

### Request Body
```json
{
    "link_id": "gg1oidh1od1d",
    "type": "imdb.snapshot",
    "started": 21979837189312,
    "ended": 378109382913801,
    "status": "completed"
}
```

## Delete Task

`[DELETE] /tasks/:taskId`

Delete a task.

## Get Links

`[GET] /links ?query=imdb&page=1&limit=20`

Get a list of links

### Response
```json
[
    {
        "id": "d1j2iolx12jpoi",
        "link": "https://www.google.com/"
    },
    {
        "id": "4g4g33g22ggsfgswg",
        "link": "https://www.sample.com/"
    }
]
```

## Create a Link

`[POST] /links`

Create a link.

### Request Body
```json
{
    "link": "https://www.google.com/"
}
```

## Get a link

`[GET] /links/:linkId`

Get an individual link

## Response
```json
{
    "link": "https://www.google.com/"
}
```

## Edit a Link

`[PUT] /links/:linkId`

Edit a link.

### Request Body
```json
{
    "link": "https://www.google.com/"
}
```

## Delete a Link

`[DELETE] /links/:linkId`

Delete a link.

## Get Link Snapshots

`[GET] /links/:linkId/snapshots`

Get all snapshots of a link.

### Response
```json
[
    {
        "timestamp": 371892031,
        "data": "{data in json}"
    }
]
```

## Create a Snapshot

`[POST] /links/:linkId/snapshots`

Create a snapshot of a link.

### Request Body
```json
{
    "data": "{data in json}"
}
```

## Get Latest Snapshot

`[GET] /links/:linkId/snapshots/latest`

Get the latest snapshot of a link.

### Response
```json
{
    "timestamp": 371892031,
    "data": "{data in json}"
}
```

# TODO

# Database design

## Users

- `users(id, handle, email, password, country, locked, admin)`
- `userstreams(user, platform)`
- `tokens(token, user, created, expires)`
- `rating(user, title, upvote)`
- `resetpassword(user, code, created, expires, valid)`

## Title

- `title(title_id, title, type, cover_image, maturity_rating, trailer, description)`
- `titlegenre(title_id, genre)`
- `movies(title_id, rel_date, runtime)`
- `season(title_id, season_id, season_number, rel_date)`
- `episode(season_id, episode_id, episode_number, name, runtime, description)`

## Links

- `link(title_id, platform, link)`
- `movielink(title_id, platform, country, rel_date, available)`
- `seasonlink(title_id, platform, season_id, country, rel_date, available)`
- `episodelink(title_id, platform, episode_id, country, rel_date, available)`

## Code Structure



### Controllers

Each controller exports functions that make calls to its respective mysql table. Use `util.dbPromise` to return a mysql request as a promise.

### Models

Models make up the structure of the data. They use controllers to interact with the database and are used by the model_functions to access the data. They are responsible for protecting individual pieces of data while the routes gatekeep the request completely. Models are the gateway between controllers and routes.


### models/model.js

`model.Model` is the parent class for all model classes. It takes in an array of `model.Attribute` instances that organize the structure of the model. The built in functions to edit the data in the model should not make any promises. The model itself is strictly for handling data, use additional methods (`init()`, `insert()`, `save()`, & `delete()`) to edit/get data from the database.

### Model Functions

Model functions contains methods that work as an intermediary between the routes and the models so that the route code is simple and only focuses on authentication/authorization handling.

### Routes

Routes are the entry point for all calls made to the API. There should be a route for every call made to the API. Routes also contain the logic for whether a request is allowed or not, and should deny entry to invalid or unauthorized requests. Routes will use model functions to interact with the data.

