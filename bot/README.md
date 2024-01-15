# Streamfinder Bot

A NodeJS server running a puppeteer web crawler that collects data from IMDB, Rotten Tomatoes, and all the provided streaming platforms (Netflix, Hulu, Amazon Prime, etc.).

This part is uncomplete so currently all data was manually added through the admin website.

## Workflow

### Step 1: Getting title links

- Method 1: Using the search page
   - Iterate over a table of movie/show names and search using the IMDb and RT search pages.
   - Add all links found on the page to the links table.
   - Searched pages are then marked in the name table.
- Method 2: Crawler page
   - Check the home, new, popular page every hour for new additions.

### Step 2: Snapshot the link task

- Trigger 1: No snapshot exists for the link.
- Trigger 2: The most recent snapshot is 1 month old.

### Step 3: Push changes to snapshot

- Manually review and approve / deny by a moderator?

## Major processes running

- Running instances of puppeteer
   - How many instances are run at the same time and how are they assigned tasks?
      - Use bot table I guess
   - Separate RPC API for adding bots / removing

- Adding tasks to instances / creating new tasks
    1. Create task queue by looking for conditions above (triggers for snapshot).
    2. When a bot has no current tasks assign one from the queue.

> Seperate RPC API for the bot commands

## Bot RPC API

- https://trpc.io/

- For running puppeteer instances as well.

- Add more concurrent running puppeteer instance

## Title data

### Movie

- ID - not relevant
- Title - *IMPORTANT!* | Streaming Services > RT > IMDb
- Trailer - Less important -> manual
- Description - *IMPORTANT!* | RT > Streaming Services > IMDb
- Maturity Rating - *LESS IMPMORTANT!* |

In general pick RT or IMDb for the title, desc, maturity rating, and genres.

Availability for streaming services should use their own website (Netflix, Hulu, Disney+).

RT and IMDb rating should come from their website.

**IMPORTANT**

Shows that release a new episode every week need to use the streaming service as the main source.

