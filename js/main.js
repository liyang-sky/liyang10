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
        initScrollReveal();
        initBackToTop();
        initLightbox();
        initLicenseGuides();
        initCopyButtons();
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

    // ====== Scroll reveal animation ======
    function initScrollReveal() {
        const selectors = [
            '.section-header',
            '.feature-card',
            '.license-card',
            '.scene-card',
            '.resource-group',
            '.resource-card',
            '.workflow-node',
            '.workflow-card',
            '.sop-item',
            '.workflow-note',
            '.ai-transcode-panel',
            '.ai-step',
            '.ai-transcode-card',
            '.ai-example',
            '.ai-safety-note',
            '.hero-reference-card',
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

    // ====== License tutorial modal ======
    function initLicenseGuides() {
        const modal = document.getElementById('licenseModal');
        const closeBtn = document.getElementById('licenseModalClose');
        const title = document.getElementById('licenseModalTitle');
        const kicker = document.getElementById('licenseModalKicker');
        const summary = document.getElementById('licenseModalSummary');
        const guideGrid = document.getElementById('licenseGuideGrid');
        const cards = document.querySelectorAll('.license-card[data-license]');
        if (!modal || !closeBtn || !title || !kicker || !summary || !guideGrid || !cards.length) return;

        const guides = {
            F10: {
                title: 'BVML-F10 快速响应许可证',
                summary: '用于高速运动画面监看,减少拖影和滚动字幕模糊。实验室在体育、演唱会、多机位快切素材检查时优先启用。',
                blocks: [
                    ['使用前确认', ['进入 Administrator > License,确认 Activated License 中有 BVML-F10。', '确认输入信号稳定,再切换快速响应相关设置。']],
                    ['推荐步骤', ['选择正在使用的 SDI 输入通道。', '在监视器菜单中找到快速视频响应 / Fast Response 相关项目并启用。', '播放包含快速平移、滚动字幕或高运动量的片段,比较开启前后的拖影。']],
                    ['检查要点', ['只在需要降低运动模糊的监看任务中启用。', '严肃调色前先确认画面响应设置是否符合项目标准。', '记录项目使用状态,避免下一位工程师误判显示状态。']]
                ]
            },
            H10: {
                title: 'BVML-H10 HDR-SDR 转换输出许可证',
                summary: '用于 HDR/SDR 同步制作。它可以启用 HDR-SDR Conversion,并通过 Enhanced Monitor Out 输出应用转换、格式转换或 User LUT 后的 SDI 信号。',
                blocks: [
                    ['使用前确认', ['进入 Administrator > License,确认 Activated License 中有 BVML-H10。', '输入必须来自 SDI 或 IP 流；Enhanced Monitor Out 不能输出 HDMI 输入信号。']],
                    ['推荐步骤', ['接入 DaVinci / UltraStudio 的 SDI 输出并确认通道。', '设置输入信号的 EOTF、Color Space 和 Transfer Matrix。', '进入 HDR-SDR Conversion,选择或检查转换预设。', '如需给下游设备输出,进入 Enhanced Monitor Out 检查输出格式。']],
                    ['检查要点', ['用于 HDR 素材转 SDR 监看、SDR 版本检查和下游 SDI 输出。', '关注高光是否剪裁、暗部是否挤压、色域是否从 BT.2020/BT.709 正确转换。', '每个项目开始前记录转换预设名称。']]
                ]
            },
            S10: {
                title: 'BVML-S10 信号转换输出许可证',
                summary: '用于 Enhanced Monitor Out 的信号格式转换和 User LUT 输出,适合把屏幕监看结果以 SDI 形式送到其他设备。',
                blocks: [
                    ['使用前确认', ['进入 Administrator > License,确认 Activated License 中有 BVML-S10。', '确认当前输入为 SDI 或 IP 流,不要用 HDMI 输入测试 EMO 输出。']],
                    ['推荐步骤', ['确认输入信号格式和帧率。', '进入 Enhanced Monitor Out,选择需要的输出格式。', '如需 LUT 效果,先在通道设置中启用 User LUT。', '连接 EMO 的 SDI 输出到录机、波形设备或第二台监视器验证。']],
                    ['检查要点', ['常用于 4K 到 HD 输出、带 LUT 的 SDI 输出和实验室链路复核。', '输出结构以 4:2:2 YCbCr 10 位为主。', '不要把它当作 HDMI 转 SDI 转换器使用。']]
                ]
            },
            T10: {
                title: 'BVML-T10 3D LUT 输出许可证',
                summary: '用于只需要把 User LUT 应用到 Enhanced Monitor Out 的场景。适合 LUT 烘焙预览、现场调色预览和轻量化输出检查。',
                blocks: [
                    ['使用前确认', ['进入 Administrator > License,确认 Activated License 中有 BVML-T10。', '准备好经过项目确认的 LUT 文件,不要临时混用未标记版本。']],
                    ['推荐步骤', ['通过 USB 记忆棒导入 User LUT。', '在目标通道中打开 User LUT,选择正确 LUT 槽位。', '检查屏幕显示效果。', '如需输出到下游设备,从 Enhanced Monitor Out 接出 SDI。']],
                    ['检查要点', ['BVML-T10 侧重 User LUT 输出,不用于完整 HDR-SDR 转换。', '切换 LUT 后用灰阶、肤色和高饱和色片段复核。', '记录 LUT 文件名、版本和项目用途。']]
                ]
            },
            JD10: {
                title: 'BVML-JD10 JPEG XS 解码器许可证',
                summary: '用于 JPEG XS IP 视频信号解码,面向远程制作、分布式制作和低延迟 IP 监看。',
                blocks: [
                    ['使用前确认', ['进入 Administrator > License,确认 Activated License 中有 BVML-JD10。', '确认网络链路、SFP28 模块、PTP 和 ST2110 参数由系统工程师配置完成。']],
                    ['推荐步骤', ['连接 LAN1/LAN2 的 25G IP 网络。', '在 Web 菜单或本机菜单中检查 ST2110 Video/Audio、PTP、Multicast 或 NMOS 设置。', '选择 JPEG XS IP 流作为输入源。', '确认画面、音频和同步状态正常。']],
                    ['检查要点', ['适合 Networked Live 或远程制作链路。', '排障时先看 PTP 锁定、组播地址、端口和 Source ID。', '普通 DaVinci + UltraStudio SDI 直连场景通常不需要 JD10。']]
                ]
            },
            SN10: {
                title: 'BVML-SN10 SNMP 许可证',
                summary: '用于把 BVM-HX3110 接入实验室设备监控系统,让工程师远程查看状态、告警和基础管理信息。',
                blocks: [
                    ['使用前确认', ['进入 Administrator > License,确认 Activated License 中有 BVML-SN10。', '确认监视器已接入管理网络,IP 地址和访问权限由实验室统一维护。']],
                    ['推荐步骤', ['打开 Web 菜单并进入 SNMP 相关设置。', '配置 SNMP 管理端、团体名或实验室要求的访问参数。', '在监控系统中添加 BVM-HX3110 设备。', '触发状态查询,确认能读取设备状态。']],
                    ['检查要点', ['适合机房、演播室和多设备统一管理。', '不要把 SNMP 网络和制作视频流网络随意混用。', '变更 SNMP 参数前先记录原配置。']]
                ]
            }
        };

        let lastFocused = null;

        const renderGuide = (key) => {
            const guide = guides[key];
            if (!guide) return;
            kicker.textContent = key;
            title.textContent = guide.title;
            summary.textContent = guide.summary;
            guideGrid.innerHTML = guide.blocks.map((block, index) => {
                const [heading, items] = block;
                const listTag = index === 1 ? 'ol' : 'ul';
                return `
                    <section class="license-guide-block${index === 2 ? ' is-wide' : ''}">
                        <h3>${heading}</h3>
                        <${listTag}>${items.map(item => `<li>${item}</li>`).join('')}</${listTag}>
                    </section>
                `;
            }).join('');
        };

        const open = (key, trigger) => {
            renderGuide(key);
            lastFocused = trigger || document.activeElement;
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        };

        const close = () => {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
        };

        window.openLicenseGuide = open;
        document.documentElement.dataset.licenseGuides = 'ready';

        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('.license-open[data-license], .license-card[data-license]');
            if (!trigger) return;
            open(trigger.dataset.license, trigger);
        });

        cards.forEach(card => {
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    open(card.dataset.license, card);
                }
            });
        });

        document.querySelectorAll('.license-open[data-license]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                open(button.dataset.license, button);
            });
        });

        closeBtn.addEventListener('click', close);
        modal.querySelectorAll('[data-license-close]').forEach(el => el.addEventListener('click', close));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) close();
        });
    }

    // ====== Copy AI prompt helper ======
    function initCopyButtons() {
        const buttons = document.querySelectorAll('[data-copy-target]');
        if (!buttons.length) return;

        buttons.forEach(button => {
            const defaultText = button.textContent;
            button.addEventListener('click', async () => {
                const target = document.getElementById(button.dataset.copyTarget);
                if (!target) return;

                const text = target.textContent.trim();
                button.textContent = '复制中';
                button.classList.remove('is-copied');
                try {
                    if (navigator.clipboard && window.isSecureContext) {
                        try {
                            await navigator.clipboard.writeText(text);
                        } catch (err) {
                            copyWithFallback(text);
                        }
                    } else {
                        copyWithFallback(text);
                    }
                    button.textContent = '已复制';
                    button.classList.add('is-copied');
                    window.setTimeout(() => {
                        button.textContent = defaultText;
                        button.classList.remove('is-copied');
                    }, 1800);
                } catch (err) {
                    button.textContent = '复制失败';
                    button.classList.remove('is-copied');
                    window.setTimeout(() => {
                        button.textContent = defaultText;
                    }, 1800);
                }
            });
        });
    }

    function copyWithFallback(text) {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.top = '-999px';
        area.style.left = '-999px';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        document.body.removeChild(area);
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

})();
