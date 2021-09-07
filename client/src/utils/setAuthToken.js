import axios from "axios";
const setAuthToken = token => {
    if (token) {
        console.log(token)
        axios.defaults.headers.common['x-auth-token'] = token;
    }
    else {
        delete axios.defaults.headers.common['x-ath-token']
    }
}

export default setAuthToken;