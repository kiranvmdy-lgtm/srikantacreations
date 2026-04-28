/* ============================================
   SRIKANTA CREATIONS - JavaScript
   Client-side routing, animations & interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ============ NAVIGATION / ROUTING ============

    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const header = document.getElementById('header');

    // All clickable elements that trigger navigation
    const allNavTriggers = document.querySelectorAll('[data-nav]');

    function navigateTo(pageName) {
        // Hide all pages
        pages.forEach(page => {
            page.classList.remove('active');
            page.style.animation = 'none';
        });

        // Show target page
        const targetPage = document.getElementById('page-' + pageName);
        if (targetPage) {
            // Trigger reflow for animation restart
            void targetPage.offsetWidth;
            targetPage.style.animation = '';
            targetPage.classList.add('active');
        }

        // Update nav links
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.nav === pageName);
        });

        // Update mobile menu links
        mobileMenuLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.nav === pageName);
        });

        // Close mobile menu
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Re-observe elements for scroll animation
        setTimeout(() => {
            observeScrollAnimations();
        }, 100);
    }

    // Attach click handlers to all nav triggers
    allNavTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const page = trigger.dataset.nav;
            navigateTo(page);
            // Update hash without jumping
            history.pushState(null, '', '#' + page);
        });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.slice(1) || 'home';
        navigateTo(hash);
    });

    // Load initial page from hash
    const initialPage = window.location.hash.slice(1) || 'home';
    navigateTo(initialPage);

    // ============ MOBILE MENU ============

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // ============ HEADER SCROLL EFFECT ============

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        header.classList.toggle('scrolled', currentScroll > 50);
        lastScroll = currentScroll;
    }, { passive: true });

    // ============ SCROLL ANIMATIONS ============

    function observeScrollAnimations() {
        const activePage = document.querySelector('.page.active');
        if (!activePage) return;

        const targets = activePage.querySelectorAll(
            '.service-card, .feature-card, .commitment-item, .process-step, .tag, .contact-form-wrapper, .contact-promise-card, .contact-details-card'
        );

        targets.forEach(el => {
            el.classList.add('animate-on-scroll');
            el.classList.remove('visible');
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Staggered delay
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, index * 80);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        targets.forEach(el => observer.observe(el));
    }

    // Initial call
    setTimeout(observeScrollAnimations, 200);

    // ============ CONTACT FORM ============

    const contactForm = document.getElementById('contactForm');
    const thankyouOverlay = document.getElementById('thankyouOverlay');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Show thank you overlay
            thankyouOverlay.classList.add('active');
            thankyouOverlay.style.display = 'flex';

            // Reset form
            contactForm.reset();

            // Hide overlay after 3 seconds
            setTimeout(() => {
                thankyouOverlay.style.opacity = '0';
                setTimeout(() => {
                    thankyouOverlay.classList.remove('active');
                    thankyouOverlay.style.display = 'none';
                    thankyouOverlay.style.opacity = '';
                }, 400);
            }, 3000);
        });

        // Click overlay to close
        thankyouOverlay.addEventListener('click', () => {
            thankyouOverlay.style.opacity = '0';
            setTimeout(() => {
                thankyouOverlay.classList.remove('active');
                thankyouOverlay.style.display = 'none';
                thankyouOverlay.style.opacity = '';
            }, 400);
        });
    }

    // ============ SMOOTH HOVER EFFECTS ============

    // Add subtle parallax to hero wave on mouse move
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const waves = hero.querySelectorAll('.hero-wave');
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 10;
            waves.forEach((wave, i) => {
                const factor = (i + 1) * 0.5;
                wave.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        });
    }

    // ============ FLOATING BUTTON VISIBILITY ============

    const floatingBtn = document.getElementById('floatingEnquire');
    let floatingVisible = true;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;

        // Hide near footer
        if (scrollTop + windowHeight >= docHeight - 100) {
            if (floatingVisible) {
                floatingBtn.style.transform = 'translateY(100px)';
                floatingBtn.style.opacity = '0';
                floatingVisible = false;
            }
        } else {
            if (!floatingVisible) {
                floatingBtn.style.transform = 'translateY(0)';
                floatingBtn.style.opacity = '1';
                floatingVisible = true;
            }
        }
    }, { passive: true });

    // ============ CHATBOX ============

    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatBadge = document.getElementById('chatBadge');
    const chatQuickReplies = document.getElementById('chatQuickReplies');
    const quickReplyBtns = document.querySelectorAll('.quick-reply-btn');
    const chatIconOpen = document.querySelector('.chat-icon-open');
    const chatIconClose = document.querySelector('.chat-icon-close');

    let chatOpen = false;

    function getTimeString() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function addMessage(text, type = 'bot') {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${type}`;
        msg.innerHTML = `
            <div class="chat-msg-avatar">${type === 'bot' ? '✦' : '👤'}</div>
            <div>
                <div class="chat-msg-bubble">${text}</div>
                <span class="chat-msg-time">${getTimeString()}</span>
            </div>
        `;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'chat-msg bot';
        typing.id = 'typingIndicator';
        typing.innerHTML = `
            <div class="chat-msg-avatar">✦</div>
            <div class="chat-msg-bubble">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typing);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTyping() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    function getBotResponse(message) {
        const msg = message.toLowerCase();

        if (msg.includes('paper bag') || msg.includes('paper bags')) {
            return "📦 We offer premium <b>Craft & Luxury White Paper Bags</b> with custom logo printing! Perfect for boutiques, gifts, festivals & corporate events. We accept min to max orders.<br><br>Shall I connect you with our team for a custom quote?";
        }
        if (msg.includes('dress') || msg.includes('stitch') || msg.includes('tailor') || msg.includes('shirt') || msg.includes('pant') || msg.includes('kurta') || msg.includes('blazer') || msg.includes('suit')) {
            return "👔 Our expert tailoring covers:<br>• Formal & Casual Pants/Shirts<br>• Kurta Paijama<br>• Suits & Blazers<br>• Men & Ladies Alterations<br><br>We deliver perfect designs on time! Would you like to book a consultation?";
        }
        if (msg.includes('insurance') || msg.includes('health') || msg.includes('life') || msg.includes('motor') || msg.includes('policy')) {
            return "🛡️ We provide personalised <b>Life, Health & Motor Insurance</b> plans with:<br>• Budget-friendly guidance<br>• Pre & post sale services<br>• Simplified insurance education<br><br>Want to discuss the best plan for you?";
        }
        if (msg.includes('quote') || msg.includes('price') || msg.includes('cost') || msg.includes('rate') || msg.includes('charge')) {
            return "💰 We'd love to give you a personalised quote! Please share:<br>1. Which service you need<br>2. Your requirements<br>3. Quantity (for paper bags)<br><br>Or visit our <b>Contact page</b> to submit a detailed enquiry — we respond within 24 hours!";
        }
        if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('good')) {
            return "Hello! 👋 Welcome to <b>Srikanta Creations</b>. How can I help you today? You can ask about:<br>• Custom Paper Bags<br>• Dress Stitching<br>• Insurance Services<br>• Getting a Quote";
        }
        if (msg.includes('contact') || msg.includes('phone') || msg.includes('call') || msg.includes('email')) {
            return "📞 You can reach us at:<br>• <b>Phone:</b> +91 92415 65808<br>• <b>Email:</b> srikantasn915@gmail.com<br>• <b>Location:</b> Mudalapalya, Bengaluru 560072<br><br>Or fill out the form on our Contact page and we'll respond within 24 hours!";
        }
        if (msg.includes('thank') || msg.includes('thanks')) {
            return "You're welcome! 😊 Feel free to reach out anytime. We're always happy to help!";
        }
        if (msg.includes('delivery') || msg.includes('time') || msg.includes('how long')) {
            return "⏱️ We pride ourselves on <b>prompt delivery</b>! Timelines depend on the service and order size. We discuss everything in detail before starting — no surprises!";
        }
        if (msg.includes('order') || msg.includes('minimum') || msg.includes('bulk')) {
            return "📋 We accept orders of <b>all sizes</b> — from minimum to maximum! No order is too small or too large. Share your requirements and we'll get back with a quote.";
        }

        return "Thank you for your message! 😊 Our team will review and respond shortly. Meanwhile, you can:<br>• Ask about our <b>Paper Bags, Tailoring, or Insurance</b> services<br>• Visit our <b>Contact page</b> for a detailed enquiry<br><br>We respond within 24 hours!";
    }

    function sendMessage(text) {
        if (!text.trim()) return;
        addMessage(text, 'user');
        chatInput.value = '';

        // Show typing indicator
        showTyping();

        // Bot response after delay
        setTimeout(() => {
            removeTyping();
            const response = getBotResponse(text);
            addMessage(response, 'bot');
        }, 1000 + Math.random() * 800);
    }

    // Toggle chat
    chatToggle.addEventListener('click', () => {
        chatOpen = !chatOpen;
        chatWindow.classList.toggle('open', chatOpen);
        chatIconOpen.style.display = chatOpen ? 'none' : 'block';
        chatIconClose.style.display = chatOpen ? 'block' : 'none';
        chatBadge.classList.add('hidden');

        if (chatOpen) {
            chatToggle.style.animation = 'none';
            setTimeout(() => chatInput.focus(), 350);
        } else {
            chatToggle.style.animation = '';
        }
    });

    chatClose.addEventListener('click', () => {
        chatOpen = false;
        chatWindow.classList.remove('open');
        chatIconOpen.style.display = 'block';
        chatIconClose.style.display = 'none';
    });

    // Send on button click
    chatSend.addEventListener('click', () => {
        sendMessage(chatInput.value);
    });

    // Send on Enter
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage(chatInput.value);
        }
    });

    // Quick replies
    quickReplyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sendMessage(btn.dataset.reply);
        });
    });

    // Initial welcome message (delayed)
    setTimeout(() => {
        addMessage("Hello! 👋 Welcome to <b>Srikanta Creations</b>. How can I assist you today?");
    }, 1500);

});

