CREATE OR REPLACE PACKAGE PAV4_GENERIC_POS_CHART
AS

	/* Wholesale */
	FUNCTION F_WSOUTSTANDING(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_WSTABLESTOCK(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_WSTABLEINVOICESINTEREST(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_WSTABLEINVOICESPRINCIPAL(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_HTMLCHECKUSER(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;
	
END;
/


CREATE OR REPLACE PACKAGE BODY PAV4_GENERIC_POS_CHART
AS

--**************************************************************************************************************
  FUNCTION GETLOCALE(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE)
    RETURN VARCHAR2
  IS
    locale VARCHAR2(2):='';
    BEGIN
	    select UPPER(SUBSTR(MAX(uprstringvalue), 1, 2))
	    into locale
	    from utipreference
	    where uticode = suticode and uprcode = 'LOCALE';
    RETURN locale;
  END ;
  
--**************************************************************************************************************
  FUNCTION GETACTID(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE)
    RETURN VARCHAR2
  IS
    actid VARCHAR2(256):='';
  BEGIN
    select ACTID into actid
      from UTIACTDEFAULT
      where UTICODE = suticode --Logged user
      and UADORDRE = (
	      select min(UADORDRE)
	      from UTIACTDEFAULT
	      where UTICODE = suticode --Logged user
	      and ROLCODE = 'EMPRUNT'
	      and UADDTSTART <= SYSDATE
	      and UADDTEND >= SYSDATE
	      or UADDTEND is null
	      and UADLINKTYPE = 'POSWHOLESALE'
      );
    RETURN actid;
  END;


--**************************************************************************************************************
  FUNCTION F_HTMLCHECKUSER(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
  RETURN CLOB
  IS
    ljson CLOB:='';
	  crlf CHAR(15) :='<br>';
  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';  

    ljson := ljson || 
'{
    "title": "Check user",
    "type" : "HTML",
    "content": "';
    ljson := ljson || 'uticode:' || suticode || crlf;
    ljson := ljson || 'locale:' || GETLOCALE(suticode) || crlf;
    BEGIN
      ljson := ljson || 'actid:' || GETACTID(suticode) || crlf;
    EXCEPTION	WHEN OTHERS THEN
      ljson := ljson || 'actid: !!NONE!!' || crlf;
    END;
    ljson := ljson || '"
}';
    RETURN ljson;
  END ;


  FUNCTION F_WSOUTSTANDING(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
      l_locale VARCHAR2(2);
	  crlf CHAR(2) :='
';
	  comma CHAR(2) :=',';
    ljson CLOB := '';
    l_actid VARCHAR2(256):='';
    CURSOR C1
    IS
select DOS.DOSNOM, LTP.TPGLIBELLE,--this represents the name of each bar
DOS.DOSMTCOMITE, --this represents one whole bar (the sum of each of the 3 parts)
PA_COM_COMMON.F_GET_OUTSTAND_MASTER_FACIL(ACT.ACTID, DOS.DOSID) as outstanding, --this represents the blue part of the bar
PA_COM_COMMON.F_GET_PENDING_MASTER_FACIL(ACT.ACTID, DOS.DOSID) as pending, --this represents the red part of the bar
DOS.DOSMTCOMITE - PA_COM_COMMON.F_GET_OUTSTAND_MASTER_FACIL(ACT.ACTID, DOS.DOSID) - PA_COM_COMMON.F_GET_PENDING_MASTER_FACIL(ACT.ACTID, DOS.DOSID) as available --this represents the grey part of the bar
from DOSSIER DOS
inner join TPROFILGESTION TPR
on TPR.TPGCODE = DOS.TPGCODE
inner join DOSACTEUR DAC
on DAC.DOSID = DOS.DOSID
inner join ACTEUR ACT
on ACT.ACTID = DAC.ACTID
inner join DOSPHASE DPH
on DPH.DOSID = DOS.DOSID
inner join LANTPROFILGESTION LTP
on LTP.TPGCODE = TPR.TPGCODE
and LTP.LANCODE = l_locale
where TPR.TPGFLAGFACILITY = 1
and TPR.TPGWHOLESALETYPE is not null
and DAC.ROLCODE = 'EMPRUNT'
and DAC.DACDTFIN is null
and DAC.ACTID = l_actid --Use the ACTID of the actor corresponding to the user that has logged in.
and DPH.PHACODE = 'ENG'
and DPH.DPHDTFIN is null
order by LTP.TPGLIBELLE;

  BEGIN

    BEGIN
      l_actid := GETACTID(suticode);
      l_locale := GETLOCALE(suticode);
    EXCEPTION	WHEN OTHERS THEN
      return F_HTMLCHECKUSER(suticode, p_params);
    END;

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';  

    ljson := ljson || '{            
  "type": "Bar",            
  "title": "PAV4_GENERIC_POS_CHART.F_WSOUTSTANDING.OutstandingSituation",  
  "options": {
     "stacked": true
    ,"legend": {
        "display": true
       ,"position": "bottom"
     }

  },
  "link": "#deals",  
  "data": {  
';
    ljson := ljson || '  "labels": [';
	  comma := '';
    FOR C1r IN C1
    LOOP
      ljson := ljson || comma || '"' || C1R.TPGLIBELLE || '"';
	  comma := ', ';
    END LOOP;
    ljson := ljson || '],' || crlf;
    ljson := ljson || '  "datasets": [' || crlf;

    -- dataset #1 (red)
    ljson := ljson || '  {' || crlf;
    ljson := ljson || '     "label": "Pending/En attente"' || crlf;
	  ljson := ljson || '    ,"fillColor": "red"' || crlf;
    ljson := ljson || '    ,"strokeColor": "red"'|| crlf;
  /*
    ljson := ljson || '    "pointColor": color[0],
    ljson := ljson || '    "pointStrokeColor": "#fff",
    ljson := ljson || '    "pointHighlightFill": "#fff",
    ljson := ljson || '    "pointHighlightStroke": color[0],
	*/
    ljson := ljson || '    ,"data": [';
	  comma := '';
    FOR C1r IN C1
    LOOP
      ljson := ljson || comma || coalesce(C1R.pending, 0);
	  comma := ', ';
    END LOOP;
	ljson := ljson || ']' || crlf;
    ljson := ljson || '  }' || crlf;
	
    -- dataset #2 (blue)
    ljson := ljson || ' ,{' || crlf;
    ljson := ljson || '     "label": "Outstanding/Encours"' || crlf;
	  ljson := ljson || '    ,"fillColor": "blue"' || crlf;
    ljson := ljson || '    ,"strokeColor": "blue"'|| crlf;
    /*
	ljson := ljson || '    "fillColor": color[0]',
    ljson := ljson || '    "pointStrokeColor": "#fff",
    ljson := ljson || '    "pointHighlightFill": "#fff",
    ljson := ljson || '    "pointHighlightStroke": color[0],
	*/
    ljson := ljson || '    ,"data": [';
	  comma := '';
    FOR C1r IN C1
    LOOP
      ljson := ljson || comma || coalesce(C1R.outstanding, 0);
	  comma := ', ';
    END LOOP;
	ljson := ljson || ']' || crlf;
    ljson := ljson || '  }' || crlf;

    -- dataset #3 (grey)
    ljson := ljson || ' ,{' || crlf;
    ljson := ljson || '     "label": "Available/Disponible"' || crlf;
	  ljson := ljson || '    ,"fillColor": "gray"' || crlf;
    ljson := ljson || '    ,"strokeColor": "gray"'|| crlf;
    /*
    ljson := ljson || '    "pointColor": color[0],
    ljson := ljson || '    "pointStrokeColor": "#fff",
    ljson := ljson || '    "pointHighlightFill": "#fff",
    ljson := ljson || '    "pointHighlightStroke": color[0],
	*/
    ljson := ljson || '    ,"data": [';
	  comma := '';
    FOR C1r IN C1
    LOOP
      ljson := ljson || comma || coalesce(C1R.available, 0);
	  comma := ', ';
    END LOOP;
	ljson := ljson || ']' || crlf;
    ljson := ljson || '  }' || crlf;

    ljson := ljson || ']' || crlf;
    ljson := ljson || '}' || crlf;
    ljson := ljson || '}' || crlf;

    --dbms_output.put_line(ljson);
    RETURN ljson;
  
  END ;
  
--**************************************************************************************************************
  FUNCTION F_WSTABLESTOCK(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
    ljson CLOB:='';
    crlf CHAR(2):='
';
    l_locale VARCHAR2(2):='';
    l_actid VARCHAR2(256):='';
	  comma CHAR(2) :='';
    CURSOR C1
    IS
select LAC.ACADESCRIPTION as state,
(
	select count(DOSSIER.DOSID)
	from DOSSIER
	inner join DOSPHASE
	on DOSPHASE.DOSID = DOSSIER.DOSID
	and DOSPHASE.PHACODE = 'ES'
	and DOSPHASE.DPHDTFIN is null
	inner join DOSRUBRIQUE DRU
	on DRU.DOSID = DOSSIER.DOSID
	and DRU.DRUCLASSE = 'F'
	and DRU.DRUTYPE = 'F'
	and DRU.DRUORDRE =
	(
		select min(DRUORDRE)
		from DOSRUBRIQUE
		where DOSID = DRU.DOSID
		and DRUCLASSE = DRU.DRUCLASSE
		and DRUTYPE = DRU.DRUTYPE
	)
	inner join LKDOSRUBITRRUB DIR
	on DIR.DOSID = DRU.DOSID
	and DIR.DRUORDRE = DRU.DRUORDRE
	and DIR.ITRID =
	(
		select min(ITRID)
		from LKDOSRUBITRRUB
		where DOSID = DIR.DOSID
		and DRUORDRE = DIR.DRUORDRE
	)
	and DIR.IRUORDRE =
	(
		select min(IRUORDRE)
		from LKDOSRUBITRRUB
		where DOSID = DIR.DOSID
		and DRUORDRE = DIR.DRUORDRE
		and ITRID = DIR.ITRID
	)
	inner join ITRRUBRIQUE IRU
	on IRU.ITRID = DIR.ITRID
	and IRU.IRUORDRE = DIR.IRUORDRE
	and IRU.ACACODE = LAC.ACACODE
	where DOSIDREFINANCE in
	(
		select DOS.DOSID
		from DOSSIER DOS
		inner join TPROFILGESTION TPR
		on TPR.TPGCODE = DOS.TPGCODE
		inner join DOSACTEUR DAC
		on DAC.DOSID = DOS.DOSID
		inner join ACTEUR ACT
		on ACT.ACTID = DAC.ACTID
		inner join DOSPHASE DPH
		on DPH.DOSID = DOS.DOSID
		where TPR.TPGFLAGFACILITY = 1
		and TPR.TPGWHOLESALETYPE is not null
		and DAC.ROLCODE = 'EMPRUNT'
		and DAC.DACDTFIN is null
		and DAC.ACTID = l_actid --Use the ACTID of the actor corresponding to the user that has logged in.
		and DPH.PHACODE = 'ENG'
		and DPH.DPHDTFIN is null
	)
) as stock,
(
	select nvl(sum(DRE.DREMTECF),0)
    from DOSRUBECHEANCIER DRE
    inner join DOSRUBRIQUE DRU
	on DRE.DOSID = DRU.DOSID
	and DRE.DRUORDRE = DRU.DRUORDRE
    inner join DOSPHASE DPH
	on DPH.DOSID = DRE.DOSID
    inner join DOSSIER DOS
	on DOS.DOSID = DRU.DOSID
	inner join DOSSIER MFA
	on MFA.DOSID = DOS.DOSIDREFINANCE
	inner join TPROFILGESTION TPR
	on TPR.TPGCODE = MFA.TPGCODE
	inner join DOSACTEUR DAC
	on DAC.DOSID = MFA.DOSID
	inner join ACTEUR ACT
	on ACT.ACTID = DAC.ACTID
	inner join DOSPHASE DPM
	on DPM.DOSID = MFA.DOSID
	inner join LKDOSRUBITRRUB DIR
	on DIR.DOSID = DRU.DOSID
	and DIR.DRUORDRE =
	(
		select min(DRUORDRE)
		from DOSRUBRIQUE
		where DOSID = DRU.DOSID
		and DRUCLASSE = DRU.DRUCLASSE
		and DRUTYPE = DRU.DRUTYPE
	)
	and DIR.ITRID =
	(
		select min(ITRID)
		from LKDOSRUBITRRUB
		where DOSID = DIR.DOSID
		and DRUORDRE = DIR.DRUORDRE
	)
	and DIR.IRUORDRE =
	(
		select min(IRUORDRE)
		from LKDOSRUBITRRUB
		where DOSID = DIR.DOSID
		and DRUORDRE = DIR.DRUORDRE
		and ITRID = DIR.ITRID
	)
	inner join ITRRUBRIQUE IRU
	on IRU.ITRID = DIR.ITRID
	and IRU.IRUORDRE = DIR.IRUORDRE
	and IRU.ACACODE = LAC.ACACODE
	where TPR.TPGFLAGFACILITY = 1
	and TPR.TPGWHOLESALETYPE is not null
	and DAC.ROLCODE = 'EMPRUNT'
	and DAC.DACDTFIN is null
	and DAC.ACTID = l_actid --Use the ACTID of the actor corresponding to the user that has logged in.
	and DPM.PHACODE = 'ENG'
	and DPM.DPHDTFIN is null
	and DRE.FACID is null
	and DRE.DRETYPE = 'LOYER'
    and DPH.PHACODE = 'ES'
    and DPH.DPHDTFIN is null
) as outstanding
from LANASSETCATEGORY LAC
where LANCODE = l_locale
AND LAC.ACACODE in ('NEW','DEMO','USED');


    BEGIN
      l_locale := GETLOCALE(suticode);
      BEGIN
        l_actid := GETACTID(suticode);
      EXCEPTION	WHEN OTHERS THEN
        return F_HTMLCHECKUSER(suticode, p_params);
      END;

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';  

      ljson := '{
   "type": "table",
   "title": "PAV4_GENERIC_POS_CHART.F_WSTABLESTOCK.Stock",
   "background": "Green",
   "data": [
';
      comma := '';
      FOR C1r IN C1
      LOOP
        ljson := ljson || comma || '[{"value":   "' || C1R.state || '", "isheader": false}, {"value":     "' || C1R.stock || '"}, {"value":     "' || C1R.outstanding || ' €"}]';
	      comma := ', ';
      END LOOP;
      ljson := ljson || ']}' || crlf;
      RETURN ljson;
  END ;

--***********************************************************************************************************************
  FUNCTION F_WSTABLEINVOICESINTEREST(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
    ljson CLOB:='';
    crlf CHAR(2):='
';
    l_locale VARCHAR2(2):='';
    l_actid VARCHAR2(256):='';
	  comma CHAR(2) :='';
    CURSOR C1
    IS
select TUP.TUPLIBELLE as status,
CASE
	WHEN TUP.TUPCODE = 'DUE' THEN 2
	WHEN TUP.TUPCODE = 'OVERDUE' THEN 3
	WHEN TUP.TUPCODE = 'ONCOMING' THEN 1
END AS Ord
,
CASE
	WHEN TUP.TUPCODE = 'DUE' THEN
	(
		select count(FAC.FACID)
		from FACTURE FAC
		inner join DOSRUBECHEANCIER DRE
		on DRE.FACID = FAC.FACID
		inner join DOSRUBRIQUE DRU
		on DRU.DOSID = DRE.DOSID
		and DRU.DRUORDRE = DRE.DRUORDRE
		inner join RUBACCES RAC
		on RAC.RUBID = DRU.RUBID
		inner join DOSSIER DOS
		on DOS.DOSID = DRU.DOSID
		where FAC.FACDTEXIGIBLE >= SYSDATE
		and FAC.FACDTEXIGIBLE < SYSDATE + 7
		and RAC.RACACCES = 'PREFIN'
		and F_FACMTNONREGLE(FAC.FACID,SYSDATE) > 0
		and DOS.DOSIDREFINANCE in (select MF.DOSID
		from DOSSIER MF
		inner join TPROFILGESTION TPR
		on TPR.TPGCODE = MF.TPGCODE
		inner join DOSACTEUR DAC
		on DAC.DOSID = MF.DOSID
		inner join ACTEUR ACT
		on ACT.ACTID = DAC.ACTID
		inner join DOSPHASE DPH
		on DPH.DOSID = MF.DOSID
		where TPR.TPGFLAGFACILITY = 1
		and TPR.TPGWHOLESALETYPE is not null
		and DAC.ROLCODE = 'EMPRUNT'
		and DAC.DACDTFIN is null
		and DAC.ACTID = l_actid --Use the ACTID of the actor corresponding to the user that has logged in.
		and DPH.PHACODE = 'ENG'
		and DPH.DPHDTFIN is null)
	)

	WHEN TUP.TUPCODE = 'OVERDUE' THEN
	(
		select count(FAC.FACID)
		from FACTURE FAC
		inner join DOSRUBECHEANCIER DRE
		on DRE.FACID = FAC.FACID
		inner join DOSRUBRIQUE DRU
		on DRU.DOSID = DRE.DOSID
		and DRU.DRUORDRE = DRE.DRUORDRE
		inner join RUBACCES RAC
		on RAC.RUBID = DRU.RUBID
		inner join DOSSIER DOS
		on DOS.DOSID = DRU.DOSID
		where FAC.FACDTEXIGIBLE < SYSDATE
		and RAC.RACACCES = 'PREFIN'
		and F_FACMTNONREGLE(FAC.FACID,SYSDATE) > 0
		and DOS.DOSIDREFINANCE in (select MF.DOSID
		from DOSSIER MF
		inner join TPROFILGESTION TPR
		on TPR.TPGCODE = MF.TPGCODE
		inner join DOSACTEUR DAC
		on DAC.DOSID = MF.DOSID
		inner join ACTEUR ACT
		on ACT.ACTID = DAC.ACTID
		inner join DOSPHASE DPH
		on DPH.DOSID = MF.DOSID
		where TPR.TPGFLAGFACILITY = 1
		and TPR.TPGWHOLESALETYPE is not null
		and DAC.ROLCODE = 'EMPRUNT'
		and DAC.DACDTFIN is null
		and DAC.ACTID = l_actid --Use the ACTID of the actor corresponding to the user that has logged in.
		and DPH.PHACODE = 'ENG'
		and DPH.DPHDTFIN is null)
	)
  
	WHEN TUP.TUPCODE = 'ONCOMING' THEN
	(
		select count(FAC.FACID)
		from FACTURE FAC
		inner join DOSRUBECHEANCIER DRE
		on DRE.FACID = FAC.FACID
		inner join DOSRUBRIQUE DRU
		on DRU.DOSID = DRE.DOSID
		and DRU.DRUORDRE = DRE.DRUORDRE
		inner join RUBACCES RAC
		on RAC.RUBID = DRU.RUBID
		inner join DOSSIER DOS
		on DOS.DOSID = DRU.DOSID
		where FAC.FACDTEXIGIBLE > SYSDATE + 7
		and RAC.RACACCES = 'PREFIN'
		and F_FACMTNONREGLE(FAC.FACID,SYSDATE) > 0
		and DOS.DOSIDREFINANCE in (select MF.DOSID
		from DOSSIER MF
		inner join TPROFILGESTION TPR
		on TPR.TPGCODE = MF.TPGCODE
		inner join DOSACTEUR DAC
		on DAC.DOSID = MF.DOSID
		inner join ACTEUR ACT
		on ACT.ACTID = DAC.ACTID
		inner join DOSPHASE DPH
		on DPH.DOSID = MF.DOSID
		where TPR.TPGFLAGFACILITY = 1
		and TPR.TPGWHOLESALETYPE is not null
		and DAC.ROLCODE = 'EMPRUNT'
		and DAC.DACDTFIN is null
		and DAC.ACTID = l_actid --Use the ACTID of the actor corresponding to the user that has logged in.
		and DPH.PHACODE = 'ENG'
		and DPH.DPHDTFIN is null)
	)
END as count,

CASE
	WHEN TUP.TUPCODE = 'DUE' THEN
	(
		select NVL(sum(F_FACMTNONREGLE(FAC.FACID,SYSDATE)),0)
		from FACTURE FAC
		inner join DOSRUBECHEANCIER DRE
		on DRE.FACID = FAC.FACID
		inner join DOSRUBRIQUE DRU
		on DRU.DOSID = DRE.DOSID
		and DRU.DRUORDRE = DRE.DRUORDRE
		inner join RUBACCES RAC
		on RAC.RUBID = DRU.RUBID
		inner join DOSSIER DOS
		on DOS.DOSID = DRU.DOSID
		where FAC.FACDTEXIGIBLE >= SYSDATE
		and FAC.FACDTEXIGIBLE < SYSDATE + 7
		and RAC.RACACCES = 'PREFIN'
		and DOS.DOSIDREFINANCE in (select MF.DOSID
		from DOSSIER MF
		inner join TPROFILGESTION TPR
		on TPR.TPGCODE = MF.TPGCODE
		inner join DOSACTEUR DAC
		on DAC.DOSID = MF.DOSID
		inner join ACTEUR ACT
		on ACT.ACTID = DAC.ACTID
		inner join DOSPHASE DPH
		on DPH.DOSID = MF.DOSID
		where TPR.TPGFLAGFACILITY = 1
		and TPR.TPGWHOLESALETYPE is not null
		and DAC.ROLCODE = 'EMPRUNT'
		and DAC.DACDTFIN is null
		and DAC.ACTID = l_actid --Use the ACTID of the actor corresponding to the user that has logged in.
		and DPH.PHACODE = 'ENG'
		and DPH.DPHDTFIN is null)
	)

	WHEN TUP.TUPCODE = 'OVERDUE' THEN
	(
		select NVL(sum(F_FACMTNONREGLE(FAC.FACID,SYSDATE)),0)
		from FACTURE FAC	
		inner join DOSRUBECHEANCIER DRE
		on DRE.FACID = FAC.FACID
		inner join DOSRUBRIQUE DRU
		on DRU.DOSID = DRE.DOSID
		and DRU.DRUORDRE = DRE.DRUORDRE
		inner join RUBACCES RAC
		on RAC.RUBID = DRU.RUBID
		inner join DOSSIER DOS
		on DOS.DOSID = DRU.DOSID
		where FAC.FACDTEXIGIBLE < SYSDATE
		and RAC.RACACCES = 'PREFIN'
		and DOS.DOSIDREFINANCE in (select MF.DOSID
		from DOSSIER MF
		inner join TPROFILGESTION TPR
		on TPR.TPGCODE = MF.TPGCODE
		inner join DOSACTEUR DAC
		on DAC.DOSID = MF.DOSID
		inner join ACTEUR ACT
		on ACT.ACTID = DAC.ACTID
		inner join DOSPHASE DPH
		on DPH.DOSID = MF.DOSID
		where TPR.TPGFLAGFACILITY = 1
		and TPR.TPGWHOLESALETYPE is not null
		and DAC.ROLCODE = 'EMPRUNT'
		and DAC.DACDTFIN is null
		and DAC.ACTID = l_actid --Use the ACTID of the actor corresponding to the user that has logged in.
		and DPH.PHACODE = 'ENG'
		and DPH.DPHDTFIN is null)
	)

	WHEN TUP.TUPCODE = 'ONCOMING' THEN
	(
		select NVL(sum(F_FACMTNONREGLE(FAC.FACID,SYSDATE)),0)
		from FACTURE FAC
		inner join DOSRUBECHEANCIER DRE
		on DRE.FACID = FAC.FACID
		inner join DOSRUBRIQUE DRU
		on DRU.DOSID = DRE.DOSID
		and DRU.DRUORDRE = DRE.DRUORDRE
		inner join RUBACCES RAC
		on RAC.RUBID = DRU.RUBID
		inner join DOSSIER DOS
		on DOS.DOSID = DRU.DOSID
		where FAC.FACDTEXIGIBLE > SYSDATE + 7
		and RAC.RACACCES = 'PREFIN'
		and DOS.DOSIDREFINANCE in (select MF.DOSID
		from DOSSIER MF
		inner join TPROFILGESTION TPR
		on TPR.TPGCODE = MF.TPGCODE
		inner join DOSACTEUR DAC
		on DAC.DOSID = MF.DOSID
		inner join ACTEUR ACT
		on ACT.ACTID = DAC.ACTID
		inner join DOSPHASE DPH
		on DPH.DOSID = MF.DOSID
		where TPR.TPGFLAGFACILITY = 1
		and TPR.TPGWHOLESALETYPE is not null
		and DAC.ROLCODE = 'EMPRUNT'
		and DAC.DACDTFIN is null
		and DAC.ACTID = l_actid --Use the ACTID of the actor corresponding to the user that has logged in.
		and DPH.PHACODE = 'ENG'
		and DPH.DPHDTFIN is null)
	)
END as amount

from LANTUSPARAM TUP
where TUP.TUSNOM = 'POSINVSTATUS'
and TUP.LANCODE = l_locale
order by Ord;


    BEGIN
      l_locale := GETLOCALE(suticode);
      BEGIN
        l_actid := GETACTID(suticode);
      EXCEPTION	WHEN OTHERS THEN
        return F_HTMLCHECKUSER(suticode, p_params);
      END;

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';  

      ljson := '{
   "type": "table",
   "title": "PAV4_GENERIC_POS_CHART.F_WSTABLEINVOICESINTEREST.InvoicesInterest",
   "background": "#2F75B5",
   "data": [
';
      comma := '';
      FOR C1r IN C1
      LOOP
        ljson := ljson || comma || '[{"value":   "' || C1R.status || '", "isheader": false}, {"value":     "' || C1R.count || '"}, {"value":     "' || C1R.amount || ' €"}]';
	      comma := ', ';
      END LOOP;
      ljson := ljson || ']}' || crlf;
      RETURN ljson;
  END ;

--**************************************************************************************************************
  FUNCTION F_WSTABLEINVOICESPRINCIPAL(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
    ljson CLOB:='';
    crlf CHAR(2):='
';
    l_locale VARCHAR2(2):='';
    l_actid VARCHAR2(256):='';
	  comma CHAR(2) :='';
    CURSOR C1
    IS
select TUP.TUPLIBELLE as status,
CASE
	WHEN TUP.TUPCODE = 'DUE' THEN 2
	WHEN TUP.TUPCODE = 'OVERDUE' THEN 3
	WHEN TUP.TUPCODE = 'ONCOMING' THEN 1
END AS Ord
,
CASE
	WHEN TUP.TUPCODE = 'DUE' THEN
	(
		select count(FAC.FACID)
		from FACTURE FAC
		inner join DOSRUBECHEANCIER DRE
		on DRE.FACID = FAC.FACID
		inner join DOSRUBRIQUE DRU
		on DRU.DOSID = DRE.DOSID
		and DRU.DRUORDRE = DRE.DRUORDRE
		inner join RUBACCES RAC
		on RAC.RUBID = DRU.RUBID
		inner join DOSSIER DOS
		on DOS.DOSID = DRU.DOSID
		where FAC.FACDTEXIGIBLE >= SYSDATE
		and FAC.FACDTEXIGIBLE < SYSDATE + 7
		and RAC.RACACCES = 'REDFIN'
		and F_FACMTNONREGLE(FAC.FACID,SYSDATE) > 0
		and DOS.DOSIDREFINANCE in (select MF.DOSID
		from DOSSIER MF
		inner join TPROFILGESTION TPR
		on TPR.TPGCODE = MF.TPGCODE
		inner join DOSACTEUR DAC
		on DAC.DOSID = MF.DOSID
		inner join ACTEUR ACT
		on ACT.ACTID = DAC.ACTID
		inner join DOSPHASE DPH
		on DPH.DOSID = MF.DOSID
		where TPR.TPGFLAGFACILITY = 1
		and TPR.TPGWHOLESALETYPE is not null
		and DAC.ROLCODE = 'EMPRUNT'
		and DAC.DACDTFIN is null
		and DAC.ACTID = l_actid --Use the ACTID of the actor corresponding to the user that has logged in.
		and DPH.PHACODE = 'ENG'
		and DPH.DPHDTFIN is null)
	)

	WHEN TUP.TUPCODE = 'OVERDUE' THEN
	(
		select count(FAC.FACID)
		from FACTURE FAC
		inner join DOSRUBECHEANCIER DRE
		on DRE.FACID = FAC.FACID
		inner join DOSRUBRIQUE DRU
		on DRU.DOSID = DRE.DOSID
		and DRU.DRUORDRE = DRE.DRUORDRE
		inner join RUBACCES RAC
		on RAC.RUBID = DRU.RUBID
		inner join DOSSIER DOS
		on DOS.DOSID = DRU.DOSID
		where FAC.FACDTEXIGIBLE < SYSDATE
		and RAC.RACACCES = 'REDFIN'
		and F_FACMTNONREGLE(FAC.FACID,SYSDATE) > 0
		and DOS.DOSIDREFINANCE in (select MF.DOSID
		from DOSSIER MF
		inner join TPROFILGESTION TPR
		on TPR.TPGCODE = MF.TPGCODE
		inner join DOSACTEUR DAC
		on DAC.DOSID = MF.DOSID
		inner join ACTEUR ACT
		on ACT.ACTID = DAC.ACTID
		inner join DOSPHASE DPH
		on DPH.DOSID = MF.DOSID
		where TPR.TPGFLAGFACILITY = 1
		and TPR.TPGWHOLESALETYPE is not null
		and DAC.ROLCODE = 'EMPRUNT'
		and DAC.DACDTFIN is null
		and DAC.ACTID = l_actid --Use the ACTID of the actor corresponding to the user that has logged in.
		and DPH.PHACODE = 'ENG'
		and DPH.DPHDTFIN is null)
	)
  
	WHEN TUP.TUPCODE = 'ONCOMING' THEN
	(
		select count(FAC.FACID)
		from FACTURE FAC
		inner join DOSRUBECHEANCIER DRE
		on DRE.FACID = FAC.FACID
		inner join DOSRUBRIQUE DRU
		on DRU.DOSID = DRE.DOSID
		and DRU.DRUORDRE = DRE.DRUORDRE
		inner join RUBACCES RAC
		on RAC.RUBID = DRU.RUBID
		inner join DOSSIER DOS
		on DOS.DOSID = DRU.DOSID
		where FAC.FACDTEXIGIBLE > SYSDATE + 7
		and RAC.RACACCES = 'REDFIN'
		and F_FACMTNONREGLE(FAC.FACID,SYSDATE) > 0
		and DOS.DOSIDREFINANCE in (select MF.DOSID
		from DOSSIER MF
		inner join TPROFILGESTION TPR
		on TPR.TPGCODE = MF.TPGCODE
		inner join DOSACTEUR DAC
		on DAC.DOSID = MF.DOSID
		inner join ACTEUR ACT
		on ACT.ACTID = DAC.ACTID
		inner join DOSPHASE DPH
		on DPH.DOSID = MF.DOSID
		where TPR.TPGFLAGFACILITY = 1
		and TPR.TPGWHOLESALETYPE is not null
		and DAC.ROLCODE = 'EMPRUNT'
		and DAC.DACDTFIN is null
		and DAC.ACTID = l_actid --Use the ACTID of the actor corresponding to the user that has logged in.
		and DPH.PHACODE = 'ENG'
		and DPH.DPHDTFIN is null)
	)
END as count,

CASE
	WHEN TUP.TUPCODE = 'DUE' THEN
	(
		select NVL(sum(F_FACMTNONREGLE(FAC.FACID,SYSDATE)),0)
		from FACTURE FAC
		inner join DOSRUBECHEANCIER DRE
		on DRE.FACID = FAC.FACID
		inner join DOSRUBRIQUE DRU
		on DRU.DOSID = DRE.DOSID
		and DRU.DRUORDRE = DRE.DRUORDRE
		inner join RUBACCES RAC
		on RAC.RUBID = DRU.RUBID
		inner join DOSSIER DOS
		on DOS.DOSID = DRU.DOSID
		where FAC.FACDTEXIGIBLE >= SYSDATE
		and FAC.FACDTEXIGIBLE < SYSDATE + 7
		and RAC.RACACCES = 'REDFIN'
		and DOS.DOSIDREFINANCE in (select MF.DOSID
		from DOSSIER MF
		inner join TPROFILGESTION TPR
		on TPR.TPGCODE = MF.TPGCODE
		inner join DOSACTEUR DAC
		on DAC.DOSID = MF.DOSID
		inner join ACTEUR ACT
		on ACT.ACTID = DAC.ACTID
		inner join DOSPHASE DPH
		on DPH.DOSID = MF.DOSID
		where TPR.TPGFLAGFACILITY = 1
		and TPR.TPGWHOLESALETYPE is not null
		and DAC.ROLCODE = 'EMPRUNT'
		and DAC.DACDTFIN is null
		and DAC.ACTID = l_actid --Use the ACTID of the actor corresponding to the user that has logged in.
		and DPH.PHACODE = 'ENG'
		and DPH.DPHDTFIN is null)
	)

	WHEN TUP.TUPCODE = 'OVERDUE' THEN
	(
		select NVL(sum(F_FACMTNONREGLE(FAC.FACID,SYSDATE)),0)
		from FACTURE FAC	
		inner join DOSRUBECHEANCIER DRE
		on DRE.FACID = FAC.FACID
		inner join DOSRUBRIQUE DRU
		on DRU.DOSID = DRE.DOSID
		and DRU.DRUORDRE = DRE.DRUORDRE
		inner join RUBACCES RAC
		on RAC.RUBID = DRU.RUBID
		inner join DOSSIER DOS
		on DOS.DOSID = DRU.DOSID
		where FAC.FACDTEXIGIBLE < SYSDATE
		and RAC.RACACCES = 'REDFIN'
		and DOS.DOSIDREFINANCE in (select MF.DOSID
		from DOSSIER MF
		inner join TPROFILGESTION TPR
		on TPR.TPGCODE = MF.TPGCODE
		inner join DOSACTEUR DAC
		on DAC.DOSID = MF.DOSID
		inner join ACTEUR ACT
		on ACT.ACTID = DAC.ACTID
		inner join DOSPHASE DPH
		on DPH.DOSID = MF.DOSID
		where TPR.TPGFLAGFACILITY = 1
		and TPR.TPGWHOLESALETYPE is not null
		and DAC.ROLCODE = 'EMPRUNT'
		and DAC.DACDTFIN is null
		and DAC.ACTID = l_actid --Use the ACTID of the actor corresponding to the user that has logged in.
		and DPH.PHACODE = 'ENG'
		and DPH.DPHDTFIN is null)
	)

	WHEN TUP.TUPCODE = 'ONCOMING' THEN
	(
		select NVL(sum(F_FACMTNONREGLE(FAC.FACID,SYSDATE)),0)
		from FACTURE FAC
		inner join DOSRUBECHEANCIER DRE
		on DRE.FACID = FAC.FACID
		inner join DOSRUBRIQUE DRU
		on DRU.DOSID = DRE.DOSID
		and DRU.DRUORDRE = DRE.DRUORDRE
		inner join RUBACCES RAC
		on RAC.RUBID = DRU.RUBID
		inner join DOSSIER DOS
		on DOS.DOSID = DRU.DOSID
		where FAC.FACDTEXIGIBLE > SYSDATE + 7
		and RAC.RACACCES = 'REDFIN'
		and DOS.DOSIDREFINANCE in (select MF.DOSID
		from DOSSIER MF
		inner join TPROFILGESTION TPR
		on TPR.TPGCODE = MF.TPGCODE
		inner join DOSACTEUR DAC
		on DAC.DOSID = MF.DOSID
		inner join ACTEUR ACT
		on ACT.ACTID = DAC.ACTID
		inner join DOSPHASE DPH
		on DPH.DOSID = MF.DOSID
		where TPR.TPGFLAGFACILITY = 1
		and TPR.TPGWHOLESALETYPE is not null
		and DAC.ROLCODE = 'EMPRUNT'
		and DAC.DACDTFIN is null
		and DAC.ACTID = l_actid --Use the ACTID of the actor corresponding to the user that has logged in.
		and DPH.PHACODE = 'ENG'
		and DPH.DPHDTFIN is null)
	)
END as amount

from LANTUSPARAM TUP
where TUP.TUSNOM = 'POSINVSTATUS'
and TUP.LANCODE = l_locale
order by Ord;

    BEGIN
      l_locale := GETLOCALE(suticode);
      BEGIN
        l_actid := GETACTID(suticode);
      EXCEPTION	WHEN OTHERS THEN
        return F_HTMLCHECKUSER(suticode, p_params);
      END;

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';  

      ljson := '{
   "type": "table",
   "title": "PAV4_GENERIC_POS_CHART.F_WSTABLEINVOICESPRINCIPAL.InvoicesPrincipal",
   "background": "#7030A0",
   "data": [
';
      comma := '';
      FOR C1r IN C1
      LOOP
        ljson := ljson || comma || '[{"value":   "' || C1R.status || '", "isheader": false}, {"value":     "' || C1R.count || '"}, {"value":     "' || C1R.amount || ' €"}]';
	      comma := ', ';
      END LOOP;
      ljson := ljson || ']}' || crlf;
      RETURN ljson;
  END ;

END ;
/
