import axios from 'axios';

export const getEventos = () => dispatch => {
    axios.get('http://localhost/eventos')
            .then(res => res
            )
            .catch(err => {
                alert("Erro a obter eventos" + err);
                });
}