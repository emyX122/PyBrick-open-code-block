//fonction de resizing par element select
function resize(elementSelect) {
  //element display
  const elementDisplay = elementSelect.previousElementSibling;

  // Vérifier qu'il y a au moins une option
  if (!elementSelect.options || elementSelect.options.length === 0) {
    //retour si l'élément n'as pas d'option
    return;
  }

  //control si l'option contien un subtext 
  if (elementSelect.options[elementSelect.selectedIndex].hasAttribute("data-subtext")) {
    //insertion du subtext
    elementDisplay.innerHTML = elementSelect.options[elementSelect.selectedIndex].getAttribute("data-subtext") + " ▾";
  } else {
    //insertion du conttenu à la place du subtext
    elementDisplay.innerHTML = elementSelect.options[elementSelect.selectedIndex].innerHTML + " ▾";
  }

  //définition de la taille
  elementSelect.style.width = elementDisplay.getBoundingClientRect().width+"px";
  elementDisplay.style.marginRight = "-"+elementDisplay.getBoundingClientRect().width+"px";
  elementSelect.style.color = "transparent";
}

//afficher/masquer les éléments selon la selection actuel
function toggleDisplaySelectionBlock(elementSelect) {
  //control si l'élément à bien un redirect
  if (elementSelect.options[elementSelect.selectedIndex].hasAttribute("data-redirect")) {
    //detection du container
    const elementContainer = elementSelect.parentElement;
    const selection = elementSelect.options[elementSelect.selectedIndex].getAttribute("data-redirect");

    //récupère tout les élément du parent
    elementContainer.childNodes.forEach(element => {
      //contrôle si l'élément à la data selection
      if (element.hasAttribute("data-selection")) {
        if (element.getAttribute("data-selection").includes(String(selection))) {
          element.style.display = "";
          if (element.nodeName == "SELECT"){
            resize(element);
          }
        } else {
          element.style.display = "none";
        }
      }
    });
  }
}

//resizing au changement d'un élément avec data-resize
document.addEventListener('change', (element) => {
  if (element.target.hasAttribute('data-resize')) {
    //mise à jour des éléments afficher ou pas
    toggleDisplaySelectionBlock(element.target);
    //mise à jour de la taille du selecteur
    resize(element.target);
  }

  //cherche s'il faut mettre à jour le code
  findBlockToScan(element);
});

//Rechargement du code si une div commenditable est modifier
document.addEventListener('input', (element) => {
  if (element.target.hasAttribute('contenteditable')) {
    //cherche s'il faut mettre à jour le code
    findBlockToScan(element);
  }
});