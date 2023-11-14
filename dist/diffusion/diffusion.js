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
  const promptTextArea = document.querySelector('#prompt');
  promptTextArea.disabled = true;
  const prompt = promptTextArea.value;
  let result;
  try {
    const response = await fetch('/diffusion/txt2Img');
    result = await response.json();
    console.log(result);
  } catch (err) {
    console.log(err);
  } finally {
    promptTextArea.disabled = false;
  }
}

// ====== MAIN ======

attachListeners();
/******/ })()
;
//# sourceMappingURL=diffusion.js.map