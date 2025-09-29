import './header.scss'


document.addEventListener('DOMContentLoaded', function() {
  // Данные для поиска (можно заменить на данные с сервера)
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

  // Элементы
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchResultsContent = document.getElementById('searchResultsContent');
  const searchForm = document.getElementById('searchForm');

  // Функция для выделения совпадений
  function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="search-results__highlight">$1</span>');
  }

  // Функция поиска
  function search(query) {
    if (!query.trim()) {
      searchResults.classList.remove('active');
      return;
    }

    const results = searchData.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.text.toLowerCase().includes(query.toLowerCase())
    );

    displayResults(results, query);
  }

  // Функция отображения результатов
  function displayResults(results, query) {
    if (results.length === 0) {
      searchResultsContent.innerHTML = `
        <div class="search-results__no-results">
          По запросу "${query}" ничего не найдено
        </div>
      `;
    } else {
      const resultsHTML = results.map(item => `
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
      `).join('');

      searchResultsContent.innerHTML = resultsHTML;
    }

    searchResults.classList.add('active');
  }

  // Обработчик ввода в поисковое поле
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value;
    search(query);
  });

  // Обработчик отправки формы
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      // Здесь можно добавить логику для перехода на страницу результатов
      console.log('Поиск по запросу:', query);
    }
  });

  // Закрытие результатов поиска при клике вне поля
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.remove('active');
    }
  });

  // Закрытие результатов поиска по клавише Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      searchResults.classList.remove('active');
      searchInput.blur();
    }
  });

  // Мобильное меню
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.querySelector('.legal-header__nav');

  mobileToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    
    // Анимация гамбургера
    const spans = mobileToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Закрытие мобильного меню при клике на ссылку
  const navLinks = document.querySelectorAll('.legal-header__nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navMenu.classList.remove('active');
      const spans = mobileToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });
});