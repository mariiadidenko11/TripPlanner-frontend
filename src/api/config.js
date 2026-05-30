export const CONFIG = {
    API_BASE: '',

    // Auth is cookie-based (HttpOnly cookie "token" set by the backend).
    // No bearer token is stored client-side; these keys are only used for
    // caching the user profile / current trip locally.
    USER_KEY: 'bm_user',
    TRIP_ID_KEY: 'bm_current_trip_id',
    REQUEST_TIMEOUT: 12000,
};

export function getCurrentTripId() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tripId')) {
        sessionStorage.setItem(CONFIG.TRIP_ID_KEY, params.get('tripId'));
    }
    return (
        params.get('tripId') ||
        sessionStorage.getItem(CONFIG.TRIP_ID_KEY) ||
        localStorage.getItem(CONFIG.TRIP_ID_KEY) ||
        null
    );
}

export function setCurrentTripId(id) {
    sessionStorage.setItem(CONFIG.TRIP_ID_KEY, id);
    localStorage.setItem(CONFIG.TRIP_ID_KEY, id);
}
