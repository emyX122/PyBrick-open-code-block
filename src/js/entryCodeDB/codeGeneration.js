//Fonction scann code
function codeScanning() {
    //scann tout les élément div en mode setup
    canvasContainers.querySelectorAll(".canvas-code").forEach(container => {
        //contrôle si le container à bien un type
        if (container.hasAttribute("data-type")) {
            //contrôle si le container à un début
            if (container.getAttribute("data-started")) {
                //génération d'un code d'exemple
                scannedCode = "#block started";
                injectCodeToPybricks(scannedCode)
            }
        } else {
            console.error("error : div canva blocks without any type");
        }
    });
}