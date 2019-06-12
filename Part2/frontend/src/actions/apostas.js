import axios from 'axios';

export const registaAposta = (row,value,prog,history) => dispatch => {
    alert("registaAposta")
    axios.post('http://localhost/apostas', 
    {data: row.data, valor:value, prognostico: (prog.split("-")[1]),
    evento: row.id})
            .then(res => history.push('/apostas')
            )
            .catch(err => {
                alert("Erro a registar aposta" + err);
                });
}