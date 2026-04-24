document.addEventListener('DOMContentLoaded', () => {
    // --- Navegación Suave ---
    const navLinks = document.querySelectorAll('.nav-links a, .btn-nav');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetHref = this.getAttribute('href');
            if (targetHref.startsWith('#')) {
                e.preventDefault();
                document.querySelectorAll('.nav-links a').forEach(n => n.classList.remove('active'));
                if(this.classList.contains('active') === false && !this.classList.contains('btn-nav')) {
                    this.classList.add('active');
                }
                const targetSection = document.querySelector(targetHref);
                if (targetSection) {
                    window.scrollTo({ top: targetSection.offsetTop - 75, behavior: 'smooth' });
                }
            }
        });
    });

    // --- Color de menú al hacer scroll ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
            navbar.style.backgroundColor = '#080c17';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.backgroundColor = 'var(--dark-bg)';
        }
    });

    // --- LÓGICA DEL CARRUSEL INFINITO Y AUTOMÁTICO ---
    const track = document.querySelector('.services-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (track && prevBtn && nextBtn) {
        // Clonamos TODAS las tarjetas y las pegamos al final para crear el "bucle infinito"
        const originalCards = Array.from(track.children);
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            track.appendChild(clone);
        });

        // Función para calcular el ancho de cada tarjeta más el espacio de separación (gap)
        const getCardWidth = () => {
            return document.querySelector('.service-card').offsetWidth + 20; 
        };

        const moveNext = () => {
            // Si el scroll llega a la mitad (donde terminan los originales y empiezan los clones)
            if (track.scrollLeft >= (track.scrollWidth / 2)) {
                // Quitamos la animación de deslizamiento y regresamos a la posición inicial en 0 segundos
                track.style.scrollBehavior = 'auto';
                track.scrollLeft = 0;
                // Forzamos al navegador a procesar el cambio (reflow)
                void track.offsetWidth; 
            }
            // Restauramos el movimiento suave y avanzamos
            track.style.scrollBehavior = 'smooth';
            track.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
        };

        const movePrev = () => {
            // Si estamos al principio de todo y queremos ir hacia atrás
            if (track.scrollLeft <= 0) {
                // Saltamos silenciosamente a la mitad clonada
                track.style.scrollBehavior = 'auto';
                track.scrollLeft = track.scrollWidth / 2;
                void track.offsetWidth;
            }
            track.style.scrollBehavior = 'smooth';
            track.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
        };

        // Activamos el movimiento automático cada 3 segundos
        let autoPlay = setInterval(moveNext, 3000); 

        // Botón Manual: Siguiente
        nextBtn.addEventListener('click', () => {
            clearInterval(autoPlay); // Pausar automático al presionar manual
            moveNext();
            autoPlay = setInterval(moveNext, 3000); // Reactivar
        });

        // Botón Manual: Anterior
        prevBtn.addEventListener('click', () => {
            clearInterval(autoPlay);
            movePrev();
            autoPlay = setInterval(moveNext, 3000);
        });

        // Pausar el carrusel cuando el usuario ponga el mouse encima (para poder leer)
        const container = document.querySelector('.carousel-container');
        container.addEventListener('mouseenter', () => clearInterval(autoPlay));
        container.addEventListener('mouseleave', () => {
            clearInterval(autoPlay);
            autoPlay = setInterval(moveNext, 3000);
        });
    }
});