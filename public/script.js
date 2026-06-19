// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initGSAP();
    initForm();
});

/* ==========================================
   Three.js Anti-Gravity Background
   ========================================== */
function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle Group
    const particles = new THREE.Group();
    scene.add(particles);

    // Geometries & Materials (Mathematical/Academic abstract theme)
    const geometries = [
        new THREE.IcosahedronGeometry(0.5, 0),
        new THREE.TetrahedronGeometry(0.5, 0),
        new THREE.OctahedronGeometry(0.5, 0)
    ];

    // College colors for particles
    const colors = [0xDC143C, 0x4169E1, 0xD4AF37, 0xCCCCCC];

    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
        const geo = geometries[Math.floor(Math.random() * geometries.length)];
        const mat = new THREE.MeshBasicMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            wireframe: true,
            transparent: true,
            opacity: Math.random() * 0.4 + 0.1
        });

        const mesh = new THREE.Mesh(geo, mat);
        
        // Random positioning within a wide spread
        mesh.position.x = (Math.random() - 0.5) * 80;
        mesh.position.y = (Math.random() - 0.5) * 80;
        mesh.position.z = (Math.random() - 0.5) * 40;

        // Add custom properties for anti-gravity floating
        mesh.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            ),
            rotationSpeed: new THREE.Vector3(
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01
            )
        };

        particles.add(mesh);
    }

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();

        // Smooth mouse target follow
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Slowly rotate entire group based on mouse
        particles.rotation.y += 0.05 * (targetX - particles.rotation.y);
        particles.rotation.x += 0.05 * (targetY - particles.rotation.x);

        // Update individual particles (Anti-Gravity drift)
        particles.children.forEach(mesh => {
            mesh.rotation.x += mesh.userData.rotationSpeed.x;
            mesh.rotation.y += mesh.userData.rotationSpeed.y;
            mesh.rotation.z += mesh.userData.rotationSpeed.z;

            mesh.position.add(mesh.userData.velocity);

            // Subtle bounding box reflection
            if (Math.abs(mesh.position.x) > 40) mesh.userData.velocity.x *= -1;
            if (Math.abs(mesh.position.y) > 40) mesh.userData.velocity.y *= -1;
            if (Math.abs(mesh.position.z) > 20) mesh.userData.velocity.z *= -1;
            
            // Mouse Repel effect
            const vector = new THREE.Vector3(mouseX * 0.05, -mouseY * 0.05, 0);
            const distance = mesh.position.distanceTo(vector);
            if(distance < 10) {
                mesh.position.add(mesh.position.clone().sub(vector).normalize().multiplyScalar(0.05));
            }
        });

        renderer.render(scene, camera);
    }

    animate();

    // Window Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* ==========================================
   GSAP Scroll Animations
   ========================================== */
function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    // Fade up elements as they enter viewport
    const revealElements = document.querySelectorAll('.gs-reveal');
    
    revealElements.forEach(elem => {
        gsap.fromTo(elem, 
            { y: 50, autoAlpha: 0 },
            {
                duration: 1, 
                y: 0, 
                autoAlpha: 1, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%", // Trigger when top of element hits 85% of viewport
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
}

/* ==========================================
   Contact Form Handling
   ========================================== */
function initForm() {
    const form = document.getElementById('contact-form');
    const responseDiv = document.getElementById('form-response');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Submitting...';
        submitBtn.disabled = true;

        const data = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            course: document.getElementById('course').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                responseDiv.innerHTML = `<p class="success-msg"><i class="fas fa-check-circle"></i> ${result.message}</p>`;
                form.reset();
            } else {
                throw new Error('Server returned false success status');
            }
        } catch (error) {
            console.error('Submission error:', error);
            responseDiv.innerHTML = `<p class="error-msg"><i class="fas fa-exclamation-circle"></i> Failed to submit. Please try again later.</p>`;
        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
            
            // Clear message after 5 seconds
            setTimeout(() => {
                responseDiv.innerHTML = '';
            }, 5000);
        }
    });
}
