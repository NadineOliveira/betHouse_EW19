import axios from 'axios';

export const encerraEvento = async (id,result) => dispatch => {
    axios.get('http://localhost/eventos/concluir/'+id+"/"+result)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                alert(err);
            });
}