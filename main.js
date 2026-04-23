document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Screen Animation
    const tl = gsap.timeline();
    
    tl.to(".loader-subtext", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
      .to(".loader-maintext", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
      .to(".loader-branding", { opacity: 1, scale: 1, duration: 1, ease: "elastic.out(1, 0.5)" }, "-=0.2")
      .to(".loader-progress", { width: "100%", duration: 1.5, ease: "power4.inOut" })
      .to(".loading-screen", { 
          opacity: 0, 
          visibility: "hidden", 
          duration: 1, 
          onComplete: () => {
              initHeroAnimations();
          } 
      });

    // 2. Three.js Background Particles
    const initThree = () => {
        const container = document.getElementById('canvas-container');
        if (!container) return; // Exit if no container

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 3000; // Increased density
        const posArray = new Float32Array(particlesCount * 3);

        for(let i=0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 12;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const material = new THREE.PointsMaterial({
            size: 0.006,
            color: 0xa855f7,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, material);
        scene.add(particlesMesh);

        camera.position.z = 3;

        const animate = () => {
            requestAnimationFrame(animate);
            particlesMesh.rotation.y += 0.0008;
            particlesMesh.rotation.x += 0.0004;
            renderer.render(scene, camera);
        };

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        document.addEventListener('mousemove', (event) => {
            const mouseX = (event.clientX / window.innerWidth) - 0.5;
            const mouseY = (event.clientY / window.innerHeight) - 0.5;
            gsap.to(particlesMesh.rotation, {
                y: mouseX * 0.4,
                x: -mouseY * 0.4,
                duration: 2,
                ease: "power2.out"
            });
        });
    };

    initThree();

    // 3. Page Specific Animations
    const initHeroAnimations = () => {
        const heroTitle = document.querySelector(".hero-title");
        if (heroTitle) {
            gsap.from(".hero-title", { opacity: 0, y: 100, duration: 1.2, ease: "power4.out" });
            gsap.from(".welcome-text", { opacity: 0, x: -50, duration: 1, delay: 0.3 });
            gsap.from(".hero-tagline", { opacity: 0, y: 30, duration: 1, delay: 0.5 });
            gsap.from(".hero-actions", { opacity: 0, scale: 0.8, duration: 1, delay: 0.8 });
            gsap.from(".hero-visual", { opacity: 0, x: 100, duration: 1.5, ease: "power4.out", delay: 0.5 });
        }
        
        // Store Rank Animations
        const rankCards = document.querySelectorAll(".rank-card");
        if (rankCards.length > 0) {
            gsap.from(rankCards, {
                y: 50,
                scale: 0.9,
                duration: 1,
                stagger: 0.2,
                ease: "back.out(1.7)"
            });
        }
    };

    if (!document.getElementById("loading-screen")) {
        initHeroAnimations();
    }

    // 4. Scroll Animations for Section Titles and Cards
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
            },
            y: 30,
            duration: 0.8
        });
    });

    gsap.utils.toArray('.feature-card, .rank-card, .rules-category, .gallery-item, .team-card, .info-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 95%",
            },
            y: 40,
            scale: 0.98,
            duration: 0.6
        });
    });

    // 5. Active Link Highlighting on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 5. IP Copy Functionality
    const ipCard = document.getElementById('ip-card');
    const copyIpBtn = document.getElementById('copy-ip');
    const ipText = "play.knightpixel.xyz";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(ipText).then(() => {
            const originalText = document.querySelector('.ip-subtext').innerText;
            document.querySelector('.ip-subtext').innerText = "IP COPIED!";
            document.querySelector('.ip-subtext').style.color = "#4ade80";
            
            gsap.to(ipCard, { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1 });
            
            setTimeout(() => {
                document.querySelector('.ip-subtext').innerText = originalText;
                document.querySelector('.ip-subtext').style.color = "";
            }, 2000);
        });
    };

    ipCard.addEventListener('click', copyToClipboard);
    copyIpBtn.addEventListener('click', copyToClipboard);

    // 6. Interactive Button Feedback
    const allButtons = document.querySelectorAll('button, .discord-btn, .primary-btn');
    allButtons.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            gsap.to(btn, { scale: 0.95, duration: 0.1 });
        });
        btn.addEventListener('mouseup', () => {
            gsap.to(btn, { scale: 1, duration: 0.1 });
        });
        btn.addEventListener('mouseenter', () => {
            // Add custom spark or glow effect if needed
        });
    });

    // 7. Initializing 3D Tilts
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.3,
    });

    // Parallax effect on the crown
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        gsap.to(".floating-crown", {
            x: moveX * 2,
            y: moveY * 2,
            rotationY: moveX,
            rotationX: -moveY,
            duration: 1
        });
    });
});
