// Shared Theme Manager - Works across all pages
// Apply theme immediately to prevent flash (runs before DOM)
(function() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    let theme = 'light';
    
    if (savedTheme) {
        theme = savedTheme;
    } else if (prefersDark.matches) {
        theme = 'dark';
    }
    
    document.documentElement.setAttribute('data-theme', theme);
})();

class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        // Load theme from localStorage or use system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else if (prefersDark.matches) {
            this.currentTheme = 'dark';
        }
        
        // Apply theme (should already be applied by inline script, but ensure it's set)
        this.applyTheme();
        
        // Wait for DOM to be ready, then initialize toggle button
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initToggle());
        } else {
            this.initToggle();
        }
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Update Three.js scene colors if available
        if (window.threeScene) {
            window.threeScene.updateTheme(this.currentTheme);
        }
    }

    initToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) {
            // Create theme toggle button if it doesn't exist
            this.createThemeToggle();
            return;
        }
        
        // Set initial icon state
        this.updateToggleIcon();
        
        // Add click event listener
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    createThemeToggle() {
        // Check if theme toggle container exists
        let toggleContainer = document.querySelector('.theme-toggle');
        
        if (!toggleContainer) {
            toggleContainer = document.createElement('div');
            toggleContainer.className = 'theme-toggle';
            document.body.appendChild(toggleContainer);
        }
        
        // Create button if it doesn't exist
        let toggleButton = document.getElementById('themeToggle');
        if (!toggleButton) {
            toggleButton = document.createElement('button');
            toggleButton.id = 'themeToggle';
            toggleButton.className = 'btn btn-sm';
            toggleButton.innerHTML = '<i class="fas fa-moon"></i><i class="fas fa-sun"></i>';
            toggleContainer.appendChild(toggleButton);
        }
        
        // Set initial icon state
        this.updateToggleIcon();
        
        // Add click event listener
        toggleButton.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
        this.updateToggleIcon();
    }

    updateToggleIcon() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        const moonIcon = themeToggle.querySelector('.fa-moon');
        const sunIcon = themeToggle.querySelector('.fa-sun');
        
        if (moonIcon && sunIcon) {
            if (this.currentTheme === 'dark') {
                moonIcon.style.opacity = '0';
                sunIcon.style.opacity = '1';
            } else {
                moonIcon.style.opacity = '1';
                sunIcon.style.opacity = '0';
            }
        }
    }
}

// Initialize theme manager immediately
window.themeManager = new ThemeManager();

