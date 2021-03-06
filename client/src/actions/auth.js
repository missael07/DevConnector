import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import { setAlert } from './alert';
import { REGISTER_SUCCES, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCES, LOGIN_FAILED, LOGOUT, CLEAR_PROFILE } from './types';

//lOAD USER
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get('/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}

//Register User 
export const register = ({ name, email, password }) => async dispatch => {
    const newUser = { name, email, password };

    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const body = JSON.stringify(newUser);

        const res = await axios.post('/api/users', body, config);

        dispatch({
            type: REGISTER_SUCCES,
            payload: res.data
        })
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: REGISTER_FAIL
        })
    }
}

//Login User 
export const login = (email, password) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const body = JSON.stringify({ email, password });

        const res = await axios.post('/api/auth', body, config);

        dispatch({
            type: LOGIN_SUCCES,
            payload: res.data
        })
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: LOGIN_FAILED
        })
    }
}

//Logout / clear Profile
export const logout = () => dispatch => {
    dispatch({ type: LOGOUT })
    dispatch({ type: CLEAR_PROFILE })

}