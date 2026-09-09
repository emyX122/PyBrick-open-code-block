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
                    let elementToCompile = subElement.innerHTML.replaceAll(" ", "_").replaceAll("$", "§").replaceAll("#", "-");
                    //control si l'élément à des settings
                    if (subElement.hasAttribute("data-settings")) {
                        //Majuscule
                        if (subElement.getAttribute("data-settings") == "uppercase") {
                            //insertion en mettant tout en majuscule
                            elementToCompile = elementToCompile.toUpperCase();
                        }
                    }
                        
                    //insertion du code
                    setupCodeCompiled = setupCodeCompiled.replace(subElement.getAttribute("data-variable"), elementToCompile);

                    //control si il y à un lien avec un type de device
                    if (subElement.hasAttribute("data-device") && !element.parentElement?.classList.contains("panel-menu-submenu")) {
                        //mettre à jour tout les éléments
                        updateDeviceLink(false, subElement.getAttribute("data-device"), elementToCompile, subElement);
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

    //mise é jour de l'élément
    element.dataset.compiledCodeSetup = setupCodeCompiled;
}

//Fonction scann code pour compilation
function codeScanning() {
    compiledCode = "";

    //scan des élément import
    importScan();

    //scan des élément setup 
    setupScan();

    //scan des blocks valides
    globalCodeScanning(true);

    //scan des blocks non valides
    globalCodeScanning(false);

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
    scannedCode = [];

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
            }
        }
    });

    //génération d'un code compilé
    scannedCode.forEach(code=>{
        compiledCode = compiledCode + code + "\n";
    });
}

//mettre à jour les lien des éléments
function updateDeviceLink(forceScan, typeDevice, deviceName, subElement) {
    //force le scan de tout les éléments dans le canva container
    if (forceScan) {
        resetSetupDevice();
        canvasContainers.querySelectorAll(".canva-global-block-default").forEach(subElementAll=>{
            //control si il y à un lien avec un type de device
            if (subElementAll.hasAttribute("data-device")) {
                //mettre à jour tout les éléments
                updateDeviceLink(false, subElementAll.getAttribute("data-device"), subElementAll.innerHTML.replaceAll(" ", "_").replaceAll("$", "§").replaceAll("#", "-"), subElementAll);
            }
        });
        updateDeviceOptions(true);

    } else {
        //entrée pour chaque type différent
        JSON.parse(typeDevice).forEach(type=>{
            //control si l'élément exist déjà
            if (allSetupDeviceLink[type].indexOf(subElement) >= 0) {
                //change la valeur à l'emplacement de l'élément
                allSetupDevice[type][allSetupDeviceLink[type].indexOf(subElement)] = deviceName;
            } else {
                //entrée de type hub
                allSetupDevice[type].push(deviceName);
                //ajout du lien à l'élément
                allSetupDeviceLink[type].push(subElement);
            }

            updateDeviceOptions(false, type);
        });
    }
}

//mise à jour des selecteur d'un type de device
function updateDeviceOptions(updateAll, typeDevice) {
    //control s'il faut mettre à jour tout les éléments
    if (updateAll) {
        //selectionne tous les élément avec un data-link-device
        document.querySelectorAll("[data-link-device]").forEach(element=>{
            //initialisation du contenu et de l'encien contenu et de la valeur
            const optionsDevice = [];
            const oldSelected = element.value;
            //vide les options actuel
            element.innerHTML = null;

            //control si l'élément à un placholder
            if (element.hasAttribute("data-default-text")) {
                //création du placeholder
                optionsDevice.push(document.createElement('option'));
                //control si le placeholder était l'élément selectionné et le selectionne
                if (element.getAttribute("data-default-text") == oldSelected || oldSelected == "None") {
                    optionsDevice[optionsDevice.length-1].setAttribute('selected', '');
                }
                //désactive le placholder et insert le text par default
                optionsDevice[optionsDevice.length-1].setAttribute('disabled', '');
                optionsDevice[optionsDevice.length-1].textContent = element.getAttribute("data-default-text");
                optionsDevice[optionsDevice.length-1].setAttribute('value', 'None');
            }

            //control chaque type de device
            JSON.parse(element.getAttribute("data-link-device")).forEach(type=>{
                //pour chaque type liste tout les nom d'élément
                allSetupDevice[type].forEach(deviceLink=>{
                    //création de l'option
                    optionsDevice.push(document.createElement('option'));                     
                    //insertion du text complet de l'option
                    optionsDevice[optionsDevice.length-1].textContent = deviceLink;
                    //control si l'option était selectionné et le selectionne
                    if (deviceLink == oldSelected) {
                        optionsDevice[optionsDevice.length-1].setAttribute('selected', '');
                    }
                });
            });

            //entre toutes les option dans le selecteur
            for (let i = 0; i < optionsDevice.length; i++) {
                element.appendChild(optionsDevice[i]);
            }

            //met à jour le contenu et la taille de l'élément
            resize(element);

        });
    } else {
        //selectionne tous les élément avec un data-link-device
        document.querySelectorAll("[data-link-device]").forEach(element=>{
            //control que le type de device est le même que le modifier
            if (JSON.parse(element.getAttribute("data-link-device")).includes(typeDevice)) {
                //initialisation du contenu et de l'encien contenu et de la valeur
                const optionsDevice = [];
                const oldSelected = element.value;
                //vide les options actuel
                element.innerHTML = null;

                //control si l'élément à un placholder
                if (element.hasAttribute("data-default-text")) {
                    //création du placeholder
                    optionsDevice.push(document.createElement('option'));
                    //control si le placeholder était l'élément selectionné et le selectionne
                    if (element.getAttribute("data-default-text") == oldSelected || oldSelected == "None") {
                        optionsDevice[optionsDevice.length-1].setAttribute('selected', '');
                    }
                    //désactive le placholder et insert le text par default
                    optionsDevice[optionsDevice.length-1].setAttribute('disabled', '');
                    optionsDevice[optionsDevice.length-1].textContent = element.getAttribute("data-default-text");
                    optionsDevice[optionsDevice.length-1].setAttribute('value', 'None');
                }

                //control chaque type de device
                JSON.parse(element.getAttribute("data-link-device")).forEach(type=>{
                    //pour chaque type liste tout les nom d'élément
                    allSetupDevice[type].forEach(deviceLink=>{
                        //création de l'option
                        optionsDevice.push(document.createElement('option'));                     
                        //insertion du text complet de l'option
                        optionsDevice[optionsDevice.length-1].textContent = deviceLink;
                        //control si l'option était selectionné et le selectionne
                        if (deviceLink == oldSelected) {
                            optionsDevice[optionsDevice.length-1].setAttribute('selected', '');
                        }
                    });
                });

                //entre toutes les option dans le selecteur
                for (let i = 0; i < optionsDevice.length; i++) {
                    element.appendChild(optionsDevice[i]);
                }

                //met à jour le contenu et la taille de l'élément
                resize(element);

            }
        });
    }
}

//scan des bloques de code normal et volant
function globalCodeScanning(startedBlocks) {
    scannedCode = [];

    //scann tout les élément canva
    canvasContainers.querySelectorAll(".canvas-code").forEach(container => {
        //contrôle si le container est à bien du data type
        if (container.hasAttribute("data-type")) {
            //contrôl si le container est de type code
            if (container.getAttribute("data-type") == "code") {
                //fait soit les élément started soit les autres
                if (!startedBlocks && !Number(container.getAttribute("data-started"))) {
                    //mets le code en commentaire
                    scannedCode.push('"""');

                    //affiche les position du container
                    scannedCode.push('#'+container.style.getPropertyValue('--position-x')+'/'+container.style.getPropertyValue('--position-y'));

                    //scan de tout les blocks du container
                    Array.from(container.children).forEach(block=>{
                        if (block.hasAttribute("data-compiled-code-code")) {
                            scannedCode.push(block.getAttribute("data-compiled-code-code").replaceAll('"', ""));
                        }
                    });

                    //fin du commentaire
                    scannedCode.push('"""');

                } else if (startedBlocks && Number(container.getAttribute("data-started"))) {
                    //affiche les position du container
                    scannedCode.push('#'+container.style.getPropertyValue('--position-x')+'/'+container.style.getPropertyValue('--position-y'));

                    //scan de tout les blocks du container
                    Array.from(container.children).forEach(block=>{
                        if (block.hasAttribute("data-compiled-code-code")) {
                            scannedCode.push(block.getAttribute("data-compiled-code-code").replaceAll('"', ""));
                        }
                    });

                }
            }
        }
    });

    //génération d'un code compilé
    scannedCode.forEach(code=>{
        compiledCode = compiledCode + code + "\n";
    });
}