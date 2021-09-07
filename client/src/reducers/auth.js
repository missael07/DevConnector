import { REGISTER_FAIL, REGISTER_SUCCES, USER_LOADED, AUTH_ERROR, LOGIN_FAILED, LOGIN_SUCCES, LOGOUT } from "../actions/types";

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
}


export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case USER_LOADED:
            return { ...state, user: payload, isAuthenticated: true, loading: false }
        case REGISTER_SUCCES:
        case LOGIN_SUCCES:
            localStorage.setItem('token', payload.token);
            return { ...state, ...payload, isAuthenticated: true, loading: false }
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAILED:
        case LOGOUT:
            localStorage.removeItem('token');
            return { ...state, token: null, isAuthenticated: false, loading: false }
        default:
            return state;
    }
}