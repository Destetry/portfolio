// On utilise window.onload au lieu de DOMContentLoaded pour être sûr 
// que TOUS les scripts externes (GSAP, Lenis) sont 100% chargés.
window.onload = function() {
    
    console.log("✅ Page et Scripts chargés.");

    // --- 1. SETUP LENIS (Avec sécurité) ---
    try {
        // On vérifie si Lenis est bien là
        if (typeof Lenis !== 'undefined') {
            const lenis = new Lenis();
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
            console.log("✅ Scroll Fluide activé.");
        } else {
            console.warn("⚠️ Lenis n'a pas chargé (problème CDN), mais le site continue.");
        }
    } catch (error) {
        console.error("Erreur Lenis ignorée pour ne pas bloquer l'intro:", error);
    }

    // --- 2. INTRO SÉQUENCE ---
    const introOverlay = document.getElementById('intro-overlay');
    const counter = document.getElementById('counter');
    const wakeBtn = document.getElementById('wake-btn');
    const mainContent = document.getElementById('main-content');
    const loaderContent = document.querySelector('.loader-content');

    // Vérification de sécurité
    if (!introOverlay || !counter) {
        console.error("❌ ERREUR HTML : Il manque des ID (intro-overlay ou counter).");
        return; 
    }

    // Bloquer le scroll
    document.body.style.overflow = 'hidden';

    // Compteur avec GSAP
    let countObj = { val: 0 };
    
    // Si GSAP n'est pas chargé, on force l'affichage (fallback)
    if (typeof gsap === 'undefined') {
        alert("GSAP ne charge pas. Vérifie ta connexion internet.");
        introOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        mainContent.style.opacity = 1;
        return;
    }

    gsap.to(countObj, {
        val: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: () => {
            counter.innerText = Math.round(countObj.val);
        },
        onComplete: () => {
            // Animation d'apparition du bouton
            gsap.to(loaderContent, { y: -20, duration: 0.5 });
            if(wakeBtn) {
                wakeBtn.style.display = 'block';
                gsap.from(wakeBtn, { opacity: 0, y: 10, duration: 0.5 });
            }
        }
    });

    // Clic sur le bouton
    if (wakeBtn) {
        wakeBtn.addEventListener('click', () => {
            const tl = gsap.timeline();

            tl.to(introOverlay, {
                scaleY: 0.005,
                scaleX: 1,
                duration: 0.2,
                ease: "power2.in"
            })
            .to(introOverlay, {
                width: "100%",
                height: "2px",
                background: "#FFFFFF",
                duration: 0.1,
                onStart: () => { introOverlay.innerHTML = ''; }
            })
            .to(introOverlay, {
                scaleX: 0,
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    introOverlay.style.display = 'none';
                    document.body.style.overflow = ''; 
                    mainContent.style.opacity = 1;
                    
                    // Lancer les autres anims
                    gsap.from("h1", { y: 50, opacity: 0, duration: 1 });
                    startTypewriter();
                }
            });
        });
    }

    // --- 3. TYPEWRITER ---
    function startTypewriter() {
        const text = "Je code, je filme et je crée.";
        const container = document.getElementById('typewriter');
        if(!container) return;
        
        let i = 0;
        function type() {
            if (i < text.length) {
                container.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        }
        type();
    }
    
    // --- 4. SCROLL TRIGGER ---
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });
        });
    }
};