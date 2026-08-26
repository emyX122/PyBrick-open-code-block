//ajout des fonction on click au élément du menu
function blockAssignScript() {
    document.querySelectorAll(".canva-base-block").forEach(element => {
        element.addEventListener('click', () => {
            cloneMenuBlocks(element);
        });
    });
}

function cloneMenuBlocks(element) {
    //creation de l'élément cloné
    const clonedElement = element.cloneNode(true);

    //insertion du clonage
    document.getElementById("canvaHand").insertAdjacentElement('beforeend', clonedElement);
  
    //ajout des fonctions event listener
    clonedElement.addEventListener('click', () => {
        moveGrapedBlocks(clonedElement);
    });
}

function moveGrapedBlocks(element) {
    console.log(element);
}