// Wrapper for rendering ejs templates with asycn await


// ====== IMPORTS ======

const ejs = require('ejs');


// ====== FUNCTIONS ======

/**
 * 
 * @param {string} filename - Path to ejs template file 
 * @param {object} data - Object containing arguments to pass to template
 * @param {object} options - Ejs options
 */
async function renderEjsAsync (filename, data, options = {}) {
    return new Promise((res, rej) => {
        ejs.renderFile(filename, data, options, (err, string) => {
            if (err) {
                rej(err);
            } else {
                res(string);
            }
        });
    });
}


// ====== EXPORTS ======

module.exports = renderEjsAsync