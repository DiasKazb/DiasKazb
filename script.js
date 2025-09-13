// Theme Toggle Functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.body = document.body;
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        
        this.init();
    }
    
    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listener
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
        
        // Handle image loading
        this.handleImageLoading();
    }
    
    handleImageLoading() {
        const profileImage = document.querySelector('.profile-image');
        const placeholder = document.querySelector('.profile-placeholder');
        
        console.log('Profile image element:', profileImage);
        console.log('Placeholder element:', placeholder);
        
        if (profileImage && placeholder) {
            profileImage.addEventListener('error', () => {
                console.log('Image failed to load, showing placeholder');
                profileImage.style.display = 'none';
                placeholder.style.display = 'flex';
            });
            
            profileImage.addEventListener('load', () => {
                console.log('Image loaded successfully');
                placeholder.style.display = 'none';
            });
            
            // Check if image is already loaded
            if (profileImage.complete && profileImage.naturalHeight !== 0) {
                console.log('Image already loaded');
                placeholder.style.display = 'none';
            } else {
                console.log('Image not loaded yet, showing placeholder temporarily');
                placeholder.style.display = 'flex';
            }
        }
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        this.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme toggle icon
        this.updateThemeIcon();
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add animation to theme toggle
        this.themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 150);
    }
    
    updateThemeIcon() {
        const icon = this.themeToggle.querySelector('.theme-icon');
        if (this.currentTheme === 'dark') {
            icon.innerHTML = `
                <path d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            `;
        } else {
            icon.innerHTML = `
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            `;
        }
    }
}

// Copy IP Functionality
class IPCopyManager {
    constructor() {
        this.copyBtn = document.getElementById('copy-ip');
        this.ipElement = document.getElementById('server-ip');
        this.feedbackElement = document.getElementById('copy-feedback');
        
        this.init();
    }
    
    init() {
        this.copyBtn.addEventListener('click', () => {
            this.copyIP();
        });
    }
    
    async copyIP() {
        const ipText = this.ipElement.textContent.trim();
        
        try {
            // Try modern clipboard API first
            await navigator.clipboard.writeText(ipText);
            this.showFeedback('IP скопирован!', 'success');
        } catch (err) {
            // Fallback for older browsers
            this.fallbackCopy(ipText);
        }
        
        // Add visual feedback to button
        this.copyBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.copyBtn.style.transform = 'scale(1)';
        }, 150);
    }
    
    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showFeedback('IP скопирован!', 'success');
        } catch (err) {
            this.showFeedback('Ошибка копирования', 'error');
        }
        
        document.body.removeChild(textArea);
    }
    
    showFeedback(message, type) {
        this.feedbackElement.textContent = message;
        this.feedbackElement.style.color = type === 'success' ? 'var(--accent-primary)' : '#ef4444';
        
        // Clear feedback after 3 seconds
        setTimeout(() => {
            this.feedbackElement.textContent = '';
        }, 3000);
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.revealElements = document.querySelectorAll('.reveal');
        this.heroIllustration = document.getElementById('hero-illustration');
        this.heroPhoto = document.querySelector('.hero-photo');
        
        this.init();
    }
    
    init() {
        // Create intersection observer for reveal animations
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        // Observe all reveal elements
        this.revealElements.forEach(el => {
            this.observer.observe(el);
        });
        
        // Special observer for hero illustration with slide-in effect
        this.heroObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        this.heroObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.2
            }
        );
        
        if (this.heroIllustration) {
            this.heroObserver.observe(this.heroIllustration);
        }
        
        if (this.heroPhoto) {
            this.heroObserver.observe(this.heroPhoto);
        }
    }
}

// Smooth Scrolling for Navigation
class SmoothScrolling {
    constructor() {
        this.navLinks = document.querySelectorAll('a[href^="#"]');
        this.init();
    }
    
    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Header Scroll Effect
class HeaderScrollEffect {
    constructor() {
        this.header = document.querySelector('.header');
        this.lastScrollY = window.scrollY;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            this.header.style.background = 'var(--glass-bg)';
            this.header.style.backdropFilter = 'blur(10px)';
        } else {
            this.header.style.background = 'var(--glass-bg)';
            this.header.style.backdropFilter = 'blur(10px)';
        }
        
        this.lastScrollY = currentScrollY;
    }
}

// Accessibility Features
class AccessibilityManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Add focus outlines for keyboard navigation
        this.addFocusOutlines();
        
        // Add skip to content link
        this.addSkipLink();
        
        // Improve keyboard navigation
        this.improveKeyboardNavigation();
    }
    
    addFocusOutlines() {
        let hasUsedKeyboard = false;
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                hasUsedKeyboard = true;
                document.documentElement.classList.add('show-focus-outlines');
            }
        });
        
        document.addEventListener('mousedown', () => {
            if (hasUsedKeyboard) {
                document.documentElement.classList.remove('show-focus-outlines');
                hasUsedKeyboard = false;
            }
        });
    }
    
    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#home';
        skipLink.textContent = 'Перейти к основному содержимому';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--accent-primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    improveKeyboardNavigation() {
        // Add keyboard support for theme toggle
        document.getElementById('theme-toggle').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                document.getElementById('theme-toggle').click();
            }
        });
        
        // Add keyboard support for copy button
        document.getElementById('copy-ip').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                document.getElementById('copy-ip').click();
            }
        });
    }
}

// Performance Optimizations
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Lazy load images if any are added later
        this.lazyLoadImages();
        
        // Preload critical resources
        this.preloadResources();
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    preloadResources() {
        // Preload Google Fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }
}

// Mobile Menu Manager
class MobileMenuManager {
    constructor() {
        this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        this.nav = document.querySelector('.nav');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        if (this.mobileMenuToggle && this.nav) {
            this.mobileMenuToggle.addEventListener('click', () => {
                this.toggleMenu();
            });
            
            // Close menu when clicking on nav links
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMenu();
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.nav.contains(e.target) && !this.mobileMenuToggle.contains(e.target)) {
                    this.closeMenu();
                }
            });
        }
    }
    
    toggleMenu() {
        this.nav.classList.toggle('active');
        this.mobileMenuToggle.classList.toggle('active');
    }
    
    closeMenu() {
        this.nav.classList.remove('active');
        this.mobileMenuToggle.classList.remove('active');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    new ThemeManager();
    new IPCopyManager();
    new ScrollAnimations();
    new SmoothScrolling();
    new HeaderScrollEffect();
    new AccessibilityManager();
    new PerformanceOptimizer();
    new MobileMenuManager();
    
    // Add loading animation
    document.body.classList.add('loaded');
    
    // Log successful initialization
    console.log('DiasKazb website initialized successfully! 🚀');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause any animations if needed
        document.body.classList.add('page-hidden');
    } else {
        // Page is visible, resume animations
        document.body.classList.remove('page-hidden');
    }
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate any size-dependent elements
        const heroIllustration = document.getElementById('hero-illustration');
        if (heroIllustration && !heroIllustration.classList.contains('revealed')) {
            // Re-trigger animation if needed
            const rect = heroIllustration.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                heroIllustration.classList.add('revealed');
            }
        }
    }, 250);
});

// Add some fun easter eggs
document.addEventListener('keydown', (e) => {
    // Konami code easter egg
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    if (!window.konamiIndex) window.konamiIndex = 0;
    
    if (e.keyCode === konamiCode[window.konamiIndex]) {
        window.konamiIndex++;
        if (window.konamiIndex === konamiCode.length) {
            // Easter egg triggered!
            document.body.style.animation = 'rainbow 2s linear infinite';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 5000);
            window.konamiIndex = 0;
        }
    } else {
        window.konamiIndex = 0;
    }
});

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);
