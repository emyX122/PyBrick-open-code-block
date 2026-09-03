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
}

//fonction scann des blocks pour code
function blockCodeScanning(element) {
    let setupCodeCompiled = "";
    let globalCodeCompiled = "";

    if (element.hasAttribute("data-code-setup")) {
        setupCodeCompiled = element.getAttribute("data-code-setup");

        element.querySelectorAll(".canva-global-block-default").forEach(subElement=>{
            if (subElement.hasAttribute("data-variable")) {
                if (subElement.getAttribute("data-code") == "content-text") {
                    //insertion en remplacent les espace, les $ et les #
                    setupCodeCompiled = setupCodeCompiled.replace(subElement.getAttribute("data-variable"), subElement.innerHTML.replaceAll(" ", "_").replaceAll("$", "§").replaceAll("#", "-"));
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
    //scann tout les élément div en mode setup
    canvasContainers.querySelectorAll(".canvas-code").forEach(container => {
        //contrôle si le container à bien un type
        if (container.hasAttribute("data-type")) {
            //le type est-il setup
            if (container.getAttribute("data-type") == "setup") {
                //masque si le container n'as pas de début
                if (!Number(container.getAttribute("data-started"))) {
                    scannedCode.push('"""')
                }

                //affiche les position du container
                scannedCode.push('#'+container.style.getPropertyValue('--position-x')+'/'+container.style.getPropertyValue('--position-y'));

                //scan de tout les blocks du container
                Array.from(container.children).forEach(block=>{
                    scannedCode.push(String(block));
                });

                //fin du masque si le container n'as pas de début
                if (!Number(container.getAttribute("data-started"))) {
                    scannedCode.push('"""')
                }

                //génération d'un code compilé
                scannedCode.forEach(code=>{
                    compiledCode = compiledCode + code + "\n";
                });
                injectCodeToPybricks(compiledCode);
            }
        } else {
            console.error("error : div canva blocks without any type");
        }
    });
}