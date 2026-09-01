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
function generatLangage() {
    const filename = langageFileLocalisation + selectedLangage +".json";
    extractLangageFile(filename);
}

//fonction pour récupérer la traduction d'un text
function getTraduction(text) {
    if (extractLangage.Default_Langage) {
        return text;
    } else if (extractLangage[text]) {
        return extractLangage[text];
    } else {
        return text;
    }
}