document.addEventListener('DOMContentLoaded', () => {
    // Basic smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // FAQ Accordion
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items first (accordion behavior)
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Quad-Power Card Stack Interaction
    const quadStack = document.getElementById('quad-stack');
    const cards = Array.from(document.querySelectorAll('.card-item'));
    const nextBtn = document.getElementById('quad-next');
    const prevBtn = document.getElementById('quad-prev');
    
    if (quadStack && cards.length > 0) {
        let positions = ['front', 'right', 'left'];
        const dots = Array.from(document.querySelectorAll('.quad-dots .dot'));
        
        function updateCards() {
            cards.forEach((card, index) => {
                card.className = `quad-power-card card-item position-${positions[index]}`;
            });
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', positions[index] === 'front');
            });
        }
        
        function nextCard() {
            // Shift positions: front -> right, right -> left, left -> front
            positions.unshift(positions.pop());
            updateCards();
        }
        
        function prevCard() {
            // Shift positions: front -> left, left -> right, right -> front
            positions.push(positions.shift());
            updateCards();
        }
        
        if (nextBtn) nextBtn.addEventListener('click', nextCard);
        if (prevBtn) prevBtn.addEventListener('click', prevCard);
        
        // Swipe Support
        let touchStartX = 0;
        let touchEndX = 0;
        
        quadStack.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        quadStack.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                nextCard(); // Swipe Left
            } else if (touchEndX > touchStartX + swipeThreshold) {
                prevCard(); // Swipe Right
            }
        }
    }

    // Intersection Observer for reveal-on-scroll
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // observer.unobserve(entry.target); // Keep observing if you want it to fade back out (or not)
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(section => {
        revealObserver.observe(section);
    });

    // Smooth Parallax Effect
    const parallaxElements = document.querySelectorAll('.hero-background, .performance-bg-img');
    
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const winHeight = window.innerHeight;

        parallaxElements.forEach(el => {
            const parent = el.parentElement;
            const parentTop = parent.offsetTop;
            const parentHeight = parent.offsetHeight;

            // Only calculate if section is in or near viewport
            if (scrolled + winHeight > parentTop && scrolled < parentTop + parentHeight) {
                const speed = 0.15; // Adjustment speed
                const yPos = (scrolled - parentTop) * speed;
                el.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });
    }

    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', handleParallax, { passive: true });
        // Initial call to set positions
        handleParallax();
    }
});
