document.addEventListener("DOMContentLoaded", () => {
    // ===== Menu mobile =====
    const menuToggle = document.getElementById("menu-toggle");
    const siteNav = document.getElementById("site-nav");

    menuToggle.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", isOpen);
    });

    // Fecha menu ao clicar em um link
    siteNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            siteNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    // ===== Header com sombra no scroll =====
    const header = document.querySelector(".site-header");
    const backToTop = document.getElementById("back-to-top");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        if (window.scrollY > 400) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // ===== Carrossel de soluções =====
    const solutionCards = document.querySelectorAll(".solution-card");
    const solDots = document.querySelectorAll(".sol-dot");
    let currentSolution = 0;
    let solutionTimer;

    function showSolution(index) {
        solutionCards.forEach((card) => card.classList.remove("active"));
        solDots.forEach((dot) => dot.classList.remove("active"));

        solutionCards[index].classList.add("active");
        solDots[index].classList.add("active");
        currentSolution = index;
    }

    solDots.forEach((dot) => {
        dot.addEventListener("click", () => {
            const index = parseInt(dot.dataset.index, 10);
            showSolution(index);
            resetSolutionTimer();
        });
    });

    function nextSolution() {
        const next = (currentSolution + 1) % solutionCards.length;
        showSolution(next);
    }

    function resetSolutionTimer() {
        clearInterval(solutionTimer);
        solutionTimer = setInterval(nextSolution, 6000);
    }

    resetSolutionTimer();

    // ===== Barras de progresso (desafios) =====
    const progressFills = document.querySelectorAll(".progress-fill");

    const progressObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const value = entry.target.dataset.value;
                    entry.target.style.width = value + "%";
                    progressObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.4 }
    );

    progressFills.forEach((fill) => progressObserver.observe(fill));

    // ===== Quiz interativo =====
    const quizData = [
        {
            question: "Qual prática reduz o uso de água e insumos ao aplicar recursos apenas onde e quando necessário?",
            options: [
                "Monocultura intensiva",
                "Agricultura de precisão",
                "Queimada controlada",
                "Uso exclusivo de fertilizantes químicos"
            ],
            correct: 1,
            feedback: "A agricultura de precisão usa sensores, drones e dados para otimizar o uso de recursos."
        },
        {
            question: "O plantio direto e a cobertura vegetal contribuem principalmente para:",
            options: [
                "Aumentar a erosão do solo",
                "Conservar e regenerar o solo",
                "Eliminar a biodiversidade",
                "Aumentar o consumo de água"
            ],
            correct: 1,
            feedback: "Práticas regenerativas protegem o solo, melhoram a estrutura e a retenção de água."
        },
        {
            question: "Sistemas de irrigação baseados em sensores de umidade podem economizar até quanto de água?",
            options: [
                "Até 10%",
                "Até 20%",
                "Até 40%",
                "Não há economia significativa"
            ],
            correct: 2,
            feedback: "A irrigação inteligente evita desperdício e aplica água apenas quando o solo precisa."
        },
        {
            question: "Qual fonte de energia renovável é amplamente usada em propriedades rurais para bombas e refrigeração?",
            options: [
                "Carvão mineral",
                "Energia solar fotovoltaica",
                "Petróleo diesel",
                "Gás natural convencional"
            ],
            correct: 1,
            feedback: "Painéis solares reduzem custos e emissões no campo."
        },
        {
            question: "O tema do AGRINHO 2026 enfatiza o equilíbrio entre:",
            options: [
                "Apenas aumento de produção",
                "Produção agrícola e preservação do meio ambiente",
                "Exportação e importação de grãos",
                "Uso de agrotóxicos e sementes transgênicas"
            ],
            correct: 1,
            feedback: "“Agro Forte, Futuro Sustentável” busca conciliar produtividade com conservação ambiental."
        }
    ];

    let currentQuestion = 0;
    let score = 0;
    let answered = false;

    const quizQuestion = document.getElementById("quiz-question");
    const quizOptions = document.getElementById("quiz-options");
    const quizCounter = document.getElementById("quiz-counter");
    const quizBar = document.getElementById("quiz-bar");
    const quizFeedback = document.getElementById("quiz-feedback");
    const quizNext = document.getElementById("quiz-next");
    const quizRestart = document.getElementById("quiz-restart");
    const quizResult = document.getElementById("quiz-result");
    const resultScore = document.getElementById("result-score");
    const resultMessage = document.getElementById("result-message");

    function loadQuestion() {
        answered = false;
        quizFeedback.hidden = true;
        quizNext.hidden = true;
        quizRestart.hidden = true;
        quizResult.hidden = true;

        const q = quizData[currentQuestion];
        quizQuestion.textContent = q.question;
        quizCounter.textContent = `Pergunta ${currentQuestion + 1} de ${quizData.length}`;
        quizBar.style.width = `${((currentQuestion + 1) / quizData.length) * 100}%`;

        quizOptions.innerHTML = "";
        q.options.forEach((opt, i) => {
            const btn = document.createElement("button");
            btn.className = "quiz-option";
            btn.textContent = opt;
            btn.dataset.index = i;
            btn.addEventListener("click", () => selectAnswer(i));
            quizOptions.appendChild(btn);
        });
    }

    function selectAnswer(index) {
        if (answered) return;
        answered = true;

        const q = quizData[currentQuestion];
        const buttons = quizOptions.querySelectorAll(".quiz-option");

        buttons.forEach((btn) => {
            btn.disabled = true;
            const btnIndex = parseInt(btn.dataset.index, 10);
            if (btnIndex === q.correct) {
                btn.classList.add("correct");
            } else if (btnIndex === index) {
                btn.classList.add("wrong");
            }
        });

        if (index === q.correct) {
            score++;
            quizFeedback.textContent = "✓ Correto! " + q.feedback;
            quizFeedback.className = "quiz-feedback correct";
        } else {
            quizFeedback.textContent = "✗ Incorreto. " + q.feedback;
            quizFeedback.className = "quiz-feedback wrong";
        }
        quizFeedback.hidden = false;

        if (currentQuestion < quizData.length - 1) {
            quizNext.hidden = false;
        } else {
            showResult();
        }
    }

    function showResult() {
        quizNext.hidden = true;
        quizRestart.hidden = false;
        quizResult.hidden = false;

        const percent = Math.round((score / quizData.length) * 100);
        resultScore.textContent = `${score} de ${quizData.length} (${percent}%)`;

        if (percent >= 80) {
            resultMessage.textContent = "Excelente! Você demonstra ótimo conhecimento sobre agro sustentável.";
        } else if (percent >= 50) {
            resultMessage.textContent = "Bom resultado! Continue explorando os temas do AGRINHO 2026.";
        } else {
            resultMessage.textContent = "Que tal revisar as seções do site e tentar novamente?";
        }
    }

    quizNext.addEventListener("click", () => {
        currentQuestion++;
        loadQuestion();
    });

    quizRestart.addEventListener("click", () => {
        currentQuestion = 0;
        score = 0;
        loadQuestion();
    });

    loadQuestion();

    // ===== Formulário de contato (simulado) =====
    const contactForm = document.getElementById("contact-form");
    const formSuccess = document.getElementById("form-success");

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();

        if (!nome || !email || !mensagem) return;

        // Simula envio (sem backend)
        contactForm.hidden = true;
        formSuccess.hidden = false;

        // Opcional: reset após alguns segundos
        setTimeout(() => {
            contactForm.reset();
            contactForm.hidden = false;
            formSuccess.hidden = true;
        }, 5000);
    });

    // ===== Animação suave de entrada nas seções (opcional) =====
    const animatedSections = document.querySelectorAll(".about-card, .theme-card, .challenge-item");

    const fadeObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    fadeObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    animatedSections.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        fadeObserver.observe(el);
    });
});
