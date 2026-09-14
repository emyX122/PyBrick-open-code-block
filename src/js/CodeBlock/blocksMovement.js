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
    //fermetur potentiel du menu
    if (menuActif != null && (event.clientX > document.getElementById("panelMenu").getBoundingClientRect().right)) {
        closeMenu();
    }

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
        if (oldHoverHandZoneElement) {
            // control que le bloque survolé n'est pas dans le menu et est un bloque
            if (!oldHoverHandZoneElement?.parentElement?.classList.contains("panel-menu-submenu") && oldHoverHandZoneElement?.classList.contains("canva-base-block")) {
                //placement du fragment de la main après le survolé
                insertFragment(oldHoverHandZoneElement, blockMoved, movedBlockInput);

            } else if (blockMoved?.getAttribute('data-type') == "value" && !oldHoverHandZoneElement?.parentElement?.classList.contains("panel-menu-submenu") && oldHoverHandZoneElement?.classList.contains("canva-global-block-number-case")) {
                //control le type d'élément ciblé
                if (oldHoverHandZoneElement.nodeName == "SELECT") {
                    //insertion de l'élément dans le bloque avec un élément de décalage pour éviter le display
                    oldHoverHandZoneElement.previousSibling.insertAdjacentElement('beforebegin', blockMoved);
                } else {
                    //insertion direct de l'élément dans le bloque
                    oldHoverHandZoneElement.insertAdjacentElement('beforebegin', blockMoved);
                }
            } else {
                //création du canva à cloner
                const clonedCanva = invisibleCodeCanva.children[0].cloneNode(true);

                //définir la position du canva
                clonedCanva.style.setProperty('--position-x', `${(event.clientX - currentX - 265 - (6 * currentZoom) + positionHandCanvaX)/currentZoom}px`);
                clonedCanva.style.setProperty('--position-y', `${(event.clientY - currentY - 265 - (6 * currentZoom)+ positionHandCanvaY)/currentZoom}px`);

                // insertion du canva dans le container
                canvasContainers.insertAdjacentElement('beforeend', clonedCanva);

                //placement du fragment de la main dans le nouveau canva
                clonedCanva.appendChild(makeFragmentElement(blockMoved));
            }
        } else {
            handCanvaElement.innerHTML = "";
        }

        //mise à jour du code en forcent le rescann complet
        updateDeviceLink(true);
        
        //vider la variable de selection
        oldHoverHandZoneElement = elementBackground;
        
        //mise à jour des canva-code vide et de type setup
        updateAllCanva()

        //retirer le bloque de la variable de déplacement
        blockMoved = null;

        //retirer les placeholder
        invisibleCanva.insertAdjacentElement('afterend', placeholder);
        invisibleCanva.insertAdjacentElement('afterend', placeholderValue);
        placeholder.style.setProperty('--width', `0px`);
        placeholder.style.setProperty('--height', `0px`);
        placeholderValue.style.setProperty('--width', `0px`);
        placeholderValue.style.setProperty('--height', `0px`);
    }
});

//lecture continu de la position du curseur pour la zone de main
document.addEventListener('mousemove', () => {
    //mouvement de la zone de main
    handCanvaElement.style.setProperty('--position-x', `${event.clientX}px`);
    handCanvaElement.style.setProperty('--position-y', `${event.clientY}px`);

    //control si un bloque est actuelement bougé
    if (selectedElement) {
        //type d'élément (début/fin)
        const elementEnd = !Number(blockMoved?.getAttribute('data-output'));
        const elementStart = !Number(blockMoved?.getAttribute('data-input'));
        const elementTypeValue = blockMoved?.getAttribute('data-type') == "value";

        //prend l'élément qui est survolé par la zone de main
        if (!elementStart) {
            //detection au coins haut gauche
            hoverHandZoneElement = document.elementFromPoint(handCanvaElement.getBoundingClientRect().left - 1, handCanvaElement.getBoundingClientRect().top);
        } else if (elementTypeValue) {
            //detection au centre gauche
            hoverHandZoneElement = document.elementFromPoint(handCanvaElement.getBoundingClientRect().left - 1, handCanvaElement.getBoundingClientRect().top + handCanvaElement.getBoundingClientRect().height / 2)
        } else {
            //detection au coins bas gauche
            hoverHandZoneElement = document.elementFromPoint(handCanvaElement.getBoundingClientRect().left - 1, handCanvaElement.getBoundingClientRect().bottom);
        }
        movedBlockInput = Number(blockMoved?.getAttribute('data-input'));
        movedBlockOutput = Number(blockMoved?.getAttribute('data-output'));

        //control que la cible à un parent et qui n'est pas dans le menu et que c'est un bloque 
        if (!hoverHandZoneElement?.parentElement?.classList.contains("panel-menu-submenu") 
            && hoverHandZoneElement?.classList.contains("canva-base-block")
            && !blockMoved?.getAttribute('data-type') == "value") {

            //control que le bloque survolé et porter on soit une sortie et une entrée soit l'inverse
            if ((Number(hoverHandZoneElement?.getAttribute('data-output')) && Number(blockMoved?.getAttribute('data-input'))) ||
                (Number(hoverHandZoneElement?.getAttribute('data-input')) && Number(blockMoved?.getAttribute('data-output')))) {

                //control si le bloque bouger est du même type que celui survolé
                if (hoverHandZoneElement?.getAttribute('data-type') == blockMoved?.getAttribute('data-type')) {
                    //taille du placeholder
                    widthPlaceholder = blockMoved.getBoundingClientRect().width / currentZoom;
                    heightPlaceholder = handCanvaElement.getBoundingClientRect().height / currentZoom;
                    placeholder.style.setProperty('--width', `${widthPlaceholder}px`);
                    placeholder.style.setProperty('--height', `${heightPlaceholder}px`);
                    // insertion du placeholder avant ou après le bloque
                    if (movedBlockInput) {
                        hoverHandZoneElement.insertAdjacentElement('afterend', placeholder);
                    } else {
                        hoverHandZoneElement.insertAdjacentElement('beforebegin', placeholder);
                    }
                    //enregistre dernier élément valide
                    oldHoverHandZoneElement = hoverHandZoneElement;
                }
            }
        } else if (!hoverHandZoneElement?.parentElement?.parentElement?.parentElement?.classList.contains("panel-menu-submenu") 
                && blockMoved?.getAttribute('data-type') == "value") {
            //contrôle que l'element est bien un select de type number
            if (hoverHandZoneElement?.classList.contains("canva-global-block-number-case")) {
                //taille du placeholder
                widthPlaceholder = blockMoved.getBoundingClientRect().width / currentZoom;
                heightPlaceholder = handCanvaElement.getBoundingClientRect().height / currentZoom;
                placeholderValue.style.setProperty('--width', `${widthPlaceholder}px`);
                placeholderValue.style.setProperty('--height', `${heightPlaceholder}px`);
                placeholderValue.style.setProperty('--selector-width', `${hoverHandZoneElement.getBoundingClientRect().width / currentZoom}px`);
                blockMoved.style.setProperty('--selector-width', `${hoverHandZoneElement.getBoundingClientRect().width / currentZoom}px`);
                // insertion du placeholder avant ou après le bloque
                hoverHandZoneElement.insertAdjacentElement('afterend', placeholderValue);
                //enregistre dernier élément valide
                oldHoverHandZoneElement = hoverHandZoneElement;
            }
        }

        //control si le bloque est en dehors de l'écran à gauche
        if (handCanvaElement.getBoundingClientRect().left < 0) {
            oldHoverHandZoneElement = false;
        } else if (!oldHoverHandZoneElement) {
            oldHoverHandZoneElement = elementBackground;
        }

        //control si c'est le background
        if (hoverHandZoneElement?.classList.contains("background-mouse-js")) {
            //réduit la zone de placeholder
            placeholder.style.setProperty('--width', `0px`);
            placeholder.style.setProperty('--height', `0px`);
            placeholderValue.style.setProperty('--width', `0px`);
            placeholderValue.style.setProperty('--height', `0px`);
            //enregistre dernier élément valide
            oldHoverHandZoneElement = hoverHandZoneElement;
        }
    }
});

//position de la main 
function setOffsetHandCanva(element) {
    positionHandCanvaX = element.getBoundingClientRect().left - event.clientX - 3;
    positionHandCanvaY = element.getBoundingClientRect().top - event.clientY - 3;
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

    //contrôle le type de bloque
    if (element?.getAttribute('data-type') == "value") {
        handCanvaElement.appendChild(element);
    } else {
        // met le bloque avec les suivants dans la main
        handCanvaElement.appendChild(makeFragmentElement(element));
    }

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
function insertFragment(referenceElement, element, position) {
    // initialisation du fragment
    const fragment = makeFragmentElement(element);
    //insertion par apport à la cible avant ou après (position)
    if (position) {
        referenceElement.parentNode.insertBefore(fragment, referenceElement.nextSibling);
    } else {
        referenceElement.parentNode.insertBefore(fragment, referenceElement);
    }
}

//mise à jour de tout les élément canva-code existant
function updateAllCanva() {
    canvasContainers.querySelectorAll(".canvas-code").forEach(element => {
        //supprimer si le canva est vide
        if (!element.childElementCount) {
            element.remove();
        }

        //regarde si la div contient une fin et un début
        element.dataset.ended = 0;
        element.dataset.started = 0;
        element.dataset.type = null;
        //regarde s'il exist soit un bloque de fin soit de début
        Array.from(element.children).forEach(subElement=>{
            if (subElement.hasAttribute("data-output")) {
                if (!Number(subElement.getAttribute('data-output'))) {
                    element.dataset.ended = 1;
                }
            }
            if (subElement.hasAttribute("data-input")) {
                if (!Number(subElement.getAttribute('data-input'))) {
                    element.dataset.started = 1;
                }
            }
            //mise à jour d type de container
            if (subElement.hasAttribute("data-type")) {
                element.dataset.type = subElement.getAttribute("data-type");
            }
        });
    });

    //scanning du code
    codeScanning()
}
