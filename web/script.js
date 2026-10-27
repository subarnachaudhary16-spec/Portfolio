/**
 * ==========================================================================
 * SUBARNA CHAUDHARY | MODERN PORTFOLIO INTERACTIVE MOTION ENGINE
 * ==========================================================================
 */

/* --------------------------------------------------------------------------
 * SECTION LOADER — Fetches HTML partials from /sections/ and injects them
 * into their placeholder divs, then fires 'sectionsLoaded' event.
 * -------------------------------------------------------------------------- */
(async function loadSections() {
    const sectionMap = [
        { file: 'sections/skills.html',   targetId: 'section-skills-services' },
        { file: 'sections/projects.html', targetId: 'section-projects-education' },
        { file: 'sections/contact.html',  targetId: 'section-contact' },
    ];

    try {
        await Promise.all(sectionMap.map(async ({ file, targetId }) => {
            const container = document.getElementById(targetId);
            if (!container) return;
            try {
                const res = await fetch(file);
                if (res.ok) {
                    container.innerHTML = await res.text();
                } else {
                    console.warn(`Section loader: Could not load ${file} (${res.status})`);
                }
            } catch (err) {
                console.warn(`Section loader: fetch failed for ${file}`, err);
            }
        }));
    } finally {
        // Fire event so DOMContentLoaded logic knows sections are ready
        document.dispatchEvent(new Event('sectionsLoaded'));
    }
})();

/* --------------------------------------------------------------------------
 * Wait for sections to be injected before running portfolio logic.
 * Falls back gracefully if sections were already in the DOM (e.g., static open).
 * -------------------------------------------------------------------------- */
function initPortfolio() {

// Portfolio initialization runs here

    /* --------------------------------------------------------------------------
     * 1. PROJECT DATA REPOSITORY (For Quick View Modal)
     * -------------------------------------------------------------------------- */
    const projectsData = {
        ecommerce: {
            title: 'Full-Stack E-Commerce Website',
            category: 'Full Stack Development',
            image: 'image/ecommerce.jpg',
            description: 'A comprehensive, scalable digital commerce solution built from the ground up. It includes an interactive shopping catalog, dynamic cart management, user authentication, and seamless checkout workflow.',
            features: [
                'JWT-based secure authentication & session management',
                'Comprehensive product catalog with search, filter, and sorting',
                'Persistent shopping cart with live price calculations',
                'Integrated payment workflow & responsive order summary',
                'Admin dashboard for inventory & product status management'
            ],
            tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'REST APIs', 'CSS3 / Glassmorphism'],
            liveUrl: '#contact'
        },
        taskmanager: {
            title: 'Task Manager & Productivity App',
            category: 'Frontend & State Management',
            image: 'image/Task Manager.jpg',
            description: 'A sleek productivity dashboard designed to help students and developers organize tasks, establish milestones, and boost daily efficiency with persistent local storage.',
            features: [
                'Categorized task lists: Pending, In Progress, and Completed',
                'Priority tags (High, Medium, Low) and deadline alerts',
                'Local storage caching ensuring zero data loss on page refresh',
                'Custom progress ring calculating completion percentage',
                'Responsive UI optimized for desktop and mobile gestures'
            ],
            tech: ['JavaScript (ES6+)', 'HTML5', 'CSS Grid / Flexbox', 'LocalStorage API', 'Micro-Interactions'],
            liveUrl: '#contact'
        },
        weather: {
            title: 'Real-Time Weather Intelligence Dashboard',
            category: 'Real-Time & API Integration',
            image: 'image/weatherdashboard.jpg',
            description: 'An interactive weather dashboard delivering accurate meteorological forecasts, humidity levels, wind speed, and atmospheric conditions with dynamic climate-themed UI cards.',
            features: [
                'Live geolocation detection and global city search',
                '5-day multi-hour forecast predictions with min/max temperatures',
                'Dynamic background and icon states responding to live weather conditions',
                'Air quality metrics, humidity index, and UV indices display',
                'Asynchronous fetch with robust error handling for invalid cities'
            ],
            tech: ['Vanilla JavaScript', 'OpenWeatherMap API', 'Geolocation API', 'CSS Glassmorphism', 'SVG Graphics'],
            liveUrl: '#contact'
        },
        chatbot: {
            title: 'College Assistant & AI Chatbot',
            category: 'Real-Time Communication',
            image: 'image/AI Auto-Reply Chatbot.jpg',
            description: 'A real-time query assistant built to help university students quickly access course notes, academic schedules, exam notices, and FAQ answers with instant automated responses.',
            features: [
                'Real-time bi-directional messaging with WebSockets / Socket.io',
                'Automated query resolution engine for common academic inquiries',
                'Live typing indicators and message timestamp tracking',
                'Clean chat interface with customizable chat bubble animations',
                'Lightweight Node.js backend with low memory footprint'
            ],
            tech: ['Socket.io', 'Node.js', 'Express.js', 'HTML5', 'CSS Animations', 'JavaScript'],
            liveUrl: '#contact'
        }
    };

    /* --------------------------------------------------------------------------
     * 2. LIGHT / NIGHT MODE TOGGLE
     * -------------------------------------------------------------------------- */
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    let currentTheme = localStorage.getItem('subarna_portfolio_theme_mode') || 'dark';

    // Apply saved theme mode
    document.body.setAttribute('data-theme', currentTheme);

    function updateTheme(newTheme) {
        currentTheme = newTheme;
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('subarna_portfolio_theme_mode', newTheme);
        showToast(newTheme === 'light' ? 'Light mode activated ☀️' : 'Night mode activated 🌙', 'info');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            updateTheme(nextTheme);
        });
    }

    /* --------------------------------------------------------------------------
     * 3. SPOTLIGHT CARD MOUSE POSITION TRACKER
     * -------------------------------------------------------------------------- */
    const spotlightCards = document.querySelectorAll('.spotlight-card, .stat-card');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    /* --------------------------------------------------------------------------
     * 4. SUBTLE TILT EFFECT ON CARDS & AVATARS
     * -------------------------------------------------------------------------- */
    const tiltElements = document.querySelectorAll('[data-tilt], .tilt-element');
    tiltElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const rotateX = ((mouseY / height) - 0.5) * -6;
            const rotateY = ((mouseX / width) - 0.5) * 6;

            elem.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
        });

        elem.addEventListener('mouseleave', () => {
            elem.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    /* --------------------------------------------------------------------------
     * 5. SCROLL PROGRESS BAR & NAVBAR STATE
     * -------------------------------------------------------------------------- */
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    const navbar = document.getElementById('navbar');

    function handleScroll() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;

        // Reading depth bar
        if (scrollProgressBar) {
            scrollProgressBar.style.width = `${scrollPercent * 100}%`;
        }

        // Navbar blur and compact style
        if (navbar) {
            if (scrollTop > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Active link tracking
        highlightActiveNavLink(scrollTop);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* --------------------------------------------------------------------------
     * 10. ACTIVE NAVIGATION LINK TRACKING
     * -------------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinksList = document.querySelectorAll('.nav-link');

    function highlightActiveNavLink(scrollTop) {
        let currentSectionId = '';

        sections.forEach(sec => {
            const sectionTop = sec.offsetTop - 150;
            const sectionHeight = sec.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    /* --------------------------------------------------------------------------
     * 11. MOBILE MENU HAMBURGER TOGGLE
     * -------------------------------------------------------------------------- */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && e.target !== hamburger) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    /* --------------------------------------------------------------------------
     * 12. SCROLL REVEAL & SKILL BARS & STAT COUNTERS (IntersectionObserver)
     * -------------------------------------------------------------------------- */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal-on-scroll, .skill-card').forEach(el => {
        revealObserver.observe(el);
    });

    // Animated Numbers Counter for Stats Section
    let statsCounted = false;
    const statCards = document.querySelectorAll('.stat-card');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsCounted) {
                statsCounted = true;
                statCards.forEach(card => {
                    const numberEl = card.querySelector('.stat-number');
                    if (numberEl) {
                        const target = parseInt(numberEl.getAttribute('data-target'), 10) || 0;
                        animateCounter(numberEl, target);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    const statsSection = document.getElementById('stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateCounter(element, target) {
        let count = 0;
        const duration = 1600; // ms
        const frameTime = 20;
        const totalFrames = duration / frameTime;
        const increment = target / totalFrames;

        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(count);
            }
        }, frameTime);
    }

    /* --------------------------------------------------------------------------
     * 13. PROJECTS CATEGORY FILTER
     * -------------------------------------------------------------------------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.dataset.filter;

            projectCards.forEach(card => {
                const category = card.dataset.category;
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    /* --------------------------------------------------------------------------
     * 14. PROJECT QUICK VIEW MODAL
     * -------------------------------------------------------------------------- */
    const modalOverlay = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');

    function openProjectModal(projectId) {
        const project = projectsData[projectId];
        if (!project || !modalBody || !modalOverlay) return;

        modalBody.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="modal-header-img">
            <div class="modal-content-wrap">
                <div class="modal-meta">
                    <span class="modal-category">${project.category}</span>
                </div>
                <h3 class="modal-title">${project.title}</h3>
                <p class="modal-desc">${project.description}</p>
                
                <h4 class="modal-features-title">Key Architectural Features:</h4>
                <ul class="modal-features-list">
                    ${project.features.map(f => `<li><i class="fas fa-check-circle"></i> <span>${f}</span></li>`).join('')}
                </ul>

                <h4 class="modal-features-title">Tech Stack & Tools:</h4>
                <div class="modal-tech-stack">
                    ${project.tech.map(t => `<span>${t}</span>`).join('')}
                </div>

                <div class="modal-cta-buttons">
                    <a href="${project.liveUrl}" class="btn btn-primary" onclick="closeModal()">
                        <i class="fas fa-external-link-alt"></i> Live Project / Demo
                    </a>
                </div>
            </div>
        `;

        modalOverlay.classList.add('active');
        modalOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectId = btn.dataset.project;
            openProjectModal(projectId);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    /* --------------------------------------------------------------------------
     * 15. TOAST NOTIFICATION UTILITY
     * -------------------------------------------------------------------------- */
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const iconClass = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info');
        toast.innerHTML = `
            <i class="fas ${iconClass} toast-icon"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastOut 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 350);
        }, 3500);
    }

    /* --------------------------------------------------------------------------
     * 16. ONE-CLICK EMAIL & PROFILE COPY
     * -------------------------------------------------------------------------- */
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const copyProfileBtn = document.getElementById('copyProfileBtn');
    const emailCardBtn = document.querySelector('.copy-action-btn');

    function copyTextToClipboard(text, successMsg) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(successMsg, 'success');
            }).catch(() => {
                fallbackCopy(text, successMsg);
            });
        } else {
            fallbackCopy(text, successMsg);
        }
    }

    function fallbackCopy(text, successMsg) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showToast(successMsg, 'success');
        } catch (err) {
            showToast('Failed to copy to clipboard', 'error');
        }
        document.body.removeChild(textArea);
    }

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            copyTextToClipboard('subarnachaudhary16@gmail.com', 'Email copied to clipboard!');
        });
    }

    if (emailCardBtn) {
        emailCardBtn.addEventListener('click', () => {
            copyTextToClipboard('subarnachaudhary16@gmail.com', 'Email copied to clipboard!');
        });
    }

    if (copyProfileBtn) {
        copyProfileBtn.addEventListener('click', () => {
            const profileText = `Subarna Chaudhary | BCA IT Student & Full-Stack Developer | Email: subarnachaudhary16@gmail.com | Location: Nepal`;
            copyTextToClipboard(profileText, 'Developer Profile summary copied!');
        });
    }

    /* --------------------------------------------------------------------------
     * 17. CONTACT FORM AJAX SUBMISSION (Web3Forms)
     * -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btnText = submitBtn.querySelector('.btn-text');
            const btnIcon = submitBtn.querySelector('.btn-icon');
            const btnSpinner = submitBtn.querySelector('.btn-spinner');

            // Set loading state
            submitBtn.disabled = true;
            if (btnText) btnText.textContent = 'Sending...';
            if (btnIcon) btnIcon.style.display = 'none';
            if (btnSpinner) btnSpinner.style.display = 'inline-block';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    showToast('Thank you! Your message has been sent successfully.', 'success');
                    contactForm.reset();
                } else {
                    showToast(result.message || 'Something went wrong. Please try again or email directly.', 'error');
                }
            } catch (error) {
                showToast('Network error. Please email directly to subarnachaudhary16@gmail.com', 'error');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                if (btnText) btnText.textContent = 'Send Message';
                if (btnIcon) btnIcon.style.display = 'inline-block';
                if (btnSpinner) btnSpinner.style.display = 'none';
            }
        });
    }

    /* --------------------------------------------------------------------------
     * 18. DYNAMIC COPYRIGHT YEAR
     * -------------------------------------------------------------------------- */
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
// --- end of init body ---

} // end initPortfolio()

/* --------------------------------------------------------------------------
 * BOOT: Call initPortfolio after sections are injected AND DOM is ready.
 * 'sectionsLoaded' fires after fetch() completes.
 * We also wait for DOMContentLoaded to ensure static DOM elements are ready.
 * -------------------------------------------------------------------------- */
let sectionsReady = false;
let domReady = document.readyState !== 'loading';
let portfolioInited = false;

function tryInit() {
    if (!portfolioInited && sectionsReady && domReady) {
        portfolioInited = true;
        initPortfolio();
    }
}

document.addEventListener('sectionsLoaded', () => {
    sectionsReady = true;
    tryInit();
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        domReady = true;
        tryInit();
    });
} else {
    domReady = true;
    // DOMContentLoaded already fired — just wait for sections
}
