import { INITIAL_DATA } from './mockData.js';

const STORAGE_KEY = 'bezmezh_db';

function getDB() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
        return INITIAL_DATA;
    }
    try {
        let db = JSON.parse(data);
        if (!db || typeof db !== 'object' || Array.isArray(db)) {
            throw new Error('Invalid DB structure');
        }

        if (!db.user) db.user = INITIAL_DATA.user;
        if (!Array.isArray(db.trips)) db.trips = INITIAL_DATA.trips;
        if (!Array.isArray(db.cities)) db.cities = INITIAL_DATA.cities;
        if (!Array.isArray(db.data_lock)) db.data_lock = INITIAL_DATA.data_lock;

        
        ['tasks', 'places', 'bookings', 'notes'].forEach(key => {
            if (!db[key] || typeof db[key] !== 'object') {
                db[key] = INITIAL_DATA[key] || {};
            }
        });

       
        if (!db.expenses || typeof db.expenses !== 'object') {
            db.expenses = INITIAL_DATA.expenses || {};
            localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
        } else {
            
            let migrated = false;
            (INITIAL_DATA.expenses || {});
            Object.keys(INITIAL_DATA.expenses || {}).forEach(tripId => {
                if (!db.expenses[tripId] || db.expenses[tripId].length === 0) {
                    db.expenses[tripId] = INITIAL_DATA.expenses[tripId];
                    migrated = true;
                }
            });
            if (migrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
        }

        return db;
    } catch (e) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
        return INITIAL_DATA;
    }
}

function saveDB(db) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

// AUTH & USERS

export async function login({ email, password }) {
    const db = getDB();
    const authData = (db.data_lock || []).find(d => d.email === email);

    if (authData && password) {
        return {
            access_token: 'mock-token',
            user: db.user
        };
    }
    throw new Error('Invalid credentials');
}

export async function register({ firstname, lastname, email, password }) {
    const db = getDB();

    const dataId = 'd' + Date.now();
    const userId = 'u' + Date.now();

    const newAuth = {
        id: dataId,
        email,
        hash: 'hashed_' + password,
        created_at: new Date().toISOString()
    };

    const newUser = {
        id: userId,
        data_id: dataId,
        firstname,
        lastname,
        description: '',
        created_at: new Date().toISOString()
    };

    db.data_lock.push(newAuth);
    db.user = newUser; 

    saveDB(db);
    return { access_token: 'mock-token', user: newUser };
}

export async function logout() { return true; }
export async function getAuthMe() {
    const db = getDB();
    return db.user;
}

export async function forgotPassword(email) {
    const db = getDB();
    const user = (db.data_lock || []).find(d => d.email === email);
    if (!user) throw new Error('User with this email not found');
    return true;
}

export async function updateUser(fields) {
    const db = getDB();
    
    db.user = { ...db.user, ...fields };
    saveDB(db);
    return db.user;
}

export async function changePassword(params) {
 
    return true;
}

// TRIPS & CITIES

function _enhanceTrip(t, db) {
    const city = (db.cities || []).find(c => c.trips_id === t.id);
    const location = city ? city.name : '';
    const tasks = db.tasks[t.id] || [];
    const tasks_done = tasks.filter(x => x.done || x.check).length;
    const tasks_total = tasks.length;

    const expenses = (db.expenses || {})[t.id] || [];
    const fact_money = expenses.length > 0
        ? expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0)
        : (t.fact_money || 0);

    return {
        status: 'active',
        ...t,
        location: t.location || location,
        tasks_done,
        tasks_total,
        fact_money,
    };
}

export async function getTrips({ status = 'all' } = {}) {
    const db = getDB();
   
    if (db.trips.length === 0 && INITIAL_DATA.trips.length > 0) {
        db.trips = [...INITIAL_DATA.trips];
        saveDB(db);
    }

    let trips = db.trips.map(t => _enhanceTrip(t, db));

    if (status && status !== 'all') {
        trips = trips.filter(t => t.status === status);
    }
    return trips;
}

export async function getTrip(id) {
    const db = getDB();
    const t = db.trips.find(t => t.id === id);
    if (!t) return undefined;
    return _enhanceTrip(t, db);
}

export async function createTrip(tripData) {
    const db = getDB();
    const newTrip = {
        ...tripData,
        id: 't' + Date.now(),
        users_id: db.user.id,
        created_at: new Date().toISOString(),
        fact_money: tripData.fact_money || 0,
        rate: tripData.rate || 0,
        status: tripData.status || 'waiting'
    };
    db.trips.push(newTrip);
    saveDB(db);
    return _enhanceTrip(newTrip, db);
}

export async function createCity(cityData) {
    const db = getDB();
    const newCity = {
        ...cityData,
        id: 'c' + Date.now(),
        created_at: new Date().toISOString()
    };
    if (!db.cities) db.cities = [];
    if (!db.expenses) db.expenses = {};
    db.cities.push(newCity);

    saveDB(db);
    return newCity;
}

export async function updateTrip(id, fields) {
    const db = getDB();
    const idx = db.trips.findIndex(t => t.id === id);
    if (idx === -1) return null;
    db.trips[idx] = { ...db.trips[idx], ...fields };
    saveDB(db);
    return _enhanceTrip(db.trips[idx], db);
}

export async function deleteTrip(id) {
    const db = getDB();
    const trip = db.trips.find(t => t.id === id);
    if (!trip) return true;
    const index = db.trips.findIndex(t => t.id === id);
    if (!db.trips_trash) db.trips_trash = [];
    db.trips_trash.push({ ...trip, _trash_index: index });
    db.trips = db.trips.filter(t => t.id !== id);
    saveDB(db);
    return true;
}

export async function restoreTrip(id) {
    const db = getDB();
    if (!db.trips_trash) return null;
    const item = db.trips_trash.find(t => t.id === id);
    if (!item) return null;
    const { _trash_index, ...trip } = item;
    db.trips.splice(_trash_index, 0, trip);
    db.trips_trash = db.trips_trash.filter(t => t.id !== id);
    saveDB(db);
    return trip;
}

// TASKS
function _mapTask(t) {
    return {
        ...t,
        value: t.value || t.text, 
        check: t.check ?? t.done   
    };
}

export async function getTasks(tripId) {
    const db = getDB();
    return (db.tasks[tripId] || []).map(_mapTask);
}

export async function createTask(tripId, data) {
    const db = getDB();
    if (!db.tasks[tripId]) db.tasks[tripId] = [];
    const newTask = {
        id: 'tk' + Date.now(),
        ...data,
        done: data.check ?? data.done ?? false,
        text: data.value ?? data.text ?? '',
        created_at: new Date().toISOString()
    };
    db.tasks[tripId].push(newTask);
    saveDB(db);
    return _mapTask(newTask);
}

export async function updateTask(tripId, taskId, data) {
    const db = getDB();
    if (!db.tasks[tripId]) return null;
    const idx = db.tasks[tripId].findIndex(t => t.id === taskId);
    if (idx === -1) return null;

    const updated = { ...db.tasks[tripId][idx], ...data };
    if (data.check !== undefined) updated.done = data.check;
    if (data.value !== undefined) updated.text = data.value;

    db.tasks[tripId][idx] = updated;
    saveDB(db);
    return _mapTask(db.tasks[tripId][idx]);
}

export async function deleteTask(tripId, taskId) {
    const db = getDB();
    if (!db.tasks[tripId]) return true;
    const idx = db.tasks[tripId].findIndex(t => t.id === taskId);
    if (idx === -1) return true;
    if (!db.tasks_trash) db.tasks_trash = {};
    if (!db.tasks_trash[tripId]) db.tasks_trash[tripId] = [];
    db.tasks_trash[tripId].push({ ...db.tasks[tripId][idx], _trash_index: idx });
    db.tasks[tripId].splice(idx, 1);
    saveDB(db);
    return true;
}

export async function restoreTask(tripId, taskId) {
    const db = getDB();
    if (!db.tasks_trash?.[tripId]) return null;
    const item = db.tasks_trash[tripId].find(t => t.id === taskId);
    if (!item) return null;
    const { _trash_index, ...task } = item;
    if (!db.tasks[tripId]) db.tasks[tripId] = [];
    db.tasks[tripId].splice(_trash_index, 0, task);
    db.tasks_trash[tripId] = db.tasks_trash[tripId].filter(t => t.id !== taskId);
    saveDB(db);
    return _mapTask(task);
}


// PLACES
function _mapPlace(p) {
    return {
        ...p,
        favourite: p.favourite ?? p.is_favourite 
    };
}

export async function getPlaces(tripId) {
    const db = getDB();
    return (db.places[tripId] || []).map(_mapPlace);
}

export async function createPlace(tripId, data) {
    const db = getDB();
    if (!db.places[tripId]) db.places[tripId] = [];
    const newPlace = {
        id: 'pl' + Date.now(),
        ...data,
        visited: data.check ?? data.visited ?? false,
        is_favourite: data.favourite ?? data.is_favourite ?? false,
        created_at: new Date().toISOString()
    };
    db.places[tripId].push(newPlace);
    saveDB(db);
    return _mapPlace(newPlace);
}

export async function updatePlace(tripId, placeId, data) {
    const db = getDB();
    if (!db.places[tripId]) return null;
    const idx = db.places[tripId].findIndex(p => p.id === placeId);
    if (idx === -1) return null;

    const updated = { ...db.places[tripId][idx], ...data };
    if (data.favourite !== undefined) updated.is_favourite = data.favourite;
    if (data.check !== undefined) updated.visited = data.check;

    db.places[tripId][idx] = updated;
    saveDB(db);
    return _mapPlace(db.places[tripId][idx]);
}

export async function togglePlaceVisited(tripId, placeId) {
    const db = getDB();
    const places = db.places[tripId] || [];
    const p = places.find(x => x.id === placeId);
    if (p) p.visited = !p.visited;
    saveDB(db);
    return _mapPlace(p);
}

export async function togglePlaceFavourite(tripId, placeId) {
    const db = getDB();
    const places = db.places[tripId] || [];
    const p = places.find(x => x.id === placeId);
    if (p) p.is_favourite = !p.is_favourite;
    saveDB(db);
    return _mapPlace(p);
}

export async function deletePlace(tripId, placeId) {
    const db = getDB();
    if (!db.places[tripId]) return true;
    const idx = db.places[tripId].findIndex(p => p.id === placeId);
    if (idx === -1) return true;
    if (!db.places_trash) db.places_trash = {};
    if (!db.places_trash[tripId]) db.places_trash[tripId] = [];
    db.places_trash[tripId].push({ ...db.places[tripId][idx], _trash_index: idx });
    db.places[tripId].splice(idx, 1);
    saveDB(db);
    return true;
}

export async function restorePlace(tripId, placeId) {
    const db = getDB();
    if (!db.places_trash?.[tripId]) return null;
    const item = db.places_trash[tripId].find(p => p.id === placeId);
    if (!item) return null;
    const { _trash_index, ...place } = item;
    if (!db.places[tripId]) db.places[tripId] = [];
    db.places[tripId].splice(_trash_index, 0, place);
    db.places_trash[tripId] = db.places_trash[tripId].filter(p => p.id !== placeId);
    saveDB(db);
    return _mapPlace(place);
}


// NOTES


export async function getNotes(tripId) {
    const db = getDB();
    return db.notes[tripId] || [];
}

export async function createNote(tripId, data) {
    const db = getDB();
    if (!db.notes[tripId]) db.notes[tripId] = [];
    const newNote = {
        id: 'nt' + Date.now(),
        ...data,
        created_at: new Date().toISOString()
    };
    db.notes[tripId].push(newNote);
    saveDB(db);
    return newNote;
}

export async function updateNote(tripId, noteId, data) {
    const db = getDB();
    if (!db.notes[tripId]) return null;
    const idx = db.notes[tripId].findIndex(n => n.id === noteId);
    if (idx === -1) return null;
    db.notes[tripId][idx] = { ...db.notes[tripId][idx], ...data };
    saveDB(db);
    return db.notes[tripId][idx];
}

export async function deleteNote(tripId, noteId) {
    const db = getDB();
    if (!db.notes[tripId]) return true;
    const idx = db.notes[tripId].findIndex(n => n.id === noteId);
    if (idx === -1) return true;
    if (!db.notes_trash) db.notes_trash = {};
    if (!db.notes_trash[tripId]) db.notes_trash[tripId] = [];
    db.notes_trash[tripId].push({ ...db.notes[tripId][idx], _trash_index: idx });
    db.notes[tripId].splice(idx, 1);
    saveDB(db);
    return true;
}

export async function restoreNote(tripId, noteId) {
    const db = getDB();
    if (!db.notes_trash?.[tripId]) return null;
    const item = db.notes_trash[tripId].find(n => n.id === noteId);
    if (!item) return null;
    const { _trash_index, ...note } = item;
    if (!db.notes[tripId]) db.notes[tripId] = [];
    db.notes[tripId].splice(_trash_index, 0, note);
    db.notes_trash[tripId] = db.notes_trash[tripId].filter(n => n.id !== noteId);
    saveDB(db);
    return note;
}

// BOOKINGS


export async function getBookings(tripId) {
    const db = getDB();
    return db.bookings[tripId] || [];
}

export async function createBooking(tripId, data) {
    const db = getDB();
    if (!db.bookings[tripId]) db.bookings[tripId] = [];
    const newBooking = {
        id: 'bk' + Date.now(),
        ...data,
        created_at: new Date().toISOString()
    };
    db.bookings[tripId].push(newBooking);
    saveDB(db);
    return newBooking;
}

export async function updateBooking(tripId, bookingId, data) {
    const db = getDB();
    if (!db.bookings) db.bookings = {};
    const list = db.bookings[tripId] || [];
    const idx = list.findIndex(b => String(b.id) === String(bookingId));
    if (idx !== -1) {
        list[idx] = { ...list[idx], ...data };
        db.bookings[tripId] = list;
        saveDB(db);
    }
    return list[idx] || null;
}

export async function deleteBooking(tripId, bookingId) {
    const db = getDB();
    if (!db.bookings[tripId]) return true;
    const idx = db.bookings[tripId].findIndex(b => b.id === bookingId);
    if (idx === -1) return true;
    if (!db.bookings_trash) db.bookings_trash = {};
    if (!db.bookings_trash[tripId]) db.bookings_trash[tripId] = [];
    db.bookings_trash[tripId].push({ ...db.bookings[tripId][idx], _trash_index: idx });
    db.bookings[tripId].splice(idx, 1);
    saveDB(db);
    return true;
}

export async function restoreBooking(tripId, bookingId) {
    const db = getDB();
    if (!db.bookings_trash?.[tripId]) return null;
    const item = db.bookings_trash[tripId].find(b => b.id === bookingId);
    if (!item) return null;
    const { _trash_index, ...booking } = item;
    if (!db.bookings[tripId]) db.bookings[tripId] = [];
    db.bookings[tripId].splice(_trash_index, 0, booking);
    db.bookings_trash[tripId] = db.bookings_trash[tripId].filter(b => b.id !== bookingId);
    saveDB(db);
    return booking;
}

// STATS

export const stats = {
    summary: async (period = 'all') => {
        const db = getDB();
        const trips = db.trips || [];

        const enhancedTrips = trips.map(t => {
            const tasks = db.tasks[t.id] || [];
            const places = db.places[t.id] || [];
            const tasks_done = tasks.filter(x => x.done || x.check).length;
            const tasks_total = tasks.length;
            const places_visited = places.filter(x => x.visited || x.check).length;
            const places_total = places.length;

            return {
                ...t,
                tasks_done,
                tasks_total,
                tasks_percentage: tasks_total > 0 ? Math.round((tasks_done / tasks_total) * 100) : 0,
                places_visited,
                places_total
            };
        });

        const active_trips = enhancedTrips.filter(t => t.status === 'active').length;
        const completed_trips = enhancedTrips.filter(t => t.status === 'completed').length;
        const waiting_trips = enhancedTrips.filter(t => t.status === 'waiting').length;

        // Count unique countries from cities table (all trips, not just completed)
        const citiesMap = {};
        (db.cities || []).forEach(c => { citiesMap[c.trips_id] = c.name; });
        const allLocations = enhancedTrips.map(t => citiesMap[t.id] || t.location || '').filter(Boolean);
        const countries_visited = new Set(
            allLocations.map(loc => loc.split(',').slice(-1)[0].trim()).filter(Boolean)
        ).size;

        const total_spent = enhancedTrips.reduce((acc, t) => acc + (t.fact_money || 0), 0);
        const total_budget = enhancedTrips.reduce((acc, t) => acc + (t.start_money || 0), 0);

        // Record finding logic
        let longest_trip = null;
        let most_expensive_trip = null;

        enhancedTrips.forEach(t => {
            if (!longest_trip || (new Date(t.end_at) - new Date(t.start_at)) > (new Date(longest_trip.end_at) - new Date(longest_trip.start_at))) {
                longest_trip = t;
            }
            if (!most_expensive_trip || (t.fact_money || 0) > (most_expensive_trip.spent || 0)) {
                most_expensive_trip = { title: t.name, spent: t.fact_money };
            }
        });

        return {
            total_trips: enhancedTrips.length,
            active_trips,
            completed_trips,
            waiting_trips,
            total_spent,
            total_budget,
            total_remaining: Math.max(total_budget - total_spent, 0),
            countries_visited,
            cities_visited: new Set(
                enhancedTrips
                    .map(t => citiesMap[t.id] || t.location || '')
                    .filter(Boolean)
                    .flatMap(loc => loc.split(',').map(s => s.trim()))
                    .filter(Boolean)
            ).size,
            // Tasks aggregated
            tasks_done_total: enhancedTrips.reduce((a, t) => a + (t.tasks_done || 0), 0),
            tasks_total_total: enhancedTrips.reduce((a, t) => a + (t.tasks_total || 0), 0),
            // Places aggregated
            places_visited_total: enhancedTrips.reduce((a, t) => a + (t.places_visited || 0), 0),
            places_total_total: enhancedTrips.reduce((a, t) => a + (t.places_total || 0), 0),
            // Average rating (only rated trips)
            avg_rate: (() => {
                const rated = enhancedTrips.filter(t => (t.rate || 0) > 0);
                if (!rated.length) return 0;
                return Math.round((rated.reduce((a, t) => a + t.rate, 0) / rated.length) * 10) / 10;
            })(),
            rated_trips: enhancedTrips.filter(t => (t.rate || 0) > 0).length,
            rating_distribution: [1, 2, 3, 4, 5].map(star => ({
                star,
                count: enhancedTrips.filter(t => (t.rate || 0) === star).length
            })),
            highest_spending_country: { country: 'Ukraine', spent: total_spent },
            most_visited_places_country: { country: 'Greece', places_count: enhancedTrips.reduce((acc, t) => acc + t.places_visited, 0) },
            longest_trip: longest_trip ? { title: longest_trip.name, days: Math.ceil(Math.abs(new Date(longest_trip.end_at) - new Date(longest_trip.start_at)) / (1000 * 60 * 60 * 24)) + 1 } : null,
            most_expensive_trip,
            trips_comparison: enhancedTrips.map(t => ({
                id: t.id,
                title: t.name,
                status: t.status || 'waiting',
                rate: t.rate || 0,
                city: citiesMap[t.id] || t.location || '',
                budget: t.start_money || 0,
                spent: t.fact_money || 0,
                remaining: Math.max((t.start_money || 0) - (t.fact_money || 0), 0),
                tasks_done: t.tasks_done,
                tasks_total: t.tasks_total,
                tasks_percentage: t.tasks_percentage,
                places_visited: t.places_visited,
                places_total: t.places_total,
                days: t.start_at && t.end_at
                    ? Math.ceil(Math.abs(new Date(t.end_at) - new Date(t.start_at)) / (1000 * 60 * 60 * 24)) + 1
                    : 0
            }))
        };
    }
};


export async function getExpenses(tripId) {
    const db = getDB();
    if (!db.expenses) db.expenses = {};
    return (db.expenses[tripId] || []).filter(e => !e.deleted);
}

export async function createExpense(tripId, expenseData) {
    const db = getDB();
    if (!db.expenses) db.expenses = {};
    if (!db.expenses[tripId]) db.expenses[tripId] = [];

    const newExpense = {
        id: 'ex' + Date.now(),
        trips_id: tripId,
        cat: expenseData.cat || 'other',
        amount: Number(expenseData.amount) || 0,
        note: expenseData.note || '',
        date: expenseData.date || new Date().toISOString().slice(0, 10),
        created_at: new Date().toISOString(),
    };

    db.expenses[tripId].push(newExpense);


    const tripIdx = db.trips.findIndex(t => t.id === tripId);
    if (tripIdx !== -1) {
        db.trips[tripIdx].fact_money = db.expenses[tripId]
            .filter(e => !e.deleted)
            .reduce((s, e) => s + (Number(e.amount) || 0), 0);
    }

    saveDB(db);
    return newExpense;
}

export async function deleteExpense(tripId, expenseId) {
    const db = getDB();
    if (!db.expenses) db.expenses = {};
    if (!db.expenses[tripId]) return true;

    db.expenses[tripId] = db.expenses[tripId].filter(e => e.id !== expenseId);


    const tripIdx = db.trips.findIndex(t => t.id === tripId);
    if (tripIdx !== -1) {
        db.trips[tripIdx].fact_money = (db.expenses[tripId] || [])
            .reduce((s, e) => s + (Number(e.amount) || 0), 0);
    }

    saveDB(db);
    return true;
}

export async function getPlaceNotes(placeId) { return []; }
export async function createPlaceNote(placeId, data) { return {}; }
export async function updatePlaceNote(placeId, noteId, data) { return {}; }
export async function deletePlaceNote(placeId, noteId) { return true; }
