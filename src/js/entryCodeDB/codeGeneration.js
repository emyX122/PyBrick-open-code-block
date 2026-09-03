//Fonction scann code
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