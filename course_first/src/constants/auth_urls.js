import ROOT_URL from './constants'

const AuthUrls = {
    LOGIN: `${ROOT_URL}api/profiles/login/`,
    CHANGE_PASSWORD: `${ROOT_URL}api/profiles/change-password/`,
    GET_STAFF: `${ROOT_URL}api/profiles/staff/`,
    FIND_USER: `${ROOT_URL}api/profiles/find/`

};

export default AuthUrls;