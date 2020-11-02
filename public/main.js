var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var user = queryString.split("=")[1];
console.log('User: '+user);
document.getElementById('username').innerHTML = user;

// Hide options menu
document.getElementById('options_group_v').style.opacity = "0";
document.getElementById('options_group_h').style.opacity = "0";
document.getElementById('matches_v').disabled = true;
document.getElementById('alone_v').disabled = true;
document.getElementById('valoration_v').disabled = true;
document.getElementById('matches_h').disabled = true;
document.getElementById('alone_h').disabled = true;
document.getElementById('valoration_h').disabled = true;

var users = new Array();
var info_films = {}, images_urls = {}, relations = {};
var max_ind = 0, actual_ind = -1;

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

  response[1].result.forEach((el, index) => {
    images_urls[el['_id']] = el['url'];
  });
  console.log('Example url: ', images_urls['0']);

  var keys = Object.keys(response[2].result[0])
  keys.forEach((el, index) =>{
    if(el != '_id'){
      users.push(el);
    }
  })
  console.log('Users: ', users);

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

  actual_ind = nextNotEvaluated(0, max_ind);
  updateWebValues(actual_ind);
});

function filmLiked(){
  console.log('Liked');
  relations[actual_ind][user] = 1;
  checkMatch(actual_ind);
  updateDatabase(actual_ind, 1);

  actual_ind = nextNotEvaluated(0, max_ind);
  updateWebValues(actual_ind);
}
function filmDisliked(){
  console.log('Disliked')
  relations[actual_ind][user] = 2;
  updateDatabase(actual_ind, 2);

  actual_ind = nextNotEvaluated(0, max_ind);
  updateWebValues(actual_ind);
}
function filmSeen(){
  console.log('Seen')
  relations[actual_ind][user] = 3;
  updateDatabase(actual_ind, 3);

  actual_ind = nextNotEvaluated(0, max_ind);
  updateWebValues(actual_ind);
}
function filmRepeat(){
  console.log('Repeat')
  relations[actual_ind][user] = 4;
  checkMatch(actual_ind);
  updateDatabase(actual_ind, 4);

  actual_ind = nextNotEvaluated(0, max_ind);
  updateWebValues(actual_ind);
}

function showMatches(){
  console.log('List of matches')
  window.location.href='/matches.html?user='+user;
}
function showAlone(){
  console.log('List of alone')
  window.location.href='/alone.html?user='+user;
}
function changeValoration(){
  console.log('Change valoration')
  window.location.href='/valorations.html?user='+user;
}

function optionsButtonONOFF(){
  var opv=document.getElementById('options_group_v').style.opacity;
  var oph=document.getElementById('options_group_h').style.opacity;

  if(opv == 1 || oph == 1){
    console.log('button on/off', 'hide')
    document.getElementById('options_group_v').style.opacity = "0";
    document.getElementById('options_group_h').style.opacity = "0";

    document.getElementById('matches_v').disabled = true;
    document.getElementById('alone_v').disabled = true;
    document.getElementById('valoration_v').disabled = true;
    document.getElementById('matches_h').disabled = true;
    document.getElementById('alone_h').disabled = true;
    document.getElementById('valoration_h').disabled = true;
  }else{
    console.log('button on/off', 'show')
    document.getElementById('options_group_v').style.opacity = "1";
    document.getElementById('options_group_h').style.opacity = "1";

    document.getElementById('matches_v').disabled = false;
    document.getElementById('alone_v').disabled = false;
    document.getElementById('valoration_v').disabled = false;
    document.getElementById('matches_h').disabled = false;
    document.getElementById('alone_h').disabled = false;
    document.getElementById('valoration_h').disabled = false;
  }
}

function nextNotEvaluated(ind, max_ind){
  //**gets the next unevaluated film id, it starts by searching from the ind indicated**//
  var aux_ind = ind;
  var found = false;

  // first will search the next ones for one that hasn't been evaluated
  for(let i = ind; i < max_ind; i++){
    if(i in relations){
      if(relations[i][user] == 0){
        aux_ind = i;
        found = true;
        break;
      }
    }
  }
  // if none has been found, previous ones will be checked
  if(!found){
    for(let i = 0; i < ind; i++){
      if(i in relations){
        if(relations[i][user] == 0){
          aux_ind = i;
          found = true;
          break;
        }
      }
    }
  }
  // if still not, will return -1 flag
  if(found){
    return aux_ind;
  }else{
    return -1;
  }
}

function updateWebValues(ind){
  //** updates the values of the pages with the found unevaluated id **//

  if(ind == -1){
    document.getElementById('image_poster').src = 'images/everythingdone.jpg';
  }else{
    title = document.getElementById('title')
    title.innerHTML = info_films[ind]['title'];
    title_div = document.getElementById('title_div')
    setFontSize(info_films[ind]['title'], title, title_div);

    document.getElementById('year').innerHTML = 'Year: '+info_films[ind]['year'];
    document.getElementById('duration').innerHTML = 'Duration: '+info_films[ind]['duration'];
    document.getElementById('director').innerHTML = 'Director: '+info_films[ind]['director'];
    document.getElementById('genre').innerHTML = 'Genre: '+info_films[ind]['genre'];
    document.getElementById('rating').innerHTML = 'Rating: '+info_films[ind]['rating'];

    document.getElementById('imdb_href').href = 'https://www.imdb.com/title/'+info_films[ind]['imdb_id'];

    document.getElementById('image_poster').src = images_urls[ind];
  }
}

function checkMatch(ind){

  if( (relations[ind][users[0]] == 1 && relations[ind][users[1]] == 1) ||
      (relations[ind][users[0]] == 1 && relations[ind][users[1]] == 4) ||
      (relations[ind][users[0]] == 4 && relations[ind][users[1]] == 1) ){
        $("#matchModal").modal()
  }else{
    console.log('No match found');
  }
}

function setFontSize(text, element, border){
  //** defines the font size of the text in the element that don't surpass the borders **//
  var actual_width = 1000000000;
  var actual_height = 10000000000;
  var actual_font_size = 15;

  while(actual_height > border.offsetHeight || actual_width > border.offsetWidth){
    element.style.fontSize = actual_font_size+'vw';
    actual_height = element.offsetHeight;
    actual_width = element.offsetWidth;
    actual_font_size -= 0.5;
  }
  console.log('Defined font size of: ', actual_font_size);
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

async function updateDatabase(id, relation){
  console.log('Updating database');
  let data = {
    username: user,
    id: id,
    valoration: relation
  };
  const data2 = {data};

  //POST
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data2)
  };
  const posting = await fetch('/updateRelation', options);
  const checkpass = await posting.json();
  console.log('checkpass: '+checkpass.status);

  if(checkpass.status == 'updated'){
    console.log('Succesfully updated');
  }else{
    console.log('An error appeared!');
  }
}
