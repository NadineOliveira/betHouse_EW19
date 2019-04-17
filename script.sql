INSERT INTO `ew_tp`.`module`
(`oid`,
`moduleid`,
`modulename`)
VALUES
(1,'sv3','ClienteRegular'),
(2,'sv4','ClientePremium'),
(3,'sv5','Admin');
INSERT INTO `ew_tp`.`group`
(`oid`,
`groupname`,
`module_oid`)
VALUES
(1,'Regular','1'),
(2,'Premium','2'),
(3,'Admin','3');
INSERT INTO `ew_tp`.`group_module`
(`group_oid`,
`module_oid`)
VALUES
(1,1),
(2,2),
(3,3);

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
(2,2),
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
`estado`)
VALUES
(1,1.3,2.5,2.3,'2019-11-22','Aberto'),
(2,1.9,4,1.3,'2019-11-24','Aberto');

INSERT INTO `ew_tp`.`equipa_evento`
(`equipa_oid`,
`evento_oid`)
VALUES
(1,1),
(2,1),
(3,2),
(4,2);



