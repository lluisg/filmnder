var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var user = queryString.split("=")[1];
console.log('User: '+user);

// Hide options menu
document.getElementById('options_group_v').style.opacity = "0";
document.getElementById('options_group_h').style.opacity = "0";
document.getElementById('matches_v').disabled = true;
document.getElementById('alone_v').disabled = true;
document.getElementById('valoration_v').disabled = true;
document.getElementById('matches_h').disabled = true;
document.getElementById('alone_h').disabled = true;
document.getElementById('valoration_h').disabled = true;

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

function optionsButtonONOFF(){
  console.log('button on/off');
  var opv=document.getElementById('options_group_v').style.opacity;
  var oph=document.getElementById('options_group_h').style.opacity;

  if(opv == 1 || oph == 1){
    console.log('hide')
    document.getElementById('options_group_v').style.opacity = "0";
    document.getElementById('options_group_h').style.opacity = "0";

    document.getElementById('matches_v').disabled = true;
    document.getElementById('alone_v').disabled = true;
    document.getElementById('valoration_v').disabled = true;
    document.getElementById('matches_h').disabled = true;
    document.getElementById('alone_h').disabled = true;
    document.getElementById('valoration_h').disabled = true;
  }else{
    console.log('show')
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
