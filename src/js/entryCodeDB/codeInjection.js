//fonction pour envoyer du code à injecter au parent
function injectCodeToPybricks(code) {
    window.parent.postMessage({
        type: 'INJECT_CODE',
        code: code
    }, '*');
}