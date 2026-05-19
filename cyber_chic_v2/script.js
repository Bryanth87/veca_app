// 1. Generación de 20+ productos con IMÁGENES REALES
const categorias = ["Arquitectura", "Redes", "Historia", "Sistemas Op.", "Bases de Datos"];
const items = ["Mochila", "Blusa", "Bolso", "Cartera", "Sudadera"];

// Asegúrate de tener al menos 4 imágenes en tu carpeta /img
// Por ejemplo: prod1.webp, prod2.webp, prod3.webp, prod4.webp
const fotos = ["prod1.webp", "prod2.webp", "prod3.webp", "prod4.webp"]; 

const grid = document.getElementById('grid-productos');

for(let i=1; i<=24; i++) {
    const cat = categorias[i % categorias.length];
    const item = items[i % items.length];
    const foto = fotos[i % fotos.length]; // Elige una foto secuencialmente
    
    const card = document.createElement('div');
    card.className = "product-card bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group";
    
    // CAMBIO CLAVE: He reemplazado el emoji por una etiqueta <img />
    card.innerHTML = `
        <div class="h-60 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            <img src="img/${foto}" alt="${item}" class="object-cover h-full w-full group-hover:scale-105 transition duration-500" />
        </div>
        <span class="text-[10px] font-black bg-pink-100 text-pink-600 px-2 py-0.5 rounded uppercase">${cat}</span>
        <h4 class="font-bold text-slate-800 mt-2">${item} Modelo ${i*10}</h4>
        <p class="text-xs text-slate-400 mb-4 uppercase tracking-tighter">Tech-Edition Pack</p>
        <div class="flex justify-between items-center">
            <span class="font-bold text-lg">$${(i*5 + 20).toFixed(2)}</span>
            <button class="bg-slate-900 text-white px-3 py-1 rounded text-xs hover:bg-pink-600">Añadir</button>
        </div>
    `;
    grid.appendChild(card);
}

// 2. GSAP Animaciones (Se mantienen igual, ahora aplicadas a imágenes)
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

// 3. Chatbot Lógica Mapa (Se mantiene igual)
const btnChat = document.getElementById('btn-chat');
const winChat = document.getElementById('window-chat');
const box = document.getElementById('chat-box');
const opts = document.getElementById('opciones-chat');

btnChat.onclick = () => winChat.classList.toggle('hidden');

function pasoChat(n) {
    let resp = "";
    let next = "";

    if(n === 1) {
        resp = "En Hardware tenemos mochilas con compartimentos térmicos tipo disipador. ¿Te interesa el color gris metal?";
        next = `<button onclick="pasoChat(0)" class="btn-op">Sí, ver modelos</button>
                <button onclick="pasoChat(0)" class="btn-op">Regresar</button>`;
    } else if(n === 2) {
        resp = "Nuestros bolsos de Red usan correas de nylon trenzado Cat6. ¿Buscas durabilidad?";
        next = `<button onclick="pasoChat(0)" class="btn-op">Ver catálogo de Redes</button>`;
    } else if(n === 3) {
        resp = "La línea Historia usa estampados de la Máquina de Turing. ¿Es para un regalo?";
        next = `<button onclick="pasoChat(0)" class="btn-op">Ver línea Vintage</button>`;
    } else {
        location.reload();
    }

    box.innerHTML += `<div class="bg-pink-600 text-white p-2 rounded-lg ml-10 text-right text-xs">Información sobre opción ${n}</div>`;
    setTimeout(() => {
        box.innerHTML += `<div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">${resp}</div>`;
        opts.innerHTML = next;
        box.scrollTop = box.scrollHeight;
    }, 400);
}