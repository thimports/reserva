// ============================================
// SCRIPT PRINCIPAL - PÁGINA DE PRODUTO
// ============================================

// Meta Pixel ID
const META_PIXEL_ID = '884958551067664';

const colorMediaMap = {
    'Preto': { type: 'image', src: 'images/preta.jpg' },
    'Branco': { type: 'image', src: 'images/thumb.jpg' },
    'Preto Stoned': { type: 'image', src: 'images/thumb (2).jpg' },
    'Verde Stoned': { type: 'image', src: 'images/thumb (3).jpg' },
    'Marinho': { type: 'image', src: 'images/thumb (4).jpg' },
    'Cinza Mescla': { type: 'image', src: 'images/thumb (5).jpg' },
    'Marinho Stoned': { type: 'image', src: 'images/thumb (1).jpg' }
};

const cartColorImageMap = {
    'Preto': 'images/preta.jpg',
    'Branco': 'images/thumb.jpg',
    'Preto Stoned': 'images/thumb (2).jpg',
    'Verde Stoned': 'images/thumb (3).jpg',
    'Marinho': 'images/thumb (4).jpg',
    'Cinza Mescla': 'images/thumb (5).jpg',
    'Marinho Stoned': 'images/thumb (1).jpg'
};

// Mapeamento de cores para order bump (cuecas)
const orderBumpColorImageMap = {
    'Branca': 'images/cuecabranca.jpg',
    'Preta': 'images/cuecapreta.jpg'
};

// Variáveis globais
let prevBtn, nextBtn, carouselIndicators;
let zoomOverlay, zoomImage, zoomClose;
let currentMediaIndex = 0;
let doubleClickTimer = null;

const mediaItems = [
    { type: 'image', src: 'images/preta.jpg' },
    { type: 'image', src: 'images/thumb.jpg' },
    { type: 'image', src: 'images/thumb (2).jpg' },
    { type: 'image', src: 'images/thumb (3).jpg' },
    { type: 'image', src: 'images/thumb (4).jpg' },
    { type: 'image', src: 'images/thumb (5).jpg' },
    { type: 'image', src: 'images/thumb (1).jpg' }
];

// ============================================
// FUNÇÕES DE COUNTDOWN
// ============================================

function initCountdown() {
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (!hoursEl || !minutesEl || !secondsEl) return;
    
    function getEndOfDay() {
        const now = new Date();
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        return endOfDay;
    }
    
    function updateCountdown() {
        const now = new Date();
        const endOfDay = getEndOfDay();
        let diff = endOfDay.getTime() - now.getTime();
        
        if (diff < 0) {
            const nextEndOfDay = getEndOfDay();
            diff = nextEndOfDay.getTime() - now.getTime();
            const hours = Math.floor(diff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
            const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
            const secs = Math.floor(diff % (1000 * 60) / 1000);
            hoursEl.textContent = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');
            secondsEl.textContent = String(secs).padStart(2, '0');
            return;
        }
        
        const hours = Math.floor(diff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
        const secs = Math.floor(diff % (1000 * 60) / 1000);
        
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(secs).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ============================================
// GALERIA: uma imagem por vez, setas para trocar
// ============================================

let galleryMainImg = null;
let galleryMainVideo = null;
let galleryContainer = null;

function updateGalleryView() {
    if (!galleryMainImg || !galleryMainVideo) return;
    const media = mediaItems[currentMediaIndex];
    if (!media) return;
    if (media.type === 'video') {
        galleryMainVideo.src = media.src;
        galleryMainVideo.style.display = 'block';
        galleryMainVideo.play().catch(function() {});
        galleryMainImg.style.display = 'none';
    } else {
        galleryMainImg.src = media.src;
        galleryMainImg.style.display = 'block';
        galleryMainVideo.pause();
        galleryMainVideo.style.display = 'none';
    }
    updateIndicators();
}

function createIndicators() {
    if (!carouselIndicators) return;
    carouselIndicators.innerHTML = '';
    mediaItems.forEach((item, index) => {
        const indicator = document.createElement('button');
        indicator.classList.add('carousel-indicator');
        if (index === currentMediaIndex) indicator.classList.add('active');
        indicator.setAttribute('aria-label', 'Slide ' + (index + 1));
        indicator.addEventListener('click', () => {
            currentMediaIndex = index;
            updateGalleryView();
        });
        carouselIndicators.appendChild(indicator);
    });
}

function updateIndicators() {
    if (!carouselIndicators) return;
    const indicators = carouselIndicators.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, index) => {
        if (index === currentMediaIndex) indicator.classList.add('active');
        else indicator.classList.remove('active');
    });
}

function initImageGallery() {
    galleryContainer = document.getElementById('mainImageContainer');
    galleryMainImg = document.getElementById('mainImage');
    galleryMainVideo = document.getElementById('mainVideo');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    carouselIndicators = document.getElementById('carouselIndicators');
    zoomOverlay = document.getElementById('zoomOverlay');
    zoomImage = document.getElementById('zoomImage');
    zoomClose = document.getElementById('zoomClose');
    
    if (!galleryMainImg || !galleryMainVideo || !zoomOverlay || !zoomImage || !zoomClose) return;
    
    updateGalleryView();
    createIndicators();
    
    prevBtn.addEventListener('click', () => {
        currentMediaIndex = currentMediaIndex > 0 ? currentMediaIndex - 1 : mediaItems.length - 1;
        updateGalleryView();
    });
    nextBtn.addEventListener('click', () => {
        currentMediaIndex = currentMediaIndex < mediaItems.length - 1 ? currentMediaIndex + 1 : 0;
        updateGalleryView();
    });
    
    galleryContainer.addEventListener('click', (e) => {
        if (e.target.closest('.carousel-indicator') || e.target.closest('.carousel-prev') || e.target.closest('.carousel-next') || e.target.closest('.zoom-close')) return;
        if (e.target.closest('.main-image')) {
            if (doubleClickTimer === null) {
                doubleClickTimer = setTimeout(() => { doubleClickTimer = null; }, 300);
            } else {
                clearTimeout(doubleClickTimer);
                doubleClickTimer = null;
                const media = mediaItems[currentMediaIndex];
                if (media && media.type === 'image') {
                    zoomImage.src = media.src;
                    zoomOverlay.classList.add('active');
                } else {
                    zoomImage.src = galleryMainVideo.src || '';
                    zoomOverlay.classList.add('active');
                }
            }
        }
    });
    
    zoomClose.addEventListener('click', () => zoomOverlay.classList.remove('active'));
    zoomOverlay.addEventListener('click', (e) => {
        if (e.target === zoomOverlay) zoomOverlay.classList.remove('active');
    });
}

document.addEventListener('keydown', (e) => {
    if (zoomOverlay && zoomOverlay.classList.contains('active')) {
        if (e.key === 'Escape') zoomOverlay.classList.remove('active');
        return;
    }
    if (e.key === 'ArrowLeft') {
        currentMediaIndex = currentMediaIndex > 0 ? currentMediaIndex - 1 : mediaItems.length - 1;
        updateGalleryView();
    } else if (e.key === 'ArrowRight') {
        currentMediaIndex = currentMediaIndex < mediaItems.length - 1 ? currentMediaIndex + 1 : 0;
        updateGalleryView();
    }
});

// ============================================
// FUNÇÕES DE SELEÇÃO DE TAMANHO
// ============================================

function initSizeSelection() {
    const sizeButtons = document.querySelectorAll('.size-btn');
    
    if (sizeButtons.length === 0) return;
    
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const shirt = button.dataset.shirt;
            const size = button.dataset.size;
            
            if (!shirt || !size) return;
            
            document.querySelectorAll(`.size-btn[data-shirt="${shirt}"]`).forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            const sizeDisplay = document.getElementById(`selectedSize${shirt}`);
            if (sizeDisplay) {
                sizeDisplay.textContent = size;
            }
            
            if (typeof updateCartContent === 'function') {
                updateCartContent();
            }
            if (typeof updateCartTotal === 'function') {
                updateCartTotal();
            }
        });
    });
}

// ============================================
// FUNÇÕES DE SELEÇÃO DE COR
// ============================================

function initColorSelection() {
    const colorButtons = document.querySelectorAll('.color-btn');
    
    if (colorButtons.length === 0) return;
    
    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('color-btn-out-of-stock')) return;
            
            const shirt = button.dataset.shirt;
            const color = button.dataset.color;
            
            if (!shirt || !color) return;
            
            document.querySelectorAll(`.color-btn[data-shirt="${shirt}"]`).forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            const colorDisplay = document.getElementById(`selectedColor${shirt}`);
            if (colorDisplay) {
                colorDisplay.textContent = color;
            }
            
            // Atualizar galeria quando mudar cor (camiseta 1)
            if (shirt === '1' && colorMediaMap[color] && galleryMainImg) {
                const media = colorMediaMap[color];
                const mediaIndex = mediaItems.findIndex(item => item.src === media.src);
                if (mediaIndex !== -1) {
                    currentMediaIndex = mediaIndex;
                    updateGalleryView();
                }
            }
            
            if (typeof updateCartContent === 'function') {
                updateCartContent();
            }
            if (typeof updateCartTotal === 'function') {
                updateCartTotal();
            }
        });
    });
}

// ============================================
// FUNÇÕES DE TABS
// ============================================

const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// ============================================
// FUNÇÕES DE BOTÃO DE COMPRA E CHECKOUT EXTERNO
// ============================================

// Valores do produto
const MAIN_PRICE = 87.34;
const MAIN_PRICE_OLD = 135.90;
const ORDER_BUMP_CUECAS_PRICE = 15.85;
const ORDER_BUMP_MEIAS_PRICE = 19.90;

// Links de checkout externo por combinação (kit / + cuecas / + meias / full) – iguais ao atual
var CHECKOUT_LINKS = {
    base: 'https://pagamento.tricolorstore.shop/checkout?product=77afad9a-136e-11f1-b2a5-46da4690ad53',   // Kit 2 Camisetas (somente camisetas)
    cuecas: 'https://pagamento.tricolorstore.shop/checkout?product=04ed6a89-136f-11f1-b2a5-46da4690ad53', // Kit + Cuecas
    full: 'https://pagamento.tricolorstore.shop/checkout?product=5f0ea203-136f-11f1-b2a5-46da4690ad53',   // Kit + Cuecas + Meias
    meias: 'https://pagamento.tricolorstore.shop/checkout?product=27275cdc-136f-11f1-b2a5-46da4690ad53'   // Kit + Meias
};
// Base da API para notificar Discord (deixe vazio se bbackup-externo estiver no mesmo domínio do site com /api/)
var NOTIFY_DISCORD_BASE = '';

/** Monta o carrinho (usado para localStorage e para montar parâmetros da URL externa). */
function buildCheckoutCart() {
    const color1 = document.getElementById('selectedColor1')?.textContent || 'Preto';
    const size1 = document.getElementById('selectedSize1')?.textContent || 'P';
    const color2 = document.getElementById('selectedColor2')?.textContent || 'Preto';
    const size2 = document.getElementById('selectedSize2')?.textContent || 'P';
    const image1 = cartColorImageMap[color1] || 'images/preta.jpg';

    const cart = [
        {
            id: 'kit-camisetas',
            name: 'Kit Exclusivo: 2 Camisetas Premium Brasa Pica-Pau com Bordado Artesanal',
            price: MAIN_PRICE,
            priceOld: MAIN_PRICE_OLD,
            quantity: 1,
            image: image1,
            details: 'Camiseta 1: ' + color1 + ', ' + size1 + ' | Camiseta 2: ' + color2 + ', ' + size2
        }
    ];

    const orderBumpCuecas = document.getElementById('orderBumpCheckbox')?.checked || false;
    const orderBumpMeias = document.getElementById('orderBumpMeiasCheckbox')?.checked || false;

    if (orderBumpCuecas) {
        cart.push({
            id: 'cuecas',
            name: 'Kit 2 Cuecas Boxer Algodão Anti-odor',
            price: ORDER_BUMP_CUECAS_PRICE,
            priceOld: 29.90,
            quantity: 1,
            image: 'images/cuecabranca.jpg',
            details: '2 cuecas'
        });
    }
    if (orderBumpMeias) {
        cart.push({
            id: 'meias',
            name: 'Kit 3 Pares de Meias Invisíveis (Não escorregam)',
            price: ORDER_BUMP_MEIAS_PRICE,
            priceOld: 49.90,
            quantity: 1,
            image: 'images/meias.png',
            details: 'Tamanho único 38-43'
        });
    }
    return cart;
}

/** Redireciona para o checkout externo conforme itens selecionados (order bumps). Envia UTMs na URL e notifica Discord (tracking bbackup-externo). */
function goToCheckout() {
    var cart = buildCheckoutCart();
    try {
        localStorage.setItem('checkoutCart', JSON.stringify(cart));
    } catch (e) {
        console.error('Erro ao salvar carrinho:', e);
    }
    var hasCuecas = document.getElementById('orderBumpCheckbox') && document.getElementById('orderBumpCheckbox').checked;
    var hasMeias = document.getElementById('orderBumpMeiasCheckbox') && document.getElementById('orderBumpMeiasCheckbox').checked;
    var link;
    if (hasCuecas && hasMeias) link = CHECKOUT_LINKS.full;
    else if (hasCuecas) link = CHECKOUT_LINKS.cuecas;
    else if (hasMeias) link = CHECKOUT_LINKS.meias;
    else link = CHECKOUT_LINKS.base;

    var cartTotal = cart.reduce(function (s, i) { return s + (i.price || 0) * (i.quantity || 1); }, 0);
    var tracking = {};
    try {
        var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'src', 'sck', 'xcod', 'fbclid', 'gclid', 'ref', 'affiliate_id', 'subid', 'sub_id'];
        keys.forEach(function (key) {
            var v = localStorage.getItem(key);
            if (v && String(v).trim() !== '') tracking[key] = String(v).trim();
        });
    } catch (e) {}
    if (!tracking.src) tracking.src = 'reserva-externo';

    var notifyUrl = NOTIFY_DISCORD_BASE ? (NOTIFY_DISCORD_BASE.replace(/\/$/, '') + '/api/notify-discord.php') : '/api/notify-discord.php';
    try {
        fetch(notifyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'checkout_externo',
                cart: cart.map(function (i) { return { name: i.name, price: i.price || 0, quantity: i.quantity || 1 }; }),
                cartTotal: cartTotal,
                tracking: tracking
            }),
            keepalive: true
        }).catch(function () {});
    } catch (e) {}

    var sep = link.indexOf('?') >= 0 ? '&' : '?';
    var params = new URLSearchParams();
    Object.keys(tracking).forEach(function (k) { params.set(k, tracking[k]); });
    var queryString = params.toString();
    if (queryString) link = link + sep + queryString;
    window.location.href = link;
}

function addToCart() {
    const cartItemKit = document.getElementById('cartItemKit');
    const promoTitle = document.querySelector('.order-bump-promo-title');
    const orderBumpCuecas = document.getElementById('orderBumpCuecas');
    const orderBumpMeias = document.getElementById('orderBumpMeias');
    const cartCount = document.querySelector('.cart-count');
    const cartProductCount = document.querySelector('.cart-product-count');
    const cartBtn = document.querySelector('.cart-btn');

    if (cartItemKit) cartItemKit.style.display = 'block';
    if (promoTitle) promoTitle.style.display = 'block';
    if (orderBumpCuecas) orderBumpCuecas.style.display = 'block';
    if (orderBumpMeias) orderBumpMeias.style.display = 'block';
    if (cartCount) cartCount.textContent = '1';
    if (cartProductCount) cartProductCount.textContent = '(1 produto)';

    updateCartContent();
    updateCartTotal();
    if (cartBtn) cartBtn.click();
}

function initBuyButton() {
    const buyBtn = document.getElementById('buyBtn');
    if (buyBtn) {
        buyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof fbq !== 'undefined') {
                fbq('track', 'AddToCart', {
                    content_name: 'Kit Exclusivo: 2 Camisetas Premium Brasa Pica-Pau',
                    content_ids: ['kit-2-camisetas'],
                    content_type: 'product',
                    value: MAIN_PRICE,
                    currency: 'BRL'
                });
            }
            addToCart();
        });
    }
}

// ============================================
// CARROSSEL DE AVALIAÇÕES (uma por vez, setas embaixo)
// ============================================

function initReviewsCarousel() {
    var section = document.querySelector('.product-reviews');
    if (!section) return;
    var items = section.querySelectorAll('.reviews-list .review-item');
    var total = items.length;
    if (total === 0) return;
    var infoEl = document.getElementById('reviewsPaginationInfo');
    var prevBtns = section.querySelectorAll('#reviewsPrevBtn');
    var nextBtns = section.querySelectorAll('#reviewsNextBtn');
    var currentIndex = 0;

    function updateReviewView() {
        items.forEach(function (item, i) {
            item.classList.toggle('active', i === currentIndex);
        });
        if (infoEl) infoEl.textContent = (currentIndex + 1) + ' de ' + total;
        prevBtns.forEach(function (btn) { btn.disabled = currentIndex === 0; });
        nextBtns.forEach(function (btn) { btn.disabled = currentIndex === total - 1; });
    }

    updateReviewView();
    prevBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (currentIndex > 0) {
                currentIndex--;
                updateReviewView();
            }
        });
    });
    nextBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (currentIndex < total - 1) {
                currentIndex++;
                updateReviewView();
            }
        });
    });
}

// ============================================
// FUNÇÕES DE TABELA DE TAMANHOS
// ============================================

function initSizeTable() {
    const sizeTableBtn = document.getElementById('sizeTableBtn');
    const sizeTableContainer = document.getElementById('sizeTableContainer');
    
    if (sizeTableBtn && sizeTableContainer) {
        sizeTableBtn.addEventListener('click', () => {
            sizeTableBtn.classList.toggle('active');
            sizeTableContainer.classList.toggle('active');
        });
    }
}

// Tabela de medidas (igual à exibida na página) para a calculadora
var SIZE_CHART = [
    { size: 'PP', torax: [84, 88], cintura: [76, 80], quadril: [90, 94] },
    { size: 'P',  torax: [88, 92], cintura: [80, 84], quadril: [94, 98] },
    { size: 'M',  torax: [92, 96], cintura: [84, 88], quadril: [98, 102] },
    { size: 'G',  torax: [100, 104], cintura: [92, 96], quadril: [106, 110] },
    { size: 'GG', torax: [104, 108], cintura: [96, 100], quadril: [110, 114] }
];

function getSuggestedSize(torax, cintura, quadril) {
    var t = Number(torax);
    var c = Number(cintura);
    var q = Number(quadril);
    if (isNaN(t) || isNaN(c) || isNaN(q)) return null;
    // Primeiro: algum tamanho onde as 3 medidas caibam na faixa
    for (var i = 0; i < SIZE_CHART.length; i++) {
        var row = SIZE_CHART[i];
        if (t >= row.torax[0] && t <= row.torax[1] &&
            c >= row.cintura[0] && c <= row.cintura[1] &&
            q >= row.quadril[0] && q <= row.quadril[1]) {
            return row.size;
        }
    }
    // Senão: menor distância aos pontos médios das faixas
    var best = SIZE_CHART[0].size;
    var bestDist = Infinity;
    for (var j = 0; j < SIZE_CHART.length; j++) {
        var r = SIZE_CHART[j];
        var midT = (r.torax[0] + r.torax[1]) / 2;
        var midC = (r.cintura[0] + r.cintura[1]) / 2;
        var midQ = (r.quadril[0] + r.quadril[1]) / 2;
        var dist = Math.abs(t - midT) + Math.abs(c - midC) + Math.abs(q - midQ);
        if (dist < bestDist) {
            bestDist = dist;
            best = r.size;
        }
    }
    return best;
}

function initSizeCalculator() {
    var btn = document.getElementById('sizeCalculatorBtn');
    var container = document.getElementById('sizeCalculatorContainer');
    var submitBtn = document.getElementById('sizeCalculatorSubmit');
    var resultEl = document.getElementById('sizeCalculatorResult');
    var inputTorax = document.getElementById('sizeCalcTorax');
    var inputCintura = document.getElementById('sizeCalcCintura');
    var inputQuadril = document.getElementById('sizeCalcQuadril');

    if (!btn || !container) return;

    btn.addEventListener('click', function () {
        btn.classList.toggle('active');
        container.classList.toggle('active');
        resultEl.classList.remove('visible', 'success', 'error');
        resultEl.textContent = '';
    });

    if (!submitBtn || !resultEl || !inputTorax || !inputCintura || !inputQuadril) return;

    submitBtn.addEventListener('click', function () {
        var torax = inputTorax.value.trim();
        var cintura = inputCintura.value.trim();
        var quadril = inputQuadril.value.trim();

        if (!torax || !cintura || !quadril) {
            resultEl.textContent = 'Preencha as três medidas para descobrir seu tamanho.';
            resultEl.className = 'size-calculator-result visible error';
            return;
        }

        var size = getSuggestedSize(torax, cintura, quadril);
        if (size) {
            resultEl.textContent = 'Seu tamanho sugerido: ' + size;
            resultEl.className = 'size-calculator-result visible success';
        } else {
            resultEl.textContent = 'Use apenas números nas medidas (em cm).';
            resultEl.className = 'size-calculator-result visible error';
        }
    });
}

// ============================================
// FUNÇÕES DE HEADER E POPUP
// ============================================

function initPopupAndHeader() {
    const header = document.querySelector('.header');
    const promoBar = document.querySelector('.promo-bar');
    
    if (header) {
        let lastScroll = 0;
        const scrollThreshold = 100;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            if (currentScroll < scrollThreshold) {
                header.classList.remove('header-hidden');
                if (promoBar) {
                    promoBar.classList.remove('promo-hidden');
                    header.classList.remove('promo-bar-hidden');
                }
                lastScroll = currentScroll;
                return;
            }
            
            if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
                header.classList.add('header-hidden');
                if (promoBar) {
                    promoBar.classList.add('promo-hidden');
                    header.classList.add('promo-bar-hidden');
                }
            } else if (currentScroll < lastScroll) {
                header.classList.remove('header-hidden');
                if (promoBar) {
                    promoBar.classList.remove('promo-hidden');
                    header.classList.remove('promo-bar-hidden');
                }
            }
            
            lastScroll = currentScroll;
        });
    }
}

// ============================================
// PREÇO PRINCIPAL (badge + seção preço) – sempre em sync com MAIN_PRICE
// ============================================
function updateMainPriceDisplay() {
    var oldEl = document.querySelector('.price-old');
    var currentEl = document.querySelector('.price-current');
    var savingsEl = document.querySelector('.savings');
    var badgeEl = document.querySelector('.premium-discount-number');
    if (oldEl) oldEl.textContent = 'R$ ' + MAIN_PRICE_OLD.toFixed(2).replace('.', ',');
    if (currentEl) currentEl.textContent = 'R$ ' + MAIN_PRICE.toFixed(2).replace('.', ',');
    var economize = MAIN_PRICE_OLD - MAIN_PRICE;
    if (economize > 0 && savingsEl) savingsEl.textContent = 'Economize R$ ' + economize.toFixed(2).replace('.', ',');
    if (badgeEl && MAIN_PRICE_OLD > 0) {
        var pct = Math.round((1 - MAIN_PRICE / MAIN_PRICE_OLD) * 100);
        badgeEl.textContent = pct + '%';
    }
}

// ============================================
// FUNÇÕES DE CARRINHO LATERAL
// ============================================

function updateCartContent() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    
    // Garantir que o carrinho está visível
    if (cartItems.style.display === 'none') {
        cartItems.style.display = 'block';
    }
    
    // Preço do kit na sacola (sempre em sync com MAIN_PRICE / MAIN_PRICE_OLD)
    const cartItemKit = document.getElementById('cartItemKit');
    if (cartItemKit) {
        const priceSection = cartItemKit.querySelector('.cart-item-price-section');
        if (priceSection) {
            const oldEl = priceSection.querySelector('.cart-item-price-old');
            const currentEl = priceSection.querySelector('.cart-item-price-current');
            const discountEl = priceSection.querySelector('.cart-item-discount');
            if (oldEl) oldEl.textContent = 'R$ ' + MAIN_PRICE_OLD.toFixed(2).replace('.', ',');
            if (currentEl) currentEl.textContent = 'R$ ' + MAIN_PRICE.toFixed(2).replace('.', ',');
            if (discountEl) {
                var pct = MAIN_PRICE_OLD > 0 ? Math.round((1 - MAIN_PRICE / MAIN_PRICE_OLD) * 100) : 0;
                discountEl.textContent = '-' + pct + '%';
            }
        }
    }
    
    const selectedColor1 = document.getElementById('selectedColor1')?.textContent || 'Preto';
    const selectedSize1 = document.getElementById('selectedSize1')?.textContent || 'P';
    const cartColor1 = document.getElementById('cartColor1');
    const cartSize1 = document.getElementById('cartSize1');
    const cartItemImage1 = document.getElementById('cartItemImage1');
    
    if (cartColor1) cartColor1.textContent = selectedColor1;
    if (cartSize1) cartSize1.textContent = selectedSize1;
    if (cartItemImage1 && cartColorImageMap[selectedColor1]) {
        cartItemImage1.src = cartColorImageMap[selectedColor1];
    }
    
    const selectedColor2 = document.getElementById('selectedColor2')?.textContent || 'Preto';
    const selectedSize2 = document.getElementById('selectedSize2')?.textContent || 'P';
    const cartColor2 = document.getElementById('cartColor2');
    const cartSize2 = document.getElementById('cartSize2');
    
    if (cartColor2) cartColor2.textContent = selectedColor2;
    if (cartSize2) cartSize2.textContent = selectedSize2;
}

function initCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartBtn = document.querySelector('.cart-btn');
    const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
    const orderBumpCheckbox = document.getElementById('orderBumpCheckbox');
    const orderBumpOptions = document.getElementById('orderBumpOptions');
    const orderBumpMeiasCheckbox = document.getElementById('orderBumpMeiasCheckbox');
    
    function openCart() {
        const cartItems = document.getElementById('cartItems');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartProductCount = document.querySelector('.cart-product-count');
        const cartItemKit = document.getElementById('cartItemKit');
        
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        const cartSidebarFooter = document.querySelector('.cart-sidebar-footer');
        
        // Só mostrar itens se o botão Comprar foi clicado (kit visível)
        if (cartItemKit && cartItemKit.style.display !== 'none') {
            if (cartItems) {
                cartItems.style.display = 'block';
            }
            if (cartEmpty) {
                cartEmpty.style.display = 'none';
            }
            if (cartProductCount) {
                cartProductCount.style.display = 'flex';
            }
            if (cartSidebarFooter) {
                cartSidebarFooter.style.display = 'flex';
            }
        } else {
            // Carrinho vazio se o botão Comprar não foi clicado
            if (cartItems) {
                cartItems.style.display = 'none';
            }
            if (cartEmpty) {
                cartEmpty.style.display = 'block';
            }
            if (cartProductCount) {
                cartProductCount.textContent = '(0 produtos)';
            }
            if (cartSidebarFooter) {
                cartSidebarFooter.style.display = 'none';
            }
        }
        
        updateCartContent();
        updateCartTotal();
    }
    
    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }
    
    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', closeCart);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }
    
    if (orderBumpCheckbox) {
        orderBumpCheckbox.addEventListener('change', () => {
            updateCartTotal();
            if (orderBumpOptions) {
                orderBumpOptions.style.display = orderBumpCheckbox.checked ? 'block' : 'none';
            }
        });
    }
    
    if (orderBumpMeiasCheckbox) {
        orderBumpMeiasCheckbox.addEventListener('change', () => {
            updateCartTotal();
        });
    }
    
    // Remover kit do carrinho
    const cartKitRemove = document.getElementById('cartKitRemove');
    if (cartKitRemove) {
        cartKitRemove.addEventListener('click', (e) => {
            e.preventDefault();
            const cartItemKit = document.getElementById('cartItemKit');
            const orderBumpCuecas = document.getElementById('orderBumpCuecas');
            const orderBumpMeias = document.getElementById('orderBumpMeias');
            const promoTitle = document.querySelector('.order-bump-promo-title');
            const cartItems = document.getElementById('cartItems');
            const cartEmpty = document.getElementById('cartEmpty');
            const cartCount = document.querySelector('.cart-count');
            const cartProductCount = document.querySelector('.cart-product-count');
            if (orderBumpOptions) orderBumpOptions.style.display = 'none';
            if (orderBumpCheckbox) orderBumpCheckbox.checked = false;
            if (orderBumpMeiasCheckbox) orderBumpMeiasCheckbox.checked = false;
            if (cartItemKit) cartItemKit.style.display = 'none';
            if (orderBumpCuecas) orderBumpCuecas.style.display = 'none';
            if (orderBumpMeias) orderBumpMeias.style.display = 'none';
            if (promoTitle) promoTitle.style.display = 'none';
            if (cartCount) cartCount.textContent = '0';
            if (cartProductCount) cartProductCount.textContent = '(0 produtos)';
            if (cartItems) cartItems.style.display = 'none';
            if (cartEmpty) cartEmpty.style.display = 'block';
            updateCartTotal();
        });
    }
    
    // Editar kit: fechar carrinho e rolar até cores/tamanhos
    const cartKitEdit = document.getElementById('cartKitEdit');
    if (cartKitEdit) {
        cartKitEdit.addEventListener('click', (e) => {
            e.preventDefault();
            closeCart();
            const el = document.getElementById('productOptions');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
    
    // Order Bump - Seleção de cor
    const orderBumpColorButtons = document.querySelectorAll('.order-bump-color-btn');
    const orderBumpImage = document.getElementById('orderBumpImage');
    
    orderBumpColorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const cueca = button.dataset.cueca;
            document.querySelectorAll(`.order-bump-color-btn[data-cueca="${cueca}"]`).forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            const color = button.dataset.color;
            const imageSrc = orderBumpColorImageMap[color] || button.dataset.image;
            const selectedColorDisplay = document.getElementById(`orderBumpSelectedColor${cueca}`);
            if (selectedColorDisplay) {
                selectedColorDisplay.textContent = color;
            }
            
            if (orderBumpImage && imageSrc && cueca === '1') {
                orderBumpImage.src = imageSrc;
            }
            
            const thumb = button.querySelector('.order-bump-color-thumb');
            if (thumb) {
                const thumbMap = {
                    'Branca': 'images/thumb.jpg',
                    'Preta': 'images/thumb (6).jpg'
                };
                thumb.src = thumbMap[color] || imageSrc;
            }
        });
    });
    
    // Order Bump - Seleção de tamanho
    const orderBumpSizeButtons = document.querySelectorAll('.order-bump-size-btn');
    orderBumpSizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const cueca = button.dataset.cueca;
            document.querySelectorAll(`.order-bump-size-btn[data-cueca="${cueca}"]`).forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            const size = button.dataset.size;
            const selectedSizeDisplay = document.getElementById(`orderBumpSelectedSize${cueca}`);
            if (selectedSizeDisplay) {
                selectedSizeDisplay.textContent = size;
            }
        });
    });
    
    // Botão de checkout do carrinho - redireciona para checkout externo
    if (cartCheckoutBtn) {
        cartCheckoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const cartItemKit = document.getElementById('cartItemKit');
            if (!cartItemKit || cartItemKit.style.display === 'none') return;
            goToCheckout();
        });
    }
}

// ============================================
// FUNÇÕES DE ATUALIZAÇÃO DE TOTAL DO CARRINHO
// ============================================

function updateCartTotal() {
    const cartItemKit = document.getElementById('cartItemKit');
    const orderBumpCheckbox = document.getElementById('orderBumpCheckbox');
    const orderBumpMeiasCheckbox = document.getElementById('orderBumpMeiasCheckbox');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartBonusLine = document.getElementById('cartBonusLine');
    const cartBonusPrice = document.getElementById('cartBonusPrice');
    const cartMeiasLine = document.getElementById('cartMeiasLine');
    const cartMeiasPrice = document.getElementById('cartMeiasPrice');
    const cartTotal = document.getElementById('cartTotal');
    const cartSidebarFooter = document.querySelector('.cart-sidebar-footer');

    const hasProducts = cartItemKit && cartItemKit.style.display !== 'none';

    if (!hasProducts) {
        if (cartSubtotal) cartSubtotal.textContent = 'R$ 0,00';
        if (cartTotal) cartTotal.textContent = 'R$ 0,00';
        if (cartSidebarFooter) cartSidebarFooter.style.display = 'none';
        return;
    }

    if (cartSidebarFooter) cartSidebarFooter.style.display = 'flex';

    const mainPrice = MAIN_PRICE;
    const orderBumpPrice = ORDER_BUMP_CUECAS_PRICE;
    const meiasPrice = ORDER_BUMP_MEIAS_PRICE;
    const hasOrderBump = orderBumpCheckbox?.checked || false;
    const hasMeias = orderBumpMeiasCheckbox?.checked || false;

    let total = mainPrice;
    if (cartSubtotal) cartSubtotal.textContent = 'R$ ' + mainPrice.toFixed(2).replace('.', ',');

    if (cartBonusLine) cartBonusLine.style.display = hasOrderBump ? 'flex' : 'none';
    if (cartBonusPrice) cartBonusPrice.textContent = 'R$ ' + orderBumpPrice.toFixed(2).replace('.', ',');
    if (hasOrderBump) total += orderBumpPrice;

    if (cartMeiasLine) cartMeiasLine.style.display = hasMeias ? 'flex' : 'none';
    if (cartMeiasPrice) cartMeiasPrice.textContent = 'R$ ' + meiasPrice.toFixed(2).replace('.', ',');
    if (hasMeias) total += meiasPrice;

    if (cartTotal) cartTotal.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
}

// ============================================
// FUNÇÕES DE CAPTURA DE UTM (persistir no localStorage)
// ============================================
// Lista única de parâmetros de rastreamento – usada na captura e na URL do checkout
var UTM_TRACKING_KEYS = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'src', 'sck', 'xcod', 'fbclid', 'gclid', 'ttclid', 'msclkid', 'li_fat_id',
    'ref', 'referrer', 'affiliate_id', 'subid', 'sub_id'
];

function initUTMCapture() {
    try {
        var urlParams = new URLSearchParams(window.location.search);
        UTM_TRACKING_KEYS.forEach(function (key) {
            var value = urlParams.get(key);
            if (value != null && String(value).trim() !== '') {
                localStorage.setItem(key, String(value).trim());
            }
        });
        if (typeof captureQueryParams === 'function') {
            try {
                captureQueryParams();
            } catch (e) {
                // Utmify: ignorar erros
            }
        }
    } catch (e) {
        console.warn('UTM capture error:', e);
    }
}

// ============================================
// GEOLOCALIZAÇÃO POR IP (SEM PERMISSÃO) – PROMO-BAR
// ============================================

function initGeoPromo() {
    const el = document.getElementById('geo-region');
    if (!el) return;

    fetch('https://ipapi.co/json/?fields=country_code,city,region_code,region')
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (data && data.country_code === 'BR' && data.city) {
                var uf = data.region_code || data.region || '';
                el.textContent = data.city + (uf ? ' - ' + uf : '');
            }
        })
        .catch(function() {});
}

// ============================================
// BOTÃO AJUDA (abre opção WhatsApp)
// ============================================

function initHelpWidget() {
    const widget = document.getElementById('helpWidget');
    const btn = document.getElementById('helpBtn');
    const dropdown = document.getElementById('helpDropdown');
    if (!widget || !btn || !dropdown) return;
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        widget.classList.toggle('open');
    });
    document.addEventListener('click', () => { widget.classList.remove('open'); });
    dropdown.addEventListener('click', (e) => e.stopPropagation());
}

// ============================================
// INICIALIZAÇÃO
// ============================================
// Captura UTM já na carga do script para garantir que fique salvo no localStorage
initUTMCapture();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        updateMainPriceDisplay();
        initUTMCapture();
        initPopupAndHeader();
        initCountdown();
        initGeoPromo();
        initImageGallery();
        initSizeSelection();
        initColorSelection();
        initBuyButton();
        initSizeTable();
        initSizeCalculator();
        initCartSidebar();
        initHelpWidget();
        initReviewsCarousel();
    });
} else {
    updateMainPriceDisplay();
    initUTMCapture();
    initPopupAndHeader();
    initCountdown();
    initGeoPromo();
    initImageGallery();
    initSizeSelection();
    initColorSelection();
    initBuyButton();
    initSizeTable();
    initSizeCalculator();
    initCartSidebar();
    initHelpWidget();
    initReviewsCarousel();
}
