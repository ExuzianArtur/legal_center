// Підключення функціоналу "Чортоги Фрілансера"
import { addTouchAttr, bodyLockStatus, bodyLockToggle, FLS } from "@js/common/functions.js"

import './menu.scss'

export function menuInit() {
	document.addEventListener("click", function (e) {
		if (bodyLockStatus && e.target.closest('[data-fls-menu]')) {
			bodyLockToggle()
			document.documentElement.toggleAttribute("data-fls-menu-open")
		}
	})
}
document.querySelector('[data-fls-menu]') ?
	window.addEventListener('load', menuInit) : null



	// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
	// drowDown

	document.addEventListener('DOMContentLoaded', function() {
  // Обработчик для дропдаунов на мобильных устройствах
  const dropdownLinks = document.querySelectorAll('.menu__link--dropdown');
  
  dropdownLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Только для мобильных устройств
      if (window.innerWidth <= 768) {
        e.preventDefault();
        
        const parentItem = this.parentElement;
        const dropdown = parentItem.querySelector('.menu__dropdown');
        
        // Переключаем видимость дропдауна
        if (dropdown) {
          const isOpen = parentItem.classList.contains('active');
          
          // Закрываем все другие дропдауны
          document.querySelectorAll('.menu__item').forEach(item => {
            if (item !== parentItem) {
              item.classList.remove('active');
            }
          });
          
          // Переключаем текущий
          parentItem.classList.toggle('active', !isOpen);
        }
      }
    });
  });
  
  // Закрытие дропдаунов при клике вне меню
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.menu')) {
      document.querySelectorAll('.menu__item').forEach(item => {
        item.classList.remove('active');
      });
    }
  });
});