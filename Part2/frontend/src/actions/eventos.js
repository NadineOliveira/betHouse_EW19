import axios from 'axios';

export const encerraEvento = async function (id,result) {
    alert("ENCERRRAAA")
    axios.get('http://localhost/eventos/concluir/'+id+"/"+result)
            .then(res => {
                alert(JSON.stringify(res.data))
            })
            .catch(err => {
                alert(err);
            });
}