/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// Javascript for diffusion page

// ====== IMPORTS ======

// Css


// ====== FUNCTIONS ======

function attachListeners() {
  addSubmitBtnListener();
}
function addSubmitBtnListener() {
  const submitBtn = document.querySelector('#submitBtn');
  submitBtn.addEventListener('click', handleSubmitClick);
}
async function handleSubmitClick() {
  const submitBtn = document.querySelector('#submitBtn');
  submitBtn.disabled = true;
  const promptTextArea = document.querySelector('#prompt');
  promptTextArea.disabled = true;
  const prompt = promptTextArea.value;
  if (prompt) {
    let result;
    try {
      const response = await fetch('/diffusion/txt2Img', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "prompt": prompt
        })
      });
      result = await response.json();
      console.log(result);
    } catch (err) {
      console.log(err);
      return;
    }

    // Set result image if exists
    if (result.result.images[0]) {
      const resultImgWrapper = document.querySelector('.resultImgWrapper');
      const resultImg = document.createElement('img');
      resultImg.classList.add('resultImg');
      resultImg.src = `data:image/png;base64, ${result.result.images[0]}`;
      if (resultImgWrapper.firstChild) {
        resultImgWrapper.insertBefore(resultImg, resultImgWrapper.firstChild);
      } else {
        resultImgWrapper.appendChild(resultImg);
      }
    }
  }
  submitBtn.disabled = false;
  promptTextArea.disabled = false;
}

// ====== MAIN ======

attachListeners();
/******/ })()
;
//# sourceMappingURL=diffusion.js.map