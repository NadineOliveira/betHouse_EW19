INSERT INTO `ew_tp`.`module`
(`oid`,
`moduleid`,
`modulename`)
VALUES
(1,'area3','GerirEventos'),
(2,'page2','Eventos'),
(3,'area4','Apostar'),
(4,'area1','Perfil'),
(5,'area7','HistoricoEquipas'),
(6,'page9','EventosPremium'),
(7,'sv5','Admin'),
(8,'area5','Admin'),
(9,'sv3','Users');
INSERT INTO `ew_tp`.`group`
(`oid`,
`groupname`,
`module_oid`)
VALUES
(1,'Regular','1'),
(2,'Premium','1'),
(3,'Admin','8');
INSERT INTO `ew_tp`.`group_module`
(`group_oid`,
`module_oid`)
VALUES
(1,1),
(1,2),
(1,3),
(1,4),
(1,9),
(2,5),
(2,6),
(3,7),
(3,8);

INSERT INTO `ew_tp`.`user`
(`oid`,
`username`,
`password`,
`email`,
`saldo`,
`group_oid`)
VALUES
(1,'n','n','n@alunos.com',22.20,'1'),
(2,'u','u','u@alunos.com',12.30,'2'),
(3,'a','a','a@alunos.com',12.00,'3');

INSERT INTO `ew_tp`.`user_group`
(`user_oid`,
`group_oid`)
VALUES
(1,1),
(2,1),
(2,2),
(3,1),
(3,2),
(3,3);

INSERT INTO `ew_tp`.`equipa`
(`oid`,
`nome`)
VALUES
(1,'Porto'),
(2,'Braga'),
(3,'Benfica'),
(4,'Sporting');
INSERT INTO `ew_tp`.`evento`
(`oid`,
`odd1`,
`oddx`,
`odd2`,
`data`,
`estado`,
`premium`)
VALUES
(1,1.3,2.5,2.3,'2019-11-22','Aberto','true'),
(2,1.9,4,1.3,'2019-11-24','Aberto','false');

INSERT INTO `ew_tp`.`equipa_evento`
(`equipa_oid`,
`evento_oid`)
VALUES
(1,1),
(2,1),
(3,2),
(4,2);



