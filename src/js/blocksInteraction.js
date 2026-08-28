//ajout des fonction on click au élément du menu
function blockAssignScript() {
    document.querySelectorAll(".canva-base-block").forEach(element => {
        element.addEventListener('mousedown', () => {
            cloneMenuBlocks(element);
        });
    });
}

// gestion des événement au click de la sourie
document.addEventListener("mousedown", () => {
    cursorIsDown = true;
    selectedElement = document.elementFromPoint(event.clientX, event.clientY);

    //control si l'élément n'est pas dans le menu
    if (!selectedElement.parentElement?.classList.contains("panel-menu-submenu")) {
        //fonction si c'est un bloque
        if (selectedElement.classList.contains("canva-base-block")) {
            moveGrapedBlocks(selectedElement);
        }  
    } else {
        //fonction si c'est un bloque
        if (selectedElement.classList.contains("canva-base-block")) {
            cloneMenuBlocks(selectedElement);
        }  
    }
});

// gestion des événement au relachement de la sourie
document.addEventListener("mouseup", () => {
    cursorIsDown = false;
    selectedElement = null;

    if (blockMoved) {
        // control du survollement du bloque
        if (!oldHoverHandZoneElement?.parentElement?.classList.contains("panel-menu-submenu") && oldHoverHandZoneElement?.classList.contains("canva-base-block")) {
            //placement après le survolé
            oldHoverHandZoneElement.insertAdjacentElement('afterend', blockMoved);
            //mise à null de l'élément survolé
            oldHoverHandZoneElement = null;
        } else {
            //placement du bloque dans le main
            document.getElementById("mainCanvas").insertAdjacentElement('beforeend', blockMoved);
        }
        
        //retirer le bloque de la variable de déplacement
        blockMoved = null;

        //retirer le placeholder
        invisibleCanva.insertAdjacentElement('afterend', placeholder);
    }
});

//lecture continu de la position du curseur pour la zone de main
document.addEventListener('mousemove', () => {
    //mouvement de la zone de main
    handCanvaElement.style.setProperty('--position-x', `${event.clientX}px`);
    handCanvaElement.style.setProperty('--position-y', `${event.clientY}px`);

    //control si un bloque est actuelement bougé
    if (selectedElement) {
        //prend l'élément qui est survolé par la zone de main
        hoverHandZoneElement = document.elementFromPoint(handCanvaElement.getBoundingClientRect().left - 1, handCanvaElement.getBoundingClientRect().top);

        //control que la cible à un parent et qui n'est pas dans le menu et que c'est un bloque 
        if (!hoverHandZoneElement.parentElement?.classList.contains("panel-menu-submenu") && hoverHandZoneElement.classList.contains("canva-base-block")) {
            //taille du placeholder
            widthPlaceholder = blockMoved.getBoundingClientRect().width / currentZoom;
            heightPlaceholder = blockMoved.getBoundingClientRect().height / currentZoom;
            placeholder.style.setProperty('--width', `${widthPlaceholder}px`);
            placeholder.style.setProperty('--height', `${heightPlaceholder}px`);
            // insertion du placeholder
            hoverHandZoneElement.insertAdjacentElement('afterend', placeholder);
            //enregistre dernier élément valide
            oldHoverHandZoneElement = hoverHandZoneElement;
        }
    }
});

//position de la main 
function setOffsetHandCanva(element) {
    positionHandCanvaX = element.getBoundingClientRect().left - event.clientX;
    positionHandCanvaY = element.getBoundingClientRect().top - event.clientY;
    handCanvaElement.style.setProperty('--offset-x', `${positionHandCanvaX}px`);
    handCanvaElement.style.setProperty('--offset-y', `${positionHandCanvaY}px`);

}

//fonction de clonage du bloque selectionné
function cloneMenuBlocks(element) {
    //creation de l'élément cloné
    const clonedElement = element.cloneNode(true);

    //position du canva de la main
    setOffsetHandCanva(element);

    //insertion du clonage
    handCanvaElement.insertAdjacentElement('beforeend', clonedElement);

    //initilisation du bloque à déplacer
    blockMoved = clonedElement;
}

//fonction au grap du bloque du canva
function moveGrapedBlocks(element) {
    //empeche le background de détecter un click
    event.stopPropagation();

    //déplace la main au niveau de la prise du bloque
    setOffsetHandCanva(element);

    //placement du bloque dans la main
    handCanvaElement.insertAdjacentElement('beforeend', element);

    //initialisation de la variable de déplacement
    blockMoved = element;
}