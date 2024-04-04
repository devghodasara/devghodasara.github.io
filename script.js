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

function clearForm (){
    document.getElementById('contact-form').reset();
    autoResize(document.getElementsByName('message')[0]);
}

function flickerText(){
    body.classList.toggle('alternate')
}

setInterval(flickerText,2000);

function autoResize(textarea) {
    // Reset the height to the default in case the content is deleted
    textarea.style.height = 'auto';
    
    // Set the height to the scroll height of the content
    textarea.style.height = textarea.scrollHeight + 'px';
}

function submitToGoogleForm(event,form) {

    event.preventDefault();

    var formStatus = document.getElementById("form-status");

    var formData = {
        timestamp: new Date().toString(),
        first_name: form.first_name.value,
        last_name: form.last_name.value,
        phone_number: form.phone_number.value,
        email: form.email.value,
        subject: form.subject.value,
        message: form.message.value,
    }

    console.log("Form Data:", formData);
  
    fetch('https://script.google.com/macros/s/AKfycbxb61OMdWG_JwGLKNVm1hn79xvFe_z6Xi_57rCTuTL2zAp_pQ3GNk85CuLo3mkdUro/exec',{
        method: 'POST',
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            formStatus.textContent = "There was a problem submitting form data, please retry!";
            setTimeout(function() {
                formStatus.textContent = "";
            }, 2000);
        }
        // Display success message
        formStatus.textContent = "Form submitted successfully!";
            setTimeout(function() {
                formStatus.textContent = "";
            }, 2000);
        clearForm(); // Clear form after successful submission
    })
    .catch(error => {
        formStatus.textContent = "There was a problem submitting form data, please retry!";
        setTimeout(function() {
            formStatus.textContent = "";
        }, 2000);
    });
}
