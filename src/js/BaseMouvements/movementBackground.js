//contrôle d'utilisation du menu
document.getElementById('menu').addEventListener('mouseover', () => {
    mouseNotOnMenu = false;
});
document.getElementById('panelMenu').addEventListener('mouseover', () => {
    mouseNotOnMenu = false;
});
document.getElementById('menu').addEventListener('mouseleave', () => {
    mouseNotOnMenu = true;
});
document.getElementById('panelMenu').addEventListener('mouseleave', () => {
    mouseNotOnMenu = true;
});

//control du zoom de la sourie
window.addEventListener('wheel', () => {
    if (mouseNotOnMenu) {
        // deltaY : positif si on roule vers le bas, négatif vers le haut
        if (event.deltaY < 0) {
            // Scroll Up : on augmente la taille
            currentZoom = Math.min(currentZoom + sensitivity, maxZoom);
        } else if (event.deltaY > 0) {
            // Scroll Down : on diminue la taille
            currentZoom = Math.max(currentZoom - sensitivity, minZoom);
        }

        // Appliquer la nouvelle valeur à la variable CSS
        document.body.style.setProperty('--scrollZoom', `${currentZoom}`);
        document.getElementById("mainCanvas").style.setProperty('--zoom', `${currentZoom}`);
        document.getElementById("canvaHand").style.setProperty('--zoom', `${currentZoom}`);
    }
});

//controle du grab du background
document.getElementById("backgroundMouseJS").addEventListener('mousedown', () => {
    //relachement au dessus du menu
    if (mouseNotOnMenu) {
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
