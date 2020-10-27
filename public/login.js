async function checkUser(){
  //retrieve if the user is in the database or not
  console.log('function checkuser');
  let user = {
    username: document.getElementsByName("name_in")[0].value,
    password: document.getElementsByName("pass_in")[0].value
  };
  const data2 = {user};

  //POST
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data2)
  };
  const posting = await fetch('/checkUsr', options);
  const checkpass = await posting.json();
  console.log('checkpass: '+checkpass.status);

  if(checkpass.status == 'succes'){
    console.log('succesfull');
    window.location.href='/main.html?user='+document.getElementsByName("name_in")[0].value;
    // window.location.href='/main.html';
  }else if(checkpass.status == 'wrong'){
    console.log('wrongly');
  }else{
    console.log('An error appeared!');
  }
}
