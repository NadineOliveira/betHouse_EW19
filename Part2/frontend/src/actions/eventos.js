import axios from 'axios';

export const encerraEvento = async function (id,result) {
    axios.get('http://localhost/eventos/concluir/'+id+"/"+result)
            .then(res => {
                alert("Evento Encerrado com sucesso!")
            })
            .catch(err => {
                alert(err);
            });
}

export const adicionaEvento = async function (equipa1,equipa2,odd1,odd2,oddx,date,premium) {
    axios.post('http://localhost/eventos', { 
                                            equipa1: equipa1, 
                                            equipa2: equipa2,
                                            odd1: odd1,
                                            odd2: odd2, 
                                            oddx: oddx,
                                            data: date, 
                                            premium: premium
                                           })
            .then(res => {
                alert("Evento Adicionado com sucesso!")
            })
            .catch(err => {
                alert(err);
            });
}