var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var user = queryString.split("=")[1];
console.log('User: '+user);
document.getElementById('username').innerHTML = user;


// change font size whether the text is larger or not
// document.getElementById("title").style.fontSize = "";
// xx-small
// x-small
// small
// medium
// large
// x-large
// xx-large

function filmLiked(){
  console.log('Liked')
}
function filmDisliked(){
  console.log('Disliked')
}
function filmSeen(){
  console.log('Seen')
}
function filmRepeat(){
  console.log('Repeat')
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


function optionsButtonON(){
  console.log('button on');
  document.getElementById('options_buttons').style.opacity = "1";
  document.getElementById('optionsON').style.opacity = "1";
  document.getElementById('optionsON').style.zIndex = "2";
  document.getElementById('optionsOFF').style.opacity = "0";
  document.getElementById('optionsOFF').style.zIndex = "1";
}

function optionsButtonOFF(){
  console.log('button off');
  document.getElementById('options_buttons').style.opacity = "0";
  document.getElementById('optionsON').style.opacity = "0";
  document.getElementById('optionsON').style.zIndex = "1";
  document.getElementById('optionsOFF').style.opacity = "1";
  document.getElementById('optionsOFF').style.zIndex = "2";
}
