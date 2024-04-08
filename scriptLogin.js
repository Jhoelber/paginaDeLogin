window.sr = ScrollReveal({ reset: true });

sr.reveal('.mulherMexendoTotem', {
    rotate: { x: 0, y: 0, z: 0 },
    origin: 'left',
    duration: 1000,
    distance: '1000px'

});




sr.reveal('.shakeshake', {
  rotate: { x: 9, y: 9, z: 9 },
  origin: 'left',
  duration: 2500,
  distance: '1000px'

});

sr.reveal('.shakeshake1', {
  rotate: { x: 0, y: 0, z: 0 },
  origin: 'left',
  duration: 2800,
  distance: '1000px'

});

sr.reveal('.shakeshake2', {
  rotate: { x: 0, y: 0, z: 0 },
  origin: 'left',
  duration: 3000,
  distance: '1000px'

});

sr.reveal('.shakeshake3', {
  rotate: { x: 0, y: 0, z: 0 },
  origin: 'left',
  duration: 4000,
  distance: '1000px'

});
sr.reveal('.shakeshake4', {
  rotate: { x: 0, y: 0, z: 0 },
  origin: 'left',
  duration: 4000,
  distance: '1000px'

});





sr.reveal('.loginLogin', {
    rotate: { x: 0, y: 20, z: 0 },
    origin: 'rigth',
    duration: 1000,
    distance: '200px'

});


sr.reveal('.cadastro', {
    rotate: { x: 0, y: 0, z: 0 },
    origin: 'rigth',
    duration: 1000,
    distance: '900px'

});

sr.reveal('.imagemDentroGRID', {
    rotate: { x: 0, y: 40, z: 0 },
    duration: 1000,
    distance: '90px'

});

let isLoggedIn = false;


function openLogin() {
  document.getElementById('login').style.display = 'block';
}


function closeLogin() {
  document.getElementById('login').style.display = 'none';
}


document.getElementById('externalLink').addEventListener('click', function(event) {
 
  event.preventDefault();

});


document.querySelector('.close').addEventListener('click', function() {
  closeLogin();
});


document.getElementById('loginForm').addEventListener('submit', function(event) {
  
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('passwordDados').value;
  if (username === 'user' && password === 'user' || username === '123' && password === '123') {
    
    isLoggedIn = true;
   
    closeLogin();
    
    window.location.href = './index.html';
  } else {
    
    document.getElementById('loginError').style.display = 'block';
  }
});

