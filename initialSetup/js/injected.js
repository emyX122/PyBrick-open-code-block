//réception des message reçu de l'iframe
window.addEventListener('message', async (event) => {
    // Vérifiez l'origine
    if (event.data.type === 'INJECT_CODE') {

        //insertion des données reçu
        injectCodeToPybricks(event.data.filename, event.data.code)
            .then(() => console.log('✅ Code injecté!'))
            .catch(err => console.error('❌ Erreur:', err));
        
    }
});

//fonction d'insertion du code dans la base de donnée
async function injectCodeToPybricks(filePath, pythonCode) {
    //attendre que tout soit terminé avant de retourné
    return new Promise((resolve, reject) => {
        //initilaisation de la base de donné
        const request = indexedDB.open('pybricks.fileStorage2');

        //database trouvé
        request.onerror = () => reject('Erreur: Base de données non trouvée');

        //database non trouvé
        request.onsuccess = (event) => {
            const db = event.target.result;
            
            try {
                //préparation de l'insertion
                const transaction = db.transaction(['_contents'], 'readwrite');
                const store = transaction.objectStore('_contents');
                
                const fileData = {
                    path: filePath,
                    contents: pythonCode
                };
                
                const putRequest = store.put(fileData);
                
                putRequest.onsuccess = () => {
                    console.log("mise à jour du code");
                    resolve(fileData);
                };
                
                //débogage
                putRequest.onerror = () => reject('Erreur lors de l\'insertion');
                transaction.onerror = () => reject('Erreur lors de la transaction');
            } catch (e) {
                reject(`Erreur: ${e.message}`);
            }
        };
    });
}

