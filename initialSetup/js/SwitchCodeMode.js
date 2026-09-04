//récupération des clés
function reloadKeys() {
    allKeys = Object.keys(sessionStorage);
    matchingKeys = allKeys.filter(key => key.startsWith('editor.activeFileHistory.'));
}

//switch entre le mode code bloque et python
function switchCodeMode(brutForce) {
    const panelCoding = document.querySelector('.pb-editor-tabpanel');
    const panelPythonMode = document.querySelector('.pb-editor-split');
    let panelBlockMode = document.getElementById('panelBlockMode');

    if (!brutForce) {
        reloadKeys();
        console.log("Key :"+allKeys[1]);

        controleActivCode = sessionStorage.getItem(matchingKeys[0])[2];
    }

    if (!panelBlockMode && controleActivCode) {
        //initialisation du menu
        panelCoding.insertAdjacentHTML('afterbegin', '<iframe id="panelBlockMode" style="height: 100%; width: 100%; display: none;" src="src/html/panelBlockMode.html"></iframe>');
        document.getElementById("panelBlockMode").src = chrome.runtime.getURL('src/html/panelBlockMode.html');
        panelBlockMode = document.getElementById('panelBlockMode'); 
    }

    if ((panelCoding && controleActivCode) || brutForce) {
        if (panelPythonMode.style.display == "none"){
            location.reload();
        }else{
            panelPythonMode.style.display = "none";
            panelBlockMode.style.display = "";
        }
    }
}