import React, { useContext } from "react";

import * as config from '../App/config'
// import {AuthContext} from '../../components/App/auth'


export const get = (page = 1, perPage = 10) => {

    return fetch(config.NEW_PERSONS_URL + '?per-page=' + perPage + '&page=' + page, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export const getPhotoIDs = (personID, token) => {
    // const { token } = useContext(AuthContext);

    return fetch(config.PERSONS_URL + '/' + personID + '/faces?' + 'token=' + token, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.json())
}

export const deletePhoto = (photoID, token) => {
    return fetch(config.PERSON_FACES_URL + '/' + photoID + '?' + 'token=' + token, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
}
