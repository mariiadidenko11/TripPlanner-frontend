# AddTripPage — API & поле `description`

## Поле `description` у формі

`<textarea>` у формі, необов'язкове. Зберігається у стані `form.description`, передається до `createTrip`.


## createTrip

**Виклик зі сторінки:**
```js
const trip = await createTrip({
  name: form.name.trim(),
  description: form.description.trim(),   // ← нове поле
  start_at: new Date(form.start_at).toISOString(),
  end_at: new Date(form.end_at).toISOString(),
  start_money: parseInt(form.start_money) || 0,
  cities: form.cityName.trim() ? [form.cityName.trim()] : [],
  fact_money: 0,
  status: 'waiting',
  rate: 0,
});
```

**Ендпоінт:** `POST /api/trips/add`

**Тіло запиту**

{
  "name": "string",
  "description": "string",
  "startDate": "ISO string",
  "endDate": "ISO string",
  "cities": ["string"],
  "startMoney": 0
}
```

> Поле `description` передається без змін. Нормалізатор `_normalizeTrip` на беку читає `t.description ?? ''`.

---

## createCity (опціонально, якщо заповнено cityName)

**Ендпоінт:** `POST /api/trips/city/add` *(mock only — реальний виклик повертає `null`)*

```js
await createCity({ trips_id: trip.id, name: form.cityName.trim() });
```

---

## Нормалізація трипа (`_normalizeTrip`)

```js
{
  id: String(t.id),
  name: t.name ?? '',
  description: t.description ?? '',   // ← поле присутнє
  cities: t.cities ?? [],
  start_at: t.startDate ?? null,
  end_at: t.endDate ?? null,
  start_money: t.startMoney ?? 0,
  fact_money: t.factMoney ?? 0,
  status: STATUS_MAP[rawStatus] ?? 'waiting',
  rate: (t.rate ?? 0) / 2,
}
```

---

## Де використовуються трипи після створення

| Функція | Метод | Ендпоінт |
|---|---|---|
| `getTrips` | GET | `/api/content/get/trips` |
| `getTrip(id)` | GET | `/api/content/get/trips` (фільтрує по id) |
| `updateTrip(id, fields)` | PUT | `/api/trips/edit` — також включає `description` |
| `deleteTrip(id)` | DELETE | `/api/trips/drop/{id}` |

`updateTrip` теж передає `description`:
```json
{ "id": 1, "name": "...", "description": "...", ... }
```






# OverviewPage — «Опис подорожі»

## Дані (читання)

`trip?.description` — приходить через `useOutletContext()` з `TripLayout`:
- `getTrip(tripId)` → `_normalizeTrip` → `description: t.description ?? ''`
- Ендпоінт: `GET /api/content/get/trips` (фільтр по id)

---

## Збереження

`PUT /api/trips/edit` через `updateTrip`. Окремого ендпоінту для опису немає.
Передаються всі поля трипа (інакше обнуляться).

---

## Стан

```js
const [isEditingDesc, setIsEditingDesc] = useState(false);
const [descDraft, setDescDraft]         = useState('');
const [descSaving, setDescSaving]       = useState(false);
```

---

## Функції

```js
// Відкрити редагування
const handleStartEditDesc = () => {
    setDescDraft(trip?.description || '');
    setIsEditingDesc(true);
};

// Скасувати
const handleCancelDesc = () => setIsEditingDesc(false);

// Зберегти
const handleSaveDesc = async () => {
    setDescSaving(true);
    try {
        await updateTrip(tripId, {
            location:     trip?.location || '',
            start_at:     trip?.start_at || '',
            end_at:       trip?.end_at || '',
            status:       trip?.status || 'active',
            start_money:  trip?.start_money ?? trip?.budget ?? 0,
            description:  descDraft,
        });
        if (typeof refetchTrip === 'function') refetchTrip();
        setIsEditingDesc(false);
    } catch (e) {
        console.error(e);
    } finally {
        setDescSaving(false);
    }
};

## Ендпоінти

| Дія | Ендпоінт | Поле на беку |
|---|---|---|
| Читання | `GET /api/content/get/trips` | `MainTripsDTO.Description` |
| Збереження | `PUT /api/trips/edit` | `EditTripModel.Description` |
