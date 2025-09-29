import news01 from '@img/news/news_01.jpg';
import news02 from '@img/news/news_02.png';

document.addEventListener("DOMContentLoaded", function () {
  // Подключаем картинки через Vite
  const news01 = new URL("../assets/img/news/news_01.webp", import.meta.url).href;
  const news02 = new URL("../assets/img/news/news_02.webp", import.meta.url).href;

  // Данные новостей
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
      `,
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
      `,
    },
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

  // Слушатели
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("news-card__btn")) {
      const newsId = e.target.dataset.newsTarget;
      openModal(newsId);
    }
  });

  closeModalBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
});

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 


document.addEventListener('DOMContentLoaded', function () {
  // Конфигурация карусели
  const carouselTrack = document.querySelector('.services-carousel__track');
  const carouselItems = document.querySelectorAll('.service-card');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');

  // Данные для модальных окон
  const servicesData = {
    1: {
      title: "Представление интересов в судах",
      image: "@img/services/01.avif",
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
      image: "@img/services/02.avif",
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
      image: "@img/services/03.jpg",
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
      image: "@img/services/04.avif",
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
      image: "@img/services/05.avif",
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
      image: "@img/services/06.avif",
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

  // Создаем точки-индикаторы
  function createDots() {
    dotsContainer.innerHTML = '';
    const dotCount = Math.ceil(carouselItems.length / itemsPerView);

    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('div');
      dot.classList.add('services-carousel__dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => moveToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  // Определяем количество отображаемых карточек в зависимости от ширины экрана
  function calculateItemsPerView() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 992) return 2;
    return 3;
  }

  // Обновляем карусель при изменении размера окна
  function handleResize() {
    itemsPerView = calculateItemsPerView();
    updateCarousel();
    createDots();

    // Скрываем/показываем кнопки навигации
    if (window.innerWidth < 992) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    }

    // Добавляем или удаляем обработчики свайпа в зависимости от размера экрана
    updateSwipeHandlers();
  }

  window.addEventListener('resize', handleResize);

  // Функция для добавления/удаления обработчиков свайпа
  function updateSwipeHandlers() {
    // Удаляем все существующие обработчики
    carouselTrack.removeEventListener('mousedown', dragStart);
    carouselTrack.removeEventListener('touchstart', dragStart);
    carouselTrack.removeEventListener('mousemove', drag);
    carouselTrack.removeEventListener('touchmove', drag);
    carouselTrack.removeEventListener('mouseup', dragEnd);
    carouselTrack.removeEventListener('touchend', dragEnd);
    carouselTrack.removeEventListener('mouseleave', dragEnd);

    // Добавляем обработчики только для мобильных устройств и планшетов
    if (window.innerWidth < 992) {
      carouselTrack.addEventListener('mousedown', dragStart);
      carouselTrack.addEventListener('touchstart', dragStart);
      carouselTrack.addEventListener('mousemove', drag);
      carouselTrack.addEventListener('touchmove', drag);
      carouselTrack.addEventListener('mouseup', dragEnd);
      carouselTrack.addEventListener('touchend', dragEnd);
      carouselTrack.addEventListener('mouseleave', dragEnd);
    }
  }

  // Перемещение к определенному слайду
  function moveToSlide(index) {
    if (index < 0) index = Math.ceil(carouselItems.length / itemsPerView) - 1;
    if (index >= Math.ceil(carouselItems.length / itemsPerView)) index = 0;

    currentIndex = index;
    updateCarousel();

    // Обновляем активную точку
    document.querySelectorAll('.services-carousel__dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  // Обновление позиции карусели
  function updateCarousel() {
    const itemWidth = carouselItems[0].offsetWidth + 16; // 16px = margin (0.5rem * 2)
    const translateX = -currentIndex * itemsPerView * itemWidth;
    carouselTrack.style.transform = `translateX(${translateX}px)`;
  }

  // Обработчики для кнопок навигации
  prevBtn.addEventListener('click', () => moveToSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => moveToSlide(currentIndex + 1));

  // Функционал перетаскивания для мобильных устройств
  function dragStart(e) {
    // Отменяем свайп, если клик был по кнопке
    if (e.target.closest('.service-card__btn')) {
      return;
    }

    if (e.type === 'touchstart') {
      startPos = e.touches[0].clientX;
    } else {
      startPos = e.clientX;
      e.preventDefault();
    }

    isDragging = true;
    carouselTrack.style.cursor = 'grabbing';
    carouselTrack.style.transition = 'none';
  }

  function drag(e) {
    if (!isDragging) return;

    let currentPosition;
    if (e.type === 'touchmove') {
      currentPosition = e.touches[0].clientX;
    } else {
      currentPosition = e.clientX;
    }

    const diff = currentPosition - startPos;
    const itemWidth = carouselItems[0].offsetWidth + 16;

    // Ограничиваем перемещение границами карусели
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
    carouselTrack.style.cursor = 'grab';
    carouselTrack.style.transition = 'transform 0.5s ease';

    const itemWidth = carouselItems[0].offsetWidth + 16;
    const draggedSlides = Math.round(-currentTranslate / itemWidth);

    // Определяем направление и силу свайпа
    if (Math.abs(currentTranslate - prevTranslate) > itemWidth * 0.2) {
      if (currentTranslate < prevTranslate) {
        currentIndex++;
      } else if (currentTranslate > prevTranslate) {
        currentIndex--;
      }
    }

    // Ограничиваем индекс в пределах доступных слайдов
    const maxIndex = Math.ceil(carouselItems.length / itemsPerView) - 1;
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    moveToSlide(currentIndex);
    prevTranslate = -currentIndex * itemsPerView * itemWidth;
  }

  // Модальное окно
  const modal = document.getElementById('serviceModal');
  const closeModalBtn = document.getElementById('closeServiceModal');
  const modalBody = document.getElementById('serviceModalBody');

  // Обработчики для кнопок "Подробнее"
  document.querySelectorAll('.service-card__btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Останавливаем всплытие события, чтобы не активировался свайп
      e.stopPropagation();
      const serviceId = btn.getAttribute('data-service-target');
      openModal(serviceId);
    });
  });

  // Открытие модального окна
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

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Закрытие модального окна
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  closeModalBtn.addEventListener('click', closeModal);
  modal.querySelector('.modal__overlay').addEventListener('click', closeModal);

  // Закрытие модального окна по клавише Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Инициализация карусели
  createDots();
  updateCarousel();
  updateSwipeHandlers();

  // Скрываем кнопки навигации на мобильных устройствах при загрузке
  if (window.innerWidth < 992) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }
});



export default newsData;

// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 


