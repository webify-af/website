/* ============================================================
   WEBIFY.AF — main.js
   i18n (prs/ps/en) · theme · sticky chrome · Stripe-style mega
   home slider · renders · motion (reduced-motion aware)
   ============================================================ */
(function () {
    "use strict";

    var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var root = document.documentElement, body = document.body;
    function $(s, c) { return (c || document).querySelector(s); }
    function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
    var store = {
        get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
    };

    var LANG = store.get("wb_lang") || "prs";
    if (!window.WEBIFY_LANGS || !WEBIFY_LANGS[LANG]) LANG = "prs";
    var THEME = store.get("wb_theme") || "light";
    var L = null;
    var PAGE = body.dataset.page || "home";
    body.dataset.period = body.dataset.period || "m";

    /* ---------------- icons ---------------- */
    var ICONS = {
        star:'<path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"/>',
        code:'<polyline points="8 6 3 12 8 18"/><polyline points="16 6 21 12 16 18"/>',
        server:'<rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><circle cx="7" cy="7.5" r=".9" fill="currentColor" stroke="none"/><circle cx="7" cy="16.5" r=".9" fill="currentColor" stroke="none"/>',
        cloud:'<path d="M7 18a4.5 4.5 0 1 1 .9-8.9A6 6 0 0 1 19.4 10.5 3.8 3.8 0 0 1 18.4 18z"/>',
        shield:'<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9.3 12l2 2 3.4-4"/>',
        headset:'<path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/><path d="M20 19a3 3 0 0 1-3 2h-3"/>',
        chart:'<path d="M4 20V6"/><path d="M4 20h16"/><path d="M8 16v-4"/><path d="M12 16V8"/><path d="M16 16v-6"/>',
        cpu:'<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="10" y="10" width="4" height="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
        globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c3 3.6 3 14.4 0 18-3-3.6-3-14.4 0-18z"/>',
        mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7.5l9 6 9-6"/>',
        phone:'<path d="M5 4h4l1.6 4.2L8.2 10a12.5 12.5 0 0 0 5.8 5.8l1.8-2.4L20 15v4c-9 1-16-6-15-15z"/>',
        pin:'<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
        clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
        bolt:'<path d="M13 2L4.5 13.5h6L9.5 22 18 10.5h-6L13 2z"/>',
        refresh:'<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 3v5h-5"/>',
        plug:'<path d="M9 3v5M15 3v5"/><path d="M6 8h12v3a6 6 0 0 1-12 0z"/><path d="M12 17v4"/>',
        pen:'<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z"/><path d="M14 6l3 3"/>',
        rocket:'<path d="M12 15c-2.2.2-4.4-.7-5.6-2C7 8.6 10 5 15 4c2 .7 4.3 3 5.2 5.2-1 5-4.6 8-9 8.8z"/><path d="M6.4 13L4 14.4l2.6 2.6L8 14.6"/><circle cx="14.5" cy="9.5" r="1.4"/><path d="M10 18.5c-.6 1.5-2 2.5-3.6 2.6.1-1.6 1-3 2.6-3.6"/>',
        book:'<path d="M4 5a2 2 0 0 1 2-2h14v18H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 1 2-2h14"/>',
        key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 4l3 3M14 7l2 2"/>',
        dollar:'<path d="M12 2v20"/><path d="M16.5 6.5C15.5 5 8 4.5 8 8.5s8 2.5 8 6.5-7.5 3.5-9 1.5"/>',
        search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>',
        user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
        check:'<path d="M4 12.5l5 5L20 6.5"/>',
        arrow:'<path d="M4 12h16M13 5l7 7-7 7"/>',
        chev:'<path d="M6 9l6 6 6-6"/>',
        menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
        x:'<path d="M5 5l14 14M19 5L5 19"/>',
        sun:'<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.5 4.5l1.8 1.8M17.7 17.7l1.8 1.8M19.5 4.5l-1.8 1.8M6.3 17.7l-1.8 1.8"/>',
        moon:'<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',
        github:'<path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.8 11.8 0 0 0-6.2 0C6.5 2.8 5.5 3.1 5.5 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
        linkedin:'<rect x="2.5" y="9.5" width="4" height="11.5"/><circle cx="4.5" cy="4.5" r="2"/><path d="M10.5 21v-6.5a3.5 3.5 0 0 1 7 0V21"/><path d="M10.5 9.5h4v2"/>',
        twitter:'<path d="M4 4l16 16M20 4L4 20"/>',
        ext:'<path d="M14 4h6v6"/><path d="M20 4L10 14"/><path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5"/>'
    };
    function ic(n, cls) {
        return '<svg class="ic ' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[n] || "") + "</svg>";
    }
    function t(k) { return k.split(".").reduce(function (o, p) { return o ? o[p] : undefined; }, L); }

    /* ---------------- theme ---------------- */
    function applyTheme() {
        root.dataset.theme = THEME;
        var b = $("#themeBtn");
        if (b) b.innerHTML = THEME === "dark" ? ic("sun") : ic("moon");
    }

    /* ---------------- chrome builders ---------------- */
    var HREF = {
        company: { about: "about.html", experience: "experience.html", projects: "projects.html", contact: "contact.html" },
        services: { software: "services.html", hosting: "hosting.html", vps: "vps.html" }
    };
    var MPICON = {
        company: { about: "user", experience: "chart", projects: "code", contact: "mail" },
        services: { software: "rocket", hosting: "server", vps: "cloud" }
    };
    var CARDHREF = { company: "about.html", services: "vps.html" };
    var CARDIMG = { company: "webify-story-team", services: "webify-cloud-infra" };

    function megaPanel(key) {
        var d = L.nav[key], items = "";
        Object.keys(d.items).forEach(function (id) {
            var it = d.items[id];
            items += '<a class="mp-link" href="' + HREF[key][id] + '"><span class="mp-ic">' + ic(MPICON[key][id]) +
                '</span><span class="mp-tx"><b>' + it.t + "</b><small>" + it.d +
                '</small></span><span class="mp-arrow">' + ic("arrow") + "</span></a>";
        });
        return '<section class="mega-panel mp-' + key + '" data-mp="' + key + '"><div class="mp-grid"><div class="mp-links"><p class="mp-blurb">' +
            d.blurb + "</p>" + items + '</div><a class="mp-card" href="' + CARDHREF[key] +
            '"><img src="https://picsum.photos/seed/' + CARDIMG[key] + '/560/400" alt=""><span class="mp-card-ov"><b>' +
            d.card.title + "</b><small>" + d.card.desc + "</small><u>" + d.card.cta + " " + ic("arrow", "mini") + "</u></span></a></div></section>";
    }

    function langSw(cls) {
        return '<div class="lang-sw ' + (cls || "") + '" role="group">' + ["prs", "ps", "en"].map(function (c) {
            return '<button class="lang-btn' + (c === LANG ? " on" : "") + '" data-lang="' + c + '" type="button">' + WEBIFY_LANGS[c].name + "</button>";
        }).join("") + "</div>";
    }

    function buildTopstrip() {
        $("#topstrip").innerHTML =
            '<div class="container ts-row"><div class="ts-start">' +
            '<a class="ts-item" href="tel:' + L.topbar.phone.replace(/\s/g, "") + '">' + ic("phone") + L.topbar.phone + "</a>" +
            '<a class="ts-item" href="mailto:' + L.topbar.email + '">' + ic("mail") + L.topbar.email + "</a></div>" +
            '<div class="ts-end"><a class="ts-status" href="#"><i class="pulse"></i>' + L.topbar.status + "</a>" + langSw() + "</div></div>";
    }

    function buildHeader() {
        var N = L.nav;
        $("#siteHeader").innerHTML =
            '<div class="hdr-bar container">' +
            '<a class="brand" href="index.html">' + ic("star") + '<span class="brand-txt">' + L.brand.name + "<em>" + L.brand.tld + "</em></span></a>" +
            '<nav class="mainnav" id="mainnav" aria-label="' + L.header.navAria + '"><ul class="nav-list">' +
            '<li class="nl"><a class="nav-a" href="index.html" data-nk="home">' + N.home + "</a></li>" +
            '<li class="nl has-mega" data-mega="company"><a class="nav-a" href="about.html" data-nk="company">' + N.company.label + ic("chev", "chev") + "</a></li>" +
            '<li class="nl has-mega" data-mega="services"><a class="nav-a" href="services.html" data-nk="services">' + N.services.label + ic("chev", "chev") + "</a></li>" +
            '<li class="nl"><a class="nav-a" href="pricing.html" data-nk="pricing">' + N.pricing + "</a></li>" +
            '<li class="nl"><a class="nav-a" href="support.html" data-nk="support">' + N.support + "</a></li></ul>" +
            '<div class="mega" id="mega" aria-hidden="true"><i class="mega-caret"></i><div class="mega-inner" id="megaInner">' +
            megaPanel("company") + megaPanel("services") + "</div></div></nav>" +
            '<div class="hdr-utils"><button class="icon-btn" id="themeBtn" type="button" aria-label="' + L.theme.toggle + '"></button>' +
            '<a class="portal" href="#" title="client.webify.af">' + ic("user") + "<span>" + L.header.portal + "</span></a>" +
            '<a class="btn btn-accent btn-cut" href="pricing.html">' + L.header.start + "</a>" +
            '<button class="icon-btn icon-burger" id="burger" type="button" aria-label="' + L.header.menu + '" aria-expanded="false">' + ic("menu") + "</button></div></div>";
    }

    function dwLink(href, nk, label) {
        return '<li><a href="' + href + '" data-nk="' + nk + '">' + label + "</a></li>";
    }
    function dwGroup(label, key) {
        var inner = "";
        Object.keys(L.nav[key].items).forEach(function (id) {
            inner += '<a href="' + HREF[key][id] + '">' + L.nav[key].items[id].t + "</a>";
        });
        return '<li class="dw-acc"><button type="button" class="dw-t">' + label + ic("chev") + '</button><div class="dw-p"><div class="dw-in">' + inner + "</div></div></li>";
    }
    function buildDrawer() {
        $("#drawer").innerHTML =
            '<div class="dw-head"><a class="brand" href="index.html">' + ic("star") + '<span class="brand-txt">' + L.brand.name + "<em>" + L.brand.tld + "</em></span></a>" +
            '<button class="icon-btn" id="dwClose" type="button" aria-label="' + L.header.close + '">' + ic("x") + "</button></div>" +
            '<div class="dw-body"><ul class="dw-list">' +
            dwLink("index.html", "home", L.nav.home) +
            dwGroup(L.nav.company.label, "company") +
            dwGroup(L.nav.services.label, "services") +
            dwLink("pricing.html", "pricing", L.nav.pricing) +
            dwLink("support.html", "support", L.nav.support) +
            '</ul><div class="dw-utils"><a class="btn btn-line" href="#">' + ic("user") + L.header.portal + "</a>" +
            '<a class="btn btn-accent btn-cut" href="pricing.html">' + L.header.start + "</a>" + langSw("dw-lang") + "</div></div>";
    }

    function buildFooter() {
        var F = L.footer;
        function col(c) {
            return '<nav class="ft-col"><h4>' + c.t + "</h4>" + c.links.map(function (l) {
                return '<a href="' + l.href + '">' + l.t + "</a>";
            }).join("") + "</nav>";
        }
        $("#siteFooter").innerHTML =
            '<div class="container ft-grid"><div class="ft-brand"><a class="brand" href="index.html">' + ic("star") +
            '<span class="brand-txt">' + L.brand.name + "<em style='color:var(--saffron)'>" + L.brand.tld + "</em></span></a>" +
            '<p class="ft-blurb">' + F.blurb + '</p><form class="ft-news js-news"><input type="email" required placeholder="' + F.news.ph +
            '"><button type="submit">' + F.news.btn + "</button></form>" +
            '<div class="ft-social"><a href="#" aria-label="GitHub">' + ic("github") + '</a><a href="#" aria-label="LinkedIn">' + ic("linkedin") +
            '</a><a href="#" aria-label="X">' + ic("twitter") + "</a></div></div>" +
            col(F.cCompany) + col(F.cLegal) + col(F.cInfra) + "</div>" +
            '<div class="ft-bottom"><div class="container ft-b-row"><p>' + F.rights + "</p>" +
            '<a class="ft-status" href="#"><i class="pulse"></i>' + L.topbar.status + "</a><p>" + F.made + "</p></div></div>";
    }

    /* ---------------- static translation ---------------- */
    function translateStatic() {
        $$("[data-i18n]").forEach(function (el) {
            var v = t(el.dataset.i18n);
            if (v !== undefined) el.innerHTML = v;
        });
        $$("[data-i18n-ph]").forEach(function (el) {
            var v = t(el.dataset.i18nPh); if (v !== undefined) el.placeholder = v;
        });
        $$("[data-i18n-alt]").forEach(function (el) {
            var v = t(el.dataset.i18nAlt); if (v !== undefined) el.alt = v;
        });
    }
    function wrapML() {
        $$(".ml").forEach(function (el) {
            if (el.dataset.mldone) return;
            var lines = el.textContent.trim().split("\n");
            el.innerHTML = lines.map(function (l) { return '<span class="ml-line"><span>' + l + "</span></span>"; }).join("");
            el.dataset.mldone = "1";
        });
    }

    /* ============================================================
       SLIDER (home)
       ============================================================ */
    var Slider = {
        el: null, i: 0, n: 0, timer: null, dur: 6500, x0: null,
        build: function (el) {
            var self = this; this.el = el;
            var S = L.home.slides; this.n = S.length; this.i = 0;
            el.innerHTML =
                '<div class="sl-view">' + S.map(function (s, ix) {
                    var lines = s.title.split("\n").map(function (l) { return '<span class="ml-line"><span>' + l + "</span></span>"; }).join("");
                    return '<div class="slide' + (ix === 0 ? " active" : "") + '"><div class="slide-bg" style="background-image:url(\'https://picsum.photos/seed/' + s.img + '/1600/900\')"></div>' +
                        '<div class="container sl-in"><p class="sl-k">' + s.kicker + '</p><h2 class="sl-title ml in">' + lines +
                        '</h2><p class="sl-cap">' + s.cap + '</p><a class="btn btn-accent btn-cut sl-cta" href="' + s.cta.href + '">' + s.cta.t + "</a></div></div>";
                }).join("") + '</div><div class="sl-ui container"><div class="sl-dots">' +
                S.map(function (_, ix) { return '<button class="sl-dot' + (ix === 0 ? " on" : "") + '" data-sl="' + ix + '" type="button" aria-label="slide ' + (ix + 1) + '"></button>'; }).join("") +
                '</div><div class="sl-ctl"><button class="sl-btn sl-prev" data-sld="-1" type="button">' + ic("arrow") +
                '</button><button class="sl-btn sl-next" data-sld="1" type="button">' + ic("arrow") + "</button></div></div>" +
                '<div class="sl-prog"><i></i></div>';
            this.restartProg();
            el.addEventListener("pointerdown", function (e) { self.x0 = e.clientX; });
            el.addEventListener("pointerup", function (e) {
                if (self.x0 === null) return;
                var dx = e.clientX - self.x0; self.x0 = null;
                if (Math.abs(dx) < 45) return;
                var rtl = root.dir === "rtl";
                self.go(self.i + ((dx < 0) !== rtl ? 1 : -1), true);
            });
            el.addEventListener("mouseenter", function () { self.pause(); el.classList.add("sl-paused"); });
            el.addEventListener("mouseleave", function () { self.play(); el.classList.remove("sl-paused"); });
            this.play();
        },
        restartProg: function () {
            var p = $(".sl-prog i", this.el); if (!p) return;
            p.style.animation = "none"; void p.offsetWidth;
            if (!RM) p.style.animation = "slprog " + this.dur + "ms linear forwards";
        },
        go: function (n, user) {
            this.i = ((n % this.n) + this.n) % this.n;
            var slides = $$(".slide", this.el);
            slides.forEach(function (s, ix) { s.classList.toggle("active", ix === this.i); }, this);
            $$(".sl-dot", this.el).forEach(function (d, ix) { d.classList.toggle("on", ix === this.i); });
            var act = slides[this.i];
            $$(".ml-line>span", act).forEach(function (sp) { sp.style.animation = "none"; void sp.offsetWidth; sp.style.animation = ""; });
            this.restartProg();
            if (user) this.play();
        },
        play: function () {
            if (RM) return;
            this.stop();
            var self = this;
            this.timer = setInterval(function () { self.go(self.i + 1); }, this.dur);
        },
        stop: function () { clearInterval(this.timer); },
        pause: function () { this.stop(); }
    };

    /* ============================================================
       MEGA MENU (Stripe-style morph)
       ============================================================ */
    var Mega = {
        el: null, inner: null, caret: null, cur: null, openNow: false, tClose: 0,
        init: function () {
            var self = this;
            this.el = $("#mega"); this.inner = $("#megaInner"); this.caret = $(".mega-caret");
            if (!this.el) return;
            var coarse = !window.matchMedia("(pointer:fine)").matches;
            $$(".has-mega").forEach(function (li) {
                var key = li.dataset.mega, a = $(".nav-a", li);
                li.addEventListener("mouseenter", function () { if (!coarse) self.open(key, a); });
                li.addEventListener("mouseleave", function () { if (!coarse) self.scheduleClose(); });
                a.addEventListener("click", function (e) {
                    if (!coarse) return;
                    e.preventDefault();
                    if (self.openNow && self.cur === key) self.close(); else self.open(key, a);
                });
            });
            this.el.addEventListener("mouseenter", function () { clearTimeout(self.tClose); });
            this.el.addEventListener("mouseleave", function () { self.scheduleClose(); });
        },
        open: function (key, trig) {
            var self = this; clearTimeout(this.tClose);
            var panel = $(".mp-" + key, this.inner); if (!panel) return;
            $$(".mega-panel", this.inner).forEach(function (p) { p.classList.toggle("active", p === panel); });
            this.el.classList.add("open"); this.el.setAttribute("aria-hidden", "false");
            this.openNow = true;
            requestAnimationFrame(function () {
                var w = panel.offsetWidth, h = panel.offsetHeight;
                if (self.cur !== key) {
                    if (!self.cur) {
                        self.inner.style.transition = "none";
                        self.inner.style.width = w + "px"; self.inner.style.height = h + "px";
                        void self.inner.offsetWidth; self.inner.style.transition = "";
                    } else {
                        self.inner.style.width = w + "px"; self.inner.style.height = h + "px";
                    }
                }
                var tr = trig.getBoundingClientRect(), ir = self.inner.getBoundingClientRect();
                self.caret.style.left = (tr.left + tr.width / 2 - ir.left) + "px";
                self.cur = key;
            });
        },
        scheduleClose: function () { var self = this; this.tClose = setTimeout(function () { self.close(); }, 240); },
        close: function () {
            this.el.classList.remove("open"); this.el.setAttribute("aria-hidden", "true"); this.openNow = false;
        }
    };

    /* ============================================================
       RENDERERS (data fed from the active language file)
       ============================================================ */
    function faqHTML(items) {
        return items.map(function (f) {
            return '<div class="acc"><button class="acc-h" type="button" aria-expanded="false"><span>' + f.q + "</span>" + ic("chev") +
                '</button><div class="acc-p"><div class="acc-in"><p>' + f.a + "</p></div></div></div>";
        }).join("");
    }
    function tblHTML(cols, rows) {
        return '<div class="tbl-wrap"><table class="tbl"><thead><tr>' + cols.map(function (c) { return "<th>" + c + "</th>"; }).join("") +
            "</tr></thead><tbody>" + rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") +
            "</tbody></table></div>";
    }
    function pr(m, y) { return '<span class="pr" data-m="' + m + '" data-y="' + y + '">' + m + "</span>"; }

    var REG = {
        slider: function (el) { Slider.build(el); },
        pn: function (el) {
            var d = L[PAGE]; if (!d || !d.pn) return;
            el.innerHTML = '<div class="container pn-row"><span class="pn-cur">' + ic("star", "mini") + " " + d.pnLabel +
                '</span><nav class="pn-nav">' + d.pn.map(function (p) { return '<a href="#' + p.id + '" data-pnl="' + p.id + '">' + p.l + "</a>"; }).join("") + "</nav></div>";
        },
        stats: function (el) {
            el.innerHTML = '<div class="container stats-row">' + L.home.stats.map(function (s, i) {
                return '<div class="stat reveal" style="--d:' + i * 80 + 'ms"><b><span data-count="' + s.n + '" data-dec="' + ((s.n + "").indexOf(".") > -1 ? 1 : 0) + '">0</span>' + s.s + "</b><span>" + s.l + "</span></div>";
            }).join("") + "</div>";
        },
        svc: function (el) {
            el.innerHTML = '<div class="grid g3">' + L.home.svc.items.map(function (s, i) {
                return '<a class="card svc-card reveal" href="' + s.href + '" style="--d:' + i * 90 + 'ms"><span class="cic">' + ic(s.ic) +
                    "</span><h3>" + s.t + "</h3><p>" + s.d + '</p><span class="more">' + L.common.learnMore + " " + ic("arrow", "mini flip-r") + "</span></a>";
            }).join("") + "</div>";
        },
        marquee: function (el) {
            var row = L.home.stack.items.map(function (x) { return '<span class="mq-chip">' + x + "</span>"; }).join("");
            el.innerHTML = '<div class="mq-track">' + row + row + "</div>";
        },
        teaser: function (el) {
            var T = L.home.teaser;
            el.innerHTML = '<div class="container teaser-row"><div class="teaser-hd reveal"><p class="kicker">' + T.kicker + "</p><h2>" + T.title +
                "</h2><p>" + T.sub + '</p><a class="btn btn-line" href="' + T.cta.href + '">' + T.cta.t + "</a></div><div class='grid g3'>" +
                T.items.map(function (v, i) {
                    return '<a class="card mini-vps reveal" href="vps.html" style="--d:' + i * 90 + 'ms"><b>' + v.name + "</b><small>" + v.spec +
                        '</small><span class="mv-price">' + v.price + "<i>" + L.common.perMonth + "</i></span></a>";
                }).join("") + "</div></div>";
        },
        testi: function (el) {
            el.innerHTML = '<div class="grid g3">' + L.home.testi.items.map(function (q, i) {
                return '<figure class="card quote reveal" style="--d:' + i * 100 + 'ms"><div class="qmark">❝</div><blockquote>' + q.q +
                    '</blockquote><figcaption><img src="https://picsum.photos/seed/webify-client-' + (i + 1) + '/96/96" alt="' + q.n +
                    '"><span><b>' + q.n + "</b><small>" + q.r + "</small></span></figcaption></figure>";
            }).join("") + "</div>";
        },
        projGrid: function (el) {
            el.innerHTML = '<div class="grid g3" id="pCards">' + L.projects.items.map(function (p, i) {
                var catKey = p.cat.split(" ")[0];
                return '<article class="card proj-card reveal" data-cat="' + p.cat + '" style="--d:' + i * 70 + 'ms"><div class="proj-media">' +
                    '<img loading="lazy" src="https://picsum.photos/seed/' + p.img + '/640/420" alt="' + p.t + '"><span class="proj-cat">' +
                    (L.projects.filters[catKey] || "") + '</span></div><div class="proj-body"><h3>' + p.t + "</h3><p>" + p.d +
                    '</p><div class="ptags">' + p.tags.map(function (x) { return "<span>" + x + "</span>"; }).join("") +
                    '</div><div class="plinks"><a href="#">' + L.common.demo + " " + ic("ext", "mini") + '</a><a href="#">' + L.common.code + " " + ic("github", "mini") + "</a></div></div></article>";
            }).join("") + '</div><p class="pnone" id="pNone" hidden>' + L.projects.none + "</p>";
        },
        repos: function (el) {
            var R = L.projects.repos;
            el.innerHTML = '<div class="grid g3">' + R.items.map(function (r, i) {
                return '<article class="card reveal" style="--d:' + i * 80 + 'ms"><div class="repo-top">' + ic("code") + "<h3>" + r.n +
                    "</h3></div><p>" + r.d + '</p><div class="repo-meta"><span class="rlang"><i></i>' + r.lang +
                    "</span><span>★ " + r.stars + "</span><span>⑂ " + r.forks + "</span></div></article>";
            }).join("") + '</div><div style="margin-top:26px"><a class="btn btn-line" href="' + R.cta.href + '">' + R.cta.t + " " + ic("ext", "mini") + "</a></div>";
        },
        timeline: function (el) {
            el.innerHTML = '<div class="tline">' + L.experience.timeline.map(function (x, i) {
                return '<article class="tl-item reveal" style="--d:' + i * 90 + 'ms"><span class="tl-period">' + x.period + "</span><h3>" + x.role +
                    " <small>@ " + x.org + "</small></h3><p>" + x.d + '</p><div class="ptags">' + x.tags.map(function (g) { return "<span>" + g + "</span>"; }).join("") + "</div></article>";
            }).join("") + "</div>";
        },
        platforms: function (el) {
            el.innerHTML = '<div class="grid g3">' + L.experience.free.platforms.map(function (p, i) {
                return '<div class="card reveal" style="--d:' + i * 90 + 'ms"><h3>' + p.n + "</h3><p>" + p.d + "</p></div>";
            }).join("") + "</div>";
        },
        oss: function (el) {
            el.innerHTML = '<div class="grid g3">' + L.experience.oss.items.map(function (o, i) {
                return '<a class="card prof reveal" href="' + o.href + '" style="--d:' + i * 90 + 'ms"><span class="cic">' + ic("github") +
                    "</span><b>" + o.n + "</b><small>" + o.d + '</small><span class="more">★ ' + o.stars + "</span></a>";
            }).join("") + "</div>";
        },
        vpsTiers: function (el) {
            el.innerHTML = '<div class="grid g4">' + L.vps.tiers.items.map(function (t2, i) {
                return '<article class="card tier reveal' + (t2.hot ? " hot" : "") + '" style="--d:' + i * 90 + 'ms" data-tilt>' +
                    (t2.hot ? '<span class="flag">' + L.common.popular + "</span>" : "") +
                    "<header><h3>" + t2.name + '</h3><p class="tdesc">' + t2.desc + '</p></header><div class="tprice"><b>$' + t2.price +
                    '</b><span>' + L.common.perMonth + '</span></div><div class="tspecs">' +
                    t2.specs.map(function (s) { return "<div class='tspec'><small>" + s.k + "</small><b>" + s.v + "</b></div>"; }).join("") +
                    '</div><ul class="tfeats">' + t2.feats.map(function (f) { return "<li>" + ic("check") + f + "</li>"; }).join("") +
                    '</ul><a class="btn ' + (t2.hot ? "btn-accent btn-cut" : "btn-line") + '" href="contact.html">' + L.common.choose + "</a></article>";
            }).join("") + '</div><p class="tnote reveal">' + L.vps.tiers.note + "</p>";
        },
        vpsSpecs: function (el) {
            var d = L.vps.specs;
            el.innerHTML = tblHTML(d.cols, d.rows.map(function (r) { return [r.f].concat(r.v); }));
        },
        featVps: function (el) {
            el.innerHTML = '<div class="grid g3">' + L.vps.feat.items.map(function (f, i) {
                return '<div class="card reveal" style="--d:' + i * 70 + 'ms"><span class="cic">' + ic(f.ic) + "</span><h3>" + f.t + "</h3><p>" + f.d + "</p></div>";
            }).join("") + "</div>";
        },
        hostPlans: function (el) {
            el.innerHTML = '<div class="grid g3">' + L.hosting.plans.items.map(function (p2, i) {
                return '<article class="card tier reveal' + (p2.hot ? " hot" : "") + '" style="--d:' + i * 90 + 'ms" data-tilt>' +
                    (p2.hot ? '<span class="flag">' + L.common.popular + "</span>" : "") +
                    "<header><h3>" + p2.name + '</h3><p class="tdesc">' + p2.desc + '</p></header><div class="tprice"><b>$' + p2.price +
                    '</b><span>' + L.common.perMonth + '</span></div><ul class="tfeats">' +
                    p2.feats.map(function (f) { return "<li>" + ic("check") + f + "</li>"; }).join("") +
                    '</ul><a class="btn ' + (p2.hot ? "btn-accent btn-cut" : "btn-line") + '" href="contact.html">' + L.common.choose + "</a></article>";
            }).join("") + "</div>";
        },
        hostCompare: function (el) {
            var d = L.hosting.compare;
            el.innerHTML = tblHTML(d.cols, d.rows.map(function (r) { return [r.f].concat(r.v); }));
        },
        faqVps: function (el) { el.innerHTML = faqHTML(L.vps.faq.items); },
        faqHost: function (el) { el.innerHTML = faqHTML(L.hosting.faq.items); },
        faqSup: function (el) { el.innerHTML = faqHTML(L.support.faq.items); },
        caps: function (el) {
            el.innerHTML = '<div class="grid g3">' + L.services.caps.items.map(function (c, i) {
                return '<div class="card reveal" style="--d:' + i * 70 + 'ms"><span class="cic">' + ic(c.ic) + "</span><h3>" + c.t + "</h3><p>" + c.d + "</p></div>";
            }).join("") + "</div>";
        },
        proc: function (el) {
            el.innerHTML = '<ol class="steps">' + L.services.proc.steps.map(function (s, i) {
                return '<li class="reveal" style="--d:' + i * 100 + 'ms"><b>' + (i + 1) + "</b><div><h3>" + s.t + "</h3><p>" + s.d + "</p></div></li>";
            }).join("") + "</ol>";
        },
        svcStack: function (el) {
            el.innerHTML = '<div class="chips reveal">' + L.services.stack.items.map(function (c) { return '<span class="chip">' + c + "</span>"; }).join("") + "</div>";
        },
        values: function (el) {
            el.innerHTML = '<div class="grid g4">' + L.about.values.items.map(function (v, i) {
                return '<div class="card reveal" style="--d:' + i * 90 + 'ms"><span class="cic">' + ic(v.ic) + "</span><h3>" + v.t + "</h3><p>" + v.d + "</p></div>";
            }).join("") + "</div>";
        },
        stackGroups: function (el) {
            el.innerHTML = L.about.stack.groups.map(function (g, i) {
                return '<div class="stk-g reveal" style="--d:' + i * 90 + 'ms"><h3>' + g.t + '</h3><div class="chips">' +
                    g.items.map(function (c) { return '<span class="chip">' + c + "</span>"; }).join("") + "</div></div>";
            }).join("");
        },
        team: function (el) {
            el.innerHTML = '<div class="grid g4">' + L.about.team.members.map(function (m, i) {
                return '<div class="card member reveal" style="--d:' + i * 90 + 'ms"><img src="https://picsum.photos/seed/webify-dev-' + (i + 1) +
                    '/200/200" alt="' + m.n + '"><h3>' + m.n + "</h3><small>" + m.r + "</small></div>";
            }).join("") + "</div>";
        },
        prHosting: function (el) {
            el.innerHTML = tblHTML([L.common.plan, L.common.specs, L.common.price, ""],
                L.pricing.hosting.rows.map(function (r) {
                    return ["<b>" + r.name + "</b>", r.f, "$" + pr(r.m, r.y) + " <small>" + L.common.perMonth + "</small>",
                        '<a class="btn btn-line btn-sm" href="hosting.html">' + L.common.choose + "</a>"];
                }));
        },
        prVps: function (el) {
            el.innerHTML = tblHTML([L.common.plan, L.common.specs, L.common.price, ""],
                L.pricing.vps.rows.map(function (r) {
                    return ["<b>" + r.name + "</b>", r.f, "$" + pr(r.m, r.y) + " <small>" + L.common.perMonth + "</small>",
                        '<a class="btn btn-line btn-sm" href="vps.html">' + L.common.choose + "</a>"];
                }));
        },
        prSvc: function (el) {
            el.innerHTML = '<div class="card" style="padding:0">' + L.pricing.svc.rows.map(function (r) {
                return '<div class="svc-row"><div class="sp"><b>' + r.name + "</b><small>" + r.d +
                    '</small></div><div class="price"><b>$' + r.price + "</b><small>" + r.unit + "</small></div></div>";
            }).join("") + "</div>";
        },
        docs: function (el) {
            el.innerHTML = '<div class="grid g4">' + L.support.docs.items.map(function (d, i) {
                return '<a class="card doc-card reveal" href="#" style="--d:' + i * 80 + 'ms"><span class="cic">' + ic(d.ic) +
                    "</span><h3>" + d.t + "</h3><p>" + d.d + '</p><small class="doc-n">' + d.n + "</small></a>";
            }).join("") + "</div>";
        },
        contactLinks: function (el) {
            var ics = ["github", "linkedin", "twitter"];
            el.innerHTML = '<div class="grid g3">' + L.contact.links.items.map(function (x, i) {
                return '<a class="card prof reveal" href="' + x.href + '" style="--d:' + i * 80 + 'ms"><span class="cic">' + ic(ics[i] || "globe") +
                    "</span><b>" + x.n + "</b><small>" + x.d + '</small><span class="more">' + ic("ext", "mini") + "</span></a>";
            }).join("") + "</div>";
        }
    };

    function runRenders() {
        $$("[data-render]").forEach(function (el) {
            var fn = REG[el.dataset.render];
            if (fn) { el.innerHTML = ""; fn(el); }
        });
    }

    /* ============================================================
       MOTION / DYNAMIC
       ============================================================ */
    var revIO;
    function initReveals() {
        var els = $$(".reveal:not(.in), .ml:not(.in)");
        if (RM) { els.forEach(function (e) { e.classList.add("in"); }); return; }
        if (revIO) revIO.disconnect();
        revIO = new IntersectionObserver(function (en) {
            en.forEach(function (x) {
                if (x.isIntersecting) { x.target.classList.add("in"); revIO.unobserve(x.target); }
            });
        }, { threshold: .14, rootMargin: "0px 0px -6% 0px" });
        els.forEach(function (e) { revIO.observe(e); });
    }

    function fmtNum(v, dec) { return dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en-US"); }
    function initCounters() {
        var els = $$("[data-count]"); if (!els.length) return;
        if (RM) { els.forEach(function (e) { e.textContent = fmtNum(+e.dataset.count, +e.dataset.dec || 0); }); return; }
        var io = new IntersectionObserver(function (en) {
            en.forEach(function (x) {
                if (!x.isIntersecting) return; io.unobserve(x.target);
                var el = x.target, to = +el.dataset.count, dec = +el.dataset.dec || 0, t0 = performance.now();
                (function step(now) {
                    var p = Math.min(1, (now - t0) / 1400), e = 1 - Math.pow(1 - p, 3);
                    el.textContent = fmtNum(to * e, dec);
                    if (p < 1) requestAnimationFrame(step);
                })(t0);
            });
        }, { threshold: .4 });
        els.forEach(function (e) { io.observe(e); });
    }

    function scramble(el) {
        var txt = el.dataset.txt || el.textContent; el.dataset.txt = txt;
        if (RM) { el.textContent = txt; return; }
        var cs = root.dir === "rtl" ? "ابپتثجچحخدذرزسشصطعغفقکگلمنوهی" : "ABCDEFGHKMNPRSTUVWXYZ0123456789#%";
        var f = 0, total = Math.max(14, txt.length * 2);
        (function tick() {
            f++;
            var done = Math.floor(f / total * txt.length);
            el.textContent = txt.split("").map(function (c, i) {
                return (i < done || c === " ") ? c : cs[Math.random() * cs.length | 0];
            }).join("");
            if (done < txt.length) setTimeout(tick, 28); else el.textContent = txt;
        })();
    }
    function initScramble() {
        var els = $$("[data-scramble]"); if (!els.length || RM) return;
        var io = new IntersectionObserver(function (en) {
            en.forEach(function (x) { if (x.isIntersecting) { io.unobserve(x.target); scramble(x.target); } });
        }, { threshold: .5 });
        els.forEach(function (e) { io.observe(e); });
    }

    function initSpy() {
        var links = $$("[data-pnl]"); if (!links.length) return;
        var sects = [];
        links.forEach(function (a) {
            var s = document.getElementById(a.dataset.pnl);
            if (s) sects.push(s);
        });
        function set(id) { links.forEach(function (a) { a.classList.toggle("on", a.dataset.pnl === id); }); }
        var io = new IntersectionObserver(function (en) {
            en.forEach(function (x) { if (x.isIntersecting) set(x.target.id); });
        }, { rootMargin: "-35% 0px -55% 0px" });
        sects.forEach(function (s) { io.observe(s); });
        set(links[0].dataset.pnl);
    }

    function initTilt() {
        if (RM || !window.matchMedia("(pointer:fine)").matches) return;
        $$("[data-tilt]").forEach(function (c) {
            c.addEventListener("pointermove", function (e) {
                var r = c.getBoundingClientRect();
                var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
                c.style.transform = "perspective(750px) rotateY(" + x * 5 + "deg) rotateX(" + (-y * 5) + "deg) translateY(-5px)";
            });
            c.addEventListener("pointerleave", function () { c.style.transform = ""; });
        });
    }

    function refreshPrices() {
        var p = body.dataset.period || "m";
        $$(".pr").forEach(function (s) { s.textContent = s.dataset[p]; });
    }

    function updateActiveNav() {
        var map = { about: "company", experience: "company", projects: "company", contact: "company", hosting: "services", vps: "services" };
        var nk = map[PAGE] || PAGE;
        $$(".nav-a, .dw-list>li>a").forEach(function (a) {
            var on = a.dataset.nk === nk;
            a.classList.toggle("cur", on);
            if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
        });
    }

    /* ---------------- forms ---------------- */
    function handleForm(f) {
        var ok = true;
        $$("[required]", f).forEach(function (inp) {
            var empty = !inp.value.trim();
            var badMail = inp.type === "email" && inp.value && !/^\S+@\S+\.\S+$/.test(inp.value);
            var bad = empty || badMail;
            var field = inp.closest(".field");
            if (field) {
                field.classList.toggle("err", bad);
                var m = $(".fmsg", field);
                if (m) m.textContent = bad ? (empty ? L.common.required : L.common.invalidEmail) : "";
            }
            if (bad) ok = false;
        });
        if (!ok) return;
        f.insertAdjacentHTML("afterend", '<div class="form-ok reveal in">' + ic("check") + " " + L.common.formOk + "</div>");
        f.remove();
    }

    /* ============================================================
       LANGUAGE APPLY
       ============================================================ */
    function applyLang(code) {
        if (!WEBIFY_LANGS[code]) code = "prs";
        LANG = code; store.set("wb_lang", code);
        L = WEBIFY_LANGS[code];
        root.lang = L.htmlLang; root.dir = L.dir;
        document.title = L.meta[PAGE] + " — Webify.af";
        buildTopstrip(); buildHeader(); buildDrawer(); buildFooter();
        applyTheme(); Mega.init();
        translateStatic(); wrapML(); runRenders(); refreshPrices();
        initReveals(); initSpy(); initCounters(); initScramble(); initTilt(); updateActiveNav();
        window.scrollTo(0, 0);
    }

    /* ============================================================
       GLOBAL EVENTS (delegated — safe across re-renders)
       ============================================================ */
    document.addEventListener("click", function (e) {
        var tgt = e.target;
        if (tgt.closest("#themeBtn")) { THEME = THEME === "light" ? "dark" : "light"; store.set("wb_theme", THEME); applyTheme(); return; }
        var lb = tgt.closest(".lang-btn"); if (lb) { applyLang(lb.dataset.lang); return; }
        if (tgt.closest("#burger")) { openDrawer(); return; }
        if (tgt.closest("#dwClose")) { closeDrawer(); return; }
        var dt = tgt.closest(".dw-t");
        if (dt) { dt.closest(".dw-acc").classList.toggle("open"); return; }
        var acc = tgt.closest(".acc-h");
        if (acc) {
            var item = acc.closest(".acc"), was = item.classList.contains("open");
            $$(".acc", item.parentElement).forEach(function (a) { a.classList.remove("open"); $(".acc-h", a).setAttribute("aria-expanded", "false"); });
            if (!was) { item.classList.add("open"); acc.setAttribute("aria-expanded", "true"); }
            return;
        }
        var fb = tgt.closest(".fbtn");
        if (fb) {
            $$(".fbtn").forEach(function (b) { b.classList.remove("on"); });
            fb.classList.add("on");
            var f = fb.dataset.f, vis = 0;
            $$("[data-cat]").forEach(function (c) {
                var show = f === "all" || c.dataset.cat.split(" ").indexOf(f) > -1;
                c.style.display = show ? "" : "none"; if (show) vis++;
            });
            var none = $("#pNone"); if (none) none.hidden = vis > 0;
            return;
        }
        var sg = tgt.closest(".seg-btn");
        if (sg) {
            $$(".seg-btn").forEach(function (b) { b.classList.remove("on"); });
            sg.classList.add("on"); body.dataset.period = sg.dataset.period; refreshPrices();
            return;
        }
        var sl = tgt.closest("[data-sl]"); if (sl) { Slider.go(+sl.dataset.sl, true); return; }
        var sd = tgt.closest("[data-sld]"); if (sd) { Slider.go(Slider.i + +sd.dataset.sld, true); return; }
        if (tgt.closest("#toTop")) { window.scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" }); return; }
        if (!tgt.closest("#mainnav")) Mega.close();
    });

    document.addEventListener("submit", function (e) {
        if (e.target.classList.contains("js-form")) { e.preventDefault(); handleForm(e.target); }
        if (e.target.classList.contains("js-news")) {
            e.preventDefault();
            e.target.outerHTML = '<p class="news-ok">✦ ' + L.footer.news.ok + "</p>";
        }
    });

    document.addEventListener("input", function (e) {
        if (e.target.id !== "kbSearch") return;
        var q = e.target.value.trim().toLowerCase(), any = false;
        $$("#faqMount .acc").forEach(function (a) {
            var hit = a.textContent.toLowerCase().indexOf(q) > -1;
            a.style.display = hit ? "" : "none"; if (hit) any = true;
        });
        var none = $("#kbNone"); if (none) none.hidden = any;
    });

    function openDrawer() { $("#drawer").classList.add("open"); $(".drawer-bd").classList.add("show"); body.classList.add("no-scroll"); $("#burger").setAttribute("aria-expanded", "true"); }
    function closeDrawer() { $("#drawer").classList.remove("open"); $(".drawer-bd").classList.remove("show"); body.classList.remove("no-scroll"); $("#burger").setAttribute("aria-expanded", "false"); }
    document.addEventListener("click", function (e) { if (e.target.classList.contains("drawer-bd")) closeDrawer(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeDrawer(); Mega.close(); } });

    var ticking = false;
    window.addEventListener("scroll", function () {
        if (ticking) return; ticking = true;
        requestAnimationFrame(function () {
            var y = window.scrollY;
            var h = $("#siteHeader"); if (h) h.classList.toggle("scrolled", y > 8);
            var tt = $("#toTop"); if (tt) tt.classList.toggle("show", y > 620);
            ticking = false;
        });
    }, { passive: true });

    /* ---------------- boot ---------------- */
    document.addEventListener("DOMContentLoaded", function () {
        applyTheme();
        applyLang(LANG);
    });
})();