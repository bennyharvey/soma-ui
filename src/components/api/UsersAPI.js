import * as config from '../App/config'


export const get = (token, payload, page = 1, perPage = 10) => {
    return fetch(config.NEW_USERS_URL + '?fields=login,role&per-page=10&page=', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
}