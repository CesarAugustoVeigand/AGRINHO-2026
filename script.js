document.addEventListener("DOMContentLoaded", () => {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentFilter = "all";

    const themeToggle = document.getElementById("theme-toggle");
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const doneCounter = document.getElementById("done-counter");
    const pendingCounter = document.getElementById("pending-counter");
    const notifCount = document.getElementById("notif-count");

    const savedTheme = localStorage.getItem("theme") || "light-theme";
    document.body.className = savedTheme;

    themeToggle.addEventListener("click", () => {
        if (document.body.classList.contains("light-theme")) {
            document.body.classList.replace("light-theme", "dark-theme");
            localStorage.setItem("theme", "dark-theme");
        } else {
            document.body.classList.replace("dark-theme", "light-theme");
            localStorage.setItem("theme", "light-theme");
        }
    });

    const updateCounters = () => {
        const completed = tasks.filter(t => t.completed).length;
        const pending = tasks.length - completed;
        
        doneCounter.textContent = completed;
        pendingCounter.textContent = pending;
        notifCount.textContent = pending;
    };

    const saveTasks = () => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        updateCounters();
    };

    const renderTasks = () => {
        taskList.innerHTML = "";

        const filteredTasks = tasks.filter(task => {
            if (currentFilter === "pending") return !task.completed;
            if (currentFilter === "completed") return task.completed;
            return true;
        });

        filteredTasks.forEach(task => {
            const li = document.createElement("li");
            li.className = `task-item ${task.completed ? "completed" : ""}`;
            
            li.innerHTML = `
                <span>${task.text}</span>
                <div class="task-actions">
                    <button class="btn-complete" data-id="${task.id}">${task.completed ? "Desfazer" : "Concluir"}</button>
                    <button class="btn-delete" data-id="${task.id}">Excluir</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    };

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (!text) return;

        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = "";
    });

    taskList.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        if (!id) return;

        if (e.target.classList.contains("btn-complete")) {
            tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        } else if (e.target.classList.contains("btn-delete")) {
            tasks = tasks.filter(t => t.id !== id);
        }

        saveTasks();
        renderTasks();
    });

    filterButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterButtons.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            currentFilter = e.target.dataset.filter;
            renderTasks();
        });
    });

    renderTasks();
    updateCounters();
});
