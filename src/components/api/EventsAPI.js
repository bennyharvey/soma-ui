import * as config from '../App/config'
import { basicRequest }  from '../App/utils'


export const get = ({page = 1, perPage = 10, token}) => basicRequest({
    url: config.EVENTS_URL + '?order_by=id&order_direction=desc' + '&limit=' + perPage + '&offset=' + (page - 1) * 10 + '&token=' + token
})

export const gett = ({page = 1, perPage = 10, filterType, dateFrom, dateTo}) => basicRequest({
    url: config.NEW_EVENTS_URL +'?per-page=' + perPage 
        + ('&page=' + (page - 1) * 10) 
        + (filterType ? '&filter[type]=' + filterType : '')
        + (dateFrom ? '&filter[date-from]=' + dateFrom : '')
        + (dateTo ? '&filter[date-to]=' + dateTo : '')
})
