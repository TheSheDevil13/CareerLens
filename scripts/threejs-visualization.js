// 3D Career Path Visualization

class CareerVisualization3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.careerPaths = [];
        this.selectedPath = null;
        this.theme = 'light';
        
        this.init();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 30;
        
        // Create renderer
        const container = document.getElementById('careerVisualization3D');
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(this.renderer.domElement);
        
        // Add lighting
        this.setupLighting();
        
        // Create career path network
        this.createCareerNetwork();
        
        // Add orbit controls
        this.setupControls();
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Start animation
        this.animate();
    }
    
    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);
        
        // Add point lights for glow effect
        const pointLight1 = new THREE.PointLight(0x4a00e0, 0.5, 50);
        pointLight1.position.set(10, 10, 10);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xff8e00, 0.5, 50);
        pointLight2.position.set(-10, -10, 10);
        this.scene.add(pointLight2);
    }
    
    createCareerNetwork() {
        // Create central node (User)
        const userGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const userMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff88,
            emissive: 0x004422,
            emissiveIntensity: 0.3,
            shininess: 100
        });
        const userNode = new THREE.Mesh(userGeometry, userMaterial);
        this.scene.add(userNode);
        
        // Create department nodes in a circle
        const departmentCount = 8;
        const radius = 15;
        
        for (let i = 0; i < departmentCount; i++) {
            const angle = (i / departmentCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            // Department node
            const deptGeometry = new THREE.IcosahedronGeometry(1, 1);
            const deptMaterial = new THREE.MeshPhongMaterial({
                color: this.getDepartmentColor(i),
                emissive: this.getDepartmentColor(i),
                emissiveIntensity: 0.2,
                transparent: true,
                opacity: 0.9
            });
            const deptNode = new THREE.Mesh(deptGeometry, deptMaterial);
            deptNode.position.set(x, y, 0);
            this.scene.add(deptNode);
            
            // Create connection line
            this.createConnection(userNode.position, deptNode.position, 0x888888);
            
            // Create career path nodes around department
            this.createCareerPaths(deptNode, i);
            
            // Add click interaction
            deptNode.userData = { type: 'department', id: i };
            deptNode.onClick = () => this.onDepartmentClick(i);
        }
        
        // Add floating particles
        this.createParticles();
    }
    
    createCareerPaths(parentNode, deptIndex) {
        const careerCount = 4;
        const radius = 4;
        
        for (let i = 0; i < careerCount; i++) {
            const angle = (i / careerCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            const careerGeometry = new THREE.TetrahedronGeometry(0.6, 0);
            const careerMaterial = new THREE.MeshPhongMaterial({
                color: this.getCareerColor(deptIndex, i),
                emissive: this.getCareerColor(deptIndex, i),
                emissiveIntensity: 0.3
            });
            
            const careerNode = new THREE.Mesh(careerGeometry, careerMaterial);
            careerNode.position.set(
                parentNode.position.x + x,
                parentNode.position.y + y,
                parentNode.position.z
            );
            
            this.scene.add(careerNode);
            
            // Create connection
            this.createConnection(parentNode.position, careerNode.position, this.getCareerColor(deptIndex, i));
            
            careerNode.userData = { type: 'career', dept: deptIndex, id: i };
        }
    }
    
    createConnection(start, end, color) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(start.x, start.y, start.z),
            new THREE.Vector3(
                (start.x + end.x) / 2,
                (start.y + end.y) / 2,
                (start.z + end.z) / 2 + 5
            ),
            new THREE.Vector3(end.x, end.y, end.z)
        ]);
        
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        const material = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.4,
            linewidth: 1
        });
        
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        
        // Add glow effect
        const glowGeometry = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(points),
            50,
            0.1,
            8,
            false
        );
        
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(glow);
    }
    
    createParticles() {
        const particleCount = 500;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 50;
            positions[i + 1] = (Math.random() - 0.5) * 50;
            positions[i + 2] = (Math.random() - 0.5) * 50;
            
            colors[i] = Math.random();
            colors[i + 1] = Math.random();
            colors[i + 2] = Math.random();
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        this.particles = new THREE.Points(particles, particleMaterial);
        this.scene.add(this.particles);
    }
    
    setupControls() {
        // Mouse controls
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Raycasting for interaction
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        document.addEventListener('click', (event) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.scene.children, true);
            
            if (intersects.length > 0) {
                const object = intersects[0].object;
                if (object.userData.type === 'department') {
                    this.onDepartmentClick(object.userData.id);
                } else if (object.userData.type === 'career') {
                    this.onCareerClick(object.userData.dept, object.userData.id);
                }
            }
        });
        
        // Store for animation
        this.mouseX = mouseX;
        this.mouseY = mouseY;
    }
    
    onDepartmentClick(deptId) {
        console.log(`Department ${deptId} clicked`);
        // Highlight department and show details
        this.highlightDepartment(deptId);
        
        // Show department info in UI
        if (window.app && appData.departments[deptId]) {
            window.app.showNotification(
                `Selected: ${appData.departments[deptId].name}`,
                'info'
            );
        }
    }
    
    onCareerClick(deptId, careerId) {
        console.log(`Career ${careerId} in department ${deptId} clicked`);
        // Animate career path selection
        this.animateCareerSelection(deptId, careerId);
    }
    
    highlightDepartment(deptId) {
        // Find and highlight the department node
        this.scene.children.forEach(child => {
            if (child.userData && child.userData.id === deptId) {
                // Scale up animation
                const scaleUp = gsap.to(child.scale, {
                    x: 1.5,
                    y: 1.5,
                    z: 1.5,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
                
                // Pulse effect
                const material = child.material;
                const originalEmissive = material.emissiveIntensity;
                gsap.to(material, {
                    emissiveIntensity: 0.8,
                    duration: 0.5,
                    yoyo: true,
                    repeat: 1
                });
            }
        });
    }
    
    animateCareerSelection(deptId, careerId) {
        // Create a path animation
        const particles = this.createSelectionParticles(deptId, careerId);
        
        // Camera animation to focus on the career
        gsap.to(this.camera.position, {
            x: 10,
            y: 5,
            z: 20,
            duration: 1,
            ease: "power2.inOut"
        });
    }
    
    createSelectionParticles(deptId, careerId) {
        // Create particle explosion effect
        const particleCount = 100;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = 0;
            positions[i + 1] = 0;
            positions[i + 2] = 0;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.2,
            color: this.getCareerColor(deptId, careerId),
            transparent: true
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(particleSystem);
        
        // Animate particles
        const positionsArray = particleSystem.geometry.attributes.position.array;
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2
            );
            
            gsap.to(positionsArray, {
                [i]: positionsArray[i] + velocity.x * 50,
                [i + 1]: positionsArray[i + 1] + velocity.y * 50,
                [i + 2]: positionsArray[i + 2] + velocity.z * 50,
                duration: 2,
                ease: "power2.out",
                onUpdate: () => {
                    particleSystem.geometry.attributes.position.needsUpdate = true;
                },
                onComplete: () => {
                    this.scene.remove(particleSystem);
                }
            });
        }
        
        return particleSystem;
    }
    
    getDepartmentColor(index) {
        const colors = [
            0x4a00e0, 0xff8e00, 0x00b894, 0xd63031,
            0x0984e3, 0xa29bfe, 0xfd79a8, 0xfdcb6e
        ];
        return colors[index % colors.length];
    }
    
    getCareerColor(deptIndex, careerIndex) {
        const hue = (deptIndex * 45 + careerIndex * 30) % 360;
        return new THREE.Color(`hsl(${hue}, 70%, 60%)`);
    }
    
    onWindowResize() {
        const container = document.getElementById('careerVisualization3D');
        this.camera.aspect = container.offsetWidth / container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Rotate particles
        if (this.particles) {
            this.particles.rotation.x += 0.001;
            this.particles.rotation.y += 0.002;
        }
        
        // Gentle camera movement based on mouse
        this.camera.position.x += (this.mouseX * 10 - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.mouseY * 10 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    updateTheme(theme) {
        this.theme = theme;
        
        // Update scene background
        if (theme === 'dark') {
            this.scene.background = new THREE.Color(0x0a0a0a);
        } else {
            this.scene.background = new THREE.Color(0xf8f9fa);
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.threeScene = new CareerVisualization3D();
});