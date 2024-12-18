document.addEventListener('DOMContentLoaded', () => {
    // Variabel untuk Pomodoro Timer
    let timer, isRunning = false, timeLeft;
    let pomodoroDuration = 25 * 60, breakDuration = 5 * 60;

    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const resetButton = document.getElementById('reset');
    const pomodoroInput = document.getElementById('pomodoroDuration');
    const breakInput = document.getElementById('breakDuration');
    const pomodoroValue = document.getElementById('pomodoroValue');
    const breakValue = document.getElementById('breakValue');
    const settingsIcon = document.getElementById('settingsIcon');
    const settingsModal = document.getElementById('settingsModal');

    // Variabel untuk To-Do List
    const todoInput = document.getElementById('todoInput');
    const addTodoButton = document.getElementById('addTodo');
    const todoItemsList = document.getElementById('todoItems');

    // Fungsi: Simpan pengaturan
    function saveSettings() {
        localStorage.setItem('pomodoroDuration', pomodoroDuration / 60);
        localStorage.setItem('breakDuration', breakDuration / 60);
    }

    // Fungsi: Load settings untuk Pomodoro Timer
    function loadSettings() {
        const savedPomodoro = localStorage.getItem('pomodoroDuration');
        const savedBreak = localStorage.getItem('breakDuration');

        if (savedPomodoro) {
            pomodoroDuration = parseInt(savedPomodoro) * 60;
            pomodoroInput.value = savedPomodoro;
            pomodoroValue.textContent = `${savedPomodoro} menit`;
        } else {
            pomodoroInput.value = 25; // Default value
            pomodoroValue.textContent = '25 menit';
        }

        if (savedBreak) {
            breakDuration = parseInt(savedBreak) * 60;
            breakInput.value = savedBreak;
            breakValue.textContent = `${savedBreak} menit`;
        } else {
            breakInput.value = 5; // Default value
            breakValue.textContent = '5 menit';
        }

        timeLeft = pomodoroDuration; // Set initial time
        updateDisplay();
    }

    // Fungsi: Update tampilan timer
    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }

    // Fungsi: Jalankan timer
    function updateTimer() {
        if (timeLeft <= 0) {
            clearInterval(timer);
            isRunning = false;
            alert('Waktu habis!');
            playSound();
            return;
        }
        timeLeft--;
        updateDisplay();
    }

    // Fungsi: Mainkan suara alarm
    function playSound() {
        const audio = new Audio('alarm.mp3'); // Ganti dengan path file audio
        audio.play();
    }

    // Event Listener: Input durasi Pomodoro
    pomodoroInput.addEventListener('input', () => {
        const inputPomodoro = parseInt(pomodoroInput.value);
        if (!isNaN(inputPomodoro)) {
            pomodoroDuration = inputPomodoro * 60;
            pomodoroValue.textContent = `${inputPomodoro} menit`;
            saveSettings();
            if (!isRunning) {
                timeLeft = pomodoroDuration;
                updateDisplay();
            }
        }
    });

    // Event Listener: Input durasi istirahat
    breakInput.addEventListener('input', () => {
        const inputBreak = parseInt(breakInput.value);
        if (!isNaN(inputBreak)) {
            breakDuration = inputBreak * 60;
            breakValue.textContent = `${inputBreak} menit`;
            saveSettings();
        }
    });

    // Event Listener: Klik timer untuk mulai/jeda
    document.getElementById('timer').addEventListener('click', () => {
        if (!isRunning) {
            isRunning = true;
            timer = setInterval(updateTimer, 1000);
        }
    });

    // Event Listener: Tombol reset
    resetButton.addEventListener('click', () => {
        clearInterval(timer);
        isRunning = false;
        timeLeft = pomodoroDuration;
        updateDisplay();
    });

    // Event Listener: Buka modal pengaturan
    settingsIcon.addEventListener('click', () => {
        settingsModal.style.display = (settingsModal.style.display === 'block') ? 'none' : 'block';
    });

    // Event Listener: Tutup modal saat klik di luar modal
    window.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    // Fungsi untuk menambahkan tugas baru ke To-Do List
    function addTodoItem() {
        const todoText = todoInput.value.trim();
        if (todoText !== '') {
            const li = document.createElement('li');
            li.innerHTML = `${todoText} <button class="deleteTodo">Hapus</button>`;
            todoItemsList.appendChild(li);
            todoInput.value = ''; // Reset input setelah menambahkan
            saveTodoList(); // Simpan To-Do List
        }
    }

    // Fungsi untuk menghapus tugas dari To-Do List
    function deleteTodoItem(event) {
        if (event.target.classList.contains('deleteTodo')) {
            event.target.parentElement.remove();
            saveTodoList(); // Simpan To-Do List setelah dihapus
        }
    }

    // Fungsi untuk menyimpan To-Do List di localStorage
    function saveTodoList() {
        const todos = [];
        const todoItems = todoItemsList.querySelectorAll('li');
        todoItems.forEach(item => {
            todos.push(item.firstChild.textContent.trim());
        });
        localStorage.setItem('todoList', JSON.stringify(todos));
    }

    // Fungsi untuk memuat To-Do List dari localStorage
    function loadTodoList() {
        const savedTodos = localStorage.getItem('todoList');
        if (savedTodos) {
            const todos = JSON.parse(savedTodos);
            todos.forEach(todo => {
                const li = document.createElement('li');
                li.innerHTML = `${todo} <button class="deleteTodo">Hapus</button>`;
                todoItemsList.appendChild(li);
            });
        }
    }

    // Event Listener: Tambahkan tugas baru
    addTodoButton.addEventListener('click', addTodoItem);

    // Event Listener: Hapus tugas saat klik tombol "Hapus"
    todoItemsList.addEventListener('click', deleteTodoItem);

    // Load settings dan To-Do List saat halaman dimuat
    loadSettings();
    loadTodoList();
});
