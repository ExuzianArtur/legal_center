import { u as uniqArray, b as bodyUnlock, g as gotoBlock, c as getHash } from "./app.min.js";
document.addEventListener("DOMContentLoaded", function() {
  const mapConfig = {
    center: [43.915967, 39.323042],
    // Москва, Красная площадь (заменить на реальные координаты)
    zoom: 17,
    address: "г. Сочи, ул. Победы, д. 112",
    placemarkName: "Многофункциональный правовой центр."
  };
  function loadYandexMaps() {
    return new Promise((resolve, reject) => {
      if (window.ymaps) {
        resolve(window.ymaps);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=ВАШ_API_КЛЮЧ";
      script.onload = () => {
        ymaps.ready(() => {
          resolve(ymaps);
        });
      };
      script.onerror = () => {
        reject(new Error("Не удалось загрузить API Яндекс.Карт"));
      };
      document.head.appendChild(script);
    });
  }
  async function initMap() {
    document.getElementById("mapContainer");
    const mapLoading = document.getElementById("mapLoading");
    const mapError = document.getElementById("mapError");
    try {
      mapError.style.display = "none";
      mapLoading.style.display = "flex";
      const ymaps2 = await loadYandexMaps();
      mapLoading.style.display = "none";
      const map = new ymaps2.Map("mapContainer", {
        center: mapConfig.center,
        zoom: mapConfig.zoom,
        controls: ["zoomControl", "fullscreenControl"]
      });
      const placemark = new ymaps2.Placemark(mapConfig.center, {
        hintContent: mapConfig.placemarkName,
        balloonContent: `
          <div style="font-family: Arial, sans-serif; padding: 10px;">
            <h3 style="margin: 0 0 10px 0; color: #0a1f3c;">${mapConfig.placemarkName}</h3>
            <p style="margin: 5px 0; color: #333;">${mapConfig.address}</p>
            <p style="margin: 5px 0; color: #666; font-size: 12px;">
              Режим работы: Пн-Пт 9:00-18:00, Сб 10:00-14:00
            </p>
          </div>
        `
      }, {
        preset: "islands#blueOfficeIcon"
      });
      map.geoObjects.add(placemark);
      window.addEventListener("resize", () => {
        map.container.fitToViewport();
      });
    } catch (error) {
      console.error("Ошибка инициализации карты:", error);
      mapLoading.style.display = "none";
      mapError.style.display = "flex";
    }
  }
  function openYandexRoute() {
    const url = `https://yandex.ru/maps/?rtext=~${mapConfig.center[0]},${mapConfig.center[1]}&rtt=auto`;
    window.open(url, "_blank");
  }
  function openGoogleRoute() {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mapConfig.center[0]},${mapConfig.center[1]}`;
    window.open(url, "_blank");
  }
  document.getElementById("retryMap").addEventListener("click", initMap);
  initMap();
  window.openYandexRoute = openYandexRoute;
  window.openGoogleRoute = openGoogleRoute;
});
class DynamicAdapt {
  constructor() {
    this.type = "max";
    this.init();
  }
  init() {
    this.objects = [];
    this.daClassname = "--dynamic";
    this.nodes = [...document.querySelectorAll("[data-fls-dynamic]")];
    this.nodes.forEach((node) => {
      const data = node.dataset.flsDynamic.trim();
      const dataArray = data.split(`,`);
      const object = {};
      object.element = node;
      object.parent = node.parentNode;
      object.destinationParent = dataArray[3] ? node.closest(dataArray[3].trim()) || document : document;
      dataArray[3] ? dataArray[3].trim() : null;
      const objectSelector = dataArray[0] ? dataArray[0].trim() : null;
      if (objectSelector) {
        const foundDestination = object.destinationParent.querySelector(objectSelector);
        if (foundDestination) {
          object.destination = foundDestination;
        }
      }
      object.breakpoint = dataArray[1] ? dataArray[1].trim() : `767.98`;
      object.place = dataArray[2] ? dataArray[2].trim() : `last`;
      object.index = this.indexInParent(object.parent, object.element);
      this.objects.push(object);
    });
    this.arraySort(this.objects);
    this.mediaQueries = this.objects.map(({ breakpoint }) => `(${this.type}-width: ${breakpoint / 16}em),${breakpoint}`).filter((item, index, self) => self.indexOf(item) === index);
    this.mediaQueries.forEach((media) => {
      const mediaSplit = media.split(",");
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];
      const objectsFilter = this.objects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint);
      matchMedia.addEventListener("change", () => {
        this.mediaHandler(matchMedia, objectsFilter);
      });
      this.mediaHandler(matchMedia, objectsFilter);
    });
  }
  mediaHandler(matchMedia, objects) {
    if (matchMedia.matches) {
      objects.forEach((object) => {
        if (object.destination) {
          this.moveTo(object.place, object.element, object.destination);
        }
      });
    } else {
      objects.forEach(({ parent, element, index }) => {
        if (element.classList.contains(this.daClassname)) {
          this.moveBack(parent, element, index);
        }
      });
    }
  }
  moveTo(place, element, destination) {
    element.classList.add(this.daClassname);
    const index = place === "last" || place === "first" ? place : parseInt(place, 10);
    if (index === "last" || index >= destination.children.length) {
      destination.append(element);
    } else if (index === "first") {
      destination.prepend(element);
    } else {
      destination.children[index].before(element);
    }
  }
  moveBack(parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== void 0) {
      parent.children[index].before(element);
    } else {
      parent.append(element);
    }
  }
  indexInParent(parent, element) {
    return [...parent.children].indexOf(element);
  }
  arraySort(arr) {
    if (this.type === "min") {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === "first" || b.place === "last") {
            return -1;
          }
          if (a.place === "last" || b.place === "first") {
            return 1;
          }
          return 0;
        }
        return a.breakpoint - b.breakpoint;
      });
    } else {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === "first" || b.place === "last") {
            return 1;
          }
          if (a.place === "last" || b.place === "first") {
            return -1;
          }
          return 0;
        }
        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  }
}
if (document.querySelector("[data-fls-dynamic]")) {
  window.addEventListener("load", () => new DynamicAdapt());
}
class ScrollWatcher {
  constructor(props) {
    let defaultConfig = {
      logging: true
    };
    this.config = Object.assign(defaultConfig, props);
    this.observer;
    !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
  }
  // Оновлюємо конструктор
  scrollWatcherUpdate() {
    this.scrollWatcherRun();
  }
  // Запускаємо конструктор
  scrollWatcherRun() {
    document.documentElement.classList.add("watcher");
    this.scrollWatcherConstructor(document.querySelectorAll("[data-fls-watcher]"));
  }
  // Конструктор спостерігачів
  scrollWatcherConstructor(items) {
    if (items.length) {
      let uniqParams = uniqArray(Array.from(items).map(function(item) {
        if (item.dataset.flsWatcher === "navigator" && !item.dataset.flsWatcherThreshold) {
          let valueOfThreshold;
          if (item.clientHeight > 2) {
            valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
            if (valueOfThreshold > 1) {
              valueOfThreshold = 1;
            }
          } else {
            valueOfThreshold = 1;
          }
          item.setAttribute(
            "data-fls-watcher-threshold",
            valueOfThreshold.toFixed(2)
          );
        }
        return `${item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null}|${item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px"}|${item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0}`;
      }));
      uniqParams.forEach((uniqParam) => {
        let uniqParamArray = uniqParam.split("|");
        let paramsWatch = {
          root: uniqParamArray[0],
          margin: uniqParamArray[1],
          threshold: uniqParamArray[2]
        };
        let groupItems = Array.from(items).filter(function(item) {
          let watchRoot = item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null;
          let watchMargin = item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px";
          let watchThreshold = item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0;
          if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) {
            return item;
          }
        });
        let configWatcher = this.getScrollWatcherConfig(paramsWatch);
        this.scrollWatcherInit(groupItems, configWatcher);
      });
    }
  }
  // Функція створення налаштувань
  getScrollWatcherConfig(paramsWatch) {
    let configWatcher = {};
    if (document.querySelector(paramsWatch.root)) {
      configWatcher.root = document.querySelector(paramsWatch.root);
    } else if (paramsWatch.root !== "null") ;
    configWatcher.rootMargin = paramsWatch.margin;
    if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
      return;
    }
    if (paramsWatch.threshold === "prx") {
      paramsWatch.threshold = [];
      for (let i = 0; i <= 1; i += 5e-3) {
        paramsWatch.threshold.push(i);
      }
    } else {
      paramsWatch.threshold = paramsWatch.threshold.split(",");
    }
    configWatcher.threshold = paramsWatch.threshold;
    return configWatcher;
  }
  // Функція створення нового спостерігача зі своїми налаштуваннями
  scrollWatcherCreate(configWatcher) {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        this.scrollWatcherCallback(entry, observer);
      });
    }, configWatcher);
  }
  // Функція ініціалізації спостерігача зі своїми налаштуваннями
  scrollWatcherInit(items, configWatcher) {
    this.scrollWatcherCreate(configWatcher);
    items.forEach((item) => this.observer.observe(item));
  }
  // Функція обробки базових дій точок спрацьовування
  scrollWatcherIntersecting(entry, targetElement) {
    if (entry.isIntersecting) {
      !targetElement.classList.contains("--watcher-view") ? targetElement.classList.add("--watcher-view") : null;
    } else {
      targetElement.classList.contains("--watcher-view") ? targetElement.classList.remove("--watcher-view") : null;
    }
  }
  // Функція відключення стеження за об'єктом
  scrollWatcherOff(targetElement, observer) {
    observer.unobserve(targetElement);
  }
  // Функція обробки спостереження
  scrollWatcherCallback(entry, observer) {
    const targetElement = entry.target;
    this.scrollWatcherIntersecting(entry, targetElement);
    targetElement.hasAttribute("data-fls-watcher-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
    document.dispatchEvent(new CustomEvent("watcherCallback", {
      detail: {
        entry
      }
    }));
  }
}
document.querySelector("[data-fls-watcher]") ? window.addEventListener("load", () => new ScrollWatcher({})) : null;
function pageNavigation() {
  document.addEventListener("click", pageNavigationAction);
  document.addEventListener("watcherCallback", pageNavigationAction);
  function pageNavigationAction(e) {
    if (e.type === "click") {
      const targetElement = e.target;
      if (targetElement.closest("[data-fls-scrollto]")) {
        const gotoLink = targetElement.closest("[data-fls-scrollto]");
        const gotoLinkSelector = gotoLink.dataset.flsScrollto ? gotoLink.dataset.flsScrollto : "";
        const noHeader = gotoLink.hasAttribute("data-fls-scrollto-header") ? true : false;
        const gotoSpeed = gotoLink.dataset.flsScrolltoSpeed ? gotoLink.dataset.flsScrolltoSpeed : 500;
        const offsetTop = gotoLink.dataset.flsScrolltoTop ? parseInt(gotoLink.dataset.flsScrolltoTop) : 0;
        if (window.fullpage) {
          const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest("[data-fls-fullpage-section]");
          const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.flsFullpageId : null;
          if (fullpageSectionId !== null) {
            window.fullpage.switchingSection(fullpageSectionId);
            if (document.documentElement.hasAttribute("data-fls-menu-open")) {
              bodyUnlock();
              document.documentElement.removeAttribute("data-fls-menu-open");
            }
          }
        } else {
          gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
        }
        e.preventDefault();
      }
    } else if (e.type === "watcherCallback" && e.detail) {
      const entry = e.detail.entry;
      const targetElement = entry.target;
      if (targetElement.dataset.flsWatcher === "navigator") {
        document.querySelector(`[data-fls-scrollto].--navigator-active`);
        let navigatorCurrentItem;
        if (targetElement.id && document.querySelector(`[data-fls-scrollto="#${targetElement.id}"]`)) {
          navigatorCurrentItem = document.querySelector(`[data-fls-scrollto="#${targetElement.id}"]`);
        } else if (targetElement.classList.length) {
          for (let index = 0; index < targetElement.classList.length; index++) {
            const element = targetElement.classList[index];
            if (document.querySelector(`[data-fls-scrollto=".${element}"]`)) {
              navigatorCurrentItem = document.querySelector(`[data-fls-scrollto=".${element}"]`);
              break;
            }
          }
        }
        if (entry.isIntersecting) {
          navigatorCurrentItem ? navigatorCurrentItem.classList.add("--navigator-active") : null;
        } else {
          navigatorCurrentItem ? navigatorCurrentItem.classList.remove("--navigator-active") : null;
        }
      }
    }
  }
  if (getHash()) {
    let goToHash;
    if (document.querySelector(`#${getHash()}`)) {
      goToHash = `#${getHash()}`;
    } else if (document.querySelector(`.${getHash()}`)) {
      goToHash = `.${getHash()}`;
    }
    goToHash ? gotoBlock(goToHash) : null;
  }
}
document.querySelector("[data-fls-scrollto]") ? window.addEventListener("load", pageNavigation) : null;
document.addEventListener("DOMContentLoaded", function() {
  const scrollTopBtn = document.getElementById("scrollTop");
  const scrollButton = scrollTopBtn.querySelector(".scroll-top__button");
  const SHOW_THRESHOLD = 300;
  const SCROLL_SPEED = 800;
  let isScrolling = false;
  function checkScrollPosition() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > SHOW_THRESHOLD) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  }
  function scrollToTop() {
    if (isScrolling) return;
    isScrolling = true;
    scrollButton.classList.add("pulse");
    if ("scrollBehavior" in document.documentElement.style) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      setTimeout(() => {
        isScrolling = false;
        scrollButton.classList.remove("pulse");
      }, SCROLL_SPEED);
    } else {
      smoothScrollToTop();
    }
  }
  function smoothScrollToTop() {
    const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
      window.requestAnimationFrame(smoothScrollToTop);
      window.scrollTo(0, currentScroll - currentScroll / 8);
    } else {
      isScrolling = false;
      scrollButton.classList.remove("pulse");
    }
  }
  function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }
  function checkFooterVisibility() {
    const footer = document.querySelector("footer") || document.querySelector(".footer");
    if (!footer) return;
    const footerRect = footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    if (footerRect.top < windowHeight) {
      scrollButton.classList.add("pulse");
    } else {
      scrollButton.classList.remove("pulse");
    }
  }
  scrollButton.addEventListener("click", scrollToTop);
  let scrollTimer;
  window.addEventListener("scroll", function() {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      checkScrollPosition();
      checkFooterVisibility();
    }, 100);
  });
  checkScrollPosition();
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && scrollTopBtn.classList.contains("visible")) {
      scrollToTop();
    }
  });
  window.scrollToTop = scrollToTop;
  window.scrollToElement = scrollToElement;
  const ScrollTop = {
    // Прокрутка наверх
    top: function() {
      scrollToTop();
    },
    // Прокрутка к элементу
    to: function(elementId) {
      scrollToElement(elementId);
    },
    // Показать/скрыть кнопку программно
    show: function() {
      scrollTopBtn.classList.add("visible");
    },
    hide: function() {
      scrollTopBtn.classList.remove("visible");
    },
    // Установить порог появления
    setThreshold: function(threshold) {
      SHOW_THRESHOLD = threshold;
    }
  };
  window.ScrollTop = ScrollTop;
});
(function() {
  const ScrollTopConfig = {
    // Селекторы для отслеживания
    triggers: {
      footer: "footer, .footer, .legal-footer",
      header: "header, .header, .legal-header"
    },
    // Анимации
    animations: {
      show: "fadeInUp",
      hide: "fadeOutDown"
    },
    // Время анимаций
    timing: {
      show: 300,
      hide: 300,
      scroll: 800
    }
  };
  window.ScrollTopConfig = ScrollTopConfig;
})();
document.addEventListener("DOMContentLoaded", function() {
  const news01 = new URL("../assets/img/news/news_01.webp", import.meta.url).href;
  const news02 = new URL("../assets/img/news/news_02.webp", import.meta.url).href;
  const newsData2 = {
    1: {
      title: "Новые изменения в налоговом законодательстве 2025 года",
      date: "15 марта 2025",
      category: "Налоги",
      image: news01,
      content: `
        <p>С 1 января 2025 года вступают в силу важные изменения в налоговом кодексе, которые затронут деятельность большинства компаний. Эти нововведения направлены на упрощение налогового администрирования и повышение прозрачности бизнес-процессов.</p> 
        <p>Основные изменения касаются:</p> 
        <ul> 
        <li>Упрощенной системы налогообложения для малого бизнеса</li> 
        <li>Новых правил по НДС для онлайн-торговли</li> 
        <li>Изменений в порядке сдачи отчетности</li> 
        <li>Новых льгот для инновационных компаний</li> 
        </ul> 
        <p>Наша юридическая фирма подготовила подробные рекомендации для наших клиентов по адаптации к новым условиям. Мы рекомендуем всем предпринимателям внимательно изучить новые положения и при необходимости проконсультироваться со специалистами.</p> <p>В ближайшее время мы проведем серию вебинаров по новым изменениям, где подробно разберем каждый аспект и ответим на ваши вопросы.</p>
      `
    },
    2: {
      title: "Фирма приняла участие в международной конференции юристов",
      date: "10 марта 2025",
      category: "События",
      image: news02,
      content: `
        <p>Наши ведущие специалисты приняли участие в ежегодной международной конференции юристов, которая проходила в Москве с 8 по 10 марта 2025 года. Конференция собрала более 500 юристов из 30 стран мира.</p> 
        <p>Главный юрист нашей фирмы выступил с докладом на тему "Международные стандарты корпоративного права в условиях цифровой трансформации". Доклад был высоко оценен экспертами и вызвал живой интерес у участников.</p> 
        <p>В рамках конференции были обсуждены актуальные вопросы:</p> 
        <ul> 
        <li>Кросс-граничные сделки и их регулирование</li> 
        <li>Защита интеллектуальной собственности в цифровую эпоху</li> 
        <li>Новые подходы к международному арбитражу</li> <li>Этические аспекты юридической практики</li> 
        </ul> 
        <p>Участие в конференции еще раз подтвердило высокий профессиональный уровень нашей команды и стремление быть в авангарде современных юридических тенденций.</p>
      `
    }
  };
  const modal = document.getElementById("newsModal");
  const modalBody = document.getElementById("modalBody");
  const closeModalBtn = document.getElementById("closeModal");
  const modalOverlay = modal.querySelector(".modal__overlay");
  function openModal(newsId) {
    const news = newsData2[newsId];
    if (!news) return;
    modalBody.innerHTML = `
      <div class="news-modal">
        <div class="news-modal__image">
          <img src="${news.image}" alt="${news.title}">
        </div>
        <h2 class="news-modal__title">${news.title}</h2>
        <div class="news-modal__meta">
          <div class="news-modal__date">📅 ${news.date}</div>
          <div class="news-modal__category">🏷️ ${news.category}</div>
        </div>
        <div class="news-modal__content">
          ${news.content}
        </div>
      </div>
    `;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
  document.addEventListener("click", function(e) {
    if (e.target.classList.contains("news-card__btn")) {
      const newsId = e.target.dataset.newsTarget;
      openModal(newsId);
    }
  });
  closeModalBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
});
document.addEventListener("DOMContentLoaded", function() {
  const carouselTrack = document.querySelector(".services-carousel__track");
  const carouselItems = document.querySelectorAll(".service-card");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("carouselDots");
  const servicesData = {
    1: {
      title: "Представление интересов в судах",
      image: "/assets/img/services/01.avif",
      description: `<p>Наши юристы обеспечат квалифицированное представительство ваших интересов в судах любой инстанции. Мы берем на себя все этапы судебного процесса:</p>
                    <ul>
                        <li>Анализ перспектив дела и разработка стратегии</li>
                        <li>Подготовка исковых заявлений, отзывов, жалоб</li>
                        <li>Сбор и оформление доказательств</li>
                        <li>Участие во всех судебных заседаниях</li>
                        <li>Обжалование судебных актов при необходимости</li>
                    </ul>`
    },
    2: {
      title: "Сбор пакета документов",
      image: "/assets/img/services/02.avif",
      description: `<p>Мы профессионально занимаемся подготовкой и сбором документов для различных юридических процедур:</p>
                    <ul>
                        <li>Регистрация юридических лиц и ИП</li>
                        <li>Оформление недвижимости</li>
                        <li>Подготовка документов для суда</li>
                        <li>Оформление наследства</li>
                        <li>Составление договоров и соглашений</li>
                    </ul>
                    <p>Наши специалисты гарантируют правильность оформления всех документов в соответствии с действующим законодательством.</p>`
    },
    3: {
      title: "Защита прав потребителей",
      image: "/assets/img/services/03.jpg",
      description: `<p>Мы защищаем права потребителей в различных ситуациях:</p>
                    <ul>
                        <li>Возврат некачественного товара</li>
                        <li>Компенсация за нарушение сроков выполнения работ</li>
                        <li>Взыскание неустоек и морального вреда</li>
                        <li>Оспаривание навязанных услуг</li>
                        <li>Защита от недобросовестных продавцов и исполнителей</li>
                    </ul>
                    <p>Наши юристы помогут составить претензии, жалобы в контролирующие органы и представлять ваши интересы в суде.</p>`
    },
    4: {
      title: "Электронный ЭПТС",
      image: "/assets/img/services/04.avif",
      description: `<p>Мы оказываем услуги по оформлению электронного паспорта транспортного средства (ЭПТС):</p>
                    <ul>
                        <li>Консультация по процедуре получения ЭПТС</li>
                        <li>Помощь в сборе необходимых документов</li>
                        <li>Электронная подача заявления</li>
                        <li>Получение готового ЭПТС</li>
                        <li>Решение проблем при отказе в выдаче</li>
                    </ul>
                    <p>ЭПТС — это современный цифровой документ, заменяющий бумажный паспорт транспортного средства.</p>`
    },
    5: {
      title: "Возмещение вреда здоровью и убытков",
      image: "/assets/img/services/05.avif",
      description: `<p>Мы специализируемся на взыскании компенсаций за причинение вреда:</p>
                    <ul>
                        <li>Вред здоровью в результате ДТП, несчастных случаев</li>
                        <li>Вред, причиненный врачебной ошибкой</li>
                        <li>Компенсация морального вреда</li>
                        <li>Возмещение упущенной выгоды</li>
                        <li>Взыскание дополнительных расходов на лечение и реабилитацию</li>
                    </ul>
                    <p>Наши юристы помогут правильно оценить размер компенсации и добиться ее выплаты.</p>`
    },
    6: {
      title: "Открытие, ведение и закрытие ИП и юридических лиц",
      image: "/assets/img/services/06.avif",
      description: `<p>Мы предлагаем полный комплекс услуг для бизнеса:</p>
                    <ul>
                        <li>Регистрация ИП и юридических лиц (ООО, АО)</li>
                        <li>Внесение изменений в учредительные документы</li>
                        <li>Юридическое сопровождение деятельности</li>
                        <li>Реорганизация предприятий</li>
                        <li>Ликвидация ИП и юридических лиц</li>
                        <li>Сопровождение при банкротстве</li>
                    </ul>
                    <p>Наши специалисты возьмут на себя все юридические аспекты вашего бизнеса, позволяя вам сосредоточиться на его развитии.</p>`
    }
  };
  let currentIndex = 0;
  let itemsPerView = calculateItemsPerView();
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  function createDots() {
    dotsContainer.innerHTML = "";
    const dotCount = Math.ceil(carouselItems.length / itemsPerView);
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement("div");
      dot.classList.add("services-carousel__dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => moveToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }
  function calculateItemsPerView() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 992) return 2;
    return 3;
  }
  function handleResize() {
    itemsPerView = calculateItemsPerView();
    updateCarousel();
    createDots();
    if (window.innerWidth < 992) {
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    } else {
      prevBtn.style.display = "flex";
      nextBtn.style.display = "flex";
    }
    updateSwipeHandlers();
  }
  window.addEventListener("resize", handleResize);
  function updateSwipeHandlers() {
    carouselTrack.removeEventListener("mousedown", dragStart);
    carouselTrack.removeEventListener("touchstart", dragStart);
    carouselTrack.removeEventListener("mousemove", drag);
    carouselTrack.removeEventListener("touchmove", drag);
    carouselTrack.removeEventListener("mouseup", dragEnd);
    carouselTrack.removeEventListener("touchend", dragEnd);
    carouselTrack.removeEventListener("mouseleave", dragEnd);
    if (window.innerWidth < 992) {
      carouselTrack.addEventListener("mousedown", dragStart);
      carouselTrack.addEventListener("touchstart", dragStart);
      carouselTrack.addEventListener("mousemove", drag);
      carouselTrack.addEventListener("touchmove", drag);
      carouselTrack.addEventListener("mouseup", dragEnd);
      carouselTrack.addEventListener("touchend", dragEnd);
      carouselTrack.addEventListener("mouseleave", dragEnd);
    }
  }
  function moveToSlide(index) {
    if (index < 0) index = Math.ceil(carouselItems.length / itemsPerView) - 1;
    if (index >= Math.ceil(carouselItems.length / itemsPerView)) index = 0;
    currentIndex = index;
    updateCarousel();
    document.querySelectorAll(".services-carousel__dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }
  function updateCarousel() {
    const itemWidth = carouselItems[0].offsetWidth + 16;
    const translateX = -currentIndex * itemsPerView * itemWidth;
    carouselTrack.style.transform = `translateX(${translateX}px)`;
  }
  prevBtn.addEventListener("click", () => moveToSlide(currentIndex - 1));
  nextBtn.addEventListener("click", () => moveToSlide(currentIndex + 1));
  function dragStart(e) {
    if (e.target.closest(".service-card__btn")) {
      return;
    }
    if (e.type === "touchstart") {
      startPos = e.touches[0].clientX;
    } else {
      startPos = e.clientX;
      e.preventDefault();
    }
    isDragging = true;
    carouselTrack.style.cursor = "grabbing";
    carouselTrack.style.transition = "none";
  }
  function drag(e) {
    if (!isDragging) return;
    let currentPosition;
    if (e.type === "touchmove") {
      currentPosition = e.touches[0].clientX;
    } else {
      currentPosition = e.clientX;
    }
    const diff = currentPosition - startPos;
    const itemWidth = carouselItems[0].offsetWidth + 16;
    const minTranslate = -(carouselItems.length - itemsPerView) * itemWidth;
    const newTranslate = prevTranslate + diff;
    if (newTranslate < minTranslate) {
      currentTranslate = minTranslate;
    } else if (newTranslate > 0) {
      currentTranslate = 0;
    } else {
      currentTranslate = newTranslate;
    }
    carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
  }
  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    carouselTrack.style.cursor = "grab";
    carouselTrack.style.transition = "transform 0.5s ease";
    const itemWidth = carouselItems[0].offsetWidth + 16;
    if (Math.abs(currentTranslate - prevTranslate) > itemWidth * 0.2) {
      if (currentTranslate < prevTranslate) {
        currentIndex++;
      } else if (currentTranslate > prevTranslate) {
        currentIndex--;
      }
    }
    const maxIndex = Math.ceil(carouselItems.length / itemsPerView) - 1;
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    moveToSlide(currentIndex);
    prevTranslate = -currentIndex * itemsPerView * itemWidth;
  }
  const modal = document.getElementById("serviceModal");
  const closeModalBtn = document.getElementById("closeServiceModal");
  const modalBody = document.getElementById("serviceModalBody");
  document.querySelectorAll(".service-card__btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const serviceId = btn.getAttribute("data-service-target");
      openModal(serviceId);
    });
  });
  function openModal(serviceId) {
    const service = servicesData[serviceId];
    if (!service) return;
    modalBody.innerHTML = `
                    <div class="modal__image">
                        <img src="${service.image}" alt="${service.title}">
                    </div>
                    <h2 class="modal__title">${service.title}</h2>
                    <div class="modal__description">${service.description}</div>
                `;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
  closeModalBtn.addEventListener("click", closeModal);
  modal.querySelector(".modal__overlay").addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
  createDots();
  updateCarousel();
  updateSwipeHandlers();
  if (window.innerWidth < 992) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  }
});
newsData;
