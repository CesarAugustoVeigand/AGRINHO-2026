document.addEventListener("DOMContentLoaded", () => {
    // ===== TEMA CLARO / ESCURO =====
    const themeBtn = document.getElementById("theme-btn");
    const savedTheme = localStorage.getItem("agrinho-theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    themeBtn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("agrinho-theme", next);
    });

    // ===== MENU MOBILE =====
    const menuBtn = document.getElementById("menu-btn");
    const nav = document.getElementById("nav");

    menuBtn.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", open);
    });

    nav.querySelectorAll(".nav__link").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            menuBtn.setAttribute("aria-expanded", "false");
        });
    });

    // ===== HEADER + BACK TO TOP =====
    const header = document.getElementById("header");
    const backTop = document.getElementById("back-top");

    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 30);
        backTop.classList.toggle("visible", window.scrollY > 450);
    });

    backTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // ===== CONTADOR ANIMADO (HERO) =====
    const counters = document.querySelectorAll("[data-count]");
    let counted = false;

    function animateCounters() {
        if (counted) return;
        counted = true;
        counters.forEach((el) => {
            const target = parseInt(el.dataset.count, 10);
            const duration = 1400;
            const start = performance.now();

            function update(now) {
                const progress = Math.min((now - start) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(ease * target);
                if (progress < 1) requestAnimationFrame(update);
                else el.textContent = target;
            }
            requestAnimationFrame(update);
        });
    }

    const heroObserver = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) animateCounters();
        },
        { threshold: 0.3 }
    );
    heroObserver.observe(document.querySelector(".hero__stats"));

    // ===== TABS DE TEMAS =====
    const themeTabs = document.querySelectorAll(".theme-tab");
    const themePanels = document.querySelectorAll(".theme-panel");

    themeTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const idx = tab.dataset.theme;
            themeTabs.forEach((t) => t.classList.remove("active"));
            themePanels.forEach((p) => p.classList.remove("active"));
            tab.classList.add("active");
            document.querySelector(`.theme-panel[data-panel="${idx}"]`).classList.add("active");
        });
    });

    // ===== FLASH CARDS =====
    const flashData = [
        {
            icon: "🌱",
            title: "Plantio direto",
            tip: "Deixe a palhada da safra anterior no solo. Isso reduz erosão, conserva umidade e aumenta a matéria orgânica."
        },
        {
            icon: "💧",
            title: "Água com inteligência",
            tip: "Use sensores de umidade ou observe o solo antes de irrigar. Evite irrigar no horário de maior evaporação (meio-dia)."
        },
        {
            icon: "🐞",
            title: "Controle biológico",
            tip: "Incentive inimigos naturais das pragas (joaninhas, vespas). Isso diminui a necessidade de defensivos químicos."
        },
        {
            icon: "☀️",
            title: "Energia solar",
            tip: "Painéis solares podem abastecer bombas de água e cercas elétricas, reduzindo custo e emissão de carbono."
        },
        {
            icon: "🔄",
            title: "Rotação de culturas",
            tip: "Alterar as culturas a cada safra quebra o ciclo de pragas e doenças e melhora a fertilidade do solo."
        },
        {
            icon: "🌳",
            title: "APP e Reserva Legal",
            tip: "Proteger nascentes e áreas de vegetação nativa mantém a água limpa e a biodiversidade na propriedade."
        }
    ];

    const flashContainer = document.getElementById("flashcards");

    flashData.forEach((item) => {
        const card = document.createElement("div");
        card.className = "flashcard";
        card.innerHTML = `
            <div class="flashcard__inner">
                <div class="flashcard__front">
                    <span class="fc-icon">${item.icon}</span>
                    <h3>${item.title}</h3>
                    <span class="fc-hint">Toque para virar</span>
                </div>
                <div class="flashcard__back">
                    <p>${item.tip}</p>
                </div>
            </div>
        `;
        card.addEventListener("click", () => card.classList.toggle("flipped"));
        flashContainer.appendChild(card);
    });

    // ===== QUIZ =====
    const quizData = [
        {
            q: "Qual prática aplica insumos apenas onde e quando são necessários, reduzindo desperdício?",
            opts: ["Monocultura intensiva", "Agricultura de precisão", "Queimada controlada", "Uso exclusivo de químicos"],
            ok: 1,
            tip: "A agricultura de precisão usa sensores, drones e dados para otimizar recursos."
        },
        {
            q: "O plantio direto e a cobertura vegetal ajudam principalmente a:",
            opts: ["Aumentar a erosão", "Conservar e regenerar o solo", "Eliminar a biodiversidade", "Aumentar o consumo de água"],
            ok: 1,
            tip: "Essas práticas protegem o solo, melhoram a estrutura e a retenção de água."
        },
        {
            q: "Sistemas de irrigação com sensores podem economizar até quanto de água?",
            opts: ["Até 10%", "Até 20%", "Até 40%", "Não há economia"],
            ok: 2,
            tip: "A irrigação inteligente aplica água só quando o solo realmente precisa."
        },
        {
            q: "Qual fonte de energia renovável é comum em propriedades rurais para bombas e refrigeração?",
            opts: ["Carvão mineral", "Energia solar fotovoltaica", "Petróleo diesel", "Gás natural"],
            ok: 1,
            tip: "Painéis solares reduzem custos e emissões no campo."
        },
        {
            q: "O sistema Integração Lavoura-Pecuária-Floresta (ILPF) contribui para:",
            opts: ["Apenas aumentar o desmatamento", "Sequestro de carbono e diversificação de renda", "Eliminar a pecuária", "Usar só uma cultura"],
            ok: 1,
            tip: "O ILPF aumenta produtividade, sequestra carbono e diversifica a renda."
        },
        {
            q: "O tema do AGRINHO 2026 enfatiza o equilíbrio entre:",
            opts: ["Só aumento de produção", "Produção agrícola e preservação do meio ambiente", "Exportação e importação", "Uso de agrotóxicos"],
            ok: 1,
            tip: "“Agro Forte, Futuro Sustentável” busca conciliar produtividade com conservação."
        }
    ];

    let qIndex = 0;
    let score = 0;
    let answered = false;

    const elQ = document.getElementById("quiz-question");
    const elOpts = document.getElementById("quiz-options");
    const elCounter = document.getElementById("quiz-counter");
    const elBar = document.getElementById("quiz-bar");
    const elFeedback = document.getElementById("quiz-feedback");
    const elNext = document.getElementById("quiz-next");
    const elRestart = document.getElementById("quiz-restart");
    const elResult = document.getElementById("quiz-result");
    const elScore = document.getElementById("quiz-score");
    const elMsg = document.getElementById("quiz-message");

    function loadQ() {
        answered = false;
        elFeedback.hidden = true;
        elNext.hidden = true;
        elRestart.hidden = true;
        elResult.hidden = true;

        const item = quizData[qIndex];
        elQ.textContent = item.q;
        elCounter.textContent = `Pergunta ${qIndex + 1} de ${quizData.length}`;
        elBar.style.width = `${((qIndex + 1) / quizData.length) * 100}%`;

        elOpts.innerHTML = "";
        item.opts.forEach((opt, i) => {
            const btn = document.createElement("button");
            btn.className = "quiz-opt";
            btn.textContent = opt;
            btn.addEventListener("click", () => selectAns(i));
            elOpts.appendChild(btn);
        });
    }

    function selectAns(i) {
        if (answered) return;
        answered = true;
        const item = quizData[qIndex];
        const buttons = elOpts.querySelectorAll(".quiz-opt");

        buttons.forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === item.ok) btn.classList.add("correct");
            else if (idx === i) btn.classList.add("wrong");
        });

        if (i === item.ok) {
            score++;
            elFeedback.textContent = "✓ Correto! " + item.tip;
            elFeedback.className = "quiz__feedback ok";
        } else {
            elFeedback.textContent = "✗ Incorreto. " + item.tip;
            elFeedback.className = "quiz__feedback err";
        }
        elFeedback.hidden = false;

        if (qIndex < quizData.length - 1) {
            elNext.hidden = false;
        } else {
            showResult();
        }
    }

    function showResult() {
        elNext.hidden = true;
        elRestart.hidden = false;
        elResult.hidden = false;
        const pct = Math.round((score / quizData.length) * 100);
        elScore.textContent = `${score}/${quizData.length} (${pct}%)`;
        if (pct >= 80) elMsg.textContent = "Excelente! Você domina os conceitos de agro sustentável.";
        else if (pct >= 50) elMsg.textContent = "Bom resultado! Continue explorando os temas do AGRINHO.";
        else elMsg.textContent = "Revise as seções do site e tente de novo — você consegue!";
    }

    elNext.addEventListener("click", () => {
        qIndex++;
        loadQ();
    });

    elRestart.addEventListener("click", () => {
        qIndex = 0;
        score = 0;
        loadQ();
    });

    loadQ();

    // ===== FORMULÁRIO =====
    const form = document.getElementById("contact-form");
    const formOk = document.getElementById("form-success");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const msg = document.getElementById("mensagem").value.trim();
        if (!nome || !email || !msg) return;

        form.hidden = true;
        formOk.hidden = false;

        setTimeout(() => {
            form.reset();
            form.hidden = false;
            formOk.hidden = true;
        }, 4500);
    });

    // ===== ANIMAÇÃO DE ENTRADA =====
    const fadeEls = document.querySelectorAll(".about-card, .solution-card, .flashcard");
    const fadeObs = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    fadeObs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    fadeEls.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(18px)";
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        fadeObs.observe(el);
    });
});
