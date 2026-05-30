# OverviewPage — об'єднання «Деталі» + «Опис» в одну картку


### Редагування
- БУЛО: два окремі режими (`editing` для деталей + `isEditingDesc` для опису)
  і ДВА окремі запити `updateTrip` (`saveEdit` і `handleSaveDesc`).
- СТАЛО: один режим `editing`. Кнопка «Редагувати» відкриває редагування і деталей,
  і опису разом. Опис тепер у `draft.description` (textarea).
- Збереження — ОДИН запит `saveEdit` → `updateTrip(...)`, що містить усі поля разом
  з `description`.

### Видалено
- Стан `isEditingDesc`, `descDraft`, `descSaving`.
- Функції `handleStartEditDesc`, `handleCancelDesc`, `handleSaveDesc`.
- Окрему картку опису.
- (У `saveEdit` опис тепер береться з `draft.description`, а не з `trip.description`.)

### Додано CSS
- `.ov-desc-section` (перегляд), `.ov-desc-edit` (редагування), `.ov-desc-heading`.

## Backend
- Endpoint НЕ змінювався: `PUT /api/trips/edit` (через `updateTrip` в api.js).
- Запит містить: `name, description, startDate, endDate, cities, startMoney` —
  усе одним викликом, як і реалізовано на backend (`EditTripModel`).
- Нових API не створювалось.

## Відповідність полів frontend ↔ backend
- `location` → `cities[]` (бек приймає масив міст).
- `start_at/end_at` → `startDate/endDate`.
- `start_money` → `startMoney`.
- `description` → `description` (є в `EditTripModel` і в `MainTripsDTO`).
- Усі поля існують на backend. Розбіжностей немає.
