# count-the-things-multiplayer

A simple websocket app for multiple people to count things together.
Created to track occupancy at a Farmer's Market with multiple entrances
and exits.

<img
    src="screenshot.png"
    alt="An image of a counter UI with additon and subtraction buttons."
    style="height: 470px; width:484px;"
/>

For a "single player" variant, see the [static version](https://github.com/MustardForBreakfast/count-the-things) of this project.

## Local Environment Setup

### Prerequisites

You'll need a Redis server running on your development machine. Follow
the installation steps outlined in the [Redis Quick Start Guide](https://redis.io/topics/quickstart),
abbreviated here:

``` bash
curl -O http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
sudo make install
```

Then, start the redis server:
``` bash
$ redis-server
```

### Setup

```
npm install
npm run start
```
Then visit `http://localhost:8765` in your web browser of choice.

### Testing with Multiple Client Devices

I recommend using [ngrok](https://www.npmjs.com/package/ngrok) for this use case, which publicly
exposes your local web server via a network tunnel:
``` bash
npm install ngrok -g
ngrok http 8765 # after starting the application
```

Your terminal should display a public URL for all client devices to connect to.

Given the ephemeral nature of `ngrok` urls, it is impractical to whitelist them
in the app's Content Security Policy headers. While testing with `ngrok`, it may
be necessary to temporarily disable the CSP by commenting out the `expressCspHeader`
config in `app/index.js`.

*For obvious reasons, one should not leave the CSP disabled on a permanent*
*production deployment.*