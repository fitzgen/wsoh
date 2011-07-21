// session admin loop configured under same path as app page
var cowebConfig = {adminUrl : './admin'};
// js libs initialized here too
require({
  paths : {
    coweb : 'lib/coweb',
    org : 'lib/org'
  }
}, ['pragmatico']);