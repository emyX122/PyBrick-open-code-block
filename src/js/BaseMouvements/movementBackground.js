//control du zoom de la sourie
window.addEventListener('wheel', (event) => {
    //controle que la sourit n'est pas au dessus du menu
    if (event.clientX > document.getElementById("panelMenu").getBoundingClientRect().right) {
        //position de base du canva main
        const containerOffsetX = 268;
        const containerOffsetY = 268;

        //position du curseur avant de zoomer
        const oldClientX = (event.clientX - containerOffsetX - currentX) / currentZoom;
        const oldClientY = (event.clientY - containerOffsetY - currentY) / currentZoom;

        // deltaY : positif si on roule vers le bas, négatif vers le haut
        if (event.deltaY < 0) {
            // Scroll Up : on augmente la taille
            currentZoom = Math.min(currentZoom + sensitivity, maxZoom);
        } else if (event.deltaY > 0) {
            // Scroll Down : on diminue la taille
            currentZoom = Math.max(currentZoom - sensitivity, minZoom);
        }

        //Calcul de la nouvel position pour zoomer sur le curseur
        currentX = event.clientX - containerOffsetX - (oldClientX * currentZoom);
        currentY = event.clientY - containerOffsetY - (oldClientY * currentZoom);

        oldCurrentX = currentX;
        oldCurrentY = currentY;

        // Appliquer la nouvelle valeur à la variable CSS
        document.body.style.setProperty('--scrollZoom', `${currentZoom}`);
        document.getElementById("mainCanvas").style.setProperty('--zoom', `${currentZoom}`);
        document.getElementById("canvaHand").style.setProperty('--zoom', `${currentZoom}`);
        document.body.style.setProperty('--xPosition', `${currentX}px`);
        document.body.style.setProperty('--yPosition', `${currentY}px`);
        document.getElementById("mainCanvas").style.setProperty('--position-x', `${currentX}px`);
        document.getElementById("mainCanvas").style.setProperty('--position-y', `${currentY}px`);
    }
});
        
//controle du grab du background
document.getElementById("backgroundMouseJS").addEventListener('mousedown', () => {
    //relachement au dessus du menu
    if (document.elementFromPoint(event.clientX, event.clientY) == elementBackground) {
        mouseGrab = true;
        oldPositionX = event.clientX;
        oldPositionY = event.clientY;
    }
});
document.addEventListener('mouseup', () => {
    //enregistrement des positions au relachement
    mouseGrab = false;
    oldCurrentX = currentX;
    oldCurrentY = currentY;
});
document.getElementById("backgroundMouseJS").addEventListener('mousemove', () => {
    if (mouseGrab && !blockMoved) {
        //calcul de la position en grab
        currentX = oldCurrentX + event.clientX - oldPositionX;
        currentY = oldCurrentY + event.clientY - oldPositionY;

        //mouvement du fond
        document.body.style.setProperty('--xPosition', `${currentX}px`);
        document.body.style.setProperty('--yPosition', `${currentY}px`);
        //mouvement de la zone initial
        document.getElementById("mainCanvas").style.setProperty('--position-x', `${currentX}px`);
        document.getElementById("mainCanvas").style.setProperty('--position-y', `${currentY}px`);
    }

    //mouvement de la zone de main
    handCanvaElement.style.setProperty('--position-x', `${event.clientX}px`);
    handCanvaElement.style.setProperty('--position-y', `${event.clientY}px`);
});
