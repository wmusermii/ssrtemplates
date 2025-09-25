CREATE TABLE m_role (
    idRole varchar(10) NOT NULL,
    roleName varchar(200),
    roleDescription varchar NULL,
    deleteable bool NULL DEFAULT false,
    created_by varchar NULL,
    created_at timestamp NULL,
    updated_by varchar NULL,
    updated_at timestamp NULL,
    CONSTRAINT m_role_pk PRIMARY KEY (idRole)
);

CREATE TABLE m_group (
    idgroup varchar NOT NULL,
    groupname varchar,
    description varchar,
    menublob jsonb,
    deleteable bool NULL DEFAULT false,
    created_by varchar,
    created_at timestamp,
    updated_by varchar,
    updated_at timestamp,
    CONSTRAINT m_group_pk PRIMARY KEY (idgroup)
);

CREATE TABLE m_icons (
	code varchar not null,
	"type" varchar DEFAULT 'prime'::character varying,
	codeother varchar,
	description varchar(200),
	CONSTRAINT m_icons_pk PRIMARY KEY (code)
);

CREATE TABLE m_user (
    iduser varchar NOT NULL,
    "password" varchar NOT NULL,
    idgroup varchar NULL,
    fullname varchar NULL,
    mobile varchar NULL DEFAULT 20,
    email varchar NULL,
    twofa_secret varchar NULL,
    is_twofa_enabled bool NULL DEFAULT false,
    isadmin bool NULL DEFAULT false,
    created_by varchar NULL,
    created_at timestamp NULL,
    updated_by varchar NULL,
    updated_at timestamp NULL,
    CONSTRAINT m_user_pk PRIMARY KEY (iduser),
    CONSTRAINT m_user_m_group_fk FOREIGN KEY (idgroup) REFERENCES m_group (idgroup) ON DELETE CASCADE
);

CREATE TABLE m_menus (
    idMenu int4 NOT NULL,
    nameMenu varchar(100) NOT NULL,
    pathMenu varchar(1000) NULL,
    idAppMenu int4 NULL DEFAULT 0,
    iconMenu varchar,
    isCustomMenu bool NULL DEFAULT false,
    created_at timestamp NULL,
    created_by varchar(100) NULL,
    updated_at timestamp NULL,
    updated_by varchar(100) NULL,
    CONSTRAINT m_menus_pk PRIMARY KEY (idMenu),
    CONSTRAINT m_menus_m_icons_fk FOREIGN KEY (iconMenu) REFERENCES m_icons (code) ON DELETE CASCADE
);

CREATE SEQUENCE m_menus_seq START
WITH
    1 INCREMENT BY 1 MINVALUE 1 NO maxvalue CACHE 1;

ALTER TABLE m_menus
ALTER COLUMN idMenu
SET DEFAULT nextval ('m_menus_seq');

CREATE TABLE m_menu_role (
    idMenu int4 NOT NULL,
    idRole varchar(200) NULL,
    CONSTRAINT m_menu_role_pk PRIMARY KEY (idMenu, idRole),
    CONSTRAINT m_menu_role_m_menus_fk FOREIGN KEY (idMenu) REFERENCES m_menus (idMenu) ON DELETE CASCADE,
    CONSTRAINT m_menu_role_m_role_fk FOREIGN KEY (idRole) REFERENCES m_role (idRole) ON DELETE CASCADE
);

CREATE TABLE m_smtp (
    id VARCHAR(50) NOT NULL,
    smtp VARCHAR(100),
    usermail VARCHAR(100),
    password VARCHAR(100),
    service VARCHAR(100),
    secret VARCHAR(200),
    refreshtoken VARCHAR(500),
    accesstoken VARCHAR(500),
    port INTEGER,
    CONSTRAINT m_smtp_pk PRIMARY KEY (id)
);

create table m_config (
    groupName varchar(500) not null,
    configName varchar(500) not null,
    configValue varchar(500),
    description varchar(500),
    CONSTRAINT m_config_pk PRIMARY KEY (groupName, configName)
)
create table m_api_approval (
    idMenu int4 NOT NULL,
    idRole varchar(200) NOT NULL,
    requestUrl varchar not null,
    CONSTRAINT m_api_approval_pk PRIMARY KEY (idMenu, idRole, requestUrl),
    CONSTRAINT m_api_approval_m_menus_fk FOREIGN KEY (idMenu) REFERENCES m_menus (idMenu) ON DELETE CASCADE,
    CONSTRAINT m_api_approval_m_role_fk FOREIGN KEY (idRole) REFERENCES m_role (idRole) ON DELETE CASCADE
);

create table t_audit_trail (
	idaudit int4 not null,
	iduser varchar,
	httpmethod varchar(7) NULL DEFAULT 'POST'::character varying,
	responsestatus int NULL DEFAULT 200,
	requesturl varchar,
	created_by varchar,
	created_at timestamp,
	updated_at timestamp,
	updated_by varchar(100),
	CONSTRAINT t_audit_trail_pk PRIMARY KEY (idaudit),
	CONSTRAINT t_audit_trail_m_user_fk FOREIGN KEY (iduser) REFERENCES m_user(iduser) ON DELETE cascade
);

COMMENT ON COLUMN t_audit_trail.responsestatus IS '20x, 30x, 40x, 50x';

COMMENT ON COLUMN t_audit_trail.httpmethod IS 'POST GET PUT DELETE';

CREATE SEQUENCE t_audit_trail_seq START
WITH
    1 INCREMENT BY 1 MINVALUE 1 NO maxvalue CACHE 1;

ALTER TABLE t_audit_trail
ALTER COLUMN idaudit
SET DEFAULT nextval ('t_audit_trail_seq');

create table t_audit_trail_data (
    idaudit int4 not null,
    requestbody jsonb,
    responsebody jsonb,
    CONSTRAINT t_audit_trail_data_pk PRIMARY KEY (idaudit),
    CONSTRAINT t_audit_trail_data_t_audit_trail_fk FOREIGN KEY (idaudit) REFERENCES t_audit_trail (idaudit) ON DELETE cascade
);

create table t_task (
    idtask int4 not null,
    idaudit int4 not null,
    idMenu int4 NOT null,
    idRole varchar(200) NOT NULL,
    iduserapprover varchar,
    status VARCHAR(20) DEFAULT 'PENDING',
    CONSTRAINT t_task_pk PRIMARY KEY (idtask),
    CONSTRAINT t_task_t_audit_trail_fk FOREIGN KEY (idaudit) REFERENCES t_audit_trail (idaudit) ON DELETE cascade,
    CONSTRAINT t_task_m_user_fk FOREIGN KEY (iduserapprover) REFERENCES m_user (iduser) ON DELETE cascade,
    CONSTRAINT t_task_m_menus_fk FOREIGN KEY (idMenu) REFERENCES m_menus (idMenu) ON DELETE cascade,
    CONSTRAINT t_task_m_role_fk FOREIGN KEY (idRole) REFERENCES m_role (idRole) ON DELETE cascade
);

CREATE SEQUENCE t_task_seq START
WITH
    1 INCREMENT BY 1 MINVALUE 1 NO maxvalue CACHE 1;

ALTER TABLE t_task
ALTER COLUMN idtask
SET DEFAULT nextval ('t_task_seq');

COMMENT ON COLUMN t_task.status IS 'PENDING, APPROVED, REJECTED';

COMMENT ON COLUMN t_task.iduserapprover IS 'last/current approver';

create table t_task_approver (
    idtask int4 not null,
    iduserapprover varchar not null,
    sequenceno int4,
    description varchar(500),
    status VARCHAR(20) DEFAULT 'PENDING',
    updated_at timestamp,
    updated_by varchar(100),
    CONSTRAINT t_task_approver_pk PRIMARY KEY (idtask, iduserapprover),
    CONSTRAINT t_task_approver_t_task_fk FOREIGN KEY (idtask) REFERENCES t_task (idtask) ON DELETE cascade,
    CONSTRAINT t_task_approver_m_user_fk FOREIGN KEY (iduserapprover) REFERENCES m_user (iduser) ON DELETE cascade
);

CREATE SEQUENCE t_task_approver_seq START
WITH
    1 INCREMENT BY 1 MINVALUE 1 NO maxvalue CACHE 1;

ALTER TABLE t_task_approver
ALTER COLUMN sequenceno
SET DEFAULT nextval ('t_task_approver_seq');

COMMENT ON COLUMN t_task_approver.sequenceno IS 'manually modify sequence in code';

COMMENT ON COLUMN t_task_approver.status IS 'PENDING, APPROVED, REJECTED';