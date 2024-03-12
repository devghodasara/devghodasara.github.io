const modeSwitch = document.getElementById('themeSwitch');
const header = document.getElementsByTagName("header")[0];
var animateDev = document.querySelectorAll('.alternate-text');
const body = document.body;

modeSwitch.addEventListener('change', () => {
    localStorage.setItem('themePreference',modeSwitch.checked ? 'dark' : 'light');
    if (modeSwitch.checked) {
        body.classList.add('dark-mode');
    }
    else {
        body.classList.remove('dark-mode');
    }
});

document.addEventListener('DOMContentLoaded', function (){
    
    const savedThemePreference = localStorage.getItem('themePreference');
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if(window.location.href.indexOf("resume.html") > -1){
        header.style.boxShadow = 'none';
    }

    if (savedThemePreference) {
        if (savedThemePreference === 'dark'){
            modeSwitch.checked = true;
            body.classList.add('dark-mode');
        }
    }
    else if (prefersDarkMode) {
        modeSwitch.checked = true;
        body.classList.add('dark-mode');
    }
    else {
        console.log('here');
        modeSwitch.checked = false;
        body.classList.remove('dark-mode');
    }
});

function displayMenu() {

    const toggleMenu = document.querySelector('.toggle-menu');
    const header = document.getElementsByTagName('header')[0];
    const menu = document.querySelector('.sections');
    const themeSwitch = document.querySelector('.theme-toggle');

    if (toggleMenu.textContent === '☰')
    {
        menu.classList.add('show');
        themeSwitch.classList.add('show');
        toggleMenu.textContent = '✕';
    }

    else
    {
        menu.classList.remove('show');
        themeSwitch.classList.remove('show');
        toggleMenu.textContent = '☰'
    }
}

function flickerText(){
    body.classList.toggle('alternate')
}

setInterval(flickerText,2000);