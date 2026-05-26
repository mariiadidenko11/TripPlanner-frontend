
import { CONFIG } from './config.js';
import * as mockApi from './mockApi.js';

export const USE_MOCK = true; 
export async function register(params) {
    const data = await mockApi.register(params);
    if (data?.access_token) localStorage.setItem(CONFIG.TOKEN_KEY, data.access_token);
    if (data?.user) localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(data.user));
    return data;
}

export async function login(params) {
    const data = await mockApi.login(params);
    if (data?.access_token) localStorage.setItem(CONFIG.TOKEN_KEY, data.access_token);
    if (data?.user) localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(data.user));
    return data;
}

export async function logout() {
    return mockApi.logout();
}

export async function forgotPassword(params) {
    const email = typeof params === 'string' ? params : params.email;
    return mockApi.forgotPassword(email);
}

export async function getAuthMe() {
    return mockApi.getAuthMe();
}

export async function updateUser(fields) {
    const user = await mockApi.updateUser(fields);
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
    return user;
}

export async function changePassword(params) {
    return mockApi.changePassword(params);
}

export async function getTrips(params) {
    return mockApi.getTrips(params);
}

export async function getTrip(id) {
    return mockApi.getTrip(id);
}

export async function createTrip(body) {
    return mockApi.createTrip(body);
}

export async function updateTrip(id, fields) {
    return mockApi.updateTrip(id, fields);
}

export async function deleteTrip(id) {
    return mockApi.deleteTrip(id);
}

export async function setTripRate(id, rate) {
    return mockApi.updateTrip(id, { rate });
}

export async function createCity(body) {
    return mockApi.createCity(body);
}

export async function getTasks(tripId) {
    return mockApi.getTasks(tripId);
}

export async function createTask(tripId, body) {
    return mockApi.createTask(tripId, body);
}

export async function updateTask(tripId, taskId, body) {
    return mockApi.updateTask(tripId, taskId, body);
}

export async function deleteTask(tripId, taskId) {
    return mockApi.deleteTask(tripId, taskId);
}

export async function restoreTask(tripId, taskId) {
    return mockApi.restoreTask(tripId, taskId);
}

export async function getPlaces(tripId) {
    return mockApi.getPlaces(tripId);
}

export async function createPlace(tripId, body) {
    return mockApi.createPlace(tripId, body);
}

export async function updatePlace(tripId, placeId, body) {
    return mockApi.updatePlace(tripId, placeId, body);
}

export async function deletePlace(tripId, placeId) {
    return mockApi.deletePlace(tripId, placeId);
}

export async function restorePlace(tripId, placeId) {
    return mockApi.restorePlace(tripId, placeId);
}

export async function getNotes(tripId) {
    return mockApi.getNotes(tripId);
}

export async function createNote(tripId, body) {
    return mockApi.createNote(tripId, body);
}

export async function updateNote(tripId, noteId, body) {
    return mockApi.updateNote(tripId, noteId, body);
}

export async function deleteNote(tripId, noteId) {
    return mockApi.deleteNote(tripId, noteId);
}

export async function restoreNote(tripId, noteId) {
    return mockApi.restoreNote(tripId, noteId);
}

export async function getBookings(tripId) {
    return mockApi.getBookings(tripId);
}

export async function createBooking(tripId, body) {
    return mockApi.createBooking(tripId, body);
}

export async function deleteBooking(tripId, bookingId) {
    return mockApi.deleteBooking(tripId, bookingId);
}

export async function restoreBooking(tripId, bookingId) {
    return mockApi.restoreBooking(tripId, bookingId);
}

export async function getExpenses(tripId) {
    return mockApi.getExpenses(tripId);
}

export async function createExpense(tripId, data) {
    return mockApi.createExpense(tripId, data);
}

export async function deleteExpense(tripId, expenseId) {
    return mockApi.deleteExpense(tripId, expenseId);
}

export const stats = {
    summary: (p) => mockApi.stats.summary(p),
};
