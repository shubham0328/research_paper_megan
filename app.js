// M3GAN Research Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initMobileNavigation();
    initProgressBar();
    initSmoothScrolling();
    initSubsectionToggles();
    initBackToTop();
    initTableSorting();
    initScrollAnimations();
});

// Mobile Navigation
function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        });
    }
}

// Progress Bar
function initProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    
    if (progressFill) {
        function updateProgress() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            
            progressFill.style.width = Math.min(scrollPercent, 100) + '%';
        }
        
        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Initial call
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Subsection Toggles (Accordion) - Fixed Implementation
function initSubsectionToggles() {
    const toggleButtons = document.querySelectorAll('.subsection-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            const parentSubsection = this.closest('.subsection');
            const toggleIcon = this.querySelector('.toggle-icon');
            
            if (targetContent && parentSubsection && toggleIcon) {
                // Toggle the subsection
                const isCurrentlyActive = parentSubsection.classList.contains('active');
                
                if (isCurrentlyActive) {
                    // Close this subsection
                    parentSubsection.classList.remove('active');
                    targetContent.classList.remove('active');
                    toggleIcon.textContent = '+';
                } else {
                    // Close other subsections in the same parent section
                    const parentCard = parentSubsection.closest('.card');
                    if (parentCard) {
                        const allSubsections = parentCard.querySelectorAll('.subsection');
                        allSubsections.forEach(subsection => {
                            if (subsection !== parentSubsection) {
                                subsection.classList.remove('active');
                                const content = subsection.querySelector('.subsection-content');
                                const icon = subsection.querySelector('.toggle-icon');
                                if (content) content.classList.remove('active');
                                if (icon) icon.textContent = '+';
                            }
                        });
                    }
                    
                    // Open this subsection
                    parentSubsection.classList.add('active');
                    targetContent.classList.add('active');
                    toggleIcon.textContent = '−';
                }
            }
        });
    });
}

// Back to Top Button - Fixed Implementation
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        // Show/hide button based on scroll position
        function updateBackToTopVisibility() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }
        
        window.addEventListener('scroll', updateBackToTopVisibility);
        updateBackToTopVisibility(); // Initial call
        
        // Scroll to top when clicked
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Table Sorting - Fixed Implementation
function initTableSorting() {
    const table = document.getElementById('performance-table');
    
    if (!table) return;
    
    const headers = table.querySelectorAll('th[data-sort]');
    const tbody = table.querySelector('tbody');
    let currentSort = { column: null, direction: 'asc' };
    
    if (!tbody) return;
    
    headers.forEach(header => {
        header.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sortColumn = this.getAttribute('data-sort');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            // Determine sort direction
            if (currentSort.column === sortColumn) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.direction = 'asc';
            }
            currentSort.column = sortColumn;
            
            // Update header indicators
            headers.forEach(h => {
                const arrow = h.querySelector('.sort-arrow');
                if (arrow) {
                    if (h === this) {
                        arrow.textContent = currentSort.direction === 'asc' ? '↑' : '↓';
                        h.style.backgroundColor = 'var(--color-primary-hover)';
                    } else {
                        arrow.textContent = '↕';
                        h.style.backgroundColor = 'var(--color-primary)';
                    }
                }
            });
            
            // Sort rows
            rows.sort((a, b) => {
                const aValue = getCellValue(a, sortColumn);
                const bValue = getCellValue(b, sortColumn);
                
                let comparison = 0;
                if (sortColumn === 'uar' || sortColumn === 'latency') {
                    // Numeric sorting - extract numbers from strings like "88.6%" or "42ms"
                    const aNum = parseFloat(aValue.replace(/[^\d.]/g, ''));
                    const bNum = parseFloat(bValue.replace(/[^\d.]/g, ''));
                    comparison = aNum - bNum;
                } else {
                    // String sorting
                    comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
                }
                
                return currentSort.direction === 'asc' ? comparison : -comparison;
            });
            
            // Clear tbody and re-append sorted rows
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
            
            rows.forEach(row => tbody.appendChild(row));
            
            // Add visual feedback
            tbody.style.opacity = '0.7';
            setTimeout(() => {
                tbody.style.opacity = '1';
            }, 200);
        });
        
        // Make headers look clickable
        header.style.cursor = 'pointer';
        header.addEventListener('mouseover', function() {
            if (currentSort.column !== this.getAttribute('data-sort')) {
                this.style.backgroundColor = 'var(--color-primary-hover)';
            }
        });
        
        header.addEventListener('mouseout', function() {
            if (currentSort.column !== this.getAttribute('data-sort')) {
                this.style.backgroundColor = 'var(--color-primary)';
            }
        });
    });
}

// Helper function to get cell value for sorting
function getCellValue(row, column) {
    const columnMap = {
        'model': 0,
        'modality': 1,
        'dataset': 2,
        'uar': 3,
        'latency': 4
    };
    
    const cellIndex = columnMap[column];
    if (cellIndex !== undefined && row.cells[cellIndex]) {
        return row.cells[cellIndex].textContent.trim();
    }
    return '';
}

// Scroll Animations
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        const elements = document.querySelectorAll('.card, .application-item');
        elements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
        });
    }, observerOptions);
    
    // Observe cards and other elements
    const elementsToAnimate = document.querySelectorAll('.card, .application-item');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        observer.observe(element);
    });
}

// Utility Functions

// Debounce function for performance optimization
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
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (navToggle) {
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        }
    }
    
    // Space bar or Enter on subsection toggles
    if ((e.key === ' ' || e.key === 'Enter') && e.target.classList.contains('subsection-toggle')) {
        e.preventDefault();
        e.target.click();
    }
});

// Handle resize events
const optimizedResize = debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (navToggle) {
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        }
    }
}, 250);

window.addEventListener('resize', optimizedResize);

// Loading state management
window.addEventListener('load', function() {
    // Remove any loading states and enable interactions
    document.body.classList.add('loaded');
    
    // Initialize animations with delay
    setTimeout(() => {
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }, 100);
});

// Error handling for failed image loads
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        const container = e.target.closest('.image-container');
        if (container) {
            const fallback = document.createElement('div');
            fallback.className = 'image-fallback';
            fallback.textContent = 'Image could not be loaded';
            fallback.style.cssText = `
                padding: var(--space-20);
                background: var(--color-bg-4);
                border: 2px dashed var(--color-border);
                border-radius: var(--radius-base);
                text-align: center;
                color: var(--color-text-secondary);
                font-style: italic;
            `;
            container.appendChild(fallback);
        }
    }
}, true);

// Export functions for potential external use
window.M3GANApp = {
    initMobileNavigation,
    initProgressBar,
    initSmoothScrolling,
    initSubsectionToggles,
    initBackToTop,
    initTableSorting
};