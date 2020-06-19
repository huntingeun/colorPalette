//Global selections and vars
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate-btn");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
const copyCon = document.querySelector(".copy-container");
const copyPop = document.querySelector(".copy-popup");
let initialColors = [];

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
  colorDivs.forEach((div) => {
    const hexText = div.children[0];
    const randomColor = generateHex();
    const icons = div.querySelectorAll(".color-controls button");

    //add random color to the bg
    hexText.innerText = randomColor;
    div.style.backgroundColor = randomColor;

    //add it to array
    initialColors.push(randomColor);

    //check contrast
    checkContrast(randomColor, hexText);
    for (icon of icons) {
      checkContrast(randomColor, icon);
    }

    //colorize sliders
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    colorizeSliders(color, hue, brightness, saturation);
  });
  //Reset Inputs
  setDefaultValue();
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

// function updateTextUI(index) {
//   const activeDiv = colorDivs[index];
//   const color = chroma(activeDiv.style.backgroundColor);
//   const text = activeDiv.querySelector("h2");
//   const icons = activeDiv.querySelectorAll(".color-controls button");

//   text.innerText = color.hex();
//   checkContrast(color, text);
//   for (icon of icons) {
//     checkContrast(color, icon);
//   } //you can use forEach loop as well
// }

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

//Event Listeners
generateBtn.addEventListener("click", randomColors);

sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

// colorDivs.forEach((div, index) => {
//   div.addEventListener("change", (index) => {
//     updateTextUI(index);
//   });
// });
// BG가 슬라이더 인풋으로 매번 바뀐다는 전제하에 적용 가능한 이벤트리스너다

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
