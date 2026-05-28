
export const CONFIG = {
    API_BASE: 'http://localhost:5011', 

    TOKEN_KEY: 'bm_access_token',
    REFRESH_KEY: 'bm_refresh_token',
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
