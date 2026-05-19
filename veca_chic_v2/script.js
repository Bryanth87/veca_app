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

/** @type {{ id: number, nombre: string, precio: number, foto: string, qty: number }[]} */
let carrito = [];

function precioProducto(i) {
    return i * 5 + 20;
}

function actualizarBolsa() {
    const total = carrito.reduce((sum, p) => sum + p.qty, 0);
    btnCarrito.textContent = `Bolsa (${total})`;
}

function agregarAlCarrito(id, nombre, precio, foto) {
    const existente = carrito.find((p) => p.id === id);
    if (existente) existente.qty += 1;
    else carrito.push({ id, nombre, precio, foto, qty: 1 });
    actualizarBolsa();
}

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
            <img src="public/${foto}" alt="${nombre}" class="object-cover h-full w-full group-hover:scale-105 transition duration-500" loading="lazy" />
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
    const foto = img?.getAttribute('src')?.replace(/^public\//, '') ?? '';
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
