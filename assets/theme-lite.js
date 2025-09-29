const on = (e, t, a, i) => {
    const n = document.querySelectorAll(e);
    n.forEach(function (e) {
        e.addEventListener(t, (e) => {
            (e.target.matches(a) || ("input" == t && 0 < e.target.closest(a)?.length)) && i(e);
        });
    });
};
(window.Fastor = {}),
    (window.Fastor = window.Fastor || {}),
    (Fastor.Sections = function () {
        (this.constructors = {}),
            (this.instances = []),
            document.addEventListener("shopify:section:load", this._onSectionLoad.bind(this)),
            document.addEventListener("shopify:section:unload", this._onSectionUnload.bind(this)),
            document.addEventListener("shopify:section:select", this._onSelect.bind(this)),
            document.addEventListener("shopify:section:deselect", this._onDeselect.bind(this)),
            document.addEventListener("shopify:block:select", this._onBlockSelect.bind(this)),
            document.addEventListener("shopify:block:deselect", this._onBlockDeselect.bind(this));
    }),
    (Fastor.Sections.prototype = Object.assign({}, Fastor.Sections.prototype, {
        _createInstance: function (e, t) {
            var a = e.getAttribute("data-section-id"),
                i = e.getAttribute("data-section-type");
            if (((t = t || this.constructors[i]), "undefined" != typeof t)) {
                var n = Object.assign(new t(e), { id: a, type: i, container: e });
                this.instances.push(n);
            }
        },
        _onSectionLoad: function (e) {
            var t = document.querySelector('[data-section-id="' + e.detail.sectionId + '"]');
            t && this._createInstance(t);
        },
        _onSectionUnload: function (e) {
            this.instances = this.instances.filter(function (t) {
                var a = t.id === e.detail.sectionId;
                return a && "function" == typeof t.onUnload && t.onUnload(e), !a;
            });
        },
        _onSelect: function (e) {
            var t = this.instances.find(function (t) {
                return t.id === e.detail.sectionId;
            });
            "undefined" != typeof t && "function" == typeof t.onSelect && t.onSelect(e), Fastor.appearAnimate(".appear-animate");
        },
        _onDeselect: function (e) {
            var t = this.instances.find(function (t) {
                return t.id === e.detail.sectionId;
            });
            "undefined" != typeof t && "function" == typeof t.onDeselect && t.onDeselect(e);
        },
        _onBlockSelect: function (e) {
            var t = this.instances.find(function (t) {
                return t.id === e.detail.sectionId;
            });
            "undefined" != typeof t && "function" == typeof t.onBlockSelect && t.onBlockSelect(e);
        },
        _onBlockDeselect: function (e) {
            var t = this.instances.find(function (t) {
                return t.id === e.detail.sectionId;
            });
            "undefined" != typeof t && "function" == typeof t.onBlockDeselect && t.onBlockDeselect(e);
        },
        register: function (e, t) {
            (this.constructors[e] = t),
                document.querySelectorAll('[data-section-type="' + e + '"]').forEach(
                    function (e) {
                        this._createInstance(e, t);
                    }.bind(this)
                );
        },
    })),
    (window.Fastor = window.Fastor || {}),
    (Fastor.Filters = (function () {
        function e(e) {
            (this.$container = e),
                this._refresh(),
                on(this.containerSelect, "change", t.sortSelection, this._onSortChangeAjax.bind(this)),
                on(this.containerSelect, "change", t.limitSelection, this._onLimitChangeAjax.bind(this)),
                on(this.containerSelect, "input", t.filterForm, this._onFilterFormChangeAjax.bind(this)),
                on(this.containerSelect, "click", t.layoutChoice, this._onLayoutChangeAjax.bind(this)),
                on(this.containerSelect, "click", t.paginationPage, this._onPagingAjax.bind(this)),
                this._initInfiniteAjax(),
                this._initHorizontalFilter(),
                this._initParams();
        }
        var t = {
                filterForm: "#CollectionFiltersForm",
                filterChoice: "[data-filter-choice]",
                sortSelection: "#SortBy",
                limitSelection: "#limit",
                layoutChoice: "[data-layout]",
                paginationPage: ".pagination a.page-link",
                infiniteAjaxSign: ".scroll-load",
                productsWrapper: ".product-wrapper",
                indropdownFilterToggle: ".select-menu-toggle",
                indropdownSelectMenu: ".select-menu",
            },
            a = { indropdownFilterTemplate: "indropdown-filter-collection", indropdownFilterToggle: "opened", indropdownFilterItems: "filter-items", indropdownSelectMenu: "select-menu" },
            i = { filterChoices: "data-filter-choice" };
        return (
            (e.prototype = Object.assign({}, e.prototype, {
                _refresh: function () {
                    (this.collectionHandle = this.$container.dataset.collectionHandle),
                        (this.containerSelect = "#" + this.$container.id),
                        (this.filterChoices = this.$container.querySelectorAll(t.filterChoice)),
                        (this.sortSelect = this.$container.querySelector(t.sortSelection)),
                        (this.limitSelect = this.$container.querySelector(t.limitSelection)),
                        (this.layoutChoices = this.$container.querySelectorAll(t.layoutChoice)),
                        (this.indropdownSelectMenu = this.$container.querySelector(t.indropdownSelectMenu)),
                        (this.infiniteAjaxWrapperSelector = t.infiniteAjaxSign),
                        (this.productsWrapperSelector = t.productsWrapper),
                        (this.indropdownFilterToggleSelector = t.indropdownFilterToggle),
                        (this.indropdownFilterTemplateClass = a.indropdownFilterTemplate),
                        (this.indropdownFilterToggleClass = a.indropdownFilterToggle),
                        (this.indropdownSelectMenuClass = a.indropdownSelectMenu),
                        (this.filterChoicesAttr = i.filterChoices),
                        this.sortSelect && (this.defaultSort = this._getDefaultSortValue()),
                        this.limitSelect && (this.defaultLimit = this._getDefaultLimitValue()),
                        Fastor.slider("#" + this.$container.id + " .owl-carousel:not(.owl-loaded)"),
                        Fastor.menu.initFilterMenu(),
                        Fastor.menu.initCategoryMenu(),
                        Fastor.menu.initCollapsibleWidget(),
                        Fastor.sidebar("sidebar"),
                        Fastor.priceSlider(".filter-price-slider"),
                        Fastor.appearAnimate(".appear-animate", !0);
                },
                _initHorizontalFilter: function () {
                    this.$container.classList.contains(this.indropdownFilterTemplateClass) &&
                        (on(
                            this.containerSelect,
                            "click",
                            this.indropdownFilterToggleSelector,
                            function (e) {
                                e.target.parentNode.classList.toggle(this.indropdownFilterToggleClass);
                            }.bind(this)
                        ),
                        Fastor.$body.on(
                            "mousedown",
                            function (t) {
                                t.target.hasAttribute(this.filterChoicesAttr) || t.target.classList.contains(this.indropdownSelectMenuClass) || this.indropdownSelectMenu.classList.remove(this.indropdownFilterToggleClass);
                            }.bind(this)
                        ));
                },
                _initInfiniteAjax: function () {
                    var e,
                        t = this.infiniteAjaxWrapperSelector,
                        a = this,
                        i = function () {
                            window.pageYOffset > e + $(t).outerHeight() - window.innerHeight - 150 &&
                                "loading" != $(t).data("load-state") &&
                                ($(t).data("load-state", "loading"),
                                $.ajax({
                                    url: $(t).attr("data-next-url"),
                                    success: function (e) {
                                        var n = $(e).find(a.productsWrapperSelector).children();
                                        $(t).attr("data-next-url", $(e).find(a.productsWrapperSelector).attr("data-next-url")),
                                            $(t).next().hasClass("load-more-overlay") ? $(t).next().addClass("loading") : $('<div class="pb-6 load-more-overlay loading"></div>').insertAfter($(t)),
                                            setTimeout(function () {
                                                $(t).next().removeClass("loading"),
                                                    $(t).append(n),
                                                    setTimeout(function () {
                                                        $(t).find(".product-wrap.fade:not(.in)").addClass("in"), Fastor.ProductItems.init();
                                                    }, 200),
                                                    $(t).data("load-state", "loaded");
                                            }, 500),
                                            "" == $(t).attr("data-next-url") && window.removeEventListener("scroll", i, { passive: !0 });
                                    },
                                    failure: function () {
                                        $this.text("Sorry! Something went wrong.");
                                    },
                                }));
                        };
                    0 < $(t).length && ((e = $(t).offset().top), window.addEventListener("scroll", i, { passive: !0 }));
                },
                _initParams: function () {
                    if (((this.queryParams = new FormData()), location.search.length))
                        for (var e, t = location.search.substr(1).split("&"), a = 0; a < t.length; a++) (e = t[a].split("=")), 1 < e.length && this.queryParams.append(decodeURIComponent(e[0]), decodeURIComponent(e[1]));
                },
                _ajaxCall: function (e) {
                    this.$container.classList.remove("loaded"),
                        fetch(e)
                            .then(function (e) {
                                return e.text();
                            })
                            .then(
                                function (t) {
                                    var a = new DOMParser(),
                                        i = a.parseFromString(t, "text/html"),
                                        n = i.querySelector(this.containerSelect);
                                    this.$container.classList.add("loaded"), (this.$container.innerHTML = n.innerHTML);
                                    var s = this.$container.querySelector(".main-content-wrap");
                                    history.pushState({}, null, e), this._refresh(), Fastor.ProductItems.init(), null != s && $("html, body").animate({ scrollTop: s.offsetTop - 50 }, 1e3);
                                }.bind(this)
                            )
                            .catch(function () {}.bind(this));
                },
                _onSortChangeAjax: function () {
                    this.queryParams.set("sort_by", this._getSortValue()), this.queryParams.delete("page");
                    var e = window.location.origin + window.location.pathname + "?" + decodeURIComponent(new URLSearchParams(this.queryParams).toString());
                    this._ajaxCall(e);
                },
                _onLimitChangeAjax: function () {
                    this.queryParams.set("limit", this._getLimitValue()), this.queryParams.delete("page");
                    var e = window.location.origin + window.location.pathname + "?" + decodeURIComponent(new URLSearchParams(this.queryParams).toString());
                    this._ajaxCall(e);
                },
                _onFilterFormChangeAjax: function (e) {
                    var a = e.target.closest(t.filterChoice),
                        i = "/collections/" + this.collectionHandle;
                    this.queryParams.delete("page");
                    var n = ["sort_by", "view", "lo", "token", "limit"],
                        s = [];
                    for (var o of this.queryParams.entries()) 0 > n.indexOf(o[0]) && s.push(o[0]);
                    s.forEach((e) => this.queryParams.delete(e));
                    var l = new FormData(e.target.closest("form"));
                    for (var o of l.entries()) this.queryParams.append(o[0], o[1]);
                    var r = decodeURIComponent(new URLSearchParams(this.queryParams).toString());
                    "LI" == a?.parentNode.tagName && a?.parentNode.classList.toggle("active"),
                        this.$container.classList.contains(this.indropdownFilterTemplateClass) &&
                            $(a)
                                ?.parents("." + this.indropdownSelectMenuClass)
                                .toggleClass(this.indropdownFilterToggleClass);
                    this._ajaxCall(i + "?" + r);
                },
                _onLayoutChangeAjax: function (e) {
                    var t = Math.floor,
                        a = e.target;
                    if (a.classList.contains("active")) return !1;
                    this.queryParams.set("lo", a.dataset.value), this.queryParams.set("token", t(Math.random() * t(1e3)));
                    var i = window.location.origin + window.location.pathname + "?" + decodeURIComponent(new URLSearchParams(this.queryParams).toString());
                    this._ajaxCall(i);
                },
                _onPagingAjax: function (e) {
                    e.preventDefault();
                    var t = e.target;
                    if (t.closest(".page-item").classList.contains("active")) return !1;
                    if (t.closest(".page-item").classList.contains("disabled")) return !1;
                    var a = t.getAttribute("href"),
                        i = a.split("page="),
                        n = i[1];
                    (i = n.split("&")), (n = i[0]), this.queryParams.set("page", n), this._ajaxCall(a);
                },
                _getSortValue: function () {
                    return this.sortSelect.value || this.defaultSort;
                },
                _getDefaultSortValue: function () {
                    return this.sortSelect.dataset.defaultSortby;
                },
                _getLimitValue: function () {
                    return this.limitSelect.value || this.defaultLimit;
                },
                _getDefaultLimitValue: function () {
                    return this.limitSelect.dataset.defaultLimit;
                },
                onUnload: function () {
                    this.sortSelect && this.sortSelect.removeEventListener("change", this._onSortChangeAjax), this.limitSelect && this.limitSelect.removeEventListener("change", this._onLimitChangeAjax);
                },
            })),
            e
        );
    })()),
    (function (e) {
        (Fastor.$window = e(window)),
            (Fastor.$body = e(document.body)),
            (Fastor.status = ""),
            (Fastor.minDesktopWidth = 992),
            (Fastor.isIE = 0 <= navigator.userAgent.indexOf("Trident")),
            (Fastor.isEdge = 0 <= navigator.userAgent.indexOf("Edge")),
            (Fastor.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)),
            (Fastor.call = function (e, t) {
                setTimeout(e, t);
            }),
            (Fastor.parseOptions = function (e) {
                return "string" == typeof e ? JSON.parse(e.replace(/'/g, '"').replace(";", "")) : {};
            }),
            (Fastor.parseTemplate = function (e, t) {
                return e.replace(/\{\{(\w+)\}\}/g, function () {
                    return t[arguments[1]];
                });
            }),
            (Fastor.byId = function (e) {
                return document.getElementById(e);
            }),
            (Fastor.byTag = function (e, t) {
                return t ? t.getElementsByTagName(e) : document.getElementsByTagName(e);
            }),
            (Fastor.byClass = function (e, t) {
                return t ? t.getElementsByClassName(e) : document.getElementsByClassName(e);
            }),
            (Fastor.setCookie = function (e, t, a) {
                var i = new Date();
                i.setTime(i.getTime() + 1e3 * (60 * (60 * (24 * a)))), (document.cookie = e + "=" + t + ";expires=" + i.toUTCString() + ";path=/");
            }),
            (Fastor.getCookie = function (e) {
                for (var t, a = e + "=", n = document.cookie.split(";"), s = 0; s < n.length; ++s) {
                    for (t = n[s]; " " == t.charAt(0); ) t = t.substring(1);
                    if (0 == t.indexOf(a)) return t.substring(a.length, t.length);
                }
                return "";
            }),
            (Fastor.$ = function (t) {
                return t instanceof jQuery ? t : e(t);
            });
    })(jQuery),
    (function () {
        var e,
            t,
            n,
            s,
            l,
            r,
            d,
            c,
            p = [],
            m = !1,
            u = function () {
                for (var a = p.length; a--; )
                    (e = p[a]),
                        (t = window.pageXOffset),
                        (n = window.pageYOffset),
                        (s = e.el.getBoundingClientRect()),
                        (l = s.left + t),
                        (r = s.top + n),
                        (d = e.options.accX),
                        (c = e.options.accY),
                        r + s.height + c >= n && r <= n + window.innerHeight + c && l + s.width + d >= t && l <= t + window.innerWidth + d && (e.fn.call(e.el, e.data), p.splice(a, 1));
            };
        (Fastor.appear = function (e, t, a) {
            var i = { data: void 0, accX: 0, accY: 0 };
            a && (a.data && (i.data = a.data), a.accX && (i.accX = a.accX), a.accY && (i.accY = a.accY)), p.push({ el: e, fn: t, options: i }), m || (m = Fastor.requestTimeout(u, 100));
        }),
            window.addEventListener("scroll", u, { passive: !0 }),
            window.addEventListener("resize", u, { passive: !0 }),
            $(window).on("appear.check", u);
    })(),
    (function (t) {
        (Fastor.zoomImageOptions = { responsive: !0, zoomWindowFadeIn: 750, zoomWindowFadeOut: 500, borderSize: 0, zoomType: "inner", cursor: "crosshair" }),
            (Fastor.zoomImageObjects = []),
            (Fastor.zoomImage = function (e) {
                t.fn.elevateZoom &&
                    e &&
                    ("string" == typeof e ? t(e) : e).find("img").each(function () {
                        var e = t(this);
                        (Fastor.zoomImageOptions.zoomContainer = e.parent()), e.elevateZoom(Fastor.zoomImageOptions), Fastor.zoomImageObjects.push(e);
                    });
            }),
            (Fastor.zoomImageOnResize = function () {
                Fastor.zoomImageObjects.forEach(function (e) {
                    e.each(function () {
                        var e = t(this).data("elevateZoom");
                        e && e.refresh();
                    });
                });
            }),
            (Fastor.countTo = function (e) {
                t.fn.countTo &&
                    Fastor.$(e).each(function () {
                        Fastor.appear(this, function () {
                            var e = t(this);
                            setTimeout(function () {
                                e.countTo({
                                    onComplete: function () {
                                        e.addClass("complete");
                                    },
                                });
                            }, 300);
                        });
                    });
            }),
            (Fastor.countdown = function (e) {
                t.fn.countdown &&
                    Fastor.$(e).each(function () {
                        var e,
                            a = t(this),
                            i = a.data("until"),
                            n = a.data("compact"),
                            s = a.data("format") ? a.data("format") : "DHMS",
                            o = a.data("labels-short") ? ["Y", "M", "W", "D", "H", "I", "S"] : ["Years", "Months", "Weeks", "Days", "Hours", "Minutes", "Seconds"],
                            l = a.data("labels-short") ? ["Y", "M", "W", "D", "H", "I", "S"] : ["Year", "Month", "Week", "Day", "Hour", "Minute", "Second"],
                            r = i.split("-"),
                            e = new Date(r[2], r[0] - 1, r[1]),
                            d = new Date();
                        return e.setHours(0, 0, 0, 0) <= d.setHours(0, 0, 0, 0)
                            ? void a.hide()
                            : void a.countdown({
                                  until: e,
                                  compact: n,
                                  compactLabels: ["y", "m", "w", "days, "],
                                  layout:
                                      '<div class="countdown-block">{d<}{dn}<span>{dl}<span></div><div class="countdown-block">{d>}{h<}{hn}<span>{hl}<span></div><div class="countdown-block">{h>}{m<}{mn}<span>{ml}<span></div><div class="countdown-block second"> {m>}{s<}{sn}<span>{sl}<span>{s>}</div>',
                                  labels: ["Y", "M", "W", "D", "H", "Mi", "S"],
                              });
                    });
            }),
            (Fastor.isotopeOptions = { itemsSelector: ".grid-item", layoutMode: "masonry", percentPosition: !0, masonry: { columnWidth: ".grid-space" } }),
            (Fastor.isotopes = function (e, a) {
                if ("function" == typeof imagesLoaded && t.fn.isotope) {
                    var i = this;
                    Fastor.$(e).each(function () {
                        var e = t(this),
                            n = t.extend(!0, {}, i.isotopeOptions, Fastor.parseOptions(e.attr("data-grid-options")), a ? a : {});
                        e.isotope(n);
                    });
                }
            }),
            (Fastor.initNavFilter = function (e) {
                t.fn.isotope &&
                    Fastor.$(e).on("click", function (a) {
                        var e = t(this),
                            i = e.attr("data-filter"),
                            n = e.parent().parent().attr("data-target");
                        (n ? t(n) : t(".grid")).isotope({ filter: i }), e.parent().siblings().children().removeClass("active"), e.addClass("active"), a.preventDefault();
                    });
            }),
            (Fastor.parallax = function (e, a) {
                t.fn.themePluginParallax &&
                    Fastor.$(e).each(function () {
                        var e = t(this);
                        e.themePluginParallax(t.extend(!0, Fastor.parseOptions(e.attr("data-parallax-options")), a));
                    });
            }),
            (Fastor.stickyDefaultOptions = { minWidth: 992, maxWidth: 2e4, top: !1, hide: !1 }),
            (Fastor.stickyContent = function (e, a) {
                var i = Fastor.$(e),
                    n = t.extend({}, { minWidth: Fastor.minDesktopWidth, maxWidth: 2e4, top: 300, hide: !1, max_index: 1060, scrollMode: !1 }, a),
                    s = window.pageYOffset;
                if (0 != i.length) {
                    var o = function (e) {
                            var a = 0,
                                i = 0;
                            t(".sticky-content.fixed.fix-top").each(function () {
                                (a += t(this)[0].offsetHeight), i++;
                            }),
                                e.data("offset-top", a),
                                e.data("z-index", n.max_index - i);
                        },
                        l = function (e) {
                            var a = 0,
                                i = 0;
                            t(".sticky-content.fixed.fix-bottom").each(function () {
                                (a += t(this)[0].offsetHeight), i++;
                            }),
                                e.data("offset-bottom", a),
                                e.data("z-index", n.max_index - i);
                        },
                        r = function (e, t) {
                            window.innerWidth >= n.minWidth && window.innerWidth <= n.maxWidth && (e.wrap('<div class="sticky-content-wrapper"></div>'), e.parent().css("height", t + "px"), e.data("is-wrap", !0));
                        },
                        d = function () {
                            i.each(function () {
                                var e = t(this);
                                if (!e.data("is-wrap")) {
                                    var a,
                                        i = e.removeClass("fixed").outerHeight(!0);
                                    if (((a = e.offset().top + i), e.hasClass("has-dropdown"))) {
                                        var s = e.find(".category-dropdown .dropdown-box");
                                        s.length && (a += s[0].offsetHeight);
                                    }
                                    e.data("top", a), r(e, i);
                                } else (window.innerWidth < n.minWidth || window.innerWidth >= n.maxWidth) && (e.unwrap(".sticky-content-wrapper"), e.data("is-wrap", !1));
                            });
                        },
                        c = function (a) {
                            (a && !a.isTrusted) ||
                                i.each(function () {
                                    var e = t(this),
                                        a = !0;
                                    n.scrollMode && ((a = s > window.pageYOffset), (s = window.pageYOffset)),
                                        window.pageYOffset > (!1 == n.top ? e.data("top") : n.top) && window.innerWidth >= n.minWidth && window.innerWidth <= n.maxWidth
                                            ? (e.hasClass("fix-top")
                                                  ? (void 0 === e.data("offset-top") && o(e), e.css("margin-top", e.data("offset-top") + "px"))
                                                  : e.hasClass("fix-bottom") && (void 0 === e.data("offset-bottom") && l(e), e.css("margin-bottom", e.data("offset-bottom") + "px")),
                                              e.css("z-index", e.data("z-index")),
                                              n.scrollMode ? ((a && e.hasClass("fix-top")) || (!a && e.hasClass("fix-bottom")) ? e.addClass("fixed") : (e.removeClass("fixed"), e.css("margin", ""))) : e.addClass("fixed"),
                                              n.hide && e.parent(".sticky-content-wrapper").css("display", ""))
                                            : (e.removeClass("fixed"), e.css("margin-top", ""), e.css("margin-bottom", ""), n.hide && e.parent(".sticky-content-wrapper").css("display", "none"));
                                });
                        },
                        p = function () {
                            i.removeData("offset-top").removeData("offset-bottom").removeClass("fixed").css("margin", "").css("z-index", ""),
                                Fastor.call(function () {
                                    d(), c();
                                });
                        };
                    setTimeout(d, 550),
                        setTimeout(c, 600),
                        Fastor.call(function () {
                            window.addEventListener("scroll", c, { passive: !0 }), Fastor.$window.on("resize", p);
                        }, 700);
                }
            }),
            (Fastor.alert = function (e) {
                Fastor.$body.on("click", e + " .btn-close", function () {
                    t(this)
                        .closest(e)
                        .fadeOut(function () {
                            t(this).remove();
                        });
                });
            }),
            (Fastor.accordion = function (e) {
                Fastor.$body.on("click", e, function (i) {
                    var e = t(this),
                        n = e.closest(".card").find(e.attr("href")),
                        s = e.closest(".accordion");
                    i.preventDefault(),
                        0 === s.find(".collapsing").length &&
                            0 === s.find(".expanding").length &&
                            (n.hasClass("expanded")
                                ? !s.hasClass("radio-type") && a(n)
                                : n.hasClass("collapsed") &&
                                  (0 < s.find(".expanded").length
                                      ? Fastor.isIE
                                          ? a(s.find(".expanded"), function () {
                                                a(n);
                                            })
                                          : (a(s.find(".expanded")), a(n))
                                      : a(n)));
                });
                var a = function (t, a) {
                    var i = t.closest(".card").find(e);
                    t.hasClass("expanded")
                        ? (i.removeClass("collapse").addClass("expand"),
                          t.addClass("collapsing").slideUp(300, function () {
                              t.removeClass("expanded collapsing").addClass("collapsed"), a && a();
                          }))
                        : t.hasClass("collapsed") &&
                          (i.removeClass("expand").addClass("collapse"),
                          t.addClass("expanding").slideDown(300, function () {
                              t.removeClass("collapsed expanding").addClass("expanded"), a && a();
                          }));
                };
            }),
            (Fastor.tab = function () {
                Fastor.$body
                    .on("click", ".tab .nav-link", function (a) {
                        var e = t(this);
                        if ((a.preventDefault(), !e.hasClass("active"))) {
                            var i = t(e.attr("href"));
                            i.parent().find(".active").removeClass("in active"), i.addClass("active in"), e.parent().parent().find(".active").removeClass("active"), e.addClass("active");
                        }
                    })
                    .on("click", ".link-to-tab", function (a) {
                        var e = t(a.currentTarget).attr("href"),
                            i = t(e),
                            n = i.parent().siblings(".nav");
                        a.preventDefault(),
                            i.siblings().removeClass("active in"),
                            i.addClass("active in"),
                            n.find(".nav-link").removeClass("active"),
                            n.find('[href="' + e + '"]').addClass("active"),
                            t("html").animate({ scrollTop: i.offset().top - 150 });
                    });
            }),
            (Fastor.playableVideo = function (a) {
                t(a + " .video-play").on("click", function (i) {
                    var e = t(this).closest(a);
                    e.hasClass("playing") ? e.removeClass("playing").addClass("paused").find("video")[0].pause() : e.removeClass("paused").addClass("playing").find("video")[0].play(), i.preventDefault();
                }),
                    t(a + " video").on("ended", function () {
                        t(this).closest(".article-video").removeClass("playing");
                    });
            }),
            (Fastor.animationOptions = { name: "fadeIn", duration: "1.2s", delay: ".2s" }),
            (Fastor.appearAnimate = function (e, a = !1) {
                Fastor.$(e).each(function () {
                    var e = this;
                    if (!Shopify.designMode && !1 == a)
                        Fastor.appear(e, function () {
                            if (e.classList.contains("appear-animate")) {
                                var a = t.extend({}, Fastor.animationOptions, Fastor.parseOptions(e.getAttribute("data-animation-options")));
                                Fastor.call(function () {
                                    (e.style["animation-duration"] = a.duration),
                                        (e.style["animation-delay"] = a.delay),
                                        e.classList.add(a.name),
                                        setTimeout(
                                            function () {
                                                e.classList.add("appear-animation-visible");
                                            },
                                            a.delay ? 1e3 * +a.delay.slice(0, -1) + 500 * +a.duration.slice(0, -1) : 500 * +a.duration.slice(0, -1)
                                        );
                                });
                            }
                        });
                    else if (e.classList.contains("appear-animate")) {
                        var i = t.extend({}, Fastor.animationOptions, Fastor.parseOptions(e.getAttribute("data-animation-options")));
                        Fastor.call(function () {
                            (e.style["animation-duration"] = i.duration),
                                (e.style["animation-delay"] = i.delay),
                                e.classList.add(i.name),
                                setTimeout(
                                    function () {
                                        e.classList.add("appear-animation-visible");
                                    },
                                    i.delay ? 1e3 * +i.delay.slice(0, -1) + 500 * +i.duration.slice(0, -1) : 500 * +i.duration.slice(0, -1)
                                );
                        });
                    }
                });
            }),
            (Fastor.stickySidebar = function (e) {
                t.fn.themeSticky &&
                    Fastor.$(e).each(function () {
                        var e = t(this);
                        e.themeSticky(t.extend(Fastor.stickySidebarOptions, Fastor.parseOptions(e.attr("data-sticky-options")))), e.trigger("recalc.pin");
                    });
            }),
            (Fastor.stickySidebarOptions = { autoInit: !0, minWidth: 991, containerSelector: ".sticky-sidebar-wrapper", autoFit: !0, activeClass: "sticky-sidebar-fixed", top: 93, bottom: 0 }),
            (Fastor.initPopups = function () {
                t(".btn-iframe").on("click", function (a) {
                    a.preventDefault(), Fastor.popup({ items: { src: t(this).attr("href") } }, "video");
                });
            }),
            (Fastor.initScrollTopButton = function () {
                var e = Fastor.byId("scroll-top");
                if (e) {
                    e.addEventListener("click", function (a) {
                        t("html, body").animate({ scrollTop: 0 }, 600), a.preventDefault();
                    });
                    var a = function () {
                        400 < window.pageYOffset ? e.classList.add("show") : e.classList.remove("show");
                    };
                    Fastor.call(a, 500), window.addEventListener("scroll", a, { passive: !0 });
                }
            }),
            (Fastor.requestTimeout = function (e, t) {
                function a(o) {
                    n || (n = o);
                    var l = o - n;
                    l >= t ? e() : (s.val = i(a));
                }
                var i = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
                if (!i) return setTimeout(e, t);
                var n,
                    s = {};
                return (s.val = i(a)), s;
            }),
            (Fastor.requestInterval = function (e, t, a) {
                function i(r) {
                    s || (s = o = r);
                    var d = r - s,
                        c = r - o;
                    !a || d < a ? (c > t ? (e(), (l.val = n(i)), (o = r)) : (l.val = n(i))) : e();
                }
                var n = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
                if (!n) return a ? setInterval(e, t) : setTimeout(e, a);
                var s,
                    o,
                    l = {};
                return (l.val = n(i)), l;
            }),
            (Fastor.deleteTimeout = function (e) {
                if (e) {
                    var t = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame;
                    return t ? (e.val ? t(e.val) : void 0) : clearTimeout(e);
                }
            }),
            (Fastor.priceSlider = function (e, a) {
                var i = parseInt(document.querySelector(e)?.dataset.rangemin, 10),
                    n = parseInt(document.querySelector(e)?.dataset.rangemax, 10),
                    s = parseInt(document.querySelector(e)?.dataset.currmin, 10),
                    o = parseInt(document.querySelector(e)?.dataset.currmax, 10);
                "object" == typeof noUiSlider &&
                    Fastor.$(e).each(function () {
                        var l = this;
                        noUiSlider.create(l, t.extend(!0, { start: [s, o], connect: !0, step: 1, range: { min: i, max: n } }, a)),
                            l.noUiSlider.on("update", function (e) {
                                var e = e.map(function (e) {
                                    return "$" + parseInt(e);
                                });
                                t(l).parent().find(".filter-price-range").text(e.join(" - "));
                            }),
                            l.noUiSlider.on("end", function (e) {
                                var a = parseInt(e[0]),
                                    i = parseInt(e[1]);
                                t(l).parent().find(".filter-price--min").val(a), t(l).parent().find(".filter-price--max").val(i);
                            }),
                            t(l)
                                .parent()
                                .find(".price-filter-action")
                                .on("click", function () {
                                    var t = new Event("input", { bubbles: !0, cancelable: !0 });
                                    document.querySelector(e).closest("form").dispatchEvent(t);
                                });
                    });
            });
    })(jQuery),
    (function (t) {
        Fastor.menu = {
            init: function () {
                this.initMenu(), this.initCollapsibleWidget();
            },
            initMenu: function () {
                t(".menu li").each(function () {
                    this.lastElementChild && ("UL" === this.lastElementChild.tagName || this.lastElementChild.classList.contains("megamenu")) && this.classList.add("submenu");
                }),
                    Fastor.$window.on("resize", function () {
                        t(".main-nav .megamenu").each(function () {
                            var e = t(this),
                                a = e.offset().left,
                                i = e.outerWidth(),
                                n = a + i - (window.innerWidth - 20);
                            0 < n && 20 < a && e.css("margin-left", -n);
                        });
                    });
            },
            initFilterMenu: function () {
                t(".search-ul li").each(function () {
                    if (this.lastElementChild && "UL" === this.lastElementChild.tagName) {
                        var e = document.createElement("i");
                        (e.className = "fas fa-chevron-down"), this.classList.add("with-ul"), this.firstElementChild.appendChild(e);
                    }
                }),
                    t(".with-ul > a i").on("click", function (a) {
                        t(this).parent().next().slideToggle(300).parent().toggleClass("show"), a.preventDefault();
                    });
            },
            initCategoryMenu: function () {
                var e = t(".category-dropdown");
                if (e.length) {
                    var a = e.find(".dropdown-box");
                    if (a.length) {
                        var i = t(".main").offset().top + a[0].offsetHeight;
                        (window.pageYOffset > i || 992 > window.innerWidth) && e.removeClass("show"),
                            window.addEventListener(
                                "scroll",
                                function () {
                                    window.pageYOffset <= i && 992 <= window.innerWidth && e.removeClass("show");
                                },
                                { passive: !0 }
                            ),
                            t(".category-toggle").on("click", function (t) {
                                t.preventDefault();
                            }),
                            e.on("mouseover", function () {
                                window.pageYOffset > i && 992 <= window.innerWidth && e.addClass("show");
                            }),
                            e.on("mouseleave", function () {
                                window.pageYOffset > i && 992 <= window.innerWidth && e.removeClass("show");
                            });
                    }
                    if (e.hasClass("with-sidebar")) {
                        var n = Fastor.byClass("sidebar");
                        n.length &&
                            (e.find(".dropdown-box").css("width", n[0].offsetWidth - 20),
                            Fastor.$window.on("resize", function () {
                                e.find(".dropdown-box").css("width", n[0].offsetWidth - 20);
                            }));
                    }
                }
            },
            initCollapsibleWidget: function () {
                t(".widget-collapsible .widget-title").each(function () {
                    if (!t(this).find("span").length) {
                        var e = document.createElement("span");
                        (e.className = "toggle-btn"), this.appendChild(e);
                    }
                }),
                    t(".widget-collapsible .widget-title")
                        .off("click")
                        .on("click", function () {
                            var e = t(this),
                                a = e.siblings(".widget-body");
                            e.hasClass("collapsed") || a.css("display", "block"), a.stop().slideToggle(300), e.toggleClass("collapsed");
                        });
            },
        };
    })(jQuery);
function Popup(e, t) {
    return this.init(e, t);
}
(function (e) {
    "use strict";
    (Popup.defaults = {
        removalDelay: 350,
        callbacks: {
            open: function () {
                e("html").css("overflow-y", "hidden"), e("body").css("overflow-x", "visible"), e(".mfp-wrap").css("overflow", "hidden auto"), e(".sticky-header.fixed").css("padding-right", window.innerWidth - document.body.clientWidth);
            },
            close: function () {
                e("html").css("overflow-y", ""), e("body").css("overflow-x", "hidden"), e(".mfp-wrap").css("overflow", ""), e(".sticky-header.fixed").css("padding-right", "");
            },
        },
    }),
        (Popup.presets = {
            login: { type: "ajax", mainClass: "mfp-login mfp-fade", tLoading: "", preloader: !1 },
            video: { type: "iframe", mainClass: "mfp-fade", preloader: !1, closeBtnInside: !1 },
            quickview: { type: "ajax", mainClass: "mfp-product mfp-fade", tLoading: "", preloader: !1 },
        }),
        (Popup.prototype.init = function (t, a) {
            var i = e.magnificPopup.instance;
            i.isOpen && i.content && !i.content.hasClass("login-popup")
                ? (i.close(),
                  setTimeout(function () {
                      e.magnificPopup.open(e.extend(!0, {}, Popup.defaults, a ? Popup.presets[a] : {}, t));
                  }, 500))
                : e.magnificPopup.open(e.extend(!0, {}, Popup.defaults, a ? Popup.presets[a] : {}, t));
        }),
        (Fastor.popup = function (e, t) {
            return new Popup(e, t);
        });
})(jQuery);
function Sidebar(e) {
    return this.init(e);
}
(function (t) {
    "use strict";
    var e = function () {
        992 > window.innerWidth &&
            (this.$sidebar.find(".sidebar-content, .filter-clean").removeAttr("style"), this.$sidebar.find(".sidebar-content").attr("style", ""), this.$sidebar.siblings(".toolbox").children(":not(:first-child)").removeAttr("style"));
    };
    (Sidebar.prototype.init = function (a) {
        var i = this;
        return (
            (i.name = a),
            (i.$sidebar = t("." + a)),
            (i.isNavigation = !1),
            i.$sidebar.length &&
                ((i.isNavigation = i.$sidebar.hasClass("sidebar-fixed") && i.$sidebar.parent().hasClass("toolbox-wrap")),
                i.isNavigation && ((e = e.bind(this)), Fastor.$window.on("resize", e)),
                Fastor.$window.on("resize", function () {
                    Fastor.$body.removeClass(a + "-active");
                }),
                i.$sidebar
                    .find(".sidebar-toggle, .sidebar-toggle-btn")
                    .add("sidebar" === a ? ".left-sidebar-toggle" : "." + a + "-toggle")
                    .on("click", function (a) {
                        i.toggle(), t(this).blur(), a.preventDefault();
                    }),
                i.$sidebar.find(".sidebar-overlay, .sidebar-close").on("click", function (t) {
                    Fastor.$body.removeClass(a + "-active"), t.preventDefault();
                })),
            !1
        );
    }),
        (Sidebar.prototype.toggle = function () {
            var e = Math.max,
                a = this;
            if (992 <= window.innerWidth && a.$sidebar.hasClass("sidebar-fixed")) {
                var i = a.$sidebar.hasClass("closed");
                if (
                    (a.isNavigation &&
                        (i || a.$sidebar.find(".filter-clean").hide(),
                        a.$sidebar.siblings(".toolbox").children(":not(:first-child)").fadeToggle("fast"),
                        a.$sidebar
                            .find(".sidebar-content")
                            .stop()
                            .animate({ height: "toggle", "margin-bottom": i ? "toggle" : -6 }, function () {
                                t(this).css("margin-bottom", ""), i && a.$sidebar.find(".filter-clean").fadeIn("fast");
                            })),
                    a.$sidebar.hasClass("shop-sidebar"))
                ) {
                    var n = t(".main-content .product-wrapper");
                    if (n.length)
                        if (n.hasClass("product-lists")) n.toggleClass("row cols-xl-2", !i);
                        else {
                            var s = n.data("toggle-cols"),
                                o = n.attr("class").match(/cols-\w*-*\d/g),
                                l = o
                                    ? e.apply(
                                          null,
                                          o.map(function (e) {
                                              return e.match(/\d/)[0];
                                          })
                                      )
                                    : 0;
                            i
                                ? (4 === l && 3 == s && n.removeClass("cols-md-4"), t(".btn-layout").removeClass("active"), t(".btn-layout[data-value='grid-3']").addClass("active"))
                                : 3 === l && (n.addClass("cols-md-4"), t(".btn-layout").removeClass("active"), t(".btn-layout[data-value='grid-4']").addClass("active"), !s && n.data("toggle-cols", 3));
                        }
                }
                a.$sidebar.toggleClass("closed");
            } else
                a.$sidebar.find(".sidebar-overlay .sidebar-close").css("margin-left", -(window.innerWidth - document.body.clientWidth)),
                    Fastor.$body.toggleClass(a.name + "-active").removeClass("closed"),
                    1200 <= window.innerWidth && Fastor.$body.hasClass("with-flex-container") && t(".owl-carousel").trigger("refresh.owl.carousel");
        }),
        (Fastor.sidebar = function (e) {
            return new Sidebar().init(e);
        });
})(jQuery),
    (function (e) {
        "use strict";
        var t,
            a = 0,
            i = [],
            n = [],
            s = !1,
            o = !1,
            l = function () {
                if (!s) for (var e = 0; e < n.length; ++e) 0 >= (n[e] -= 200) && this.close(e--);
            };
        Fastor.notifpopup = {
            space: 20,
            defaults: {
                message: "",
                productClass: "",
                imageSrc: "",
                imageLink: "#",
                name: "",
                nameLink: "#",
                price: "",
                count: null,
                rating: null,
                delay: 4e3,
                priceTemplate: '<span class="product-price">{{price}}</span>',
                ratingTemplate: '<div class="ratings-wrapper"><div class="ratings-full"><span class="ratings" style="width:{{rating}}"></span><span class="tooltiptext tooltip-top"></span></div></div>',
                priceQuantityTemplate: '<div class="price-box"><span class="product-quantity">{{count}}</span><span class="product-price">{{price}}</span></div>',
                template:
                    '<div class="notifpopup-box"><p class="notifpopup-title border-none bg-light">{{message}}</p><div class="product {{productClass}}"><figure class="product-visual"><a href="{{imageLink}}"><img src="{{imageSrc}}" alt="{{imageAlt}}" width="90" height="90"></a></figure><div class="product-detail ml-4"><a href="{{nameLink}}" class="product-name">{{name}}</a><div class="product-variant">{{productDetails}}</div><div class="product-price">{{price}}</div></div></div></div>',
            },
            init: function () {
                var a = document.createElement("div");
                (a.className = "notifpopup-realm"),
                    Fastor.byClass("page-wrapper")[0].appendChild(a),
                    (t = e(a)),
                    t.on("click", ".btn-close", function () {
                        self.close(e(this).closest(".notifpopup-box").index());
                    }),
                    (this.close = this.close.bind(this)),
                    (l = l.bind(this));
            },
            open: function (s, r) {
                var d,
                    c = this,
                    p = e.extend(!0, {}, c.defaults, s);
                (p.detailTemplate = Fastor.parseTemplate(null == p.count ? p.priceTemplate : p.priceQuantityTemplate, p)),
                    null != p.rating && (p.detailTemplate += Fastor.parseTemplate(p.ratingTemplate, p)),
                    (d = e(Fastor.parseTemplate(p.template, p))),
                    (d.appendTo(t).css("top", -a).find("img")[0].onload = function () {
                        (a += d[0].offsetHeight + c.space),
                            d.addClass("show"),
                            0 > d.offset().top - window.pageYOffset && (c.close(), d.css("top", -a + d[0].offsetHeight + c.space)),
                            d.on("mouseenter", function () {
                                c.pause();
                            }),
                            d.on("mouseleave", function () {
                                c.resume();
                            }),
                            d.on("touchstart", function (t) {
                                c.pause(), t.stopPropagation();
                            }),
                            Fastor.$body.on("touchstart", function () {
                                c.resume();
                            }),
                            i.push(d),
                            n.push(p.delay),
                            1 < n.length || (o = setInterval(l, 200)),
                            r && r(d);
                    });
            },
            close: function (e) {
                var t = this,
                    s = "undefined" == typeof e ? 0 : e,
                    l = i.splice(s, 1)[0];
                n.splice(s, 1)[0],
                    (a -= l[0].offsetHeight + t.space),
                    l.removeClass("show"),
                    setTimeout(function () {
                        l.remove();
                    }, 300),
                    i.forEach(function (e, t) {
                        t >= s && e.hasClass("show") && e.stop(!0, !0).animate({ top: parseInt(e.css("top")) + e[0].offsetHeight + 20 }, 600, "easeOutQuint");
                    }),
                    i.length || clearTimeout(o);
            },
            pause: function () {
                s = !0;
            },
            resume: function () {
                s = !1;
            },
        };
    })(jQuery),
    (function (t) {
        var e = function () {
            Fastor.$body
                .on("click", ".cart-offcanvas .cart-toggle", function (a) {
                    t(".cart-dropdown").addClass("opened"), a.preventDefault();
                })
                .on("click", ".cart-offcanvas .cart-header .btn-close", function (a) {
                    t(".cart-dropdown").removeClass("opened"), a.preventDefault();
                })
                .on("click", ".cart-offcanvas .cart-overlay", function (a) {
                    t(".cart-dropdown").removeClass("opened"), a.preventDefault();
                });
        };
        Fastor.shop = {
            init: function () {
                this.initProductType("slideup"), this.initVariation();
            },
            initVariation: function () {
                t(".product:not(.product-single) .product-variations > a").on("click", function (a) {
                    var e = t(this),
                        i = e.closest(".product").find(".product-visual img");
                    i.data("image-src") || i.data("image-src", i.attr("src")),
                        e.toggleClass("active").siblings().removeClass("active"),
                        e.hasClass("active") ? i.attr("src", e.data("src")) : (i.attr("src", i.data("image-src")), e.blur()),
                        a.preventDefault();
                });
            },
            initProductType: function (e) {
                "slideup" === e &&
                    (t(".product-slideup-content .product-details").each(function () {
                        var e = t(this),
                            a = e.find(".product-hide-details").outerHeight(!0);
                        e.height(e.height() - a);
                    }),
                    t(Fastor.byClass("product-slideup-content"))
                        .on("mouseenter touchstart", function () {
                            var e = t(this),
                                a = e.find(".product-hide-details").outerHeight(!0);
                            e.find(".product-details").css("transform", "translateY(" + -a + "px)"), e.find(".product-hide-details").css("transform", "translateY(" + -a + "px)");
                        })
                        .on("mouseleave touchleave", function () {
                            var e = t(this),
                                a = e.find(".product-hide-details").outerHeight(!0);
                            e.find(".product-details").css("transform", "translateY(0)"), e.find(".product-hide-details").css("transform", "translateY(0)");
                        }));
            },
            cartProducts: {
                productList: [
                    { name: "Daisy Shoes Sonia by Sonia Rykiel - Blue, Large", image: "images/cart/product-1.jpg", price: 21, qty: 1 },
                    { name: "Fashionable Blue Leather Shoes", image: "images/cart/product-2.jpg", price: 21, qty: 1 },
                ],
                total: 42,
            },
            initCartSidebar: function () {
                e();
            },
        };
    })(jQuery);
function Slider(e, t) {
    return this.init(e, t);
}
(function (t) {
    var e = function () {
            var e,
                t,
                a = ["", "-xs", "-sm", "-md", "-lg", "-xl"];
            for (this.classList.remove("row"), e = 0; 6 > e; ++e) for (t = 1; 12 >= t; ++t) this.classList.remove("cols" + a[e] + "-" + t);
            if ((this.classList.remove("gutter-no"), this.classList.remove("gutter-sm"), this.classList.remove("gutter-lg"), this.classList.contains("animation-slider")))
                for (var n = this.children, s = n.length, e = 0; e < s; ++e) n[e].setAttribute("data-index", e + 1);
        },
        a = function (a) {
            var e,
                n = this.firstElementChild.firstElementChild.children,
                s = n.length;
            for (e = 0; e < s; ++e)
                if (!n[e].classList.contains("active")) {
                    var o,
                        l = Fastor.byClass("appear-animate", n[e]);
                    for (o = l.length - 1; 0 <= o; --o) l[o].classList.remove("appear-animate");
                }
            var r = t(a.currentTarget);
            r.find("video").on("ended", function () {
                var e = t(this);
                e.closest(".owl-item").hasClass("active") &&
                    (!0 === r.data("owl.carousel").options.autoplay
                        ? (!1 === r.data("owl.carousel").options.loop && r.data().children - 1 === r.find(".owl-item.active").index() && ((this.loop = !0), this.play()), r.trigger("next.owl.carousel"), r.trigger("play.owl.autoplay"))
                        : ((this.loop = !0), this.play()));
            });
        },
        i = function (a) {
            t(window).trigger("appear.check");
            var e = t(a.currentTarget),
                i = e.find(".owl-item.active video");
            e.find(".owl-item:not(.active) video").each(function () {
                this.paused || e.trigger("play.owl.autoplay"), this.pause(), (this.currentTime = 0);
            }),
                i.length &&
                    (!0 === e.data("owl.carousel").options.autoplay && e.trigger("stop.owl.autoplay"),
                    i.each(function () {
                        this.paused && this.play();
                    }));
        },
        n = function (a) {
            var e = this,
                i = t(a.currentTarget);
            i.find(".owl-item.active .slide-animate").each(function () {
                var a = t(this),
                    i = t.extend(!0, {}, Fastor.animationOptions, Fastor.parseOptions(a.data("animation-options"))),
                    n = i.duration,
                    s = i.delay,
                    o = i.name;
                setTimeout(function () {
                    if ((a.css("animation-duration", n), a.css("animation-delay", s), a.addClass(o), a.hasClass("maskLeft"))) {
                        a.css("width", "fit-content");
                        var t = a.width();
                        a.css("width", 0).css("transition", "width " + (n ? n : "0.75s") + " linear " + (s ? s : "0s")), a.css("width", t);
                    }
                    n = n ? n : "0.75s";
                    var i = Fastor.requestTimeout(
                        function () {
                            a.addClass("show-content");
                        },
                        s ? 1e3 * +s.slice(0, -1) + 200 : 200
                    );
                    e.timers.push(i);
                }, 300);
            });
        },
        s = function (a) {
            t(a.currentTarget)
                .find(".owl-item.active .slide-animate")
                .each(function () {
                    var e = t(this);
                    e.addClass("show-content"), e.attr("style", "");
                });
        },
        o = function (a) {
            var e = this,
                i = t(a.currentTarget);
            (e.translateFlag = 1),
                (e.prev = e.next),
                i.find(".owl-item .slide-animate").each(function () {
                    var e = t(this),
                        a = t.extend(!0, {}, Fastor.animationOptions, Fastor.parseOptions(e.data("animation-options")));
                    e.removeClass(a.name);
                });
        },
        l = function (a) {
            var e = this,
                n = t(a.currentTarget);
            if (1 == e.translateFlag) {
                if (((e.next = n.find(".owl-item").eq(a.item.index).children().attr("data-index")), n.find(".show-content").removeClass("show-content"), e.prev != e.next)) {
                    if ((n.find(".show-content").removeClass("show-content"), n.hasClass("animation-slider"))) {
                        for (var s = 0; s < e.timers.length; s++) Fastor.deleteTimeout(e.timers[s]);
                        e.timers = [];
                    }
                    n.find(".owl-item.active .slide-animate").each(function () {
                        var a = t(this),
                            i = t.extend(!0, {}, Fastor.animationOptions, Fastor.parseOptions(a.data("animation-options"))),
                            n = i.duration,
                            s = i.delay,
                            o = i.name;
                        if ((a.css("animation-duration", n), a.css("animation-delay", s), a.addClass(o), a.hasClass("maskLeft"))) {
                            a.css("width", "fit-content");
                            var l = a.width();
                            a.css("width", 0).css("transition", "width " + (n ? n : "0.75s") + " linear " + (s ? s : "0s")), a.css("width", l);
                        }
                        n = n ? n : "0.75s";
                        var r = Fastor.requestTimeout(
                            function () {
                                a.addClass("show-content"), e.timers.splice(e.timers.indexOf(r), 1);
                            },
                            s ? 1e3 * +s.slice(0, -1) + 500 * +n.slice(0, -1) : 500 * +n.slice(0, -1)
                        );
                        e.timers.push(r);
                    });
                } else n.find(".owl-item").eq(a.item.index).find(".slide-animate").addClass("show-content");
                e.translateFlag = 0;
            }
            t(window).trigger("appear.check");
        };
    (Slider.defaults = {
        autoHeight: !0,
        responsiveClass: !0,
        navText: ['<i class="icon-angle-left">', '<i class="icon-angle-right">'],
        checkVisible: !1,
        items: 1,
        smartSpeed: -1 < navigator.userAgent.indexOf("Edge") ? 200 : 700,
        autoplaySpeed: -1 < navigator.userAgent.indexOf("Edge") ? 200 : 1e3,
        autoplayTimeout: 1e4,
    }),
        (Slider.zoomImage = function () {
            Fastor.zoomImage(this.$element);
        }),
        (Slider.zoomImageRefresh = function () {
            this.$element.find("img").each(function () {
                var e = t(this);
                if (t.fn.elevateZoom) {
                    var a = e.data("elevateZoom");
                    "undefined" == typeof a ? ((Fastor.zoomImageOptions.zoomContainer = e.parent()), e.elevateZoom(Fastor.zoomImageOptions)) : a.refresh();
                }
            });
        }),
        (Slider.presets = { "intro-slider": { animateIn: "fadeIn", animateOut: "fadeOut" }, "product-single-carousel": { dots: !1, nav: !0, onInitialized: Slider.zoomImage, onRefreshed: Slider.zoomImageRefresh } }),
        (Slider.addPreset = function (e, t) {
            return (this.presets[e] = t), this;
        }),
        (Slider.prototype.init = function (r, d) {
            (this.timers = []), (this.translateFlag = 0), (this.prev = 1), (this.next = 1);
            var c = this,
                p = r.attr("class").split(" "),
                m = t.extend(!0, {}, Slider.defaults);
            p.forEach(function (e) {
                var a = Slider.presets[e];
                a && t.extend(!0, m, a);
            });
            var u = r.find("video");
            u.each(function () {
                this.loop = !1;
            }),
                t.extend(!0, m, Fastor.parseOptions(r.attr("data-owl-options")), d),
                (n = n.bind(this)),
                (o = o.bind(this)),
                (l = l.bind(this)),
                r.on("initialize.owl.carousel", e).on("initialized.owl.carousel", a).on("translated.owl.carousel", i),
                r.hasClass("animation-slider") && r.on("initialized.owl.carousel", n).on("resized.owl.carousel", s).on("translate.owl.carousel", o).on("translated.owl.carousel", l),
                r.owlCarousel(m);
        }),
        (Fastor.slider = function (e, a) {
            Fastor.$(e).each(function () {
                var e = t(this);
                Fastor.call(function () {
                    new Slider(e, a);
                });
            });
        });
})(jQuery),
    (function (e) {
        (window.Fastor = window.Fastor || {}),
            (Fastor.HeaderSection = (function () {
                return function (e) {
                    var t = e.dataset.sectionId;
                    (this.container = e), (this.sectionNamspace = "#" + t), this._init();
                };
            })()),
            (Fastor.HeaderSection.prototype = Object.assign({}, Fastor.HeaderSection.prototype, {
                _init: function () {
                    Fastor.menu.init(),
                        Fastor.menu.initCategoryMenu(),
                        document.querySelectorAll("[data-predictive-search-open-drawer], [data-predictive-search-start], [data-predictive-search-mobile-start]").forEach((e) => {
                            e.onclick = function (t) {
                                if (0 == theme.libs.psearch.state) {
                                    t.preventDefault();
                                    let a = loadScriptAsync(theme.libs.psearch);
                                    a.then(function () {
                                        e.dispatchEvent(new Event("click"));
                                    });
                                }
                            };
                        }),
                        Fastor.shop.initCartSidebar();
                },
                onUnload: function () {
                    1 == theme.libs.psearch.state && theme.Search.unload();
                },
                onBlockSelect: function () {},
                onBlockDeselect: function () {},
            })),
            (window.Fastor = window.Fastor || {}),
            (Fastor.SlideshowSection = (function () {
                return function (e) {
                    var t = (this.sectionId = e.dataset.sectionId);
                    (this.container = e), (this.sectionNamspace = "#shopify-section-" + t), this._init();
                };
            })()),
            (Fastor.SlideshowSection.prototype = Object.assign({}, Fastor.SlideshowSection.prototype, {
                _init: function () {
                    Fastor.appearAnimate(".appear-animate"), Fastor.slider(this.sectionNamspace + " .owl-carousel");
                },
                onUnload: function () {},
                onBlockSelect: function (t) {
                    var a = this.container.querySelector(".slideshow__slide--" + t.detail.blockId),
                        i = a.getAttribute("data-slider-slide-index"),
                        n = this;
                    Fastor.call(function () {
                        e("#slider-" + n.sectionId).trigger("to.owl.carousel", i);
                    }, 500);
                },
                onBlockDeselect: function () {},
            })),
            (window.Fastor = window.Fastor || {}),
            (Fastor.CategoriesListSection = (function () {
                return function (e) {
                    var t = (this.sectionId = e.dataset.sectionId);
                    (this.container = e), (this.sectionNamspace = "#" + t), this._init();
                };
            })()),
            (Fastor.CategoriesListSection.prototype = Object.assign({}, Fastor.CategoriesListSection.prototype, {
                _init: function () {
                    Fastor.appearAnimate(".appear-animate");
                },
                onUnload: function () {},
                onBlockSelect: function () {},
                onBlockDeselect: function () {},
            })),
            (window.Fastor = window.Fastor || {}),
            (Fastor.ProductsListSection = (function () {
                return function (e) {
                    var t = (this.sectionId = e.dataset.sectionId);
                    (this.container = e), (this.sectionNamspace = "#" + t), this._init();
                };
            })()),
            (Fastor.ProductsListSection.prototype = Object.assign({}, Fastor.ProductsListSection.prototype, {
                _init: function () {
                    Fastor.appearAnimate(".appear-animate"), Fastor.slider(this.sectionNamspace + " .owl-carousel");
                },
                onUnload: function () {},
                onBlockSelect: function () {},
                onBlockDeselect: function () {},
            })),
            (window.Fastor = window.Fastor || {}),
            (Fastor.BannerSection = (function () {
                return function (e) {
                    var t = (this.sectionId = e.dataset.sectionId);
                    (this.container = e), (this.sectionNamspace = "#" + t), this._init();
                };
            })()),
            (Fastor.BannerSection.prototype = Object.assign({}, Fastor.BannerSection.prototype, {
                _init: function () {
                    Fastor.appearAnimate(".appear-animate"),
                        e(this.sectionNamspace).hasClass("parallax") && Fastor.parallax(this.sectionNamspace),
                        Fastor.parallax(this.sectionNamspace + " .parallax"),
                        Fastor.slider(this.sectionNamspace + " .owl-carousel");
                },
                onUnload: function () {},
                onBlockSelect: function () {},
                onBlockDeselect: function () {},
            })),
            (window.Fastor = window.Fastor || {}),
            (Fastor.MobileMenuSection = (function () {
                return function (e) {
                    var t = (this.sectionId = e.dataset.sectionId);
                    (this.container = e), (this.sectionNamspace = "#" + t), (this.menuNamspace = "#mm-" + t), this._init();
                };
            })()),
            (Fastor.MobileMenuSection.prototype = Object.assign({}, Fastor.MobileMenuSection.prototype, {
                _init: function () {
                    if(document.querySelector('[data-menu-mobile]') ==  null) {
                        return;
                    }
                    const e = new MmenuLight(document.querySelector(this.menuNamspace), "(max-width: 991px)"),
                        t = e.navigation(),
                        a = e.offcanvas();
                    document.querySelector("a[href='" + this.menuNamspace + "']").addEventListener("click", (e) => (e.preventDefault(), document.querySelector("body.mm-ocd-opened") ? void a.close() : void a.open())),
                        document.querySelector("[data-mobile-menu-toggle]").addEventListener("click", () => {
                            document.querySelector(".sticky-footer").classList.add("fixed"), a.open();
                        });
                },
                onSelect: function () {
                    Shopify.designMode;
                },
                onDeselect: function () {
                    Shopify.designMode;
                },
                onUnload: function () {},
                onBlockSelect: function () {},
                onBlockDeselect: function () {},
            }));
    })(jQuery),
    (function () {
        (Fastor.prepare = function () {
            Fastor.$body.hasClass("with-flex-container") && 1200 <= window.innerWidth && Fastor.$body.addClass("sidebar-active");
        }),
            (Fastor.initLayout = function () {
                Fastor.isotopes(".grid:not(.grid-float)"), Fastor.stickySidebar(".sticky-sidebar");
            }),
            (Fastor.init = function () {
                Fastor.appearAnimate(".appear-animate"),
                    Fastor.notifpopup.init(),
                    Fastor.shop.init(),
                    Fastor.slider(".owl-carousel:not(.owl-loaded)"),
                    Fastor.stickyContent(".sticky-content"),
                    Fastor.stickyContent(".sticky-footer", { minWidth: 0, maxWidth: 991, top: 150, hide: !1, scrollMode: !1 }),
                    Fastor.sidebar("right-sidebar"),
                    Fastor.playableVideo(".article-video"),
                    Fastor.accordion(".card-header > a"),
                    Fastor.tab(".nav-tabs"),
                    Fastor.alert(".alert"),
                    Fastor.countTo(".count-to"),
                    Fastor.countdown(".product-countdown, .countdown"),
                    Fastor.initNavFilter(".nav-filters .nav-filter"),
                    Fastor.initPopups(),
                    Fastor.initScrollTopButton(),
                    Fastor.$window.on("resize", Fastor.onResize);
            }),
            (Fastor.initSections = function () {
                var e = new Fastor.Sections();
                e.register("header-section", Fastor.HeaderSection),
                    e.register("slideshow-section", Fastor.SlideshowSection),
                    e.register("categories-list-section", Fastor.CategoriesListSection),
                    e.register("products-list-section", Fastor.ProductsListSection),
                    e.register("three-banners-section", Fastor.BannerSection),
                    e.register("parallax-banner-section", Fastor.BannerSection),
                    e.register("our-clients-section", Fastor.BannerSection),
                    e.register("articles-list-section", Fastor.BannerSection),
                    e.register("vertical-products-list-section", Fastor.BannerSection),
                    e.register("footer-section", Fastor.BannerSection),
                    e.register("collection-template", Fastor.Filters),
                    e.register("mobile-menu", Fastor.MobileMenuSection),
                    e.register("icon-categories-list-section", Fastor.BannerSection),
                    e.register("single-banner-section", Fastor.BannerSection),
                    e.register("benefits-section", Fastor.BannerSection),
                    e.register("images-feed-section", Fastor.BannerSection),
                    e.register("banners-section", Fastor.BannerSection),
                    e.register("banners-2cols-section", Fastor.BannerSection),
                    e.register("vertical-menus-section", Fastor.BannerSection),
                    e.register("double-floating-banner-section", Fastor.BannerSection),
                    e.register("triple-floating-banner-section", Fastor.BannerSection),
                    e.register("newsletter-section", Fastor.BannerSection),
                    e.register("slideshow-floating-section", Fastor.SlideshowSection),
                    e.register("circle-categories-list-section", Fastor.BannerSection),
                    e.register("products-tabs-section", Fastor.BannerSection);
            }),
            (Fastor.onResize = function () {
                Fastor.zoomImageOnResize();
            });
    })(jQuery),
    (function () {
        "use strict";
        Fastor.prepare(),
            (document.onreadystatechange = function () {
                "complete" === document.readyState;
            }),
            (window.onload = function () {
                (Fastor.status = "loaded"), document.body.classList.add("loaded"), (Fastor.status = "complete"), Fastor.call(Fastor.initLayout), Fastor.call(Fastor.init), Fastor.call(Fastor.initSections);
            });
    })(jQuery),
    jQuery.extend(jQuery.easing, {
        def: "easeOutQuad",
        swing: function (e, a, t, i, n) {
            return jQuery.easing[jQuery.easing.def](e, a, t, i, n);
        },
        easeOutQuad: function (e, a, i, n, s) {
            return -n * (a /= s) * (a - 2) + i;
        },
        easeInOutQuart: function (e, a, i, n, s) {
            return 1 > (a /= s / 2) ? (n / 2) * a * a * a * a + i : (-n / 2) * ((a -= 2) * a * a * a - 2) + i;
        },
        easeOutQuint: function (e, a, i, n, s) {
            return n * ((a = a / s - 1) * a * a * a * a + 1) + i;
        },
    });
