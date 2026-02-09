document.addEventListener('DOMContentLoaded', () => {
    console.log("🎮 Konami Module Loaded");

    // --- CONFIGURATION ---
    const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let secretCursor = 0;

    // --- ÉLÉMENTS DOM ---
    const konamiBar = document.getElementById('konami-bar');
    const hintText = document.querySelector('.hint-text');
    const easterEggDiv = document.getElementById('easter-egg');
    const visualBtns = document.querySelectorAll('.k-btn');

    // Sécurité : Si la barre n'existe pas dans le HTML, on arrête le script
    if (!konamiBar) return;

    // --- LOGIQUE PRINCIPALE ---
    function checkInput(key) {
        // 1. Animation visuelle du bouton à l'écran
        // On cherche le bouton qui a l'attribut data-key correspondant
        // Note: On gère le cas minuscule/majuscule pour 'b' et 'a'
        const btnToAnimate = document.querySelector(`.k-btn[data-key="${key}"]`) || 
                             document.querySelector(`.k-btn[data-key="${key.toLowerCase()}"]`);

        if (btnToAnimate) {
            btnToAnimate.classList.add('pressed');
            setTimeout(() => btnToAnimate.classList.remove('pressed'), 200);
        }

        // 2. Vérification de la séquence
        const expectedKey = secretCode[secretCursor];
        
        // On compare en minuscules pour éviter les erreurs de CapsLock
        if (key.toLowerCase() === expectedKey.toLowerCase()) {
            secretCursor++;
            
            // Si la séquence est complète
            if (secretCursor === secretCode.length) {
                triggerVictory();
                secretCursor = 0; // Reset
            }
        } else {
            // Erreur : On reset le curseur
            // Exception : Si on se trompe en appuyant sur Haut, ça peut être le début d'une nouvelle séquence
            secretCursor = (key === 'ArrowUp') ? 1 : 0;
        }
    }

    // --- ÉVÉNEMENT VICTOIRE ---
    /*function triggerVictory() {
        console.log("🚀 CHEAT CODE ACTIVATED!");
        
        // 1. Afficher l'overlay géant
        if (easterEggDiv) {
            easterEggDiv.style.display = 'flex';
            setTimeout(() => {
                easterEggDiv.style.display = 'none';
            }, 4000);
        }

        // 2. Ouvrir la barre en bas pour montrer le succès
        konamiBar.classList.add('active');

        // 3. Changement de couleur temporaire (Effet Matrix/Hacker)
        document.documentElement.style.setProperty('--accent-color', '#00FF00'); // Vert Hacker
        document.documentElement.style.setProperty('--secondary-color', '#00FF00');

        // 4. Reset des couleurs après 5 secondes
        setTimeout(() => {
            konamiBar.classList.remove('active');
            // Remet tes couleurs originales (Orange et Cyan)
            document.documentElement.style.setProperty('--accent-color', '#FF9F43');
            document.documentElement.style.setProperty('--secondary-color', '#00FFFF');
        }, 5000);
    }*/
	
	// --- ÉVÉNEMENT VICTOIRE ---
    function triggerVictory() {
        console.log("🚀 GOD MODE ACTIVATED!");
        
        // 1. Afficher l'overlay géant (Juste pour le flash info)
        if (easterEggDiv) {
            easterEggDiv.style.display = 'flex';
            setTimeout(() => {
                easterEggDiv.style.display = 'none';
            }, 4000); // L'overlay disparaît, mais le vert reste !
        }

        // 2. Ouvrir la barre en bas pour montrer le succès
        konamiBar.classList.add('active');

        // 3. Changement de couleur PERMANENT (Jusqu'au reload)
        // On passe tout en Vert Hacker (Matrix style)
        document.documentElement.style.setProperty('--accent-color', '#00FF00'); 
        document.documentElement.style.setProperty('--secondary-color', '#00FF00');
        
        // On change aussi la couleur du texte pour que ce soit lisible
        document.documentElement.style.setProperty('--text-color', '#ccffcc');

        // Note : J'ai supprimé le setTimeout qui remettait les couleurs.
        // Le site restera vert tant que l'utilisateur ne rafraîchit pas la page.
    }

    // --- ÉCOUTEURS D'ÉVÉNEMENTS ---

    // A. Clavier (Global)
    document.addEventListener('keydown', (e) => {
        checkInput(e.key);
    });

    // B. Souris (Clic sur les boutons virtuels)
    visualBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-key');
            checkInput(key);
            // Enlève le focus pour éviter que la touche reste "sélectionnée"
            btn.blur();
        });
    });

    // C. Ouverture de la barre au clic sur le texte
    if (hintText) {
        hintText.addEventListener('click', () => {
            konamiBar.classList.toggle('active');
        });
    }
});