# CalendarPage — Технічна специфікація бекенду

> Дата: 30.05.2026

---

## 1. Загальний опис

`CalendarPage` — глобальний календар застосунку. Відображає всі подорожі користувача у вигляді кольорових діапазонів та всі бронювання у вигляді чіпів на відповідних днях.

**Що відображається:**

- **Подорожі** — суцільна смуга від `startDate` до `endDate` включно. Клік → `/trips/{id}/overview`
- **Бронювання** — кольоровий чіп з іконкою категорії на день `startTime`. Клік → `/trips/{tripId}/booking`

---

## 2. API-ендпоінти

Нових маршрутів не потрібно. Фронтенд використовує два існуючих.

| Метод | URL | Опис | Доступ |
|-------|-----|------|--------|
| `GET` | `/api/content/get/trips` | Всі подорожі поточного користувача | Авторизований |
| `GET` | `/api/content/get/reservation/{id}` | Всі бронювання для поїздки з `id` | Авторизований, власник поїздки |

### 2.1. GET /api/content/get/trips

Фронтенд (з `api.js`):

```js
const { data: tripsData } = useApi(() => getTrips(), []);
```

Запит виконується один раз при монтуванні. Всі поїздки повертаються без фільтрації по даті — фільтрація відбувається на фронтенді при рендері місяця.

### 2.2. GET /api/content/get/reservation/{id}

Фронтенд:

```js
Promise.all(trips.map(t => getBookings(t.id)))
```

Для кожної поїздки зі списку фронтенд паралельно завантажує бронювання. Якщо запит для конкретної поїздки зазнає помилки — вона ігнорується (`catch(() => [])`), решта відображаються.

> ⚠️ **Продуктивність:** при 20+ поїздках виконується 20+ паралельних запитів. Рекомендується розглянути зведений ендпоінт (деталі в розділі 6).

---

## 3. Структури даних (DTO)

### 3.1. GetTripsDTO — відповідь `/api/content/get/trips`

| Поле DTO (C#) | Тип | JSON ключ | Опис |
|---------------|-----|-----------|------|
| `Id` | `int` | `id` | Унікальний ідентифікатор поїздки |
| `Name` | `string` | `name` | Назва поїздки |
| `Description` | `string` | `description` | Опис (може бути null) |
| `Cities` | `string[]` | `cities` | Масив міст маршруту |
| `StartDate` | `DateTime` | `startDate` | Дата початку (ISO 8601). Потрібна для побудови діапазону днів |
| `EndDate` | `DateTime` | `endDate` | Дата кінця (ISO 8601). Кінець діапазону |
| `CreatedAt` | `DateTime` | `createdAt` | Дата створення |
| `Rate` | `int` | `rate` | Рейтинг 0–10. Фронтенд конвертує у 0–5 зірок |
| `StartMoney` | `int` | `startMoney` | Плановий бюджет |
| `Status` | `string` | `status` | ❌ **ВІДСУТНЄ.** Потрібно додати: `"active"` / `"waiting"` / `"completed"` |
| `FactMoney` | `int` | `factMoney` | ❌ **ВІДСУТНЄ.** Потрібно додати: фактично витрачена сума |

### 3.2. ShowReservationDTO — відповідь `/api/content/get/reservation/{id}`

| Поле DTO (C#) | Тип | JSON ключ | Опис |
|---------------|-----|-----------|------|
| `Id` | `int` | `id` | Унікальний ідентифікатор бронювання |
| `Name` | `string` | `name` | Назва (готель, рейс, ресторан тощо) |
| `Cost` | `int` | `cost` | Вартість у базовій валюті |
| `ReservationType` | `string` | `reservationType` | Категорія бронювання (значення — в розділі 4.2) |
| `Address` | `string` | `address` | Адреса або місце (може бути null) |
| `Note` | `string` | `note` | Додаткова нотатка (може бути null) |
| `StartTime` | `DateTimeOffset` | `startTime` | Дата та час початку. Визначає день на календарі |
| `EndTime` | `DateTimeOffset` | `endTime` | Дата та час закінчення |
| `CreatedAt` | `DateTimeOffset` | `createdAt` | Дата створення запису |

---

## 4. Логіка відображення та залежності від даних

### 4.1. Кольори подорожей

Колір смуги на календарі залежить від поля `status`:

| Значення `status` | Колір | Примітка |
|-------------------|-------|----------|
| `"active"` | `#22C55E` (зелений) | Завжди зелений, незалежно від `id` |
| `"waiting"` | `hsl(hash(id) % 360, 62%, 58%)` | Унікальний детермінований відтінок |
| `"completed"` | `hsl(hash(id) % 360, 62%, 58%)` | Той самий детермінований відтінок |

> Без поля `status` фронтенд присвоює всім поїздкам статус `"completed"` — активна поїздка не виділяється зеленим.

### 4.2. Категорії бронювань (ReservationType)

Фронтенд маппить `reservationType` на іконку та колір чіпа:

| Значення `ReservationType` | Іконка | Колір |
|----------------------------|--------|-------|
| `"Готель"` / `"Проживання"` / `"accommodation"` | 🏨 | `#8B5CF6` |
| `"Літак"` / `"Транспорт"` / `"transport"` | ✈️ | `#0EA5E9` |
| `"Харчування"` / `"food"` | 🍽️ | `#F97316` |
| `"Дозвілля"` / `"leisure"` | 🎭 | `#EC4899` |
| `"Шопінг"` / `"shopping"` | 🛍️ | `#EF4444` |
| `"Інше"` / `"other"` (fallback) | 📌 | `#9CA3AF` |

> Якщо значення не збігається з жодним з наведених — застосовується fallback `📌 #8B5CF6`.

### 4.3. Формат дат

Фронтенд парсить дати через `new Date(value)`, тому потрібен **ISO 8601**.

```
2025-07-14T00:00:00Z            // для startDate / endDate поїздок
2025-07-14T14:30:00+02:00       // для startTime / endTime бронювань
```

Якщо `startTime = null` — бронювання **не відображається** на календарі.

---

## 5. Відсутні поля — що потрібно додати

### 5.1. Поле `Status` у GetTripsDTO

**C# — додати в клас та конструктор:**

```csharp
public string Status { get; set; }  // "active" | "waiting" | "completed"
```

**SQL — варіант з обчисленням на льоту:**

```sql
CASE
    WHEN t.end_date < NOW()     THEN 'completed'
    WHEN t.start_date <= NOW()  THEN 'active'
    ELSE 'waiting'
END AS status
```

Або зберігати статус явно у колонці таблиці `trips` та повертати напряму.

---

### 5.2. Поле `FactMoney` у GetTripsDTO

**C# — додати в клас:**

```csharp
public int FactMoney { get; set; }  // sum of all reservation costs for this trip
```

**SQL — підрахунок через агрегацію бронювань:**

```sql
COALESCE(
    (SELECT SUM(cost) FROM reservations WHERE trip_id = t.id),
    0
) AS fact_money
```

---

## 6. Опціональне покращення (рекомендація)

### Зведений ендпоінт для всіх бронювань

Поточна реалізація виконує **N паралельних запитів** (по одному на кожну поїздку). Для оптимізації:

```
GET /api/content/get/all-reservations
```

Відповідь: масив всіх бронювань поточного користувача з `tripId` у кожному елементі.

**Додати поле у ShowReservationDTO:**

```csharp
public int TripId { get; set; }  // для grouping на фронтенді
```

Це скоротить кількість HTTP-запитів з **N → 1**.

---

## 7. Приклади відповідей

### 7.1. GET /api/content/get/trips

```json
[
  {
    "id": 42,
    "name": "Барселона 2025",
    "description": "Влітку в Іспанію",
    "cities": ["Барселона", "Мадрид"],
    "startDate": "2025-07-10T00:00:00Z",
    "endDate":   "2025-07-20T00:00:00Z",
    "createdAt": "2025-03-01T12:00:00Z",
    "rate": 8,
    "startMoney": 3000,
    "status": "waiting",
    "factMoney": 1450
  }
]
```

### 7.2. GET /api/content/get/reservation/42

```json
[
  {
    "id": 101,
    "name": "Готель Arts Barcelona",
    "cost": 850,
    "reservationType": "Готель",
    "address": "Carrer de la Marina, 19-21",
    "note": "Сніданок включено",
    "startTime": "2025-07-10T15:00:00+02:00",
    "endTime":   "2025-07-20T11:00:00+02:00",
    "createdAt": "2025-03-15T09:30:00Z"
  }
]
```

---

## 8. Чекліст для розробника

- [ ] `GET /api/content/get/trips` повертає `startDate` та `endDate` у ISO 8601
- [ ] Додати поле `status` до `GetTripsDTO` (`"active"` / `"waiting"` / `"completed"`)
- [ ] Додати поле `factMoney` до `GetTripsDTO` (сума витрат з бронювань)
- [ ] `GET /api/content/get/reservation/{id}` повертає `startTime` у ISO 8601
- [ ] `reservationType` збігається з одним із значень таблиці в розділі 4.2
- [ ] (Опціонально) Реалізувати `GET /api/content/get/all-reservations` для оптимізації
