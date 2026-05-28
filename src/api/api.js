import { CONFIG } from './config.js';
import * as mockApi from './mockApi.js';

// false  (http://localhost:5011)

export const USE_MOCK = false;

async function request(method, path, body = null) {
    const init = {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
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
    'будущее': 'waiting',
    'идёт': 'active',
    'прошлое': 'completed',
};

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
        rate: t.rate ?? 0,
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
        is_favourite: false,
        created_at: p.createdAt ?? null,
        notes: (p.notes ?? []).map((n, i) => ({
            
            id: i,
            note: n.value ?? '',
            created_at: n.createdAt ?? null,
        })),
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
        note: r.note ?? '',
        address: r.address ?? '',
        type_id: r.reservationType ?? 'other',  // рядок-ключ, не число
        start_at: r.startTime ?? null,
        end_at: r.endTime ?? null,
        created_at: r.createdAt ?? null,
    };
}
function _normalizeUser(u) {
    return {
        id: String(u.id),
        data_id: String(u.id),
        firstname: u.firstName ?? '',
        lastname: u.lastName ?? '',
        email: u.email ?? '',
        description: u.description ?? '',
        created_at: u.createdAt ?? null,
    };
}
function _normalizeStats(s) {
    const trips_comparison = (s.startAndEndTrip ?? []).map(t => ({
        title: t.name ?? '',
        name: t.name ?? '',
        days: parseInt(t.days) || 0,
        status: 'completed',
        start_at: null,
        rate: 0,
        city: '',
        budget: 0,
        spent: 0,
        remaining: 0,
        tasks_done: 0,
        tasks_total: 0,
        tasks_percentage: 0,
        places_visited: 0,
        places_total: 0,
    }));

    const costRaw = s.costForStatistic ?? [];
    const totalCost = costRaw.reduce((acc, c) => acc + (c.moneyСost ?? 0), 0);
    const looksLikePercent = totalCost <= 100 && costRaw.length > 0;

    const cost_by_type = costRaw.map(c => ({
        type: c.type ?? '',
        
        percent: looksLikePercent
            ? (c.moneyСost ?? 0)
            : (s.cost > 0 ? Math.round(((c.moneyСost ?? 0) / s.cost) * 100) : 0),
        amount: looksLikePercent
            ? Math.round(((c.moneyСost ?? 0) / 100) * (s.cost ?? 0))
            : (c.moneyСost ?? 0),
    }));

    return {
        total_budget: s.money ?? 0,
        total_spent: s.cost ?? 0,
        total_remaining: Math.max((s.money ?? 0) - (s.cost ?? 0), 0),
        total_trips: s.tripsCount ?? 0,
        cities_visited: s.cityCount ?? 0,
        countries_visited: s.cityCount ?? 0,
        places_visited_total: s.completePlaceCount ?? 0,
        places_total_total: s.placeCount ?? 0,
        avg_rate: s.rate ?? 0,
        rated_trips: s.rateCount ?? 0,
        tasks_done_total: s.completedTaskCount ?? 0,
        tasks_total_total: s.taskCount ?? 0,
        most_expensive_trip: s.nameActivityTrip
            ? { title: s.nameActivityTrip, spent: s.countTaskActivity ?? 0 }
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

export async function register(params) {
    if (USE_MOCK) {
        const data = await mockApi.register(params);
        if (data?.access_token) localStorage.setItem(CONFIG.TOKEN_KEY, data.access_token);
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
        if (data?.access_token) localStorage.setItem(CONFIG.TOKEN_KEY, data.access_token);
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

// POST 
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


// GET /api/user/get/information → ShowUserDTO
export async function getAuthMe() {
    if (USE_MOCK) return mockApi.getAuthMe();
    const data = await request('GET', '/api/user/get/information');
    return _normalizeUser(data);
}

// PUT /api/user/settings/basic
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

// PATCH
export async function changePassword(params) {
    if (USE_MOCK) return mockApi.changePassword(params);
    return request('PATCH', '/api/user/settings/password', {
        oldPassword: params.old_password ?? params.oldPassword,
        newPassword: params.new_password ?? params.newPassword,
    });
}


// TRIPS

// GET /api/content/get/trips → MainTripsDTO[]
export async function getTrips(params) {
    if (USE_MOCK) return mockApi.getTrips(params);
    const list = await request('GET', '/api/content/get/trips');
    return (list ?? []).map(_normalizeTrip);
}

// GET /api/content/get/trips — фільтруємо по id на фронті (окремого ендпоінту немає)
export async function getTrip(id) {
    if (USE_MOCK) return mockApi.getTrip(id);
    const list = await request('GET', '/api/content/get/trips');
    const trip = (list ?? []).find(t => String(t.id) === String(id));
    return trip ? _normalizeTrip(trip) : null;
}

// POST /api/trips/add → BasicDTOResponse (без id)
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

// PUT /api/trips/edit → BasicDTOResponse
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

// DELETE /api/trips/drop/{id}
export async function deleteTrip(id) {
    if (USE_MOCK) return mockApi.deleteTrip(id);
    return request('DELETE', `/api/trips/drop/${id}`);
}

// PATCH /api/trip/rate/set
export async function setTripRate(id, rate) {
    if (USE_MOCK) return mockApi.updateTrip(id, { rate });
    return request('PATCH', '/api/trip/rate/set', { id: Number(id), rate });
}

export async function restoreTrip(id) {
    if (USE_MOCK) return mockApi.restoreTrip(id);
    return null;
}

export async function createCity(body) {
    if (USE_MOCK) return mockApi.createCity(body);
    return null;
}

// TASKS
// GET /api/content/get/task/{id}
export async function getTasks(tripId) {
    if (USE_MOCK) return mockApi.getTasks(tripId);
    const list = await request('GET', `/api/content/get/task/${tripId}`);
    return (list ?? []).map(_normalizeTask);
}

// POST /api/tasks/add
export async function createTask(tripId, body) {
    if (USE_MOCK) return mockApi.createTask(tripId, body);
    return request('POST', '/api/tasks/add', {
        id: Number(tripId),
        value: body.value,
        note: body.note ?? '',
    });
}

// PATCH /api/tasks/check  або  PUT /api/tasks/edit
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

// DELETE /api/tasks/delete/{id}
export async function deleteTask(tripId, taskId) {
    if (USE_MOCK) return mockApi.deleteTask(tripId, taskId);
    return request('DELETE', `/api/tasks/delete/${taskId}`);
}

export async function restoreTask(_tripId, _taskId) {
    if (USE_MOCK) return mockApi.restoreTask(_tripId, _taskId);
    return null;
}

// PLACES
// GET /api/content/get/place/{id}
export async function getPlaces(tripId) {
    if (USE_MOCK) return mockApi.getPlaces(tripId);
    const list = await request('GET', `/api/content/get/place/${tripId}`);
    return (list ?? []).map(_normalizePlace);
}

// POST /api/place/add
export async function createPlace(tripId, body) {
    if (USE_MOCK) return mockApi.createPlace(tripId, body);
    return request('POST', '/api/place/add', {
        id: Number(tripId),
        name: body.name,
    });
}

// PATCH /api/place/check  або  PUT /api/place/edit
export async function updatePlace(tripId, placeId, body) {
    if (USE_MOCK) return mockApi.updatePlace(tripId, placeId, body);
    if ('visited' in body || 'check' in body) {
        return request('PATCH', '/api/place/check', {
            placeId: Number(placeId),
            check: body.check ?? body.visited,
        });
    }
    return request('PUT', '/api/place/edit', {
        placeId: Number(placeId),
        name: body.name ?? '',
    });
}

// DELETE /api/place/delete/{id}
export async function deletePlace(tripId, placeId) {
    if (USE_MOCK) return mockApi.deletePlace(tripId, placeId);
    return request('DELETE', `/api/place/delete/${placeId}`);
}

export async function restorePlace(_tripId, _placeId) {
    if (USE_MOCK) return mockApi.restorePlace(_tripId, _placeId);
    return null;
}

//  NOTES
// POST /api/place/note/add
export async function createPlaceNote(placeId, value) {
    if (USE_MOCK) return null;
    return request('POST', '/api/place/note/add', {
        id: Number(placeId),
        value,
    });
}

// PUT /api/place/note/edit
export async function updatePlaceNote(noteId, value) {
    if (USE_MOCK) return null;
    return request('PUT', '/api/place/note/edit', {
        id: Number(noteId),
        value,
    });
}

// DELETE /api/place/note/delete/{id}
export async function deletePlaceNote(noteId) {
    if (USE_MOCK) return null;
    return request('DELETE', `/api/place/note/delete/${noteId}`);
}


// TRIP NOTES
// GET /api/content/get/note/{id}
export async function getNotes(tripId) {
    if (USE_MOCK) return mockApi.getNotes(tripId);
    const list = await request('GET', `/api/content/get/note/${tripId}`);
    return (list ?? []).map(_normalizeNote);
}

// POST /trips/note/add  ← реальний route бекенду (без /api/)
export async function createNote(tripId, body) {
    if (USE_MOCK) return mockApi.createNote(tripId, body);
    return request('POST', '/trips/note/add', {
        id: Number(tripId),
        value: body.value,
    });
}

// PUT /trips/note/edit
export async function updateNote(tripId, noteId, body) {
    if (USE_MOCK) return mockApi.updateNote(tripId, noteId, body);
    return request('PUT', '/trips/note/edit', {
        id: Number(noteId),
        value: body.value,
    });
}

// DELETE /trips/note/delete/{id}
export async function deleteNote(tripId, noteId) {
    if (USE_MOCK) return mockApi.deleteNote(tripId, noteId);
    return request('DELETE', `/trips/note/delete/${noteId}`);
}

export async function restoreNote(_tripId, _noteId) {
    if (USE_MOCK) return mockApi.restoreNote(_tripId, _noteId);
    return null;
}


// BOOKINGS (Reservation)
// GET /api/content/get/reservation/{id}
export async function getBookings(tripId) {
    if (USE_MOCK) return mockApi.getBookings(tripId);
    const list = await request('GET', `/api/content/get/reservation/${tripId}`);
    return (list ?? []).map(_normalizeBooking);
}

// POST /api/reservation/add

export async function createBooking(tripId, body) {
    if (USE_MOCK) return mockApi.createBooking(tripId, body);
    return request('POST', '/api/reservation/add', {
        id: Number(tripId),
        name: body.name ?? '',
        cost: body.cost ?? 0,
        startTime: body.start_at ?? body.startTime ?? null,
        endTime: body.end_at ?? body.endTime ?? null,
        note: body.notes ?? body.note ?? '',
        address: body.address ?? '',
        type: body.type_id ?? body.type ?? 'other',
    });
}

// PUT /api/reservation/edit
export async function updateBooking(tripId, bookingId, body) {
    if (USE_MOCK) return mockApi.updateBooking(tripId, bookingId, body);
    return request('PUT', '/api/reservation/edit', {
        id: Number(bookingId),
        name: body.name ?? '',
        cost: body.cost ?? 0,
        startTime: body.start_at ?? body.startTime ?? null,
        endTime: body.end_at ?? body.endTime ?? null,
        note: body.notes ?? body.note ?? '',
        address: body.address ?? '',
        type: body.type_id ?? body.type ?? 'other',
    });
}

// DELETE /api/reservation/delete/{id}
export async function deleteBooking(tripId, bookingId) {
    if (USE_MOCK) return mockApi.deleteBooking(tripId, bookingId);
    return request('DELETE', `/api/reservation/delete/${bookingId}`);
}

export async function restoreBooking(_tripId, _bookingId) {
    if (USE_MOCK) return mockApi.restoreBooking(_tripId, _bookingId);
    return null;
}


// EXPENSES — тільки mock (бек не має цього endpoint)

export async function getExpenses(tripId) { return mockApi.getExpenses(tripId); }
export async function createExpense(tripId, data) { return mockApi.createExpense(tripId, data); }
export async function deleteExpense(tripId, id) { return mockApi.deleteExpense(tripId, id); }

// STATISTICS — GET /api/statistic/get → MainStatisticDTO

export const stats = {
    summary: async (period) => {
        if (USE_MOCK) return mockApi.stats.summary(period);
        const data = await request('GET', '/api/statistic/get');
        return _normalizeStats(data);
    },
};
