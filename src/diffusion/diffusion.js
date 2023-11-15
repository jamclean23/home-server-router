// Javascript for diffusion page


// ====== IMPORTS ======


// Css
import './diffusion.css';


// ====== FUNCTIONS ======

function attachListeners () {
    addSubmitBtnListener();
}

function addSubmitBtnListener () {
    const submitBtn = document.querySelector('#submitBtn');
    submitBtn.addEventListener('click', handleSubmitClick);
}

async function handleSubmitClick () {
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
            const resultImg = document.querySelector('.resultImg');
            resultImg.src = `data:image/png;base64, ${result.result.images[0]}`;
        }
    }
    promptTextArea.disabled = false;
}
    
// ====== MAIN ======

attachListeners();