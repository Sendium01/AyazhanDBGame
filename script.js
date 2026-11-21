// Массив уровней: сначала теория (Уровень 0), потом практика
const levels = [
    // --- БЛОК 0: ТЕРМИНЫ ---
    {
        title: "Термин 1. Таблица, Запись, Поле",
        speech: "Привет! Прежде чем начать, давай выучим основы. <b>Таблица</b> — это сетка. <b>Строка (Запись)</b> — один объект. <b>Столбец (Поле)</b> — характеристика. Найди в таблице <b>Запись</b> (строку) студента Смирнова и кликни по ней.",
        type: "term_structure"
    },
    {
        title: "Термин 2. Первичный ключ (PK)",
        speech: "<b>Первичный ключ (PK)</b> — это поле, которое никогда не повторяется. Оно уникально для каждой записи. Какой столбец здесь может быть первичным ключом? Кликни по заголовку этого столбца.",
        type: "term_pk"
    },
    {
        title: "Термин 3. Внешний ключ (FK) и Связи",
        speech: "<b>Внешний ключ (FK)</b> — это поле, которое ссылается на ID из другой таблицы. Оно нужно для <b>связи 1:N</b> (один ко многим). Кликни по ячейке, которая является внешним ключом (FK) для таблицы «Студенты».",
        type: "term_fk"
    },
    {
        title: "Термин 4. Избыточность и Аномалии",
        speech: "<b>Избыточность</b> — это дублирование данных (когда одно и то же пишут много раз). Кликни на <b>все ячейки</b>, где дублируется преподаватель «Петров».",
        type: "term_redundancy"
    },

    // --- БЛОК 1: ПРАКТИКА ---
    {
        title: "Практика 1. Аномалия обновления",
        speech: "Отлично! Теперь ты знаешь термины. Петров переехал в кабинет 410. Найди в таблице ВСЕ строки с Петровым и исправь кабинет на 410. (Кликни по ячейке).",
        type: "anomaly_update"
    },
    {
        title: "Практика 2. Нормализация",
        speech: "Таблица трещит по швам. Разложи поля по трём таблицам, чтобы устранить избыточность. Обрати внимание: в главных таблицах ключи помечены <b>(PK)</b>, а в связующей — <b>(FK)</b>. Кликай по полю внизу, затем по нужной зоне.",
        type: "normalize"
    },
    {
        title: "Финал",
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
btnCheat.addEventListener('click', () => cheatPanel.classList.toggle('hidden'));

// Кнопка Далее
btnNext.addEventListener('click', () => {
    if (canProceed) {
        currentLevel++;
        if (currentLevel < levels.length) loadLevel();
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

    if (level.type === 'term_structure') renderTermStructure();
    else if (level.type === 'term_pk') renderTermPK();
    else if (level.type === 'term_fk') renderTermFK();
    else if (level.type === 'term_redundancy') renderTermRedundancy();
    else if (level.type === 'anomaly_update') renderUpdate();
    else if (level.type === 'normalize') renderNormalize();
    else if (level.type === 'finish') renderFinish();
}

/* --- ТЕРМИН 1: СТРУКТУРА --- */
function renderTermStructure() {
    const table = el('table', 'table');
    const thead = el('thead');
    const trh = el('tr');
    ["Имя", "Возраст", "Город"].forEach(h => trh.appendChild(el('th', null, h)));
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = el('tbody');
    const rows = [
        { name: "Иванов", age: 20, city: "Москва" },
        { name: "Петров", age: 21, city: "Казань" },
        { name: "Смирнов", age: 19, city: "Сочи" }
    ];
    
    rows.forEach((r, ri) => {
        const tr = el('tr');
        tr.appendChild(el('td', null, r.name));
        tr.appendChild(el('td', null, r.age));
        
        tr.style.cursor = "pointer";
        tr.addEventListener('click', () => {
            if (r.name === "Смирнов") {
                tr.style.background = "rgba(34,197,94,.3)";
                showFeedback("✅ Верно! Ты выбрал <b>Запись</b> (строку). А столбцы (Имя, Возраст) — это <b>Поля</b>.", "ok");
                enableNext(true);
            } else {
                showFeedback("❌ Это тоже запись, но нам нужен именно Смирнов.", "bad");
            }
        });
        
        tr.appendChild(el('td', null, r.city));
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    stage.appendChild(table);
}

/* --- ТЕРМИН 2: ПЕРВИЧНЫЙ КЛЮЧ --- */
function renderTermPK() {
    const table = el('table', 'table');
    const thead = el('thead');
    const trh = el('tr');
    
    ["ID", "Имя", "Предмет"].forEach((h, idx) => {
        const th = el('th', null, h);
        th.style.cursor = "pointer";
        th.addEventListener('click', () => {
            if (h === "ID") {
                th.style.background = "rgba(34,197,94,.5)";
                showFeedback("✅ Верно! ID уникален для каждого. Это <b>Первичный ключ (PK)</b>.", "ok");
                enableNext(true);
            } else {
                showFeedback("❌ А если два студента с одинаковым именем? Ключ должен быть уникальным.", "bad");
            }
        });
        trh.appendChild(th);
    });
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = el('tbody');
    [
        { id: "S-1", name: "Иванов", subj: "Математика" },
        { id: "S-2", name: "Иванов", subj: "Физика" },
        { id: "S-3", name: "Петров", subj: "Математика" }
    ].forEach(r => {
        const tr = el('tr');
        tr.appendChild(el('td', null, r.id));
        tr.appendChild(el('td', null, r.name));
        tr.appendChild(el('td', null, r.subj));
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    stage.appendChild(table);
}

/* --- ТЕРМИН 3: ВНЕШНИЙ КЛЮЧ --- */
function renderTermFK() {
    const wrap = el('div');
    wrap.innerHTML = `<p style="font-size:14px; margin-bottom:10px;">Таблица «Студенты» имеет PK — <b>ID_студента</b>.</p>`;
    
    const table = el('table', 'table');
    const thead = el('thead');
    const trh = el('tr');
    ["ID_записи", "Оценка", "ID_студента"].forEach(h => trh.appendChild(el('th', null, h)));
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = el('tbody');
    [
        { id: "R-1", grade: 5, student: "S-1" },
        { id: "R-2", grade: 4, student: "S-2" }
    ].forEach(r => {
        const tr = el('tr');
        tr.appendChild(el('td', null, r.id));
        tr.appendChild(el('td', null, r.grade));
        
        const tdFk = el('td', 'clickable', r.student);
        tdFk.style.cursor = "pointer";
        tdFk.addEventListener('click', () => {
            tdFk.style.background = "rgba(34,197,94,.3)";
            showFeedback("✅ Верно! <b>ID_студента</b> ссылается на другую таблицу. Это <b>Внешний ключ (FK)</b>. Он связывает Записи со Студентами.", "ok");
            enableNext(true);
        });
        tr.appendChild(tdFk);
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    stage.appendChild(wrap);
}

/* --- ТЕРМИН 4: ИЗБЫТОЧНОСТЬ --- */
function renderTermRedundancy() {
    const wrap = el('div');
    wrap.appendChild(el('div', 'task', 'Кликни на все ячейки, где написано "Петров".'));

    const table = el('table', 'table');
    const thead = el('thead');
    const trh = el('tr');
    ["Студент", "Преподаватель", "Оценка"].forEach(h => trh.appendChild(el('th', null, h)));
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = el('tbody');
    const rows = [
        { s: "Иванов", t: "Петров", g: 5 },
        { s: "Петрова", t: "Петров", g: 4 },
        { s: "Смирнов", t: "Сидоров", g: 3 }
    ];
    
    let found = 0;
    rows.forEach(r => {
        const tr = el('tr');
        tr.appendChild(el('td', null, r.s));
        
        const tdT = el('td', 'clickable', r.t);
        tdT.style.cursor = "pointer";
        tdT.addEventListener('click', () => {
            if (r.t === "Петров" && !tdT.classList.contains('good')) {
                tdT.classList.add('good');
                found++;
                if (found === 2) {
                    showFeedback("✅ Да! Имя преподавателя дублируется. Это <b>Избыточность</b>. Чтобы её убрать, нужна <b>Нормализация</b>.", "ok");
                    enableNext(true);
                } else {
                    showFeedback("Хорошо, ищи дальше. Есть еще?", "info");
                }
            }
        });
        tr.appendChild(tdT);
        tr.appendChild(el('td', null, r.g));
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    stage.appendChild(wrap);
}

/* --- ПРАКТИКА 1: АНОМАЛИЯ --- */
function renderUpdate() {
    const rows = [
        { student: "Иванов", teacher: "Петров", room: 301 },
        { student: "Петрова", teacher: "Петров", room: 301 },
        { student: "Смирнов", teacher: "Сидоров", room: 205 }
    ];
    const wrap = el('div');
    wrap.appendChild(el('div', 'task', 'Кликни по ячейке "Кабинет" и введи 410.'));

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
        tdRoom.style.cursor = "pointer";
        tdRoom.addEventListener('click', () => {
            const v = prompt("Новый кабинет для " + r.teacher + ":", tdRoom.textContent);
            if (v && v.trim() !== "") {
                tdRoom.textContent = v.trim();
                tdRoom.classList.remove('good', 'bad');
            }
        });
        tr.appendChild(tdRoom);
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);

    const btnCheck = el('button', null, 'Проверить');
    btnCheck.style.marginTop = '10px';
    btnCheck.addEventListener('click', () => {
        let ok = 0, pRows = 0;
        Array.from(tbody.children).forEach((tr, i) => {
            if (rows[i].teacher === "Петров") {
                pRows++;
                const roomCell = tr.children[2];
                if (roomCell.textContent.trim() === "410") {
                    roomCell.classList.add('good');
                    ok++;
                } else {
                    roomCell.classList.add('bad');
                }
            }
        });
        
        if (ok === pRows && pRows > 0) {
            showFeedback("✅ Верно! Пришлось править <b>две</b> строки. Это <b>аномалия обновления</b> — избыточность заставляет дублировать действия.", "ok");
            enableNext(true);
        } else {
            showFeedback(`Обновлено ${ok} из ${pRows} строк с Петровым.`, "bad");
        }
    });
    wrap.appendChild(btnCheck);
    stage.appendChild(wrap);
}

/* --- ПРАКТИКА 2: НОРМАЛИЗАЦИЯ --- */
function renderNormalize() {
    const zonesData = [
        { id: "students", title: "Студенты", correct: ["ID_студента (PK)", "ФИО"] },
        { id: "teachers", title: "Преподаватели", correct: ["ID_преподавателя (PK)", "ФИО_препода", "Кабинет"] },
        { id: "records", title: "Записи", correct: ["ID_студента (FK)", "ID_преподавателя (FK)", "Оценка"] }
    ];

    // Уникальные карточки
    const poolItems = [
        { name: "ID_студента (PK)", zone: "students" },
        { name: "ФИО", zone: "students" },
        { name: "ID_преподавателя (PK)", zone: "teachers" },
        { name: "ФИО_препода", zone: "teachers" },
        { name: "Кабинет", zone: "teachers" },
        { name: "Оценка", zone: "records" },
        { name: "ID_студента (FK)", zone: "records" },         
        { name: "ID_преподавателя (FK)", zone: "records" }     
    ].sort(() => Math.random() - 0.5);

    const wrap = el('div');
    
    const pool = el('div', 'pool');
    pool.id = "mainPool";
    poolItems.forEach(item => {
        const chip = el('div', 'chip', item.name);
        chip.dataset.name = item.name;
        chip.addEventListener('click', () => {
            if (chip.parentElement.classList.contains('slot')) {
                pool.appendChild(chip);
                chip.classList.remove('sel');
                return;
            }
            document.querySelectorAll('.chip.sel').forEach(c => c.classList.remove('sel'));
            chip.classList.add('sel');
        });
        pool.appendChild(chip);
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
            if (selChip.parentElement.classList.contains('slot')) {
                pool.appendChild(selChip);
            }
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
        let errorMsg = "";

        zones.forEach(z => {
            const placed = Array.from(z.slot.querySelectorAll('.chip')).map(c => c.dataset.name);
            const correct = z.data.correct;
            
            const placedSorted = [...placed].sort();
            const correctSorted = [...correct].sort();
            
            if (JSON.stringify(placedSorted) !== JSON.stringify(correctSorted)) {
                allOk = false;
                errorMsg = `В зоне «${z.data.title}» не хватает полей или есть лишние.`;
            }
        });

        if (allOk) {
            showFeedback("✅ Идеально! Ты разбил таблицу на связанные — это <b>нормализация</b>. Таблица «Записи» связала студентов и преподавателей с помощью внешних ключей (FK).", "ok");
            enableNext(true);
        } else {
            showFeedback("❌ " + errorMsg + " Вспомни: PK — это главный ключ в своей таблице, а FK — это ссылка на чужой ключ в связующей таблице.", "bad");
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
        <p>Вы успешно выучили термины, пережили аномалии и провели нормализацию!</p>
        <p style="color:var(--accent); font-weight: bold;">Теперь вы понимаете, зачем нужны таблицы, PK, FK и нормализация.</p>
        <button onclick="location.reload()" class="ghost">Играть снова</button>
    `;
    stage.appendChild(wrap);
    enableNext(false);
}

// Инициализация
loadLevel();
