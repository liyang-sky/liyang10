/* ==============================
   Sony BVM-HX3110 浣跨敤鎸囧崡 路 鑴氭湰
   涓婚鍒囨崲 / FAQ / TOC 楂樹寒 / 璁稿彲璇佹ā鎬佹 / 绉诲姩绔鑸?   ============================== */
(function () {
    "use strict";

    /* ---------- 1. 涓婚鍒囨崲锛堟寔涔呭寲锛?---------- */
    const THEME_KEY = "bvmhx3110-theme";
    const root = document.documentElement;
    const themeBtn = document.getElementById("themeToggle");
    const themeIcon = themeBtn ? themeBtn.querySelector(".theme-icon") : null;

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        if (themeIcon) themeIcon.textContent = theme === "dark" ? "鈽? : "鈽€";
        if (themeBtn) themeBtn.setAttribute("aria-label", theme === "dark" ? "鍒囨崲涓烘祬鑹蹭富棰? : "鍒囨崲涓烘繁鑹蹭富棰?);
    }

    function initTheme() {
        let saved = null;
        try {
            saved = localStorage.getItem(THEME_KEY);
        } catch (e) {
            /* localStorage 涓嶅彲鐢ㄦ椂蹇界暐 */
        }
        if (saved === "light" || saved === "dark") {
            applyTheme(saved);
        } else {
            const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
            applyTheme(prefersLight ? "light" : "dark");
        }
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", function () {
            const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
            const next = current === "dark" ? "light" : "dark";
            applyTheme(next);
            try {
                localStorage.setItem(THEME_KEY, next);
            } catch (e) {
                /* 蹇界暐瀛樺偍閿欒 */
            }
        });
    }

    /* ---------- 2. 绉诲姩绔鑸姌鍙?---------- */
    const navToggle = document.getElementById("navToggle");
    const primaryNav = document.querySelector(".primary-nav");

    if (navToggle && primaryNav) {
        navToggle.addEventListener("click", function () {
            const isOpen = primaryNav.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });

        // 鐐瑰嚮瀵艰埅椤瑰悗鑷姩鍏抽棴锛堢Щ鍔ㄧ锛?        primaryNav.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () {
                if (primaryNav.classList.contains("open")) {
                    primaryNav.classList.remove("open");
                    navToggle.setAttribute("aria-expanded", "false");
                }
            });
        });
    }

    /* ---------- 3. 娴姩 TOC 路 婊氬姩鑱斿姩 ---------- */
    const tocLinks = document.querySelectorAll(".toc a[data-toc]");
    const tocTargets = Array.from(tocLinks)
        .map(function (a) {
            return document.querySelector(a.getAttribute("href"));
        })
        .filter(Boolean);

    function setActiveToc(activeId) {
        tocLinks.forEach(function (a) {
            const href = a.getAttribute("href");
            a.classList.toggle("active", href === "#" + activeId);
        });
    }

    if ("IntersectionObserver" in window && tocTargets.length) {
        const observer = new IntersectionObserver(
            function (entries) {
                // 鎵惧埌鏈€闈犺繎瑙嗗彛椤堕儴 1/3 澶勭殑鍙 section
                const visible = entries
                    .filter(function (e) { return e.isIntersecting; })
                    .sort(function (a, b) {
                        return a.boundingClientRect.top - b.boundingClientRect.top;
                    });
                if (visible.length) {
                    setActiveToc(visible[0].target.id);
                }
            },
            { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
        );
        tocTargets.forEach(function (t) { observer.observe(t); });
    }

    /* ---------- 4. 璁稿彲璇佹暟鎹?+ 妯℃€佹 ---------- */
    const LICENSES = {
        T10: {
            code: "BVML-T10",
            name: "3D LUT 杈撳嚭璁稿彲璇?,
            desc: "鍏佽灏嗚嚜瀹氫箟 3D LUT 搴旂敤浜庣洃瑙嗗櫒鐨?EMO锛圗nhanced Monitor Output锛夎緭鍑洪€氶亾锛屼究浜庡湪 LUT 鍔犺浇鐘舵€佷笅鍚屾椂鐩戠湅鍘熺墖涓庡鑹茬粨鏋溿€?,
            notes: ["鏀寔 USB 鍔犺浇鐢ㄦ埛 LUT", "閲囩敤楂樿川閲忓洓闈綋鎻掑€?, "鍙綔涓?HDR鈫扴DR 杞崲鐨勮緟鍔?]
        },
        S10: {
            code: "BVML-S10",
            name: "淇″彿杞崲杈撳嚭璁稿彲璇?,
            desc: "鍦?EMO 杈撳嚭閫氶亾涓婂惎鐢?3D LUT 涓?4K鈫扝D 涓嬪彉鎹紝渚夸簬灏嗕竴鍙扮洃瑙嗗櫒鐨勭敾闈㈠悓鏃惰浆鎹负 HD SDR 杈撳嚭缁欎笅娓歌澶囥€?,
            notes: ["鏀寔 3D LUT", "鏀寔 4K 鈫?HD 涓嬪彉鎹?, "鍙笌 BVML-H10 鍙犲姞浣跨敤"]
        },
        H10: {
            code: "BVML-H10",
            name: "HDR-SDR 杞崲杈撳嚭璁稿彲璇?,
            desc: "Sony 瀹樻柟 HDR-SDR 杞崲鏂规锛岀粨鍚?3D LUT 涓?4K-HD 杞崲鑳藉姏锛屽疄鐜?4K/HD HDR 涓?HD SDR 鐨勫悓姝ュ埗浣溿€?,
            notes: ["HDR-SDR 杞崲", "3D LUT", "4K-HD 杞崲", "鍐呯疆娉㈠舰鐩戣鍣?/ 鐭㈤噺绀烘尝鍣ㄥ彲鏍￠獙杞崲缁撴灉"]
        },
        SN10: {
            code: "BVML-SN10",
            name: "SNMP 璁稿彲璇?,
            desc: "鍚敤 SNMP 鍗忚鏀寔锛屼究浜庡湪鎾嚭鎺у埗绯荤粺涓鐩戣鍣ㄨ繘琛岃繙绋嬬姸鎬佹煡璇笌鍛婅涓婃姤銆?,
            notes: ["鍏煎涓绘祦 NMS 骞冲彴", "鏀寔鏍囧噯 MIB", "鍙繙绋嬭鍙栨俯搴︺€佷俊鍙枫€佸浐浠剁増鏈瓑鐘舵€?]
        },
        JD10: {
            code: "BVML-JD10",
            name: "JPEG XS 瑙ｇ爜璁稿彲璇?,
            desc: "涓?IP 鍒朵綔閾捐矾鍚敤 JPEG XS 瑙ｇ爜鑳藉姏锛屾敮鎸佷綆寤惰繜銆佽瑙夋棤鎹熺殑 IP 瑙嗛娴佹帴鍏ャ€?,
            notes: ["浣庡欢杩?IP 瑙ｇ爜", "涓?ST 2110-20 鍏煎", "閫傞厤 Networked Live 鐢熸€?]
        },
        F10: {
            code: "BVML-F10",
            name: "蹇€熷搷搴旇鍙瘉",
            desc: "鍚敤楂橀€熷儚绱犲搷搴旀ā寮忥紝閫傚悎浣撹偛銆佹紨鍞变細绛夊惈蹇€熷钩绉讳笌鏂囧瓧婊氬姩鏉＄殑鐢婚潰銆?,
            notes: ["闄嶄綆杩愬姩妯＄硦", "婊氬姩瀛楀箷鏇存槗璇?, "鎺ㄨ崘鐩存挱鍦烘櫙鍚敤"]
        }
    };

    const modal = document.getElementById("licenseModal");
    const modalTitle = document.getElementById("licenseTitle");
    const modalCode = document.getElementById("licenseCode");
    const modalBody = document.getElementById("licenseBody");
    let lastFocused = null;

    function openModal(key) {
        const lic = LICENSES[key];
        if (!lic || !modal) return;

        lastFocused = document.activeElement;

        modalCode.textContent = lic.code;
        modalTitle.textContent = lic.name;

        const notesHtml = lic.notes
            .map(function (n) { return "<li>" + n + "</li>"; })
            .join("");
        modalBody.innerHTML =
            "<p>" + lic.desc + "</p>" +
            (lic.notes && lic.notes.length
                ? "<p><strong>鍏抽敭鑳藉姏</strong></p><ul>" + notesHtml + "</ul>"
                : "");

        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");

        // 鑷姩鐒︾偣鍒板叧闂寜閽?        const closeBtn = modal.querySelector(".modal-close");
        if (closeBtn) closeBtn.focus();

        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        if (!modal) return;
        modal.hidden = true;
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (lastFocused && typeof lastFocused.focus === "function") {
            lastFocused.focus();
        }
    }

    // 缁戝畾璁稿彲璇佸崱鐗囩偣鍑?    document.querySelectorAll(".license-card").forEach(function (card) {
        card.addEventListener("click", function () {
            const key = card.getAttribute("data-license");
            openModal(key);
        });
    });

    // 鍏抽棴锛氱偣鍑?backdrop 鎴栧叧闂寜閽?    if (modal) {
        modal.querySelectorAll("[data-close]").forEach(function (el) {
            el.addEventListener("click", closeModal);
        });

        // Esc 閿叧闂?        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && !modal.hidden) {
                closeModal();
            }
        });
    }

    /* ---------- 5. 鍚姩 ---------- */
    initTheme();
})();
