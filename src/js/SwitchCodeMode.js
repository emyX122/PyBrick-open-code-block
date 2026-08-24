//récupération clé code
let allKeys = "";
let matchingKeys = "";

function reloadKeys() {
    allKeys = Object.keys(sessionStorage);
    matchingKeys = allKeys.filter(key => key.startsWith('editor.activeFileHistory.'));
}

//switch entre le mode code bloque et python
function switchCodeMode(brutForce) {
    const panelCoding = document.querySelector('.pb-editor-tabpanel');
    const panelPythonMode = document.querySelector('.pb-editor-split');
    let panelBlockMode = document.getElementById('panelBlockMode');

    if (!allKeys[1]) {
        reloadKeys();
    }
    console.log("Key :"+allKeys[1]);

    const controleActivCode = sessionStorage.getItem(matchingKeys);

    if (!panelBlockMode) {
        //initialisation du menu
        panelCoding.insertAdjacentHTML('afterbegin', '<iframe id="panelBlockMode" style="height: 100%; width: 100%; display: none;" src="src/html/panelBlockMode.html"></iframe>');
        document.getElementById("panelBlockMode").src = chrome.runtime.getURL('src/html/panelBlockMode.html');
        panelBlockMode = document.getElementById('panelBlockMode'); 
    }

    if ((panelCoding && controleActivCode.length) || brutForce) {
        if (panelPythonMode.style.display == "none"){
            panelPythonMode.style.display = "";
            panelBlockMode.style.display = "none";
        }else{
            panelPythonMode.style.display = "none";
            panelBlockMode.style.display = "";
        }
    }
}