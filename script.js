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

    // Testimonial Horizontal Scroll
    const testimonialsSection = document.getElementById('testimonials');
    const testimonialsTrack = document.querySelector('.testimonials-track');
    
    function handleTestimonialScroll() {
        if (window.innerWidth < 1024 || !testimonialsSection || !testimonialsTrack) {
            // Reset on mobile
            if (testimonialsTrack) testimonialsTrack.style.transform = '';
            if (testimonialsSection) testimonialsSection.style.height = '';
            return;
        }
        
        const trackWidth = testimonialsTrack.scrollWidth;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const maxHorizontalScroll = trackWidth - viewportWidth;
        
        const totalHeight = maxHorizontalScroll + viewportHeight;
        testimonialsSection.style.height = `${totalHeight}px`;
        
        const sectionTop = testimonialsSection.offsetTop;
        const scrolled = window.pageYOffset;
        const start = sectionTop;
        const end = sectionTop + maxHorizontalScroll;
        
        if (scrolled >= start && scrolled <= end) {
            testimonialsTrack.style.transform = `translateX(-${scrolled - start}px)`;
        } else if (scrolled < start) {
            testimonialsTrack.style.transform = `translateX(0)`;
        } else if (scrolled > end) {
            testimonialsTrack.style.transform = `translateX(-${maxHorizontalScroll}px)`;
        }
    }

    // Quad Advantage Horizontal Scroll
    const advantageSection = document.getElementById('quad-advantage');
    const advantageTrack = document.querySelector('.advantage-track');
    const advantageCards = document.querySelectorAll('.advantage-track .feature-card');

    function handleAdvantageScroll() {
        if (window.innerWidth < 1024 || !advantageSection || !advantageTrack || advantageCards.length === 0) {
            if (advantageTrack) advantageTrack.style.transform = '';
            if (advantageSection) advantageSection.style.height = '';
            return;
        }

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const cardWidth = advantageCards[0].offsetWidth;
        const trackWidth = advantageTrack.scrollWidth;
        
        // Initial offset to center the first card
        const initialOffset = (viewportWidth - cardWidth) / 2;
        
        // Max scroll distance: we want the last card to end up centered
        const totalHorizontalDistance = trackWidth - cardWidth;
        
        // Set section height
        const totalSectionHeight = totalHorizontalDistance + viewportHeight;
        advantageSection.style.height = `${totalSectionHeight}px`;

        const sectionTop = advantageSection.offsetTop;
        const scrolled = window.pageYOffset;
        const start = sectionTop;
        const end = sectionTop + totalHorizontalDistance;

        if (scrolled >= start && scrolled <= end) {
            const currentTranslate = initialOffset - (scrolled - start);
            advantageTrack.style.transform = `translateX(${currentTranslate}px)`;
        } else if (scrolled < start) {
            advantageTrack.style.transform = `translateX(${initialOffset}px)`;
        } else if (scrolled > end) {
            advantageTrack.style.transform = `translateX(${initialOffset - totalHorizontalDistance}px)`;
        }
    }

    window.addEventListener('scroll', () => {
        handleTestimonialScroll();
        handleAdvantageScroll();
    }, { passive: true });

    window.addEventListener('resize', () => {
        handleTestimonialScroll();
        handleAdvantageScroll();
    });

    // Initialize
    handleTestimonialScroll();
    handleAdvantageScroll();
});
