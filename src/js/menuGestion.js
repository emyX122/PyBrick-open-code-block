//chargement des menus
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
        const menuCategorieClass = document.querySelector(".menu-categorie-"+nameMenu[i]);
        const menuPanel = document.getElementById("panelMenu");
        const submenuPanel = document.getElementById("panelMenu-"+nameMenu[i]);

        if (menuActif == i) {
            menuActif = null;
            menuPanel.style.transform = "translateX(-100%)";
            submenuPanel.classList.remove("active");
            
        } else {
            if (menuActif != null) {
                const oldMenuCategorieClass = document.querySelector(".menu-categorie-"+nameMenu[menuActif]);
                const oldSubmenuPanel = document.getElementById("panelMenu-"+nameMenu[menuActif]);

                oldSubmenuPanel.classList.remove("active");

                oldMenuCategorieClass.classList.toggle("active");
                changeColor(menuActif, oldMenuCategorieClass.classList.contains("active"));
            }

            submenuPanel.classList.add("active");
            
            menuActif = i;
            menuPanel.style.transform = "translateX(0%)";
        }
        menuCategorieClass.classList.toggle("active");
        changeColor(i, menuCategorieClass.classList.contains("active"));
    });
}