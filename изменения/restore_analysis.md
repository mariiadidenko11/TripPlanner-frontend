

## Общая схема работы "корзины"

На фронте реализована **временная корзина в памяти** — это обычный `useState([])` в каждом компоненте. Механизм одинаковый везде:

```
[пользователь нажимает "удалить"]
    → вызов delete*(id)   — реально удаляет запись в бд
    → setTrash(t => [item, ...t])  — добавляет объект в локальный массив
    → внизу страницы появляется блок "Нещодавно видалені"

[пользователь нажимает "Відновити"]
    → вызов restore*(id)  — должен восстановить запись в бд
    → setTrash(t => t.filter(...))  — убирает из локального массива
    → refetch()  — перезагружает список
```

**Важно:** корзина живёт только пока открыта страница. При перезагрузке — пустая. Данные не сохраняются в localStorage.

---

## 1. `restoreTrip`

### Где используется
**Страница:** `src/pages/app/AllTripsPage.jsx`

```jsx
// строка 4 — импорт
import { getTrips, deleteTrip, restoreTrip } from '@/api/api';

// строка 15 — локальная корзина
const [trash, setTrash] = useState([]);

// строка 56 — при удалении поездка попадает в корзину
const handleDelete = async (e, trip) => {
    await deleteTrip(trip.id);
    setTrash(t => [trip, ...t]);   // ← кладём объект поездки в массив
    refetch();
};

// строка 67 — восстановление
const handleRestore = async (trip) => {
    await restoreTrip(trip.id);
    setTrash(t => t.filter(x => x.id !== trip.id));
    refetch();
};

// строка 202 — кнопка в UI
<button onClick={() => handleRestore(trip)}>↩ Відновити</button>
```

### Что делает `api.js`
```js
export async function restoreTrip(id) {
    if (USE_MOCK) return mockApi.restoreTrip(id);
    return null;   // ← реальный бек: ничего не делает
}
```

### Что делает `mockApi`
```js
export async function restoreTrip(id) {
    const db = getDB();
    const item = db.trips_trash.find(t => t.id === id);
    const { _trash_index, ...trip } = item;
    db.trips.splice(_trash_index, 0, trip);   // вставляет на исходную позицию
    db.trips_trash = db.trips_trash.filter(t => t.id !== id);
    saveDB(db);
    return trip;
}
```
В моке при удалении поездка сохраняется в `db.trips_trash` с полем `_trash_index` (исходная позиция в списке). При восстановлении вставляется обратно на ту же позицию.

### Что происходит с реальным беком
1. `deleteTrip(id)` → `DELETE /api/trips/drop/{id}` → запись **физически удаляется** из БД.
2. `restoreTrip(id)` → `return null` → никакого запроса не отправляется.
3. `setTrash(t => t.filter(...))` → объект исчезает из локальной корзины.
4. `refetch()` → `GET /api/content/get/trips` → поездки нет, она удалена.

**Результат:** пользователь видит "Відновити", нажимает — поездка исчезает из корзины, но не появляется в списке. Данные потеряны навсегда.

---

## 2. `restoreTask`

### Где используется
**Страница:** `src/pages/trip/TodoPage.jsx`

```jsx
// строка 4 — импорт
import { getTasks, createTask, updateTask, deleteTask, restoreTask } from '@/api/api';

// строка 13 — локальная корзина
const [trash, setTrash] = useState([]);

// при удалении
await deleteTask(tripId, task.id);
setTrash(t => [task, ...t]);

// строка 52 — восстановление
const restore = async (task) => {
    await restoreTask(tripId, task.id);
    setTrash(t => t.filter(x => x.id !== task.id));
    // нет refetch() — список не перезагружается
};

// строка 118 — кнопка в UI
<button onClick={() => restore(t)}>Відновити</button>
```

### Что делает `api.js`
```js
export async function restoreTask(_tripId, _taskId) {
    if (USE_MOCK) return mockApi.restoreTask(_tripId, _taskId);
    return null;
}
```

### Что делает `mockApi`
```js
export async function restoreTask(tripId, taskId) {
    const item = db.tasks_trash[tripId].find(t => t.id === taskId);
    const { _trash_index, ...task } = item;
    db.tasks[tripId].splice(_trash_index, 0, task);
    db.tasks_trash[tripId] = db.tasks_trash[tripId].filter(t => t.id !== taskId);
    saveDB(db);
    return task;
}
```

### Что происходит с реальным беком
То же самое — `DELETE /api/tasks/delete/{id}` физически удаляет задачу. `restoreTask` возвращает `null`. Задача потеряна. Дополнительная деталь: в `TodoPage` после `restore()` нет `refetch()` — даже если бы восстановление работало, список не обновился бы.

---

## 3. `restorePlace`

### Где используется
**Страница:** `src/pages/trip/PlacesPage.jsx`

```jsx
// строка 4 — импорт
import { getPlaces, createPlace, deletePlace, restorePlace, updatePlace } from '@/api/api';

// строка 14 — локальная корзина
const [trash, setTrash] = useState([]);

// при удалении
await deletePlace(tripId, place.id);
setTrash(t => [place, ...t]);

// строка 50 — восстановление
const restore = async (place) => {
    await restorePlace(tripId, place.id);
    setTrash(t => t.filter(x => x.id !== place.id));
    // нет refetch()
};

// строка 121 — кнопка в UI
<button onClick={() => restore(p)}>Відновити</button>
```

### Что делает `api.js`
```js
export async function restorePlace(_tripId, _placeId) {
    if (USE_MOCK) return mockApi.restorePlace(_tripId, _placeId);
    return null;
}
```

### Что делает `mockApi`
```js
export async function restorePlace(tripId, placeId) {
    const item = db.places_trash[tripId].find(p => p.id === placeId);
    const { _trash_index, ...place } = item;
    db.places[tripId].splice(_trash_index, 0, place);
    db.places_trash[tripId] = db.places_trash[tripId].filter(p => p.id !== placeId);
    saveDB(db);
    return place;
}
```

### Что происходит с реальным беком
`DELETE /api/place/delete/{id}` → физическое удаление. `restorePlace` → `null`. Место потеряно. Также нет `refetch()`.

---

## 4. `restoreNote`

### Где используется
**Страница:** `src/pages/trip/NotesPage.jsx`

```jsx
// строка 4 — импорт
import { getNotes, createNote, updateNote, deleteNote, restoreNote } from '@/api/api';

// строка 42 — локальная корзина
const [trash, setTrash] = useState([]);

// при удалении
await deleteNote(tripId, note.id);
setTrash(t => [note, ...t]);
toast('Нотатку видалено', 'info');

// строка 102 — восстановление
const restore = async (note) => {
    await restoreNote(tripId, note.id);
    setTrash(t => t.filter(x => x.id !== note.id));
    refetch();   // ← единственная страница где есть refetch после restore
    toast('Нотатку відновлено!', 'success');
};

// строка 235 — кнопка в UI
<button onClick={() => restore(n)}>Відновити</button>
```

### Что делает `api.js`
```js
export async function restoreNote(_tripId, _noteId) {
    if (USE_MOCK) return mockApi.restoreNote(_tripId, _noteId);
    return null;
}
```

### Что делает `mockApi`
```js
export async function restoreNote(tripId, noteId) {
    const item = db.notes_trash[tripId].find(n => n.id === noteId);
    const { _trash_index, ...note } = item;
    db.notes[tripId].splice(_trash_index, 0, note);
    db.notes_trash[tripId] = db.notes_trash[tripId].filter(n => n.id !== noteId);
    saveDB(db);
    return note;
}
```

### Что происходит с реальным беком
`DELETE /api/trips/note/delete/{id}` → физическое удаление. `restoreNote` → `null`. Заметка потеряна. Есть `refetch()` и `toast('Нотатку відновлено!')` — пользователь видит сообщение об успехе, хотя заметка не вернулась.

---

## 5. `restoreBooking`

### Где используется
**Страница:** `src/pages/trip/BookingPage.jsx`

```jsx
// строка 4 — импорт
import { getBookings, createBooking, updateBooking, deleteBooking, restoreBooking } from '@/api/api';

// строка 56 — локальная корзина
const [trash, setTrash] = useState([]);

// при удалении
await deleteBooking(tripId, b.id);
setTrash(t => [b, ...t]);

// строка 98 — восстановление
const restore = async (b) => {
    await restoreBooking(tripId, b.id);
    setTrash(t => t.filter(x => x.id !== b.id));
    refetch();
};

// строка 224 — кнопка в UI
<button onClick={() => restore(b)}>Відновити</button>
```

### Что делает `api.js`
```js
export async function restoreBooking(_tripId, _bookingId) {
    if (USE_MOCK) return mockApi.restoreBooking(_tripId, _bookingId);
    return null;
}
```

### Что делает `mockApi`
```js
export async function restoreBooking(tripId, bookingId) {
    const item = db.bookings_trash[tripId].find(b => b.id === bookingId);
    const { _trash_index, ...booking } = item;
    db.bookings[tripId].splice(_trash_index, 0, booking);
    db.bookings_trash[tripId] = db.bookings_trash[tripId].filter(b => b.id !== bookingId);
    saveDB(db);
    return booking;
}
```

### Что происходит с реальным беком
`DELETE /api/reservation/delete/{id}` → физическое удаление. `restoreBooking` → `null`. Бронирование потеряно.

---

## Сводная таблица

| Функция | Страница | UI-кнопка | `api.js` (реальный бек) | `mockApi` | `refetch()` после restore |
|---|---|---|---|---|---|
| `restoreTrip` | `AllTripsPage` | "↩ Відновити" | `return null` | восстанавливает из `trips_trash` | ✅ да |
| `restoreTask` | `TodoPage` | "Відновити" | `return null` | восстанавливает из `tasks_trash` | ❌ нет |
| `restorePlace` | `PlacesPage` | "Відновити" | `return null` | восстанавливает из `places_trash` | ❌ нет |
| `restoreNote` | `NotesPage` | "Відновити" | `return null` | восстанавливает из `notes_trash` | ✅ да |
| `restoreBooking` | `BookingPage` | "Відновити" | `return null` | восстанавливает из `bookings_trash` | ✅ да |

---

## Что нужно реализовать на беке

Для каждой сущности нужны два изменения:

### 1. Мягкое удаление вместо физического (`soft delete`)

Вместо `DELETE FROM ...` добавить колонку `deleted_at` или `is_deleted`:

```sql
-- вместо DELETE
UPDATE trips SET deleted_at = NOW() WHERE id = @id;

-- GET /api/content/get/trips — фильтровать
SELECT ... FROM trips WHERE users_id = @userId AND deleted_at IS NULL;
```

### 2. Новые эндпоинты восстановления

```
PATCH /api/trips/restore/{id}
PATCH /api/tasks/restore/{id}
PATCH /api/place/restore/{id}
PATCH /api/trips/note/restore/{id}
PATCH /api/reservation/restore/{id}
```

Каждый — одна строка:
```sql
UPDATE trips SET deleted_at = NULL WHERE id = @id AND users_id = @userId;
```

### 3. Подключить в `api.js`

```js
// сейчас:
export async function restoreTrip(id) {
    if (USE_MOCK) return mockApi.restoreTrip(id);
    return null;   // ← заменить на:
}

// должно быть:
export async function restoreTrip(id) {
    if (USE_MOCK) return mockApi.restoreTrip(id);
    return request('PATCH', `/api/trips/restore/${id}`);
}
```

---

## Дополнительная проблема: `TodoPage` и `PlacesPage` без `refetch()`

В `TodoPage` и `PlacesPage` функция `restore` не вызывает `refetch()` после восстановления. Даже если бек будет реализован — список на странице не обновится. Нужно добавить:

```js
// TodoPage, PlacesPage — добавить refetch()
const restore = async (item) => {
    await restoreTask(tripId, item.id);   // или restorePlace
    setTrash(t => t.filter(x => x.id !== item.id));
    refetch();   // ← добавить
};
```
