const CATEGORIAS_VECA = {
    crossbody: {
        label: 'Crossbody',
        prefijoFoto: 'cross_',
        palabras: ['crossbody', 'cross body', 'cross', 'cruzada', 'bandolera'],
    },
    'combo-mochila': {
        label: 'Combo mochila y lonchera',
        prefijoFoto: 'comb_',
        palabras: [
            'combo mochila y lonchera',
            'combo mochila',
            'mochila y lonchera',
            'mochila lonchera',
            'lonchera',
            'mochila',
            'mochilas',
        ],
    },
    'combo-carteras': {
        label: 'Combo carteras',
        prefijoFoto: 'bols_',
        palabras: ['combo carteras', 'combo cartera', 'carteras', 'cartera', 'bolsas', 'bolsa'],
    },
};

const ORDEN_DETECCION_CATEGORIA = ['combo-mochila', 'combo-carteras', 'crossbody'];

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .trim();
}

// bols_ = Combo carteras · comb_ = Combo mochila y lonchera · cross_ = Crossbody
const imagenesProductos = [
    ...Array.from({ length: 11 }, (_, k) => `bols_${k + 1}.jpg`),
    ...Array.from({ length: 7 }, (_, k) => `comb_${k + 1}.jpg`),
    ...Array.from({ length: 6 }, (_, k) => `cross_${k + 1}.jpg`),
];

function tipoDesdeFoto(foto) {
    if (foto.startsWith('bols_')) return 'combo-carteras';
    if (foto.startsWith('comb_')) return 'combo-mochila';
    if (foto.startsWith('cross_')) return 'crossbody';
    return '';
}

function labelCategoria(slug) {
    return CATEGORIAS_VECA[slug]?.label ?? slug;
}

function numeroDesdeFoto(foto) {
    const m = foto.match(/_(\d+)\./);
    return m ? m[1] : '';
}

const grid = document.getElementById('grid-productos');
const btnCarrito = document.getElementById('btn-carrito');
const overlayCarrito = document.getElementById('overlay-carrito');
const backdropCarrito = document.getElementById('backdrop-carrito');
const btnCerrarCarrito = document.getElementById('btn-cerrar-carrito');
const listaCarrito = document.getElementById('lista-carrito');
const carritoTotalEl = document.getElementById('carrito-total');
const carritoCantidadResumen = document.getElementById('carrito-cantidad-resumen');
const btnComprar = document.getElementById('btn-comprar');

/** @type {{ id: number, nombre: string, precio: number, foto: string, qty: number }[]} */
let carrito = [];

function precioProducto(i) {
    return i * 5 + 20;
}

function abrirCarrito() {
    overlayCarrito.classList.remove('hidden');
    overlayCarrito.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overflow-hidden');
    renderCarrito();
}

function cerrarCarrito() {
    overlayCarrito.classList.add('hidden');
    overlayCarrito.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('overflow-hidden');
}

function renderCarrito() {
    const unidades = carrito.reduce((sum, p) => sum + p.qty, 0);
    const totalQ = carrito.reduce((sum, p) => sum + p.precio * p.qty, 0);

    if (carritoCantidadResumen) carritoCantidadResumen.textContent = String(unidades);
    if (carritoTotalEl) carritoTotalEl.textContent = `Q${totalQ.toFixed(2)}`;
    if (btnComprar) btnComprar.disabled = carrito.length === 0;

    if (!listaCarrito) return;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = `
            <p class="rounded-xl border border-dashed border-corinto-200 bg-corinto-50/50 px-4 py-10 text-center text-sm text-slate-500">
                Aún no hay productos. Elige algo en la colección y pulsa <strong class="text-corinto-700">Añadir</strong>.
            </p>`;
        return;
    }

    listaCarrito.innerHTML = carrito
        .map(
            (p) => `
        <div class="mb-3 flex gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm" data-cart-id="${p.id}">
            <img src="assets/${p.foto}" alt="" class="h-20 w-20 shrink-0 rounded-lg object-cover bg-corinto-50" />
            <div class="min-w-0 flex-1">
                <p class="font-semibold text-slate-800 leading-snug">${p.nombre}</p>
                <p class="mt-1 text-sm text-slate-500">Q${p.precio.toFixed(2)} c/u</p>
                <div class="mt-2 flex items-center gap-2">
                    <button type="button" class="carrito-menos flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-lg leading-none hover:bg-corinto-50" aria-label="Quitar una">−</button>
                    <span class="min-w-[2rem] text-center text-sm font-bold">${p.qty}</span>
                    <button type="button" class="carrito-mas flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-lg leading-none hover:bg-corinto-50" aria-label="Añadir una">+</button>
                </div>
            </div>
            <div class="flex shrink-0 flex-col items-end justify-between">
                <p class="font-bold text-corinto-900">Q${(p.precio * p.qty).toFixed(2)}</p>
                <button type="button" class="carrito-eliminar text-xs font-medium text-red-600 underline-offset-2 hover:underline">Quitar</button>
            </div>
        </div>`
        )
        .join('');
}

function cambiarCantidadCarrito(id, delta) {
    const p = carrito.find((x) => x.id === id);
    if (!p) return;
    p.qty += delta;
    if (p.qty <= 0) carrito = carrito.filter((x) => x.id !== id);
    actualizarBolsa();
}

function eliminarLineaCarrito(id) {
    carrito = carrito.filter((x) => x.id !== id);
    actualizarBolsa();
}

function actualizarBolsa() {
    const total = carrito.reduce((sum, p) => sum + p.qty, 0);
    btnCarrito.textContent = `Bolsa (${total})`;
    renderCarrito();
}

function agregarAlCarrito(id, nombre, precio, foto) {
    const existente = carrito.find((p) => p.id === id);
    if (existente) existente.qty += 1;
    else carrito.push({ id, nombre, precio, foto, qty: 1 });
    actualizarBolsa();
}

btnCarrito.addEventListener('click', () => abrirCarrito());
backdropCarrito.addEventListener('click', () => cerrarCarrito());
btnCerrarCarrito.addEventListener('click', () => cerrarCarrito());

listaCarrito.addEventListener('click', (e) => {
    const row = e.target.closest('[data-cart-id]');
    if (!row) return;
    const id = Number(row.dataset.cartId, 10);
    if (e.target.closest('.carrito-menos')) cambiarCantidadCarrito(id, -1);
    else if (e.target.closest('.carrito-mas')) cambiarCantidadCarrito(id, 1);
    else if (e.target.closest('.carrito-eliminar')) eliminarLineaCarrito(id);
});

btnComprar.addEventListener('click', () => {
    if (carrito.length === 0) return;
    const totalQ = carrito.reduce((sum, p) => sum + p.precio * p.qty, 0);
    alert(
        `¡Gracias por tu compra!\n\nTotal: Q${totalQ.toFixed(2)}\n\nTe contactaremos pronto para confirmar el envío y el pago.`
    );
    carrito = [];
    actualizarBolsa();
    cerrarCarrito();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlayCarrito && !overlayCarrito.classList.contains('hidden')) cerrarCarrito();
});

imagenesProductos.forEach((foto, idx) => {
    const i = idx + 1;
    const tipo = tipoDesdeFoto(foto);
    const etiqueta = labelCategoria(tipo);
    const num = numeroDesdeFoto(foto);
    const nombre = `${etiqueta} ${num}`;
    const precio = precioProducto(i);

    const card = document.createElement('div');
    card.className = 'product-card bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group';
    card.dataset.productId = String(i);
    card.dataset.tipo = tipo;

    card.innerHTML = `
        <div class="h-60 rounded-lg mb-4 flex items-center justify-center overflow-hidden bg-corinto-50">
            <img src="assets/${foto}" alt="${nombre}" class="object-cover h-full w-full group-hover:scale-105 transition duration-500" loading="lazy" />
        </div>
        <span class="text-[10px] font-black bg-corinto-50 text-corinto px-2 py-0.5 rounded uppercase leading-tight">${etiqueta}</span>
        <h4 class="font-bold text-slate-800 mt-2 leading-snug">${nombre}</h4>
        <p class="text-xs text-slate-400 mb-4 uppercase tracking-tighter">Colección Veca</p>
        <div class="flex justify-between items-center">
            <span class="font-bold text-lg">Q${precio.toFixed(2)}</span>
            <button type="button" class="btn-anadir bg-corinto-900 text-white px-3 py-1 rounded text-xs hover:bg-corinto">Añadir</button>
        </div>
    `;
    grid.appendChild(card);
});

grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-anadir');
    if (!btn) return;
    const card = btn.closest('.product-card');
    if (!card) return;
    const id = Number(card.dataset.productId, 10);
    const nombre = card.querySelector('h4')?.textContent?.trim() ?? 'Producto';
    const precioText = card.querySelector('.font-bold.text-lg')?.textContent ?? '';
    const precio = parseFloat(precioText.replace(/^Q/, '')) || precioProducto(id);
    const img = card.querySelector('img');
    const foto = img?.getAttribute('src')?.replace(/^assets\//, '') ?? '';
    agregarAlCarrito(id, nombre, precio, foto);
});

gsap.registerPlugin(ScrollTrigger);

gsap.from("#hero-title", { duration: 1.2, y: 100, opacity: 0, ease: "expo.out" });
gsap.from("#hero-p", { duration: 1, opacity: 0, delay: 0.5 });

gsap.from("#categorias h2", { duration: 0.6, y: 16, opacity: 0, scrollTrigger: { trigger: "#categorias", start: "top 90%" } });
gsap.from(".cat-btn", { duration: 0.4, y: 8, opacity: 0, stagger: 0.04, scrollTrigger: { trigger: "#filtro-categorias", start: "top 92%" } });

gsap.to(".product-card", {
    opacity: 1,
    y: 0,
    stagger: 0.1,
    duration: 0.8,
    scrollTrigger: {
        trigger: "#grid-productos",
        start: "top 85%"
    }
});

const btnChat = document.getElementById('btn-chat');
const winChat = document.getElementById('window-chat');
const chatMessages = document.getElementById('chat-messages');
const chatOpts = document.getElementById('opciones-chat');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

const TIPOS_PRODUCTO = Object.fromEntries(
    Object.entries(CATEGORIAS_VECA).map(([slug, cat]) => [slug, cat.palabras])
);

const CONTACTO_VECA = {
    telefono: '+502 5512 3847',
    telHref: 'tel:+50255123847',
    facebook: 'VECA',
    fbHref: 'https://www.facebook.com/VECA',
    instagram: 'veca.__',
    igHref: 'https://www.instagram.com/veca__.__/',
    email: 'vecaorg06@gmail.com',
};

const MENU_OPCIONES = [
    { id: 'coleccion', label: 'Ver colección' },
    { id: 'envios', label: 'Envíos' },
    { id: 'ofertas', label: 'Ofertas' },
    { id: 'contacto', label: 'Contacto' },
    { id: 'carrito', label: 'Ver mi bolsa' },
];

btnChat.onclick = () => {
    winChat.classList.toggle('hidden');
    if (!winChat.classList.contains('hidden')) chatInput?.focus();
};

function scrollChat() {
    if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
}

function crearBurbuja(texto, esUsuario) {
    const el = document.createElement('div');
    el.className = esUsuario
        ? 'chat-bubble-user bg-corinto text-white p-2.5 rounded-lg text-xs'
        : 'chat-bubble-bot bg-white p-3 rounded-lg border border-slate-200 shadow-sm';
    el.textContent = texto;
    return el;
}

function agregarMensajeUsuario(texto) {
    chatMessages?.appendChild(crearBurbuja(texto, true));
    scrollChat();
}

function agregarMensajeBot(texto, delay = 350) {
    return new Promise((resolve) => {
        setTimeout(() => {
            chatMessages?.appendChild(crearBurbuja(texto, false));
            scrollChat();
            resolve();
        }, delay);
    });
}

function htmlMensajeContacto() {
    const c = CONTACTO_VECA;
    return `
        <p class="font-semibold text-corinto-900 mb-1.5">Datos de contacto</p>
        <span class="chat-contacto-line">📞 <a href="${c.telHref}">${c.telefono}</a></span>
        <span class="chat-contacto-line">Facebook: <a href="${c.fbHref}" target="_blank" rel="noopener noreferrer">${c.facebook}</a></span>
        <span class="chat-contacto-line">Instagram: <a href="${c.igHref}" target="_blank" rel="noopener noreferrer">${c.instagram}</a></span>
        <span class="chat-contacto-line">✉️ <a href="mailto:${c.email}">${c.email}</a></span>
    `;
}

function agregarMensajeBotHtml(html, delay = 350) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const el = document.createElement('div');
            el.className = 'chat-bubble-bot bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-xs';
            el.innerHTML = html;
            chatMessages?.appendChild(el);
            scrollChat();
            resolve();
        }, delay);
    });
}

async function mostrarContactoEnChat() {
    await agregarMensajeBotHtml(htmlMensajeContacto());
    irASeccion('contacto');
}

function mostrarOpciones(opciones) {
    if (!chatOpts) return;
    chatOpts.innerHTML = '';
    for (const op of opciones) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-op';
        btn.textContent = op.label;
        btn.dataset.chatAction = op.id;
        chatOpts.appendChild(btn);
    }
}

function irASeccion(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setCategoriaActiva(categoria) {
    document.querySelectorAll('[data-categoria]').forEach((btn) => {
        btn.classList.toggle('cat-btn-active', btn.dataset.categoria === categoria);
    });
}

function quitarEstilosFiltro() {
    document.querySelectorAll('.product-card').forEach((card) => {
        card.classList.remove('chat-hidden', 'chat-highlight');
    });
}

function limpiarFiltroProductos() {
    quitarEstilosFiltro();
    setCategoriaActiva('todos');
}

function filtrarProductos(tipo) {
    quitarEstilosFiltro();
    const cards = [...document.querySelectorAll('.product-card')];
    const visibles = cards.filter((c) => c.dataset.tipo === tipo);
    if (visibles.length === 0) return 0;

    cards.forEach((c) => {
        if (c.dataset.tipo === tipo) c.classList.add('chat-highlight');
        else c.classList.add('chat-hidden');
    });
    setCategoriaActiva(tipo);
    irASeccion('productos');
    visibles[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    return visibles.length;
}

function detectarTipoProducto(texto) {
    const t = normalizarTexto(texto);
    for (const slug of ORDEN_DETECCION_CATEGORIA) {
        const palabras = TIPOS_PRODUCTO[slug];
        if (palabras.some((p) => t.includes(normalizarTexto(p)))) return slug;
    }
    return null;
}

function coincide(texto, ...patrones) {
    const t = normalizarTexto(texto);
    return patrones.some((p) => t.includes(p));
}

async function ejecutarAccion(id, etiquetaUsuario) {
    if (etiquetaUsuario) agregarMensajeUsuario(etiquetaUsuario);
    chatOpts.innerHTML = '';

    switch (id) {
        case 'coleccion':
            limpiarFiltroProductos();
            irASeccion('productos');
            await agregarMensajeBot('Te llevo a la colección. Pulsa Añadir en lo que te guste o dime: crossbody, combo mochila y lonchera, o combo carteras.');
            break;
        case 'envios':
            await agregarMensajeBot('Envíos a todo Guatemala en 3–5 días hábiles. ¿Quieres ver la colección?');
            break;
        case 'ofertas':
            await agregarMensajeBot('Esta semana: 15% en accesorios con el código VECA15 al comprar.');
            break;
        case 'carrito':
            abrirCarrito();
            await agregarMensajeBot(
                carrito.length > 0
                    ? `Tu bolsa tiene ${carrito.reduce((s, p) => s + p.qty, 0)} artículo(s). Ya abrí el panel para que revises.`
                    : 'Tu bolsa está vacía. Te muestro la colección para que elijas algo.'
            );
            if (carrito.length === 0) {
                limpiarFiltroProductos();
                irASeccion('productos');
            }
            break;
        case 'ver-todo':
            limpiarFiltroProductos();
            irASeccion('productos');
            await agregarMensajeBot('Mostré toda la colección otra vez.');
            break;
        case 'contacto':
            await mostrarContactoEnChat();
            break;
        case 'menu':
            await agregarMensajeBot('¿En qué más te ayudo?');
            break;
        default:
            await agregarMensajeBot('No entendí esa opción. Prueba con otra o escribe lo que buscas.');
    }

    mostrarOpcionesSiguiente(id);
}

function mostrarOpcionesSiguiente(ultimaAccion) {
    const base = [
        { id: 'coleccion', label: 'Ver toda la colección' },
        { id: 'menu', label: 'Menú principal' },
    ];

    if (ultimaAccion === 'filtro') {
        mostrarOpciones([
            { id: 'ver-todo', label: 'Ver todos los productos' },
            { id: 'carrito', label: 'Ver mi bolsa' },
            ...MENU_OPCIONES.filter((o) => o.id !== 'coleccion'),
        ]);
        return;
    }

    if (ultimaAccion === 'ofertas' || ultimaAccion === 'contacto') {
        mostrarOpciones([
            { id: 'coleccion', label: 'Ir a la colección' },
            { id: 'carrito', label: 'Ver mi bolsa' },
            { id: 'contacto', label: 'Contacto' },
            { id: 'menu', label: 'Menú principal' },
        ]);
        return;
    }

    mostrarOpciones([...MENU_OPCIONES, ...base.filter((b) => !MENU_OPCIONES.some((m) => m.id === b.id))]);
}

async function responderTextoLibre(texto) {
    const original = texto.trim();
    if (!original) return;

    agregarMensajeUsuario(original);
    chatOpts.innerHTML = '';
    chatInput.value = '';

    const t = normalizarTexto(original);

    if (coincide(t, 'hola', 'buenas', 'buenos dias', 'hey')) {
        await agregarMensajeBot('¡Hola! Soy el asistente de Veca. Tenemos Crossbody, Combo mochila y lonchera, y Combo carteras. ¿Cuál te interesa?');
        mostrarOpciones(MENU_OPCIONES);
        return;
    }

    if (coincide(t, 'gracias', 'muchas gracias', 'perfecto', 'genial', 'ok listo')) {
        await agregarMensajeBot('¡Con gusto! Si necesitas algo más, aquí estaré.');
        mostrarOpciones(MENU_OPCIONES);
        return;
    }

    if (coincide(t, 'menu', 'inicio', 'ayuda', 'opciones')) {
        await ejecutarAccion('menu');
        return;
    }

    const tipoProducto = detectarTipoProducto(t);
    if (tipoProducto) {
        const n = filtrarProductos(tipoProducto);
        await agregarMensajeBot(
            `Encontré ${n} modelo${n === 1 ? '' : 's'} de ${labelCategoria(tipoProducto)} — están resaltados. Toca «Añadir» o dime si quieres ver otra categoría.`
        );
        mostrarOpcionesSiguiente('filtro');
        return;
    }

    if (coincide(t, 'ver', 'mostrar', 'busco', 'quiero', 'necesito', 'dame')) {
        const resto = t.replace(/^(quiero ver|quisiera ver|ver|mostrar|busco|quiero|necesito|dame)\s+/, '');
        const detectado = detectarTipoProducto(resto);
        if (detectado) {
            const n = filtrarProductos(detectado);
            await agregarMensajeBot(
                `Encontré ${n} modelo${n === 1 ? '' : 's'} de ${labelCategoria(detectado)} — están resaltados. Toca «Añadir» o dime si quieres ver otra categoría.`
            );
            mostrarOpcionesSiguiente('filtro');
            return;
        }
    }

    if (coincide(t, 'carrito', 'comprar', 'pagar', 'checkout', 'mi pedido', 'mi bolsa', 'ver bolsa', 'abrir bolsa', 'en la bolsa')) {
        await ejecutarAccion('carrito', null);
        return;
    }

    if (coincide(t, 'talla', 'tallas', 'blusa', 'blusas', 'ropa', 'prenda', 'prendas', 'sudadera', 'camisa')) {
        await agregarMensajeBot('En Veca vendemos Crossbody, Combo mochila y lonchera, y Combo carteras. ¿Te muestro la colección?');
        mostrarOpciones(MENU_OPCIONES);
        return;
    }

    if (coincide(t, 'envio', 'envios', 'entrega', 'enviar')) {
        await ejecutarAccion('envios', null);
        return;
    }

    if (coincide(t, 'oferta', 'ofertas', 'descuento', 'promo', 'codigo', 'rebaja')) {
        await ejecutarAccion('ofertas', null);
        return;
    }

    if (coincide(t, 'coleccion', 'productos', 'catalogo', 'tienda', 'ver todo', 'accesorios')) {
        await ejecutarAccion('coleccion', null);
        return;
    }

    if (coincide(t, 'concepto', 'marca', 'quienes son', 'sobre veca')) {
        irASeccion('concepto');
        await agregarMensajeBot('Te muestro nuestra sección «Estilo & Calidad» con más sobre Veca.');
        mostrarOpcionesSiguiente('concepto');
        return;
    }

    if (
        coincide(
            t,
            'contacto',
            'contactar',
            'telefono',
            'celular',
            'whatsapp',
            'llamar',
            'facebook',
            'instagram',
            'correo',
            'email',
            'gmail',
            'redes'
        )
    ) {
        await ejecutarAccion('contacto', null);
        return;
    }

    await agregarMensajeBot(
        'No estoy seguro de qué buscas. Prueba: «crossbody», «combo carteras», «ofertas» o «contacto».'
    );
    mostrarOpciones(MENU_OPCIONES);
}

chatOpts?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-chat-action]');
    if (!btn) return;
    ejecutarAccion(btn.dataset.chatAction, btn.textContent);
});

chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    responderTextoLibre(chatInput?.value ?? '');
});

mostrarOpciones(MENU_OPCIONES);

const filtroCategorias = document.getElementById('filtro-categorias');
filtroCategorias?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-categoria]');
    if (!btn) return;
    const cat = btn.dataset.categoria;
    if (cat === 'todos') {
        limpiarFiltroProductos();
        irASeccion('productos');
    } else {
        filtrarProductos(cat);
    }
});

const btnMenu = document.getElementById('btn-menu');
const navMobile = document.getElementById('nav-mobile');

btnMenu?.addEventListener('click', () => {
    navMobile?.classList.toggle('hidden');
    const abierto = navMobile && !navMobile.classList.contains('hidden');
    btnMenu.setAttribute('aria-expanded', String(abierto));
});

document.querySelectorAll('.nav-mobile-link, #nav-mobile a[href^="tel"], #nav-mobile a[href^="mailto"], #nav-mobile a[target]').forEach((enlace) => {
    enlace.addEventListener('click', () => {
        navMobile?.classList.add('hidden');
        btnMenu?.setAttribute('aria-expanded', 'false');
    });
});
