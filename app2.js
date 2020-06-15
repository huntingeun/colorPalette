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
    this.initialColors = [];
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
    this.colorDivs.forEach((div) => {
      const hexText = div.children[0];
      const btnSlider = div.children[1].children[0];
      const btnLock = div.children[1].children[1];
      const currentValue = this.randomHex();

      if (div.classList.contains("locked")) {
        this.initialColors.push(hexText.innerText); //새 랜덤 이전의 값
        div.style.backgroundColor = hexText.innerText;
      } else {
        this.initialColors.push(currentValue);
        hexText.innerText = currentValue;
        div.style.backgroundColor = currentValue;
        this.checkContrast(currentValue, hexText);
        this.checkContrast(currentValue, btnSlider);
        this.checkContrast(currentValue, btnLock);

        const sliders = div.querySelectorAll(".sliders input");
        const color = chroma(currentValue);
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        this.colorizeSliders(color, hue, brightness, saturation);
      }
    });
  }
  refreshBtn() {
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
        console.log(slider);
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
  closeSlider(e) {
    e.target.parentElement.classList.remove("active");
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
    colors.refreshBtn();
  });
}

init();
