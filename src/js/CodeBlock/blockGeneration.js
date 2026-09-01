//extraction des fichiers json des blocks
function fetchJSONData(file) {
    return fetch(file)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();  
    })
    .then(data => {
        console.log("fichier json:", file);
        console.log("json decompacté :", data);
        blockInitialisation(false, data);
    })  
    .catch(error => console.error('Failed to fetch data:', error)); 
}

//initialisation des bloques
function blockInitialisation(jsonExtract, data, file) {
    if (jsonExtract) {
        return fetchJSONData(file);
    } else {
        console.log("json decompacté reçu :", data);

        const menuEmplacementID = "panelMenu";
        const iconPath = "../../assets/images/blockMode/blocks/";
        const numberOfKey = Object.keys(data).length;

        for (let keys = 0; keys < numberOfKey; keys++) {
            const key = numberOfKey-keys-1;
            // Sélectionne le conteneur parent spécifique
            const container = document.getElementById(menuEmplacementID+"-"+data[String(key)][0].categorie);
            const titleSeparator = container.querySelector(`a[data-submenu="${data[String(key)][0].submenu}"]`);

            if (container) {
                if (titleSeparator) {
                    // --------------------------------
                    //       création de la base
                    // --------------------------------
                    let htmlChild = [];
                    let htmlSeparatorChild = [];
                    let htmlBlock = document.createElement('span');
                    let selection = "";
                    
                    //base color
                    htmlBlock.classList.add('color-'+data[String(key)][0].class);
                    //génération des data input/output
                    if (data[String(key)][0].connection[0].input) {
                        htmlBlock.dataset.input = 1; //true
                    }else{
                        htmlBlock.dataset.input = 0; //false
                    }
                    if (data[String(key)][0].connection[0].output) {
                        htmlBlock.dataset.output = 1; //true
                    }else{
                        htmlBlock.dataset.output = 0; //false
                    }
                    //base de type code ou setup
                    if (data[String(key)][0].connection[0].type == "code") {
                        //ajout des data
                        htmlBlock.dataset.type = "code";
                        //ajouter la class de base
                        htmlBlock.classList.add('canva-base-block');
                        //input
                        if (data[String(key)][0].connection[0].input) {
                            htmlBlock.classList.add('canva-end-block');
                        }
                        //ouput
                        if (data[String(key)][0].connection[0].output) {
                            htmlChild.push(document.createElement('span'));
                            htmlChild[htmlChild.length-1].classList.add('canva-global-blocks-output');
                        }
                    } else if (data[String(key)][0].connection[0].type == "setup") {
                        //ajout des data
                        htmlBlock.dataset.type = "setup";
                        //ajouter la class de base
                        htmlBlock.classList.add('canva-base-block');
                        //input
                        if (data[String(key)][0].connection[0].output) {
                            htmlBlock.classList.add('canva-end-block-setup');
                        }
                        //ouput
                        if (data[String(key)][0].connection[0].input) {
                            htmlChild.push(document.createElement('span'));
                            htmlChild[htmlChild.length-1].classList.add('canva-global-blocks-setup');
                        }
                    }
                    //icon
                    if (data[String(key)][0].icon) {
                        htmlChild.push(document.createElement('object'));
                        htmlChild[htmlChild.length-1].classList.add('canva-global-blocks-icon');
                        htmlChild[htmlChild.length-1].setAttribute('data', iconPath+data[String(key)][0].icon+".svg");
                        htmlChild[htmlChild.length-1].setAttribute('type', 'image/svg+xml');
                    }
                    //separator
                    htmlChild.push(document.createElement('span'));
                    htmlChild[htmlChild.length-1].classList.add('separator');
                    // --------------------------------
                    //      création du centenu
                    // --------------------------------
                    for (let keyContent = 0; keyContent < (data[String(key)][0].content).length; keyContent++) {
                        let htmlSelectorChild = [];
                        let actualJsonPath = data[String(key)][0].content[keyContent];

                        //selection (affichage dépendant du dernier bloque)
                        if (!actualJsonPath.selection || actualJsonPath.selection.includes(selection)) {
                            //contenu modifiable/static
                            if (actualJsonPath.input) {
                                //entrée en mode selecteur/normal
                                if (actualJsonPath.selector) {
                                    //number
                                    if (actualJsonPath.type == "number") {
                                        htmlSeparatorChild.push(document.createElement('select'));
                                        htmlSeparatorChild[htmlSeparatorChild.length-1].classList.add('canva-global-block-number-case');
                                    }

                                    //text
                                    if (actualJsonPath.type == "text") {
                                        htmlSeparatorChild.push(document.createElement('select'));
                                        htmlSeparatorChild[htmlSeparatorChild.length-1].classList.add('canva-global-block-text-case');                                    
                                    }

                                    //valeur par default
                                    if (actualJsonPath.text) {
                                        htmlSelectorChild.push(document.createElement('option'));
                                        htmlSelectorChild[htmlSelectorChild.length-1].setAttribute('selected', '');
                                        htmlSelectorChild[htmlSelectorChild.length-1].setAttribute('disabled', '');
                                        htmlSelectorChild[htmlSelectorChild.length-1].textContent = getTraduction(actualJsonPath.text);
                                    }
                                    //création des options
                                    for (let keySelector = 0; keySelector < (actualJsonPath.selector).length; keySelector++) {
                                        htmlSelectorChild.push(document.createElement('option'));
                                        if (actualJsonPath.selector[keySelector].selected) {
                                            htmlSelectorChild[htmlSelectorChild.length-1].setAttribute('selected', '');
                                            //récupération du redirect pour le mode selector
                                            if (actualJsonPath.selector[keySelector].redirect) {
                                                selection = actualJsonPath.selector[keySelector].redirect;
                                            }
                                        }
                                        htmlSelectorChild[htmlSelectorChild.length-1].textContent = getTraduction(actualJsonPath.selector[keySelector].option);
                                    }
                                    //ajout des entrées du selecteur
                                    for (let i = 0; i < htmlSelectorChild.length; i++) {
                                        htmlSeparatorChild[htmlSeparatorChild.length-1].appendChild(htmlSelectorChild[i]);
                                    }
                                } else {
                                    //text
                                    if (actualJsonPath.type == "text") {
                                        htmlSeparatorChild.push(document.createElement('span'));
                                        htmlSeparatorChild[htmlSeparatorChild.length-1].classList.add('canva-global-block-text-input');
                                        htmlSeparatorChild[htmlSeparatorChild.length-1].setAttribute('contenteditable', 'true');
                                        htmlSeparatorChild[htmlSeparatorChild.length-1].setAttribute('spellcheck', 'false');
                                        htmlSeparatorChild[htmlSeparatorChild.length-1].textContent = getTraduction(actualJsonPath.text);
                                    }

                                    //number
                                    if (actualJsonPath.type == "number") {
                                        htmlSeparatorChild.push(document.createElement('span'));
                                        htmlSeparatorChild[htmlSeparatorChild.length-1].classList.add('canva-global-block-number-case');
                                        htmlSelectorChild.push(document.createElement('span')); //entrée de valeur
                                        htmlSelectorChild[htmlSelectorChild.length-1].classList.add('canva-global-block-default');
                                        htmlSelectorChild[htmlSelectorChild.length-1].classList.add('canva-global-block-number-input');
                                        htmlSelectorChild[htmlSelectorChild.length-1].setAttribute('contenteditable', 'true');
                                        htmlSelectorChild[htmlSelectorChild.length-1].setAttribute('spellcheck', 'false');
                                        htmlSelectorChild[htmlSelectorChild.length-1].textContent = actualJsonPath.value;
                                        htmlSelectorChild.push(document.createElement('a')); //texte unitée de la valeur
                                        htmlSelectorChild[htmlSelectorChild.length-1].classList.add('canva-global-block-text');
                                        htmlSelectorChild[htmlSelectorChild.length-1].textContent = getTraduction(actualJsonPath.text);
                                        //ajout des entrées du selecteur
                                        for (let i = 0; i < htmlSelectorChild.length; i++) {
                                            htmlSeparatorChild[htmlSeparatorChild.length-1].appendChild(htmlSelectorChild[i]);
                                        }
                                        
                                    }
                                }
                                
                                //ajout de la class global
                                htmlSeparatorChild[htmlSeparatorChild.length-1].classList.add('canva-global-block-default');
                            } else {
                                //text
                                if (actualJsonPath.type == "text") {
                                    htmlSeparatorChild.push(document.createElement('a'));
                                    htmlSeparatorChild[htmlSeparatorChild.length-1].classList.add('canva-global-block-text');
                                    htmlSeparatorChild[htmlSeparatorChild.length-1].textContent = getTraduction(actualJsonPath.text);
                                }
                            }
                        }
                    }

                    for (let i = 0; i < htmlSeparatorChild.length; i++) {
                        htmlChild[htmlChild.length-1].appendChild(htmlSeparatorChild[i]);
                    }

                    for (let i = 0; i < htmlChild.length; i++) {
                        htmlBlock.appendChild(htmlChild[i]);
                    }                
                    

                    //inserition de l'élément
                    titleSeparator.insertAdjacentElement('afterend', htmlBlock);

                } else {
                    console.log("erreur json : ce submenu n'existe pas : "+`a[data-submenu="${data[String(key)][0].submenu}"]`);
                }
            } else {
                console.log("erreur json : ce container n'existe pas : "+menuEmplacementID+"-"+data[String(key)][0].categorie);
            }
        }
    }
}

//génération de la langue
generatLangage();

//initialisation des fichiers json
const promises = jsonFiles.map(file => 
    blockInitialisation(true, null, jsonPath + file + ".json")
);

//attendre que tout est terminé
Promise.all(promises).then(() => {
    console.log("generation finished");
});
