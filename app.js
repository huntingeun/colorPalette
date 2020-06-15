//Global selections and vars
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate-btn");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
let initialColors;

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

function randomColors() {
  colorDivs.forEach((div) => {
    const hexText = div.children[0];
    const randomColor = generateHex();

    //add random color to the bg
    hexText.innerText = randomColor;
    div.style.backgroundColor = randomColor;
    //check contrast
    checkContrast(randomColor, hexText);

    //colorize sliders
   
  });
}

function checkContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

// function colorizeSliders(color, hue, brightness, saturation) {
//   const noSat = color.set("hsl.s", 0);
//   const fullSat = color.set("hsl.s", 1);
//   const satScale = chroma.scale([noSat, color, fullSat]);

//   saturation.style.backgroundImage = `linear-gradient(to right,${satScale(
//     0
//   )},${satScale(1)})`;
// }

generateBtn.addEventListener("click", () => {
  randomColors();
});
