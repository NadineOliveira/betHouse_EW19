import axios from 'axios';

export const registaAposta = (row,value,prog) => dispatch => {
    alert("registaAposta")
    axios.post('http://localhost/apostas', 
    {data: row.data, valor:value, prognostico: (prog.split("-")[1]),
    evento: row.id})
            .then(res => {
                alert("Aposta Concluida");
            })
            .catch(err => {
                alert("Error in Aposta");
            });
    }