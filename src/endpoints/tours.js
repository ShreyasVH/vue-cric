import { get } from '../utils/api';
const endpoint = 'https://cric.springboot.com';


export const getToursForYear = async (year, page, pageSize) => {
    const url = endpoint + '/cric/v1/tours/year/' + year + '?page=' + page + '&limit=' + pageSize;
    return get(url);
}

export const getAllYears = async () => {
    const url = endpoint + '/cric/v1/tours/years';
    return get(url);
}

export const getById = async (id) => {
    const url = endpoint + '/cric/v1/tours/' + id;
    return get(url);
}