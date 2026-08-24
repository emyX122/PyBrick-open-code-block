// -----------------------
//        Fonctions
// -----------------------
function removeUndesirableElement() {
    const DefaultModeBlock = document.querySelector('.bp5-control.bp5-radio');
    const DefaultModeBlockAll = document.querySelectorAll('.bp5-control.bp5-radio').length;
    const buttonSponsor = document.getElementById("pb-toolbar-sponsor-button");
    
    //retirage du mode de programmation par block d'origine
    if (DefaultModeBlock && DefaultModeBlockAll != 1 && DefaultModeBlockAll != 8 ) {
        DefaultModeBlock.remove();
    }

    //retirage du bouton de sponsor original
    if (buttonSponsor) {
        buttonSponsor.remove();
    }
}

function changeUndesirableElement() {
    const imageCodeWithPython = document.querySelector('img[src="/static/media/python.0cdb7a2859bff989b339.png"]');

    //changement de l'image du nouveau mode de codage
    if (imageCodeWithPython) {
        imageCodeWithPython.src = chrome.runtime.getURL('assets/images/PyBlock.png');
    }
}

function addHtmlElement() {
    const conteneurSwitchButton = document.querySelector('.pb-app-side-view-buttons');
    const switchButtonControl = document.getElementById('switchCodeButton');
    const buttonSponsor = document.querySelector(".pb-align-right");
    const buttonSponsorControl = document.getElementById("sponsorButton");

    //ajout du boutonde switch entre les modes de codages
    if (conteneurSwitchButton && !switchButtonControl) {
        conteneurSwitchButton.insertAdjacentHTML('afterbegin', '<button id="switchCodeButton" type="button" title="Switching between block and python" class="bp5-button bp5-large bp5-intent-primary"><span aria-hidden="true" class="bp5-icon bp5-icon-console"><img id="switchCodeButtonImage" style="height: 18px" src=""></span></button>');
        document.getElementById("switchCodeButtonImage").src = chrome.runtime.getURL('assets/images/PyBrickIcoSwitchButton.svg');

        document.getElementById('switchCodeButton').addEventListener('click', () => {
            switchCodeMode(false);
        });
    }

    //ajout du bouton de sponsor personnel
    if (buttonSponsor && !buttonSponsorControl) {
        buttonSponsor.innerHTML = '<img id="sponsorButton" style="height: 60px;" src="">';
        document.getElementById("sponsorButton").src = chrome.runtime.getURL('assets/images/sponsorButton.svg');
    }
}

// -----------------------
//        Script
// -----------------------
removeUndesirableElement();
changeUndesirableElement();
addHtmlElement();

// Surveillance des changements dynamiques avec MutationObserver
const observer = new MutationObserver((mutations) => {
    if (document.querySelector('#panelBlockMode')) {
        if (document.getElementById('panelBlockMode').style.display != "none" && !sessionStorage.getItem(matchingKeys)[3]) {
            switchCodeMode(true);
        }
    }
    
    removeUndesirableElement();
    changeUndesirableElement();
    addHtmlElement();
});

// On observe le body (ou un conteneur plus précis) pour les ajouts de nœuds enfants
observer.observe(document.body, {
    childList: true,
    subtree: true
});
