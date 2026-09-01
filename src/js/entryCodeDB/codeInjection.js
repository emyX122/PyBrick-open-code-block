//fonction pour envoyer du code à injecter au parent
function injectCodeToPybricks(filename, code) {
    window.parent.postMessage({
        type: 'INJECT_CODE',
        filename: filename,
        code: code
    }, '*');
}