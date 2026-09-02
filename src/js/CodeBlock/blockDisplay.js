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

//resizing au changement d'un élément avec data-resize
document.addEventListener('change', (element) => {
  if (element.target.hasAttribute('data-resize')) {
    //lancement de la fonction
    resize(element.target);
  }
});