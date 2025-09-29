const on = (e, t, a, i) => {
   const r = document.querySelectorAll(e);
   r.forEach(function (e) {
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
               var r = Object.assign(new t(e), { id: a, type: i, container: e });
               this.instances.push(r);
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
       var e = Math.floor;
       function t(e) {
           (this.$container = e),
               this._refresh(),
               on(this.containerSelect, "change", a.sortSelection, this._onSortChangeAjax.bind(this)),
               on(this.containerSelect, "change", a.limitSelection, this._onLimitChangeAjax.bind(this)),
               on(this.containerSelect, "input", a.filterForm, this._onFilterFormChangeAjax.bind(this)),
               on(this.containerSelect, "click", a.layoutChoice, this._onLayoutChangeAjax.bind(this)),
               on(this.containerSelect, "click", a.paginationPage, this._onPagingAjax.bind(this)),
               this._initInfiniteAjax(),
               this._initHorizontalFilter(),
               this._initParams();
       }
       var a = {
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
           i = { indropdownFilterTemplate: "indropdown-filter-collection", indropdownFilterToggle: "opened", indropdownFilterItems: "filter-items", indropdownSelectMenu: "select-menu" },
           r = { filterChoices: "data-filter-choice" };
       return (
           (t.prototype = Object.assign({}, t.prototype, {
               _refresh: function () {
                   (this.collectionHandle = this.$container.dataset.collectionHandle),
                       (this.containerSelect = "#" + this.$container.id),
                       (this.filterChoices = this.$container.querySelectorAll(a.filterChoice)),
                       (this.sortSelect = this.$container.querySelector(a.sortSelection)),
                       (this.limitSelect = this.$container.querySelector(a.limitSelection)),
                       (this.layoutChoices = this.$container.querySelectorAll(a.layoutChoice)),
                       (this.indropdownSelectMenu = this.$container.querySelector(a.indropdownSelectMenu)),
                       (this.infiniteAjaxWrapperSelector = a.infiniteAjaxSign),
                       (this.productsWrapperSelector = a.productsWrapper),
                       (this.indropdownFilterToggleSelector = a.indropdownFilterToggle),
                       (this.indropdownFilterTemplateClass = i.indropdownFilterTemplate),
                       (this.indropdownFilterToggleClass = i.indropdownFilterToggle),
                       (this.indropdownSelectMenuClass = i.indropdownSelectMenu),
                       (this.filterChoicesAttr = r.filterChoices),
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
                                       var r = $(e).find(a.productsWrapperSelector).children();
                                       $(t).attr("data-next-url", $(e).find(a.productsWrapperSelector).attr("data-next-url")),
                                           $(t).next().hasClass("load-more-overlay") ? $(t).next().addClass("loading") : $('<div class="pb-6 load-more-overlay loading"></div>').insertAfter($(t)),
                                           setTimeout(function () {
                                               $(t).next().removeClass("loading"),
                                                   $(t).append(r),
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
                                       r = i.querySelector(this.containerSelect);
                                   this.$container.classList.add("loaded"), (this.$container.innerHTML = r.innerHTML);
                                   var o = this.$container.querySelector(".main-content-wrap");
                                   history.pushState({}, null, e), this._refresh(), Fastor.ProductItems.init(), null != o && $("html, body").animate({ scrollTop: o.offsetTop - 50 }, 1e3);
                                    // LAI review app
                                   if(typeof SMARTIFYAPPS!== 'undefined' && SMARTIFYAPPS.rv.installed){
                                    SMARTIFYAPPS.rv.scmReviewsRate.actionCreateReviews();
                                }
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
                   var t = e.target.closest(a.filterChoice),
                       i = "/collections/" + this.collectionHandle;
                   this.queryParams.delete("page");
                   var r = ["sort_by", "view", "lo", "token", "limit"],
                       o = [];
                   for (var s of this.queryParams.entries()) 0 > r.indexOf(s[0]) && o.push(s[0]);
                   o.forEach((e) => this.queryParams.delete(e));
                   var n = new FormData(e.target.closest("form"));
                   for (var s of n.entries()) this.queryParams.append(s[0], s[1]);
                   var l = decodeURIComponent(new URLSearchParams(this.queryParams).toString());
                   "LI" == t?.parentNode.tagName && t?.parentNode.classList.toggle("active"),
                       this.$container.classList.contains(this.indropdownFilterTemplateClass) &&
                           $(t)
                               ?.parents("." + this.indropdownSelectMenuClass)
                               .toggleClass(this.indropdownFilterToggleClass);
                   this._ajaxCall(i + "?" + l);
               },
               _onLayoutChangeAjax: function (t) {
                   var a = t.target;
                   if (a.classList.contains("active")) return !1;
                   this.queryParams.set("lo", a.dataset.value), this.queryParams.set("token", e(Math.random() * e(1e3)));
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
                       r = i[1];
                   (i = r.split("&")), (r = i[0]), this.queryParams.set("page", r), this._ajaxCall(a);
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
           t
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
               for (var t, a = e + "=", r = document.cookie.split(";"), o = 0; o < r.length; ++o) {
                   for (t = r[o]; " " == t.charAt(0); ) t = t.substring(1);
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
           r,
           s,
           n,
           l,
           d,
           c,
           p = [],
           u = !1,
           m = function () {
               for (var a = p.length; a--; )
                   (e = p[a]),
                       (t = window.pageXOffset),
                       (r = window.pageYOffset),
                       (s = e.el.getBoundingClientRect()),
                       (n = s.left + t),
                       (l = s.top + r),
                       (d = e.options.accX),
                       (c = e.options.accY),
                       l + s.height + c >= r && l <= r + window.innerHeight + c && n + s.width + d >= t && n <= t + window.innerWidth + d && (e.fn.call(e.el, e.data), p.splice(a, 1));
           };
       (Fastor.appear = function (e, t, a) {
           var i = { data: void 0, accX: 0, accY: 0 };
           a && (a.data && (i.data = a.data), a.accX && (i.accX = a.accX), a.accY && (i.accY = a.accY)), p.push({ el: e, fn: t, options: i }), u || (u = Fastor.requestTimeout(m, 100));
       }),
           window.addEventListener("scroll", m, { passive: !0 }),
           window.addEventListener("resize", m, { passive: !0 }),
           $(window).on("appear.check", m);
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
                           r = a.data("compact"),
                           o = a.data("format") ? a.data("format") : "DHMS",
                           s = a.data("labels-short") ? ["Y", "M", "W", "D", "H", "I", "S"] : ["Years", "Months", "Weeks", "Days", "Hours", "Minutes", "Seconds"],
                           n = a.data("labels-short") ? ["Y", "M", "W", "D", "H", "I", "S"] : ["Year", "Month", "Week", "Day", "Hour", "Minute", "Second"],
                           l = i.split("-"),
                           e = new Date(l[2], l[0] - 1, l[1]),
                           d = new Date();
                       return e.setHours(0, 0, 0, 0) <= d.setHours(0, 0, 0, 0)
                           ? void a.hide()
                           : void a.countdown({
                                 until: e,
                                 compact: r,
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
                           r = t.extend(!0, {}, i.isotopeOptions, Fastor.parseOptions(e.attr("data-grid-options")), a ? a : {});
                       e.isotope(r);
                   });
               }
           }),
           (Fastor.initNavFilter = function (e) {
               t.fn.isotope &&
                   Fastor.$(e).on("click", function (a) {
                       var e = t(this),
                           i = e.attr("data-filter"),
                           r = e.parent().parent().attr("data-target");
                       (r ? t(r) : t(".grid")).isotope({ filter: i }), e.parent().siblings().children().removeClass("active"), e.addClass("active"), a.preventDefault();
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
                   r = t.extend({}, { minWidth: Fastor.minDesktopWidth, maxWidth: 2e4, top: 300, hide: !1, max_index: 1060, scrollMode: !1 }, a),
                   o = window.pageYOffset;
               if (0 != i.length) {
                   var s = function (e) {
                           var a = 0,
                               i = 0;
                           t(".sticky-content.fixed.fix-top").each(function () {
                               (a += t(this)[0].offsetHeight), i++;
                           }),
                               e.data("offset-top", a),
                               e.data("z-index", r.max_index - i);
                       },
                       n = function (e) {
                           var a = 0,
                               i = 0;
                           t(".sticky-content.fixed.fix-bottom").each(function () {
                               (a += t(this)[0].offsetHeight), i++;
                           }),
                               e.data("offset-bottom", a),
                               e.data("z-index", r.max_index - i);
                       },
                       l = function (e, t) {
                           window.innerWidth >= r.minWidth && window.innerWidth <= r.maxWidth && (e.wrap('<div class="sticky-content-wrapper"></div>'), e.parent().css("height", t + "px"), e.data("is-wrap", !0));
                       },
                       d = function () {
                           i.each(function () {
                               var e = t(this);
                               if (!e.data("is-wrap")) {
                                   var a,
                                       i = e.removeClass("fixed").outerHeight(!0);
                                   if (((a = e.offset().top + i), e.hasClass("has-dropdown"))) {
                                       var o = e.find(".category-dropdown .dropdown-box");
                                       o.length && (a += o[0].offsetHeight);
                                   }
                                   e.data("top", a), l(e, i);
                               } else (window.innerWidth < r.minWidth || window.innerWidth >= r.maxWidth) && (e.unwrap(".sticky-content-wrapper"), e.data("is-wrap", !1));
                           });
                       },
                       c = function (a) {
                           (a && !a.isTrusted) ||
                               i.each(function () {
                                   var e = t(this),
                                       a = !0;
                                   r.scrollMode && ((a = o > window.pageYOffset), (o = window.pageYOffset)),
                                       window.pageYOffset > (!1 == r.top ? e.data("top") : r.top) && window.innerWidth >= r.minWidth && window.innerWidth <= r.maxWidth
                                           ? (e.hasClass("fix-top")
                                                 ? (void 0 === e.data("offset-top") && s(e), e.css("margin-top", e.data("offset-top") + "px"))
                                                 : e.hasClass("fix-bottom") && (void 0 === e.data("offset-bottom") && n(e), e.css("margin-bottom", e.data("offset-bottom") + "px")),
                                             e.css("z-index", e.data("z-index")),
                                             r.scrollMode ? ((a && e.hasClass("fix-top")) || (!a && e.hasClass("fix-bottom")) ? e.addClass("fixed") : (e.removeClass("fixed"), e.css("margin", ""))) : e.addClass("fixed"),
                                             r.hide && e.parent(".sticky-content-wrapper").css("display", ""))
                                           : (e.removeClass("fixed"), e.css("margin-top", ""), e.css("margin-bottom", ""), r.hide && e.parent(".sticky-content-wrapper").css("display", "none"));
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
                       r = e.closest(".card").find(e.attr("href")),
                       o = e.closest(".accordion");
                   i.preventDefault(),
                       0 === o.find(".collapsing").length &&
                           0 === o.find(".expanding").length &&
                           (r.hasClass("expanded")
                               ? !o.hasClass("radio-type") && a(r)
                               : r.hasClass("collapsed") &&
                                 (0 < o.find(".expanded").length
                                     ? Fastor.isIE
                                         ? a(o.find(".expanded"), function () {
                                               a(r);
                                           })
                                         : (a(o.find(".expanded")), a(r))
                                     : a(r)));
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
                           r = i.parent().siblings(".nav");
                       a.preventDefault(),
                           i.siblings().removeClass("active in"),
                           i.addClass("active in"),
                           r.find(".nav-link").removeClass("active"),
                           r.find('[href="' + e + '"]').addClass("active"),
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
               function a(s) {
                   r || (r = s);
                   var n = s - r;
                   n >= t ? e() : (o.val = i(a));
               }
               var i = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
               if (!i) return setTimeout(e, t);
               var r,
                   o = {};
               return (o.val = i(a)), o;
           }),
           (Fastor.requestInterval = function (e, t, a) {
               function i(l) {
                   o || (o = s = l);
                   var d = l - o,
                       c = l - s;
                   !a || d < a ? (c > t ? (e(), (n.val = r(i)), (s = l)) : (n.val = r(i))) : e();
               }
               var r = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
               if (!r) return a ? setInterval(e, t) : setTimeout(e, a);
               var o,
                   s,
                   n = {};
               return (n.val = r(i)), n;
           }),
           (Fastor.deleteTimeout = function (e) {
               if (e) {
                   var t = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame;
                   return t ? (e.val ? t(e.val) : void 0) : clearTimeout(e);
               }
           }),
           (Fastor.priceSlider = function (e, a) {
               var i = parseInt(document.querySelector(e)?.dataset.rangemin, 10),
                   r = parseInt(document.querySelector(e)?.dataset.rangemax, 10),
                   o = parseInt(document.querySelector(e)?.dataset.currmin, 10),
                   s = parseInt(document.querySelector(e)?.dataset.currmax, 10);
               "object" == typeof noUiSlider &&
                   Fastor.$(e).each(function () {
                       var n = this;
                       noUiSlider.create(n, t.extend(!0, { start: [o, s], connect: !0, step: 1, range: { min: i, max: r } }, a)),
                           n.noUiSlider.on("update", function (e) {
                               var e = e.map(function (e) {
                                   return theme.settings.currencySymbol + parseInt(e);
                               });
                               t(n).parent().find(".filter-price-range").text(e.join(" - "));
                           }),
                           n.noUiSlider.on("end", function (e) {
                               var a = parseInt(e[0]),
                                   i = parseInt(e[1]);
                               t(n).parent().find(".filter-price--min").val(a), t(n).parent().find(".filter-price--max").val(i);
                           }),
                           t(n)
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
                               r = a + i - (window.innerWidth - 20);
                           0 < r && 20 < a && e.css("margin-left", -r);
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
                       var r = Fastor.byClass("sidebar");
                       r.length &&
                           (e.find(".dropdown-box").css("width", r[0].offsetWidth - 20),
                           Fastor.$window.on("resize", function () {
                               e.find(".dropdown-box").css("width", r[0].offsetWidth - 20);
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
   var e = Math.max,
       a = function () {
           992 > window.innerWidth &&
               (this.$sidebar.find(".sidebar-content, .filter-clean").removeAttr("style"), this.$sidebar.find(".sidebar-content").attr("style", ""), this.$sidebar.siblings(".toolbox").children(":not(:first-child)").removeAttr("style"));
       };
   (Sidebar.prototype.init = function (i) {
       var r = this;
       return (
           (r.name = i),
           (r.$sidebar = t("." + i)),
           (r.isNavigation = !1),
           r.$sidebar.length &&
               ((r.isNavigation = r.$sidebar.hasClass("sidebar-fixed") && r.$sidebar.parent().hasClass("toolbox-wrap")),
               r.isNavigation && ((a = a.bind(this)), Fastor.$window.on("resize", a)),
               Fastor.$window.on("resize", function () {
                   Fastor.$body.removeClass(i + "-active");
               }),
               r.$sidebar
                   .find(".sidebar-toggle, .sidebar-toggle-btn")
                   .add("sidebar" === i ? ".left-sidebar-toggle" : "." + i + "-toggle")
                   .on("click", function (a) {
                       r.toggle(), t(this).blur(), a.preventDefault();
                   }),
               r.$sidebar.find(".sidebar-overlay, .sidebar-close").on("click", function (t) {
                   Fastor.$body.removeClass(i + "-active"), t.preventDefault();
               })),
           !1
       );
   }),
       (Sidebar.prototype.toggle = function () {
           var a = this;
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
                   var r = t(".main-content .product-wrapper");
                   if (r.length)
                       if (r.hasClass("product-lists")) r.toggleClass("row cols-xl-2", !i);
                       else {
                           var o = r.data("toggle-cols"),
                               s = r.attr("class").match(/cols-\w*-*\d/g),
                               n = s
                                   ? e.apply(
                                         null,
                                         s.map(function (e) {
                                             return e.match(/\d/)[0];
                                         })
                                     )
                                   : 0;
                           i
                               ? (4 === n && 3 == o && r.removeClass("cols-md-4"), t(".btn-layout").removeClass("active"), t(".btn-layout[data-value='grid-3']").addClass("active"))
                               : 3 === n && (r.addClass("cols-md-4"), t(".btn-layout").removeClass("active"), t(".btn-layout[data-value='grid-4']").addClass("active"), !o && r.data("toggle-cols", 3));
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
           r = [],
           o = !1,
           s = !1,
           n = function () {
               if (!o) for (var e = 0; e < r.length; ++e) 0 >= (r[e] -= 200) && this.close(e--);
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
                   (n = n.bind(this));
           },
           open: function (o, l) {
               var d,
                   c = this,
                   p = e.extend(!0, {}, c.defaults, o);
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
                           r.push(p.delay),
                           1 < r.length || (s = setInterval(n, 200)),
                           l && l(d);
                   });
           },
           close: function (e) {
               var t = this,
                   o = "undefined" == typeof e ? 0 : e,
                   n = i.splice(o, 1)[0];
               r.splice(o, 1)[0],
                   (a -= n[0].offsetHeight + t.space),
                   n.removeClass("show"),
                   setTimeout(function () {
                       n.remove();
                   }, 300),
                   i.forEach(function (e, t) {
                       t >= o && e.hasClass("show") && e.stop(!0, !0).animate({ top: parseInt(e.css("top")) + e[0].offsetHeight + 20 }, 600, "easeOutQuint");
                   }),
                   i.length || clearTimeout(s);
           },
           pause: function () {
               o = !0;
           },
           resume: function () {
               o = !1;
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
               for (var r = this.children, o = r.length, e = 0; e < o; ++e) r[e].setAttribute("data-index", e + 1);
       },
       a = function (a) {
           var e,
               r = this.firstElementChild.firstElementChild.children,
               o = r.length;
           for (e = 0; e < o; ++e)
               if (!r[e].classList.contains("active")) {
                   var s,
                       n = Fastor.byClass("appear-animate", r[e]);
                   for (s = n.length - 1; 0 <= s; --s) n[s].classList.remove("appear-animate");
               }
           var l = t(a.currentTarget);
           l.find("video").on("ended", function () {
               var e = t(this);
               e.closest(".owl-item").hasClass("active") &&
                   (!0 === l.data("owl.carousel").options.autoplay
                       ? (!1 === l.data("owl.carousel").options.loop && l.data().children - 1 === l.find(".owl-item.active").index() && ((this.loop = !0), this.play()), l.trigger("next.owl.carousel"), l.trigger("play.owl.autoplay"))
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
       r = function (a) {
           var e = this,
               i = t(a.currentTarget);
           i.find(".owl-item.active .slide-animate").each(function () {
               var a = t(this),
                   i = t.extend(!0, {}, Fastor.animationOptions, Fastor.parseOptions(a.data("animation-options"))),
                   r = i.duration,
                   o = i.delay,
                   s = i.name;
               setTimeout(function () {
                   if ((a.css("animation-duration", r), a.css("animation-delay", o), a.addClass(s), a.hasClass("maskLeft"))) {
                       a.css("width", "fit-content");
                       var t = a.width();
                       a.css("width", 0).css("transition", "width " + (r ? r : "0.75s") + " linear " + (o ? o : "0s")), a.css("width", t);
                   }
                   r = r ? r : "0.75s";
                   var i = Fastor.requestTimeout(
                       function () {
                           a.addClass("show-content");
                       },
                       o ? 1e3 * +o.slice(0, -1) + 200 : 200
                   );
                   e.timers.push(i);
               }, 300);
           });
       },
       o = function (a) {
           t(a.currentTarget)
               .find(".owl-item.active .slide-animate")
               .each(function () {
                   var e = t(this);
                   e.addClass("show-content"), e.attr("style", "");
               });
       },
       s = function (a) {
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
       n = function (a) {
           var e = this,
               r = t(a.currentTarget);
           if (1 == e.translateFlag) {
               if (((e.next = r.find(".owl-item").eq(a.item.index).children().attr("data-index")), r.find(".show-content").removeClass("show-content"), e.prev != e.next)) {
                   if ((r.find(".show-content").removeClass("show-content"), r.hasClass("animation-slider"))) {
                       for (var o = 0; o < e.timers.length; o++) Fastor.deleteTimeout(e.timers[o]);
                       e.timers = [];
                   }
                   r.find(".owl-item.active .slide-animate").each(function () {
                       var a = t(this),
                           i = t.extend(!0, {}, Fastor.animationOptions, Fastor.parseOptions(a.data("animation-options"))),
                           r = i.duration,
                           o = i.delay,
                           s = i.name;
                       if ((a.css("animation-duration", r), a.css("animation-delay", o), a.addClass(s), a.hasClass("maskLeft"))) {
                           a.css("width", "fit-content");
                           var n = a.width();
                           a.css("width", 0).css("transition", "width " + (r ? r : "0.75s") + " linear " + (o ? o : "0s")), a.css("width", n);
                       }
                       r = r ? r : "0.75s";
                       var l = Fastor.requestTimeout(
                           function () {
                               a.addClass("show-content"), e.timers.splice(e.timers.indexOf(l), 1);
                           },
                           o ? 1e3 * +o.slice(0, -1) + 500 * +r.slice(0, -1) : 500 * +r.slice(0, -1)
                       );
                       e.timers.push(l);
                   });
               } else r.find(".owl-item").eq(a.item.index).find(".slide-animate").addClass("show-content");
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
       (Slider.prototype.init = function (l, d) {
           (this.timers = []), (this.translateFlag = 0), (this.prev = 1), (this.next = 1);
           var c = this,
               p = l.attr("class").split(" "),
               u = t.extend(!0, {}, Slider.defaults);
           p.forEach(function (e) {
               var a = Slider.presets[e];
               a && t.extend(!0, u, a);
           });
           var m = l.find("video");
           m.each(function () {
               this.loop = !1;
           }),
               t.extend(!0, u, Fastor.parseOptions(l.attr("data-owl-options")), d),
               (r = r.bind(this)),
               (s = s.bind(this)),
               (n = n.bind(this)),
               l.on("initialize.owl.carousel", e).on("initialized.owl.carousel", a).on("translated.owl.carousel", i),
               l.hasClass("animation-slider") && l.on("initialized.owl.carousel", r).on("resized.owl.carousel", o).on("translate.owl.carousel", s).on("translated.owl.carousel", n),
               l.owlCarousel(u);
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
                       r = this;
                   Fastor.call(function () {
                       e("#slider-" + r.sectionId).trigger("to.owl.carousel", i);
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
       swing: function (e, a, t, i, r) {
           return jQuery.easing[jQuery.easing.def](e, a, t, i, r);
       },
       easeOutQuad: function (e, a, i, r, o) {
           return -r * (a /= o) * (a - 2) + i;
       },
       easeInOutQuart: function (e, a, i, r, o) {
           return 1 > (a /= o / 2) ? (r / 2) * a * a * a * a + i : (-r / 2) * ((a -= 2) * a * a * a - 2) + i;
       },
       easeOutQuint: function (e, a, i, r, o) {
           return r * ((a = a / o - 1) * a * a * a * a + 1) + i;
       },
   }),
   document.addEventListener("lazybeforeunveil", function (t) {
       var e = t.target.getAttribute("data-bg");
       e && (t.target.style.backgroundImage = "url(" + e + ")");
   }),
   (theme.Helpers = (function () {
       function e() {
           return i;
       }
       function t() {
           (o = window.pageYOffset), (document.body.style.top = "-" + o + "px"), document.body.classList.add(r.preventScrolling);
       }
       function a() {
           document.body.classList.remove(r.preventScrolling), document.body.style.removeProperty("top"), window.scrollTo(0, o);
       }
       var i = !1,
           r = { preventScrolling: "prevent-scrolling" },
           o = window.pageYOffset;
       return {
           setTouch: function () {
               i = !0;
           },
           isTouch: e,
           enableScrollLock: t,
           disableScrollLock: a,
           debounce: function (e, t, a) {
               var i;
               return function () {
                   var r = this,
                       o = arguments,
                       s = a && !i;
                   clearTimeout(i),
                       (i = setTimeout(function () {
                           (i = null), a || e.apply(r, o);
                       }, t)),
                       s && e.apply(r, o);
               };
           },
           getScript: function (e, t) {
               return new Promise(function (a, i) {
                   function r(e, t) {
                       (t || !o.readyState || /loaded|complete/.test(o.readyState)) && ((o.onload = null), (o.onreadystatechange = null), (o = void 0), t ? i() : a());
                   }
                   var o = document.createElement("script"),
                       s = t || document.getElementsByTagName("script")[0];
                   (o.async = !0), (o.defer = !0), (o.onload = r), (o.onreadystatechange = r), (o.src = e), s.parentNode.insertBefore(o, s);
               });
           },
           prepareTransition: function (e) {
               e.addEventListener(
                   "transitionend",
                   function (e) {
                       e.currentTarget.classList.remove("is-transitioning");
                   },
                   { once: !0 }
               );
               var t = 0;
               ["transition-duration", "-moz-transition-duration", "-webkit-transition-duration", "-o-transition-duration"].forEach(function (a) {
                   var i = getComputedStyle(e)[a];
                   i && (i.replace(/\D/g, ""), t || (t = parseFloat(i)));
               }),
                   0 !== t && (e.classList.add("is-transitioning"), e.offsetWidth);
           }
           /*!
            * Serialize all form data into a SearchParams string
            * (c) 2020 Chris Ferdinandi, MIT License, https://gomakethings.com
            * @param  {Node}   form The form to serialize
            * @return {String}      The serialized form data
            */,
           serialize: function (e) {
               var t = [];
               return (
                   Array.prototype.slice.call(e.elements).forEach(function (e) {
                       return !e.name || e.disabled || -1 < ["file", "reset", "submit", "button"].indexOf(e.type)
                           ? void 0
                           : "select-multiple" === e.type
                           ? void Array.prototype.slice.call(e.options).forEach(function (a) {
                                 a.selected && t.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(a.value));
                             })
                           : void ((-1 < ["checkbox", "radio"].indexOf(e.type) && !e.checked) || t.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value)));
                   }),
                   t.join("&")
               );
           },
           cookiesEnabled: function () {
               var e = navigator.cookieEnabled;
               return e || ((document.cookie = "testcookie"), (e = -1 !== document.cookie.indexOf("testcookie"))), e;
           },
           promiseStylesheet: function (e) {
               var t = e || theme.stylesheet;
               return (
                   "undefined" == typeof this.stylesheetPromise &&
                       (this.stylesheetPromise = new Promise(function (e) {
                           var a = document.querySelector('link[href="' + t + '"]');
                           a.loaded && e(),
                               a.addEventListener("load", function () {
                                   setTimeout(e, 0);
                               });
                       })),
                   this.stylesheetPromise
               );
           },
       };
   })()),
   (theme.LibraryLoader = (function () {
       function e(e, t) {
           var a = document.createElement("script");
           return (
               (a.src = e.src),
               a.addEventListener("load", function () {
                   (e.status = i.loaded), t();
               }),
               a
           );
       }
       function t(e, t) {
           var a = document.createElement("link");
           return (
               (a.href = e.src),
               (a.rel = "stylesheet"),
               (a.type = "text/css"),
               a.addEventListener("load", function () {
                   (e.status = i.loaded), t();
               }),
               a
           );
       }
       var a = { link: "link", script: "script" },
           i = { requested: "requested", loaded: "loaded" },
           r = "https://cdn.shopify.com/shopifycloud/",
           o = {
               youtubeSdk: { tagId: "youtube-sdk", src: "https://www.youtube.com/iframe_api", type: a.script },
               plyrShopifyStyles: { tagId: "plyr-shopify-styles", src: r + "shopify-plyr/v1.0/shopify-plyr.css", type: a.link },
               modelViewerUiStyles: { tagId: "shopify-model-viewer-ui-styles", src: r + "model-viewer-ui/assets/v1.0/model-viewer-ui.css", type: a.link },
           };
       return {
           load: function (r, s) {
               var n = o[r];
               if (n && n.status !== i.requested) {
                   if (((s = s || function () {}), n.status === i.loaded)) return void s();
                   n.status = i.requested;
                   var l;
                   switch (n.type) {
                       case a.script:
                           l = e(n, s);
                           break;
                       case a.link:
                           l = t(n, s);
                   }
                   (l.id = n.tagId), (n.element = l);
                   var d = document.getElementsByTagName(n.type)[0];
                   d.parentNode.insertBefore(l, d);
               }
           },
       };
   })()),
   (theme.Images = (function () {
       return {
           preload: function (e, t) {
               "string" == typeof e && (e = [e]);
               for (var a, r = 0; r < e.length; r++) (a = e[r]), this.loadImage(this.getSizedImageUrl(a, t));
           },
           loadImage: function (e) {
               new Image().src = e;
           },
           switchImage: function (e, t, a) {
               var i = this.imageSize(t.src),
                   r = this.getSizedImageUrl(e.src, i);
               a ? a(r, e, t) : (t.src = r);
           },
           imageSize: function (e) {
               var t = e.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\\.@]/);
               return null === t ? null : void 0 === t[2] ? t[1] : t[1] + t[2];
           },
           getSizedImageUrl: function (e, t) {
               if (null === t) return e;
               if ("master" === t) return this.removeProtocol(e);
               var a = e.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);
               if (null !== a) {
                   var i = e.split(a[0]),
                       r = a[0];
                   return this.removeProtocol(i[0] + "_" + t + r);
               }
               return null;
           },
           removeProtocol: function (e) {
               return e.replace(/http(s)?:/, "");
           },
       };
   })()),
   (theme.Currency = (function () {
       return {
           formatMoney: function (e, t) {
               function a(e, t, a, i) {
                   if (((a = a || ","), (i = i || "."), isNaN(e) || null === e)) return 0;
                   e = (e / 100).toFixed(t);
                   var r = e.split("."),
                       o = r[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + a),
                       s = r[1] ? i + r[1] : "";
                   return o + s;
               }
               "string" == typeof e && (e = e.replace(".", ""));
               var i = "",
                   r = /\{\{\s*(\w+)\s*\}\}/,
                   o = t || "${{amount}}";
               switch (o.match(r)[1]) {
                   case "amount":
                       i = a(e, 2);
                       break;
                   case "amount_no_decimals":
                       i = a(e, 0);
                       break;
                   case "amount_with_comma_separator":
                       i = a(e, 2, ".", ",");
                       break;
                   case "amount_no_decimals_with_comma_separator":
                       i = a(e, 0, ".", ",");
                       break;
                   case "amount_no_decimals_with_space_separator":
                       i = a(e, 0, " ");
                       break;
                   case "amount_with_apostrophe_separator":
                       i = a(e, 2, "'");
               }
               return o.replace(r, i);
           },
       };
   })()),
   (window.Fastor = window.Fastor || {}),
   (Fastor.Utils = (function () {
       return {
           getParents: function (e, t = "*") {
               const a = [];
               for (let i = e.parentElement && e.parentElement.closest(t); i; ) a.push(i), (i = i.parentElement && i.parentElement.closest(t));
               return a;
           },
       };
   })()),
   (window.Fastor = window.Fastor || {}),
   (Fastor.ProductItems = (function () {
       var e = { item_wrapper: ".product-item-wrapper" };
       return {
           init: function () {
               var t = [],
                   a = 0;
               document.querySelectorAll(e.item_wrapper).forEach((e) => {
                   t[a++] = new Fastor.ProductItem(e);
               }),
                   Fastor.countdown(".product-countdown, .countdown");
           },
       };
   })()),
   (window.Fastor = window.Fastor || {}),
   (Fastor.ProductItem = (function () {
       function e(e) {
           (this.element = e),
               (this.singleOptions = this.element.querySelectorAll(t.single_option)),
               (this.radioSwatches = this.element.querySelectorAll(t.swatch_radio)),
               (this.product = {}),
               this.handleFeaturedProduct(),
               this.handleAddToCart();
       }
       var t = {
           item_json_wrapper: ".ProductItemJson",
           single_option: ".single-option-selector-item",
           swatch_radio: ".swatch-radio-item",
           variant_id: ".product__form_variant_id",
           option_wrapper: ".product-form__item",
           addToCartForm: "[data-product-form]",
           addToCart: "[data-add-to-cart]",
           addToCartText: "[data-add-to-cart-text]",
       };
       return (
           (e.prototype = Object.assign({}, e.prototype, {
               handleAddToCart: function () {
                   var e = this.element.querySelector(t.addToCartForm),
                       a = this.element.querySelector(t.addToCart);
                   e &&
                       (a.addEventListener("click", function (t) {
                           t.preventDefault(), e.dispatchEvent(new Event("submit", { bubbles: !0, cancelable: !0 }));
                       }),
                       e.addEventListener(
                           "submit",
                           function (t) {
                               if ("direct" != theme.addToCartType) return t.preventDefault(), Fastor.handleButtonLoadingState(a, !0), void Fastor.handleCartForm(a, e);
                           }.bind(this)
                       ));
               },
               handleFeaturedProduct: function () {
                   0 == this.element.querySelectorAll(t.item_json_wrapper).length ||
                       ((this.product = JSON.parse(this.element.querySelector(t.item_json_wrapper).innerHTML)),
                       this.singleOptions.forEach(
                           function (e) {
                               e.addEventListener("change", this._onOptionSelectorChange.bind(this));
                           }.bind(this)
                       ),
                       this.radioSwatches.forEach(
                           function (e) {
                               e.addEventListener("change", this._onSwatchRadioClick.bind(this));
                           }.bind(this)
                       ));
               },
               _onOptionSelectorChange: function () {
                   var e = this._getVariantFromOptions();
                   this._variantChange(e), e && (this._updateMasterSelect(e), this._updateImage(e), this._updatePrice(e));
               },
               _onSwatchRadioClick: function (e) {
                   e.preventDefault();
                   var a = e.target.getAttribute("data-value"),
                       i = e.target.closest(t.option_wrapper).querySelector("select"),
                       r = i.value;
                   r != a &&
                       ((i.value = a),
                       i.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 })),
                       e.target
                           .closest(t.option_wrapper)
                           .querySelectorAll(".swatch-radio")
                           .forEach(function (e) {
                               e.classList.remove("selected");
                           }),
                       e.target
                           .closest(t.option_wrapper)
                           .querySelectorAll("label")
                           .forEach(function (e) {
                               e.classList.remove("label-selected");
                           }),
                       Fastor.Utils.getParents(e.target, "label")[0].classList.add("label-selected"));
               },
               _getCurrentOptions: function () {
                   var e = [];
                   return (
                       this.singleOptions.forEach(function (t) {
                           var a = t.getAttribute("type");
                           (!("radio" === a || "checkbox" === a) || t.checked) && e.push({ value: t.value, index: t.getAttribute("data-index") });
                       }),
                       e
                   );
               },
               _getVariantFromOptions: function () {
                   var e = this._getCurrentOptions(),
                       t = this.product.variants,
                       a = t.find(function (t) {
                           return e.every(function (e) {
                               return t[e.index] === e.value;
                           });
                       });
                   return a;
               },
               _variantChange: function (e) {
                   var a = this.element.querySelector(t.addToCart),
                       i = this.element.querySelector(t.addToCartText);
                   e
                       ? e.available
                           ? ((a.disabled = !1), a.setAttribute("title", theme.strings.addToCart))
                           : ((a.disabled = !0), a.setAttribute("title", theme.strings.soldOut))
                       : ((a.disabled = !0), a.setAttribute("title", theme.strings.unavailable));
               },
               _updateMasterSelect: function (e) {
                   return (this.element.querySelector(t.variant_id).value = e.id), !1;
               },
               _updateImage: function (e) {
                   var t = e.featured_image || {};
                   if (e.featured_image) return t && (this.element.querySelector(".product-visual img").setAttribute("src", t.src), this.element.querySelector(".product-visual img").setAttribute("data-src", t.src)), !1;
               },
               _updatePrice: function (e) {
                   var t = { hidden: "hide", productOnSale: "price--on-sale", productUnitAvailable: "price--unit-available", productUnavailable: "price--unavailable", productSoldOut: "price--sold-out" },
                       a = this.element.querySelector(".product-price"),
                       i = this.element.querySelector(".product-price .old-price"),
                       r = this.element.querySelector(".product-price .new-price");
                   return !e && a
                       ? (a.classList.add(t.productUnavailable), void a.setAttribute("aria-hidden", !0))
                       : void (!e.available && a && a.classList.add(t.productSoldOut),
                         e.compare_at_price > e.price
                             ? (i && (i.classList.remove("hide"), (i.innerHTML = theme.Currency.formatMoney(e.compare_at_price, theme.moneyFormat))),
                               r && (r.innerHTML = theme.Currency.formatMoney(e.price, theme.moneyFormat)),
                               a && (a.classList.add(t.productOnSale), a.setAttribute("data-price", e.price), a.setAttribute("data-price_old", e.compare_at_price)))
                             : (r && (r.innerHTML = theme.Currency.formatMoney(e.price, theme.moneyFormat)), i && i.classList.add("hide"), a && (a.setAttribute("data-price", e.price), a.setAttribute("data-price_old", "0"))),
                         null != this.element.closest(".grouped-product") && Fastor.updateGroupedPrice());
               },
           })),
           e
       );
   })()),
   (window.slate = window.slate || {}),
   (slate.Variants = (function () {
       function e(e) {
           (this.container = e.container),
               (this.product = e.product),
               (this.originalSelectorId = e.originalSelectorId),
               (this.enableHistoryState = e.enableHistoryState),
               (this.singleOptions = this.container.querySelectorAll(e.singleOptionSelector)),
               (this.currentVariant = this._getVariantFromOptions()),
               this.singleOptions.forEach(
                   function (e) {
                       e.addEventListener("change", this._onSelectChange.bind(this));
                   }.bind(this)
               );
       }
       return (
           (e.prototype = Object.assign({}, e.prototype, {
               _getCurrentOptions: function () {
                   var e = [];
                   return (
                       this.singleOptions.forEach(function (t) {
                           var a = t.getAttribute("type");
                           (!("radio" === a || "checkbox" === a) || t.checked) && e.push({ value: t.value, index: t.getAttribute("data-index") });
                       }),
                       e
                   );
               },
               _getVariantFromOptions: function () {
                   var e = this._getCurrentOptions(),
                       t = this.product.variants,
                       a = t.find(function (t) {
                           return e.every(function (e) {
                               return t[e.index] === e.value;
                           });
                       });
                   return a;
               },
               _onSelectChange: function () {
                   var e = this._getVariantFromOptions();
                   this.container.dispatchEvent(new CustomEvent("variantChange", { detail: { variant: e }, bubbles: !0, cancelable: !0 })),
                       e && (this._updateMasterSelect(e), this._updateImages(e), this._updatePrice(e), this._updateSKU(e), (this.currentVariant = e), this.enableHistoryState && this._updateHistoryState(e));
               },
               _updateImages: function (e) {
                   var t = e.featured_image || {},
                       a = this.currentVariant.featured_image || {};
                   e.featured_image && t.src !== a.src && this.container.dispatchEvent(new CustomEvent("variantImageChange", { detail: { variant: e }, bubbles: !0, cancelable: !0 }));
               },
               _updatePrice: function (e) {
                   (e.price === this.currentVariant.price && e.compare_at_price === this.currentVariant.compare_at_price) ||
                       this.container.dispatchEvent(new CustomEvent("variantPriceChange", { detail: { variant: e }, bubbles: !0, cancelable: !0 }));
               },
               _updateSKU: function (e) {
                   e.sku === this.currentVariant.sku || this.container.dispatchEvent(new CustomEvent("variantSKUChange", { detail: { variant: e }, bubbles: !0, cancelable: !0 }));
               },
               _updateHistoryState: function (e) {
                   if (history.replaceState && e) {
                       var t = window.location.protocol + "//" + window.location.host + window.location.pathname + "?variant=" + e.id;
                       window.history.replaceState({ path: t }, "", t);
                   }
               },
               _updateMasterSelect: function (e) {
                   var t = this.container.querySelector(this.originalSelectorId);
                   t && (t.value = e.id);
               },
           })),
           e
       );
   })()),
   (theme.Video = (function () {
       var e = Math.ceil;
       function t(e) {
           if (e) {
               if (
                   ((A[e.id] = {
                       id: e.id,
                       videoId: e.dataset.id,
                       type: e.dataset.type,
                       status: "image_with_play" === e.dataset.type ? "closed" : "background",
                       video: e,
                       videoWrapper: e.closest(M.videoWrapper),
                       section: e.closest(M.section),
                       controls: "background" === e.dataset.type ? 0 : 1,
                   }),
                   !q)
               ) {
                   var t = document.createElement("script");
                   t.src = "https://www.youtube.com/iframe_api";
                   var a = document.getElementsByTagName("script")[0];
                   a.parentNode.insertBefore(t, a);
               }
               n();
           }
       }
       function a(e) {
           (I || x) && (!e || "function" != typeof T[e].playVideo || o(e));
       }
       function i(e) {
           T[e] && "function" == typeof T[e].pauseVideo && T[e].pauseVideo();
       }
       function r(e) {
           q && (L(e), C());
       }
       function o(e, t) {
           var a = A[e],
               i = T[e],
               r = a.videoWrapper;
           if (x) c(a);
           else {
               if (t || k) return r.classList.remove(P.loading), c(a), void i.playVideo();
               i.playVideo();
           }
       }
       function s(e) {
           var t = e ? P.supportsAutoplay : P.supportsNoAutoplay;
           document.documentElement.classList.remove(P.supportsAutoplay, P.supportsNoAutoplay), document.documentElement.classList.add(t), e || (x = !0), (k = !0);
       }
       function n() {
           I || (S() && (x = !0), x && s(!1), (I = !0));
       }
       function l(e) {
           var t = m(e);
           switch (("background" !== t.status || S() || k || (e.data !== YT.PlayerState.PLAYING && e.data !== YT.PlayerState.BUFFERING) || (s(!0), (k = !0), t.videoWrapper.classList.remove(P.loading)), e.data)) {
               case YT.PlayerState.ENDED:
                   d(t);
                   break;
               case YT.PlayerState.PAUSED:
                   setTimeout(function () {
                       e.target.getPlayerState() === YT.PlayerState.PAUSED && p(t);
                   }, 200);
           }
       }
       function d(e) {
           switch (e.type) {
               case "background":
                   T[e.id].seekTo(0);
                   break;
               case "image_with_play":
                   u(e.id), g(e.id, !1);
           }
       }
       function c(e) {
           var t = e.videoWrapper,
               a = t.querySelector(M.pauseVideoBtn);
           t.classList.remove(P.loading), a.classList.contains(P.userPaused) && a.classList.remove(P.userPaused);
           "background" === e.status ||
               (document.getElementById(e.id).setAttribute("tabindex", "0"),
               "image_with_play" === e.type && (t.classList.remove(P.paused), t.classList.add(P.playing)),
               setTimeout(function () {
                   t.querySelector(M.closeVideoBtn).focus();
               }, E.scrollAnimationDuration));
       }
       function p(e) {
           var t = e.videoWrapper;
           "image_with_play" === e.type && ("closed" === e.status ? t.classList.remove(P.paused) : t.classList.add(P.paused)), t.classList.remove(P.playing);
       }
       function u(e) {
           var t = A[e],
               a = t.videoWrapper;
           switch ((document.getElementById(t.id).setAttribute("tabindex", "-1"), (t.status = "closed"), t.type)) {
               case "image_with_play":
                   T[e].stopVideo(), p(t);
                   break;
               case "background":
                   T[e].mute(), _(e);
           }
           a.classList.remove(P.paused, P.playing);
       }
       function m(e) {
           var t = e.target.getIframe().id;
           return A[t];
       }
       function g(e, t) {
           var a = A[e],
               i = a.videoWrapper.getBoundingClientRect().top + window.pageYOffset,
               r = a.videoWrapper.querySelector(M.playVideoBtn),
               o = 0,
               s = 0;
           if ((S() && a.videoWrapper.parentElement.classList.toggle("page-width", !t), !t)) {
               (s = S() ? a.videoWrapper.dataset.mobileHeight : a.videoWrapper.dataset.desktopHeight),
                   (a.videoWrapper.style.height = s + "px"),
                   setTimeout(function () {
                       a.videoWrapper.classList.add(P.wrapperMinHeight);
                   }, 600);
               var n = window.scrollX,
                   l = window.scrollY;
               r.focus(), window.scrollTo(n, l);
           } else if (
               ((s = S() ? window.innerWidth / E.ratio : a.videoWrapper.offsetWidth / E.ratio),
               (o = (window.innerHeight - s) / 2),
               (a.videoWrapper.style.height = a.videoWrapper.getBoundingClientRect().height + "px"),
               a.videoWrapper.classList.remove(P.wrapperMinHeight),
               (a.videoWrapper.style.height = s + "px"),
               !(S() && Shopify.designMode))
           ) {
               var d = document.documentElement.style.scrollBehavior;
               (document.documentElement.style.scrollBehavior = "smooth"), window.scrollTo({ top: i - o }), (document.documentElement.style.scrollBehavior = d);
           }
       }
       function h(e) {
           var t = A[e].videoWrapper.querySelector(M.pauseVideoBtn),
               r = t.classList.contains(P.userPaused);
           r ? (t.classList.remove(P.userPaused), a(e)) : (t.classList.add(P.userPaused), i(e)), t.setAttribute("aria-pressed", !r);
       }
       function y(e) {
           var t = A[e];
           switch ((t.videoWrapper.classList.add(P.loading), (t.videoWrapper.style.height = t.videoWrapper.offsetHeight + "px"), (t.status = "open"), t.type)) {
               case "image_with_play":
                   o(e, !0);
                   break;
               case "background":
                   b(e, t), T[e].unMute(), o(e, !0);
           }
           g(e, !0), document.addEventListener("keydown", H);
       }
       function v() {
           var e = document.querySelectorAll("." + P.backgroundVideo);
           e.forEach(function (e) {
               f(e);
           });
       }
       function f(t) {
           if (q)
               if (S()) t.style.cssText = null;
               else {
                   var a = t.closest(M.videoWrapper),
                       i = a.clientWidth,
                       r = t.clientWidth,
                       o = a.dataset.desktopHeight;
                   if (i / E.ratio < o) {
                       r = e(o * E.ratio);
                       var s = "width: " + r + "px; height: " + o + "px; left: " + (i - r) / 2 + "px; top: 0;";
                       t.style.cssText = s;
                   } else {
                       o = e(i / E.ratio);
                       var n = "width: " + i + "px; height: " + o + "px; top: " + (o - o) / 2 + "px; left: 0;";
                       t.style.cssText = n;
                   }
                   theme.Helpers.prepareTransition(t), a.classList.add(P.loaded);
               }
       }
       function b(e) {
           var t = document.getElementById(e);
           t.classList.remove(P.backgroundVideo),
               t.classList.add(P.videoWithImage),
               setTimeout(function () {
                   document.getElementById(e).style.cssText = null;
               }, 600),
               A[e].videoWrapper.classList.remove(P.backgroundVideoWrapper),
               A[e].videoWrapper.classList.add(P.playing),
               (A[e].status = "open");
       }
       function _(e) {
           var t = document.getElementById(e);
           t.classList.remove(P.videoWithImage), t.classList.add(P.backgroundVideo), A[e].videoWrapper.classList.add(P.backgroundVideoWrapper), (A[e].status = "background"), f(t);
       }
       function S() {
           return window.innerWidth < theme.breakpoints.medium;
       }
       function C() {
           var e = document.querySelectorAll(M.playVideoBtn),
               t = document.querySelectorAll(M.closeVideoBtn),
               a = document.querySelectorAll(M.pauseVideoBtn);
           e.forEach(function (e) {
               e.addEventListener("click", function (e) {
                   var t = e.currentTarget.dataset.controls;
                   y(t);
               });
           }),
               t.forEach(function (e) {
                   e.addEventListener("click", function (e) {
                       var t = e.currentTarget.dataset.controls;
                       e.currentTarget.blur(), u(t), g(t, !1);
                   });
               }),
               a.forEach(function (e) {
                   e.addEventListener("click", function (e) {
                       var t = e.currentTarget.dataset.controls;
                       h(t);
                   });
               }),
               window.addEventListener("resize", O),
               window.addEventListener("scroll", B);
       }
       function L(e) {
           var t = Object.assign(E, A[e]);
           (t.playerVars.controls = t.controls), (T[e] = new YT.Player(e, t));
       }
       function w(e, t) {
           var a = e.querySelectorAll(M.playVideoBtn),
               i = e.querySelector(M.closeVideoBtn),
               r = e.querySelector(M.pauseVideoBtn),
               o = i.querySelector(M.fallbackText),
               s = r.querySelector(M.pauseVideoStop),
               n = s.querySelector(M.fallbackText),
               l = r.querySelector(M.pauseVideoResume),
               d = l.querySelector(M.fallbackText);
           a.forEach(function (e) {
               var a = e.querySelector(M.fallbackText);
               a.textContent = a.textContent.replace("[video_title]", t);
           }),
               (o.textContent = o.textContent.replace("[video_title]", t)),
               (n.textContent = n.textContent.replace("[video_title]", t)),
               (d.textContent = d.textContent.replace("[video_title]", t));
       }
       var k = !1,
           I = !1,
           x = !1,
           q = !1,
           A = {},
           T = [],
           E = {
               ratio: 16 / 9,
               scrollAnimationDuration: 400,
               playerVars: { iv_load_policy: 3, modestbranding: 1, autoplay: 0, controls: 0, wmode: "opaque", branding: 0, autohide: 0, rel: 0 },
               events: {
                   onReady: function (e) {
                       e.target.setPlaybackQuality("hd1080");
                       var t = m(e),
                           a = e.target.getVideoData().title;
                       n(), document.getElementById(t.id).setAttribute("tabindex", "-1"), v(), w(t.videoWrapper, a), "background" === t.type && (e.target.mute(), o(t.id)), t.videoWrapper.classList.add(P.loaded);
                   },
                   onStateChange: l,
               },
           },
           P = {
               playing: "video-is-playing",
               paused: "video-is-paused",
               loading: "video-is-loading",
               loaded: "video-is-loaded",
               backgroundVideoWrapper: "video-background-wrapper",
               videoWithImage: "video--image_with_play",
               backgroundVideo: "video--background",
               userPaused: "is-paused",
               supportsAutoplay: "autoplay",
               supportsNoAutoplay: "no-autoplay",
               wrapperMinHeight: "video-section-wrapper--min-height",
           },
           M = {
               section: ".video-section",
               videoWrapper: ".video-section-wrapper",
               playVideoBtn: ".video-control__play",
               closeVideoBtn: ".video-control__close-wrapper",
               pauseVideoBtn: ".video__pause",
               pauseVideoStop: ".video__pause-stop",
               pauseVideoResume: ".video__pause-resume",
               fallbackText: ".icon__fallback-text",
           },
           H = function (e) {
               var t = document.activeElement.dataset.controls;
               e.keyCode === slate.utils.keyboardKeys.ESCAPE && t && (u(t), g(t, !1));
           },
           O = theme.Helpers.debounce(function () {
               if (q) {
                   var e,
                       t = window.innerHeight === screen.height;
                   if ((v(), S())) {
                       for (e in A) A.hasOwnProperty(e) && (A[e].videoWrapper.classList.contains(P.playing) && !t && (i(e), p(A[e])), (A[e].videoWrapper.style.height = document.documentElement.clientWidth / E.ratio + "px"));
                       s(!1);
                   } else
                       for (e in (s(!0), A)) {
                           var a = A[e].videoWrapper.querySelectorAll("." + P.videoWithImage);
                           a.length || (T[e].playVideo(), c(A[e]));
                       }
               }
           }, 200),
           B = theme.Helpers.debounce(function () {
               if (q)
                   for (var e in A)
                       if (A.hasOwnProperty(e)) {
                           var t = A[e].videoWrapper,
                               a =
                                   t.getBoundingClientRect().top + window.pageYOffset + 0.75 * t.offsetHeight < window.pageYOffset ||
                                   t.getBoundingClientRect().top + window.pageYOffset + 0.25 * t.offsetHeight > window.pageYOffset + window.innerHeight;
                           if (t.classList.contains(P.playing)) {
                               if (!a) return;
                               u(e), g(e, !1);
                           }
                       }
           }, 50);
       return {
           init: t,
           editorLoadVideo: r,
           loadVideos: function () {
               for (var e in A) A.hasOwnProperty(e) && L(e);
               C(), (q = !0);
           },
           playVideo: a,
           pauseVideo: i,
           removeEvents: function () {
               document.removeEventListener("keydown", H), window.removeEventListener("resize", O), window.removeEventListener("scroll", B);
           },
       };
   })()),
   (theme.ProductVideo = (function () {
       function e(e) {
           return e ? void r() : void i();
       }
       function t(e) {
           if (!e.player) {
               var t = e.container.closest(n.productMediaWrapper),
                   a = "true" === t.getAttribute("data-" + l.enableVideoLooping);
               e.player = new Shopify.Video(e.element, { loop: { active: a } });
               var i = function () {
                   null != document.querySelector(".product-image-full") && document.querySelector(".product-image-full").classList.remove("hide"), e.player && e.player.pause();
               };
               t.addEventListener("mediaHidden", i),
                   t.addEventListener("xrLaunch", i),
                   t.addEventListener("mediaVisible", function () {
                       null != document.querySelector(".product-image-full") && document.querySelector(".product-image-full").classList.add("hide"), theme.Helpers.isTouch() || !e.player || e.player.play();
                   });
           }
       }
       function a(e) {
           return "VIDEO" === e.tagName ? s.shopify : s.external;
       }
       function i() {
           for (var e in o)
               if (o.hasOwnProperty(e)) {
                   var t = o[e];
                   t.ready();
               }
       }
       function r() {
           for (var e in o)
               if (o.hasOwnProperty(e)) {
                   var t = o[e];
                   if (t.nativeVideo) continue;
                   t.host === s.shopify && (t.element.setAttribute("controls", "controls"), (t.nativeVideo = !0));
               }
       }
       var o = {},
           s = { shopify: "shopify", external: "external" },
           n = { productMediaWrapper: "[data-product-single-media-wrapper]" },
           l = { enableVideoLooping: "enable-video-looping", videoId: "video-id" };
       return {
           init: function (i, r) {
               if (i) {
                   var s = i.querySelector("iframe, video");
                   if (s) {
                       var n = i.getAttribute("data-media-id");
                       (o[n] = {
                           mediaId: n,
                           sectionId: r,
                           host: a(s),
                           container: i,
                           element: s,
                           ready: function () {
                               t(this);
                           },
                       }),
                           window.Shopify.loadFeatures([{ name: "video-ui", version: "2.0", onLoad: e }]),
                           theme.LibraryLoader.load("plyrShopifyStyles");
                   }
               }
           },
           hosts: s,
           loadVideos: i,
           removeSectionVideos: function (e) {
               for (var t in o)
                   if (o.hasOwnProperty(t)) {
                       var a = o[t];
                       a.sectionId === e && (a.player && a.player.destroy(), delete o[t]);
                   }
           },
       };
   })()),
   (theme.ProductModel = (function () {
       function e(t) {
           if (!t) {
               if (!window.ShopifyXR)
                   return void document.addEventListener("shopify_xr_initialized", function () {
                       e();
                   });
               for (var a in i)
                   if (i.hasOwnProperty(a)) {
                       var r = i[a];
                       if (r.loaded) continue;
                       var o = document.querySelector("#ModelJson-" + a);
                       window.ShopifyXR.addModels(JSON.parse(o.innerHTML)), (r.loaded = !0);
                   }
               window.ShopifyXR.setupXRElements();
           }
       }
       function t(e) {
           if (!e)
               for (var t in r)
                   if (r.hasOwnProperty(t)) {
                       var i = r[t];
                       i.modelViewerUi || (i.modelViewerUi = new Shopify.ModelViewerUI(i.element)), a(i);
                   }
       }
       function a(e) {
           var t = o[e.sectionId];
           e.container.addEventListener("mediaVisible", function () {
               null != document.querySelector(".product-image-full") && document.querySelector(".product-image-full").classList.add("hide"), t.element.setAttribute("data-shopify-model3d-id", e.modelId);
               theme.Helpers.isTouch() || e.modelViewerUi.play();
           }),
               e.container.addEventListener("mediaHidden", function () {
                   null != document.querySelector(".product-image-full") && document.querySelector(".product-image-full").classList.remove("hide"), t.element.setAttribute("data-shopify-model3d-id", t.defaultId), e.modelViewerUi.pause();
               }),
               e.container.addEventListener("xrLaunch", function () {
                   e.modelViewerUi.pause();
               });
       }
       var i = {},
           r = {},
           o = {},
           s = { mediaGroup: "[data-product-single-media-group]", xrButton: "[data-shopify-xr]" };
       return {
           init: function (a, n) {
               (i[n] = { loaded: !1 }),
                   a.forEach(function (e, t) {
                       var a = e.getAttribute("data-media-id"),
                           i = e.querySelector("model-viewer"),
                           l = i.getAttribute("data-model-id");
                       if (0 === t) {
                           var d = e.closest(s.mediaGroup),
                               c = d.querySelector(s.xrButton);
                           o[n] = { element: c, defaultId: l };
                       }
                       r[a] = { modelId: l, sectionId: n, container: e, element: i };
                   }),
                   window.Shopify.loadFeatures([
                       { name: "shopify-xr", version: "1.0", onLoad: e },
                       { name: "model-viewer-ui", version: "1.0", onLoad: t },
                   ]),
                   theme.LibraryLoader.load("modelViewerUiStyles");
           },
           removeSectionModels: function (e) {
               for (var t in r)
                   if (r.hasOwnProperty(t)) {
                       var a = r[t];
                       a.sectionId === e && (r[t].modelViewerUi.destroy(), delete r[t]);
                   }
               delete i[e];
           },
       };
   })()),
   (theme.Zoom = (function () {
       var e = Math.max;
       function t(e) {
           (this.container = e), (this.cache = {}), (this.url = e.dataset.zoom), this._cacheSelectors(), this.cache.sourceImage && this._duplicateImage();
       }
       var a = { imageZoom: "[data-image-zoom]" },
           i = { zoomImg: "zoomImg" },
           r = { imageZoomTarget: "data-image-zoom-target" };
       return (
           (t.prototype = Object.assign({}, t.prototype, {
               _cacheSelectors: function () {
                   this.cache = { sourceImage: this.container.querySelector(a.imageZoom) };
               },
               _init: function () {
                   var e = this.cache.targetImage.width,
                       t = this.cache.targetImage.height;
                   this.cache.sourceImage === this.cache.targetImage ? ((this.sourceWidth = e), (this.sourceHeight = t)) : ((this.sourceWidth = this.cache.sourceImage.width), (this.sourceHeight = this.cache.sourceImage.height)),
                       (this.xRatio = (this.cache.sourceImage.width - e) / this.sourceWidth),
                       (this.yRatio = (this.cache.sourceImage.height - t) / this.sourceHeight);
               },
               _start: function (t) {
                   this._init(), this._move(t);
               },
               _stop: function () {
                   this.cache.targetImage.style.opacity = 0;
               },
               _setTopLeftMaxValues: function (t, a) {
                   var i = Math.min;
                   return { left: e(i(a, this.sourceWidth), 0), top: e(i(t, this.sourceHeight), 0) };
               },
               _move: function (t) {
                   var e = t.pageX - (this.cache.sourceImage.getBoundingClientRect().left + window.scrollX),
                       a = t.pageY - (this.cache.sourceImage.getBoundingClientRect().top + window.scrollY),
                       i = this._setTopLeftMaxValues(a, e);
                   (a = i.top), (e = i.left), (this.cache.targetImage.style.left = -(e * -this.xRatio) + "px"), (this.cache.targetImage.style.top = -(a * -this.yRatio) + "px"), (this.cache.targetImage.style.opacity = 1);
               },
               _duplicateImage: function () {
                   this._loadImage()
                       .then(
                           function (e) {
                               (this.cache.targetImage = e),
                                   (e.style.width = e.width + "px"),
                                   (e.style.height = e.height + "px"),
                                   (e.style.position = "absolute"),
                                   (e.style.maxWidth = "none"),
                                   (e.style.maxHeight = "none"),
                                   (e.style.opacity = 0),
                                   (e.style.border = "none"),
                                   (e.style.left = 0),
                                   (e.style.top = 0),
                                   this.container.appendChild(e),
                                   this._init(),
                                   (this._start = this._start.bind(this)),
                                   (this._stop = this._stop.bind(this)),
                                   (this._move = this._move.bind(this)),
                                   this.container.addEventListener("mouseenter", this._start),
                                   this.container.addEventListener("mouseleave", this._stop),
                                   this.container.addEventListener("mousemove", this._move),
                                   (this.container.style.position = "relative"),
                                   (this.container.style.overflow = "hidden");
                           }.bind(this)
                       )
                       .catch(function () {});
               },
               _loadImage: function () {
                   return new Promise(
                       function (e, t) {
                           var a = new Image();
                           a.setAttribute("role", "presentation"),
                               a.setAttribute(r.imageZoomTarget, !0),
                               a.classList.add(i.zoomImg),
                               (a.src = this.url),
                               a.addEventListener("load", function () {
                                   e(a);
                               }),
                               a.addEventListener("error", function (e) {
                                   t(e);
                               });
                       }.bind(this)
                   );
               },
               unload: function () {
                   var e = this.container.querySelector("[" + r.imageZoomTarget + "]");
                   e && e.remove(), this.container.removeEventListener("mouseenter", this._start), this.container.removeEventListener("mouseleave", this._stop), this.container.removeEventListener("mousemove", this._move);
               },
           })),
           t
       );
   })()),
   (window.theme = window.theme || {}),
   (theme.StoreAvailability = (function () {
       function e(e) {
           (this.container = e), (this.productTitle = this.container.dataset.productTitle), (this.hasOnlyDefaultVariant = "true" === this.container.dataset.hasOnlyDefaultVariant);
       }
       var t = {
               storeAvailabilityModalOpen: ".store-availability-information__button",
               storeAvailabilityModalProductTitle: "[data-store-availability-modal-product-title]",
               storeAvailabilityModalVariantTitle: "[data-store-availability-modal-variant-title]",
           },
           a = { hidden: "hide" };
       return (
           (e.prototype = Object.assign({}, e.prototype, {
               updateContent: function (e) {
                   var a = this.container.dataset.baseUrl + "/variants/" + e + "/?section_id=store-availability",
                       i = this,
                       r = i.container.querySelector(t.storeAvailabilityModalOpen);
                   (this.container.style.opacity = 0.5),
                       r && ((r.disabled = !0), r.setAttribute("aria-busy", !0)),
                       fetch(a)
                           .then(function (e) {
                               return e.text();
                           })
                           .then(function (e) {
                               "" !== e.trim() &&
                                   ((i.container.innerHTML = e),
                                   (i.container.innerHTML = i.container.firstElementChild.innerHTML),
                                   (i.container.style.opacity = 1),
                                   (r = i.container.querySelector(t.storeAvailabilityModalOpen)),
                                   r &&
                                       ($(t.storeAvailabilityModalOpen).on("click", function (t) {
                                           t.preventDefault(), Fastor.popup({ items: { src: $(this).attr("href") } }, "storeAvailability");
                                       }),
                                       i._updateProductTitle(),
                                       i.hasOnlyDefaultVariant && i._hideVariantTitle()));
                           });
               },
               clearContent: function () {
                   this.container.innerHTML = "";
               },
               _updateProductTitle: function () {
                   var e = this.container.querySelector(t.storeAvailabilityModalProductTitle);
                   e.textContent = this.productTitle;
               },
               _hideVariantTitle: function () {
                   var e = this.container.querySelector(t.storeAvailabilityModalVariantTitle);
                   e.classList.add(a.hidden);
               },
           })),
           e
       );
   })()),
   (theme.Product = (function () {
       var a = Math.ceil,
           i = Math.floor;
       function r(e) {
           this.container = e;
           var t = e.getAttribute("data-section-id");
           (this.zoomPictures = []),
               (this.ajaxEnabled = "direct" != theme.addToCartType),
               (this.isQuickview = "product-quickview-template" == t),
               (this.$wrapper = $(e)),
               (this.settings = {
                   mediaQueryMediumUp: "screen and (min-width: 768px)",
                   mediaQuerySmall: "screen and (max-width: 767px)",
                   bpSmall: !1,
                   enableHistoryState: e.getAttribute("data-enable-history-state") || !1,
                   namespace: ".product-page-details-" + t,
                   sectionId: t,
                   sliderActive: !1,
                   zoomEnabled: !1,
               }),
               (this.selectors = {
                   addToCart: "[data-add-to-cart]",
                   addToCartText: "[data-add-to-cart-text]",
                   quantity: "[data-quantity-input]",
                   SKU: ".product-sku ",
                   stock: ".stock-" + t,
                   productStatus: "[data-product-status]",
                   originalSelectorId: "#ProductSelect-" + t,
                   productForm: "[data-product-form]",
                   errorMessage: "[data-error-message]",
                   errorMessageWrapper: "[data-error-message-wrapper]",
                   imageZoomWrapper: "[data-image-zoom-wrapper]",
                   productMediaWrapper: "[data-product-single-media-wrapper]",
                   productImageCarousel: "[data-product-single-image-carousel]",
                   productThumbImages: ".product-single__thumbnail--" + t,
                   productThumbs: ".product-single__thumbnails-" + t,
                   productThumbListItem: ".product-single__thumbnails-item",
                   productThumbsWrapper: ".thumbnails-wrapper",
                   productImagesPopup: ".product-image-full-" + t,
                   singleOptionSelector: ".single-option-selector-" + t,
                   singleOptionSelectorId: "#SingleOptionSelector-" + t,
                   singleOptionSwatchesWrapper: ".wrapper-swatches-" + t,
                   singleOptionSwatchesRadio: ".swatch-radio-" + t,
                   shopifyPaymentButton: ".shopify-payment-button",
                   productMediaTypeVideo: "[data-product-media-type-video]",
                   productMediaTypeModel: "[data-product-media-type-model]",
                   priceContainer: "[data-price]",
                   regularPrice: "[data-regular-price]",
                   salePrice: "[data-sale-price]",
                   unitPrice: "[data-unit-price]",
                   unitPriceBaseUnit: "[data-unit-price-base-unit]",
                   productPolicies: "[data-product-policies]",
                   storeAvailabilityContainer: "[data-store-availability-container]",
                   stockCountdown: "#product-single__stock-" + t,
                   visitorCounter: "#product-single__visitor-" + t,
                   totalSold: "#product-single__sold-" + t,
                   cartAgree: "#product-cart__agree-" + t,
                   cartCheckout: "#product-buy__1click-" + t,
                   groupedProduct: "#products-grouped-" + t,
                   groupedButton: "#grouped-add-button-" + t,
                   groupedCheckbox: "#products-grouped-" + t + " .grouped-checkbox",
                   ProductVariantJson: "#ProductVariantJson-" + t,
               }),
               (this.classes = {
                   activeClass: "active",
                   hidden: "hide",
                   visibilityHidden: "hide",
                   inputError: "input--error",
                   jsZoomEnabled: "js-zoom-enabled",
                   productOnSale: "price--on-sale",
                   productUnitAvailable: "price--unit-available",
                   productUnavailable: "price--unavailable",
                   productSoldOut: "price--sold-out",
                   variantSoldOut: "product-form--variant-sold-out",
               }),
               (this._isPgvertical = e.querySelector("[data-product-single-media-group]").classList.contains("pg-vertical")),
               (this.thumbsIsVertical = this._isPgvertical && 992 <= window.innerWidth),
               (this.eventHandlers = {}),
               (this.quantityInput = e.querySelector(this.selectors.quantity)),
               (this.errorMessageWrapper = e.querySelector(this.selectors.errorMessageWrapper)),
               (this.addToCart = e.querySelector(this.selectors.addToCart)),
               (this.addToCartText = this.addToCart.querySelector(this.selectors.addToCartText)),
               (this.shopifyPaymentButton = e.querySelector(this.selectors.shopifyPaymentButton)),
               (this.productPolicies = e.querySelector(this.selectors.productPolicies)),
               (this.storeAvailabilityContainer = e.querySelector(this.selectors.storeAvailabilityContainer)),
               this.storeAvailabilityContainer && this._initStoreAvailability(),
               (this.loader = this.addToCart.querySelector(this.selectors.loader)),
               (this.loaderStatus = e.querySelector(this.selectors.loaderStatus)),
               (this.imageZoomWrapper = e.querySelectorAll(this.selectors.imageZoomWrapper));
           var a = document.getElementById("ProductJson-" + t);
           a &&
               a.innerHTML.length &&
               ((this.productSingleObject = JSON.parse(a.innerHTML)),
               (this.settings.zoomEnabled = !!(0 < this.imageZoomWrapper.length) && this.imageZoomWrapper[0].classList.contains(this.classes.jsZoomEnabled)),
               (this.initMobileBreakpoint = this._initMobileBreakpoint.bind(this)),
               (this.initDesktopBreakpoint = this._initDesktopBreakpoint.bind(this)),
               (this.mqlSmall = window.matchMedia(this.settings.mediaQuerySmall)),
               this.mqlSmall.addListener(this.initMobileBreakpoint),
               (this.mqlMediumUp = window.matchMedia(this.settings.mediaQueryMediumUp)),
               this.mqlMediumUp.addListener(this.initDesktopBreakpoint),
               this.initMobileBreakpoint(),
               this.initDesktopBreakpoint(),
               this._stringOverrides(),
               this._initVariants(),
               this._initSwatches(),
               this._initMediaSwitch(),
               this._initImageCarousel(),
               this._initThumbnailSlider(),
               this._initImagesPopup(),
               this._initSidebar(),
               this._initStockCountdown(),
               this._visitorCounter(),
               this._totalSold(),
               this._initAskProduct(),
               this._initReviewScroll(),
               this._initGroupedProduct(),
               this._checkoutCart(),
               this._initAddToCart(),
               this._setActiveThumbnail(),
               this._initProductVideo(),
               this._initModelViewerLibraries(),
               this._initShopifyXrLaunch(),
               Fastor.countdown(".product-countdown"),
               Fastor.initReviews());
       }
       return (
           (r.prototype = Object.assign({}, r.prototype, {
               _initGroupedProduct: function () {
                   var e = $(this.selectors.groupedProduct);
                   0 == e.length ||
                       ($(document).on("change", this.selectors.groupedCheckbox, function () {
                           $(this).is(":checked") ? $($(this).data("id")).removeClass("hide") : $($(this).data("id")).addClass("hide"), Fastor.updateGroupedPrice();
                       }),
                       0 < $(this.selectors.groupedButton).length && $(this.selectors.groupedButton).unbind("click"),
                       $(document).on("click", this.selectors.groupedButton, function () {
                           var t = $(this);
                           return (
                               t.find("i").addClass("position-static").addClass("loading"),
                               t.prop("disable", !0),
                               (Shopify.queue = []),
                               e.find(".grouped-checkbox").each(function () {
                                   if ($(this).is(":checked")) {
                                       var e = $($(this).data("id")).find("form .product__form_variant_id").val();
                                       null !== e && Shopify.queue.push({ variantId: e, quantity: 1 });
                                   }
                               }),
                               (Shopify.moveAlong = function () {
                                   if (Shopify.queue.length)
                                       var e = Shopify.queue.shift(),
                                           a = $.ajax({
                                               type: "POST",
                                               url: "/cart/add.js",
                                               async: !0,
                                               cache: !1,
                                               data: { quantity: e.quantity, id: e.variantId },
                                               dataType: "json",
                                               beforeSend: function () {},
                                               complete: function () {
                                                   Fastor.updateCart();
                                               },
                                               error: function (e) {
                                                   var t = $.parseJSON(e.responseText),
                                                       a = t.message + ": " + t.description;
                                                   alert(a);
                                               },
                                               success: function (e) {
                                                   Fastor.setupCartPopup(e), Shopify.moveAlong();
                                               },
                                           });
                                   else t.find("i").removeClass("position-static").removeClass("loading"), t.prop("disable", !1), Fastor.openAlert("check", theme.strings.groupedProductsAdded);
                               }),
                               Shopify.moveAlong(),
                               !1
                           );
                       }));
               },
               _initReviewScroll: function () {
                   $(".write-review-link:not(.quickview)").on("click", function (t) {
                       t.preventDefault();
                       var e = $(this).attr("href");
                       return $("html, body").animate({ scrollTop: $(e).offset().top - 50 }, 1e3), !1;
                   });
               },
               _initAskProduct: function () {
                   $(".btn-ask").magnificPopup({
                       type: "inline",
                       preloader: !1,
                       focus: "#name",
                       callbacks: {
                           beforeOpen: function () {
                               $(".btn-ask").find("i").addClass("position-static").addClass("loading"), $(".btn-ask").prop("disable", !0);
                           },
                           open: function () {
                               $(".btn-ask").find("i").removeClass("position-static").removeClass("loading"), $(".btn-ask").prop("disable", !1);
                           },
                       },
                   });
               },
               _totalSold: function () {
                   if ($(this.selectors.totalSold).length) {
                       var e = $(this.selectors.totalSold),
                           t = e.data("qty_min"),
                           r = e.data("qty_max"),
                           o = e.data("time_min"),
                           s = e.data("time_max");
                       (t = a(t)), (r = i(r)), (o = a(o)), (s = i(s));
                       var n = i(Math.random() * (r - t + 1)) + t;
                       (n = parseInt(n)), n <= t && (n = t), n > r && (n = r), e.html(e.html().replace("/count/", n));
                       var l = i(Math.random() * (s - o + 1)) + o;
                       (l = parseInt(l)),
                           l <= o && (l = o),
                           l > s && (l = s),
                           e.html(e.html().replace("/time/", l)),
                           e.addClass("active"),
                           e.find("img").first().length &&
                               setInterval(function () {
                                   e.find("img")
                                       .first()
                                       .fadeIn(function () {
                                           $(this).css("visibility", "visible");
                                       })
                                       .delay(1600)
                                       .fadeIn(function () {
                                           $(this).css("visibility", "hidden");
                                       })
                                       .delay(400);
                               }, 2e3);
                   }
               },
               _visitorCounter: function () {
                   if ($(this.selectors.visitorCounter).length) {
                       var s = $(this.selectors.visitorCounter),
                           d = 1,
                           c = s.data("max"),
                           p = s.data("interval"),
                           u = d,
                           m = c;
                       (u = a(u)), (m = i(m));
                       var g = i(Math.random() * (m - u + 1)) + u,
                           y = ["1", "2", "4", "3", "6", "10", "-1", "-3", "-2", "-4", "-6"],
                           n = "",
                           v = "",
                           f = ["10", "20", "15"],
                           n = "",
                           v = "",
                           l = "";
                       setInterval(function () {
                           if (((n = i(Math.random() * y.length)), (v = y[n]), (g = parseInt(g) + parseInt(v)), d >= g)) {
                               l = i(Math.random() * f.length);
                               var e = f[l];
                               g += e;
                           }
                           (1 > g || g > c) && (g = i(Math.random() * (m - u + 1)) + u), s.find("strong").first().text(parseInt(g)), s.addClass("active");
                       }, 1e3 * p);
                   }
               },
               _initStockCountdown: function () {
                   if ($(this.selectors.stockCountdown).length) {
                       var e = this,
                           t = $(e.selectors.stockCountdown);
                       if (t.hasClass("is-fake")) {
                           function e(e, t) {
                               return i(Math.random() * (t - e + 1) + e);
                           }
                           function l() {
                               t.find(".stock-countdown-message").first().html(theme.strings.onlyLeft.replace("{{ count }}", o)),
                                   (s = setTimeout(function () {
                                       o--, 1 > o && (o = e(a, r)), t.find(".stock-countdown-message strong").text(o), d(), o < a && clearTimeout(s);
                                   }, 3000)),
                                   (n = setInterval(function () {
                                       o--, 1 > o && (o = e(a, r)), t.find(".stock-countdown-message strong").text(o), d(), o < a && clearInterval(n);
                                   }, 102000));
                           }
                           function d() {
                               var e = (100 * o) / 60;
                               t.find(".progress-bar span").css("width", e + "%");
                           }
                           var a = t.data("min"),
                               r = t.data("max"),
                               o = e(a, r),
                               s = null,
                               n = null;
                           l(), t.hasClass("is-visible") && t.removeClass("hide");
                       }
                   }
               },
               _updateStockCountdown: function (e) {
                   var t = $(this.selectors.stockCountdown);
                   t.hasClass("is-fake")
                       ? t.removeClass("hide")
                       : (t.find(".stock-countdown-message").first().html(theme.strings.onlyLeft.replace("{{ count }}", e)),
                         t.find(".progress-bar span").first().css("width", "100%"),
                         t.removeClass("hide"),
                         setTimeout(function () {
                             t.find(".progress-bar span").first().css("width", "28%");
                         }, 500));
               },
               _checkoutCart: function () {
                   var e = this,
                       t = $(e.selectors.cartAgree);
                   0 == t.length ||
                       ($(document).on("DOMNodeInserted", e.selectors.cartCheckout, function () {
                           var e = $(this);
                           setTimeout(function () {
                               var a = e.find(".shopify-payment-button__button");
                               a.length &&
                                   (e.hide(),
                                   setTimeout(function () {
                                       t.is(":checked") ? a.removeClass("btn-disabled") : a.addClass("btn-disabled"), e.fadeIn();
                                   }, 300));
                           }, 0);
                       }),
                       $(document).on("change", e.selectors.cartAgree, function () {
                           var t = $(this),
                               a = $(e.selectors.cartCheckout).find(".shopify-payment-button__button");
                           t.is(":checked") ? a.removeClass("btn-disabled") : a.addClass("btn-disabled");
                       }));
               },
               _stringOverrides: function () {
                   (theme.productStrings = theme.productStrings || {}), (theme.strings = Object.assign({}, theme.strings, theme.productStrings));
               },
               _initStoreAvailability: function () {
                   this.storeAvailability = new theme.StoreAvailability(this.storeAvailabilityContainer);
               },
               _initSidebar: function () {
                   0 < $(".sticky-sidebar").length && Fastor.stickySidebar(".sticky-sidebar");
               },
               _initImagesPopup: function () {
                   function e() {
                       var e,
                           t = [],
                           a = $(".product-single");
                       return (
                           (e = a.find(".product-single-carousel").length
                               ? a.find(".product-single-carousel .owl-item:not(.cloned) img.feature-row__image")
                               : a.find(".product-gallery-carousel").length
                               ? a.find(".product-gallery-carousel .owl-item:not(.cloned) img.feature-row__image")
                               : a.find(".product-gallery img.feature-row__image")),
                           e.length &&
                               e.each(function () {
                                   var e = $(this).data("zoomImage"),
                                       a = $(this).data("width"),
                                       i = $(this).data("height");
                                   t.push({ src: e, w: a, h: i, title: !1 });
                               }),
                           t
                       );
                   }
                   var t = this,
                       a = $(".pswp")[0];
                   $(document).off("click", t.selectors.productImagesPopup),
                       $(document).on("click", t.selectors.productImagesPopup, function (t) {
                           t.preventDefault();
                           var i = $(".product-single"),
                               r = i.find(".product-single-carousel").data("owl.carousel"),
                               o = r ? r.items()[r.current()].find(".feature-row__image").attr("data-photoswipe_index") : $(this).parent().find(".feature-row__image").attr("data-photoswipe_index");
                           var s = new PhotoSwipe(a, PhotoSwipeUI_Default, e(), { index: o, closeOnScroll: !1 });
                           s.init(),
                               s.listen("imageLoadComplete", function () {
                                   $("body").addClass("blurred");
                               }),
                               s.listen("close", function () {
                                   $("body").removeClass("blurred");
                               });
                       });
               },
               _initImageCarousel: function () {
                   Slider.presets["product-gallery-carousel"] = { dots: !1, nav: !0, margin: 20, items: 1, responsive: { 576: { items: 2 }, 768: { items: 3 } }, onInitialized: Slider.zoomImage, onRefreshed: Slider.zoomImageRefresh };
                   var e = this,
                       t = this.selectors.productImagesPopup.replace(".", ""),
                       a = $(this.selectors.productImageCarousel);
                   "complete" === Fastor.status && Fastor.slider(a),
                       a.on("initialized.owl.carousel", function () {
                           e.isQuickview || (!a.hasClass("product-gallery-carousel") && a.append('<a href="#" class="product-image-full ' + t + '"><i class="fas fa-expand"></i></a>'));
                       });
               },
               recalcDetailsHeight: function (e) {
                   e.find(".product-details").css("height", 767 < window.innerWidth ? e.find(".product-gallery")[0].clientHeight : "");
               },
               _initThumbnailSlider: function () {
                   function e() {
                       var e = s.offset().top + s[0].offsetHeight,
                           t = o.offset().top + m;
                       t >= e + p[0].offsetHeight
                           ? (o.css("top", parseInt(o.css("top")) - p[0].offsetHeight), n.removeClass("disabled"))
                           : t > e
                           ? (o.css("top", parseInt(o.css("top")) - a(t - e)), n.removeClass("disabled"), l.addClass("disabled"))
                           : l.addClass("disabled");
                   }
                   function t() {
                       var e = s.offset().top,
                           t = o.offset().top;
                       t <= e - p[0].offsetHeight
                           ? (o.css("top", parseInt(o.css("top")) + p[0].offsetHeight), l.removeClass("disabled"))
                           : t < e
                           ? (o.css("top", parseInt(o.css("top")) - a(t - e)), l.removeClass("disabled"), n.addClass("disabled"))
                           : n.addClass("disabled");
                   }
                   var i = this,
                       r = i.$wrapper;
                   if (document.querySelector(this.selectors.productThumbs)) {
                       var o = $(this.selectors.productThumbs),
                           s = o.parent(),
                           n = s.find(".thumb-up"),
                           l = s.find(".thumb-down"),
                           d = o.children(),
                           c = d.length,
                           p = d.eq(0),
                           u = this.thumbsIsVertical;
                       if (this.thumbsIsVertical) {
                           o.hasClass("owl-carousel") && o.trigger("destroy.owl.carousel").removeClass("owl-carousel");
                           var m = p[0].offsetHeight * c + parseInt(p.css("margin-bottom")) * (c - 1);
                           n.addClass("disabled"), l.toggleClass("disabled", m <= s[0].offsetHeight);
                       } else
                           o.hasClass("owl-carousel") ||
                               o.addClass("owl-carousel").owlCarousel($.extend(!0, {}, { margin: 0, items: 4, dots: !1, nav: !0, navText: ['<i class="fas fa-chevron-left">', '<i class="fas fa-chevron-right">'] }));
                       l.on("click", function () {
                           u && e();
                       }),
                           n.on("click", function () {
                               u && t();
                           });
                   }
               },
               _setActiveThumbnail: function (e) {
                   var t = $(this.selectors.productThumbs);
                   if ("undefined" != typeof e && t) {
                       var t = $(this.selectors.productThumbs),
                           a = t.children(),
                           i = a.length,
                           r = a.eq(0),
                           o = this.thumbsIsVertical,
                           s = a.eq(e);
                       if (o) {
                           a.filter(".active").removeClass("active"), s.addClass("active");
                           var n = r[0].offsetHeight * i + parseInt(r.css("margin-bottom")) * (i - 1),
                               l = parseInt(t.css("top")) + e * n;
                           0 > l ? t.css("top", parseInt(t.css("top")) - l) : ((l = t.offset().top + t[0].offsetHeight - s.offset().top - s[0].offsetHeight), 0 > l && t.css("top", parseInt(t.css("top")) + l));
                       } else t.find(".product-thumb").filter(".active").removeClass("active"), t.find(".product-thumb").eq(e).addClass("active"), t.trigger("to.owl.carousel", e, 100);
                   }
               },
               _initMobileBreakpoint: function () {
                   this.mqlSmall.matches
                       ? (this.settings.zoomEnabled &&
                             this.imageZoomWrapper.forEach(
                                 function (e, t) {
                                     this._destroyZoom(t);
                                 }.bind(this)
                             ),
                         (this.settings.bpSmall = !0))
                       : (this.settings.bpSmall = !1);
               },
               _initDesktopBreakpoint: function () {
                   this.mqlMediumUp.matches &&
                       this.settings.zoomEnabled &&
                       this.imageZoomWrapper.forEach(
                           function (e, t) {
                               this._enableZoom(e, t);
                           }.bind(this)
                       );
               },
               _initVariants: function () {
                   var e = {
                       container: this.container,
                       enableHistoryState: this.container.getAttribute("data-enable-history-state") || !1,
                       singleOptionSelector: this.selectors.singleOptionSelector,
                       originalSelectorId: this.selectors.originalSelectorId,
                       product: this.productSingleObject,
                   };
                   (this.variants = new slate.Variants(e)),
                       this.storeAvailability && this.variants.currentVariant.available && this.storeAvailability.updateContent(this.variants.currentVariant.id),
                       (this.eventHandlers.updateAvailability = this._updateAvailability.bind(this)),
                       (this.eventHandlers.updateMedia = this._updateMedia.bind(this)),
                       (this.eventHandlers.updatePrice = this._updatePrice.bind(this)),
                       (this.eventHandlers.updateSKU = this._updateSKU.bind(this)),
                       this.container.addEventListener("variantChange", this.eventHandlers.updateAvailability),
                       this.container.addEventListener("variantImageChange", this.eventHandlers.updateMedia),
                       this.container.addEventListener("variantPriceChange", this.eventHandlers.updatePrice),
                       this.container.addEventListener("variantSKUChange", this.eventHandlers.updateSKU);
               },
               _initSwatches: function () {
                   function e(l, t, e) {
                       if (1 < l.options.length)
                           for (var r = 0; r < l.options.length; r++)
                               r != t &&
                                   a.container.querySelectorAll(o + "-" + r + " option").forEach(function (a) {
                                       var o = "unavailable",
                                           s = a.getAttribute("value"),
                                           d = a.getAttribute("data-swatch");
                                       for (j = 0; j < l.variants.length; j++) {
                                           var c = l.variants[j];
                                           if (c.options[t] != e) continue;
                                           else if (c.options[r] == s) {
                                               o = !0 == c.available ? "available" : "sold_out";
                                               break;
                                           }
                                       }
                                       var n = a.closest(i).querySelector(".swatch-element." + d);
                                       n.classList.remove("available"), n.classList.remove("sold_out"), n.classList.remove("unavailable"), n.classList.add(o);
                                   });
                       else
                           for (var r = 0; r < l.options.length; r++)
                               a.container.querySelectorAll(o + "-0 option").forEach(function (e) {
                                   var t = "unavailable",
                                       a = e.getAttribute("value"),
                                       o = e.getAttribute("data-swatch");
                                   for (j = 0; j < l.variants.length; j++)
                                       if (l.variants[j].options[r] == a) {
                                           t = l.variants[j].available ? "available" : "sold_out";
                                           break;
                                       }
                                   var s = e.closest(i).querySelector(".swatch-element." + o);
                                   s.classList.remove("available"), s.classList.remove("sold_out"), s.classList.remove("unavailable"), s.classList.add(t);
                               });
                   }
                   var t = this.container.querySelectorAll(this.selectors.singleOptionSwatchesRadio);
                   if (0 != t.length) {
                       var a = this,
                           i = this.selectors.singleOptionSwatchesWrapper,
                           r = this.productSingleObject,
                           o = this.selectors.singleOptionSelectorId;
                       t.forEach(
                           function (t) {
                               t.addEventListener(
                                   "click",
                                   function (t) {
                                       t.preventDefault();
                                       var a = t.target.getAttribute("data-value"),
                                           o = t.target.closest(i).querySelector("select"),
                                           s = o.value;
                                       if (s != a) {
                                           (o.value = a),
                                               o.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 })),
                                               t.target
                                                   .closest(i)
                                                   .querySelectorAll(".swatch-radio")
                                                   .forEach(function (e) {
                                                       e.classList.remove("selected");
                                                   }),
                                               t.target
                                                   .closest(i)
                                                   .querySelectorAll("label")
                                                   .forEach(function (e) {
                                                       e.classList.remove("label-selected");
                                                   }),
                                               Fastor.Utils.getParents(t.target, "label")[0].classList.add("label-selected");
                                           var n = this,
                                               l = t.target.getAttribute("data-swatch"),
                                               d = t.target.getAttribute("data-poption"),
                                               c = t.target.getAttribute("data-value");
                                           e(r, d, c, l, n);
                                       }
                                   }.bind(this)
                               );
                           }.bind(this)
                       );
                   }
               },
               _initMediaSwitch: function () {
                   var t = this;
                   if (document.querySelector(this.selectors.productImageCarousel) && document.querySelector(this.selectors.productThumbs)) {
                       var a = $(this.selectors.productThumbs),
                           i = a.children(),
                           r = $(this.selectors.productImageCarousel);
                       i.on("click", function () {
                           var e = $(this),
                               t = (e.parent().filter(a).length ? e : e.parent()).index();
                           r.trigger("to.owl.carousel", t, 1);
                       }),
                           (this.eventHandlers.handleMediaFocus = this._handleMediaFocus.bind(this)),
                           r
                               .on("translate.owl.carousel", function (a) {
                                   var e = a.item.index;
                                   t._setActiveThumbnail(e);
                               })
                               .on("translated.owl.carousel", function (a) {
                                   var e = $(a.target).find(".owl-item").eq(a.item.index).find(t.selectors.productMediaWrapper).data("mediaId");
                                   t._setActiveMedia(e);
                               });
                   }
               },
               _showErrorMessage: function (e) {
                   var t = this.container.querySelector(this.selectors.errorMessage);
                   (t.innerHTML = e),
                       this.quantityInput && this.quantityInput.classList.add(this.classes.inputError),
                       this.errorMessageWrapper.classList.remove(this.classes.hidden),
                       this.errorMessageWrapper.setAttribute("aria-hidden", !0),
                       this.errorMessageWrapper.removeAttribute("aria-hidden");
               },
               _hideErrorMessage: function () {
                   this.errorMessageWrapper.classList.add(this.classes.hidden), this.quantityInput && this.quantityInput.classList.remove(this.classes.inputError);
               },
               _initAddToCart: function () {
                   var e = this.addToCart,
                       t = this.container.querySelector(this.selectors.productForm);
                   t.addEventListener(
                       "submit",
                       function (a) {
                           if ("true" === this.addToCart.getAttribute("aria-disabled")) return void a.preventDefault();
                           if ("direct" != theme.addToCartType) {
                               a.preventDefault(), (this.previouslyFocusedElement = document.activeElement);
                               var i = !!this.quantityInput && 0 >= this.quantityInput.value;
                               return i ? void this._showErrorMessage(theme.strings.quantityMinimumMessage) : !i && this.ajaxEnabled ? (Fastor.handleButtonLoadingState(e, !0), void Fastor.handleCartForm(e, t)) : void 0;
                           }
                       }.bind(this)
                   );
               },
               _initProductVideo: function () {
                   var e = this.settings.sectionId,
                       t = this.container.querySelectorAll(this.selectors.productMediaTypeVideo);
                   t.forEach(function (t) {
                       theme.ProductVideo.init(t, e);
                   });
               },
               _initModelViewerLibraries: function () {
                   var e = this.container.querySelectorAll(this.selectors.productMediaTypeModel);
                   1 > e.length || theme.ProductModel.init(e, this.settings.sectionId);
               },
               _initShopifyXrLaunch: function () {
                   (this.eventHandlers.initShopifyXrLaunchHandler = this._initShopifyXrLaunchHandler.bind(this)), document.addEventListener("shopify_xr_launch", this.eventHandlers.initShopifyXrLaunchHandler);
               },
               _initShopifyXrLaunchHandler: function () {
                   var e = this.container.querySelector(this.selectors.productMediaWrapper);
                   e.dispatchEvent(new CustomEvent("xrLaunch", { bubbles: !0, cancelable: !0 }));
               },
               _switchMedia: function (e) {
                   var t = this;
                   if (document.querySelector(t.selectors.productImageCarousel)) {
                       var a = $(t.selectors.productImageCarousel);
                       if (!document.querySelector(t.selectors.productThumbImages)) {
                           var i = $('[data-media-id="' + e + '"]')
                               .parent()
                               .index();
                           a.trigger("to.owl.carousel", i, 100);
                       } else
                           $(t.selectors.productThumbImages + '[data-thumbnail-id="' + e + '"]')
                               .closest(t.selectors.productThumbListItem)
                               .trigger("click");
                   }
               },
               _setActiveMedia: function (e) {
                   var t = this,
                       a = t.container.querySelectorAll(t.selectors.productMediaWrapper + ":not([data-media-id='" + e + "'])");
                   a.forEach(
                       function (e) {
                           e.dispatchEvent(new CustomEvent("mediaHidden", { bubbles: !0, cancelable: !0 })), e.classList.remove("media-active");
                       }.bind(this)
                   );
                   var i = t.container.querySelector(t.selectors.productMediaWrapper + "[data-media-id='" + e + "']");
                   i && (i.dispatchEvent(new CustomEvent("mediaVisible", { bubbles: !0, cancelable: !0 })), i.classList.add("media-active"));
               },
               _handleMediaFocus: function (e) {
                   if (e.keyCode === slate.utils.keyboardKeys.ENTER) {
                       var t = e.currentTarget.getAttribute("data-thumbnail-id"),
                           a = this.container.querySelector(this.selectors.productMediaWrapper + "[data-media-id='" + t + "']");
                       a.focus();
                   }
               },
               _liveRegionText: function (e) {
                   var t = "[Availability] [Regular] [$$] [Sale] [$]. [UnitPrice] [$$$]";
                   if (!e) return (t = theme.strings.unavailable), t;
                   var a = e.available ? "" : theme.strings.soldOut + ",";
                   t = t.replace("[Availability]", a);
                   var i = "",
                       r = theme.Currency.formatMoney(e.price, theme.moneyFormat),
                       o = "",
                       s = "",
                       n = "",
                       l = "";
                   return (
                       e.compare_at_price > e.price &&
                           ((i = theme.strings.regularPrice), (r = theme.Currency.formatMoney(e.compare_at_price, theme.moneyFormat) + ","), (o = theme.strings.sale), (s = theme.Currency.formatMoney(e.price, theme.moneyFormat))),
                       e.unit_price && ((n = theme.strings.unitPrice), (l = theme.Currency.formatMoney(e.unit_price, theme.moneyFormat) + " " + theme.strings.unitPriceSeparator + " " + this._getBaseUnit(e))),
                       (t = t.replace("[Regular]", i).replace("[$$]", r).replace("[Sale]", o).replace("[$]", s).replace("[UnitPrice]", n).replace("[$$$]", l).trim()),
                       t
                   );
               },
               _updateLiveRegion: function (e) {
                   var t = e.detail.variant,
                       a = this.container.querySelector(this.selectors.productStatus);
                   (a.innerHTML = this._liveRegionText(t)),
                       a.setAttribute("aria-hidden", !1),
                       setTimeout(function () {
                           a.setAttribute("aria-hidden", !0);
                       }, 1e3);
               },
               _updateAddToCart: function (e) {
                   var t = e.detail.variant,
                       a = this.container.querySelector(this.selectors.addToCartText),
                       i = this.container.querySelector(this.selectors.productForm);
                   this._updateStock(t),
                       t
                           ? t.available
                               ? (this.addToCart.removeAttribute("aria-disabled"),
                                 this.addToCart.setAttribute("aria-label", theme.strings.addToCart),
                                 (a.innerHTML = theme.strings.addToCart),
                                 i.classList.remove(this.classes.variantSoldOut))
                               : (this.addToCart.setAttribute("aria-disabled", !0), this.addToCart.setAttribute("aria-label", theme.strings.soldOut), (a.innerHTML = theme.strings.soldOut), i.classList.add(this.classes.variantSoldOut))
                           : (this.addToCart.setAttribute("aria-disabled", !0), this.addToCart.setAttribute("aria-label", theme.strings.unavailable), (a.innerHTML = theme.strings.unavailable), i.classList.add(this.classes.variantSoldOut));
               },
               _updateAvailability: function (e) {
                   this._hideErrorMessage(), this._updateStoreAvailabilityContent(e), this._updateAddToCart(e), this._updateLiveRegion(e), this._updatePrice(e);
               },
               _updateStoreAvailabilityContent: function (e) {
                   if (this.storeAvailability) {
                       var t = e.detail.variant;
                       t && t.available ? this.storeAvailability.updateContent(t.id) : this.storeAvailability.clearContent();
                   }
               },
               _updateMedia: function (e) {
                   var t = e.detail.variant,
                       a = t.featured_media.id,
                       i = this.settings.sectionId + "-" + a;
                   this._switchMedia(i);
               },
               _updatePrice: function (e) {
                   var t = e.detail.variant,
                       a = this.container.querySelector(this.selectors.priceContainer),
                       i = a.querySelectorAll(this.selectors.regularPrice),
                       r = a.querySelector(this.selectors.salePrice),
                       o = a.querySelector(this.selectors.unitPrice),
                       s = a.querySelector(this.selectors.unitPriceBaseUnit),
                       n = function (e, t) {
                           e.innerHTML = theme.Currency.formatMoney(t, theme.moneyFormat);
                       };
                   return (
                       a.classList.remove(this.classes.productUnavailable, this.classes.productOnSale, this.classes.productUnitAvailable, this.classes.productSoldOut),
                       a.removeAttribute("aria-hidden"),
                       this.productPolicies && this.productPolicies.classList.remove(this.classes.visibilityHidden),
                       t
                           ? void (!t.available && a.classList.add(this.classes.productSoldOut),
                             t.compare_at_price > t.price
                                 ? (i.forEach(function (e) {
                                       n(e, t.compare_at_price);
                                   }),
                                   (r.innerHTML = theme.Currency.formatMoney(t.price, theme.moneyFormat)),
                                   a.classList.add(this.classes.productOnSale))
                                 : (r.innerHTML = theme.Currency.formatMoney(t.price, theme.moneyFormat)),
                             t.unit_price && ((o.innerHTML = theme.Currency.formatMoney(t.unit_price, theme.moneyFormat)), (s.innerHTML = this._getBaseUnit(t)), a.classList.add(this.classes.productUnitAvailable)))
                           : (a.classList.add(this.classes.productUnavailable), a.setAttribute("aria-hidden", !0), void (this.productPolicies && this.productPolicies.classList.add(this.classes.visibilityHidden)))
                   );
               },
               _getBaseUnit: function (e) {
                   return 1 === e.unit_price_measurement.reference_value ? e.unit_price_measurement.reference_unit : e.unit_price_measurement.reference_value + e.unit_price_measurement.reference_unit;
               },
               _updateStock: function (e) {
                   var t = document.querySelector(this.selectors.stock);
                   return t
                       ? e
                           ? void (null == $(this.selectors.ProductVariantJson).data("stock_" + e.id)
                                 ? (t.innerHTML = theme.strings.unavailable)
                                 : "in-stock" == $(this.selectors.ProductVariantJson).data("stock_" + e.id)
                                 ? (t.innerHTML = theme.strings.inStock)
                                 : (t.innerHTML = theme.strings.soldOut))
                           : void (t.innerHTML = theme.strings.unavailable)
                       : void 0;
               },
               _updateSKU: function (e) {
                   var t = e.detail.variant,
                       a = document.querySelector(this.selectors.SKU);
                   a && (a.innerHTML = t.sku);
               },
               _enableZoom: function (e, t) {
                   this.zoomPictures[t] = new theme.Zoom(e);
               },
               _destroyZoom: function (e) {
                   0 === this.zoomPictures.length || this.zoomPictures[e].unload();
               },
               onUnload: function () {
                   this.container.removeEventListener("variantChange", this.eventHandlers.updateAvailability),
                       this.container.removeEventListener("variantImageChange", this.eventHandlers.updateMedia),
                       this.container.removeEventListener("variantPriceChange", this.eventHandlers.updatePrice),
                       this.container.removeEventListener("variantSKUChange", this.eventHandlers.updateSKU),
                       theme.ProductVideo.removeSectionVideos(this.settings.sectionId),
                       theme.ProductModel.removeSectionModels(this.settings.sectionId),
                       this.mqlSmall && this.mqlSmall.removeListener(this.initMobileBreakpoint),
                       this.mqlMediumUp && this.mqlMediumUp.removeListener(this.initDesktopBreakpoint);
               },
           })),
           r
       );
   })()),
   (window.theme = window.theme || {}),
   (theme.Cart = (function () {
       function e(e) {
           (this.container = e),
               (this.containerSelect = "#" + e.id),
               (this.thumbnails = this.container.querySelectorAll(t.thumbnails)),
               (this.quantityInputs = this.container.querySelectorAll(t.inputQty)),
               (this.ajaxEnabled = "true" === this.container.getAttribute("data-ajax-enabled")),
               (this._handleInputQty = theme.Helpers.debounce(this._handleInputQty.bind(this), 500)),
               (this._onNoteChange = this._onNoteChange.bind(this)),
               (this._onRemoveItem = this._onRemoveItem.bind(this)),
               theme.Helpers.cookiesEnabled() || this.container.classList.add(a.cartNoCookies),
               this.thumbnails.forEach(function (e) {
                   e.style.cursor = "pointer";
               }),
               this.container.addEventListener("click", this._handleThumbnailClick),
               on(this.containerSelect, "change", t.quantityInput, this._handleInputQty.bind(this)),
               (this.mql = window.matchMedia(r)),
               this.ajaxEnabled && (this.container.addEventListener("click", this._onRemoveItem), this.container.addEventListener("change", this._onNoteChange), this._setupCartTemplates());
       }
       var t = {
               cartCount: "[data-cart-count]",
               cartCountBubble: "[data-cart-count-bubble]",
               cartDiscount: "[data-cart-discount]",
               cartDiscountTitle: "[data-cart-discount-title]",
               cartDiscountAmount: "[data-cart-discount-amount]",
               cartDiscountWrapper: "[data-cart-discount-wrapper]",
               cartErrorMessage: "[data-cart-error-message]",
               cartErrorMessageWrapper: "[data-cart-error-message-wrapper]",
               cartItem: "[data-cart-item]",
               cartItemDetails: "[data-cart-item-details]",
               cartItemDiscount: "[data-cart-item-discount]",
               cartItemDiscountedPriceGroup: "[data-cart-item-discounted-price-group]",
               cartItemDiscountTitle: "[data-cart-item-discount-title]",
               cartItemDiscountAmount: "[data-cart-item-discount-amount]",
               cartItemDiscountList: "[data-cart-item-discount-list]",
               cartItemFinalPrice: "[data-cart-item-final-price]",
               cartItemImage: "[data-cart-item-image]",
               cartItemLinePrice: "[data-cart-item-line-price]",
               cartItemOriginalPrice: "[data-cart-item-original-price]",
               cartItemPrice: "[data-cart-item-price]",
               cartItemPriceList: "[data-cart-item-price-list]",
               cartItemProperty: "[data-cart-item-property]",
               cartItemPropertyName: "[data-cart-item-property-name]",
               cartItemPropertyValue: "[data-cart-item-property-value]",
               cartItemRegularPriceGroup: "[data-cart-item-regular-price-group]",
               cartItemRegularPrice: "[data-cart-item-regular-price]",
               cartItemTitle: "[data-cart-item-title]",
               cartItemOption: "[data-cart-item-option]",
               cartItemSellingPlanName: "[data-cart-item-selling-plan-name]",
               cartLineItems: "[data-cart-line-items]",
               cartNote: "[data-cart-notes]",
               cartQuantityErrorMessage: "[data-cart-quantity-error-message]",
               cartQuantityErrorMessageWrapper: "[data-cart-quantity-error-message-wrapper]",
               cartRemove: "[data-cart-remove]",
               cartStatus: "[data-cart-status]",
               cartSubtotal: "[data-cart-subtotal]",
               cartTotal: "[data-cart-total]",
               cartTableCell: "[data-cart-table-cell]",
               cartWrapper: "[data-cart-wrapper]",
               emptyPageContent: "[data-empty-page-content]",
               quantityInput: "[data-quantity-input]",
               quantityInputDesktop: "[data-quantity-input-desktop]",
               quantityLabelDesktop: "[data-quantity-label-desktop]",
               inputQty: "[data-quantity-input]",
               thumbnails: ".cart__image",
               unitPrice: "[data-unit-price]",
               unitPriceBaseUnit: "[data-unit-price-base-unit]",
               unitPriceGroup: "[data-unit-price-group]",
           },
           a = { cartNoCookies: "cart--no-cookies", cartRemovedProduct: "cart__removed-product", thumbnails: "cart__image", hide: "hide", inputError: "input--error" },
           i = {
               cartItemIndex: "data-cart-item-index",
               cartItemKey: "data-cart-item-key",
               cartItemQuantity: "data-cart-item-quantity",
               cartItemTitle: "data-cart-item-title",
               cartItemUrl: "data-cart-item-url",
               quantityItem: "data-quantity-item",
           },
           r = "(min-width: " + theme.breakpoints.medium + "px)";
       return (
           (e.prototype = Object.assign({}, e.prototype, {
               _setupCartTemplates: function () {
                   var e = this.container.querySelector(t.cartItem);
                   e &&
                       ((this.itemTemplate = this.container.querySelector(t.cartItem).cloneNode(!0)),
                       (this.itemDiscountTemplate = this.itemTemplate.querySelector(t.cartItemDiscount).cloneNode(!0)),
                       (this.cartDiscountTemplate = this.container.querySelector(t.cartDiscount).cloneNode(!0)),
                       (this.itemPriceListTemplate = this.itemTemplate.querySelector(t.cartItemPriceList).cloneNode(!0)),
                       (this.itemOptionTemplate = this.itemTemplate.querySelector(t.cartItemOption).cloneNode(!0)),
                       (this.itemPropertyTemplate = this.itemTemplate.querySelector(t.cartItemProperty).cloneNode(!0)),
                       (this.itemSellingPlanNameTemplate = this.itemTemplate.querySelector(t.cartItemSellingPlanName).cloneNode(!0)));
               },
               _handleInputQty: function (e) {
                   if (e.target.hasAttribute("data-quantity-input")) {
                       document.querySelector(".shop-table").classList.add("table-loading");
                       var a = e.target,
                           i = a.closest(t.cartItem),
                           r = +a.getAttribute("data-quantity-item"),
                           o = this.container.querySelectorAll("[data-quantity-item='" + r + "']"),
                           s = parseInt(a.value),
                           n = !(0 > s || isNaN(s));
                       return (
                           o.forEach(function (e) {
                               e.value = s;
                           }),
                           this._hideCartError(),
                           this._hideQuantityErrorMessage(),
                           n ? void (n && this.ajaxEnabled && this._updateItemQuantity(r, i, o, s)) : void this._showQuantityErrorMessages(i)
                       );
                   }
               },
               _updateItemQuantity: function (e, a, r, o) {
                   var s = a.getAttribute(i.cartItemKey),
                       n = +a.getAttribute(i.cartItemIndex),
                       l = { method: "POST", headers: { "Content-Type": "application/json;" }, body: JSON.stringify({ line: n, quantity: o }) };
                   fetch("/cart/change.js", l)
                       .then(function (e) {
                           return document.querySelector(".shop-table").classList.remove("table-loading"), e.json();
                       })
                       .then(
                           function (e) {
                               if ((Fastor.updateCart(), !e.item_count)) return void this._emptyCart();
                               if ((this._createCart(e), !o)) return void this._showRemoveMessage(a.cloneNode(!0));
                               var i = document.querySelector("[data-cart-item-key='" + s + "']"),
                                   r = this.getItem(s, e),
                                   n = t.quantityInputDesktop;
                               this._updateLiveRegion(r), i && i.querySelector(n).focus();
                           }.bind(this)
                       );
               },
               getItem: function (e, t) {
                   return t.items.find(function (t) {
                       return t.key === e;
                   });
               },
               _liveRegionText: function (e) {
                   var t = theme.strings.update + ": [QuantityLabel]: [Quantity], [Regular] [$$] [DiscountedPrice] [$]. [PriceInformation]";
                   t = t.replace("[QuantityLabel]", theme.strings.quantity).replace("[Quantity]", e.quantity);
                   var a = "",
                       i = theme.Currency.formatMoney(e.original_line_price, theme.moneyFormat),
                       r = "",
                       o = "",
                       s = "";
                   return (
                       e.original_line_price > e.final_line_price &&
                           ((a = theme.strings.regularTotal), (r = theme.strings.discountedTotal), (o = theme.Currency.formatMoney(e.final_line_price, theme.moneyFormat)), (s = theme.strings.priceColumn)),
                       (t = t.replace("[Regular]", a).replace("[$$]", i).replace("[DiscountedPrice]", r).replace("[$]", o).replace("[PriceInformation]", s).trim()),
                       t
                   );
               },
               _updateLiveRegion: function (e) {
                   if (e) {
                       var a = this.container.querySelector(t.cartStatus);
                       (a.textContent = this._liveRegionText(e)),
                           a.setAttribute("aria-hidden", !1),
                           setTimeout(function () {
                               a.setAttribute("aria-hidden", !0);
                           }, 1e3);
                   }
               },
               _createCart: function (e) {
                   var i = this._createCartDiscountList(e),
                       r = this.container.querySelector(t.cartLineItems);
                   (r.innerHTML = ""),
                       this._createLineItemList(e).forEach(function (e) {
                           r.appendChild(e);
                       }),
                       (this.cartNotes = this.cartNotes || this.container.querySelector(t.cartNote)),
                       this.cartNotes && (this.cartNotes.value = e.note);
                   var o = this.container.querySelector(t.cartDiscountWrapper);
                   0 === i.length
                       ? ((o.innerHTML = ""), o.classList.add(a.hide))
                       : ((o.innerHTML = ""),
                         i.forEach(function (e) {
                             o.appendChild(e);
                         }),
                         o.classList.remove(a.hide)),
                       (this.container.querySelector(t.cartSubtotal).textContent = theme.Currency.formatMoney(e.total_price, theme.moneyFormatWithCurrency)),
                       (this.container.querySelector(t.cartTotal).textContent = theme.Currency.formatMoney(e.total_price, theme.moneyFormatWithCurrency));
               },
               _createCartDiscountList: function (e) {
                   return e.cart_level_discount_applications.map(
                       function (e) {
                           var a = this.cartDiscountTemplate.cloneNode(!0);
                           return (a.querySelector(t.cartDiscountTitle).textContent = e.title), (a.querySelector(t.cartDiscountAmount).textContent = theme.Currency.formatMoney(e.total_allocated_amount, theme.moneyFormat)), a;
                       }.bind(this)
                   );
               },
               _createLineItemList: function (e) {
                   return e.items.map(
                       function (e, a) {
                           var i = this.itemTemplate.cloneNode(!0),
                               r = this.itemPriceListTemplate.cloneNode(!0);
                           this._setLineItemAttributes(i, e, a), this._setLineItemImage(i, e.featured_image);
                           var o = i.querySelector(t.cartItemTitle);
                           (o.textContent = e.product_title), o.setAttribute("href", e.url);
                           var s = e.selling_plan_allocation ? e.selling_plan_allocation.selling_plan.name : null,
                               n = this._createProductDetailsList(e.product_has_only_default_variant, e.options_with_values, e.properties, s);
                           this._setProductDetailsList(i, n),
                               this._setItemRemove(i, e.title),
                               (r.innerHTML = this._createItemPrice(e.original_price, e.final_price).outerHTML),
                               e.unit_price_measurement && r.appendChild(this._createUnitPrice(e.unit_price, e.unit_price_measurement)),
                               this._setItemPrice(i, r);
                           var l = this._createItemDiscountList(e);
                           this._setItemDiscountList(i, l), this._setQuantityInputs(i, e, a);
                           var d = this._createItemPrice(e.original_line_price, e.final_line_price);
                           return this._setItemLinePrice(i, d), i;
                       }.bind(this)
                   );
               },
               _setLineItemAttributes: function (e, t, a) {
                   e.setAttribute(i.cartItemKey, t.key), e.setAttribute(i.cartItemUrl, t.url), e.setAttribute(i.cartItemTitle, t.title), e.setAttribute(i.cartItemIndex, a + 1), e.setAttribute(i.cartItemQuantity, t.quantity);
               },
               _setLineItemImage: function (e, i) {
                   var r = e.querySelector(t.cartItemImage),
                       o = null === i.url ? null : theme.Images.getSizedImageUrl(i.url, "x190");
                   o ? (r.setAttribute("alt", i.alt), r.setAttribute("src", o), r.classList.remove(a.hide)) : r.parentNode.removeChild(r);
               },
               _setProductDetailsList: function (e, i) {
                   var r = e.querySelector(t.cartItemDetails);
                   return i.length
                       ? (r.classList.remove(a.hide),
                         void (r.innerHTML = i.reduce(function (e, t) {
                             return e + t.outerHTML;
                         }, "")))
                       : void (r.classList.add(a.hide), (r.textContent = ""));
               },
               _setItemPrice: function (e, a) {
                   e.querySelector(t.cartItemPrice).innerHTML = a.outerHTML;
               },
               _setItemDiscountList: function (e, i) {
                   var r = e.querySelector(t.cartItemDiscountList);
                   0 === i.length
                       ? ((r.innerHTML = ""), r.classList.add(a.hide))
                       : ((r.innerHTML = i.reduce(function (e, t) {
                             return e + t.outerHTML;
                         }, "")),
                         r.classList.remove(a.hide));
               },
               _setItemRemove: function (e, a) {
                   e.querySelector(t.cartRemove).setAttribute("aria-label", theme.strings.removeLabel.replace("[product]", a));
               },
               _setQuantityInputs: function (e, a, r) {
                   var o = e.querySelector(t.quantityInputDesktop);
                   o.setAttribute("id", "updates_large_" + a.key), o.setAttribute(i.quantityItem, r + 1), (o.value = a.quantity), e.querySelector(t.quantityLabelDesktop).setAttribute("for", "updates_large_" + a.key);
               },
               _setItemLinePrice: function (e, a) {
                   e.querySelector(t.cartItemLinePrice).innerHTML = a.outerHTML;
               },
               _createProductDetailsList: function (e, t, a, i) {
                   var r = [];
                   return e || (r = r.concat(this._getOptionList(t))), i && (r = r.concat(this._getSellingPlanName(i))), null !== a && 0 !== Object.keys(a).length && (r = r.concat(this._getPropertyList(a))), r;
               },
               _getOptionList: function (e) {
                   return e.map(
                       function (e) {
                           var t = this.itemOptionTemplate.cloneNode(!0);
                           return (t.textContent = e.name + ": " + e.value), t.classList.remove(a.hide), t;
                       }.bind(this)
                   );
               },
               _getPropertyList: function (e) {
                   var i = null === e ? [] : Object.entries(e),
                       r = i.filter(function (e) {
                           return "_" !== e[0].charAt(0) && 0 !== e[1].length;
                       });
                   return r.map(
                       function (e) {
                           var i = this.itemPropertyTemplate.cloneNode(!0);
                           return (
                               (i.querySelector(t.cartItemPropertyName).textContent = e[0] + ": "),
                               -1 === e[0].indexOf("/uploads/")
                                   ? (i.querySelector(t.cartItemPropertyValue).textContent = e[1])
                                   : (i.querySelector(t.cartItemPropertyValue).innerHTML = '<a href="' + e[1] + '"> ' + e[1].split("/").pop() + "</a>"),
                               i.classList.remove(a.hide),
                               i
                           );
                       }.bind(this)
                   );
               },
               _getSellingPlanName: function (e) {
                   var t = this.itemSellingPlanNameTemplate.cloneNode(!0);
                   return (t.textContent = e), t.classList.remove(a.hide), t;
               },
               _createItemPrice: function (e, i) {
                   var r,
                       o = theme.Currency.formatMoney(e, theme.moneyFormat);
                   return (
                       e === i
                           ? ((r = this.itemPriceListTemplate.querySelector(t.cartItemRegularPriceGroup).cloneNode(!0)), (r.querySelector(t.cartItemRegularPrice).innerHTML = o))
                           : ((r = this.itemPriceListTemplate.querySelector(t.cartItemDiscountedPriceGroup).cloneNode(!0)),
                             (r.querySelector(t.cartItemOriginalPrice).innerHTML = o),
                             (r.querySelector(t.cartItemFinalPrice).innerHTML = theme.Currency.formatMoney(i, theme.moneyFormat))),
                       r.classList.remove(a.hide),
                       r
                   );
               },
               _createUnitPrice: function (e, i) {
                   var r = this.itemPriceListTemplate.querySelector(t.unitPriceGroup).cloneNode(!0),
                       o = (1 === i.reference_value ? "" : i.reference_value) + i.reference_unit;
                   return (r.querySelector(t.unitPriceBaseUnit).textContent = o), (r.querySelector(t.unitPrice).innerHTML = theme.Currency.formatMoney(e, theme.moneyFormat)), r.classList.remove(a.hide), r;
               },
               _createItemDiscountList: function (e) {
                   return e.line_level_discount_allocations.map(
                       function (e) {
                           var a = this.itemDiscountTemplate.cloneNode(!0);
                           return (a.querySelector(t.cartItemDiscountTitle).textContent = e.discount_application.title), (a.querySelector(t.cartItemDiscountAmount).textContent = theme.Currency.formatMoney(e.amount, theme.moneyFormat)), a;
                       }.bind(this)
                   );
               },
               _showQuantityErrorMessages: function (e) {
                   e.querySelectorAll(t.cartQuantityErrorMessage).forEach(function (e) {
                       e.textContent = theme.strings.quantityMinimumMessage;
                   }),
                       e.querySelectorAll(t.cartQuantityErrorMessageWrapper).forEach(function (e) {
                           e.classList.remove(a.hide);
                       }),
                       e.querySelectorAll(t.inputQty).forEach(function (e) {
                           e.classList.add(a.inputError), e.focus();
                       });
               },
               _hideQuantityErrorMessage: function () {
                   var e = document.querySelectorAll(t.cartQuantityErrorMessageWrapper);
                   e.forEach(function (e) {
                       e.classList.add(a.hide), (e.querySelector(t.cartQuantityErrorMessage).textContent = "");
                   }),
                       this.container.querySelectorAll(t.inputQty).forEach(function (e) {
                           e.classList.remove(a.inputError);
                       });
               },
               _handleThumbnailClick: function (e) {
                   e.target.classList.contains(a.thumbnails) && (window.location.href = e.target.closest(t.cartItem).getAttribute("data-cart-item-url"));
               },
               _onNoteChange: function (e) {
                   if (e.target.hasAttribute("data-cart-notes")) {
                       var t = e.target.value;
                       this._hideCartError(), this._hideQuantityErrorMessage();
                       var a = new Headers({ "Content-Type": "application/json" }),
                           i = { method: "POST", headers: a, body: JSON.stringify({ note: t }) };
                       fetch("/cart/update.js", i).catch(
                           function () {
                               this._showCartError(e.target);
                           }.bind(this)
                       );
                   }
               },
               _showCartError: function (e) {
                   (document.querySelector(t.cartErrorMessage).textContent = theme.strings.cartError), document.querySelector(t.cartErrorMessageWrapper).classList.remove(a.hide), e && e.focus();
               },
               _hideCartError: function () {
                   document.querySelector(t.cartErrorMessageWrapper).classList.add(a.hide), (document.querySelector(t.cartErrorMessage).textContent = "");
               },
               _onRemoveItem: function (e) {
                   if (e.target.hasAttribute("data-cart-remove")) {
                       e.preventDefault();
                       var a = e.target.closest(t.cartItem),
                           r = +a.getAttribute(i.cartItemIndex);
                       this._hideCartError();
                       var o = { method: "POST", headers: { "Content-Type": "application/json;" }, body: JSON.stringify({ line: r, quantity: 0 }) };
                       fetch("/cart/change.js", o)
                           .then(function (e) {
                               return e.json();
                           })
                           .then(
                               function (e) {
                                   0 === e.item_count ? this._emptyCart() : (this._createCart(e), this._showRemoveMessage(a.cloneNode(!0))), Fastor.updateCart();
                               }.bind(this)
                           )
                           .catch(
                               function () {
                                   this._showCartError(null);
                               }.bind(this)
                           );
                   }
               },
               _showRemoveMessage: function (e) {
                   var t = e.getAttribute("data-cart-item-index"),
                       a = this._getRemoveMessage(e);
                   0 == t - 1
                       ? this.container.querySelector('[data-cart-item-index="1"]').insertAdjacentHTML("beforebegin", a.outerHTML)
                       : this.container.querySelector("[data-cart-item-index='" + (t - 1) + "']").insertAdjacentHTML("afterend", a.outerHTML),
                       this.container.querySelector("[data-removed-item-row]").focus();
               },
               _getRemoveMessage: function (e) {
                   var i = this._formatRemoveMessage(e),
                       r = e.querySelector(t.cartTableCell).cloneNode(!0);
                   return (
                       r.removeAttribute("class"),
                       r.classList.add(a.cartRemovedProduct),
                       r.setAttribute("colspan", "6"),
                       (r.innerHTML = i),
                       e.setAttribute("role", "alert"),
                       e.setAttribute("tabindex", "-1"),
                       e.setAttribute("data-removed-item-row", !0),
                       (e.innerHTML = r.outerHTML),
                       e
                   );
               },
               _formatRemoveMessage: function (e) {
                   var t = e.getAttribute("data-cart-item-quantity"),
                       a = e.getAttribute(i.cartItemUrl),
                       r = e.getAttribute(i.cartItemTitle);
                   return theme.strings.removedItemMessage.replace("[quantity]", t).replace("[link]", '<a href="' + a + '" class="text-link text-link--accent">' + r + "</a>");
               },
               _emptyCart: function () {
                   (this.emptyPageContent = this.emptyPageContent || this.container.querySelector(t.emptyPageContent)),
                       (this.cartWrapper = this.cartWrapper || this.container.querySelector(t.cartWrapper)),
                       this.emptyPageContent.classList.remove(a.hide),
                       this.cartWrapper.classList.add(a.hide);
               },
           })),
           e
       );
   })()),
   (theme.ShippingCalculator = (function () {
       function ShippingCalculator(e) {
           var t = (this.$container = $(e)),
               a = t.attr("data-section-id");
           (this.selectors = {
               shipping_btn: "#cart__shipping-btn-" + a,
               shipping_calculator: "#shipping__calculator-" + a,
               get_rates: "#shipping__calculator-btn-" + a,
               response: "#shipping__calculator-response-" + a,
               template: '<p id ="shipping-rates-feedback-' + a + '" class="shipping-rates-feedback"></p>',
               address_country: "address_country-" + a,
               address_province: "address_province-" + a,
               address_zip: "address_zip-" + a,
               address_province_label: "address_province_label-" + a,
               address_province_container: "address_province_container-" + a,
           }),
               (this.strings = { submitButton: theme.strings.shippingButton, submitButtonDisabled: theme.strings.shippingButtonDisabled, customerIsLoggedIn: theme.settings.customerIsLoggedIn, moneyFormat: theme.settings.moneyFormat }),
               this._init();
       }
       return (
           (ShippingCalculator.prototype = Object.assign({}, ShippingCalculator.prototype, {
               _disableButtons: function () {
                   var e = this.selectors,
                       t = this.strings;
                   $(e.get_rates).text(t.submitButtonDisabled).attr("disabled", "disabled").addClass("disabled");
               },
               _enableButtons: function () {
                   var e = this.selectors,
                       t = this.strings;
                   $(e.get_rates).removeAttr("disabled").removeClass("disabled").text(t.submitButton);
               },
               _render: function (e) {
                   var t = this.selectors,
                       a = this.strings,
                       i = $(t.template),
                       r = $(t.response);
                   if (r.length) {
                       if (!e.success) i.addClass("error"), i.append(e.errorFeedback);
                       else if ((i.addClass("success"), e.rates)) {
                           i.append(e.rates);
                           var o = e.rates;
                           if (o[0]) {
                               var s = o[0];
                               i.append(theme.strings.rateStartAt + '<span class="money ml-1">' + s.price + "</span>.");
                           }
                       } else i.append(theme.strings.doNotShip);
                       i.appendTo(r);
                   }
               },
               _onCartShippingRatesUpdate: function (e, t) {
                   var a = this,
                       r = this.selectors,
                       o = this.strings;
                   a._enableButtons();
                   var s = "";
                   if ((t.zip && (s += t.zip + ", "), t.province && (s += t.province + ", "), (s += t.country), e.length)) for (var n = 0; n < e.length; n++) e[n].price = theme.Currency.formatMoney(e[n].price, theme.moneyFormat);
                   a._render({ rates: e, address: s, success: !0 }), $(r.response).fadeIn();
               },
               _pollForCartShippingRatesForDestination: function (e) {
                   var t = this,
                       a = this.selectors,
                       i = this.strings,
                       r = function () {
                           $.ajax("/cart/async_shipping_rates", {
                               dataType: "json",
                               success: function (a, i, o) {
                                   200 === o.status ? t._onCartShippingRatesUpdate(a.shipping_rates, e) : setTimeout(r, 500);
                               },
                               error: function (e, a) {
                                   t._onError(e, a, t);
                               },
                           });
                       };
                   return r;
               },
               _fullMessagesFromErrors: function (e) {
                   var t = this.selectors,
                       a = this.strings,
                       i = [];
                   return (
                       $.each(e, function (e, t) {
                           $.each(t, function (t, a) {
                               i.push(e + " " + a);
                           });
                       }),
                       i
                   );
               },
               _onError: function (XMLHttpRequest, textStatus, self) {
                   var selectors = self.selectors,
                       strings = self.strings;
                   self._enableButtons();
                   var feedback = "",
                       data = eval("(" + XMLHttpRequest.responseText + ")");
                   (feedback = data.message ? data.message + "(" + data.status + "): " + data.description : "Error : " + self._fullMessagesFromErrors(data).join("; ") + "."),
                       "Error : country is not supported." === feedback && (feedback = theme.strings.doNotShip),
                       self._render({ rates: [], errorFeedback: feedback, success: !1 }),
                       $(selectors.response).show();
               },
               _getCartShippingRatesForDestination: function (e) {
                   var t = this,
                       a = this.selectors,
                       i = this.strings;
                   $.ajax({
                       type: "POST",
                       url: "/cart/prepare_shipping_rates",
                       data: $.param({ shipping_address: e }),
                       success: t._pollForCartShippingRatesForDestination(e),
                       error: function (e, a) {
                           t._onError(e, a, t);
                       },
                   });
               },
               _init: function () {
                   var e = this,
                       t = this.selectors,
                       a = this.strings;
                   if ($(t.shipping_calculator).length) {
                       new Shopify.CountryProvinceSelector(t.address_country, t.address_province, { hideElement: t.address_province_container });
                       var i = $("#" + t.address_country),
                           r = $("#" + t.address_province_label).get(0);
                       "undefined" != typeof Countries &&
                           (Countries.updateProvinceLabel(i.val(), r),
                           i.change(function () {
                               Countries.updateProvinceLabel(i.val(), r);
                           })),
                           $(t.get_rates).off("click"),
                           $(t.get_rates).click(function () {
                               e._disableButtons(), $(t.response).empty().hide();
                               var a = {};
                               (a.zip = $("#" + t.address_zip).val() || ""), (a.country = $("#" + t.address_country).val() || ""), (a.province = $("#" + t.address_province).val() || ""), e._getCartShippingRatesForDestination(a);
                           }),
                           a.customerIsLoggedIn && $(t.get_rates + ":eq(0)").trigger("click"),
                           $(t.shipping_btn).off("click"),
                           $(t.shipping_btn).click(function () {
                               $(t.shipping_calculator).slideToggle();
                           });
                   }
               },
           })),
           ShippingCalculator
       );
   })()),
   (window.theme = window.theme || {}),
   (theme.customerTemplates = (function () {
       function e() {
           (this.recoverHeading = document.querySelector(l.RecoverHeading)), (this.recoverEmail = document.querySelector(l.RecoverEmail)), (this.loginHeading = document.querySelector(l.LoginHeading));
           var e = document.getElementById("RecoverPassword"),
               o = document.getElementById("RecoverPasswordHeader"),
               s = document.getElementById("register-agree"),
               n = document.getElementById("HideRecoverPasswordLinkHeader"),
               d = document.getElementById("HideRecoverPasswordLink");
           $("a.login.popup-modal:not(.logged), .login-link").on("click", function (t) {
               t.preventDefault(), Fastor.popup({ items: { src: $(this).attr("href"), type: "inline" }, tLoading: "", mainClass: "popup-module mfp-with-zoom", removalDelay: 200 }, "login");
           }),
               $(".register-link").on("click", function (t) {
                   t.preventDefault(),
                       Fastor.popup(
                           {
                               items: { src: $(this).attr("href") },
                               callbacks: {
                                   ajaxContentAdded: function () {
                                       this.wrap.find('[href="#register"]').click();
                                   },
                               },
                           },
                           "login"
                       );
               }),
               s &&
                   s.addEventListener(
                       "change",
                       function (e) {
                           e.preventDefault(), !0 == e.target.checked ? document.querySelector(".btn-signup").classList.remove("btn-disabled") : document.querySelector(".btn-signup").classList.add("btn-disabled");
                       }.bind(this)
                   ),
               o &&
                   o.addEventListener(
                       "click",
                       function (e) {
                           e.preventDefault(), t();
                       }.bind(this)
                   ),
               e &&
                   e.addEventListener(
                       "click",
                       function (e) {
                           e.preventDefault(), i(), this.recoverHeading.setAttribute("tabindex", "-1"), this.recoverHeading.focus();
                       }.bind(this)
                   ),
               n &&
                   n.addEventListener(
                       "click",
                       function (e) {
                           e.preventDefault(), a();
                       }.bind(this)
                   ),
               d &&
                   d.addEventListener(
                       "click",
                       function (e) {
                           e.preventDefault(), r(), this.loginHeading.setAttribute("tabindex", "-1"), this.loginHeading.focus();
                       }.bind(this)
                   ),
               this.recoverHeading &&
                   this.recoverHeading.addEventListener("blur", function (e) {
                       e.target.removeAttribute("tabindex");
                   }),
               this.loginHeading &&
                   this.loginHeading.addEventListener("blur", function (e) {
                       e.target.removeAttribute("tabindex");
                   });
       }
       function t() {
           document.getElementById("RecoverPasswordFormHeader").classList.remove("hide"),
               document.getElementById("CustomerLoginFormHeader").classList.add("hide"),
               "true" === this.recoverEmail.getAttribute("aria-invalid") && this.recoverEmail.focus();
       }
       function a() {
           document.getElementById("RecoverPasswordFormHeader").classList.add("hide"), document.getElementById("CustomerLoginFormHeader").classList.remove("hide");
       }
       function i() {
           document.getElementById("RecoverPasswordForm").classList.remove("hide"), document.getElementById("CustomerLoginForm").classList.add("hide"), "true" === this.recoverEmail.getAttribute("aria-invalid") && this.recoverEmail.focus();
       }
       function r() {
           document.getElementById("RecoverPasswordForm").classList.add("hide"), document.getElementById("CustomerLoginForm").classList.remove("hide");
       }
       function o() {
           var e = document.querySelector(".reset-password-success");
           if (e) {
               var t = document.getElementById("ResetSuccess");
               t.classList.remove("hide"), t.focus();
           }
       }
       function s() {
           var e = document.getElementById("AddressNewForm"),
               t = document.getElementById("AddressNewButton");
           e &&
               (Shopify && new Shopify.CountryProvinceSelector("AddressCountryNew", "AddressProvinceNew", { hideElement: "AddressProvinceContainerNew" }),
               document.querySelectorAll(".address-country-option").forEach(function (e) {
                   var t = e.dataset.formId;
                   new Shopify.CountryProvinceSelector("AddressCountry_" + t, "AddressProvince_" + t, { hideElement: "AddressProvinceContainer_" + t });
               }),
               document.querySelectorAll(".address-new-toggle").forEach(function (a) {
                   a.addEventListener("click", function () {
                       var a = "true" === t.getAttribute("aria-expanded");
                       e.classList.toggle("hide"), t.setAttribute("aria-expanded", !a), t.focus();
                   });
               }),
               document.querySelectorAll(".address-edit-toggle").forEach(function (e) {
                   e.addEventListener("click", function (e) {
                       var t = e.target.dataset.formId,
                           a = document.getElementById("EditFormButton_" + t),
                           i = document.getElementById("EditAddress_" + t),
                           r = "true" === a.getAttribute("aria-expanded");
                       i.classList.toggle("hide"), a.setAttribute("aria-expanded", !r), a.focus();
                   });
               }),
               document.querySelectorAll(".address-delete").forEach(function (e) {
                   e.addEventListener("click", function (e) {
                       var t = e.target.dataset.target,
                           a = e.target.dataset.confirmMessage;
                       confirm(a || "Are you sure you wish to delete this address?") && Shopify.postLink(t, { parameters: { _method: "delete" } });
                   });
               }));
       }
       function n() {
           var e = window.location.hash;
           "#recover" === e && i.bind(this)();
       }
       var l = { RecoverHeading: "#RecoverHeading", RecoverEmail: "#RecoverEmail", LoginHeading: "#LoginHeading" };
       return {
           init: function () {
               e(), n(), o(), s();
           },
       };
   })()),
   (window.theme = window.theme || {}),
   (theme.BlogSection = (function () {
       function e(e) {
           var t = (this.sectionId = e.dataset.sectionId);
           (this.container = e), (this.sectionNamspace = "#" + t), this._init();
       }
       return (
           (e.prototype = Object.assign({}, e.prototype, {
               _init: function () {
                   Fastor.menu.initFilterMenu(), Fastor.stickySidebar(".sticky-sidebar"), Fastor.isotopes(this.sectionNamspace + " .grid:not(.grid-float)");
               },
           })),
           e
       );
   })()),
   (theme.ArticleSection = (function () {
       function e(e) {
           var t = (this.sectionId = e.dataset.sectionId);
           (this.container = e), (this.sectionNamspace = "#" + t), this._init();
       }
       return (
           (e.prototype = Object.assign({}, e.prototype, {
               _init: function () {
                   Fastor.slider(this.sectionNamspace + " .owl-carousel");
               },
           })),
           e
       );
   })()),
   (theme.PageAboutSection = (function () {
       function e(e) {
           var t = (this.sectionId = e.dataset.sectionId);
           (this.container = e), (this.sectionNamspace = "#" + t), this._init();
       }
       return (
           (e.prototype = Object.assign({}, e.prototype, {
               _init: function () {
                   Fastor.slider(this.sectionNamspace + " .owl-carousel");
               },
           })),
           e
       );
   })()),
   (function (t) {
       (Fastor.handleCartForm = function (e, t) {
           fetch("/cart/add.js", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/x-www-form-urlencoded", "X-Requested-With": "XMLHttpRequest" }, body: theme.Helpers.serialize(t) })
               .then(function (e) {
                   return e.json();
               })
               .then(function (t) {
                   if (t.status && 200 !== t.status) {
                       var a = new Error(t.description);
                       throw ((a.isFromServer = !0), a);
                   }
                   Fastor.hideErrorMessage(), Fastor.handleButtonLoadingState(e, !1), Fastor.setupCartPopup(t);
               })
               .catch(function (t) {
                   Fastor.handleButtonLoadingState(e, !1), Fastor.showErrorMessage(t.isFromServer && t.message.length ? t.message : theme.strings.cartError), void 0;
               });
       }),
           (Fastor.handleButtonLoadingState = function (e, t) {
               t
                   ? (e.classList.add("position-relative"), null != e.querySelector("i") && (e.querySelector("i").classList.add("position-static"), e.querySelector("i").classList.add("loading"), (e.disabled = !0)))
                   : ((e.disabled = !1), e.classList.remove("position-relative"), null != e.querySelector("i") && (e.querySelector("i").classList.remove("position-static"), e.querySelector("i").classList.remove("loading")));
           }),
           (Fastor.setupCartPopup = function (e) {
               var t = e.selling_plan_allocation ? e.selling_plan_allocation.selling_plan.name : null,
                   a = Fastor.getProductDetails(e.product_has_only_default_variant, e.options_with_values, e.properties, t),
                   i = "",
                   r = "";
               null !== e.featured_image.url && ((i = theme.Images.getSizedImageUrl(e.featured_image.url, "200x")), (r = 0 <= e.featured_image.alt.indexOf("<iframe") ? e.product_title : e.featured_image.alt));
               var o = theme.strings.cartSuccess + '<a href="/cart" class="btn btn-link btn-sm">' + theme.strings.cartView + '<i class="la la-shopping-cart"></i></a>',
                   s = e.product_title,
                   n = e.url,
                   l = (l = '<div class="price">' + theme.Currency.formatMoney(e.final_price, theme.moneyFormat) + "</div>");
               Fastor.updateCart(), Fastor.notifpopup.open({ message: o, productClass: " product-cart product-cart-success", name: s, nameLink: n, imageSrc: i, imageAlt: r, imageLink: n, productDetails: a, price: l });
           }),
           (Fastor.getProductDetails = function (e, t, a, i) {
               var r = "";
               if (!e) {
                   var o = "";
                   t.forEach(function (e) {
                       o = o + '<div class="product-details__item product-details__item--variant-option">' + e.name + ": " + e.value + "</div>";
                   }),
                       (r += o);
               }
               if (i) {
                   r += '<div class="product-details__item product-details__item--property">' + i + "</div>";
               }
               if (null !== a && 0 !== Object.keys(a).length) {
                   var s = "",
                       n = null === a ? [] : Object.entries(a),
                       l = n.filter(function (e) {
                           return "_" !== e[0].charAt(0) && 0 !== e[1].length;
                       });
                   l.map(
                       function (e) {
                           if (-1 === e[0].indexOf("/uploads/")) var t = e[1];
                           else var t = '<a href="' + e[1] + '"> ' + e[1].split("/").pop() + "</a>";
                           s = s + '<div class="product-details__item product-details__item--property">' + e[0] + ": " + t + "</div>";
                       }.bind(this)
                   ),
                       (r += s);
               }
               return r;
           }),
           (Fastor.hideErrorMessage = function () {}),
           (Fastor.showErrorMessage = function (e) {
               Fastor.notifpopup.open({ message: e, productClass: " product-cart product-cart-error", name: "", nameLink: "", imageSrc: "", imageLink: "", price: "", count: "" });
           }),
           (Fastor.updateCart = function () {
               fetch("/search?view=cart&direct=false")
                   .then(function (e) {
                       return e.text();
                   })
                   .then(function (e) {
                       document.querySelectorAll(".cart-dropdown").forEach(function (t) {
                           var a = new DOMParser(),
                               i = a.parseFromString(e, "text/html");
                           t.classList.contains("is__mobile_menu_item") ? (t.querySelector(".cart-count-mobile-bottom").innerHTML = i.querySelector(".cart-count").innerHTML) : (t.innerHTML = i.querySelector(".cart-dropdown").innerHTML);
                       }),
                           Fastor.handleCartDropDown();
                   })
                   .catch(function () {});
           }),
           (Fastor.handleCartDropDown = function () {
               var e = document.querySelectorAll(".cart__remove");
               e.forEach(
                   function (e) {
                       e.addEventListener(
                           "click",
                           function (e) {
                               e.preventDefault();
                               var t = e.target.closest("[data-cart-item]"),
                                   a = +t.getAttribute("data-cart-item-index"),
                                   i = { method: "POST", headers: { "Content-Type": "application/json;" }, body: JSON.stringify({ line: a, quantity: 0 }) };
                               fetch("/cart/change.js", i)
                                   .then(function (e) {
                                       return e.json();
                                   })
                                   .then(
                                       function () {
                                           Fastor.updateCart();
                                       }.bind(this)
                                   );
                           }.bind(this)
                       );
                   }.bind(this)
               );
           }),
           (Fastor.handlePopup = function () {
               t(document).off("click", ".fastor-popup-open"),
                   t(document).on("click", ".fastor-popup-open", function (a) {
                       a.preventDefault();
                       var e = this,
                           i = e.getAttribute("data-handle"),
                           r = e.getAttribute("data-wrapper");
                       t.ajax({
                           url: "/search",
                           data: { view: "fastorpopup", type: "product", q: i, direct: "false" },
                           dataType: "html",
                           type: "GET",
                           beforeSend: function () {
                               e.classList.remove("added"), e.classList.add("adding"), e.querySelector("i").classList.add("position-static"), e.querySelector("i").classList.add("loading"), (e.disabled = !0);
                           },
                           complete: function () {
                               e.classList.remove("adding"), e.querySelector("i").classList.remove("position-static"), e.querySelector("i").classList.remove("loading"), (e.disabled = !1);
                           },
                           success: function (e) {
                               if (e && e.length) {
                                   t("body").addClass("fastor__modal-opened");
                                   var a = t(".fastor__modal");
                                   a.removeClass("opened"), a.find(".fastor__modal-content").empty().html(e), a.addClass("opened"), t("body").addClass(r);
                               }
                           },
                       });
                   }),
                   t(document).off("click", ".fastor__modal-close"),
                   t(document).on("click", ".fastor__modal-close", function (a) {
                       a.preventDefault(), t("body").removeClass("fastor__modal-opened"), t(".fastor__modal").removeClass("opened");
                   });
           }),
           (Fastor.openAlert = function (e, a, i) {
               "undefined" == typeof i && (i = !1), t(".alert-message").remove();
               var r =
                   '<div class="alert-popup"><div class="alert alert-' +
                   ("check" == e ? "success" : "error") +
                   ' alert-message d-flex"><div class="alert__icon mr-2"><i class="la la-' +
                   e +
                   '"></i></div><div class="alert__content">' +
                   a +
                   "</div></div></div>";
               !0 == i &&
                   (r =
                       '<div class="alert-popup"><div class="alert alert-message show cart_message"><div class="alert__background" style="background-image:url(' +
                       e +
                       ');"></div><div class="alert__description">' +
                       a +
                       "</div></div></div>"),
                   t("body .page-wrapper").append(r),
                   setTimeout(function () {
                       document.querySelector(".alert-message").classList.add("show");
                   }, 500),
                   setTimeout(function () {
                       document.querySelector(".alert-message").classList.remove("show"), (document.querySelector(".alert-popup").innerHTML = "");
                   }, 2e3);
           }),
           (Fastor.addWishlist = function () {
               return (
                   !!t(".addwishlist_btn").length &&
                   void (t(document).off("click", ".addwishlist_btn:not(.added)"),
                   t(document).on("click", ".addwishlist_btn:not(.added)", function (e) {
                       e.preventDefault();
                       var a = this,
                           i = t(this),
                           r = parseInt(i.data("customer_id"));
                       if (0 < r) {
                           var o = i.data("shop_domain"),
                               s = parseInt(i.data("product_id")),
                               n = i.data("product_handle").toString();
                           if (o.length && n.length && s) {
                               var l = document.createElement("form");
                               l.setAttribute("action", "/contact"), l.setAttribute("method", "POST"), l.setAttribute("style", "display:none");
                               var d = document.createElement("input");
                               d.setAttribute("type", "hidden"), d.setAttribute("name", "customer"), d.setAttribute("value", r);
                               var c = document.createElement("input");
                               c.setAttribute("type", "hidden"), c.setAttribute("name", "shop"), c.setAttribute("value", o);
                               var p = document.createElement("input");
                               p.setAttribute("type", "hidden"), p.setAttribute("name", "id"), p.setAttribute("value", s);
                               var u = document.createElement("input");
                               u.setAttribute("type", "hidden"), u.setAttribute("name", "handle"), u.setAttribute("value", n);
                               var m = document.createElement("input");
                               m.setAttribute("type", "hidden"),
                                   m.setAttribute("name", "action"),
                                   m.setAttribute("value", "add_wishlist"),
                                   l.appendChild(d),
                                   l.appendChild(c),
                                   l.appendChild(p),
                                   l.appendChild(u),
                                   l.appendChild(m),
                                   t("body").append(l);
                               var g = t(l).serialize();
                               t.ajax({
                                   type: "POST",
                                   url: "/a/wishlist",
                                   async: !0,
                                   cache: !1,
                                   data: g,
                                   dataType: "json",
                                   beforeSend: function () {
                                       a.classList.add("adding"), a.querySelector("i").classList.add("position-static"), a.querySelector("i").classList.add("loading"), (a.disabled = !0);
                                   },
                                   complete: function () {
                                       a.classList.remove("adding"), a.querySelector("i").classList.remove("position-static"), a.querySelector("i").classList.remove("loading"), (a.disabled = !1);
                                   },
                                   success: function (e) {
                                       if ((Fastor.openAlert("check", theme.strings.wishlistAdded), i.addClass("added").find("span").text(i.data("added")), i.addClass("added").attr("title", i.data("added")), t(l).remove(), 1 == e.code)) {
                                           var a = parseInt(e.json);
                                           a ? 0 < t(".wishlist__count").length && t(".wishlist__count").removeClass("hide").text(a) : 0 < t(".wishlist__count").length && t(".wishlist__count").addClass("hide").text(0);
                                       }
                                   },
                               });
                           }
                       } else window.location = "/account/login";
                   }))
               );
           }),
           (Fastor.pageWishlist = function () {
               return (
                   !!t(".removewishlist_btn").length &&
                   void (t(document).off("click", ".removewishlist_btn"),
                   t(document).on("click", ".removewishlist_btn", function () {
                       var e = t(this),
                           a = parseInt(e.data("customer_id"));
                       if (0 < a) {
                           var i = e.data("shop_domain"),
                               r = parseInt(e.data("product_id"));
                           if (i.length && r) {
                               var o = document.createElement("form");
                               o.setAttribute("action", "/contact"), o.setAttribute("method", "POST"), o.setAttribute("style", "display:none");
                               var s = document.createElement("input");
                               s.setAttribute("type", "hidden"), s.setAttribute("name", "customer"), s.setAttribute("value", a);
                               var n = document.createElement("input");
                               n.setAttribute("type", "hidden"), n.setAttribute("name", "shop"), n.setAttribute("value", i);
                               var l = document.createElement("input");
                               l.setAttribute("type", "hidden"), l.setAttribute("name", "product"), l.setAttribute("value", r);
                               var d = document.createElement("input");
                               d.setAttribute("type", "hidden"), d.setAttribute("name", "action"), d.setAttribute("value", "remove_wishlist"), o.appendChild(s), o.appendChild(n), o.appendChild(l), o.appendChild(d), t("body").append(o);
                               var c = t(o).serialize();
                               t.ajax({
                                   type: "POST",
                                   url: "/a/wishlist",
                                   async: !0,
                                   cache: !1,
                                   data: c,
                                   dataType: "json",
                                   beforeSend: function () {
                                       t(".wishlist__table").addClass("table-loading");
                                   },
                                   complete: function () {
                                       t(".wishlist__table").removeClass("table-loading");
                                   },
                                   success: function (a) {
                                       if ((t(o).remove(), 1 == a.code)) {
                                           var i = parseInt(a.json);
                                           i
                                               ? e.closest("tr").slideUp("fast", function () {
                                                     t(this).remove(), Fastor.openAlert("check", theme.strings.wishlistRemoved), 0 < t(".wishlist__count").length && t(".wishlist__count").removeClass("hide").text(i);
                                                 })
                                               : location.reload();
                                       }
                                   },
                               });
                           }
                       } else window.location = "/account/login";
                   }))
               );
           }),
           (Fastor.handleWishlist = function () {
               Fastor.addWishlist(), Fastor.pageWishlist();
           }),
           (Fastor.handleCompare = function () {
               function e(e) {
                   var a = t("body");
                   a.addClass("fastor__modal-opened");
                   var i = t(".fastor__modal");
                   i.removeClass("opened"),
                       e && e.length && i.find(".fastor__modal-content").empty().html(e),
                       i.addClass("opened"),
                       t(".compare__list tr").each(function () {
                           t(this).css("height", t(this).outerHeight());
                       }),
                       t(".compare__list").clone().appendTo(".compare__left"),
                       t(".compare__left td").remove();
               }
               function a() {
                   var e = t("body");
                   e.removeClass("fastor__modal-opened");
                   var a = t(".fastor__modal");
                   a.removeClass("opened");
               }
               function i() {
                   var e = localStorage.getItem("roarStorage_compare") || "[]";
                   try {
                       e = JSON.parse(e);
                   } catch (t) {
                       localStorage.removeItem("roarStorage_compare"), (e = JSON.parse("[]"));
                   }
                   var t = e.filter(function (e) {
                       return null != e;
                   });
                   return 10 < t.length ? t.slice(0, 10) : t;
               }
               function r(e) {
                   var t = 10 < e.length ? e.slice(0, 10) : e;
                   try {
                       localStorage.setItem("roarStorage_compare", JSON.stringify(t));
                   } catch (e) {}
                   return t;
               }
               (function () {
                   var e = i();
                   e.length &&
                       t(".addcompare_btn").each(function () {
                           var a = t(this),
                               i = a.data("product_id");
                           e.includes(i) && a.addClass("added").find("span").text(a.data("added"));
                       }),
                       t(document).off("click", ".fastor__modal-close"),
                       t(document).on("click", ".fastor__modal-close", function () {
                           a();
                       }),
                       t(document).keyup(function (e) {
                           "27" == e.which && t(".compare__modal").hasClass("opened") && a();
                       });
               })(),
                   (function () {
                       t(document).off("click", ".addcompare_btn"),
                           t(document).on("click", ".addcompare_btn", function (a) {
                               a.preventDefault();
                               var o = this,
                                   s = t(this),
                                   n = i(),
                                   l = s.data("product_id");
                               n.includes(l) || n.unshift(l), 10 <= n.length && Fastor.openAlert("alert", theme.strings.compareLimit);
                               var d = r(n),
                                   c = d
                                       .map(function (e) {
                                           return "id:" + e;
                                       })
                                       .join(" OR ");
                               t.ajax({
                                   url: "/search",
                                   data: { view: "compare", type: "product", q: c, direct: "false" },
                                   dataType: "html",
                                   type: "GET",
                                   beforeSend: function () {
                                       o.classList.remove("added"), o.classList.add("adding"), o.querySelector("i").classList.add("position-static"), o.querySelector("i").classList.add("loading"), (o.disabled = !0);
                                   },
                                   complete: function () {
                                       o.classList.remove("adding"), o.querySelector("i").classList.remove("position-static"), o.querySelector("i").classList.remove("loading"), (o.disabled = !1);
                                   },
                                   success: function (t) {
                                       e(t), s.addClass("added").find("span").text(s.data("added"));
                                   },
                               });
                           });
                   })(),
                   (function () {
                       t(document).off("click", ".removecompare_btn"),
                           t(document).on("click", ".removecompare_btn", function (e) {
                               e.preventDefault();
                               var o = t(this),
                                   s = o.data("product_id"),
                                   n = ".product__" + s,
                                   l = i();
                               l.includes(s) && l.splice(l.indexOf(s), 1);
                               var d = r(l);
                               d.length ? t(".compare__list " + n).remove() : a();
                               var o = t(n + " .addcompare_btn");
                               o.removeClass("added").find("span").text(o.data("tooltip"));
                           });
                   })();
           }),
           (Fastor.handleQuantity = function () {
               document.addEventListener("click", function (e) {
                   if (e.target.hasAttribute("data-quantity-input-minus") || e.target.hasAttribute("data-quantity-input-plus")) {
                       var t = e.target.closest(".quantity-wrapper").querySelector("[data-quantity-input]"),
                           a = parseInt(t.value);
                       e.target.hasAttribute("data-quantity-input-minus")
                           ? 1 < a && ((t.value = a - 1), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 })))
                           : ((t.value = a + 1), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 })));
                   }
               });
           }),
           (Fastor.handleAddToCart = function () {
               null == document.querySelectorAll(".addcart-product-form") ||
                   (t(document).off("submit", "form.addcart-product-form"),
                   t(document).on("submit", "form.addcart-product-form", function (e) {
                       if ("direct" != theme.addToCartType) {
                           e.preventDefault();
                           var t = this,
                               a = this.querySelector('button[type="submit"]');
                           return Fastor.handleButtonLoadingState(a, !0), void Fastor.handleCartForm(a, t);
                       }
                   }));
           }),
           (Fastor.updateGroupedPrice = function () {
               if (0 != t("#grouped-price").length) {
                   var e = 0,
                       a = 0;
                   t(".grouped-product-item .grouped-checkbox").each(function () {
                       t(this).is(":checked") &&
                           ((e += parseFloat(t(t(this).data("id")).find(".product-price").attr("data-price"))),
                           (a +=
                               0 < parseFloat(t(t(this).data("id")).find(".product-price").attr("data-price_old"))
                                   ? parseFloat(t(t(this).data("id")).find(".product-price").attr("data-price_old"))
                                   : parseFloat(t(t(this).data("id")).find(".product-price").attr("data-price"))));
                   }),
                       t("#grouped-price").html(theme.Currency.formatMoney(e, theme.moneyFormat)),
                       a > e ? t("#grouped-price-old").removeClass("hide").html(theme.Currency.formatMoney(a, theme.moneyFormat)) : t("#grouped-price-old").addClass("hide").html(theme.Currency.formatMoney(a, theme.moneyFormat));
               }
           }),
           (Fastor.handleQuickView = function () {
               null == document.querySelectorAll(".btn-quickview") ||
                   (t(document).off("click", ".btn-quickview"),
                   t(document).on("click", ".btn-quickview", function (e) {
                       e.preventDefault();
                       var a = t(this),
                           i = a.data("handle");
                       a.find("i").addClass("position-static").addClass("loading"),
                           a.prop("disable", !0),
                           Fastor.popup(
                               {
                                   items: { src: "/products/" + i + "?section_id=product-quickview-template&cache=false&direct=false" },
                                   callbacks: {
                                       ajaxContentAdded: function () {
                                           this.wrap.imagesLoaded(function () {
                                               var e = new Fastor.Sections();
                                               e.register("product-quickview", theme.Product), Shopify.PaymentButton.init(), Fastor.initReviews(), Fastor.countdown(".product-countdown");
                                           }),
                                               a.find("i").removeClass("position-static").removeClass("loading"),
                                               a.prop("disable", !1);
                                       },
                                   },
                               },
                               "quickview"
                           );
                   }));
           }),
           (Fastor.initReviews = function () {
               "undefined" != typeof jQuery && "undefined" != typeof SPR && (SPR.registerCallbacks(), SPR.initRatingHandler(), SPR.initDomEls(), SPR.loadProducts(), SPR.loadBadges());
           }),
           (Fastor.ajaxComplete = function () {
               function e(e, t) {
                   for (var a = 0; a < t.length; a++) if (e.match((".*" + t[a].trim() + ".*").replace(" ", ".*"))) return !0;
                   return !1;
               }
               var a = ["/cart?", "/search?", "/collections/"];
               t(document).ajaxComplete(function (t, i, r) {
                   var o = r.url;
                   e(o, a) && (Fastor.initReviews(), Fastor.countdown(".product-countdown"));
               });
           });
   })(jQuery);
function onYouTubeIframeAPIReady() {
   theme.Video.loadVideos();
}
document.addEventListener("DOMContentLoaded", function () {
   var e = new Fastor.Sections();
   e.register("shipping-calculator", theme.ShippingCalculator),
       e.register("product", theme.Product),
       e.register("cart-template", theme.Cart),
       e.register("blog-template", theme.BlogSection),
       e.register("article-template", theme.ArticleSection),
       e.register("page-about-template", theme.PageAboutSection),
       Fastor.ProductItems.init(),
       Fastor.handleCartDropDown(),
       Fastor.handleQuickView(),
       Fastor.handleAddToCart(),
       Fastor.handleWishlist(),
       Fastor.handleCompare(),
       Fastor.handleQuantity(),
       Fastor.ajaxComplete(),
       Fastor.handlePopup(),
       theme.customerTemplates.init();
});
