# Streamfinder Bot

What should a bot do?

- Take snapshots of imdb/rotten tomatoes for data
- Create new titles
- Update existing titles
- Check availability on different streaming platforms
- Check availability in different countries

### Webcrawler bot -> finds new titles / links

1. 


### Snapshot bot -> collects basic info (rel_date, name, runtime)

1. Take snapshot and save with time
2. If title does not yet exist put in POST request
3. If title does exist check if snapshot is different then last snapshot, if so put in PUT request

### Streaming serivce bot -> check streaming service links to see if title is available

1. If title contains link check link and update accordingly
2. If title does not contain link search for it and add if found

### Cover image bot -> find useable cover images and upload them for later use

**Automatically do above tasks**

What needs to be reviewed by moderators?

1. Bot requests to create titles
2. Bot requests to update titles
3. Titles with incomplete data
4. Error reports from users

## Tables

- `snapshot(service, link, data, ver, time)`
- `moderator-review()`
- `bots(bot_id, description, process, vpn, status)`
- `tasks(task_id, type, url, status, started, finished)`
  - type -> imdb-snapshot, netflix-snapshot, netflix-us, netflix-ca
  - status -> waiting, running, finished
- `bot-requests(bot_id, url, method, body_data, status, reviewed_time)` => for making changes to the titles that are first reviewed by an admin/moderator.

All bots:
- webcrawler for finding links
- snapshot bot who takes snapshots of links
- streaming service updater who connects through vpn

How to turn snapshots into title entries?

- some sort of content review process with a real person

**Tables**

- `bots(bot_id, online, status)`
- `snapshots(link_id, data, ver, time)`
- `tasks(task_id, bot_id, type, url, status, started, finished)`
  - status -> pending, running, finished, canceled
- `dclinks(link_id, link)`

Task Types
- Snapshot
- Crawl link
- Crawl link and add links
- Sleep
- Check availability of streaming service title

Bot Queuer: responsible for queuing tasks for the bot to perform

- Connect different links to one title entry.
- Take snapshots of websites
- Find titles with missing data and update it with stuff found online

# API

- `/dc/bots`
- `/dc/bots/:botId`
- `/dc/bots/:botId/queue/:queueType`
- `/dc/bots/:botId/tasks`
- `/dc/tasks/:taskId`
- `/dc/links`
- `/dc/links/:linkId`
- `/dc/links/:linkId/snapshots`

How to generate tasks?

How to find links?

- crawler

approval types ie. what can the bot/users request to do?

- create new movie/show
- edit movie/show
- delete movie/show
- upload image
- edit image details
- delete image