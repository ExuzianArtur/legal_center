import "./scrolltop.scss"

document.addEventListener('DOMContentLoaded', function() {
  // Получаем элементы
  const scrollTopBtn = document.getElementById('scrollTop');
  const scrollButton = scrollTopBtn.querySelector('.scroll-top__button');
  
  // Порог появления кнопки (в пикселях от верха)
  const SHOW_THRESHOLD = 300;
  
  // Скорость прокрутки (меньше = быстрее)
  const SCROLL_SPEED = 800;
  
  // Флаг для отслеживания состояния прокрутки
  let isScrolling = false;
  
  // Функция проверки позиции скролла
  function checkScrollPosition() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > SHOW_THRESHOLD) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }
  
  // Функция плавной прокрутки наверх
  function scrollToTop() {
    if (isScrolling) return;
    
    isScrolling = true;
    scrollButton.classList.add('pulse');
    
    // Используем современный API плавной прокрутки
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Сбрасываем флаг через короткое время
      setTimeout(() => {
        isScrolling = false;
        scrollButton.classList.remove('pulse');
      }, SCROLL_SPEED);
    } else {
      // Fallback для старых браузеров
      smoothScrollToTop();
    }
  }
  
  // Альтернативная функция плавной прокрутки
  function smoothScrollToTop() {
    const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    
    if (currentScroll > 0) {
      window.requestAnimationFrame(smoothScrollToTop);
      window.scrollTo(0, currentScroll - (currentScroll / 8));
    } else {
      isScrolling = false;
      scrollButton.classList.remove('pulse');
    }
  }
  
  // Функция для прокрутки к определенному элементу
  function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
  
  // Функция для добавления анимации при достижении футера
  function checkFooterVisibility() {
    const footer = document.querySelector('footer') || document.querySelector('.footer');
    if (!footer) return;
    
    const footerRect = footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Если футер виден на экране
    if (footerRect.top < windowHeight) {
      scrollButton.classList.add('pulse');
    } else {
      scrollButton.classList.remove('pulse');
    }
  }
  
  // Обработчики событий
  scrollButton.addEventListener('click', scrollToTop);
  
  // Слушаем события скролла
  let scrollTimer;
  window.addEventListener('scroll', function() {
    // Throttle для оптимизации производительности
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      checkScrollPosition();
      checkFooterVisibility();
    }, 100);
  });
  
  // Инициализация при загрузке страницы
  checkScrollPosition();
  
  // Добавляем обработчик для клавиши Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && scrollTopBtn.classList.contains('visible')) {
      scrollToTop();
    }
  });
  
  // Экспортируем функции для глобального использования
  window.scrollToTop = scrollToTop;
  window.scrollToElement = scrollToElement;
  
  // Дополнительные функции для удобства
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
      scrollTopBtn.classList.add('visible');
    },
    
    hide: function() {
      scrollTopBtn.classList.remove('visible');
    },
    
    // Установить порог появления
    setThreshold: function(threshold) {
      SHOW_THRESHOLD = threshold;
    }
  };
  
  // Делаем доступным глобально
  window.ScrollTop = ScrollTop;
});

// Дополнительный скрипт для кастомизации поведения
(function() {
  // Можно добавить пользовательские настройки
  const ScrollTopConfig = {
    // Селекторы для отслеживания
    triggers: {
      footer: 'footer, .footer, .legal-footer',
      header: 'header, .header, .legal-header'
    },
    
    // Анимации
    animations: {
      show: 'fadeInUp',
      hide: 'fadeOutDown'
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