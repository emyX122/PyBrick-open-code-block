// -------------------------------
//       block génération       (src/js/blockGeneration.js)
// -------------------------------
//initialisation des fichier json
const jsonPath = "../../assets/json/blocks/";
const jsonFiles = ["tasks", "other", "flow", "output", "setup"];

// -------------------------------
//    Initialisation du menu    (src/js/menuGestion.js)
// -------------------------------
//changement des couleur de bases
let menuActif = null;
const selectedColor = "rgb(255, 255, 255)";
const nameMenu =       ["setup"               , "output"             , "input"              , "flow"               , "tasks"             , "data"              , "variables"           , "other"];
const menuBaseColors = ["rgb(170, 170, 170)", "rgb(76, 151, 255)", "rgb(92, 177, 214)", "rgb(255, 171, 25)", "rgb(255, 191, 0)", "rgb(89, 192, 89)", "rgb(255, 102, 128)", "rgb(154, 114, 162)"];

// -------------------------------
//  Intéraction avec les blocs    (src/js/blocksInteraction.js)
// -------------------------------
//Variable d'état de la sourit
let cursorIsDown = false;
let blockMoved = null;

//référence du canva main, bloque placeholder et du canva invisible 
const handCanvaElement = document.getElementById("canvaHand");
const placeholder = document.getElementById("placeholderCode");
const invisibleCanva = document.getElementById("canvaInvisible");

//taille du placeholder
let widthPlaceholder = null;
let heightPlaceholder = null;

//position du canva de la main
let positionHandCanvaX = null;
let positionHandCanvaY = null;

//element selectionner et chevauché
let selectedElement = null;
let hoverHandZoneElement = null;
let oldHoverHandZoneElement = null;

// -------------------------------
//   Mouvement du background   (src/js/mouvementBackground.js)
// -------------------------------
//control du scroll de la souris
let currentZoom = 1;
const minZoom = 0.1;
const maxZoom = 4;
const sensitivity = 0.2;

//controle du grab du background
let currentX = 0;
let currentY = 0;
let oldCurrentX = 0;
let oldCurrentY = 0;
let mouseGrab = false;
let oldPositionX = 0;
let oldPositionY = 0;

//contrôle d'utilisation du menu
let mouseNotOnMenu = true;