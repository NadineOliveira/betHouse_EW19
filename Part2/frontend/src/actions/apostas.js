import axios from 'axios';

export const registaAposta = (row,value,prog) => dispatch => {
    axios.post('http://localhost/apostas', 
    {data: row.data, valor:value, prognostico: (prog.split("-")[1]),
    evento: row._id})
            .then(res => {
                alert("Aposta concluida");
                window.location.reload()
            })
            .catch(err => {
                alert("Aposta não concluida, verifique o seu saldo");
                window.location.reload()
            });
    }