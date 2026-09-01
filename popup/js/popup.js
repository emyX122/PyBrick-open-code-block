//contrôl au démarrage
console.log('PybrickCodeBlock is runing !!');

//bouton report issue
document.getElementById("issueButton").addEventListener("click", () => {
    window.open('https://github.com/emyX122/PyBrick-open-code-block/issues', '_blank');
});

//bouton github respository
document.getElementById("imageGithub").addEventListener("click", () => {
    window.open('https://github.com/emyX122/PyBrick-open-code-block', '_blank');
});

//bouton github emyX122
document.getElementById("avatarImage").addEventListener("click", () => {
    window.open('https://github.com/emyX122', '_blank');
});

//bouton settings
document.getElementById("settingsButton").addEventListener("click", () => {
    document.getElementById("leftMenu").classList.toggle("active");
});

// initialisation du localStorage
if (localStorage.getItem("langage")) {
    document.getElementById("langageSelector").value = localStorage.getItem("langage");
}

//sauvegard
document.getElementById("saveButton").addEventListener("click", () => {
    const langage = document.getElementById("langageSelector").value;
    //enregistrement de la langue dans le storage local
    localStorage.setItem("langage", langage);
    //message de rechargement
    alert("To change the langage, we need to reload the page");
    chrome.tabs.reload(); 
});

