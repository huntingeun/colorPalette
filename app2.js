class Colors {
  constructor() {
    this.adjustBtns = document.querySelectorAll(".adjust");
    this.lockBtns = document.querySelectorAll(".lock");
    this.sliders = document.querySelectorAll(".sliders");
    this.closeAdjust = document.querySelectorAll(".close-adjustment");
    this.colorDivs = document.querySelectorAll(".color");
    this.generateBtn = document.querySelector(".generate-btn");
    this.generateText = document.querySelector(".generate-panel p");
    this.currentHexes = document.querySelectorAll(".color h2");
    this.copyCon = document.querySelector(".copy-container");
    this.copyPop = document.querySelector(".copy-popup");
    this.saveCon = document.querySelector(".save-container");
    this.savePop = document.querySelector(".save-popup");
    this.saveClose = document.querySelector(".close-save");
    this.saveBtn = document.querySelector(".save-btn");
    this.saveSubmit = document.querySelector(".submit-save");
    this.initialColors;
  }
  randomHex() {
    const letters = "0123456789ABCDEF";
    let hash = "#";
    let i;
    for (i = 0; i < 6; i++) {
      hash += letters[Math.floor(Math.random() * 16)];
    }
    return hash;
  }
  lockColor(e) {
    e.target.parentElement.parentElement.classList.toggle("locked");
    if (e.target.parentElement.parentElement.classList.contains("locked")) {
      e.target.innerHTML = `<i class="fas fa-lock"></i>`;
    } else {
      e.target.innerHTML = `<i class="fas fa-lock-open"></i>`;
    }
  }
  generateColor() {
    this.initialColors = [];

    this.colorDivs.forEach((div) => {
      const hexText = div.children[0];
      const icons = div.querySelectorAll(".color-controls button");
      const currentValue = this.randomHex();

      if (div.classList.contains("locked")) {
        this.initialColors.push(hexText.innerText); //새 랜덤 이전의 값
        div.style.backgroundColor = hexText.innerText;
      } else {
        this.initialColors.push(currentValue);
        hexText.innerText = currentValue;
        div.style.backgroundColor = currentValue;
        this.checkContrast(currentValue, hexText);
        icons.forEach((icon) => {
          this.checkContrast(currentValue, icon);
        });

        const sliders = div.querySelectorAll(".sliders input");
        const color = chroma(currentValue);
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        this.colorizeSliders(color, hue, brightness, saturation);
      }
    });
    //default colorizer
    this.setDefault();

    //generate to refresh
    let count = 0;
    count++;
    if (count !== 0) {
      this.generateText.innerText = "Refresh";
    }
  }
  sliderActive(event) {
    this.sliders.forEach((slider) => {
      if (slider.classList.contains(event.target.classList[1])) {
        slider.classList.toggle("active");
      }
    });
  }
  checkContrast(color, element) {
    const luminance = chroma(color).luminance();
    if (luminance > 0.5) {
      element.style.color = "black";
    } else {
      element.style.color = "white";
    }
  }
  colorizeSliders(color, hue, brightness, saturation) {
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`;

    const midBright = color.set("hsl.l", 0.5);
    const brightScale = chroma.scale(["black", midBright, "white"]);
    brightness.style.backgroundImage = `linear-gradient(to right,${brightScale(
      0
    )},${brightScale(0.5)},${brightScale(1)})`;

    const noSat = color.set("hsl.s", 0);
    const fullSat = color.set("hsl.s", 1);
    const satScale = chroma.scale([noSat, color, fullSat]);
    saturation.style.backgroundImage = `linear-gradient(to right,${satScale(
      0
    )},${satScale(1)})`;
  }
  updateBG(e) {
    const sliders = e.target.parentElement.querySelectorAll("input");
    const currentColor = e.target.parentElement.parentElement.querySelector(
      "h2"
    ).innerText;
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    const color = chroma(currentColor) //currentColor를 텍스트로 가져와서 색변경
      .set("hsl.h", hue.value)
      .set("hsl.l", brightness.value)
      .set("hsl.s", saturation.value);

    e.target.parentElement.parentElement.style.backgroundColor = color;

    this.colorizeSliders(color, hue, brightness, saturation);
  }
  updateTextUI(e) {
    const activeDiv = e.target.parentElement.parentElement;
    const color = chroma(activeDiv.style.backgroundColor).hex();
    const colorText = activeDiv.querySelector("h2");
    const icons = activeDiv.querySelectorAll(".color-controls button");

    colorText.innerText = color;

    this.checkContrast(color, colorText);
    icons.forEach((icon) => {
      this.checkContrast(color, icon);
    });
  }
  setDefault() {
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach((slider) => {
      if (slider.name === "hue") {
        const hueColor = this.initialColors[slider.getAttribute("data-hue")];
        const hueValue = Math.floor(chroma(hueColor).hsl()[0]);
        slider.value = hueValue;
      }
      if (slider.name === "brightness") {
        const brightColor = this.initialColors[
          slider.getAttribute("data-bright")
        ];
        const brightValue =
          Math.floor(chroma(brightColor).hsl()[2] * 100) / 100;
        slider.value = brightValue;
      }
      if (slider.name === "saturation") {
        const satColor = this.initialColors[slider.getAttribute("data-sat")];
        const satValue = Math.floor(chroma(satColor).hsl()[1] * 100) / 100;
        slider.value = satValue;
      }
    });
  }
  copyToClip(e) {
    const el = document.createElement("textarea");
    document.body.appendChild(el);
    el.value = e.target.innerText;
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);

    this.copyCon.classList.add("active");
    this.copyPop.classList.add("active");
    setTimeout(() => {
      this.copyCon.classList.remove("active");
      this.copyPop.classList.remove("active");
    }, 1500);
  }
  closeSlider(e) {
    e.target.parentElement.classList.remove("active");
  }
  showSave() {
    this.saveCon.classList.add("active");
    this.savePop.classList.add("active");
  }
  closeSave() {
    this.saveCon.classList.remove("active");
    this.savePop.classList.remove("active");
  }
  saveToLocal(paletteObj) {
    let localPalettes;
    const loadedPalette = localStorage.getItem("Palettes");
    if (loadedPalette === null) {
      localPalettes = [];
    } else {
      localPalettes = JSON.parse(loadedPalette);
    }

    localPalettes.push(paletteObj);
    localStorage.setItem("Palettes", JSON.stringify(localPalettes));
  }
  submitSave() {
    this.saveCon.classList.remove("active");
    this.savePop.classList.remove("active");

    const input = document.querySelector(".save-name");
    const name = input.value;
    const paletteObj = {
      name,
      colors: this.initialColors,
    };

    this.saveToLocal(paletteObj);
    input.value = "";
  }
}

function init() {
  const colors = new Colors();

  colors.adjustBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      colors.sliderActive(event);
    });
  });

  colors.closeAdjust.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      colors.closeSlider(e);
    });
  });

  colors.lockBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      colors.lockColor(e);
    });
  });

  colors.generateBtn.addEventListener("click", () => {
    colors.generateColor();
  });

  colors.sliders.forEach((slider) => {
    slider.addEventListener("input", (e) => {
      colors.updateBG(e);
    });
  });

  colors.colorDivs.forEach((div) => {
    div.addEventListener("change", (e) => colors.updateTextUI(e));
  }); //sliders eventlistener change fine too but this code is more neat

  colors.currentHexes.forEach((hex) => {
    hex.addEventListener("click", (e) => {
      colors.copyToClip(e);
    });
  });

  colors.saveBtn.addEventListener("click", () => {
    colors.showSave();
  });
  colors.saveClose.addEventListener("click", () => {
    colors.closeSave();
  });
  colors.saveSubmit.addEventListener("click", () => {
    colors.submitSave();
  });
}

init();
