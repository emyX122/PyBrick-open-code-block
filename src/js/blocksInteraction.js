
function blockAssignScript() {
    document.querySelectorAll(".canva-base-block").forEach(element => {
        element.addEventListener('click', () => {
            document.getElementById("mainCanvas").insertAdjacentElement('beforeend', element);
        });
    });
}