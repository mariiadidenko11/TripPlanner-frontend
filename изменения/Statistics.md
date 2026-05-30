
## 1. Импорты

**Добавлен импорт `getTrips`** из API:

```js
// Было:
import { stats } from '@/api/api';

// Стало:
import { stats, getTrips } from '@/api/api';
```

## 2. Компонент `SpendingTrend` — полный рефакторинг

### 2.1. Сигнатура пропсов

```jsx
// Было:
function SpendingTrend({ trips })

// Стало:
function SpendingTrend({ monthly })
```

Компонент больше не принимает сырой массив поездок — он получает уже подготовленные помесячные данные `[{ y, m, total }]`.

### 2.2. Новые вспомогательные функции (добавлены перед компонентом)

```js
// Округление максимума оси Y до "красивого" значения
function niceCeil(max) { ... }

// Форматирование денег: $1.5k вместо 1500
function fmtMoney(v) { ... }
```

### 2.3. Обработка пустых данных

Добавлен **empty state** — если данных нет, показывается заглушка с иконкой и подсказкой вместо пустого графика:

```jsx
if (data.length === 0) {
    return (
        <div>
            <span>📈</span>
            <p>Немає даних для відображення</p>
            <p>Додайте витрати до поїздок із датами…</p>
        </div>
    );
}
```

## 3. Компонент `BudgetDonut` — данные с бэкенда

### 3.1. Сигнатура пропсов

```jsx
// Было:
function BudgetDonut({ trips })

// Стало:
function BudgetDonut({ trips, costByType, totalSpent })
```

### 3.2. Источник данных

**Было** — захардкоженные проценты:
```js
const items = [
    { label: 'Проживання', pct: 45, color: '#40B3E0' },
    { label: 'Транспорт',  pct: 25, color: '#f59e0b' },
    { label: 'Їжа',        pct: 20, color: '#6366f1' },
    { label: 'Активності', pct: 10, color: '#22c55e' },
];
```

**Стало** — реальные данные из `cost_by_type` бэкенда:
```js
const source = (costByType || []).filter(c => (c.amount || 0) > 0);
const items = source.map((c, i) => ({
    label:  c.type || '—',
    amount: c.amount || 0,
    pct:    c.percent || 0,
    color:  palette[i % palette.length],
}));
```

Палитра расширена до 6 цветов (было 4 фиксированных).

### 3.3. Отображение суммы в легенде

В каждой строке легенды теперь выводится сумма в долларах рядом с процентом:
```
Проживання    $1,200    45%
```
Было только `45%`.

### 3.4. Empty state легенды

Если данных нет — показывается курсивная надпись `"Немає даних про витрати"` вместо пустого места.

### 3.5. Форматирование процентов

```js
const fmtPct = (p) => (Number.isInteger(p) ? p : p.toFixed(1));
```
Дробные проценты отображаются с одним знаком (`45.5%`), целые — без дроби (`45%`).

### 3.6. Стиль: `flexWrap`

Контейнер доната получил `flexWrap: 'wrap'` и легенда — `minWidth: 200` для адаптивности.

---

## 4. Основной компонент `StatisticsPage` — логика данных

### 4.1. Новый API-запрос

```js
// Добавлено:
const { data: realTrips } = useApi(() => getTrips(), []);
```

Загружаются реальные поездки (с датами `start_at`), которые нужны для построения помесячного тренда.

### 4.2. Вычисление помесячных расходов

Добавлена новая вычислимая переменная `monthlySpending`:

```js
const monthlySpending = (() => {
    // Сопоставляем поездки из статистики с реальными (по имени) → берём start_at
    // Группируем расходы по месяцам (YYYY-M)
    // Возвращаем массив { y, m, total } отсортированный по дате
})();
```

Это решает проблему: endpoint `/api/statistic/trips` не возвращает даты, поэтому даты берутся из `getTrips()` через сопоставление по названию поездки.

### 4.3. Получение ошибки

```js
// Было:
const { data: summary, loading } = useApi(...)

// Стало:
const { data: summary, loading, error } = useApi(...)
```

### 4.4. Обработка состояния ошибки (новое)

```jsx
if (error) return (
    <div>
        ⚠️ Не вдалося завантажити статистику
        // 401 → "Потрібно увійти в акаунт."
        // иначе → "Перевірте з'єднання та спробуйте ще раз."
    </div>
);
```

### 4.5. Обработка пустого состояния (новое)

```jsx
const isEmpty = (s.total_trips || 0) === 0 && trips.length === 0;
if (isEmpty) return (
    <div>
        📊 Поки що немає даних для аналітики
        Створіть подорож, додайте витрати й завдання…
    </div>
);
```

---

## 5. Передача пропсов в дочерние компоненты

### `SpendingTrend`

```jsx
// Было:
<SpendingTrend trips={trips} />

// Стало:
<SpendingTrend monthly={monthlySpending} />
```

Контейнер изменён с фиксированной высоты на flex:
```jsx
// Было:
<div style={{ height: 170, marginTop: 12 }}>

// Стало:
<div style={{ flex: 1, display: 'flex', alignItems: 'center', minHeight: 180, marginTop: 12 }}>
```

### `BudgetDonut`

```jsx
// Было:
<BudgetDonut trips={trips} />

// Стало:
<BudgetDonut trips={trips} costByType={s.cost_by_type} totalSpent={s.total_spent} />
```


