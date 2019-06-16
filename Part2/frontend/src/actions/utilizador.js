import axios from 'axios';

export const getSaldo = async function (email) {
    var s;
    await axios.get("http://localhost/utilizadores/saldo/"+ email)
    .then(res=> {s = res.data.saldo})
    .catch(err => {
        alert("ERRO: " + err);
    });
    return s;
}

export const aumentaSaldo = async function (email,valor) {
    var s;
    await axios.get("http://localhost/utilizadores/aumentaSaldo/"+ email+"/"+valor)
    .then(res=> {s = res.data.saldo})
    .catch(err => {
        alert("ERRO: " + err);
    });
    return s;
}

export const retiraSaldo = async function (email,valor) {
    var s;
    await axios.get("http://localhost/utilizadores/retiraSaldo/"+ email+"/"+valor)
    .then(res=> {s = res.data.saldo})
    .catch(err => {
        alert("ERRO: " + err);
    });
    return s;
}

