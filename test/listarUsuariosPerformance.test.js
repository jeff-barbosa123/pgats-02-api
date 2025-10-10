import http from 'k6/http';
import { check, sleep } from 'k6';
import { pegarBaseURL } from '../../utils/variaveis.js';

const BASE_URL = pegarBaseURL();

export const options = {
    iterations :1,
};

export default function () {
    const res = http.get(BASE_URL + '/users'); 

    check(res, {
        'Validar que o status é 200': (res) => res.status === 200,
    });

    sleep(1);

}