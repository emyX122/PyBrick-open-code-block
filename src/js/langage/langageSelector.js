//extraction des fichiers json langues
async function extractLangageFile(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("fichier json:", file);
        console.log("langue decompacté :", data);
        extractLangage = data;
    } catch (error) {
        return console.error('Failed to fetch data:', error);
    } 
}

//génération de la langue (appeler dans blockGeneration.js)
async function generatLangage() {
    const filename = langageFileLocalisation + selectedLangage +".json";
    await extractLangageFile(filename);
    generateTitleMenu()
}

//fonction pour récupérer la traduction d'un text
function getTraduction(text) {
    if (extractLangage[text]) {
        return extractLangage[text];
    } else {
        return text;
    }
}

//au démarrage si le langage est selectionné, l'utiliser
if (allLangage.includes(localStorage.getItem("langage"))) {
    selectedLangage = localStorage.getItem("langage");
}