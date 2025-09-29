(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function getHash() {
  if (location.hash) {
    return location.hash.replace("#", "");
  }
}
let slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("--slide")) {
    target.classList.add("--slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("--slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }, duration);
  }
};
let slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("--slide")) {
    target.classList.add("--slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("--slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }, duration);
  }
};
let slideToggle = (target, duration = 500) => {
  if (target.hidden) {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
};
let bodyLockStatus = true;
let bodyLockToggle = (delay = 500) => {
  if (document.documentElement.hasAttribute("data-fls-scrolllock")) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
};
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
    setTimeout(() => {
      lockPaddingElements.forEach((lockPaddingElement) => {
        lockPaddingElement.style.paddingRight = "";
      });
      document.body.style.paddingRight = "";
      document.documentElement.removeAttribute("data-fls-scrolllock");
    }, delay);
    bodyLockStatus = false;
    setTimeout(function() {
      bodyLockStatus = true;
    }, delay);
  }
};
let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
    lockPaddingElements.forEach((lockPaddingElement) => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    });
    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.setAttribute("data-fls-scrolllock", "");
    bodyLockStatus = false;
    setTimeout(function() {
      bodyLockStatus = true;
    }, delay);
  }
};
function uniqArray(array) {
  return array.filter((item, index, self) => self.indexOf(item) === index);
}
function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter((item) => item.dataset[dataSetValue]).map((item) => {
    const [value, type = "max"] = item.dataset[dataSetValue].split(",");
    return { value, type, item };
  });
  if (media.length === 0) return [];
  const breakpointsArray = media.map(({ value, type }) => `(${type}-width: ${value}px),${value},${type}`);
  const uniqueQueries = [...new Set(breakpointsArray)];
  return uniqueQueries.map((query) => {
    const [mediaQuery, mediaBreakpoint, mediaType] = query.split(",");
    const matchMedia = window.matchMedia(mediaQuery);
    const itemsArray = media.filter((item) => item.value === mediaBreakpoint && item.type === mediaType);
    return { itemsArray, matchMedia };
  });
}
const gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
  const targetBlockElement = document.querySelector(targetBlock);
  if (targetBlockElement) {
    let headerItem = "";
    let headerItemHeight = 0;
    if (noHeader) {
      headerItem = "header.header";
      const headerElement = document.querySelector(headerItem);
      if (!headerElement.classList.contains("--header-scroll")) {
        headerElement.style.cssText = `transition-duration: 0s;`;
        headerElement.classList.add("--header-scroll");
        headerItemHeight = headerElement.offsetHeight;
        headerElement.classList.remove("--header-scroll");
        setTimeout(() => {
          headerElement.style.cssText = ``;
        }, 0);
      } else {
        headerItemHeight = headerElement.offsetHeight;
      }
    }
    if (document.documentElement.hasAttribute("data-fls-menu-open")) {
      bodyUnlock();
      document.documentElement.removeAttribute("data-fls-menu-open");
    }
    let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
    targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
    targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
    window.scrollTo({
      top: targetBlockElementPosition,
      behavior: "smooth"
    });
  }
};
class Popup {
  constructor(options) {
    let config = {
      logging: true,
      init: true,
      //Для кнопок
      attributeOpenButton: "data-fls-popup-link",
      // Атрибут для кнопки, яка викликає попап
      attributeCloseButton: "data-fls-popup-close",
      // Атрибут для кнопки, що закриває попап
      // Для сторонніх об'єктів
      fixElementSelector: "[data-fls-lp]",
      // Атрибут для елементів із лівим паддингом (які fixed)
      // Для об'єкту попапа
      attributeMain: "data-fls-popup",
      youtubeAttribute: "data-fls-popup-youtube",
      // Атрибут для коду youtube
      youtubePlaceAttribute: "data-fls-popup-youtube-place",
      // Атрибут для вставки ролика youtube
      setAutoplayYoutube: true,
      // Зміна класів
      classes: {
        popup: "popup",
        // popupWrapper: 'popup__wrapper',
        popupContent: "data-fls-popup-body",
        popupActive: "data-fls-popup-active",
        // Додається для попапа, коли він відкривається
        bodyActive: "data-fls-popup-open"
        // Додається для боді, коли попап відкритий
      },
      focusCatch: true,
      // Фокус усередині попапа зациклений
      closeEsc: true,
      // Закриття ESC
      bodyLock: true,
      // Блокування скролла
      hashSettings: {
        location: true,
        // Хеш в адресному рядку
        goHash: true
        // Перехід по наявності в адресному рядку
      },
      on: {
        // Події
        beforeOpen: function() {
        },
        afterOpen: function() {
        },
        beforeClose: function() {
        },
        afterClose: function() {
        }
      }
    };
    this.youTubeCode;
    this.isOpen = false;
    this.targetOpen = {
      selector: false,
      element: false
    };
    this.previousOpen = {
      selector: false,
      element: false
    };
    this.lastClosed = {
      selector: false,
      element: false
    };
    this._dataValue = false;
    this.hash = false;
    this._reopen = false;
    this._selectorOpen = false;
    this.lastFocusEl = false;
    this._focusEl = [
      "a[href]",
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
      "button:not([disabled]):not([aria-hidden])",
      "select:not([disabled]):not([aria-hidden])",
      "textarea:not([disabled]):not([aria-hidden])",
      "area[href]",
      "iframe",
      "object",
      "embed",
      "[contenteditable]",
      '[tabindex]:not([tabindex^="-"])'
    ];
    this.options = {
      ...config,
      ...options,
      classes: {
        ...config.classes,
        ...options == null ? void 0 : options.classes
      },
      hashSettings: {
        ...config.hashSettings,
        ...options == null ? void 0 : options.hashSettings
      },
      on: {
        ...config.on,
        ...options == null ? void 0 : options.on
      }
    };
    this.bodyLock = false;
    this.options.init ? this.initPopups() : null;
  }
  initPopups() {
    this.buildPopup();
    this.eventsPopup();
  }
  buildPopup() {
  }
  eventsPopup() {
    document.addEventListener("click", (function(e) {
      const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
      if (buttonOpen) {
        e.preventDefault();
        this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
        this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
        if (this._dataValue !== "error") {
          if (!this.isOpen) this.lastFocusEl = buttonOpen;
          this.targetOpen.selector = `${this._dataValue}`;
          this._selectorOpen = true;
          this.open();
          return;
        }
        return;
      }
      const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
      if (buttonClose || !e.target.closest(`[${this.options.classes.popupContent}]`) && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
    }).bind(this));
    document.addEventListener("keydown", (function(e) {
      if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
      if (this.options.focusCatch && e.which == 9 && this.isOpen) {
        this._focusCatch(e);
        return;
      }
    }).bind(this));
    if (this.options.hashSettings.goHash) {
      window.addEventListener("hashchange", (function() {
        if (window.location.hash) {
          this._openToHash();
        } else {
          this.close(this.targetOpen.selector);
        }
      }).bind(this));
      if (window.location.hash) {
        this._openToHash();
      }
    }
  }
  open(selectorValue) {
    if (bodyLockStatus) {
      this.bodyLock = document.documentElement.hasAttribute("data-fls-scrolllock") && !this.isOpen ? true : false;
      if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
        this.targetOpen.selector = selectorValue;
        this._selectorOpen = true;
      }
      if (this.isOpen) {
        this._reopen = true;
        this.close();
      }
      if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
      if (!this._reopen) this.previousActiveElement = document.activeElement;
      this.targetOpen.element = document.querySelector(`[${this.options.attributeMain}=${this.targetOpen.selector}]`);
      if (this.targetOpen.element) {
        const codeVideo = this.youTubeCode || this.targetOpen.element.getAttribute(`${this.options.youtubeAttribute}`);
        if (codeVideo) {
          const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
          const iframe = document.createElement("iframe");
          const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
          iframe.setAttribute("allowfullscreen", "");
          iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
          iframe.setAttribute("src", urlVideo);
          if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
            this.targetOpen.element.querySelector("[data-fls-popup-content]").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
          }
          this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
        }
        if (this.options.hashSettings.location) {
          this._getHash();
          this._setHash();
        }
        this.options.on.beforeOpen(this);
        document.dispatchEvent(new CustomEvent("beforePopupOpen", {
          detail: {
            popup: this
          }
        }));
        this.targetOpen.element.setAttribute(this.options.classes.popupActive, "");
        document.documentElement.setAttribute(this.options.classes.bodyActive, "");
        if (!this._reopen) {
          !this.bodyLock ? bodyLock() : null;
        } else this._reopen = false;
        this.targetOpen.element.setAttribute("aria-hidden", "false");
        this.previousOpen.selector = this.targetOpen.selector;
        this.previousOpen.element = this.targetOpen.element;
        this._selectorOpen = false;
        this.isOpen = true;
        setTimeout(() => {
          this._focusTrap();
        }, 50);
        this.options.on.afterOpen(this);
        document.dispatchEvent(new CustomEvent("afterPopupOpen", {
          detail: {
            popup: this
          }
        }));
      }
    }
  }
  close(selectorValue) {
    if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
      this.previousOpen.selector = selectorValue;
    }
    if (!this.isOpen || !bodyLockStatus) {
      return;
    }
    this.options.on.beforeClose(this);
    document.dispatchEvent(new CustomEvent("beforePopupClose", {
      detail: {
        popup: this
      }
    }));
    if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
      setTimeout(() => {
        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
      }, 500);
    }
    this.previousOpen.element.removeAttribute(this.options.classes.popupActive);
    this.previousOpen.element.setAttribute("aria-hidden", "true");
    if (!this._reopen) {
      document.documentElement.removeAttribute(this.options.classes.bodyActive);
      !this.bodyLock ? bodyUnlock() : null;
      this.isOpen = false;
    }
    this._removeHash();
    if (this._selectorOpen) {
      this.lastClosed.selector = this.previousOpen.selector;
      this.lastClosed.element = this.previousOpen.element;
    }
    this.options.on.afterClose(this);
    document.dispatchEvent(new CustomEvent("afterPopupClose", {
      detail: {
        popup: this
      }
    }));
    setTimeout(() => {
      this._focusTrap();
    }, 50);
  }
  // Отримання хешу 
  _getHash() {
    if (this.options.hashSettings.location) {
      this.hash = `#${this.targetOpen.selector}`;
    }
  }
  _openToHash() {
    let classInHash = window.location.hash.replace("#", "");
    const openButton = document.querySelector(`[${this.options.attributeOpenButton}="${classInHash}"]`);
    if (openButton) {
      this.youTubeCode = openButton.getAttribute(this.options.youtubeAttribute) ? openButton.getAttribute(this.options.youtubeAttribute) : null;
    }
    if (classInHash) this.open(classInHash);
  }
  // Встановлення хеша
  _setHash() {
    history.pushState("", "", this.hash);
  }
  _removeHash() {
    history.pushState("", "", window.location.href.split("#")[0]);
  }
  _focusCatch(e) {
    const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
    const focusArray = Array.prototype.slice.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);
    if (e.shiftKey && focusedIndex === 0) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }
    if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }
  _focusTrap() {
    const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
    if (!this.isOpen && this.lastFocusEl) {
      this.lastFocusEl.focus();
    } else {
      focusable[0].focus();
    }
  }
}
document.querySelector("[data-fls-popup]") ? window.addEventListener("load", () => window.flsPopup = new Popup({})) : null;
function menuInit() {
  document.addEventListener("click", function(e) {
    if (bodyLockStatus && e.target.closest("[data-fls-menu]")) {
      bodyLockToggle();
      document.documentElement.toggleAttribute("data-fls-menu-open");
    }
  });
}
document.querySelector("[data-fls-menu]") ? window.addEventListener("load", menuInit) : null;
document.addEventListener("DOMContentLoaded", function() {
  const dropdownLinks = document.querySelectorAll(".menu__link--dropdown");
  dropdownLinks.forEach((link) => {
    link.addEventListener("click", function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parentItem = this.parentElement;
        const dropdown = parentItem.querySelector(".menu__dropdown");
        if (dropdown) {
          const isOpen = parentItem.classList.contains("active");
          document.querySelectorAll(".menu__item").forEach((item) => {
            if (item !== parentItem) {
              item.classList.remove("active");
            }
          });
          parentItem.classList.toggle("active", !isOpen);
        }
      }
    });
  });
  document.addEventListener("click", function(e) {
    if (!e.target.closest(".menu")) {
      document.querySelectorAll(".menu__item").forEach((item) => {
        item.classList.remove("active");
      });
    }
  });
});
document.addEventListener("DOMContentLoaded", function() {
  const searchData = [
    {
      id: 1,
      title: "Корпоративное право",
      text: "Создание и регистрация юридических лиц, корпоративные споры, сопровождение бизнеса",
      url: "#services"
    },
    {
      id: 2,
      title: "Налоговое право",
      text: "Консультации по налогам, споры с налоговой инспекцией, налоговое планирование",
      url: "#services"
    },
    {
      id: 3,
      title: "Гражданское право",
      text: "Споры по договорам, защита прав потребителей, наследственные дела",
      url: "#services"
    },
    {
      id: 4,
      title: "Арбитражные споры",
      text: "Представительство в арбитражных судах, подготовка исков, судебные заседания",
      url: "#services"
    },
    {
      id: 5,
      title: "Недвижимость",
      text: "Сопровождение сделок с недвижимостью, регистрация прав, земельные споры",
      url: "#services"
    },
    {
      id: 6,
      title: "Интеллектуальная собственность",
      text: "Регистрация товарных знаков, защита авторских прав, патенты",
      url: "#services"
    },
    {
      id: 7,
      title: "О нашей фирме",
      text: "Информация о компании, наша команда, история развития",
      url: "#about"
    },
    {
      id: 8,
      title: "Новости фирмы",
      text: "Последние события, изменения в законодательстве, успехи компании",
      url: "#news"
    },
    {
      id: 9,
      title: "Контакты",
      text: "Адрес, телефон, электронная почта, схема проезда",
      url: "#contacts"
    },
    {
      id: 10,
      title: "Новые изменения в налоговом законодательстве 2025",
      text: "Важные изменения в налоговом кодексе, влияющие на бизнес",
      url: "#news"
    },
    {
      id: 11,
      title: "Участие в международной конференции юристов",
      text: "Наша фирма приняла участие в ежегодной конференции юристов",
      url: "#news"
    },
    {
      id: 12,
      title: "Победа в арбитражном суде",
      text: "Успешное разрешение сложного дела о банкротстве",
      url: "#news"
    }
  ];
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const searchResultsContent = document.getElementById("searchResultsContent");
  const searchForm = document.getElementById("searchForm");
  function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, '<span class="search-results__highlight">$1</span>');
  }
  function search(query) {
    if (!query.trim()) {
      searchResults.classList.remove("active");
      return;
    }
    const results = searchData.filter(
      (item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.text.toLowerCase().includes(query.toLowerCase())
    );
    displayResults(results, query);
  }
  function displayResults(results, query) {
    if (results.length === 0) {
      searchResultsContent.innerHTML = `
        <div class="search-results__no-results">
          По запросу "${query}" ничего не найдено
        </div>
      `;
    } else {
      const resultsHTML = results.map((item) => `
        <div class="search-results__item">
          <a href="${item.url}" class="search-results__link">
            <div class="search-results__title">
              ${highlightText(item.title, query)}
            </div>
            <div class="search-results__text">
              ${highlightText(item.text, query)}
            </div>
          </a>
        </div>
      `).join("");
      searchResultsContent.innerHTML = resultsHTML;
    }
    searchResults.classList.add("active");
  }
  searchInput.addEventListener("input", function(e) {
    const query = e.target.value;
    search(query);
  });
  searchForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      console.log("Поиск по запросу:", query);
    }
  });
  document.addEventListener("click", function(e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.remove("active");
    }
  });
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      searchResults.classList.remove("active");
      searchInput.blur();
    }
  });
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.querySelector(".legal-header__nav");
  mobileToggle.addEventListener("click", function() {
    navMenu.classList.toggle("active");
    const spans = mobileToggle.querySelectorAll("span");
    if (navMenu.classList.contains("active")) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
    } else {
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    }
  });
  const navLinks = document.querySelectorAll(".legal-header__nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function() {
      navMenu.classList.remove("active");
      const spans = mobileToggle.querySelectorAll("span");
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    });
  });
});
document.addEventListener("DOMContentLoaded", function() {
  const contactMainBtn = document.getElementById("contactMainBtn");
  const socialButtons = document.getElementById("socialButtons");
  document.querySelector(".orbit-container");
  contactMainBtn.addEventListener("click", function() {
    this.classList.toggle("active");
    socialButtons.classList.toggle("active");
    this.classList.remove("animate");
  });
  document.addEventListener("click", function(e) {
    var _a;
    if (!contactMainBtn.contains(e.target) && !((_a = document.querySelector(".social-btn")) == null ? void 0 : _a.contains(e.target))) {
      contactMainBtn.classList.remove("active");
      socialButtons.classList.remove("active");
    }
  });
});
document.addEventListener("DOMContentLoaded", function() {
  function formatPhoneNumber(phone) {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("8")) {
      return "7" + cleanPhone.substring(1);
    }
    if (cleanPhone.startsWith("7")) {
      return cleanPhone;
    }
    if (cleanPhone.length === 10) {
      return "7" + cleanPhone;
    }
    return cleanPhone;
  }
  function openWhatsApp(phone, message = "") {
    const formattedPhone = formatPhoneNumber(phone);
    let url = `https://wa.me/${formattedPhone}`;
    if (message) {
      url += `?text=${encodeURIComponent(message)}`;
    }
    window.open(url, "_blank");
  }
  function openViber(number) {
    const formattedNumber = formatPhoneNumber(number);
    const url = `viber://chat?number=${formattedNumber}`;
    window.open(url, "_blank");
  }
  const whatsappLinks = document.querySelectorAll('[href^="https://wa.me/"], [href^="whatsapp://"]');
  whatsappLinks.forEach((link) => {
    link.addEventListener("click", function(e) {
      const phone = this.dataset.phone;
      const message = this.dataset.message;
      if (phone) {
        e.preventDefault();
        openWhatsApp(phone, message);
      }
    });
  });
  const viberLinks = document.querySelectorAll('[href^="viber://"]');
  viberLinks.forEach((link) => {
    link.addEventListener("click", function(e) {
      const number = this.dataset.number;
      if (number) {
        e.preventDefault();
        openViber(number);
      }
    });
  });
  const quickChatButtons = document.querySelectorAll("[data-quick-chat]");
  quickChatButtons.forEach((button) => {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      const chatType = this.dataset.quickChat;
      const phone = this.dataset.phone;
      const username = this.dataset.username;
      const message = this.dataset.message || "Здравствуйте! Хочу получить консультацию.";
      switch (chatType) {
        case "whatsapp":
          if (phone) {
            openWhatsApp(phone, message);
          }
          break;
        case "telegram":
          if (username) {
            const url = `https://t.me/${username}`;
            window.open(url, "_blank");
          }
          break;
        case "viber":
          if (phone) {
            openViber(phone);
          }
          break;
        default:
          console.warn("Неизвестный тип чата:", chatType);
      }
    });
  });
  window.openChat = function(platform, contact, message = "") {
    switch (platform) {
      case "whatsapp":
        openWhatsApp(contact, message);
        break;
      case "telegram":
        if (contact.startsWith("@")) {
          contact = contact.substring(1);
        }
        const telegramUrl = `https://t.me/${contact}`;
        window.open(telegramUrl, "_blank");
        break;
      case "viber":
        openViber(contact);
        break;
      default:
        console.warn("Неизвестная платформа:", platform);
    }
  };
});
const SocialChat = {
  // Открыть чат WhatsApp с номером и сообщением
  whatsapp: function(phone, message = "") {
    const formattedPhone = phone.replace(/\D/g, "").replace(/^8/, "7");
    let url = `https://wa.me/${formattedPhone}`;
    if (message) {
      url += `?text=${encodeURIComponent(message)}`;
    }
    window.open(url, "_blank");
  },
  // Открыть чат Telegram с username
  telegram: function(username) {
    if (username.startsWith("@")) {
      username = username.substring(1);
    }
    const url = `https://t.me/${username}`;
    window.open(url, "_blank");
  },
  // Быстрый чат с предзаполненным сообщением
  quickChat: function(platform, contact, template = "") {
    const defaultTemplate = "Здравствуйте! Хочу получить консультацию юриста.";
    const message = template || defaultTemplate;
    switch (platform) {
      case "whatsapp":
        this.whatsapp(contact, message);
        break;
      case "telegram":
        this.telegram(contact);
        break;
      case "viber":
        this.viber(contact);
        break;
    }
  }
};
window.SocialChat = SocialChat;
export {
  slideUp as a,
  bodyUnlock as b,
  getHash as c,
  dataMediaQueries as d,
  gotoBlock as g,
  slideToggle as s,
  uniqArray as u
};
