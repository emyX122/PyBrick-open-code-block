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
});
document.addEventListener("mouseup", () => {
    cursorIsDown = false;

    if (blockMoved) {
        //placement du bloque dans le main
        document.getElementById("mainCanvas").insertAdjacentElement('beforeend', blockMoved);

        //retirer le bloque de la variable de déplacement
        blockMoved = null;
    }
});

//position de la main 
let positionHandCanvaX = null;
let positionHandCanvaY = null;
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