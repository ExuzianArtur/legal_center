import "./socialbtn.scss"


 document.addEventListener('DOMContentLoaded', function() {
            const contactMainBtn = document.getElementById('contactMainBtn');
            const socialButtons = document.getElementById('socialButtons');
            const orbitContainer = document.querySelector('.orbit-container');
            
            // Обработчик клика по основной кнопке
            contactMainBtn.addEventListener('click', function() {
                this.classList.toggle('active');
                socialButtons.classList.toggle('active');
                
                // Убираем анимацию пульсации при первом клике
                this.classList.remove('animate');
            });
            
            // Закрытие меню при клике вне его области
            document.addEventListener('click', function(e) {
                if (!contactMainBtn.contains(e.target) && 
                    !document.querySelector('.social-btn')?.contains(e.target)) {
                    contactMainBtn.classList.remove('active');
                    socialButtons.classList.remove('active');
                }
            });
        });