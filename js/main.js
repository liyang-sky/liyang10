/* ============================================
   Sony BVM-HX3110 Product Site
   Interactive Logic (vanilla JS)
   ============================================ */

(function () {
    'use strict';

    // ====== DOM Ready ======
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initScrollProgress();
        initNavbar();
        initNavToggle();
        initSpecGroups();
        initSpecSearch();
        initScrollReveal();
        initBackToTop();
        initLightbox();
        initFeatureCardMouse();
        initActiveNavLink();
    }

    // ====== Scroll Progress Bar ======
    function initScrollProgress() {
        const progressBar = document.getElementById('scrollProgress');
        if (!progressBar) return;

        let ticking = false;
        const updateProgress = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = percent + '%';
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateProgress);
                ticking = true;
            }
        }, { passive: true });
    }

    // ====== Navbar scroll effect ======
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        let lastY = 0;
        const handleScroll = () => {
            const y = window.scrollY;
            navbar.classList.toggle('scrolled', y > 30);
            lastY = y;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // ====== Mobile nav toggle ======
    function initNavToggle() {
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('navMenu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            const open = menu.classList.toggle('open');
            toggle.classList.toggle('active', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });

        // Close menu on link click
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('open');
                toggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('open')) {
                menu.classList.remove('open');
                toggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ====== Active nav link highlight ======
    function initActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const links = document.querySelectorAll('.nav-link');
        if (!sections.length || !links.length) return;

        const linkMap = new Map();
        links.forEach(l => {
            const id = l.getAttribute('href').replace('#', '');
            if (id) linkMap.set(id, l);
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    links.forEach(l => l.classList.remove('active-link'));
                    const link = linkMap.get(entry.target.id);
                    if (link) link.classList.add('active-link');
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

        sections.forEach(s => observer.observe(s));
    }

    // ====== Specs group expand/collapse ======
    function initSpecGroups() {
        const groups = document.querySelectorAll('.specs-group');
        // Open the first group by default
        if (groups.length > 0) groups[0].classList.add('open');

        groups.forEach(group => {
            const header = group.querySelector('.specs-group-header');
            if (!header) return;
            header.addEventListener('click', () => {
                group.classList.toggle('open');
            });
        });
    }

    // ====== Specs search filter ======
    function initSpecSearch() {
        const input = document.getElementById('specSearch');
        const clearBtn = document.getElementById('searchClear');
        const noResults = document.getElementById('specNoResults');
        if (!input) return;

        // Create no-results element if not present
        let noRes = noResults;
        if (!noRes) {
            noRes = document.createElement('div');
            noRes.className = 'no-results';
            noRes.id = 'specNoResults';
            noRes.textContent = '未找到匹配的参数';
            document.querySelector('.specs').appendChild(noRes);
        }

        const handleSearch = () => {
            const term = input.value.trim().toLowerCase();
            clearBtn.classList.toggle('visible', term.length > 0);

            const allRows = document.querySelectorAll('.spec-row');
            const allGroups = document.querySelectorAll('.specs-group');
            let totalMatches = 0;

            if (term === '') {
                // Reset
                allRows.forEach(row => {
                    row.style.display = '';
                    row.classList.remove('match');
                    removeHighlights(row);
                });
                allGroups.forEach(g => {
                    g.style.display = '';
                });
                noRes.classList.remove('show');
                return;
            }

            allRows.forEach(row => {
                const key = (row.getAttribute('data-key') || '').toLowerCase();
                const text = row.textContent.toLowerCase();
                const isMatch = key.includes(term) || text.includes(term);
                row.style.display = isMatch ? '' : 'none';
                row.classList.toggle('match', isMatch);
                if (isMatch) {
                    totalMatches++;
                    highlightText(row, term);
                } else {
                    removeHighlights(row);
                }
            });

            // Hide groups with no visible rows
            allGroups.forEach(group => {
                const visibleRows = group.querySelectorAll('.spec-row[style="display: "]').length
                    + Array.from(group.querySelectorAll('.spec-row')).filter(r => r.style.display !== 'none').length;
                group.style.display = visibleRows > 0 ? '' : 'none';
                // Auto-open groups with matches
                if (visibleRows > 0) group.classList.add('open');
            });

            noRes.classList.toggle('show', totalMatches === 0);
        };

        input.addEventListener('input', debounce(handleSearch, 120));

        clearBtn.addEventListener('click', () => {
            input.value = '';
            clearBtn.classList.remove('visible');
            handleSearch();
            input.focus();
        });

        // ESC to clear
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && input.value) {
                input.value = '';
                clearBtn.classList.remove('visible');
                handleSearch();
            }
        });
    }

    function highlightText(row, term) {
        removeHighlights(row);
        if (!term) return;
        const targets = row.querySelectorAll('.spec-name, .spec-value');
        targets.forEach(el => {
            const original = el.dataset.original || el.innerHTML;
            el.dataset.original = original;
            // Build regex (escape special chars)
            const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escaped})`, 'gi');
            el.innerHTML = original.replace(regex, '<mark>$1</mark>');
        });
    }

    function removeHighlights(row) {
        const targets = row.querySelectorAll('.spec-name, .spec-value');
        targets.forEach(el => {
            if (el.dataset.original) {
                el.innerHTML = el.dataset.original;
            }
        });
    }

    // ====== Scroll reveal animation ======
    function initScrollReveal() {
        const selectors = [
            '.section-header',
            '.feature-card',
            '.license-card',
            '.scene-card',
            '.resource-card',
            '.overview-text',
            '.overview-image',
            '.specs-group',
            '.hero-stats'
        ];
        const elements = document.querySelectorAll(selectors.join(', '));
        elements.forEach(el => el.classList.add('reveal'));

        if (!('IntersectionObserver' in window)) {
            elements.forEach(el => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), i * 50);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        elements.forEach(el => observer.observe(el));
    }

    // ====== Back to top button ======
    function initBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        const toggle = () => {
            btn.classList.toggle('visible', window.scrollY > 600);
        };
        window.addEventListener('scroll', toggle, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        toggle();
    }

    // ====== Lightbox for images ======
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        const closeBtn = document.getElementById('lightboxClose');
        if (!lightbox || !lightboxImg || !closeBtn) return;

        // Select images that should be zoomable
        const zoomable = document.querySelectorAll('.hero-product-img, .overview-image img');
        zoomable.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('open');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });
        });

        const close = () => {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', close);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) close();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) close();
        });
    }

    // ====== Feature card mouse tracking for glow ======
    function initFeatureCardMouse() {
        const cards = document.querySelectorAll('.feature-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mx', x + '%');
                card.style.setProperty('--my', y + '%');
            });
        });
    }

    // ====== Utilities ======
    function debounce(fn, delay) {
        let timer = null;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

})();
