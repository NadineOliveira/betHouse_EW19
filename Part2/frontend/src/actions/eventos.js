import axios from 'axios';

export const encerraEvento = async (id,result) => dispatch => {
    axios.post('http://localhost/eventos/concluir/'+id+"/"+result)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                alert(err);
            });
}