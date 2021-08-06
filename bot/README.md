# Streamfinder Bot

What should a bot do?

- Take snapshots of imdb/rotten tomatoes for data
- Create new titles
- Update existing titles
- Check availability on different streaming platforms
- Check availability in different countries

**Automatically do above tasks**

## Tables

- `bots(bot_id, description, process, vpn, status)`
- `tasks(task_id, type, data, status, started, finished)`
- `bot-requests(bot_id, url, method, body_data, status, reviewed_date)` => for making changes to the titles that are first reviewed by an admin/moderator.
