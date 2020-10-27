var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var user = queryString.split("=")[1];
console.log('User: '+user);
