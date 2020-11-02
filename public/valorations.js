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
var val2text={
  0:'Not voted',
  1:'Liked',
  2:'Dislike',
  3:'Seen',
  4:'Repeat'
}
var val2color={
  0:'gray',
  1:'#009900',
  2:'#ff5050',
  3:'#3366ff',
  4:'#ffcc00'
}

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
  document.getElementById("user1").innerHTML = user;
  document.getElementById("user2").innerHTML = other_user;

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
  var table = document.getElementById("table_valorations");
  var num_elements = 0;

  for(let i = 0; i < max_ind; i++){
    if(i in relations){
      if(relations[i][user] != 0){

        var row = table.insertRow(-1);
        var cell = row.insertCell(-1);
        cell.innerHTML = num_elements;
        cell.style.fontWeight = "bold";
        num_elements += 1;
        var cell = row.insertCell(-1);
        cell.innerHTML = info_films[i]['title']
        var cell = row.insertCell(-1);

        var div = document.createElement("div");
        div.classList.add("dropdown");
        div.setAttribute('id', 'dropdown'+i);
        cell.appendChild(div);
        addDropdown(i);

        var cell = row.insertCell(-1);
        cell.innerHTML = val2text[relations[i][other_user]]
        cell.style.color = val2color[relations[i][other_user]]
      }
    }
  }
}

function addDropdown(id){
  var div = document.getElementById('dropdown'+id);

  button = document.createElement("button");
  button.classList.add("btn");
  button.classList.add("btn-secondary");
  button.classList.add("dropdown-toggle");
  button.setAttribute("type", 'button');
  button.setAttribute("id", 'dropDownMenu'+id);
  button.setAttribute("data-toggle", 'dropdown');
  button.setAttribute("aria-haspopup", 'true');
  button.setAttribute("aria-expanded", 'false');
  div.appendChild(button);
  putDropdown(id, relations[id][user], false);

  div2 = document.createElement("div");
  div2.classList.add("dropdown-menu");
  div2.setAttribute("aria-labelledby", 'dropdownMenu');

  but1 = document.createElement("button");
  but1.classList.add("dropdown-item");
  but1.setAttribute("type", "button");
  but1.setAttribute("onclick", 'putDropdown('+id+', 1, true)');
  but1.innerHTML = val2text[1];
  div2.appendChild(but1);
  but2 = document.createElement("button");
  but2.classList.add("dropdown-item");
  but2.setAttribute("type", "button");
  but2.setAttribute("onclick", 'putDropdown('+id+', 2, true)');
  but2.innerHTML = val2text[2];
  div2.appendChild(but2);
  but3 = document.createElement("button");
  but3.classList.add("dropdown-item");
  but3.setAttribute("type", "button");
  but3.setAttribute("onclick", 'putDropdown('+id+', 3, true)');
  but3.innerHTML = val2text[3];
  div2.appendChild(but3);
  but4 = document.createElement("button");
  but4.classList.add("dropdown-item");
  but4.setAttribute("type", "button");
  but4.setAttribute("onclick", 'putDropdown('+id+', 4, true)');
  but4.innerHTML = val2text[4];
  div2.appendChild(but4);

  div.appendChild(div2);
}

function putDropdown(id, newVal, updateVal){
  document.getElementById('dropDownMenu'+id).innerHTML=val2text[newVal];
  document.getElementById('dropDownMenu'+id).style.backgroundColor=val2color[newVal];

  if(updateVal){
    updateValue(id, newVal);
  }
}

async function updateValue(id, relation){
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
