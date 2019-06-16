import axios from 'axios';



export const encerraEvento = async function (id,result,str) {
    axios.post('http://localhost/eventos/concluir/'+id, {estado: result,resultado: str})
            .then(res => {
                alert("Evento Encerrado com sucesso!")
                window.location.reload()
            })
            .catch(err => {
                alert(err);
            });
}

export const adicionaEvento = async function (equipa1,equipa2,odd1,odd2,oddx,date,hour,premium) {
    axios.post('http://localhost/eventos', { 
                                            equipa1: equipa1, 
                                            equipa2: equipa2,
                                            odd1: odd1,
                                            odd2: odd2, 
                                            oddx: oddx,
                                            data: date,
                                            hora: hour, 
                                            premium: premium
                                           })
            .then(res => {
                alert("Evento Adicionado com sucesso!")
                window.location.reload()
            })
            .catch(err => {
                alert(err);
            });
}