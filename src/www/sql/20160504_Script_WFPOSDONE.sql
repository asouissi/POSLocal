
-- Delete the old workflow 'WSPOSDONE' to chagne his name to 'WFPOSDONE'
DELETE FROM DPRWORSTEP WHERE WORCODE ='WSPOSDONE';
DELETE FROM WSTCONSEQUENCE WHERE WORCODE ='WSPOSDONE'; 
DELETE FROM WSTJUMP  WHERE WORCODE ='WSPOSDONE'; 
DELETE FROM LANWORSTEP WHERE WORCODE ='WSPOSDONE'; 
DELETE FROM WORSTEP WHERE WORCODE ='WSPOSDONE'; 
DELETE FROM LANWORKFLOW WHERE WORCODE ='WSPOSDONE'; 
DELETE FROM WORKFLOW WHERE WORCODE ='WSPOSDONE'; 


-- ADD 2 option site for POS ( Available workflow and Available formalite for POS)

Insert into TOPTION (TOPTABLE) values ('POS');

Insert into LANTOPTION (TOPTABLE,LANCODE,TOPLIBELLE) values ('POS','EN','Specifics on POS');
Insert into LANTOPTION (TOPTABLE,LANCODE,TOPLIBELLE) values ('POS','FR','Spécificités sur POS');

Insert into TOPPARAM (TOPTABLE,TPAPARAM,UGECODE,TPALOGIQUE,TPADATE,TPANOMBRE,TPATEXTE) values ('POS','FORCODEPOS','_ORIG_',null,null,null,'DOCPOS');
Insert into TOPPARAM (TOPTABLE,TPAPARAM,UGECODE,TPALOGIQUE,TPADATE,TPANOMBRE,TPATEXTE) values ('POS','WORKFLOWAVAILABLE','_ORIG_','1',null,null,null);



-- Add the new workflow 'WFPOSDONE'
Insert into WORKFLOW (WORCODE,WORDEST,WORSTATUS,WORWEIGHT) values ('WFPOSDONE','AVDOSS','ACTIF','0');
Insert into LANWORKFLOW (WORCODE,LANCODE,WORLABEL,WORDESCRIPTION) values ('WFPOSDONE','EN','POS Done','Modifications in POS are done');
Insert into WORSTEP (WORCODE,WSTORDER,WSTEXECUTIONORDER,WSTTYPE,WSTACTIONTYPE,WSTACTIONCODE,WSTACTIONMODE,WSTFLAGEXECUTEONCE,WSTEXECUTIONMODE,RULIDJUMPAUTO) values ('WFPOSDONE','0','0','BEGIN','EVT','EVF_DEMFIN',null,'1','BOTH',null);
Insert into WORSTEP (WORCODE,WSTORDER,WSTEXECUTIONORDER,WSTTYPE,WSTACTIONTYPE,WSTACTIONCODE,WSTACTIONMODE,WSTFLAGEXECUTEONCE,WSTEXECUTIONMODE,RULIDJUMPAUTO) values ('WFPOSDONE','1','1',null,'EVT','EVF_VALIDER',null,'1','AUTO',null);
Insert into LANWORSTEP (WORCODE,WSTORDER,LANCODE,WSTLABEL,WSTDESCRIPTION) values ('WFPOSDONE','0','EN','Submit deal','Submit deal');
Insert into LANWORSTEP (WORCODE,WSTORDER,LANCODE,WSTLABEL,WSTDESCRIPTION) values ('WFPOSDONE','1','EN','Handle consequences','This step is only used to manage consequences');


-- Add the consequences to step 0 of 'WFPOSDONE' to be the same as step 0 of WFARKLE 
Insert into WSTCONSEQUENCE (WORCODE,WSTORDER,WSCORDER,WSCACTIONTYPE,WSCACTIONCODE,WSCACTIONMODE,WSCFLAGMAIL,WORCODEDEST) values ('WFPOSDONE','0','1','FORMALITE','6260',null,null,null);
Insert into WSTCONSEQUENCE (WORCODE,WSTORDER,WSCORDER,WSCACTIONTYPE,WSCACTIONCODE,WSCACTIONMODE,WSCFLAGMAIL,WORCODEDEST) values ('WFPOSDONE','0','2','FORMALITE','6287',null,null,null);
Insert into WSTCONSEQUENCE (WORCODE,WSTORDER,WSCORDER,WSCACTIONTYPE,WSCACTIONCODE,WSCACTIONMODE,WSCFLAGMAIL,WORCODEDEST) values ('WFPOSDONE','0','3','FORMALITE','6293',null,null,null);
Insert into WSTCONSEQUENCE (WORCODE,WSTORDER,WSCORDER,WSCACTIONTYPE,WSCACTIONCODE,WSCACTIONMODE,WSCFLAGMAIL,WORCODEDEST) values ('WFPOSDONE','0','4','PROCESS','256',null,null,null);
Insert into WSTCONSEQUENCE (WORCODE,WSTORDER,WSCORDER,WSCACTIONTYPE,WSCACTIONCODE,WSCACTIONMODE,WSCFLAGMAIL,WORCODEDEST) values ('WFPOSDONE','0','5','CHANGE_PHASE','D_WTDEC',null,null,null);
Insert into WSTCONSEQUENCE (WORCODE,WSTORDER,WSCORDER,WSCACTIONTYPE,WSCACTIONCODE,WSCACTIONMODE,WSCFLAGMAIL,WORCODEDEST) values ('WFPOSDONE','0','6','CONTROLS','U_BLIN',null,null,null);
Insert into LANWSTCONSEQUENCE (WORCODE,WSTORDER,WSCORDER,LANCODE,WSTLABEL,WSTDESCRIPTION) values ('WFPOSDONE','0','1','EN','Consequence 1','Enter underwriting decision (1st level of underwriters)');
Insert into LANWSTCONSEQUENCE (WORCODE,WSTORDER,WSCORDER,LANCODE,WSTLABEL,WSTDESCRIPTION) values ('WFPOSDONE','0','2','EN','Consequence 2','Enter underwriting decision (2nd level of underwriters)');
Insert into LANWSTCONSEQUENCE (WORCODE,WSTORDER,WSCORDER,LANCODE,WSTLABEL,WSTDESCRIPTION) values ('WFPOSDONE','0','3','EN','Consequence 3','Enter underwriting decision (3rd level of underwriters)');
Insert into LANWSTCONSEQUENCE (WORCODE,WSTORDER,WSCORDER,LANCODE,WSTLABEL,WSTDESCRIPTION) values ('WFPOSDONE','0','4','EN','Process reserve Dosnum','Process reserve Dosnum');
Insert into LANWSTCONSEQUENCE (WORCODE,WSTORDER,WSCORDER,LANCODE,WSTLABEL,WSTDESCRIPTION) values ('WFPOSDONE','0','5','EN','Update of the deal status','Update of the deal status');
Insert into LANWSTCONSEQUENCE (WORCODE,WSTORDER,WSCORDER,LANCODE,WSTLABEL,WSTDESCRIPTION) values ('WFPOSDONE','0','6','EN','BL Control','BL Control');

-- When we excute the step 0 of 'WFPOSDONE' we will jump to step 1 of 'WFARKLE'
Insert into WSTJUMP (WORCODE,WSTORDER,WORCODEDEST,WSTORDERDEST,RULID) values ('WFPOSDONE','0','WFARKLE','1',null);
Insert into WSTJUMP (WORCODE,WSTORDER,WORCODEDEST,WSTORDERDEST,RULID) values ('WFPOSDONE','1','WFARKLE','1',null);


-- When we excute the step 0 of 'WFARKLE'  and decision is more info requested we will jump to step 1 of 'WFPOSDONE'

Insert into WSTJUMP (WORCODE,WSTORDER,WORCODEDEST,WSTORDERDEST,RULID) values ('WFARKLE','1','WFPOSDONE','1','3280');

-- Add the consequences to step 1 of 'WFPOSDONE' to close Formlite 6365
Insert into WSTCONSEQUENCE (WORCODE,WSTORDER,WSCORDER,WSCACTIONTYPE,WSCACTIONCODE,WSCACTIONMODE,WSCFLAGMAIL,WORCODEDEST) values ('WFPOSDONE','1','1','CLOSE_FORMALITE','6365',null,null,null);



-- Add the consequences 'FORMALITE' with forid = 6365 to step 1 of the 'WFARKLE' when decision is more info requested, then Pos can detected that there is a task to do

Insert into WSTCONSEQUENCE (WORCODE,WSTORDER,WSCORDER,WSCACTIONTYPE,WSCACTIONCODE,WSCACTIONMODE,WSCFLAGMAIL,WORCODEDEST) values ('WFARKLE','1','18','FORMALITE','6365',null,null,null);
Insert into LANWSTCONSEQUENCE (WORCODE,WSTORDER,WSCORDER,LANCODE,WSTLABEL,WSTDESCRIPTION) values ('WFARKLE','1','18','EN','More info requested','More info requested');


Insert into CUSDEFDATA (CSEID,CDEORDRE,CDDORDRE,CDDSTRINGVALUE,CDDNUMERICVALUE,CDDDATEVALUE,CDDBOOLEANVALUE) values ('91','1','204',null,'18',null,null);
Insert into CUSDEFDATA (CSEID,CDEORDRE,CDDORDRE,CDDSTRINGVALUE,CDDNUMERICVALUE,CDDDATEVALUE,CDDBOOLEANVALUE) values ('91','2','204','WFARKLE',null,null,null);
Insert into CUSDEFDATA (CSEID,CDEORDRE,CDDORDRE,CDDSTRINGVALUE,CDDNUMERICVALUE,CDDDATEVALUE,CDDBOOLEANVALUE) values ('91','3','204',null,'1',null,null);

Insert into CDDRUL (CSEID,CDEORDRE,CDDORDRE,RULID) values ('91','1','204','3274');
Insert into CDDRUL (CSEID,CDEORDRE,CDDORDRE,RULID) values ('91','2','204','3274');
Insert into CDDRUL (CSEID,CDEORDRE,CDDORDRE,RULID) values ('91','3','204','3274');



