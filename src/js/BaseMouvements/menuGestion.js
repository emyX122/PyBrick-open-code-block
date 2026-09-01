//chargement des ouleurs du menus
for (let i = 0; i < nameMenu.length; i++) {
    const svgObjectX = document.querySelector('.menu-categorie-image-'+nameMenu[i]);

    // Attendre que le SVG soit chargé
    svgObjectX.addEventListener('load', () => {
        // Accéder au document interne
        const svgDoc = svgObjectX.contentDocument;
            
        //changement des élément
        svgDoc.querySelectorAll('path, circle, rect').forEach(el => {
            el.setAttribute('fill', menuBaseColors[i]);
        });
    });
}

//chargement des titres des menu (dans langageSelector.js)
function generateTitleMenu() {
    for (let i = 0; i < nameMenu.length; i++) {
        const textMenuElement = document.getElementById("textMenu-"+nameMenu[i]);

        //changement du texte par apport à la langue
        textMenuElement.innerHTML = getTraduction(nameMenu[i]);
    }
}

//changement des couleur du menu actif
function changeColor(numberCategorie, display) {
    const svgObjectX = document.querySelector('.menu-categorie-image-'+nameMenu[numberCategorie]);
    const textObjectX = document.querySelector('.menu-categorie-'+nameMenu[numberCategorie]);
    // Accéder au document interne
    const svgDoc = svgObjectX.contentDocument;
            
    //changement des élément
    if (display) {
        svgDoc.querySelectorAll('path, circle, rect').forEach(el => {
            el.setAttribute('fill', selectedColor);  
        });
        textObjectX.style.color = selectedColor;
    } else {
        svgDoc.querySelectorAll('path, circle, rect').forEach(el => {
            el.setAttribute('fill', menuBaseColors[numberCategorie]);
        });
        textObjectX.style.color = menuBaseColors[numberCategorie];
    }
}

//ajout des action au click
for (let i = 0; i < nameMenu.length; i++) {
    document.getElementById('menuCase-'+nameMenu[i]).addEventListener("click", () => {
        //initialisation des élément de la sous-catégorie
        const menuCategorieClass = document.querySelector(".menu-categorie-"+nameMenu[i]);
        const menuPanel = document.getElementById("panelMenu");
        const submenuPanel = document.getElementById("panelMenu-"+nameMenu[i]);

        //fermeture si le même ou switch avec un autre
        if (menuActif == i) {
            menuActif = null;
            //fermeture du sous-panel
            menuPanel.style.transform = "translateX(-100%)";
            submenuPanel.classList.remove("active");
            
        } else {
            //si un menu est déjà ouvert
            if (menuActif != null) {
                const oldMenuCategorieClass = document.querySelector(".menu-categorie-"+nameMenu[menuActif]);
                const oldSubmenuPanel = document.getElementById("panelMenu-"+nameMenu[menuActif]);

                //fermeture de l'ancien
                oldSubmenuPanel.classList.remove("active");

                oldMenuCategorieClass.classList.toggle("active");
                changeColor(menuActif, oldMenuCategorieClass.classList.contains("active"));
            }

            submenuPanel.classList.add("active");
            
            //changement de la référence du menu ouvert
            menuActif = i;
            menuPanel.style.transform = "translateX(0%)";
        }
        menuCategorieClass.classList.toggle("active");
        changeColor(i, menuCategorieClass.classList.contains("active"));
    });
}

function closeMenu() {
    //initialisation des élément de la sous-catégorie
    const menuCategorieClass = document.querySelector(".menu-categorie-"+nameMenu[menuActif]);
    const menuPanel = document.getElementById("panelMenu");
    const submenuPanel = document.getElementById("panelMenu-"+nameMenu[menuActif]);

    //fermeture du menu
    menuPanel.style.transform = "translateX(-100%)";
    submenuPanel.classList.remove("active");
    menuCategorieClass.classList.toggle("active");
    changeColor(menuActif, menuCategorieClass.classList.contains("active"));

    //changement de la référence du menu ouvert vers null
    menuActif = null;
}