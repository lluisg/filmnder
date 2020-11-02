var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var user = queryString.split("=")[1];
console.log('User: '+user);
document.getElementById('username').innerHTML = user;
document.getElementById('back').onclick=function() { window.location.href='/main.html?user='+user };

var users = new Array();
var info_films = {}, relations = {};
var max_ind = 0;
var other_user = "";

getData().then((response) =>{
  response[0].result.forEach((el, index) => {
    info_films[el['_id']] = {
      'director' : el['director'],
      'duration': el['duration'],
      'genre': el['genre'],
      'title': el['original_title'],
      'rating': el['weighted_average_vote'],
      'year': el['year'],
      'imdb_id': el['imdb_title_id']
    }
  });
  console.log('Example info: ', info_films['0']);

  var keys = Object.keys(response[2].result[0])
  keys.forEach((el, index) =>{
    if(el != '_id'){
      users.push(el);
    }
    if(el != user){
      other_user = el;
    }
  })
  console.log('Users: ', users, 'Other: ', other_user);

  // Look at readme file for the valorations table
  response[2].result.forEach((el, index) => {
    relations[el['_id']] = {
      [users[0]]: el[users[0]],
      [users[1]]: el[users[1]]
    };
  });
  console.log('Example relations: ', relations['0']);

  // get maximum value for the key
  Object.keys(relations).forEach(function(key) {
    k = parseInt(key);
      if(k > max_ind){
        max_ind = k;
      }
  });
  updateWebValues();
});

function updateWebValues(){
  //** updates the list of films to see alone**//
  var table = document.getElementById("table_alone");
  var num_elements = 0;

  var list_alone = [];
  for(let i = 0; i < max_ind; i++){
    if(i in relations){
      if((relations[i][user] == 1 || relations[i][user] == 4) && (relations[i][other_user] == 1 || relations[i][other_user] == 4)){
        var row = table.insertRow(-1);
        var cell = row.insertCell(-1);
        cell.innerHTML = num_elements;
        cell.style.fontWeight = "bold";
        num_elements += 1;
        var cell = row.insertCell(-1);
        cell.innerHTML = info_films[i]['title']
        var cell = row.insertCell(-1);
        cell.innerHTML = info_films[i]['year']
        var cell = row.insertCell(-1);
        cell.innerHTML = info_films[i]['duration']
        var cell = row.insertCell(-1);
        cell.innerHTML = info_films[i]['genre']
        var cell = row.insertCell(-1);
        cell.innerHTML = info_films[i]['rating']

        if(relations[i][other_user] == 4 || relations[i][user] == 4){
          row.classList.add("table-warning");
        }
      }
    }
  }
}

async function getData(){
  // Get Films info
  const response_info = await fetch('getInfo/');
  const json_info = await response_info.json();
  console.log('DB Info received: ', json_info);

  // Get url's Images
  const response_urls = await fetch('getUrls/');
  const json_url = await response_urls.json();
  console.log('DB URLS received: ', json_url)

  // Get Relations of the Users
  const response_rel = await fetch('getRelations/');
  const json_rel = await response_rel.json();
  console.log('DB Relations received: ', json_rel)

  return [json_info, json_url, json_rel];
};
