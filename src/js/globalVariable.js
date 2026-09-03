// -------------------------------
//       block génération       (src/js/CodeBlock/blockGeneration.js)
// -------------------------------
//initialisation des fichier json
const jsonPath = "../../assets/json/blocks/";
const jsonFiles = ["tasks", "other", "flow", "output", "setup"];

// -------------------------------
//    Initialisation du menu    (src/js/BaseMouvements/menuGestion.js)
// -------------------------------
//changement des couleur de bases
let menuActif = null;
const selectedColor = "rgb(255, 255, 255)";
const nameMenu =       ["setup"               , "output"             , "input"              , "flow"               , "tasks"             , "data"              , "variables"           , "other"];
const menuBaseColors = ["rgb(170, 170, 170)", "rgb(76, 151, 255)", "rgb(92, 177, 214)", "rgb(255, 171, 25)", "rgb(255, 191, 0)", "rgb(89, 192, 89)", "rgb(255, 102, 128)", "rgb(154, 114, 162)"];

// -------------------------------
//  Intéraction avec les blocs    (src/js/CodeBlock/blocksInteraction.js)
// -------------------------------
//Variable d'état de la sourit
let cursorIsDown = false;
let blockMoved = null;
let movedBlockInput = null;
let movedBlockOutput = null;

//référence du canva main, bloque placeholder et du canva invisible
const canvasContainers = document.getElementById("mainCanvas");
const handCanvaElement = document.getElementById("canvaHand");
const placeholder = document.getElementById("placeholderCode");
const invisibleCanva = document.getElementById("canvaInvisible");
const invisibleCodeCanva = document.getElementById("canvaCodeInvisible");
const elementBackground = document.getElementById("backgroundMouseJS");

//taille du placeholder
let widthPlaceholder = null;
let heightPlaceholder = null;

//position du canva de la main
let positionHandCanvaX = null;
let positionHandCanvaY = null;

//element selectionner et chevauché
let selectedElement = null;
let hoverHandZoneElement = null;
let oldHoverHandZoneElement = canvasContainers;

// -------------------------------
//   Mouvement du background   (src/js/BaseMouvements/movementBackground.js)
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

// -------------------------------
//    Langue et interface   (src/js/langage/langageSelector.js)
// -------------------------------
//langue par défault
const allLangage = ["EN", "FR"];
let selectedLangage = allLangage[0];

//fichier extrait
let extractLangage = null;

//emplacement des fichiers
const langageFileLocalisation = "../../assets/json/langage/"

// -------------------------------
//        scann du code   (src/js/entryCodeDB/codeGeneration.js)
// -------------------------------
//emplacement du code enregistré
let scannedCode = null;
let compiledCode = null;
