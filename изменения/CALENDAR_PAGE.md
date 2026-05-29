# CalendarPage — аудит даних

## Ендпоінти

| Дія | Метод | Ендпоінт | Хто викликає |
|---|---|---|---|
| Бронювання | GET | `/api/content/get/reservation/{tripId}` | `getBookings()` → CalendarPage |
| Дані трипа | GET | `/api/content/get/trips` → фільтр по id | `getTrip()` → TripLayout → context |

CalendarPage напряму викликає лише `getBookings(tripId)`. `trip` приходить з `useOutletContext()`.

---

## Дані з контексту

```js
const { tripId, trip, refetchTrip } = useOutletContext();
```
З `trip` використовується: `start_at`, `end_at` (підсвічування діапазону днів).

---

## Нормалізація бронювань (`_normalizeBooking`)

| Backend (`ShowReservationDTO`) | Frontend | Використання |
|---|---|---|
| `id` | `id` | ключ |
| `name` | `name` | заголовок |
| `cost` | `cost` | модалка |
| `reservationType` | `type` | колір/іконка |
| `address` | `address` | підзаголовок |
| `note` | `note` | примітка |
| `startTime` | `start_at` | дата події |
| `endTime` | `end_at` | не використовується |


