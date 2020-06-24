//Global selections and vars
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate-btn");
const adjustBtn = document.querySelectorAll(".adjust");
const lockBtn = document.querySelectorAll(".lock");
const closeAdjust = document.querySelectorAll(".close-adjustment");
const sliders = document.querySelectorAll('input[type="range"]');
const sliderContainer = document.querySelectorAll(".sliders");
const currentHexes = document.querySelectorAll(".color h2");
const copyCon = document.querySelector(".copy-container");
const copyPop = document.querySelector(".copy-popup");
const libBtn = document.querySelector(".library-btn");
const libCon = document.querySelector(".library-container");
const libPop = document.querySelector(".library-popup");
const libClose = document.querySelector(".close-library");
const pickBtn = document.querySelectorAll(".pick-palette-btn"); //you cannot select dom before they are created

let initialColors;
let paletteArray = []; //if you refresh, paletteArray goes empty again.

//Functions

//Color Generator
function generateHex() {
  const letters = "0123456789ABCDEF";
  let hash = "#";
  for (i = 0; i < 6; i++) {
    hash += letters[Math.floor(Math.random() * 16)]; //+= add or concat
  }
  return hash;
}

//Paint BG
function randomColors() {
  initialColors = []; //needs to be empty every time it gets refreshed

  colorDivs.forEach((div) => {
    const hexText = div.children[0];
    const randomColor = generateHex();
    const icons = div.querySelectorAll(".color-controls button");

    if (div.classList.contains("locked")) {
      initialColors.push(hexText.innerText);
      div.style.backgroundColor = hexText.innerText;
    } else {
      initialColors.push(randomColor);
      hexText.innerText = randomColor;
      div.style.backgroundColor = randomColor;

      checkContrast(randomColor, hexText);
      for (icon of icons) {
        checkContrast(randomColor, icon);
      }
    }

    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    colorizeSliders(color, hue, brightness, saturation);
  });
  //Reset Inputs
  setDefaultValue();

  //generate to refresh
  const generateText = document.querySelector(".generate-panel p");

  let i = 0;
  i++;
  if (i !== 0) {
    generateText.innerText = "Refresh";
  }
}

function checkContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

function colorizeSliders(color, hue, brightness, saturation) {
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`;

  const midBright = color.set("hsl.l", 0.5);
  const brightScale = chroma.scale(["black", midBright, "white"]);
  brightness.style.backgroundImage = `linear-gradient(to right, ${brightScale(
    0
  )},${brightScale(0.5)},${brightScale(1)})`;

  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  saturation.style.backgroundImage = `linear-gradient(to right, ${noSat}, ${fullSat})`;
}

function hslControls(e) {
  const index =
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-hue") ||
    e.target.getAttribute("data-sat");

  const sliders = e.target.parentElement.querySelectorAll(
    'input[type="range"]'
  );
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  const currentColor = initialColors[index];
  //not text but first generated color. can use as reference

  //const currentColor = colorDivs[index].querySelector("h2").innerText;
  //text changes when change event is activated. cannot use as reference

  const color = chroma(currentColor)
    .set("hsl.s", saturation.value)
    .set("hsl.h", hue.value)
    .set("hsl.l", brightness.value);

  colorDivs[index].style.backgroundColor = color;

  //colorize inputs
  colorizeSliders(color, hue, brightness, saturation);
}

function updateTextUI(event) {
  const div = event.target.parentElement.parentElement;
  const color = chroma(div.style.backgroundColor).hex();
  const divText = div.querySelector("h2");
  const icons = div.querySelectorAll(".color-controls button");

  divText.innerText = color;

  checkContrast(color, divText);
  for (icon of icons) {
    checkContrast(color, icon);
  }
}

function setDefaultValue() {
  const sliders = document.querySelectorAll(".sliders input");
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = initialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue); //3 digits
    }
    if (slider.name === "brightness") {
      const brightColor = initialColors[slider.getAttribute("data-bright")];
      const brightValue = chroma(brightColor).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100; //decimals
    }
    if (slider.name === "saturation") {
      const satColor = initialColors[slider.getAttribute("data-sat")];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100; //decimals
    }
  });
}

function copyToClip(hex) {
  const el = document.createElement("textarea");
  el.value = hex.innerText;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);

  //popup animation
  copyCon.classList.add("active");
  copyPop.classList.add("active");

  setTimeout(() => {
    copyCon.classList.remove("active");
    copyPop.classList.remove("active");
  }, 1500);
}

function openClose(index) {
  sliderContainer[index].classList.toggle("active");
}

function lockActive(index) {
  colorDivs[index].classList.toggle("locked");

  if (colorDivs[index].classList.contains("locked")) {
    event.target.innerHTML = `<i class="fas fa-lock"></i>`;
  } else {
    event.target.innerHTML = `<i class="fas fa-lock-open"></i>`;
  }
}

const saveBtn = document.querySelector(".save-btn");
const saveCon = document.querySelector(".save-container");
const savePop = document.querySelector(".save-popup");
const saveClose = document.querySelector(".close-save");
const submitSave = document.querySelector(".submit-save");

function showSave() {
  saveCon.classList.add("active");
  savePop.classList.add("active");
}

function savePalette(e) {
  saveCon.classList.remove("active");
  savePop.classList.remove("active");

  const input = document.querySelector(".save-popup input");
  const name = input.value;

  let paletteNr;
  const paletteObjects = JSON.parse(localStorage.getItem("Palettes"));
  if (paletteObjects) {
    paletteNr = paletteObjects.length;
  } else {
    paletteNr = paletteArray.length;
  }

  const paletteObj = {
    name,
    colors: initialColors,
    nr: paletteNr,
  };

  paletteArray.push(paletteObj);
  saveToLocal(paletteObj);
  saveToLib(paletteObj);
  input.value = "";
}

function pickBtnEventHandler() {
  closeLibrary();
  initialColors = [];
  const index = event.target.classList[1];

  paletteArray[index].colors.forEach((color, index) => {
    initialColors.push(color);
    colorDivs[index].style.backgroundColor = color;
    const text = colorDivs[index].querySelector("h2");
    text.innerText = color;
    const icons = colorDivs[index].querySelectorAll(".color-controls button");
    checkContrast(color, text);
    for (icon of icons) {
      checkContrast(color, icon);
    }

    const newColor = chroma(color);
    const sliders = colorDivs[index].querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    colorizeSliders(newColor, hue, brightness, saturation);
  });

  setDefaultValue();
}

function saveToLocal(paletteObj) {
  let localPalettes;
  if (localStorage.getItem("Palettes") === null) {
    localPalettes = [];
  } else {
    localPalettes = JSON.parse(localStorage.getItem("Palettes"));
  }

  localPalettes.push(paletteObj);
  localStorage.setItem("Palettes", JSON.stringify(localPalettes));
}

function saveToLib(paletteObj) {
  const palette = document.createElement("div");
  palette.classList.add("custom-palette");
  const title = document.createElement("h4");
  title.innerText = paletteObj.name;
  const preview = document.createElement("div");
  preview.classList.add("small-preview");
  paletteObj.colors.forEach((color) => {
    const smallDiv = document.createElement("div");
    smallDiv.style.backgroundColor = color;
    preview.appendChild(smallDiv);
  });
  const paletteBtn = document.createElement("button");
  paletteBtn.classList.add("pick-palette-btn");
  paletteBtn.classList.add(paletteObj.nr);
  paletteBtn.innerText = "select";

  libPop.appendChild(palette);
  palette.appendChild(title);
  palette.appendChild(preview);
  palette.appendChild(paletteBtn);

  paletteBtn.addEventListener("click", pickBtnEventHandler); //add EventListner when saving :) to prevent confusion
}

function closeSave() {
  saveCon.classList.remove("active");
  savePop.classList.remove("active");
}

function showLibrary() {
  libCon.classList.add("active");
  libPop.classList.add("active");
}

function closeLibrary() {
  libCon.classList.remove("active");
  libPop.classList.remove("active");
}

function loadLocal() {
  if (localStorage.getItem("Palettes") === null) {
    localPalettes = [];
  } else {
    const paletteObjects = JSON.parse(localStorage.getItem("Palettes"));

    //*2
    paletteArray = [...paletteObjects];

    paletteObjects.forEach((paletteObj) => {
      saveToLib(paletteObj);
    });
  }
}

function init() {
  loadLocal();
  randomColors();

  //Event Listeners
  generateBtn.addEventListener("click", randomColors);

  sliders.forEach((slider) => {
    slider.addEventListener("input", hslControls);
  });

  sliders.forEach((slider) => {
    slider.addEventListener("change", (event) => {
      updateTextUI(event);
    });
  });

  currentHexes.forEach((hex) => {
    hex.addEventListener("click", () => {
      copyToClip(hex);
    });
  });

  adjustBtn.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      openClose(index);
    });
  });

  closeAdjust.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      openClose(index);
    });
  });

  lockBtn.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      lockActive(index);
    });
  });

  saveBtn.addEventListener("click", showSave);
  saveClose.addEventListener("click", closeSave);
  submitSave.addEventListener("click", savePalette);

  libBtn.addEventListener("click", showLibrary);
  libClose.addEventListener("click", closeLibrary);
}

init();
