import React, { useContext } from "react";

import * as config from '../App/config'
import { basicRequest }  from '../App/utils'
// import {AuthContext} from '../../components/App/auth'

// export const get = ({page = 1, perPage = 10}) => basicRequest({
//     url: config.NEW_PERSONS_URL + '?per-page=' + perPage + '&page=' + page
// })

export const addUser = (data, token) => basicRequest({
    url: config.USERS_URL + '?token=' + token,
    method: 'POST',
    body: JSON.stringify(data)
})
