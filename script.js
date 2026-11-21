// Данные уровней (сюжет)
const levels = [
    {
        title: "Уровень 1. Структура",
        speech: "Вот карточки. Разложи их по столбцам: имя, город, телефон. Кликни по ячейке таблицы, затем по карточке внизу.",
        type: "structure"
    },
    {
        title: "Уровень 2. Первичный ключ",
        speech: "Таблица есть, но нет главного столбца. Выбери поле, которое никогда не повторяется (PK). Если такого нет — выбери два поля для составного ключа.",
        type: "pk"
    },
    {
        title: "Уровень 3. Аномалия обновления",
        speech: "Петров переехал в кабинет 410. Измени все строки, где он встречается. Кликни по ячейке «Кабинет» и введи новое значение.",
        type: "anomaly_update"
    },
    {
        title: "Уровень 4. Нормализация",
        speech: "Таблица трещит по швам. Разложи поля по четырём таблицам. Кликай по полю, затем по нужной зоне.",
        type: "normalize"
    },
    {
        title: "Уровень 5. Финал",
        speech: "Ты справился! Теперь ты знаешь, зачем нужны ключи и нормализация.",
        type: "finish"
    }
];

let currentLevel = 0;
let canProceed = false;

// DOM элементы
const stage = document.getElementById('stage');
const feedback = document.getElementById('feedback');
const btnNext = document.getElementById('btnNext');
const speech = document.getElementById('speech');
const progress = document.getElementById('progress');
const btnCheat = document.getElementById('btnCheat');
const cheatPanel = document.getElementById('cheatPanel');

// Утилиты
function el(tag, className, html) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
}

function showFeedback(text, type = 'info') {
    feedback.className = `feedback show ${type}`;
    feedback.innerHTML = text;
}

function clearFeedback() {
    feedback.className = 'feedback';
    feedback.innerHTML = '';
}

function updateProgress() {
    progress.innerHTML = '';
    levels.forEach((_, i) => {
        const dot = el('div', 'dot');
        if (i < currentLevel) dot.classList.add('done');
        if (i === currentLevel) dot.classList.add('active');
        progress.appendChild(dot);
    });
}

function enableNext(val) {
    canProceed = val;
    btnNext.disabled = !val;
}

// Переключение шпаргалки
btnCheat.addEventListener('click', () => {
    cheatPanel.classList.toggle('hidden');
});

// Кнопка Далее
btnNext.addEventListener('click', () => {
    if (canProceed) {
        currentLevel++;
        if (currentLevel < levels.length) {
            loadLevel();
        }
    }
});

// Загрузка уровня
function loadLevel() {
    if (currentLevel >= levels.length) return;
    
    const level = levels[currentLevel];
    speech.innerHTML = level.speech;
    stage.innerHTML = '';
    clearFeedback();
    enableNext(false);
    updateProgress();

    if (level.type === 'structure') renderStructure();
    else if (level.type === 'pk') renderPK();
    else if (level.type === 'anomaly_update') renderUpdate();
    else if (level.type === 'normalize') renderNormalize();
    else if (level.type === 'finish') renderFinish();
}

/* --- УРОВЕНЬ 1: СТРУКТУРА --- */
function renderStructure() {
    const data = [
        { name: "Иванов", city: "Москва", phone: "+7 900 111" },
        { name: "Петрова", city: "Казань", phone: "+7 900 222" },
        { name: "Смирнов", city: "Сочи", phone: "+7 900 333" }
    ];
    const keys = ["name", "city", "phone"];
    const headers = ["Имя", "Город", "Телефон"];
    
    // Создаем пул
    let poolValues = [];
    data.forEach((r, ri) => {
        keys.forEach(k => poolValues.push({ ri, k, val: r[k] }));
    });
    poolValues = poolValues.sort(() => Math.random() - 0.5);

    const wrap = el('div');
    wrap.appendChild(el('div', 'task', 'Кликни по ячейке таблицы, затем по карточке внизу — она встанет на место.'));

    const table = el('table', 'table');
    const thead = el('thead');
    const trh = el('tr');
    headers.forEach(h => trh.appendChild(el('th', null, h)));
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = el('tbody');
    const cells = [];
    
    data.forEach((r, ri) => {
        const tr = el('tr');
        keys.forEach((k, ci) => {
            const td = el('td', 'clickable', '—');
            td.dataset.ri = ri;
            td.dataset.k = k;
            td.addEventListener('click', () => {
                document.querySelectorAll('td.sel').forEach(x => x.classList.remove('sel'));
                td.classList.add('sel');
            });
            cells.push(td);
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);

    const pool = el('div', 'pool');
    poolValues.forEach(p => {
        const chip = el('div', 'chip', p.val);
        chip.addEventListener('click', () => {
            const sel = document.querySelector('td.sel');
            if (!sel) { showFeedback("Сначала выбери ячейку в таблице.", "bad"); return; }
            sel.textContent = p.val;
            sel.dataset.val = p.val;
            sel.classList.remove('good', 'bad');
            chip.style.opacity = '0.3';
            chip.style.pointerEvents = 'none';
        });
        pool.appendChild(chip);
    });
    wrap.appendChild(pool);

    const btnCheck = el('button', null, 'Проверить');
    btnCheck.style.marginTop = '10px';
    btnCheck.addEventListener('click', () => {
        let ok = 0, total = 9;
        cells.forEach(td => {
            const ri = +td.dataset.ri, k = td.dataset.k;
            const correct = data[ri][k];
            const val = td.dataset.val;
            if (val === correct) { td.classList.add('good'); ok++; }
            else if (val) { td.classList.add('bad'); }
        });
        if (ok === total) {
            showFeedback("✅ Отлично! Ты разложил <b>записи</b> по <b>полям</b>.", "ok");
            enableNext(true);
        } else {
            showFeedback(`Правильно ${ok} из 9. Красные ячейки — ошибки.`, "bad");
        }
    });
    wrap.appendChild(btnCheck);
    stage.appendChild(wrap);
}

/* --- УРОВЕНЬ 2: ПЕРВИЧНЫЙ КЛЮЧ --- */
function renderPK() {
    const rows = [
        { id: "S-101", name: "Иванов", subject: "Математика" },
        { id: "S-102", name: "Иванов", subject: "Физика" },
        { id: "S-103", name: "Петрова", subject: "Математика" }
    ];
    
    const wrap = el('div');
    wrap.appendChild(el('div', 'task', 'Выбери поле, которое уникально в каждой строке (PK).'));

    const table = el('table', 'table');
    const thead = el('thead');
    const trh = el('tr');
    ["ID", "Имя", "Предмет"].forEach(h => trh.appendChild(el('th', null, h)));
    thead.appendChild(trh);
    table.appendChild(thead);
    
    const tbody = el('tbody');
    rows.forEach(r => {
        const tr = el('tr');
        tr.appendChild(el('td', null, r.id));
        tr.appendChild(el('td', null, r.name));
        tr.appendChild(el('td', null, r.subject));
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);

    const cards = el('div', 'cards');
    const selected = new Set();
    ["id", "name", "subject"].forEach((col, idx) => {
        const names = ["ID", "Имя", "Предмет"];
        const chip = el('div', 'chip', names[idx]);
        chip.addEventListener('click', () => {
            if (selected.has(col)) { selected.delete(col); chip.classList.remove('sel'); }
            else { selected.add(col); chip.classList.add('sel'); }
        });
        cards.appendChild(chip);
    });
    wrap.appendChild(cards);

    const btnCheck = el('button', null, 'Проверить');
    btnCheck.style.marginTop = '10px';
    btnCheck.addEventListener('click', () => {
        const arr = [...selected];
        if (arr.length === 1 && arr[0] === 'id') {
            showFeedback("✅ Верно! Поле «ID» уникально — это первичный ключ.", "ok");
            enableNext(true);
        } else {
            showFeedback("❌ Имя повторяется, предмет повторяется. Выбери ID.", "bad");
        }
    });
    wrap.appendChild(btnCheck);
    stage.appendChild(wrap);
}

/* --- УРОВЕНЬ 3: АНОМАЛИЯ ОБНОВЛЕНИЯ --- */
function renderUpdate() {
    const rows = [
        { student: "Иванов", teacher: "Петров", room: 301 },
        { student: "Петрова", teacher: "Петров", room: 301 },
        { student: "Смирнов", teacher: "Сидоров", room: 205 }
    ];
    const wrap = el('div');
    wrap.appendChild(el('div', 'task', 'Петров переехал в 410. Кликни по ячейке "Кабинет" и введи 410.'));

    const table = el('table', 'table');
    const thead = el('thead');
    const trh = el('tr');
    ["Студент", "Преподаватель", "Кабинет"].forEach(h => trh.appendChild(el('th', null, h)));
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = el('tbody');
    rows.forEach((r, ri) => {
        const tr = el('tr');
        tr.appendChild(el('td', null, r.student));
        tr.appendChild(el('td', null, r.teacher));
        
        const tdRoom = el('td', 'clickable', r.room);
        tdRoom.dataset.ri = ri;
        tdRoom.addEventListener('click', () => {
            const v = prompt("Новый кабинет для " + r.teacher + ":", tdRoom.textContent);
            if (v && v.trim() !== "") {
                tdRoom.textContent = v.trim();
                check();
            }
        });
        tr.appendChild(tdRoom);
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);

    function check() {
        const cells = tbody.querySelectorAll('td[data-ri]');
        let ok = 0;
        cells.forEach(td => {
            if (td.textContent.trim() === "410") ok++;
        });
        if (ok === 2) {
            showFeedback("✅ Верно! Пришлось править <b>две</b> строки. Это <b>аномалия обновления</b> — избыточность заставляет дублировать действия.", "ok");
            enableNext(true);
        }
    }
    stage.appendChild(wrap);
}

/* --- УРОВЕНЬ 4: НОРМАЛИЗАЦИЯ --- */
function renderNormalize() {
    const zonesData = [
        { id: "students", title: "Студенты", correct: ["ID_студента", "ФИО"] },
        { id: "teachers", title: "Преподаватели", correct: ["ID_преподавателя", "ФИО_препода", "Кабинет"] },
        { id: "records", title: "Записи", correct: ["ID_студента", "ID_препода", "Оценка"] }
    ];

    // Пул полей
    const poolItems = [
        { name: "ID_студента", zone: "students" },
        { name: "ФИО", zone: "students" },
        { name: "ID_преподавателя", zone: "teachers" },
        { name: "ФИО_препода", zone: "teachers" },
        { name: "Кабинет", zone: "teachers" },
        { name: "Оценка", zone: "records" }
    ].sort(() => Math.random() - 0.5);

    const wrap = el('div');
    wrap.appendChild(el('div', 'task', 'Кликни по полю внизу, затем по нужной таблице.'));

    const pool = el('div', 'pool');
    const chips = [];
    poolItems.forEach(item => {
        const chip = el('div', 'chip', item.name);
        chip.dataset.name = item.name;
        chip.addEventListener('click', () => {
            document.querySelectorAll('.chip.sel').forEach(c => c.classList.remove('sel'));
            chip.classList.add('sel');
        });
        pool.appendChild(chip);
        chips.push(chip);
    });
    wrap.appendChild(pool);

    const zonesWrap = el('div', 'zones');
    const zones = [];
    zonesData.forEach(zd => {
        const zone = el('div', 'zone');
        zone.appendChild(el('h4', null, zd.title));
        const slot = el('div', 'slot');
        zone.appendChild(slot);
        
        zone.addEventListener('click', () => {
            const selChip = document.querySelector('.chip.sel');
            if (!selChip) return;
            slot.appendChild(selChip);
            selChip.classList.remove('sel');
        });
        zonesWrap.appendChild(zone);
        zones.push({ el: zone, data: zd, slot });
    });
    wrap.appendChild(zonesWrap);

    const btnCheck = el('button', null, 'Проверить');
    btnCheck.style.marginTop = '10px';
    btnCheck.addEventListener('click', () => {
        let allOk = true;
        zones.forEach(z => {
            const placed = Array.from(z.slot.querySelectorAll('.chip')).map(c => c.dataset.name);
            const correct = z.data.correct;
            
            // Проверка на совпадение массивов (без учета порядка)
            const isMatch = placed.length === correct.length && placed.every(v => correct.includes(v));
            if (!isMatch) allOk = false;
        });

        if (allOk) {
            showFeedback("✅ Идеально! Ты разбил плоскую таблицу на связанные — это <b>нормализация</b>.", "ok");
            enableNext(true);
        } else {
            showFeedback("❌ Не все поля на своих местах. Подумай, где должны храниться ФИО преподавателя и кабинет.", "bad");
        }
    });
    wrap.appendChild(btnCheck);
    stage.appendChild(wrap);
}

/* --- ФИНАЛ --- */
function renderFinish() {
    const wrap = el('div', 'card');
    wrap.style.textAlign = 'center';
    wrap.innerHTML = `
        <h2 style="color:var(--gold);">🏆 Диплом сотрудника Бюро</h2>
        <p>Вы успешно разобрали картотеку, нашли ключи, пережили аномалии и провели нормализацию!</p>
        <p style="color:var(--accent); font-weight: bold;">Теперь вы понимаете, зачем нужны таблицы, PK, FK и нормализация.</p>
        <button onclick="location.reload()" class="ghost">Играть снова</button>
    `;
    stage.appendChild(wrap);
    enableNext(false);
}

// Инициализация
loadLevel();
