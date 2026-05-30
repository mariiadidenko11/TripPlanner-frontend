import { CONFIG } from './config.js';
import * as mockApi from './mockApi.js';

// ── Конвертація рейтингу: backend 0–10 (ціле) ↔ UI 0–5 (крок 0.5) ──
const RATE_FACTOR = 2; // 10 / 5
function toStars(backendValue) {
    const v = Math.min(Math.max(Number(backendValue) || 0, 0), 10);
    return Math.round((v / RATE_FACTOR) * 2) / 2; // до півзірки
}
function toBackend(stars) {
    const s = Math.min(Math.max(Number(stars) || 0, 0), 5);
    return Math.round(s * RATE_FACTOR); // 4.5★ → 9, 5★ → 10
}

// Set to false to use the real backend (cookie-based auth, same origin / proxy).
export const USE_MOCK = true;

async function request(method, path, body = null) {
    const init = {
        method,
        // Auth relies entirely on the HttpOnly "token" cookie set by the backend.
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (body !== null) init.body = JSON.stringify(body);

    const res = await fetch(`${CONFIG.API_BASE}${path}`, init);
    if (res.status === 204) return null;

    let json;
    try { json = await res.json(); } catch { json = null; }

    if (!res.ok) {
        const err = new Error(json?.message || `HTTP ${res.status}`);
        err.status = res.status;
        err.response = json;
        throw err;
    }
    return json;
}

const STATUS_MAP = {
    'active': 'active',
    'waiting': 'waiting',
    'completed': 'completed',
    'archive': 'completed',
    'deleted': 'waiting',
};

function _normalizeUser(u) {
    return {
        id: String(u.id),
        firstname: u.firstName ?? u.firstname ?? '',
        lastname: u.lastName ?? u.lastname ?? '',
        name: u.name ?? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim(),
        email: u.email ?? '',
        description: u.description ?? '',
        created_at: u.createdAt ?? null,
    };
}

function _normalizeTrip(t) {
    const rawStatus = (t.status ?? '').toLowerCase();
    return {
        id: String(t.id),
        name: t.name ?? '',
        description: t.description ?? '',
        cities: t.cities ?? [],
        location: (t.cities ?? []).join(', '),
        start_at: t.startDate ?? null,
        end_at: t.endDate ?? null,
        created_at: t.createdAt ?? null,
        rate: toStars(t.rate), // backend 0-10 -> UI 0-5 (центр. конвертація)
        start_money: t.startMoney ?? 0,
        fact_money: t.factMoney ?? t.fact_money ?? 0,
        status: STATUS_MAP[rawStatus] ?? 'waiting',
    };
}

function _normalizeTask(t) {
    return {
        id: t.id,
        value: t.value ?? '',
        note: t.note ?? '',
        check: t.checked ?? false,
        done: t.checked ?? false,
        created_at: t.createdAt ?? null,
    };
}

function _normalizePlace(p) {
    return {
        id: p.id,
        name: p.name ?? '',
        check: p.checked ?? false,
        visited: p.checked ?? false,
       
        // backend returns notes attached to the place
        notes: (p.notes ?? []).map((n, i) => ({
            id: i,
            note: n.value ?? '',
            created_at: n.createdAt ?? null,
        })),
        created_at: p.createdAt ?? null,
    };
}

function _normalizeNote(n) {
    return {
        id: n.id,
        value: n.note ?? '',
        check: false,
        created_at: n.createdAt ?? null,
    };
}

function _normalizeBooking(r) {
    return {
        id: r.id,
        name: r.name ?? '',
        cost: r.cost ?? 0,
        type: r.reservationType ?? r.type ?? 'other',
        address: r.address ?? '',
        note: r.note ?? '',
        start_at: r.startTime ?? r.start_at ?? null,
        end_at: r.endTime ?? r.end_at ?? null,
        created_at: r.createdAt ?? null,
    };
}

// Cost field on backend is "moneyСost" (note: the C is Cyrillic in the DTO).
// We read both spellings defensively.
function _costVal(c) {
    if (c == null) return 0;
    const direct = c['moneyСost'] ?? c.moneyCost ?? c.cost ?? c.amount;
    if (direct != null) return Number(direct) || 0;
    // запасний варіант: будь-який ключ, що містить "cost" (кирилична/латинська C)
    for (const k of Object.keys(c)) {
        if (/c\u043est|cost/i.test(k) || k.toLowerCase().includes('cost')) {
            const v = Number(c[k]);
            if (!isNaN(v)) return v;
        }
    }
    return 0;
}

function _normalizeStats(s, tripsStats = []) {
    // Per-trip rich data comes from /api/statistic/trips (MainTripsStatisticDTO[]).
    const trips_comparison = (tripsStats ?? []).map(t => {
        const tasksTotal = t.countTask ?? 0;
        const tasksDone = t.completedTask ?? 0;
        const placesTotal = t.countPlace ?? 0;
        const placesVisited = t.completedPlace ?? 0;
        return {
            title: t.name ?? '',
            name: t.name ?? '',
            days: parseInt(t.days) || 0,
            status: 'completed',
            start_at: null,
            rate: toStars(t.rate),
            city: (t.cities ?? []).join(', '),
            budget: t.money ?? 0,
            spent: t.cost ?? 0,
            remaining: Math.max((t.money ?? 0) - (t.cost ?? 0), 0),
            tasks_done: tasksDone,
            tasks_total: tasksTotal,
            tasks_percentage: tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 0,
            places_visited: placesVisited,
            places_total: placesTotal,
        };
    });

    // Backend (GetCostForStatistic) повертає СУМУ витрат по кожному типу (moneyСost),
    // а НЕ відсоток. Тому відсоток рахуємо самі від суми всіх категорій.
    const costRaw = s.costForStatistic ?? [];
    const costTotal = costRaw.reduce((sum, c) => sum + _costVal(c), 0);
    const cost_by_type = costRaw.map(c => {
        const amount = _costVal(c);               // реальна сума витрат по категорії
        const percent = costTotal > 0 ? (amount / costTotal) * 100 : 0;
        return {
            type: c.type ?? '',
            amount,
            percent,                              // 0..100, сума всіх = 100%
        };
    });

    return {
        total_budget: s.money ?? 0,
        total_spent: s.cost ?? 0,
        total_remaining: Math.max((s.money ?? 0) - (s.cost ?? 0), 0),
        total_trips: s.tripsCount ?? 0,
        cities_visited: s.cityCount ?? 0,
        countries_visited: s.cityCount ?? 0,
        places_visited_total: s.completePlaceCount ?? 0,
        places_total_total: s.placeCount ?? 0,
        avg_rate: toStars(s.rate), // backend 0-10 (float avg) -> UI 0-5
        rated_trips: s.rateCount ?? 0,
        tasks_done_total: s.completedTaskCount ?? 0,
        tasks_total_total: s.taskCount ?? 0,
        most_expensive_trip: s.nameMaxCost
            ? { title: s.nameMaxCost, spent: s.maxCost ?? 0 }
            : null,
        trips_comparison,
        cost_by_type,
        rating_distribution: cost_by_type.map((c, i) => ({
            star: i + 1,
            count: c.percent,
            label: c.type,
        })),
    };
}


// --- Auth ---
// Backend sets an HttpOnly cookie on login. The response body is only
// { status: bool, message: string } — there is no token to store.

export async function register(params) {
    if (USE_MOCK) {
        const data = await mockApi.register(params);
        if (data?.user) localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(data.user));
        return data;
    }
    return request('POST', '/api/auth/register', {
        firstName: params.firstname ?? params.firstName,
        lastName: params.lastname ?? params.lastName,
        email: params.email,
        password: params.password,
    });
}

export async function login(params) {
    if (USE_MOCK) {
        const data = await mockApi.login(params);
        if (data?.user) localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(data.user));
        return data;
    }
    return request('POST', '/api/auth/login', {
        email: params.email,
        password: params.password,
    });
}

export async function logout() {
    if (USE_MOCK) return mockApi.logout();
    return request('GET', '/api/auth/logout');
}

export async function forgotPassword(params) {
    if (USE_MOCK) {
        const email = typeof params === 'string' ? params : params.email;
        return mockApi.forgotPassword(email);
    }
    const email = typeof params === 'string' ? params : params.email;
    return request('POST', '/api/auth/recovery/response', {
        value: email,
        type: 'email',
    });
}

export async function getAuthMe() {
    if (USE_MOCK) return mockApi.getAuthMe();
    const data = await request('GET', '/api/user/get/information');
    return _normalizeUser(data);
}


export async function updateUser(fields) {
    if (USE_MOCK) {
        const user = await mockApi.updateUser(fields);
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
        return user;
    }
    return request('PUT', '/api/user/settings/basic', {
        firstName: fields.firstname ?? fields.firstName,
        lastName: fields.lastname ?? fields.lastName,
        description: fields.description ?? '',
    });
}

export async function changePassword(params) {
    if (USE_MOCK) return mockApi.changePassword(params);
    return request('PATCH', '/api/user/settings/password', {
        oldPassword: params.old_password ?? params.oldPassword,
        newPassword: params.new_password ?? params.newPassword,
    });
}


export async function getTrips(params) {
    if (USE_MOCK) {
        const list = await mockApi.getTrips(params);
        // Узгоджуємо мок із реальним беком: rate завжди у шкалі зірок (0–5)
        return (list ?? []).map(t => ({ ...t, rate: toStars(t.rate) }));
    }
    const list = await request('GET', '/api/content/get/trips');
    return (list ?? []).map(_normalizeTrip);
}

export async function getTrip(id) {
    if (USE_MOCK) {
        const t = await mockApi.getTrip(id);
        return t ? { ...t, rate: toStars(t.rate) } : null;
    }
    const list = await request('GET', '/api/content/get/trips');
    const trip = (list ?? []).find(t => String(t.id) === String(id));
    return trip ? _normalizeTrip(trip) : null;
}


export async function createTrip(body) {
    if (USE_MOCK) return mockApi.createTrip(body);
    return request('POST', '/api/trips/add', {
        name: body.name,
        description: body.description ?? '',
        startDate: body.start_at ?? body.startDate ?? null,
        endDate: body.end_at ?? body.endDate ?? null,
        cities: body.cities ?? (body.cityName ? [body.cityName] : []),
        startMoney: body.start_money ?? body.startMoney ?? 0,
    });
}

export async function updateTrip(id, fields) {
    if (USE_MOCK) return mockApi.updateTrip(id, fields);
    return request('PUT', '/api/trips/edit', {
        id: Number(id),
        name: fields.name ?? '',
        description: fields.description ?? '',
        startDate: fields.start_at ?? fields.startDate ?? null,
        endDate: fields.end_at ?? fields.endDate ?? null,
        cities: fields.cities ?? (fields.location ? [fields.location] : []),
        startMoney: fields.start_money ?? fields.startMoney ?? 0,
    });
}

export async function deleteTrip(id) {
    if (USE_MOCK) return mockApi.deleteTrip(id);
    return request('DELETE', `/api/trips/drop/${id}`);
}

export async function setTripRate(id, rate) {
    // rate приходить у шкалі зірок (0–5, можливо .5) -> у backend 0–10
    if (USE_MOCK) return mockApi.updateTrip(id, { rate: toBackend(rate) });
    return request('PATCH', '/api/trip/rate/set', { id: Number(id), rate: toBackend(rate) });
}

export async function restoreTrip(id) {
    if (USE_MOCK) return mockApi.restoreTrip(id);
    return null;
}

export async function createCity(body) {
    if (USE_MOCK) return mockApi.createCity(body);
    return null;
}

export async function getTasks(tripId) {
    if (USE_MOCK) return mockApi.getTasks(tripId);
    const list = await request('GET', `/api/content/get/task/${tripId}`);
    return (list ?? []).map(_normalizeTask);
}

export async function createTask(tripId, body) {
    if (USE_MOCK) return mockApi.createTask(tripId, body);
    return request('POST', '/api/tasks/add', {
        id: Number(tripId),
        value: body.value,
        note: body.note ?? '',
    });
}

export async function updateTask(tripId, taskId, body) {
    if (USE_MOCK) return mockApi.updateTask(tripId, taskId, body);
    if ('done' in body || 'check' in body) {
        return request('PATCH', '/api/tasks/check', {
            id: Number(taskId),
            check: body.check ?? body.done,
        });
    }
    return request('PUT', '/api/tasks/edit', {
        id: Number(taskId),
        value: body.value ?? '',
        note: body.note ?? '',
    });
}

export async function deleteTask(tripId, taskId) {
    if (USE_MOCK) return mockApi.deleteTask(tripId, taskId);
    return request('DELETE', `/api/tasks/delete/${taskId}`);
}

export async function restoreTask(_tripId, _taskId) {
    if (USE_MOCK) return mockApi.restoreTask(_tripId, _taskId);
    return null;
}

export async function getPlaces(tripId) {
    if (USE_MOCK) return mockApi.getPlaces(tripId);
    const list = await request('GET', `/api/content/get/place/${tripId}`);
    return (list ?? []).map(_normalizePlace);
}

export async function createPlace(tripId, body) {
    if (USE_MOCK) return mockApi.createPlace(tripId, body);
    return request('POST', '/api/place/add', {
        id: Number(tripId),
        name: body.name,
    });
}

export async function updatePlace(tripId, placeId, body) {
    if (USE_MOCK) return mockApi.updatePlace(tripId, placeId, body);
    if ('done' in body || 'check' in body || 'visited' in body) {
        return request('PATCH', '/api/place/check', {
            placeId: Number(placeId),
            check: body.check ?? body.done ?? body.visited,
        });
    }
    return request('PUT', '/api/place/edit', {
        placeId: Number(placeId),
        name: body.name ?? '',
    });
}

export async function deletePlace(tripId, placeId) {
    if (USE_MOCK) return mockApi.deletePlace(tripId, placeId);
    return request('DELETE', `/api/place/delete/${placeId}`);
}

export async function restorePlace(_tripId, _placeId) {
    if (USE_MOCK) return mockApi.restorePlace(_tripId, _placeId);
    return null;
}

// Notes attached to a specific place (backend: /api/place/note)
export async function createPlaceNote(placeId, value) {
    if (USE_MOCK) return null;
    return request('POST', '/api/place/note/add', {
        id: Number(placeId),
        value,
    });
}

export async function updatePlaceNote(noteId, value) {
    if (USE_MOCK) return null;
    return request('PUT', '/api/place/note/edit', {
        id: Number(noteId),
        value,
    });
}

export async function deletePlaceNote(noteId) {
    if (USE_MOCK) return null;
    return request('DELETE', `/api/place/note/delete/${noteId}`);
}

// Trip-level notes (backend: /api/trips/note)
export async function getNotes(tripId) {
    if (USE_MOCK) return mockApi.getNotes(tripId);
    const list = await request('GET', `/api/content/get/note/${tripId}`);
    return (list ?? []).map(_normalizeNote);
}

export async function createNote(tripId, body) {
    if (USE_MOCK) return mockApi.createNote(tripId, body);
    return request('POST', '/api/trips/note/add', {
        id: Number(tripId),
        value: body.value,
    });
}

export async function updateNote(tripId, noteId, body) {
    if (USE_MOCK) return mockApi.updateNote(tripId, noteId, body);
    return request('PUT', '/api/trips/note/edit', {
        id: Number(noteId),
        value: body.value,
    });
}

export async function deleteNote(tripId, noteId) {
    if (USE_MOCK) return mockApi.deleteNote(tripId, noteId);
    return request('DELETE', `/api/trips/note/delete/${noteId}`);
}

export async function restoreNote(_tripId, _noteId) {
    if (USE_MOCK) return mockApi.restoreNote(_tripId, _noteId);
    return null;
}


export async function getBookings(tripId) {
    if (USE_MOCK) return mockApi.getBookings(tripId);
    const list = await request('GET', `/api/content/get/reservation/${tripId}`);
    return (list ?? []).map(_normalizeBooking);
}

export async function createBooking(tripId, body) {
    if (USE_MOCK) return mockApi.createBooking(tripId, body);
    return request('POST', '/api/reservation/add', {
        id: Number(tripId),
        name: body.name,
        cost: body.cost ?? 0,
        type: body.type ?? 'other',
        address: body.address ?? '',
        note: body.note ?? '',
        startTime: body.start_at ?? null,
        endTime: body.end_at ?? null,
    });
}

export async function updateBooking(tripId, bookingId, body) {
    if (USE_MOCK) return mockApi.updateBooking(tripId, bookingId, body);
    return request('PUT', '/api/reservation/edit', {
        id: Number(bookingId),
        name: body.name ?? '',
        cost: body.cost ?? 0,
        type: body.type ?? 'other',
        address: body.address ?? '',
        note: body.note ?? '',
        startTime: body.start_at ?? null,
        endTime: body.end_at ?? null,
    });
}

export async function deleteBooking(tripId, bookingId) {
    if (USE_MOCK) return mockApi.deleteBooking(tripId, bookingId);
    return request('DELETE', `/api/reservation/delete/${bookingId}`);
}

export async function restoreBooking(_tripId, _bookingId) {
    if (USE_MOCK) return mockApi.restoreBooking(_tripId, _bookingId);
    return null;
}


export const stats = {
    summary: async (period) => {
        if (USE_MOCK) {
            const s = await mockApi.stats.summary(period);
            // Узгоджуємо мок зі шкалою зірок (0–5)
            return {
                ...s,
                avg_rate: toStars(s.avg_rate),
                trips_comparison: (s.trips_comparison ?? []).map(t => ({ ...t, rate: toStars(t.rate) })),
            };
        }
        const [main, trips] = await Promise.all([
            request('GET', '/api/statistic/main'),
            request('GET', '/api/statistic/trips').catch(() => []),
        ]);
        return _normalizeStats(main, trips ?? []);
    },
};
