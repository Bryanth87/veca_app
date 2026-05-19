const categorias = ["Nueva temporada", "Clásicos", "Accesorios", "Casual", "Elegante"];
const items = ["Mochila", "Blusa", "Bolso", "Cartera", "Sudadera"];

// Una imagen por casilla (24): bols → comb → cross
const imagenesProductos = [
    ...Array.from({ length: 11 }, (_, k) => `bols_${k + 1}.jpg`),
    ...Array.from({ length: 7 }, (_, k) => `comb_${k + 1}.jpg`),
    ...Array.from({ length: 6 }, (_, k) => `cross_${k + 1}.jpg`),
];

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

for (let i = 1; i <= 24; i++) {
    const cat = categorias[i % categorias.length];
    const item = items[i % items.length];
    const foto = imagenesProductos[i - 1];
    const nombre = `${item} Modelo ${i * 10}`;
    const precio = precioProducto(i);

    const card = document.createElement('div');
    card.className = "product-card bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group";
    card.dataset.productId = String(i);

    card.innerHTML = `
        <div class="h-60 rounded-lg mb-4 flex items-center justify-center overflow-hidden bg-corinto-50">
            <img src="assets/${foto}" alt="${nombre}" class="object-cover h-full w-full group-hover:scale-105 transition duration-500" loading="lazy" />
        </div>
        <span class="text-[10px] font-black bg-corinto-50 text-corinto px-2 py-0.5 rounded uppercase">${cat}</span>
        <h4 class="font-bold text-slate-800 mt-2">${nombre}</h4>
        <p class="text-xs text-slate-400 mb-4 uppercase tracking-tighter">Colección Veca</p>
        <div class="flex justify-between items-center">
            <span class="font-bold text-lg">Q${precio.toFixed(2)}</span>
            <button type="button" class="btn-anadir bg-corinto-900 text-white px-3 py-1 rounded text-xs hover:bg-corinto">Añadir</button>
        </div>
    `;
    grid.appendChild(card);
}

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
const box = document.getElementById('chat-box');
const opts = document.getElementById('opciones-chat');

btnChat.onclick = () => winChat.classList.toggle('hidden');

function pasoChat(n) {
    let resp = "";
    let next = "";

    if (n === 1) {
        resp = "Tenemos blusas, mochilas y bolsos en la colección actual. ¿Te muestro los más vendidos?";
        next = `<button onclick="pasoChat(0)" class="btn-op">Sí, ver modelos</button>
                <button onclick="pasoChat(0)" class="btn-op">Regresar</button>`;
    } else if (n === 2) {
        resp = "Las tallas van de XS a XL. Envíos a todo el país en 3–5 días hábiles.";
        next = `<button onclick="pasoChat(0)" class="btn-op">Ver guía de tallas</button>`;
    } else if (n === 3) {
        resp = "Esta semana hay 15% en accesorios. ¿Quieres el código de descuento?";
        next = `<button onclick="pasoChat(0)" class="btn-op">Sí, por favor</button>`;
    } else {
        location.reload();
    }

    box.innerHTML += `<div class="bg-corinto text-white p-2 rounded-lg ml-10 text-right text-xs">Consulta opción ${n}</div>`;
    setTimeout(() => {
        box.innerHTML += `<div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">${resp}</div>`;
        opts.innerHTML = next;
        box.scrollTop = box.scrollHeight;
    }, 400);
}
