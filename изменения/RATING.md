#  конвертація вбудована в `api.js`.

## Змінені файли (3)

### 1. src/api/api.js
- ДОДАНО (замість import з rating.js) дві функції:
  - `toStars(v)`  — 0–10 → 0–5 (крок 0.5)
  - `toBackend(s)` — 0–5 → 0–10 ціле (4.5★→9, 5★→10), з clamp.

  - `_normalizeTrip`: `rate: (t.rate??0)/2`  →  `rate: toStars(t.rate)`
  - `_normalizeStats` trips_comparison: `(t.rate??0)/2` → `toStars(t.rate)`
  - `_normalizeStats` avg: `avg_rate:(s.rate??0)/2` → `avg_rate: toStars(s.rate)`
  - `setTripRate`: `rate: rate*2` (mock і real) → `rate: toBackend(rate)`
- ДОДАНО узгодження mock зі шкалою UI (раніше mock віддавав сирі 0–10):
  - `getTrips` / `getTrip` (mock): rate → `toStars(...)`
  - `stats.summary` (mock): `avg_rate` та `trips_comparison[].rate` → `toStars(...)`
- Endpoints не змінювались.

### 2. src/layouts/TripLayout.jsx
- Прибрано import UI_MAX (тепер просто 5).
- БУЛО: 5 цілих зірок, клік = ціла, `Math.round(trip.rate)`.
- СТАЛО: віджет із ПІВЗІРКАМИ — кожна зірка має 2 клікабельні половини
  (ліва = .5, права = ціла). Залив півзірки через `::before` (overflow 50%).
- `handleRate(value)` приймає 0–5 (з .5); конвертація в 0–10 — у `setTripRate`.
- ДОДАНО CSS: `.rating-card__star`, `--half`, `__hit--left/right`.

### 3. src/pages/app/StatisticsPage.jsx
- Прибрано import UI_MAX (тепер 5).
- ДОДАНО компонент `<Stars value={0..5} />` з підтримкою півзірки.
- БУЛО: `'★'.repeat(Math.round(t.rate))` (без півзірки).
- СТАЛО: `<Stars value={t.rate} />`.
- ДОДАНО CSS: `.sp-star--full/half/empty`.
- Середній рейтинг `avgRate.toFixed(1)/5` — без змін (вже шкала 0–5).

## Видалено
- Розрізнена логіка /2, *2, Math.round(rate) по проекту — більше немає.
- Файл rating.js не створюється.
