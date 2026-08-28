//ajout des fonction on click au élément du menu
function blockAssignScript() {
    document.querySelectorAll(".canva-base-block").forEach(element => {
        element.addEventListener('mousedown', () => {
            cloneMenuBlocks(element);
        });
    });
}

// gestion de la variable d'état de la sourie
document.addEventListener("mousedown", () => {
    cursorIsDown = true;
    selectedElement = document.elementFromPoint(event.clientX, event.clientY);

    //control si l'élément n'est pas dans le menu
    if (!selectedElement.parentElement.classList.contains("panel-menu-submenu")) {
        //fonction si c'est un bloque
        if (selectedElement.classList.contains("canva-base-block")) {
            // !!!!! ajouter les option pour le déplacement de base
        }  
    } else {
        //fonction si c'est un bloque
        if (selectedElement.classList.contains("canva-base-block")) {
            cloneMenuBlocks(selectedElement);
        }  
    }
});

document.addEventListener("mouseup", () => {
    cursorIsDown = false;
    selectedElement = null;

    if (blockMoved) {
        //placement du bloque dans le main
        document.getElementById("mainCanvas").insertAdjacentElement('beforeend', blockMoved);

        //retirer le bloque de la variable de déplacement
        blockMoved = null;
    }
});

//position de la main 
function setOffsetHandCanva(element) {
    positionHandCanvaX = element.getBoundingClientRect().left - event.clientX;
    positionHandCanvaY = element.getBoundingClientRect().top - event.clientY;
    document.getElementById("canvaHand").style.setProperty('--offset-x', `${positionHandCanvaX}px`);
    document.getElementById("canvaHand").style.setProperty('--offset-y', `${positionHandCanvaY}px`);

}

//fonction de clonage du bloque selectionné
function cloneMenuBlocks(element) {
    //creation de l'élément cloné
    const clonedElement = element.cloneNode(true);

    //position du canva de la main
    setOffsetHandCanva(element);

    //insertion du clonage
    document.getElementById("canvaHand").insertAdjacentElement('beforeend', clonedElement);

    //initilisation du bloque à déplacer
    blockMoved = clonedElement;
  
    //ajout des fonctions event listener
    clonedElement.addEventListener('mousedown', () => {
        moveGrapedBlocks(clonedElement);
    });
    clonedElement.addEventListener('mouseup', () => {
        moveLeaveBlocks(clonedElement);
    });
}

//fonction au grap du bloque du canva
function moveGrapedBlocks(element) {
    //empeche le background de détecter un click
    event.stopPropagation();

    //déplace la main au niveau de la prise du bloque
    setOffsetHandCanva(element);

    //placement du bloque dans la main
    document.getElementById("canvaHand").insertAdjacentElement('beforeend', element);

    //initialisation de la variable de déplacement
    blockMoved = element;
}

//fonction au relachement du bloque du canva
function moveLeaveBlocks(element) {
    console.log(element);
}