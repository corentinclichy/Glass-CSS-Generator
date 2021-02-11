const pickerBtn = document.querySelector("#picker");

let picker = new Picker({
  parent: pickerBtn,
  popup: "top",
  color: "rgb(255, 255, 255)",
  format: "rgb",
});
// Selector
const glassContainer = document.querySelector(".container");
const blurInput = document.querySelector("#blurInput");
const transpInput = document.querySelector("#transInput");
const blurValue = document.querySelector(".blurValue");
const transValue = document.querySelector(".transValue");
const generatedCSS = document.querySelector("#generatedCSS");
const allInput = document.querySelectorAll(".settings input");
const outlineBox = allInput[2];

//Event Listener

blurInput.addEventListener("input", (e) => {
  updateBlur(e);
  updateCSSWithInput(e);
});

transpInput.addEventListener("input", (e) => {
  updateTrans(e);
  updateCSSWithInput(e);
});

pickerBtn.addEventListener("click", (e) => {
  updateColor(e);
  updateCSSWithInput(e);
});

outlineBox.addEventListener("change", (e) => {
  updateOutline(e);
  updateCSSWithInput(e);
});

function updateCSSWithInput(e) {
  const blurValue = allInput[0].value;
  const transValue = allInput[1].value;
  const transValueFormatted = transValue / 100;
  const colorBackground = window.getComputedStyle(pickerBtn).backgroundColor;
  const rgbValue = chroma(colorBackground).rgb();

  if (outlineBox.checked) {
    generatedCSS.value = `background: rgba(${rgbValue[0]}, ${rgbValue[1]}, ${rgbValue[2]}, ${transValueFormatted}) \nbox-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);\nbackdrop-filter: blur(${blurValue}px);\n-webkit-backdrop-filter: blur(${blurValue}px);\nborder-radius: 10px;\nborder: 1px solid rgba(255, 255, 255, 0.18);`;
  } else {
    generatedCSS.value = `background: rgba(${rgbValue[0]}, ${rgbValue[1]}, ${rgbValue[2]}, ${transValueFormatted}) \nbox-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);\nbackdrop-filter: blur(${blurValue}px);\n-webkit-backdrop-filter: blur(${blurValue}px);\nborder-radius: 10px;\n`;
  }
}

function updateTrans(e) {
  const value = e.target.value / 100;
  transValue.innerText = value;

  const colorBackground = window.getComputedStyle(pickerBtn).backgroundColor;
  const rgbValue = chroma(colorBackground).rgb();

  // change the style of the glass
  glassContainer.style.background = `rgba(${rgbValue[0]}, ${rgbValue[1]}, ${rgbValue[2]}, ${value})`;
}

function updateBlur(e) {
  const value = e.target.value;
  blurValue.innerText = value;
  glassContainer.style.backdropFilter = `blur(${value}px)`;
  glassContainer.style.webkitBackdropFilter = `blur(${value}px)`;
}

function updateColor(e) {
  // Color Picker

  picker.onChange = function (color) {
    pickerBtn.style.background = color.rgbaString;
  };

  const colorBackground = window.getComputedStyle(pickerBtn).backgroundColor;
  const rgbaValue = chroma(colorBackground).rgba();

  glassContainer.style.background = `rgba(${rgbaValue[0]}, ${rgbaValue[1]}, ${rgbaValue[2]}, ${transValue.innerText})`;
}

function updateOutline(e) {
  glassContainer.classList.toggle("isOutlined");
}

//copy Clipboard data

let copyButton = document.querySelector(".copy-css");
let buttonText = document.querySelector(".tick");

buttonText.innerHTML = "Copy To Clipboard";

const tickMark =
  '<svg width="28" height="22.5" viewBox="0 0 58 45" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" fill-rule="nonzero" d="M19.11 44.64L.27 25.81l5.66-5.66 13.18 13.18L52.07.38l5.65 5.65"/></svg>';

copyButton.addEventListener("click", function () {
  if (buttonText.innerHTML !== "Copy To Clipboard") {
    buttonText.innerHTML = "Copy To Clipboard";
  } else if (buttonText.innerHTML === "Copy To Clipboard") {
    buttonText.innerHTML = tickMark;
  }
  this.classList.toggle("button__circle");
});

copyButton.addEventListener("transitionend", (e) => {
  setTimeout((e) => {
    copyButton.classList.remove("button__circle");
    buttonText.innerHTML = "Copy To Clipboard";
    const el = document.createElement("textarea");
    document.body.appendChild(el);
    el.value = generatedCSS.value;
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }, 400);
});

const changeBckButton = document.querySelector(".change-bck-btn");

changeBckButton.addEventListener("click", (e) => {
  changeBackURL(e);
});

async function getImg() {
  const url = "https://api.unsplash.com/photos/random?query='blue'";
  let client_KEY = "rdJJ3GW2fZKLS7LJIW8dP_qUst5JXB6Z2D94TjTHoNo";

  let headers = new Headers();

  headers.set(
    "Authorization",
    "Client-ID " + "DErPA3AjjESkDi_fv5QmAXaR-pkdXAhPrd58MLi1zGI"
  );

  const res = await fetch(url, { method: "GET", headers: headers });

  const data = await res.json();

  return data;
}

function changeBackURL(e) {
  getImg().then((data) => {
    console.log(data);
    const imgUrlFull = data.urls.regular;

    let photographer;

    if (data.user.last_name === null) {
      photographer = `${data.user.name} `;
    } else {
      photographer = `${data.user.first_name} ${data.user.last_name}`;
    }

    const photographerUrl =
      data.user.links.html + "?utm_source=GlassGenerator&utm_medium=referral";

    const photographerName = document.querySelector(".photographer-name");

    photographerName.innerText = photographer;

    photographerName.href = photographerUrl;

    document.body.style.backgroundImage = `url(${imgUrlFull})`;
  });
}

changeBackURL();
