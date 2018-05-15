var localtunnel = require('localtunnel');
localtunnel(
  5000,
  {
    subdomain: 'thisisaverrrylongsentenceandhopefulywebhooooksworksyethistime'
  },
  function(err, tunnel) {
    console.log('LT running');
  }
);
