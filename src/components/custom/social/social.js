import "./social.scss"


document.addEventListener('DOMContentLoaded', function() {
  // Функция для форматирования номера телефона
  function formatPhoneNumber(phone) {
    // Убираем все нецифровые символы
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Если начинается с 8, заменяем на 7
    if (cleanPhone.startsWith('8')) {
      return '7' + cleanPhone.substring(1);
    }
    
    // Если начинается с +7, убираем +
    if (cleanPhone.startsWith('7')) {
      return cleanPhone;
    }
    
    // Если 10 цифр, добавляем 7 в начало
    if (cleanPhone.length === 10) {
      return '7' + cleanPhone;
    }
    
    return cleanPhone;
  }

  // Функция для открытия WhatsApp
  function openWhatsApp(phone, message = '') {
    const formattedPhone = formatPhoneNumber(phone);
    let url = `https://wa.me/${formattedPhone}`;
    
    if (message) {
      url += `?text=${encodeURIComponent(message)}`;
    }
    
    window.open(url, '_blank');
  }

  // Функция для открытия Viber
  function openViber(number) {
    const formattedNumber = formatPhoneNumber(number);
    const url = `viber://chat?number=${formattedNumber}`;
    window.open(url, '_blank');
  }

  // Обработчики событий для WhatsApp ссылок
  const whatsappLinks = document.querySelectorAll('[href^="https://wa.me/"], [href^="whatsapp://"]');
  whatsappLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Если есть data-phone атрибут, используем его
      const phone = this.dataset.phone;
      const message = this.dataset.message;
      
      if (phone) {
        e.preventDefault();
        openWhatsApp(phone, message);
      }
    });
  });

  // Обработчики событий для Viber ссылок
  const viberLinks = document.querySelectorAll('[href^="viber://"]');
  viberLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const number = this.dataset.number;
      
      if (number) {
        e.preventDefault();
        openViber(number);
      }
    });
  });

  // Добавляем универсальные обработчики для кнопок быстрого чата
  const quickChatButtons = document.querySelectorAll('[data-quick-chat]');
  
  quickChatButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const chatType = this.dataset.quickChat;
      const phone = this.dataset.phone;
      const username = this.dataset.username;
      const message = this.dataset.message || 'Здравствуйте! Хочу получить консультацию.';
      
      switch(chatType) {
        case 'whatsapp':
          if (phone) {
            openWhatsApp(phone, message);
          }
          break;
          
        case 'telegram':
          if (username) {
            const url = `https://t.me/${username}`;
            window.open(url, '_blank');
          }
          break;
          
        case 'viber':
          if (phone) {
            openViber(phone);
          }
          break;
          
        default:
          console.warn('Неизвестный тип чата:', chatType);
      }
    });
  });

  // Функция для открытия чата с предзаполненным сообщением
  window.openChat = function(platform, contact, message = '') {
    switch(platform) {
      case 'whatsapp':
        openWhatsApp(contact, message);
        break;
        
      case 'telegram':
        if (contact.startsWith('@')) {
          contact = contact.substring(1);
        }
        const telegramUrl = `https://t.me/${contact}`;
        window.open(telegramUrl, '_blank');
        break;
        
      case 'viber':
        openViber(contact);
        break;
        
      default:
        console.warn('Неизвестная платформа:', platform);
    }
  };

  // Пример использования в HTML:
  // <button onclick="openChat('whatsapp', '79991234567', 'Хочу консультацию')">
  //   Написать в WhatsApp
  // </button>
});

// Дополнительные функции для удобства
const SocialChat = {
  // Открыть чат WhatsApp с номером и сообщением
  whatsapp: function(phone, message = '') {
    const formattedPhone = phone.replace(/\D/g, '').replace(/^8/, '7');
    let url = `https://wa.me/${formattedPhone}`;
    
    if (message) {
      url += `?text=${encodeURIComponent(message)}`;
    }
    
    window.open(url, '_blank');
  },

  // Открыть чат Telegram с username
  telegram: function(username) {
    if (username.startsWith('@')) {
      username = username.substring(1);
    }
    const url = `https://t.me/${username}`;
    window.open(url, '_blank');
  },

  

  // Быстрый чат с предзаполненным сообщением
  quickChat: function(platform, contact, template = '') {
    const defaultTemplate = 'Здравствуйте! Хочу получить консультацию юриста.';
    const message = template || defaultTemplate;
    
    switch(platform) {
      case 'whatsapp':
        this.whatsapp(contact, message);
        break;
      case 'telegram':
        this.telegram(contact);
        break;
      case 'viber':
        this.viber(contact);
        break;
    }
  }
};

// Делаем доступным глобально
window.SocialChat = SocialChat;