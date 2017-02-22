-- Default financing company
-- select * from topparam where tpaparam='PAGDOSSTEGESTION';

declare
	nForId NUMBER := NULL;
	nCount NUMBER := NULL;
begin
	-- Chat tasks
	select count(*) into nCount from TTRPARAM where ttrnom='FORTYPE' and ttpcode='CHAT';
	
	if nCount = 0 THEN
		Insert into TTRPARAM (TTRNOM, TTPCODE ) values ( 'FORTYPE', 'CHAT' );
	END IF;

	select count(*) into nCount from LANTTRPARAM where ttrnom='FORTYPE' and ttpcode='CHAT' and lancode='EN';
	
	if nCount = 0 THEN
		Insert into LANTTRPARAM (TTRNOM, TTPCODE, LANCODE, TTPLIBELLE, TTPHELPTEXT ) values ( 'FORTYPE', 'CHAT', 'EN', 'PoS Chat Items', 'PoS Chat Items' );
	END IF;

	select count(*) into nCount from FORMALITE where forcode = 'CHATPOS';

	IF nCount = 0 THEN
		select SEQ_FORID.NEXTVAL into nForId from dual;

		insert into formalite (FORID,FORCODE,FORDEST,TACCODE,UGECODE, FORTYPE) values (nForId,'CHATPOS','AVDOSS','GLOBAL','_ORIG_', 'CHAT');
		insert into lanformalite(FORID,LANCODE,FORLIBELLE) values(nForId,'EN','Chat from POS' );
	END IF;

	-- insert into administratif(ADMID, DOSIDPROSPECT, DPRVERSION, FORID, ADMMSGSUBJECT, ADMDTEMIS, ADMMSGCONTENT) values ( SEQ_ADMID.NEXTVAL, 75427, 'NEGO', 6473362, 'My first message', SYSDATE, 'My first comment' );
	-- select max(admid) from administratif;
	-- insert into admstatus(ADMID,ASTORDRE,ASTSTATUS,ASTDTBEG,UTICODESENDER,) values (132024,1,'IN',SYSDATE,'DEALER1');

	-- DECISION
	select count(*) into nCount from AVTDECISION WHERE adecode = 'PROMOTETODEAL';

	IF nCount = 0 THEN
		insert into avtdecision (adecode) values ('PROMOTETODEAL');
		insert into lanavtdecision values ( 'PROMOTETODEAL', 'EN', 'Promote to deal' );
	END IF;


	-- DPRNUMERO FORMAT MANAGEMENT. CHANGE THE TEST TO ACTIVATE
	IF 0 = 1 THEN
		update 	toptpgparam 
		set 	ttplogique	= 0
		where  	TOPTABLE 	= 'FRONT_DEAL'
		AND 	TTPPARAM    = 'ALPHANUMSEQACTIVE';
		
		update numero set numnumero=to_number( numaplhanum ) where numcible='DPRNUMERO';

		update topparam set tpatexte='XXXXXXXX' where tpaparam='DPRSOC';
	END IF;

	update topparam set tpalogique=1 where toptable='AVDOSS' and tpaparam='ORDERBY_DESC';

	update devise set devsymbole='$' where devcode='USD' and devsymbole='USD';
	update devise set devsymbole='£' where devcode='GBP' and devsymbole='GBP';
	
	
	-- create roles DRIVER, DRIVER2, FLMANAG for fleet
	Insert into "role" (ROLCODE,ROLCODEEXTERNE,ROLFLAGORFI,ROLFLAGATTRIBUT,ROLFLAGENTRANT,ROLFLAGSORTANT) values ('DRIVER','DRIVER',1,1,1,1);
	Insert into LANROLE (ROLCODE,LANCODE,ROLLIBELLE) values ('DRIVER','EN','Driver (Primary)');
	Insert into LANROLE (ROLCODE,LANCODE,ROLLIBELLE) values ('DRIVER','DE','Driver (Primary)');
	Insert into LANROLE (ROLCODE,LANCODE,ROLLIBELLE) values ('DRIVER','FR','Conducteur principal');

	Insert into "role" (ROLCODE,ROLCODEEXTERNE,ROLFLAGORFI,ROLFLAGATTRIBUT,ROLFLAGENTRANT,ROLFLAGSORTANT) values ('DRIVER2','DRIVER',0,1,1,1);
	Insert into LANROLE (ROLCODE,LANCODE,ROLLIBELLE) values ('DRIVER2','EN','Driver (Secondary)');
	Insert into LANROLE (ROLCODE,LANCODE,ROLLIBELLE) values ('DRIVER2','DE','Driver (Secondary)');
	Insert into LANROLE (ROLCODE,LANCODE,ROLLIBELLE) values ('DRIVER2','FR','Conducteur secondaire');

	Insert into "role" (ROLCODE,ROLCODEEXTERNE,ROLFLAGORFI,ROLFLAGATTRIBUT,ROLFLAGENTRANT,ROLFLAGSORTANT) values ('FLMANAG','FLMANAG',0,1,1,1);
	Insert into LANROLE (ROLCODE,LANCODE,ROLLIBELLE) values ('FLMANAG','EN','Fleet Manager');
	Insert into LANROLE (ROLCODE,LANCODE,ROLLIBELLE) values ('FLMANAG','DE','Fleet Manager');
	Insert into LANROLE (ROLCODE,LANCODE,ROLLIBELLE) values ('FLMANAG','FR','Gestionnaire de Flotte');
	
	-- set skin for a user (skin-red, skin-blue, skin-jade, skin-cass)
	select * from utipreference where uticode='ORFI' and uprcode='POSSKIN';
	update utipreference set uprstringvalue='skin-red' where uticode='ORFI' and uprcode='POSSKIN';


end;
/
