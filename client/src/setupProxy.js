const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(proxy('/summoner', { target: 'https://na1.api.riotgames.com/tft', changeOrigin: true }));
  app.use(proxy('/league', { target: 'https://na1.api.riotgames.com/tft', changeOrigin: true  }));
  app.use(proxy('/by-puuid', { target: 'https://americas.api.riotgames.com/tft/match/v1/matches', changeOrigin: true  }));
  app.use(proxy('/matches', { target: 'https://americas.api.riotgames.com/tft/match/v1', changeOrigin: true  }));
}