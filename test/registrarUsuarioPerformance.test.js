import http from 'k6/http';
import { sleep, check } from 'k6';
import { pegarBaseURL } from '../../utils/variaveis.js';
const postUsuario = JSON.parse(open('../../fixtures/postUsuario.json'));


export let options = {
    stages: [
        { duration: '5s', target: 10 },
        { duration: '20m', target: 10 },
        { duration: '5s', target: 0 },
    ],

    thresholds: {
        http_req_duration: ['p(95)<200', 'max<200'],
        http_req_failed: ['rate<0.01'],
    },
}


export default function () {
    const url = pegarBaseURL() + '/users/register';
    const payload = JSON.stringify(postUsuario);

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);
   
    check(res, {
        'Validar que o status é 201': (r) => r.status === 201,
    });

    sleep(1);
}