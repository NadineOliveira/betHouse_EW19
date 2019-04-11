-- Group [Group]
create table `group` (
   `oid`  integer  not null,
   `groupname`  varchar(255),
  primary key (`oid`)
);


-- Module [Module]
create table `module` (
   `oid`  integer  not null,
   `moduleid`  varchar(255),
   `modulename`  varchar(255),
  primary key (`oid`)
);


-- User [User]
create table `user` (
   `oid`  integer  not null,
   `username`  varchar(255),
   `password`  varchar(255),
   `email`  varchar(255),
  primary key (`oid`)
);


-- Evento [ent1]
create table `evento` (
   `oid`  integer  not null,
   `odd1`  double precision,
   `oddx`  double precision,
   `odd2`  double precision,
   `data`  date,
  primary key (`oid`)
);


-- Equipa [ent2]
create table `equipa` (
   `oid`  integer  not null,
   `nome`  varchar(255),
  primary key (`oid`)
);


-- Aposta [ent4]
create table `aposta` (
   `oid`  integer  not null,
   `resultado`  varchar(255),
   `valor`  double precision,
   `data`  date,
  primary key (`oid`)
);


-- Group_DefaultModule [Group2DefaultModule_DefaultModule2Group]
alter table `group`  add column  `module_oid`  integer;
alter table `group`   add index fk_group_module (`module_oid`), add constraint fk_group_module foreign key (`module_oid`) references `module` (`oid`);


-- Group_Module [Group2Module_Module2Group]
create table `group_module` (
   `group_oid`  integer not null,
   `module_oid`  integer not null,
  primary key (`group_oid`, `module_oid`)
);
alter table `group_module`   add index fk_group_module_group (`group_oid`), add constraint fk_group_module_group foreign key (`group_oid`) references `group` (`oid`);
alter table `group_module`   add index fk_group_module_module (`module_oid`), add constraint fk_group_module_module foreign key (`module_oid`) references `module` (`oid`);


-- User_DefaultGroup [User2DefaultGroup_DefaultGroup2User]
alter table `user`  add column  `group_oid`  integer;
alter table `user`   add index fk_user_group (`group_oid`), add constraint fk_user_group foreign key (`group_oid`) references `group` (`oid`);


-- User_Group [User2Group_Group2User]
create table `user_group` (
   `user_oid`  integer not null,
   `group_oid`  integer not null,
  primary key (`user_oid`, `group_oid`)
);
alter table `user_group`   add index fk_user_group_user (`user_oid`), add constraint fk_user_group_user foreign key (`user_oid`) references `user` (`oid`);
alter table `user_group`   add index fk_user_group_group (`group_oid`), add constraint fk_user_group_group foreign key (`group_oid`) references `group` (`oid`);


-- Equipa_Evento [rel1]
create table `equipa_evento` (
   `equipa_oid`  integer not null,
   `evento_oid`  integer not null,
  primary key (`equipa_oid`, `evento_oid`)
);
alter table `equipa_evento`   add index fk_equipa_evento_equipa (`equipa_oid`), add constraint fk_equipa_evento_equipa foreign key (`equipa_oid`) references `equipa` (`oid`);
alter table `equipa_evento`   add index fk_equipa_evento_evento (`evento_oid`), add constraint fk_equipa_evento_evento foreign key (`evento_oid`) references `evento` (`oid`);


-- Aposta_Evento [rel2]
create table `aposta_evento` (
   `aposta_oid`  integer not null,
   `evento_oid`  integer not null,
  primary key (`aposta_oid`, `evento_oid`)
);
alter table `aposta_evento`   add index fk_aposta_evento_aposta (`aposta_oid`), add constraint fk_aposta_evento_aposta foreign key (`aposta_oid`) references `aposta` (`oid`);
alter table `aposta_evento`   add index fk_aposta_evento_evento (`evento_oid`), add constraint fk_aposta_evento_evento foreign key (`evento_oid`) references `evento` (`oid`);


