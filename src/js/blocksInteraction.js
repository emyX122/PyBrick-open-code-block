//ajout des fonction on click au élément du menu
function blockAssignScript() {
    document.querySelectorAll(".canva-base-block").forEach(element => {
        element.addEventListener('click', () => {
            const clonedElement = element.cloneNode(true);
            clonedElement.addEventListener('click', () => {
                moveGrapedBlocks(clonedElement);
            });
            document.getElementById("mainCanvas").insertAdjacentElement('beforeend', clonedElement);
        });
    });
}

function moveGrapedBlocks(element) {
    console.log(element);
}