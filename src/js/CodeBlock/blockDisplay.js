//Code by Gert Arnold on (https://stackoverflow.com/questions/20091481/auto-resizing-the-select-element-according-to-selected-options-width)

//fonction de resizing par element select
function resize(event) {
  const fakeEl = document.createElement('select');
  const option = event.target.options[event.target.selectedIndex];

  fakeEl.style.visibility = 'hidden';
  fakeEl.style.position = 'absolute';
  fakeEl.style.top = '-9999px';
  fakeEl.style.left = '-9999px';
  fakeEl.style.width = 'auto';
  fakeEl.style.font = window.getComputedStyle(event.target).font;
  fakeEl.style.padding = window.getComputedStyle(event.target).padding;
  fakeEl.style.border = window.getComputedStyle(event.target).border;

  const fakeOption = document.createElement('option');
  fakeOption.innerHTML = option.innerHTML;
  fakeEl.appendChild(fakeOption);
  document.body.appendChild(fakeEl);

  event.target.style.width = fakeEl.getBoundingClientRect().width + 'px';
  fakeEl.remove();
}

//initialisation des select à auto resize
function initialisationResizeSelectElement(classSelect) {
    for (let e of document.querySelectorAll('select.'+classSelect)) {
        e.onchange = resize;
        e.dispatchEvent(new Event('change'));
    }
}


