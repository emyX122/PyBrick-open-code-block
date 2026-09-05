//fonction pour trouvé tout les éléments à recharger
function findBlockToScan(element) {
    let elementParent = element.target;
    //recherche l'élément à un parent qui montre que c'est un bloque
    while(elementParent.parentElement && !elementParent.classList.contains("canva-base-block")){
        elementParent = elementParent.parentElement;
    }
    if (elementParent.classList.contains("canva-base-block")){
        //rechargement du code source
        blockCodeScanning(elementParent)
    }

    //mise à jour du code
    updateAllCanva();
}

//fonction scann des blocks pour code
function blockCodeScanning(element) {
    let setupCodeCompiled = "";
    let globalCodeCompiled = "";

    //scan des élément avec du code setup
    if (element.hasAttribute("data-code-setup")) {
        setupCodeCompiled = element.getAttribute("data-code-setup");

        //scan tout les élément qui peuvent avoir du code
        element.querySelectorAll(".canva-global-block-default").forEach(subElement=>{
            //control si il y à un lien avec une variable
            if (subElement.hasAttribute("data-variable")) {
                //entré de type text
                if (subElement.getAttribute("data-code") == "content-text") {
                    //contenu scanné en remplacent les espace, les $ et les #
                    const elementToCompile = subElement.innerHTML.replaceAll(" ", "_").replaceAll("$", "§").replaceAll("#", "-");
                    //control si l'élément à des settings
                    if (subElement.hasAttribute("data-settings")) {
                        //Majuscule
                        if (subElement.getAttribute("data-settings") == "uppercase") {
                            //insertion en mettant tout en majuscule
                            setupCodeCompiled = setupCodeCompiled.replace(subElement.getAttribute("data-variable"), elementToCompile.toUpperCase());
                        }
                    } else {
                        //insertion simple
                        setupCodeCompiled = setupCodeCompiled.replace(subElement.getAttribute("data-variable"), elementToCompile);
                    }
                }
                //entré de type value
                if (subElement.getAttribute("data-code") == "content-value") {
                    //insertion en remplacent les espace, les $ et les #
                    setupCodeCompiled = setupCodeCompiled.replace(subElement.getAttribute("data-variable"), subElement.value);
                }
            }
        });
    }

    element.dataset.compiledCodeSetup = setupCodeCompiled;
}

//Fonction scann code pour compilation
function codeScanning() {
    scannedCode = [];
    compiledCode = "";

    //scan des élément import
    importScan();

    //scan des élément setup 
    setupScan();

    //injection du code
    injectCodeToPybricks(compiledCode);

    console.log(compiledCode);

}

//sous-fonction scan des div setup
function importScan() {
    let allImport = [];

    //scann tout les élément qui on un form import
    canvasContainers.querySelectorAll(".canva-base-block").forEach(container => {
        //contrôle si le container à bien un import
        if (container.hasAttribute("data-import")) {
            //contrôle que le import n'est pas vide
            if (container.getAttribute("data-import")) {
                JSON.parse(container.getAttribute("data-import")).forEach(fromImport=>{
                    //control si le from existe déjà
                    if (fromImport.from in allImport) {
                        //scan de tout les imports
                        fromImport.import.forEach(dataImport=>{
                            //control si l'élément existe déjà
                            if (!allImport[fromImport.from].includes(dataImport)) {
                                //insertion du import
                                allImport[fromImport.from].push(dataImport);
                            }
                        });
                        
                    } else {
                        //ajout du from
                        allImport[fromImport.from] = [];
                        //ajout des import
                        fromImport.import.forEach(dataImport=>{
                            allImport[fromImport.from].push(dataImport);
                        });
                    }
                })
            }
        }
    });

    //génération d'un code compilé
    for (const key in allImport) {
        //ajout du from
        compiledCode = compiledCode + "from " + key + " import ";

        //ajout des imports
        allImport[key].forEach(data=>{
            if (allImport[key].indexOf(data)) {
                compiledCode = compiledCode + ", ";
            }
            compiledCode = compiledCode + data;
        });

        //à la ligne
        compiledCode = compiledCode + "\n";
    }

    //ajout du à la ligne 
    compiledCode = compiledCode + "\n";
}


//sous-fonction scan des blocks setup
function setupScan() {
    //scann tout les élément canva
    canvasContainers.querySelectorAll(".canvas-code").forEach(container => {
        //contrôle si le container $ bien du code setup
        if (container.hasAttribute("data-type")) {
            //contrôl si le container est de type setup
            if (container.getAttribute("data-type") == "setup") {
                //masque si le container n'as pas de début
                if (!Number(container.getAttribute("data-started"))) {
                    scannedCode.push('"""')
                }

                //affiche les position du container
                scannedCode.push('#'+container.style.getPropertyValue('--position-x')+'/'+container.style.getPropertyValue('--position-y'));

                //scan de tout les blocks du container
                Array.from(container.children).forEach(block=>{
                    if (block.hasAttribute("data-compiled-code-setup")) {
                        scannedCode.push(block.getAttribute("data-compiled-code-setup").replaceAll('"', ""));
                    }
                });

                //fin du masque si le container n'as pas de début
                if (!Number(container.getAttribute("data-started"))) {
                    scannedCode.push('"""')
                }

                //génération d'un code compilé
                scannedCode.forEach(code=>{
                    compiledCode = compiledCode + code + "\n";
                });
            }
        }
    });
}