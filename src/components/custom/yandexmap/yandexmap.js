import "./yandexmap.scss"


document.addEventListener('DOMContentLoaded', function() {
  // Конфигурация карты
  const mapConfig = {
    center: [43.915967, 39.323042], // Москва, Красная площадь (заменить на реальные координаты)
    zoom: 17,
    address: 'г. Сочи, ул. Победы, д. 112',
    placemarkName: 'Многофункциональный правовой центр.'
  };

  // Флаг загрузки API
  let ymapsLoaded = false;

  // Функция загрузки API Яндекс.Карт
  function loadYandexMaps() {
    return new Promise((resolve, reject) => {
      if (window.ymaps) {
        resolve(window.ymaps);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=ВАШ_API_КЛЮЧ';
      script.onload = () => {
        ymaps.ready(() => {
          ymapsLoaded = true;
          resolve(ymaps);
        });
      };
      script.onerror = () => {
        reject(new Error('Не удалось загрузить API Яндекс.Карт'));
      };
      
      document.head.appendChild(script);
    });
  }

  // Функция инициализации карты
  async function initMap() {
    const mapContainer = document.getElementById('mapContainer');
    const mapLoading = document.getElementById('mapLoading');
    const mapError = document.getElementById('mapError');

    try {
      // Скрываем ошибку, показываем загрузку
      mapError.style.display = 'none';
      mapLoading.style.display = 'flex';

      // Загружаем API
      const ymaps = await loadYandexMaps();

      // Скрываем загрузку
      mapLoading.style.display = 'none';

      // Создаем карту
      const map = new ymaps.Map('mapContainer', {
        center: mapConfig.center,
        zoom: mapConfig.zoom,
        controls: ['zoomControl', 'fullscreenControl']
      });

      // Добавляем метку
      const placemark = new ymaps.Placemark(mapConfig.center, {
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
        preset: 'islands#blueOfficeIcon'
      });

      map.geoObjects.add(placemark);

      // Центрируем карту при изменении размера окна
      window.addEventListener('resize', () => {
        map.container.fitToViewport();
      });

    } catch (error) {
      console.error('Ошибка инициализации карты:', error);
      mapLoading.style.display = 'none';
      mapError.style.display = 'flex';
    }
  }

  // Функция для открытия маршрута в Яндекс.Картах
  function openYandexRoute() {
    const destination = encodeURIComponent(mapConfig.address);
    const url = `https://yandex.ru/maps/?rtext=~${mapConfig.center[0]},${mapConfig.center[1]}&rtt=auto`;
    window.open(url, '_blank');
  }

  // Функция для открытия маршрута в Google Maps
  function openGoogleRoute() {
    const destination = encodeURIComponent(mapConfig.address);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mapConfig.center[0]},${mapConfig.center[1]}`;
    window.open(url, '_blank');
  }

  // Обработчик повторной попытки загрузки карты
  document.getElementById('retryMap').addEventListener('click', initMap);

  // Инициализация карты при загрузке страницы
  initMap();

  // Экспортируем функции для глобального использования
  window.openYandexRoute = openYandexRoute;
  window.openGoogleRoute = openGoogleRoute;
});