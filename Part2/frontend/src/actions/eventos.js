import axios from 'axios';

export const getEventos = async () => dispatch => {
    axios.get('http://localhost/eventos')
            .then(res => {
                return res.data;
            })
            .catch(err => {
                return [];
            });
}