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
        //fonction si c'est un bloque dans le menu
        if (selectedElement.classList.contains("canva-base-block")) {
            cloneMenuBlocks(selectedElement);
        }  
    }
});

// gestion des événement au relachement de la sourie
document.addEventListener("mouseup", () => {
    cursorIsDown = false;
    selectedElement = null;

    //control que un bloque est bien déplacé
    if (blockMoved) {
        // control que le bloque survolé n'est pas dans le menu et est un bloque
        if (!oldHoverHandZoneElement?.parentElement?.classList.contains("panel-menu-submenu") && oldHoverHandZoneElement?.classList.contains("canva-base-block")) {
            //placement du fragment de la main après le survolé
            insertFragmentAfter(oldHoverHandZoneElement, blockMoved);
            //mise à null de l'élément survolé
            oldHoverHandZoneElement = null;
        } else {
            //création du canva à cloner
            const clonedCanva = invisibleCodeCanva.children[0].cloneNode(true);

            //définir la position du canva
            clonedCanva.style.setProperty('--position-x', `${(event.clientX - currentX - 268 + positionHandCanvaX)/currentZoom}px`);
            clonedCanva.style.setProperty('--position-y', `${(event.clientY - currentY - 268 + positionHandCanvaY)/currentZoom}px`);

            // insertion du canva dans le container
            canvasContainers.insertAdjacentElement('beforeend', clonedCanva);

            //placement du fragment de la main dans le nouveau canva
            clonedCanva.appendChild(makeFragmentElement(blockMoved));
        }
        
        //control tout les canva pour supprimer les vides
        canvasContainers.querySelectorAll(".canvas-code").forEach(element => {
            if (!element.childElementCount) {
                element.remove();
            }
        });

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
            //control si le bloque bouger est du même type que celui survolé
            if (hoverHandZoneElement.getAttribute('data-type') == blockMoved.getAttribute('data-type')) {
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
        //control si c'est le background
        if (hoverHandZoneElement.classList.contains("background-mouse-js")) {
            //réduit la zone de placeholder
            placeholder.style.setProperty('--width', `0px`);
            placeholder.style.setProperty('--height', `0px`);
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
    handCanvaElement.appendChild(makeFragmentElement(element));

    //initialisation de la variable de déplacement
    blockMoved = element;
}

//scan des élément en dessous d'un autre
function makeFragmentElement(element) {
    //initialisation du fragment
    const fragment = document.createDocumentFragment();

    //scan tout les élément
    while (element) {
        //prend l'élément suivant à l'avance
        let bufferElement = element.nextElementSibling;
        fragment.appendChild(element);
        element = bufferElement;
    }

    //retourne le fragment
    return fragment;
}

//insertion d'un fragment après un élément de référence
function insertFragmentAfter(referenceElement, element) {
    // initialisation du fragment
    const fragment = makeFragmentElement(element);
    //insertion par apport à la cible
    referenceElement.parentNode.insertBefore(fragment, referenceElement.nextSibling);
}