// ===================================
// Initialization & DOM Ready
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavigation();
    initThemeToggle();
    initInteractiveHero();
    initParallax();
    initCarousel();
    initScrollReveal();
    initStatsCounter();
    initRippleEffect();
    initFloatingButtons();
    initSmoothScroll();
});

// ===================================
// Loader
// ===================================
function initLoader() {
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1000);
    });
}

// ===================================
// Navigation
// ===================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ===================================
// Theme Toggle (Dark/Light Mode)
// ===================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// ===================================
// Interactive Hero Section
// ===================================
function initInteractiveHero() {
    const interactiveWords = document.querySelectorAll('.interactive-word');
    const illustrations = document.querySelectorAll('.illustration');
    
    // Only run if interactive words exist
    if (interactiveWords.length === 0) return;
    
    // Track currently active illustration
    let currentActiveIllustration = null;
    
    interactiveWords.forEach(word => {
        const targetId = word.dataset.target;
        const targetIllustration = document.getElementById(targetId);
        
        if (!targetIllustration) return;
        
        // Mouse enter - activate illustration
        word.addEventListener('mouseenter', () => {
            // Deactivate all illustrations first
            illustrations.forEach(ill => {
                ill.classList.remove('active');
            });
            
            // Activate the target illustration
            targetIllustration.classList.add('active');
            word.classList.add('active');
            currentActiveIllustration = targetIllustration;
            
            // Add subtle bounce effect to the word
            word.style.animation = 'none';
            setTimeout(() => {
                word.style.animation = '';
            }, 10);
        });
        
        // Mouse leave - deactivate illustration
        word.addEventListener('mouseleave', () => {
            targetIllustration.classList.remove('active');
            word.classList.remove('active');
            
            // Delayed check to ensure we don't deactivate if moving to another word
            setTimeout(() => {
                if (!document.querySelector('.interactive-word:hover')) {
                    currentActiveIllustration = null;
                }
            }, 100);
        });
        
        // Touch support for mobile
        word.addEventListener('touchstart', (e) => {
            e.preventDefault();
            
            // If this illustration is already active, deactivate it
            if (targetIllustration.classList.contains('active')) {
                targetIllustration.classList.remove('active');
                word.classList.remove('active');
                currentActiveIllustration = null;
            } else {
                // Deactivate all illustrations
                illustrations.forEach(ill => {
                    ill.classList.remove('active');
                });
                interactiveWords.forEach(w => {
                    w.classList.remove('active');
                });
                
                // Activate this one
                targetIllustration.classList.add('active');
                word.classList.add('active');
                currentActiveIllustration = targetIllustration;
            }
        });
    });
    
    // Keyboard accessibility
    interactiveWords.forEach(word => {
        word.setAttribute('tabindex', '0');
        word.setAttribute('role', 'button');
        word.setAttribute('aria-label', `Show ${word.textContent} information`);
        
        word.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                word.dispatchEvent(new Event('mouseenter'));
                
                // Auto-hide after 3 seconds when activated via keyboard
                setTimeout(() => {
                    word.dispatchEvent(new Event('mouseleave'));
                }, 3000);
            }
        });
    });
    
    // Close all illustrations when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.interactive-word') && !e.target.closest('.illustration')) {
            illustrations.forEach(ill => {
                ill.classList.remove('active');
            });
            interactiveWords.forEach(word => {
                word.classList.remove('active');
            });
        }
    });
    
    // Add performance optimization - pause animations when not in view
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    // Pause all animations when hero is not visible
                    illustrations.forEach(ill => {
                        ill.style.animationPlayState = 'paused';
                    });
                } else {
                    // Resume animations when hero is visible
                    illustrations.forEach(ill => {
                        ill.style.animationPlayState = 'running';
                    });
                }
            });
        }, { threshold: 0.1 });
        
        heroObserver.observe(heroSection);
    }
}

// ===================================
// Parallax Effect
// ===================================
function initParallax() {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxLayers.forEach(layer => {
            const speed = layer.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    });
}

// ===================================
// Service Carousel
// ===================================
function initCarousel() {
    const carousel = document.getElementById('servicesCarousel');
    const track = carousel.querySelector('.carousel-track');
    const cards = carousel.querySelectorAll('.service-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    
    let currentIndex = 0;
    let cardsPerView = 3;
    let cardWidth = 0;
    let gap = 30;
    
    // Calculate cards per view based on screen width
    function updateCardsPerView() {
        if (window.innerWidth <= 640) {
            cardsPerView = 1;
        } else if (window.innerWidth <= 968) {
            cardsPerView = 2;
        } else {
            cardsPerView = 3;
        }
        updateCarousel();
    }
    
    // Create indicators
    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        const totalSlides = Math.ceil(cards.length / cardsPerView);
        
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }
    }
    
    // Update carousel position
    function updateCarousel() {
        const containerWidth = carousel.offsetWidth;
        cardWidth = (containerWidth - (gap * (cardsPerView - 1))) / cardsPerView;
        
        cards.forEach(card => {
            card.style.minWidth = `${cardWidth}px`;
        });
        
        const offset = -(currentIndex * (cardWidth + gap));
        track.style.transform = `translateX(${offset}px)`;
        
        updateIndicators();
    }
    
    // Update active indicator
    function updateIndicators() {
        const indicators = indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === Math.floor(currentIndex / cardsPerView));
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        const maxIndex = cards.length - cardsPerView;
        currentIndex = Math.max(0, Math.min(index * cardsPerView, maxIndex));
        updateCarousel();
    }
    
    // Next slide
    function nextSlide() {
        const maxIndex = cards.length - cardsPerView;
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    }
    
    // Previous slide
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchStartX - touchEndX > 50) {
            nextSlide();
        }
        if (touchEndX - touchStartX > 50) {
            prevSlide();
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    // Initialize
    createIndicators();
    updateCardsPerView();
    
    // Update on resize
    window.addEventListener('resize', () => {
        updateCardsPerView();
    });
    
    // Auto-play (optional)
    let autoplayInterval;
    
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            if (currentIndex >= cards.length - cardsPerView) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateCarousel();
        }, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Start autoplay
    startAutoplay();
    
    // Stop autoplay on user interaction
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
}

// ===================================
// Scroll Reveal Animations
// ===================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// ===================================
// Animated Stats Counter
// ===================================
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
}

// ===================================
// Ripple Effect on Buttons
// ===================================
function initRippleEffect() {
    const rippleButtons = document.querySelectorAll('.ripple-effect');
    
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ===================================
// Floating Action Button & Back to Top
// ===================================
function initFloatingButtons() {
    const fab = document.getElementById('fab');
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = document.querySelector('.hero').offsetHeight;
        
        // Show FAB after scrolling past hero
        if (scrolled > heroHeight) {
            fab.classList.add('visible');
        } else {
            fab.classList.remove('visible');
        }
        
        // Show back to top button
        if (scrolled > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // FAB click action
    fab.addEventListener('click', () => {
        alert('Contact form would open here!');
        // In a real application, this would open a contact modal or form
    });
    
    // Back to top functionality
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// Smooth Scroll for Navigation Links
// ===================================
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// Newsletter Form Handler
// ===================================
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Simulate form submission
        alert(`Thank you for subscribing with: ${email}`);
        newsletterForm.reset();
        
        // In a real application, this would send data to a server
    });
}

// ===================================
// Performance Optimization: Lazy Loading Images
// ===================================
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

initLazyLoading();

// ===================================
// Accessibility: Focus Management
// ===================================
function initAccessibility() {
    // Add focus visible classes
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
    
    // Skip to content functionality
    const skipLink = document.querySelector('.skip-to-content');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            mainContent.setAttribute('tabindex', '-1');
            mainContent.focus();
        });
    }
}

initAccessibility();

// ===================================
// Custom Cursor Effect (Optional Enhancement)
// ===================================
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        const distX = mouseX - cursorX;
        const distY = mouseY - cursorY;
        
        cursorX += distX * 0.1;
        cursorY += distY * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    // Uncomment to enable custom cursor
    // animateCursor();
}

// ===================================
// Console Greeting (Easter Egg)
// ===================================
console.log('%c🚀 TechAtheist - Interactive Analytics Platform', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cMade with ❤️ for TechZephyr Round 1', 'color: #ec4899; font-size: 14px;');
console.log('%cFeatures: Interactive Hero, Parallax, Carousel, Stats Counter, Scroll Reveals, Dark Mode & More!', 'color: #f59e0b; font-size: 12px;');

// ===================================
// Error Handling
// ===================================
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.message);
});

// ===================================
// Page Visibility API (Performance)
// ===================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        console.log('Page hidden - pausing animations');
    } else {
        // Resume animations when page is visible
        console.log('Page visible - resuming animations');
    }
});

// ===================================
// Utility Functions
// ===================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttle to scroll events for better performance
const throttledScroll = throttle(() => {
    // Scroll handling logic
}, 100);

window.addEventListener('scroll', throttledScroll);
