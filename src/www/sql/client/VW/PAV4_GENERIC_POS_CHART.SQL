CREATE OR REPLACE PACKAGE PAV4_GENERIC_POS_CHART
AS

	/* List of charts */
	FUNCTION GETCHARTS(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
    P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;
	FUNCTION F_KPIDEALINPROGRESS(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_KPICOMMISSION(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_KPIPROPOSALATTENTION(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_KPIRENEGOCIATION(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_KPICONVERSIONRATE(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_KPIAPPROVALRATE(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_DEALINPROGRESS(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_COMMISSIONPERMONTH(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_SALESPERMONTHAREA(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_SALESPERMONTH2(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_SALESPERMONTH2DRILL(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_UNITSPERMONTH(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_SALESANDUNITSPERMONTH(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_PRICINGMATRIX(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_PIVOT(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_FLEETSTRUCTPERBRAND(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_HTMLARKLE(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_HTMLIMAGE(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_HTMLCASSIOPAE(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_HTMLCHECKUSER(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_CONTACTLIST(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_PIVOTCHART(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	/* For test */
	FUNCTION F_TESTCLOB(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_SQLERROR(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	/* For test */
	FUNCTION F_HTMLTESTPARAMS(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_PENETRETIONRATEAREA(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_PENETRETIONRATETABLE(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

END PAV4_GENERIC_POS_CHART;
/


CREATE OR REPLACE PACKAGE BODY PAV4_GENERIC_POS_CHART
AS

/**************************************************************************************************************
GETCHARTS
***************************************************************************************************************/
  FUNCTION GETCHARTS(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
    P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
	  crlf CHAR(2) :='
';
	  comma CHAR(2) :=',';
    ljson CLOB := '';

  BEGIN

    ljson := ljson || ' [
        {
            "title": "PAV4_GENERIC_POS_DASHBOARD.LAYOUT_EDITOR.Numbers",
            "subTitle": "PAV4_GENERIC_POS_DASHBOARD.LAYOUT_EDITOR.NumbersSubTitle",
            "items": [
                {
                    "title": "PAV4_GENERIC_POS_CHART.F_KPIDEALINPROGRESS.DealsInProgress",
                    "url": "/charts/KPIDEALINPROGRESS",
                    "layoutClass": "col-md-3 col-xs-6"
                    ,"description": "This chart will show the number of deals in progress and an arrow showing the overall progress."

                },
                {
                    "title": "PAV4_GENERIC_POS_CHART.F_KPICOMMISSION.CommissionThisMonth",
                    "url": "/charts/KPICOMMISSION",
                    "layoutClass": "col-md-3 col-xs-6"
                    ,"description": "This chart will show your current commissions for this month."

                },
                {
                    "title": "PAV4_GENERIC_POS_CHART.F_KPIPROPOSALATTENTION.ProposalNeedYourAttention",
                    "url": "/charts/KPIPROPOSALATTENTION", "layoutClass": "col-md-3 col-xs-6"
                },
                {
                    "title": "PAV4_GENERIC_POS_CHART.F_KPIRENEGOCIATION.RenegociationRequests",
                    "url": "/charts/KPIRENEGOCIATION",
                    "layoutClass": "col-md-3 col-xs-6"
                }
            ]
        },
        {
            "title": "PAV4_GENERIC_POS_DASHBOARD.LAYOUT_EDITOR.Charts",
            "subTitle": "PAV4_GENERIC_POS_DASHBOARD.LAYOUT_EDITOR.ChartsSubtitle",
            "items": [
                {
                    "title": "PAV4_GENERIC_POS_CHART.F_DEALINPROGRESS.ProposalStageAmountAsPercentageOfPipeline",
                    "url": "/charts/DEALINPROGRESS",
                    "layoutClass": "col-md-4"
                    ,"description": "This chart display a pie based on your current deals. Each sector represents the stages of the pipeline. You can drill into data by clicking a sector."

                },
                {
                    "title": "PAV4_GENERIC_POS_CHART.F_COMMISSIONPERMONTH.CommissionsPerMonth",
                    "url": "/charts/COMMISSIONPERMONTH",
                    "layoutClass": "col-md-4"
                    ,"description": "This chart display all your commissions month by month"

                },
                {
                    "title": "PAV4_GENERIC_POS_CHART.F_SALESPERMONTH2.SalesPerMonth",
                    "url": "/charts/SALESPERMONTH2",
                    "layoutClass": "col-md-4"
                },
                {
                    "title": "PAV4_GENERIC_POS_CHART.F_PENETRETIONRATEAREA.PenetrationRate",
                    "url": "/charts/PENETRETIONRATEAREA",
                    "layoutClass": "col-md-8 col-xs-12"
                },
                {
                    "title": "PAV4_GENERIC_POS_CHART.F_PENETRETIONRATETABLE.PenetrationRate",
                    "url": "/charts/PENETRETIONRATETABLE",
                    "layoutClass": "col-xs-12"
                }
            ]
        },
        {
            "title": "PAV4_GENERIC_POS_DASHBOARD.LAYOUT_EDITOR.Corporate",
            "subTitle": "PAV4_GENERIC_POS_DASHBOARD.LAYOUT_EDITOR.CorporateSubTitle",
            "items": [
                {
                    "title": "PAV4_GENERIC_POS_CHART.F_CONTACTLIST.ContactList",
                    "url": "/charts/CONTACTLIST",
                    "layoutClass": "col-md-4"
                    ,"description": "This chart display your contact in our organization."

                },
                {
                    "title": "News from the Front",
                    "url": "/charts/HTMLCASSIOPAE",
                    "layoutClass": "col-md-8"
                    ,"description": "This chart will show the latest Cassiopae news."

                }
            ]
        }
    ]
';
    --dbms_output.put_line(ljson);
    RETURN ljson;

  END ;

/* **************************************************************
KPIDEALINPROGRESS
************************************************************** */
  FUNCTION F_KPIDEALINPROGRESS(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
    ljson CLOB:='';
    res number := 0.0;
  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

	select count ( distinct (DIN.DOSID)) into res from V_DEAL DPR, DPRINTERVENANT DIN
	WHERE DPR.DPRVERSION IN ('NEGO','FIN')
	AND DPR.DOSID = DIN.DOSID
	AND DPR.DPRVERSION = DIN.DPRVERSION
	AND DIN.UTICODE = NVL(suticode, 'DEALER1');
    --select 23.0 into res from dual;
    ljson := ljson || '{
  "type": "KPI",
  "parameters": {
    "type": "1",
    "title": "PAV4_GENERIC_POS_CHART.F_KPIDEALINPROGRESS.DealsInProgress",
    "icon": "fa-thumbs-o-up",
    "progress": 1,
	"link": "#/pos/deals",
';
    ljson := ljson || '"number": ' || res;
    ljson := ljson || '}
}';
    RETURN ljson;
END F_KPIDEALINPROGRESS;

/* **************************************************************
KPICOMMISSION
************************************************************** */
  FUNCTION F_KPICOMMISSION(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
    ljson CLOB:='';
    res number := 0.0;
  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

  -- compute commissions
  select NVL(SUM(PFC.PCFMT),0) INTO RES
      FROM dossierprospect DPR
      inner  JOIN dprpropfinance DPF ON dpr.dosid = DPF.dosid AND DPF.dprversion = dpr.dprversion and DPF.dpfflagretenue = 1
      inner JOIN propositionfinanciere PFI      ON PFI.pfiid    = DPF.pfiid
      inner JOIN PFICOMMISSION PFC ON PFC.PFIID = PFI.PFIID AND PFC.TCOCODE = 'DEALERCOMM'
      INNER JOIN DPRINTERVENANT DIN ON DIN.DOSID = DPR.DOSID AND DIN.DPRVERSION = DPR.DPRVERSION
      where TO_CHAR(DPR.DPRDTTRANSFERTCASSIOPEE,'YY MM') = TO_CHAR(SYSDATE, 'YY MM')
      AND DIN.UTICODE = NVL(suticode,'DEALER1');
    --select 30000 into res from dual;
    ljson := ljson || '{
  "type": "KPI",
  "parameters": {
    "type": "2",
    "title": "PAV4_GENERIC_POS_CHART.F_KPICOMMISSION.CommissionThisMonth",
    "icon": "fa-money",
    "progress": -1,
	"link": "#/pos/deals",
';
    ljson := ljson || '"number": ' || res || ',';
    ljson := ljson || '"style": "currency"';
    ljson := ljson || '}
}';
    RETURN ljson;
  END F_KPICOMMISSION;

/* **************************************************************
KPIPROPOSALATTENTION
************************************************************** */
  FUNCTION F_KPIPROPOSALATTENTION(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
    ljson CLOB:='';
    res number := 0.0;
  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

  SELECT COUNT(DPR.DOSID) INTO res
  FROM V_DEAL DPR, DPRPROPFINANCE DPF
  WHERE DPF.DOSID = DPR.DOSID
  AND DPF.DPRVERSION = DPR.DPRVERSION
  AND DPR.DPRVERSION = 'FIN'
  AND DPF.DPFDTLIMITE < SYSDATE + 8;
    ljson := ljson || '{
  "type": "KPI",
  "parameters": {
    "type": "3",
    "title": "PAV4_GENERIC_POS_CHART.F_KPIPROPOSALATTENTION.ProposalNeedYourAttention",
    "icon": "fa-exclamation",
	"link": "#/pos/deals",
';
    ljson := ljson || '"number": ' || res || '';
    ljson := ljson || '}
}';
    RETURN ljson;
  END F_KPIPROPOSALATTENTION;


/* **************************************************************
KPIRENEGOCIATION
************************************************************** */
  FUNCTION F_KPIRENEGOCIATION(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
    ljson CLOB:='';
    res number := 0.0;
  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

    select 4 into res from dual;
    ljson := ljson || '{
  "type": "KPI",
  "parameters": {
    "type": "4",
    "title": "PAV4_GENERIC_POS_CHART.F_KPIRENEGOCIATION.RenegociationRequests",
    "icon": "fa-hand-stop-o",
	"link": "#/pos/deals",
';
    ljson := ljson || '"number": ' || res || '';
    ljson := ljson || '}
}';
    RETURN ljson;
  END F_KPIRENEGOCIATION;

/* **************************************************************
PIVOTCHART
************************************************************** */
  FUNCTION F_PIVOTCHART(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
    comma CHAR(2);
    ljson CLOB:= EMPTY_CLOB;
    crlf CHAR(2) := '
';
    CURSOR C1
      IS
        SELECT * FROM (SELECT
        dos.DOSID AS InternalID
        , lant.ttplibelle As Step
        , dos.DPRNUMERO As DealID
        , dos.DEVCODE As Currency
        , dos.dprapproxdureean As Duration
        , dos.dprirflagfacturable As Billable
        , dos.taxcode As TaxCode
        , dos.tpgcode As FinProduct
        , prop.pfiinvestissement As NetAdvance
        , prop.pfiterme As Term
        , prop.pfiperiodicite As Periodicity
        , prop.pfitriavecprestation As Irr
        , prop.pfitrisansprestation as NetIRR
        , com.pcfmt as Commission
        , prop.*
        FROM dossierprospect dos
        INNER JOIN dprpropfinance dpr      ON dpr.dosid = dos.dosid AND dos.dprversion = dpr.dprversion
        INNER JOIN propositionfinanciere prop ON prop.pfiid    = dpr.pfiid AND dpr.dpfordre = 1
        INNER JOIN LANTTRPARAM LANT on LANT.TTRNOM='AVPHASEDOSSIER' and LANT.TTPCODE=dpr.dprversion AND LANT.LANCODE='EN'
        Left Outer JOIN PFICOMMISSION COM ON COM.PFIID = PROP.PFIID AND COM.TCOCODE = 'DEALERCOMM'
--	  order by DECODE( dpr.dprversion, 'NEGO', 1, 'FIN', 2, 'PROD', 3, 4 )
    ) WHERE ROWNUM <= 100;
  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

      ljson := '{
     "type": "pivot"
   , "title": "Current Deals"' || crlf;
   ljson := ljson || '  , "data": [' || crlf;
    comma := '  ';
    FOR C1r IN C1
    LOOP
      ljson := ljson || comma || '{' || crlf;
      ljson := ljson || '  "InternalID": ' || TO_CHAR(C1r.InternalID) || crlf;
      ljson := ljson || ', "Step": "' || coalesce(C1r.Step, '') || '"' || crlf;
      ljson := ljson || ', "DealID": "' || C1r.DealID || '"' || crlf;
      ljson := ljson || ', "Currency": "' || coalesce(C1r.Currency, '') || '"' || crlf;
      ljson := ljson || ', "Duration": ' || coalesce(C1r.Duration, 0) || crlf;
      ljson := ljson || ', "Billable": "' || coalesce(C1r.Billable, 0) || '"' || crlf;
      ljson := ljson || ', "TaxCode": "' || coalesce(C1r.TaxCode, '') || '"' || crlf;
      ljson := ljson || ', "FinProduct": "' || coalesce(C1r.FinProduct, '') || '"' || crlf;
      ljson := ljson || ', "NetAdvance": ' || coalesce(C1r.NetAdvance, 0) || crlf;
      ljson := ljson || ', "Term": "' || coalesce(C1r.Term, '') || '"' || crlf;
      ljson := ljson || ', "Periodicity": "' || coalesce(C1r.Periodicity, '') || '"' || crlf;
    --ljson := ljson || ', "IRR": ' || coalesce(C1r.Irr, 0) || crlf;
    --ljson := ljson || ', "NetIRR": ' || coalesce(C1r.NetIRR, 0) || crlf;
      ljson := ljson || ', "Commission": ' || coalesce(C1r.Commission, 0) || crlf;
      ljson := ljson || '  }' || crlf;
      comma := ', ';
    END LOOP;
    ljson := ljson || ']' || crlf;

	ljson := ljson || '   , "dimensions" : [' || crlf;
			--"value" can be the key of what you want to group on
	ljson := ljson || '          {"title": "Step", "value": "Step"}' || crlf;
	ljson := ljson || '        , {"title": "Currency", "value": "Currency"}' || crlf;
	ljson := ljson || '        , {"title": "Duration", "value": "Duration"}' || crlf;
	ljson := ljson || '        , {"title": "Billable", "value": "Billable"}' || crlf;
	ljson := ljson || '        , {"title": "TaxCode", "value": "TaxCode"}' || crlf;
	ljson := ljson || '        , {"title": "Fin.Product", "value": "FinProduct"}' || crlf;
			-- // "value" can also be function that returns what you want to group on
			-- {
				-- title: 'Transaction Type',
				-- value: function(row) { return row.transaction.type },
				-- template: function(value) {
				-- return '<a href="http://google.com/?q='+value+'">'+value+'</a>'
				-- }
			-- }
	ljson := ljson || '   ]' || crlf;

	ljson := ljson || '   , "metrics" : [' || crlf;
	ljson := ljson || '          {"title": "Net Advance", "value": "NetAdvance"}' || crlf;
	ljson := ljson || '        , {"title": "Commission", "value": "Commission"}' || crlf;
	ljson := ljson || '   ]' || crlf;

	ljson := ljson || '}' || crlf;
    RETURN ljson;
  END ;

/* **************************************************************
PIVOTCHART
************************************************************** */
  FUNCTION F_TESTCLOB(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
    comma CHAR(2);
    ljson CLOB:= EMPTY_CLOB;
    crlf CHAR(2) := '
';
  BEGIN
  for i in 1..30000
   loop
      ljson := ljson || 'AB';
   end loop;
   RETURN ljson;
  END ;

/* **************************************************************
KPICONVERSIONRATE
************************************************************** */
  FUNCTION F_KPICONVERSIONRATE(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
    ljson CLOB:='';
    totaldeals number := 0.0;
    proddeals number := 0.0;
    conversionrate number := 0.0;
  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

  select count ( distinct (DIN.DOSID)) into totaldeals
  from V_DEAL DPR
  INNER JOIN DPRINTERVENANT DIN ON DPR.DOSID = DIN.DOSID AND DPR.DPRVERSION = DIN.DPRVERSION
  WHERE DIN.UTICODE = suticode;

  select count ( distinct (DIN.DOSID)) into proddeals
  from V_DEAL DPR
  INNER JOIN DPRINTERVENANT DIN ON DPR.DOSID = DIN.DOSID AND DPR.DPRVERSION = DIN.DPRVERSION
	WHERE DIN.UTICODE = suticode
  AND DPR.DPRVERSION IN ('PROD');

  if totaldeals > 0 Then
    conversionrate := proddeals / totaldeals;
  end if;

  ljson := ljson || '{
  "type": "KPI",
  "parameters": {
    "type": "2",
    "title": "PAV4_GENERIC_POS_CHART.F_KPICONVERSIONRATE.ConversionRate",
    "icon": "fa-thumbs-o-up",
	"link": "#deals",
';
    ljson := ljson || '"number": ' || TO_CHAR(conversionrate, '90.99');
    ljson := ljson || '}
}';
    RETURN ljson;
END F_KPICONVERSIONRATE;

/* **************************************************************
F_APPROVALRATE
************************************************************** */
  FUNCTION F_KPIAPPROVALRATE(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
    ljson CLOB:='';
    totaldeals number := 0.0;
    proddeals number := 0.0;
    conversionrate number := 0.0;
  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

  select count ( distinct (DIN.DOSID)) into totaldeals
  from V_DEAL DPR
  INNER JOIN DPRINTERVENANT DIN ON DPR.DOSID = DIN.DOSID AND DPR.DPRVERSION = DIN.DPRVERSION
  WHERE DIN.UTICODE = suticode;

  select count ( distinct (DIN.DOSID)) into proddeals
  from V_DEAL DPR
  INNER JOIN DPRINTERVENANT DIN ON DPR.DOSID = DIN.DOSID AND DPR.DPRVERSION = DIN.DPRVERSION
	WHERE DIN.UTICODE = suticode
  AND DPR.DPRVERSION IN ('PROD');

  if totaldeals > 0 Then
    conversionrate := proddeals / totaldeals;
  end if;

  ljson := ljson || '{
  "type": "KPI",
  "parameters": {
    "type": "2",
    "title": "PAV4_GENERIC_POS_CHART.F_KPIAPPROVALRATE.ApprovalRate",
    "icon": "fa-thumbs-o-up",
	"link": "#deals",
';
    ljson := ljson || '"number": ' || TO_CHAR(conversionrate, '90.99');
    ljson := ljson || '}
}';
    RETURN ljson;
END ;

/* **************************************************************
DEALINPROGRESS, pie chart
************************************************************** */
  FUNCTION F_DEALINPROGRESS(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
    ljson CLOB:='{
"type": "Doughnut",
"title": "PAV4_GENERIC_POS_CHART.F_DEALINPROGRESS.ProposalStageAmountAsPercentageOfPipeline",
"link": "#deals",
"options": {
"maintainAspectRatio": true
},
"data": [
';
    comma CHAR(2) := ',';
	crlf CHAR(2) := '
	';
    CURSOR C1
    IS
      SELECT
      lant.ttplibelle As label,
	    dpr.dprversion As lkey,
		  SUM(prop.pfiinvestissement) As mnt
      FROM dossierprospect dos
      INNER JOIN dprpropfinance dpr      ON dpr.dosid = dos.dosid AND dos.dprversion = dpr.dprversion
      INNER JOIN propositionfinanciere prop ON prop.pfiid    = dpr.pfiid AND dpr.dpfordre = 1
      INNER JOIN LANTTRPARAM LANT on LANT.TTRNOM='AVPHASEDOSSIER' and LANT.TTPCODE=dpr.dprversion AND LANT.LANCODE='EN'
      GROUP BY dpr.dprversion, lant.ttplibelle
	  order by DECODE( dpr.dprversion, 'NEGO', 1, 'FIN', 2, 'PROD', 3, 4 );
  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

    comma := '';
    FOR C1r IN C1
    LOOP
      ljson := ljson || comma || '{' || crlf;
      ljson := ljson || '  "key": "' || C1r.lkey || '",' || crlf;
      ljson := ljson || '  "label": "' || C1r.label || '",' || crlf;
      ljson := ljson || '  "value": ' || C1r.mnt || ',' || crlf;
      ljson := ljson || '  "link": "/charts/SALESPERMONTH2DRILL"' || crlf;
      ljson := ljson || '}' || crlf;
      comma := ', ';
    END LOOP;
    ljson := ljson || ']
}';
    --dbms_output.put_line(ljson);
    RETURN ljson;
  END F_DEALINPROGRESS;


/* **************************************************************
COMMISSIONPERMONTH, bar chart
************************************************************** */
  FUNCTION F_COMMISSIONPERMONTH(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
	crlf CHAR(2) :='
	';
	comma CHAR(2) :=',';
    ljson CLOB := '';
    CURSOR C1
    IS
      SELECT
        CAL.FMT As FMT,
        coalesce(T1.COM, 0) As COM
      FROM
(select * from (with t as (select CURRENT_DATE-366 As init, CURRENT_DATE As final from dual)
select to_char(add_months(trunc(init,'MM'),level-1),'Mon YY') As fmt,  to_char(add_months(trunc(init,'MM'),level-1),'YY MM') As dts from t connect by level <= months_between(final, init)+1)) CAL
left outer join (
select TO_CHAR(DDC.DDCDT, 'YY MM') as dts, SUM(com.pcfmt) As COM, count(dos.dosid)
      FROM dossierprospect dos
      inner  JOIN dprpropfinance dpr ON dpr.dosid = dos.dosid AND dos.dprversion = dpr.dprversion and dpr.dpfflagretenue = 1
      inner JOIN propositionfinanciere prop      ON prop.pfiid    = dpr.pfiid
      inner JOIN LANTTRPARAM LANT on LANT.TTRNOM='AVPHASEDOSSIER' and LANT.TTPCODE=dpr.dprversion AND LANT.LANCODE='EN'
    inner JOIN DPRDATECLE DDC ON DDC.DOSID = DOS.DOSID AND DDC.DPRVERSION = DOS.DPRVERSION AND DDC.DCLCODE = 'DTMEP'
    inner JOIN PFICOMMISSION COM ON COM.PFIID = PROP.PFIID AND COM.TCOCODE = 'DEALERCOMM'
    where DDC.DDCDT >= CURRENT_DATE-366
    GROUP BY TO_CHAR(DDC.DDCDT, 'YY MM')) T1
on T1.DTS = CAL.DTS
order by CAL.dts;

  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

    ljson := ljson || '{
  "type": "Bar",
  "title": "PAV4_GENERIC_POS_CHART.F_COMMISSIONPERMONTH.CommissionsPerMonth",
  "options": {
    "scaleShowVerticalLines": true
  },
  "link": "#deals",
  "data": {
';
    ljson := ljson || '  "labels": [';
	comma := '';
    FOR C1r IN C1
    LOOP
      ljson := ljson || comma || '"' || C1R.FMT || '"';
	  comma := ', ';
    END LOOP;
    ljson := ljson || '],' || crlf;
    ljson := ljson || '  "datasets": [' || crlf;
    ljson := ljson || '  {' || crlf;
    ljson := ljson || '    "label": "PAV4_GENERIC_POS_CHART.F_COMMISSIONPERMONTH.Commissions",' || crlf;
    /*
	ljson := ljson || '    "fillColor": color[0]',
    ljson := ljson || '    "strokeColor": color[0]',
    ljson := ljson || '    "pointColor": color[0],
    ljson := ljson || '    "pointStrokeColor": "#fff",
    ljson := ljson || '    "pointHighlightFill": "#fff",
    ljson := ljson || '    "pointHighlightStroke": color[0],
	*/
    ljson := ljson || '    "data": [';
	comma := '';
    FOR C1r IN C1
    LOOP
      ljson := ljson || comma || C1R.COM;
	  comma := ', ';
    END LOOP;
	ljson := ljson || ']' || crlf;
    ljson := ljson || '  }' || crlf;
    ljson := ljson || ']' || crlf;
    ljson := ljson || '}' || crlf;
    ljson := ljson || '}' || crlf;

    --dbms_output.put_line(ljson);
    RETURN ljson;

  END F_COMMISSIONPERMONTH;


/* **************************************************************
SALESPERMONTH, bar chart
************************************************************** */
  FUNCTION F_SALESPERMONTHAREA(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
	crlf CHAR(2) :='
	';
	comma CHAR(2) :=',';
    ljson CLOB := '';
    CURSOR C1
    IS
      SELECT
        CAL.FMT As FMT,
        coalesce(T1.mnt, 0) As mnt
      FROM
(select * from (with t as (select CURRENT_DATE-366 As init, CURRENT_DATE As final from dual)
select to_char(add_months(trunc(init,'MM'),level-1),'Mon YY') As fmt,  to_char(add_months(trunc(init,'MM'),level-1),'YY MM') As dts from t connect by level <= months_between(final, init)+1)) CAL
left outer join (
select TO_CHAR(DDC.DDCDT, 'YY MM') as dts, SUM(prop.pfiinvestissement) As mnt, count(dos.dosid)
      FROM dossierprospect dos
      inner  JOIN dprpropfinance dpr ON dpr.dosid = dos.dosid AND dos.dprversion = dpr.dprversion and dpr.dpfflagretenue = 1
      inner JOIN propositionfinanciere prop      ON prop.pfiid    = dpr.pfiid
      inner JOIN LANTTRPARAM LANT on LANT.TTRNOM='AVPHASEDOSSIER' and LANT.TTPCODE=dpr.dprversion AND LANT.LANCODE='EN'
    inner JOIN DPRDATECLE DDC ON DDC.DOSID = DOS.DOSID AND DDC.DPRVERSION = DOS.DPRVERSION AND DDC.DCLCODE = 'DTMEP'
    where DDC.DDCDT >= CURRENT_DATE-366
    and UPPER( dos.UTICODECREATION ) LIKE UPPER(suticode)
    GROUP BY TO_CHAR(DDC.DDCDT, 'YY MM')) T1
on T1.DTS = CAL.DTS
order by CAL.dts;

  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

    ljson := ljson || '{
  "type": "Area",
  "title": "PAV4_GENERIC_POS_CHART.F_SALESPERMONTHAREA.SalesPerMonthArea",
  "options": {
    "scaleShowVerticalLines": true
  },
  "link": "#deals",
  "data": {
';
    ljson := ljson || '  "labels": [';
	comma := '';
    FOR C1r IN C1
    LOOP
      ljson := ljson || comma || '"' || C1R.FMT || '"';
	  comma := ', ';
    END LOOP;
    ljson := ljson || '],' || crlf;
    ljson := ljson || '  "datasets": [' || crlf;
    ljson := ljson || '  {' || crlf;
    ljson := ljson || '    "label": "Sales",' || crlf;
    /*
	ljson := ljson || '    "fillColor": color[0]',
    ljson := ljson || '    "strokeColor": color[0]',
    ljson := ljson || '    "pointColor": color[0],
    ljson := ljson || '    "pointStrokeColor": "#fff",
    ljson := ljson || '    "pointHighlightFill": "#fff",
    ljson := ljson || '    "pointHighlightStroke": color[0],
	*/
    ljson := ljson || '    "data": [';
	comma := '';
    FOR C1r IN C1
    LOOP
      ljson := ljson || comma || C1R.MNT;
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

/* **************************************************************
SALESPERMONTH, bar chart
************************************************************** */
  FUNCTION F_SALESPERMONTH2(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
	crlf CHAR(2) :='
	';
	comma CHAR(2) :=',';
    ljson CLOB := '';
    CURSOR C1
    IS
      SELECT
        CAL.FMT As FMT,
        coalesce(T1.mnt, 0) As mnt
      FROM
(select * from (with t as (select CURRENT_DATE-366 As init, CURRENT_DATE As final from dual)
select to_char(add_months(trunc(init,'MM'),level-1),'Mon YY') As fmt,  to_char(add_months(trunc(init,'MM'),level-1),'YY MM') As dts from t connect by level <= months_between(final, init)+1)) CAL
left outer join (
select TO_CHAR(DDC.DDCDT, 'YY MM') as dts, SUM(prop.pfiinvestissement) As mnt, count(dos.dosid)
      FROM dossierprospect dos
      inner  JOIN dprpropfinance dpr ON dpr.dosid = dos.dosid AND dos.dprversion = dpr.dprversion and dpr.dpfflagretenue = 1
      inner JOIN propositionfinanciere prop      ON prop.pfiid    = dpr.pfiid
      inner JOIN LANTTRPARAM LANT on LANT.TTRNOM='AVPHASEDOSSIER' and LANT.TTPCODE=dpr.dprversion AND LANT.LANCODE='EN'
    inner JOIN DPRDATECLE DDC ON DDC.DOSID = DOS.DOSID AND DDC.DPRVERSION = DOS.DPRVERSION AND DDC.DCLCODE = 'DTMEP'
    where DDC.DDCDT >= CURRENT_DATE-366
    and UPPER( dos.UTICODECREATION ) LIKE UPPER(suticode)
    GROUP BY TO_CHAR(DDC.DDCDT, 'YY MM')) T1
on T1.DTS = CAL.DTS
order by CAL.dts;

  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

    ljson := ljson || '{
  "type": "Line",
  "title": "PAV4_GENERIC_POS_CHART.F_SALESPERMONTH2.SalesPerMonth",
  "options": {
    "scaleShowVerticalLines": true
  },
  "link": "#deals",
  "data": {
';
    ljson := ljson || '  "labels": [';
	comma := '';
    FOR C1r IN C1
    LOOP
      ljson := ljson || comma || '"' || C1R.FMT || '"';
	  comma := ', ';
    END LOOP;
    ljson := ljson || '],' || crlf;
    ljson := ljson || '  "datasets": [' || crlf;
    ljson := ljson || '  {' || crlf;
    ljson := ljson || '    "label": "PAV4_GENERIC_POS_CHART.F_SALESPERMONTHAREA.Sales",' || crlf;
    /*
	ljson := ljson || '    "fillColor": color[0]',
    ljson := ljson || '    "strokeColor": color[0]',
    ljson := ljson || '    "pointColor": color[0],
    ljson := ljson || '    "pointStrokeColor": "#fff",
    ljson := ljson || '    "pointHighlightFill": "#fff",
    ljson := ljson || '    "pointHighlightStroke": color[0],
	*/
    ljson := ljson || '    "data": [';
	comma := '';
    FOR C1r IN C1
    LOOP
      ljson := ljson || comma || C1R.MNT;
	  comma := ', ';
    END LOOP;
	ljson := ljson || ']' || crlf;
    ljson := ljson || '  }' || crlf;
    ljson := ljson || ']' || crlf;
    ljson := ljson || '}' || crlf;
    ljson := ljson || '}' || crlf;

    --dbms_output.put_line(ljson);
    RETURN ljson;

  END F_SALESPERMONTH2;

/* **************************************************************
F_SALESPERMONTH2DRILL, bar chart
************************************************************** */
  FUNCTION F_SALESPERMONTH2DRILL(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
	crlf CHAR(2) :='
	';
	comma CHAR(2) :=',';
    ljson CLOB := '';
    CURSOR C1
    IS
      SELECT
        CAL.FMT As FMT,
        coalesce(T1.mnt, 0) As mnt
      FROM
(select * from (with t as (select CURRENT_DATE-366 As init, CURRENT_DATE As final from dual)
select to_char(add_months(trunc(init,'MM'),level-1),'Mon YY') As fmt,  to_char(add_months(trunc(init,'MM'),level-1),'YY MM') As dts from t connect by level <= months_between(final, init)+1)) CAL
left outer join (
select TO_CHAR(DDC.DDCDT, 'YY MM') as dts, SUM(prop.pfiinvestissement) As mnt, count(dos.dosid)
      FROM dossierprospect dos
      inner  JOIN dprpropfinance dpr ON dpr.dosid = dos.dosid AND dos.dprversion = dpr.dprversion and dpr.dpfflagretenue = 1
      inner JOIN propositionfinanciere prop      ON prop.pfiid    = dpr.pfiid
      inner JOIN LANTTRPARAM LANT on LANT.TTRNOM='AVPHASEDOSSIER' and LANT.TTPCODE=dpr.dprversion AND LANT.LANCODE='EN'
    inner JOIN DPRDATECLE DDC ON DDC.DOSID = DOS.DOSID AND DDC.DPRVERSION = DOS.DPRVERSION AND DDC.DCLCODE = 'DTMEP'
    where DDC.DDCDT >= CURRENT_DATE-366
    and UPPER( dos.UTICODECREATION ) LIKE UPPER(suticode)
    and dpr.dprversion = P_PARAMS('drill')
    GROUP BY TO_CHAR(DDC.DDCDT, 'YY MM')) T1
on T1.DTS = CAL.DTS
order by CAL.dts;

  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

    ljson := ljson || '{
  "type": "Line",
  "title": "PAV4_GENERIC_POS_CHART.F_SALESPERMONTH2.SalesPerMonth",
  "options": {
    "scaleShowVerticalLines": true
  },
  "link": "#deals",
  "data": {
';
    ljson := ljson || '  "labels": [';
	comma := '';
    FOR C1r IN C1
    LOOP
      ljson := ljson || comma || '"' || C1R.FMT || '"';
	  comma := ', ';
    END LOOP;
    ljson := ljson || '],' || crlf;
    ljson := ljson || '  "datasets": [' || crlf;
    ljson := ljson || '  {' || crlf;
    ljson := ljson || '    "label": "Sales",' || crlf;
    /*
	ljson := ljson || '    "fillColor": color[0]',
    ljson := ljson || '    "strokeColor": color[0]',
    ljson := ljson || '    "pointColor": color[0],
    ljson := ljson || '    "pointStrokeColor": "#fff",
    ljson := ljson || '    "pointHighlightFill": "#fff",
    ljson := ljson || '    "pointHighlightStroke": color[0],
	*/
    ljson := ljson || '    "data": [';
	comma := '';
    FOR C1r IN C1
    LOOP
      ljson := ljson || comma || C1R.MNT;
	  comma := ', ';
    END LOOP;
	ljson := ljson || ']' || crlf;
    ljson := ljson || '  }' || crlf;
    ljson := ljson || ']' || crlf;
    ljson := ljson || '}' || crlf;
    ljson := ljson || '}' || crlf;

    --dbms_output.put_line(ljson);
    RETURN ljson;

  END F_SALESPERMONTH2DRILL;

/* **************************************************************
UNITSPERMONTH, bar chart
************************************************************** */
  FUNCTION F_UNITSPERMONTH(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
  RETURN CLOB
  IS
	crlf CHAR(2) :='
	';
	comma CHAR(2) :=',';
    ljson CLOB := '';
    CURSOR C1
    IS
      SELECT
        CAL.FMT As FMT,
        coalesce(T1.cnt, 0) As cnt
      FROM
(select * from (with t as (select CURRENT_DATE-366 As init, CURRENT_DATE As final from dual)
select to_char(add_months(trunc(init,'MM'),level-1),'Mon YY') As fmt,  to_char(add_months(trunc(init,'MM'),level-1),'YY MM') As dts from t connect by level <= months_between(final, init)+1)) CAL
left outer join (
select TO_CHAR(DDC.DDCDT, 'YY MM') as dts, SUM(prop.pfiinvestissement) As mnt, count(dos.dosid) as cnt
      FROM dossierprospect dos
      inner  JOIN dprpropfinance dpr ON dpr.dosid = dos.dosid AND dos.dprversion = dpr.dprversion and dpr.dpfflagretenue = 1
      inner JOIN propositionfinanciere prop      ON prop.pfiid    = dpr.pfiid
      inner JOIN LANTTRPARAM LANT on LANT.TTRNOM='AVPHASEDOSSIER' and LANT.TTPCODE=dpr.dprversion AND LANT.LANCODE='EN'
    inner JOIN DPRDATECLE DDC ON DDC.DOSID = DOS.DOSID AND DDC.DPRVERSION = DOS.DPRVERSION AND DDC.DCLCODE = 'DTMEP'
    inner JOIN PFICOMMISSION COM ON COM.PFIID = PROP.PFIID AND COM.TCOCODE = 'DEALERCOMM'
    where DDC.DDCDT >= CURRENT_DATE-366
    GROUP BY TO_CHAR(DDC.DDCDT, 'YY MM')) T1
on T1.DTS = CAL.DTS
order by CAL.dts;

  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

    ljson := ljson || '{
  "type": "Bar",
  "title": "PAV4_GENERIC_POS_CHART.F_UNITSPERMONTH.UnitsPerMonth",
  "options": {
    "scaleShowVerticalLines": true
  },
  "link": "#deals",
  "data": {
';
    ljson := ljson || '  "labels": [';
	comma := '';
    FOR C1r IN C1
    LOOP
      ljson := ljson || comma || '"' || C1R.FMT || '"';
	  comma := ', ';
    END LOOP;
    ljson := ljson || '],' || crlf;
    ljson := ljson || '  "datasets": [' || crlf;
    ljson := ljson || '  {' || crlf;
    ljson := ljson || '    "label": "Units",' || crlf;
    /*
	ljson := ljson || '    "fillColor": color[0]',
    ljson := ljson || '    "strokeColor": color[0]',
    ljson := ljson || '    "pointColor": color[0],
    ljson := ljson || '    "pointStrokeColor": "#fff",
    ljson := ljson || '    "pointHighlightFill": "#fff",
    ljson := ljson || '    "pointHighlightStroke": color[0],
	*/
    ljson := ljson || '    "data": [';
	comma := '';
    FOR C1r IN C1
    LOOP
      ljson := ljson || comma || C1R.cNT;
	  comma := ', ';
    END LOOP;
	ljson := ljson || ']' || crlf;
    ljson := ljson || '  }' || crlf;
    ljson := ljson || ']' || crlf;
    ljson := ljson || '}' || crlf;
    ljson := ljson || '}' || crlf;

    --dbms_output.put_line(ljson);
    RETURN ljson;

  END F_UNITSPERMONTH;

/* **************************************************************
SALESANDUNITSPERMONTH, multiple bar chart
I keep that as a multi bar exeample but it has a flaw: the chart
does not support multiple scale we cannot show properly sales (in 100k)
and units (in 1000s)
************************************************************** */
  FUNCTION F_SALESANDUNITSPERMONTH(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
	crlf CHAR(2) :='
	';
	comma CHAR(2) :=',';
    ljson CLOB := '';
    CURSOR C1
    IS
      SELECT
        CAL.FMT As FMT,
        coalesce(T1.MNT, 0) As MNT,
        coalesce(T1.CNT, 0) As CNT
      FROM
(select * from (with t as (select CURRENT_DATE-366 As init, CURRENT_DATE As final from dual)
select to_char(add_months(trunc(init,'MM'),level-1),'Mon YY') As fmt,  to_char(add_months(trunc(init,'MM'),level-1),'YY MM') As dts from t connect by level <= months_between(final, init)+1)) CAL
left outer join (
select TO_CHAR(DDC.DDCDT, 'YY MM') as dts, SUM(prop.pfiinvestissement) As mnt, count(dos.dosid) as cnt
      FROM dossierprospect dos
      INNER JOIN dprpropfinance dpr ON dpr.dosid = dos.dosid AND dos.dprversion = dpr.dprversion and dpr.dpfflagretenue = 1
      INNER JOIN propositionfinanciere prop      ON prop.pfiid    = dpr.pfiid
      INNER JOIN LANTTRPARAM LANT on LANT.TTRNOM='AVPHASEDOSSIER' and LANT.TTPCODE=dpr.dprversion AND LANT.LANCODE='EN'
    INNER JOIN DPRDATECLE DDC ON DDC.DOSID = DOS.DOSID AND DDC.DPRVERSION = DOS.DPRVERSION AND DDC.DCLCODE = 'DTMEP'
    where DDC.DDCDT >= CURRENT_DATE-366
    GROUP BY TO_CHAR(DDC.DDCDT, 'YY MM')) T1
on T1.DTS = CAL.DTS
order by CAL.dts;

  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

    ljson := ljson || '{
  "type": "Bar",
  "title": "Sales and units per Month",
  "options": {
    "scaleShowVerticalLines": true
  },
  "link": "#deals",
  "data": {
';
    ljson := ljson || '  "labels": [';
	comma := '';
    FOR C1r IN C1
    LOOP
      ljson := ljson || comma || '"' || C1R.FMT || '"';
	  comma := ', ';
    END LOOP;
    ljson := ljson || '],' || crlf;
    ljson := ljson || '  "datasets": [' || crlf;

	/* *************** Amounts ****************/
    ljson := ljson || '  {' || crlf;
    ljson := ljson || '    "label": "PAV4_GENERIC_POS_CHART.F_SALESANDUNITSPERMONTH.Sales",' || crlf;
    /*
	ljson := ljson || '    "fillColor": color[0]',
    ljson := ljson || '    "strokeColor": color[0]',
    ljson := ljson || '    "pointColor": color[0],
    ljson := ljson || '    "pointStrokeColor": "#fff",
    ljson := ljson || '    "pointHighlightFill": "#fff",
    ljson := ljson || '    "pointHighlightStroke": color[0],
	*/
    ljson := ljson || '    "data": [';
	comma := '';
    FOR C1r IN C1
    LOOP
      ljson := ljson || comma || C1R.MNT;
	  comma := ', ';
    END LOOP;
	ljson := ljson || ']' || crlf;
    ljson := ljson || '  },' || crlf;

	/* *************** Counts ****************/
    ljson := ljson || '  {' || crlf;
    ljson := ljson || '    "label": "PAV4_GENERIC_POS_CHART.F_SALESANDUNITSPERMONTH.Units",' || crlf;
    /*
	ljson := ljson || '    "fillColor": color[0]',
    ljson := ljson || '    "strokeColor": color[0]',
    ljson := ljson || '    "pointColor": color[0],
    ljson := ljson || '    "pointStrokeColor": "#fff",
    ljson := ljson || '    "pointHighlightFill": "#fff",
    ljson := ljson || '    "pointHighlightStroke": color[0],
	*/
    ljson := ljson || '    "data": [';
	comma := '';
    FOR C1r IN C1
    LOOP
      ljson := ljson || comma || C1R.CNT;
	  comma := ', ';
    END LOOP;
	ljson := ljson || ']' || crlf;
    ljson := ljson || '  }' || crlf;

    ljson := ljson || ']' || crlf;
    ljson := ljson || '}' || crlf;
    ljson := ljson || '}' || crlf;

    --dbms_output.put_line(ljson);
    RETURN ljson;

  END F_SALESANDUNITSPERMONTH;

/* **************************************************************
PRICINGMATRIX
************************************************************** */
  FUNCTION F_PRICINGMATRIX(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
    ljson CLOB:='';
    crlf CHAR(2):='
';
/*
    CURSOR C1
    IS

with T as (
select TO_CHAR(DOS.DPRDTCREATION, 'YYYY MM') as Month, dos.dprversion as step, SUM(prop.pfiinvestissement) as cnt
      FROM dossierprospect dos
      left outer JOIN dprpropfinance dpr ON dpr.dosid = dos.dosid AND dos.dprversion = dpr.dprversion and dpr.dpfflagretenue = 1
      left outer JOIN propositionfinanciere prop      ON prop.pfiid    = dpr.pfiid
      left outer JOIN LANTTRPARAM LANT on LANT.TTRNOM='AVPHASEDOSSIER' and LANT.TTPCODE=dpr.dprversion AND LANT.LANCODE='EN'
    left outer JOIN DPRDATECLE DDC ON DDC.DOSID = DOS.DOSID AND DDC.DPRVERSION = DOS.DPRVERSION AND DDC.DCLCODE = 'DTMEP'
    left outer JOIN PFICOMMISSION COM ON COM.PFIID = PROP.PFIID AND COM.TCOCODE = 'DEALERCOMM'
    GROUP BY TO_CHAR(DOS.DPRDTCREATION, 'YYYY MM'), dos.dprversion
    order by TO_CHAR(DOS.DPRDTCREATION, 'YYYY MM'), dos.dprversion
)
Select * from T
PIVOT (
  SUM ( cnt ) AS cnt FOR (step)
  IN ('NEGO' As Nego, 'FIN' AS Fin, 'PROD' As Prod)
  )
;

*/
    BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

      ljson := '{
   "type": "table",
   "title": "Pricing Matrix",
   "data": [
  [{"value":  "PAV4_GENERIC_POS_CHART.F_PRICINGMATRIX.KmYears", "isheader": true}, {"value":     "12", "isheader": true},  {"value":   "15", "isheader": true}, {"value":    "18","isheader": true}, {"value":    "21"   ,"isheader": true}, {"value":     "24"   ,"isheader": true}, {"value":     "27"    ,"isheader": true}, {"value":     "30"    ,"isheader": true}, {"value":     "33"    ,"isheader": true}, {"value":      "36", "isheader": true}, {"value":     "39"  ,"isheader": true}, {"value":     "42"    ,"isheader": true}, {"value":     "45"    ,"isheader": true}, {"value":     "48", "isheader": true}, {"value":     "51"  ,"isheader": true}, {"value":     "54"    ,"isheader": true}, {"value":     "57"    ,"isheader": true}, {"value":     "60", "isheader": true}]
 ,[{"value":     "10 000", "isheader": true}, {"value":    "854"},                     {"value":   "819"                   }, {"value":   "789"                 }, {"value":    "765"                    }, {"value":     "743"                    }, {"value":     "725"                     }, {"value":     "708"                     }, {"value":     "692"                     }, {"value":    "678"                   }, {"value":    "666"                   }, {"value":    "654"                     }, {"value":    "643"                     }, {"value":    "632"                  }, {"value":    "623"                   }, {"value":    "614"                     }, {"value":    "605"                     }, {"value":    "597"                  }]
 ,[{"value":     "15 000", "isheader": true}, {"value":    "919"},                     {"value":   "883"                   }, {"value":   "854"                 }, {"value":    "830"                    }, {"value":     "808"                    }, {"value":     "789"                     }, {"value":     "773"                     }, {"value":     "757"                     }, {"value":    "743"                   }, {"value":    "731"                   }, {"value":    "719"                     }, {"value":    "708"                     }, {"value":    "697"                  }, {"value":    "688"                   }, {"value":    "678"                     }, {"value":    "670"                     }, {"value":    "662"                  }]
 ,[{"value":     "20 000", "isheader": true}, {"value":    "965"},                     {"value":   "929"                   }, {"value":   "900"                 }, {"value":    "876"                    }, {"value":     "854"                    }, {"value":     "835"                     }, {"value":     "819"                     }, {"value":     "803"                     }, {"value":    "789"                   }, {"value":    "777"                   }, {"value":    "765"                     }, {"value":    "754"                     }, {"value":    "743"                  }, {"value":    "734"                   }, {"value":    "725"                     }, {"value":    "716"                     }, {"value":    "708"                  }]
 ,[{"value":     "25 000", "isheader": true}, {"value":  "1 001"},                     {"value":   "965"                   }, {"value":   "936"                 }, {"value":    "911"                    }, {"value":     "890"                    }, {"value":     "871"                     }, {"value":     "854"                     }, {"value":     "839"                     }, {"value":    "825"                   }, {"value":    "812"                   }, {"value":    "800"                     }, {"value":    "789"                     }, {"value":    "779"                  }, {"value":    "769"                   }, {"value":    "760"                     }, {"value":    "752"                     }, {"value":    "743"                  }]
 ,[{"value":     "30 000", "isheader": true}, {"value":  "1 030"},                     {"value":   "994"                   }, {"value":   "965"                 }, {"value":    "941"                    }, {"value":     "919"                    }, {"value":     "900"                     }, {"value":     "883"                     }, {"value":     "868"                     }, {"value":    "854"                   }, {"value":    "841"                   }, {"value":    "830"                     }, {"value":    "819"                     }, {"value":    "808"                  }, {"value":    "799"                   }, {"value":    "789"                     }, {"value":    "781"                     }, {"value":    "773"                  }]
 ,[{"value":     "35 000", "isheader": true}, {"value":  "1 055"},                     {"value": "1 019"                   }, {"value":   "990"                 }, {"value":    "965"                    }, {"value":     "944"                    }, {"value":     "925"                     }, {"value":     "908"                     }, {"value":     "893"                     }, {"value":    "879"                   }, {"value":    "866"                   }, {"value":    "854"                     }, {"value":    "843"                     }, {"value":    "833"                  }, {"value":    "823"                   }, {"value":    "814"                     }, {"value":    "805"                     }, {"value":    "797"                  }]
 ,[{"value":     "40 000", "isheader": true}, {"value":  "1 076"},                     {"value": "1 040"                   }, {"value": "1 011"                 }, {"value":    "987"                    }, {"value":     "965"                    }, {"value":     "946"                     }, {"value":     "929"                     }, {"value":     "914"                     }, {"value":    "900"                   }, {"value":    "887"                   }, {"value":    "876"                     }, {"value":    "865"                     }, {"value":    "854"                  }, {"value":    "845"                   }, {"value":    "835"                     }, {"value":    "827"                     }, {"value":    "819"                  }]
 ,[{"value":     "45 000", "isheader": true}, {"value":  "1 095"},                     {"value": "1 059"                   }, {"value": "1 030"                 }, {"value":  "1 005"                    }, {"value":     "984"                    }, {"value":     "965"                     }, {"value":     "948"                     }, {"value":     "933"                     }, {"value":    "919"                   }, {"value":    "906"                   }, {"value":    "894"                     }, {"value":    "883"                     }, {"value":    "873"                  }, {"value":    "863"                   }]
 ,[{"value":     "50 000", "isheader": true}, {"value":  "1 112"},                     {"value": "1 076"                   }, {"value": "1 047"                 }, {"value":  "1 022"                    }, {"value":   "1 001"                    }, {"value":     "982"                     }, {"value":     "965"                     }, {"value":     "950"                     }, {"value":    "936"                   }, {"value":    "923"                   }, {"value":    "911"                     }, {"value":    "900"                     }, {"value":    "890"                  }]
 ,[{"value":     "55 000", "isheader": true}, {"value":  "1 127"},                     {"value": "1 091"                   }, {"value": "1 062"                 }, {"value":  "1 037"                    }, {"value":   "1 016"                    }, {"value":     "997"                     }, {"value":     "980"                     }, {"value":     "965"                     }, {"value":    "951"                   }, {"value":    "938"                   }, {"value":    "927"                     }, {"value":    "916"                     }]
 ,[{"value":     "60 000", "isheader": true}, {"value":  "1 141"},                     {"value": "1 105"                   }, {"value": "1 076"                 }, {"value":  "1 051"                    }, {"value":   "1 030"                    }, {"value":   "1 011"                     }, {"value":     "994"                     }, {"value":     "979"                     }, {"value":    "965"                   }, {"value":    "952"                   }, {"value":    "941"                     }]
 ,[{"value":     "65 000", "isheader": true}, {"value":  "1 154"},                     {"value": "1 118"                   }, {"value": "1 089"                 }, {"value":  "1 064"                    }, {"value":   "1 043"                    }, {"value":   "1 024"                     }, {"value":   "1 007"                     }, {"value":     "992"                     }, {"value":    "978"                   }, {"value":    "965"                   }]
 ,[{"value":     "70 000", "isheader": true}, {"value":  "1 166"},                     {"value": "1 130"                   }, {"value": "1 101"                 }, {"value":  "1 076"                    }, {"value":   "1 055"                    }, {"value":   "1 036"                     }, {"value":   "1 019"                     }, {"value":   "1 004"                     }, {"value":    "990"                   }]
 ,[{"value":     "75 000", "isheader": true}, {"value":  "1 177"},                     {"value": "1 141"                   }, {"value": "1 112"                 }, {"value":  "1 087"                    }, {"value":   "1 066"                    }, {"value":   "1 047"                     }, {"value":   "1 030"                     }, {"value":   "1 015"                     }]
 ,[{"value":     "80 000", "isheader": true}, {"value":  "1 187"},                     {"value": "1 151"                   }, {"value": "1 122"                 }, {"value":  "1 097"                    }, {"value":   "1 076"                    }, {"value":   "1 057"                     }, {"value":   "1 040"                     }]
 ,[{"value":     "85 000", "isheader": true}, {"value":  "1 197"},                     {"value": "1 161"                   }, {"value": "1 132"                 }, {"value":  "1 107"                    }, {"value":   "1 086"                    }, {"value":   "1 067"                     }]
 ,[{"value":     "90 000", "isheader": true}, {"value":  "1 206"},                     {"value": "1 170"                   }, {"value": "1 141"                 }, {"value":  "1 116"                    }, {"value":   "1 095"                    }]
 ,[{"value":     "95 000", "isheader": true}, {"value":  "1 214"},                     {"value": "1 179"                   }, {"value": "1 150"                 }, {"value":  "1 125"                    }, {"value":   "1 104"                    }]
 ,[{"value":    "100 000", "isheader": true}, {"value":  "1 223"},                     {"value": "1 187"                   }, {"value": "1 158"                 }, {"value":  "1 133"                    }, {"value":   "1 112"                    }]
]}' || crlf;
      RETURN ljson;
  END ;

/* **************************************************************
PIVOT
************************************************************** */
  FUNCTION F_PIVOT(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
    ljson CLOB:='';
    crlf CHAR(2):='
';
    CURSOR C1
    IS
    /*
    select TO_CHAR(DOS.DPRDTCREATION, 'MM YYYY') as Month, dos.dprversion, count(dos.dosid) as cnt
      FROM dossierprospect dos
      left outer JOIN dprpropfinance dpr ON dpr.dosid = dos.dosid AND dos.dprversion = dpr.dprversion and dpr.dpfflagretenue = 1
      left outer JOIN propositionfinanciere prop      ON prop.pfiid    = dpr.pfiid
      left outer JOIN LANTTRPARAM LANT on LANT.TTRNOM='AVPHASEDOSSIER' and LANT.TTPCODE=dpr.dprversion AND LANT.LANCODE='EN'
    left outer JOIN DPRDATECLE DDC ON DDC.DOSID = DOS.DOSID AND DDC.DPRVERSION = DOS.DPRVERSION AND DDC.DCLCODE = 'DTMEP'
    left outer JOIN PFICOMMISSION COM ON COM.PFIID = PROP.PFIID AND COM.TCOCODE = 'DEALERCOMM'
    GROUP BY TO_CHAR(DOS.DPRDTCREATION, 'MM YYYY'), dos.dprversion
    order by TO_CHAR(DOS.DPRDTCREATION, 'MM YYYY'), dos.dprversion
    ;
    */

with T as (
select TO_CHAR(DOS.DPRDTCREATION, 'YYYY MM') as Month, dos.dprversion as step, SUM(prop.pfiinvestissement) as cnt
      FROM dossierprospect dos
      left outer JOIN dprpropfinance dpr ON dpr.dosid = dos.dosid AND dos.dprversion = dpr.dprversion and dpr.dpfflagretenue = 1
      left outer JOIN propositionfinanciere prop      ON prop.pfiid    = dpr.pfiid
      left outer JOIN LANTTRPARAM LANT on LANT.TTRNOM='AVPHASEDOSSIER' and LANT.TTPCODE=dpr.dprversion AND LANT.LANCODE='EN'
    left outer JOIN DPRDATECLE DDC ON DDC.DOSID = DOS.DOSID AND DDC.DPRVERSION = DOS.DPRVERSION AND DDC.DCLCODE = 'DTMEP'
    left outer JOIN PFICOMMISSION COM ON COM.PFIID = PROP.PFIID AND COM.TCOCODE = 'DEALERCOMM'
    GROUP BY TO_CHAR(DOS.DPRDTCREATION, 'YYYY MM'), dos.dprversion
    order by TO_CHAR(DOS.DPRDTCREATION, 'YYYY MM'), dos.dprversion
)
Select * from T
PIVOT (
  SUM ( cnt ) AS cnt FOR (step)
  IN ('NEGO' As Nego, 'FIN' AS Fin, 'PROD' As Prod)
  )
;


    BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

      ljson := '{' || crlf
      || '  "type": "table",' || crlf
      || '  "title": "PAV4_GENERIC_POS_CHART.F_PIVOT.TurnoverPerMonthAndStep",' || crlf
      || '  "data": [' || crlf;
      ljson := ljson || '  [{"value": null, "isheader": true}, {"value": "PAV4_GENERIC_POS_CHART.F_PIVOT.Negociation", "isheader": true}, {"value": "PAV4_GENERIC_POS_CHART.F_PIVOT.Financial", "isheader": true}, {"value": "PAV4_GENERIC_POS_CHART.F_PIVOT.Production", "isheader": true}]' || crlf;
      FOR C1r IN C1
      LOOP
        ljson := ljson || ' ,['
        ||   '{"value":"' || coalesce(C1r.Month, 'null') || '", "isheader": true}'
        || ', {"value":' || coalesce(C1r.NEGO_CNT, 0) || ', "link": {"type": "external", "url":"google.fr"} }'
        || ', {"value":' || coalesce(C1r.FIN_CNT, 0) || ', "link": {"type": "internal", "url":"pos/deals"} }'
        || ', {"value":' || coalesce(C1r.PROD_CNT, 0) || ', "link": {"type": "drill", "url":"/charts/DEALINPROGRESS", "key": "keyToUseToFetchData"} }'
        || ']';
        ljson := ljson || crlf;
      END LOOP;
      ljson := ljson || ']' || crlf;
      ljson := ljson || '}' || crlf;
      RETURN ljson;
  END F_PIVOT;

/* **************************************************************
FLEETSTRUCTPERBRAND
************************************************************** */
  FUNCTION F_FLEETSTRUCTPERBRAND(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
    ljson CLOB:='';
    crlf CHAR(2):='
';
/*
    CURSOR C1
    IS

with T as (
select TO_CHAR(DOS.DPRDTCREATION, 'YYYY MM') as Month, dos.dprversion as step, SUM(prop.pfiinvestissement) as cnt
      FROM dossierprospect dos
      left outer JOIN dprpropfinance dpr ON dpr.dosid = dos.dosid AND dos.dprversion = dpr.dprversion and dpr.dpfflagretenue = 1
      left outer JOIN propositionfinanciere prop      ON prop.pfiid    = dpr.pfiid
      left outer JOIN LANTTRPARAM LANT on LANT.TTRNOM='AVPHASEDOSSIER' and LANT.TTPCODE=dpr.dprversion AND LANT.LANCODE='EN'
    left outer JOIN DPRDATECLE DDC ON DDC.DOSID = DOS.DOSID AND DDC.DPRVERSION = DOS.DPRVERSION AND DDC.DCLCODE = 'DTMEP'
    left outer JOIN PFICOMMISSION COM ON COM.PFIID = PROP.PFIID AND COM.TCOCODE = 'DEALERCOMM'
    GROUP BY TO_CHAR(DOS.DPRDTCREATION, 'YYYY MM'), dos.dprversion
    order by TO_CHAR(DOS.DPRDTCREATION, 'YYYY MM'), dos.dprversion
)
Select * from T
PIVOT (
  SUM ( cnt ) AS cnt FOR (step)
  IN ('NEGO' As Nego, 'FIN' AS Fin, 'PROD' As Prod)
  )
;

*/
    BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

      ljson := '{
   "type": "table",
   "title": "PAV4_GENERIC_POS_CHART.F_FLEETSTRUCTPERBRAND.TurnoverPerType",
   "data": [
 [{"value": null, "isheader": true},   {"value": "PAV4_GENERIC_POS_CHART.F_FLEETSTRUCTPERBRAND.LTL", "isheader": true},  {"value": "PAV4_GENERIC_POS_CHART.F_FLEETSTRUCTPERBRAND.PS", "isheader": true}, {"value": "PAV4_GENERIC_POS_CHART.F_FLEETSTRUCTPERBRAND.Total"  ,"isheader": true}, {"value":   "%"  ,"isheader": true}],
 [{"value": "RENAULT"},                {"value":  673},                    {"value": 24},                   {"value":  697    ,"istotal": true},  {"value": "36%"  ,"istotal": true}],
 [{"value": "VOLKSWAGEN"},             {"value":  415},                    {"value": 24},                   {"value":  697    ,"istotal": true},  {"value": "36%"  ,"istotal": true}],
 [{"value": "CITROEN"},                {"value":  155},                    {"value": 2 },                   {"value":  417    ,"istotal": true},  {"value": "11%"  ,"istotal": true}],
 [{"value": "PEUGEOT"},                {"value":  107},                    {"value": 4 },                   {"value":  159    ,"istotal": true},  {"value": "8%"   ,"istotal": true}],
 [{"value": "FORD"},                   {"value":  39 },                    {"value": 7 },                   {"value":  114    ,"istotal": true},  {"value": "2%"    ,"istotal": true}],
 [{"value": "BMW"},                    {"value":  14 },                    {"value": 39},                   {"value":    3      ,"istotal": true},  {"value": "1%"   ,"istotal": true}],
 [{"value": "AUDI"},                   {"value":  13 },                    {"value": 1 },                   {"value":   15     ,"istotal": true},  {"value": "1%"   ,"istotal": true}],
 [{"value": "VOLVO"},                  {"value":  10 },                    {"value": 1 },                   {"value":   14     ,"istotal": true},  {"value": "4%"    ,"istotal": true}],
 [{"value": "Autres"},                 {"value":  23 },                    {"value": 4 },                   {"value":   27     ,"istotal": true},  {"value": "1%"   ,"istotal": true}],
 [{"value": "Total", "istotal": true}, {"value": 1449, "istotal": true},{"value": "43", "istotal": true},   {"value": 1492   ,"istotal": true},  {"value": "100%" ,"istotal": true}]
]}' || crlf;
      RETURN ljson;
  END F_FLEETSTRUCTPERBRAND;


/* **************************************************************
HTMLIMAGE
************************************************************** */
  FUNCTION F_HTMLIMAGE(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
  RETURN CLOB
  IS
    ljson CLOB:='';
	image varchar(256);
	title varchar(256);
  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

	image := P_PARAMS('image');
	title := P_PARAMS('title');

    ljson := ljson ||
'{
    "title": "' || title || '",
    "type" : "HTML",
    "content": "';
    ljson := ljson || '<img src=''' || image || ''' width=''100%''>';
    ljson := ljson || '"
}';
    RETURN ljson;
  END ;

/* **************************************************************
HTMLARKLE
************************************************************** */
  FUNCTION F_HTMLARKLE(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
  RETURN CLOB
  IS
    ljson CLOB:='';
  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

    ljson := ljson ||
'{
    "title": "News from the Front",
    "type" : "HTML",
    "content": "';
    ljson := ljson || '<img src=''https://www.arklefinance.co.uk/sites/all/arklefinance-public/files/Homebanner-1.png'' width=''100%''>';
/*
    ljson := ljson || '<img src=''https://www.arklefinance.co.uk/sites/all/arklefinance-public/files/Homebanner-1.png'' width=''100%''>';
    ljson := ljson || '
    ';
*/
    ljson := ljson || '"
}';
    RETURN ljson;
  END F_HTMLARKLE;

/* **************************************************************
HTMLCASSIOPAE
************************************************************** */
  FUNCTION F_HTMLCASSIOPAE(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
  RETURN CLOB
  IS
    ljson CLOB:='';
  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

    ljson := ljson ||
'{
    "title": "News from the Front",
    "type" : "HTML",
    "content": "';
    ljson := ljson || '<ul class=\"dashboardbloglist\">';
    ljson := ljson || '<li>';
    ljson := ljson || '<div class=\"postimg\">';
    ljson := ljson || '<img class=\"alignleft imgbox\" alt=\"\" src=\"http://cassiopae.com/wp-content/uploads/2016/02/cass-blog-fp-02262016-180x180.jpg\"></div>';
    ljson := ljson || '<div class=\"postcontent\">';
    ljson := ljson || '<h3><a href=\"http://cassiopae.com/finance-professional-conference-manchester/\">Cassiopae at Inaugural Finance Professional Conference in Manchester, UK</a></h3>';
    ljson := ljson || '<div class=\"metapost\"> <span class=\"postdate\">Posted February 24, 2016</span> <span class=\"postedon\">in <a href=\"http://cassiopae.com/category/events/\" rel=\"category tag\">Events</a></span> </div>';
    ljson := ljson || '<p>Cassiopae will join IFAs, residential mortgage brokers, commercial finance brokers, introducers, and secured and alternative partners at the inaugural Financial Professional Conference in Manchester, UK on March 2nd. The event is being held at the Manchester Central Convention Complex. The whole-day event includes informative finance market sessions, networking, exhibitions, and an evening reception, dinner and entertainment. Cassiopae Business Development [...]</p>';
    ljson := ljson || '<span class=\"readmore\"><a href=\"http://cassiopae.com/finance-professional-conference-manchester/\">Read More</a></span>';
    ljson := ljson || '<div class=\"clear\"></div>';
    ljson := ljson || '</div>';
    ljson := ljson || '</li>';

    ljson := ljson || '<li>';
    ljson := ljson || '<div class=\"postimg\" style=\"float:right;\">';
    ljson := ljson || '<img class=\"alignleft imgbox\" alt=\"\" src=\"http://cassiopae.com/wp-content/uploads/2016/02/CASS-Seoul-180px-02182016-180x180.jpg\">';
    ljson := ljson || '</div>';
    ljson := ljson || '<div class=\"postcontent\">';
    ljson := ljson || '<h3><a href=\"http://cassiopae.com/cassiopae-to-expand-operations-with-new-office-in-seoul/\">Cassiopae to Expand Operations with New Office in Seoul</a></h3>';
    ljson := ljson || '<div class=\"metapost\"> <span class=\"postdate\">Posted February 18, 2016</span> <span class=\"postedon\">in <a href=\"http://cassiopae.com/category/press-releases/\" rel=\"category tag\">Press Releases</a></span> </div>';
    ljson := ljson || '<p>Cassiopae announces the establishment of its new business operations in Seoul, Korea. Cassiopae can now locally support globalization of Korean headquartered finance companies as well as global finance system deployments that include Korea. Cassiopae?s new Korea entity will enable the company to provide high-quality support for its clients in the region including one of the [...]</p>';
    ljson := ljson || '<span class=\"readmore\"><a href=\"http://cassiopae.com/cassiopae-to-expand-operations-with-new-office-in-seoul/\">Read More</a></span>';
    ljson := ljson || '<div class=\"clear\"></div>';
    ljson := ljson || '</div>';
    ljson := ljson || '</li>';

    ljson := ljson || '</ul>';

/*
    ljson := ljson || '<img src=''https://www.arklefinance.co.uk/sites/all/arklefinance-public/files/Homebanner-1.png'' width=''100%''>';
    ljson := ljson || '
    ';
*/
    ljson := ljson || '"
}';
    RETURN ljson;
  END F_HTMLCASSIOPAE;

/* **************************************************************
HTMLCHECKUSER
************************************************************** */
  FUNCTION F_HTMLCHECKUSER(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
  RETURN CLOB
  IS
    ljson CLOB:='';
  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

    ljson := ljson ||
'{
    "title": "Check user",
    "type" : "HTML",
    "content": "';
    ljson := ljson || suticode;
    ljson := ljson || '"
}';
    RETURN ljson;
  END F_HTMLCHECKUSER;

  /* **************************************************************
CONTACTLIST
************************************************************** */
  FUNCTION F_CONTACTLIST(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
    ljson CLOB:='';
  BEGIN

  /* TMP WAITING FOR FRAMEWORK FIX */ execute immediate 'alter session set  NLS_NUMERIC_CHARACTERS = ''.,''';

    ljson := ljson ||
'{
    "title": "PAV4_GENERIC_POS_CHART.F_CONTACTLIST.ContactList",
    "type" : "CONTACTLIST",
    "contacts": [
        {
            "name": "All Beback",
            "phone": "+44 1 2321 329",
            "email": "all.beback@cassiopae-financials.com",
            "skype": "all.beback"
        },
        {
            "name": "John Doe",
            "phone": "+44 1 2345 768",
            "email": "john.doe@cassiopae-financials.com",
            "skype": "john.doe"
        },
        {
            "name": "Paula Smith",
            "phone": "+44 1 3023 438",
            "email": "paula.smith@cassiopae-financials.com",
            "skype": "paula.smith"
        }
    ]
}';
    RETURN ljson;
  END F_CONTACTLIST;

/* **************************************************************
SQLERROR
************************************************************** */
  FUNCTION F_SQLERROR(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
	res number := 0;
  BEGIN
    select 1/0 into res from dual;
    RETURN '';
  END F_SQLERROR;

/* **************************************************************
TESTPARAMS
************************************************************** */
  FUNCTION F_HTMLTESTPARAMS(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
    ljson CLOB:='';
	  crlf CHAR(2) := '
';
  BEGIN
    ljson := ljson ||
'{
    "title": "Test parameters",
    "type" : "HTML",
    "content": "';
    ljson := ljson || 'params:' || p_params('params');
    ljson := ljson || '<br>';
    ljson := ljson || 'extparams:' || p_params('extparams') || '"' || crlf;
    ljson := ljson || '}';
    RETURN ljson;
  END F_HTMLTESTPARAMS;

/* **************************************************************
PENETRETIONRATEAREA
************************************************************** */
  FUNCTION F_PENETRETIONRATEAREA(
    SUTICODE UTILISATEUR.UTICODE%TYPE,
    P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
    crlf CHAR(2) := '
';
  comma CHAR(2) :=',';
  ljson Clob := '';

  v_date Clob := '';
  v_created Clob := '';
  v_promoted Clob := '';
  v_submitted Clob := '';
  v_approved Clob := '';
  v_transfered Clob := '';

  t_date varchar(10);
  t_created integer;
  t_promoted integer;
  t_submitted integer;
  t_Approved integer;
  t_transfered integer;

  cursor C1
  is
    SELECT
    "Deal creation month",
    COUNT("Deal number")-(SUM("Promoted")+SUM("Submitted")+SUM("Approved")+SUM("Transfered")) "Created",
    SUM("Promoted") "Promoted",
    SUM("Submitted") "Submitted",
    SUM("Approved") "Approved",
    SUM("Transfered") "Transfered"
    FROM
    (
    SELECT DISTINCT(DPR.DPRNUMERO) "Deal number",
      TO_CHAR(DPR.DPRDTCREATION,'YYYY-MM') "Deal creation month",
      NVL(
      (SELECT MAX(1)
      FROM DPRDECISION DD
      WHERE DD.DOSID   =DPR.DOSID
      AND DD.DPRVERSION='NEGO'
      AND DD.ADECODE   ='PROMOTETODEAL'
      ),0) "Promoted",
      NVL(
      (SELECT MAX(1)
      FROM DPRPHASE DP
      WHERE DP.DOSID   =DPR.DOSID
      AND DP.PHACODE='FIN'
      AND DP.JALCODE  IN ('D_WTDEC','D_MINFO','TRANSM')
      AND DP.DPHDTEND IS NULL
      ),0) "Submitted",
      NVL(
      (SELECT MAX(1)
      FROM DPRPHASE DP
      WHERE DP.DOSID   =DPR.DOSID
      AND DP.PHACODE='FIN'
      AND DP.JALCODE  IN ('D_APP')
      ),0) "Approved",
      NVL(
      (SELECT MAX(1)
      FROM DPRPHASE DP
      WHERE DP.DOSID   =DPR.DOSID
      AND DP.PHACODE='TRANS'
      ),0) "Transfered"
    FROM DOSSIERPROSPECT DPR
    WHERE DPR.DPRVERSION='NEGO'
    AND DPR.DPRDTCREATION > add_months(trunc(sysdate, 'MM'), -12) order by 1 desc
    ) GROUP BY "Deal creation month" ORDER BY 1;

BEGIN

    ljson := ljson || '{
  "type": "Area",
  "title": "PAV4_GENERIC_POS_CHART.F_PENETRETIONRATEAREA.PenetrationRate",
  "options": {
    "scaleShowVerticalLines": true,
    "scales": {
      "yAxes": [{
        "stacked": true
      }]
    },
    "legend": {
      "display": true,
      "position": "bottom"
    }
  },
  "data": {
';
    comma := '';
    open C1;
    loop
      fetch C1 into t_date, t_created, t_promoted, t_submitted, t_approved, t_transfered;
      exit when C1%notfound;

      v_date := v_date || comma || ' "' || t_date || '"';
      v_created := v_created || comma || ' ' || t_created || '';
      v_promoted := v_promoted || comma || ' ' || t_promoted || '';
      v_submitted := v_submitted || comma || ' ' || t_submitted || '';
      v_approved := v_approved || comma || ' ' || t_approved || '';
      v_transfered := v_transfered || comma || ' ' || t_transfered || '';
      comma := ',';
    end loop;
    close C1;

    ljson := ljson || '"labels" : [' || v_date || '],' || crlf;
    ljson := ljson || '"datasets" : [' || crlf;

    ljson := ljson || '{ "label": "Created", "data": [' || v_created || '] },' || crlf;
    ljson := ljson || '{ "label": "Promoted", "data": [' || v_promoted || '] },' || crlf;
    ljson := ljson || '{ "label": "Submitted", "data": [' || v_submitted || '] },' || crlf;
    ljson := ljson || '{ "label": "Approved", "data": [' || v_approved || '] },' || crlf;
    ljson := ljson || '{ "label": "Transfered", "data": [' || v_transfered || '] }' || crlf;

    ljson := ljson || ']' || crlf;
    ljson := ljson || '  }' || crlf;
    ljson := ljson || '}' || crlf;

    return ljson;
end;

/* **************************************************************
PENETRETIONRATETABLE
************************************************************** */
  FUNCTION F_PENETRETIONRATETABLE(
    SUTICODE UTILISATEUR.UTICODE%TYPE,
    P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
    RETURN CLOB
  IS
    crlf CHAR(2) := '
';
  comma CHAR(2) :='';
  ljson Clob := '';

  cursor C1
  is
    select DCM, C, P, (100*P)/C "P2", S, (100*S)/C "S2", A, (100*A)/C "A2", TR, (100*TR)/C "TR2" From
    (
      SELECT DCM, TOT "C", TOT-C "P", TOT-C-P "S", TOT-C-P-S "A", TOT-C-P-S-A "TR" from
      (
       SELECT
        "Deal creation month" "DCM",
        COUNT("Deal number") "TOT",
        COUNT("Deal number")-(SUM("Promoted")+SUM("Submitted")+SUM("Approved")+SUM("Transfered")) "C",
        SUM("Promoted") "P",
        SUM("Submitted") "S",
        SUM("Approved") "A",
        SUM("Transfered") "TR"
        FROM
        (
        SELECT DISTINCT(DPR.DPRNUMERO) "Deal number",
          TO_CHAR(DPR.DPRDTCREATION,'YYYY-MM') "Deal creation month",
          NVL(
          (SELECT MAX(1)
          FROM DPRDECISION DD
          WHERE DD.DOSID   =DPR.DOSID
          AND DD.DPRVERSION='NEGO'
          AND DD.ADECODE   ='PROMOTETODEAL'
          ),0) "Promoted",
          NVL(
          (SELECT MAX(1)
          FROM DPRPHASE DP
          WHERE DP.DOSID   =DPR.DOSID
          AND DP.PHACODE='FIN'
          AND DP.JALCODE  IN ('D_WTDEC','D_MINFO','TRANSM')
          AND DP.DPHDTEND IS NULL
          ),0) "Submitted",
          NVL(
          (SELECT MAX(1)
          FROM DPRPHASE DP
          WHERE DP.DOSID   =DPR.DOSID
          AND DP.PHACODE='FIN'
          AND DP.JALCODE  IN ('D_APP')
          ),0) "Approved",
          NVL(
          (SELECT MAX(1)
          FROM DPRPHASE DP
          WHERE DP.DOSID   =DPR.DOSID
          AND DP.PHACODE='TRANS'
          ),0) "Transfered"
        FROM DOSSIERPROSPECT DPR
        WHERE DPR.DPRVERSION='NEGO'
        AND DPR.DPRDTCREATION > add_months(trunc(sysdate, 'MM'), -12) order by 1 desc
        ) GROUP BY "Deal creation month" ORDER BY 1
      )
    );
    type row_values is table of C1%rowtype;
    v_values row_values;

    type array_titles is varray(10) of varchar2(30);
    titles array_titles := array_titles(
      'Deal creation month',
      'Created',
      'Promoted',
      'Promoted %',
      'Submitted',
      'Submitted %',
      'Approved',
      'Approved %',
      'Transfered',
      'Transfered %'
    );

  begin
    ljson := '{
    "type": "table",
    "title": "PAV4_GENERIC_POS_CHART.F_PENETRETIONRATETABLE.PenetrationRate",
    "data": [' || crlf || '[';
    for i in 1..titles.count
    loop
      ljson := ljson || comma || '{"value": "' || titles(i) || '", "isheader": true}';
      comma := ', ';
    end loop;
    ljson := ljson || '],' || crlf;

    comma := '';
    for v_row in C1
    loop
      ljson := ljson || comma || '[';
      comma := ',';

      ljson := ljson || '{"value": "' || v_row.dcm || '", "isheader": true}, ';
      ljson := ljson || '{"value": "' || v_row.c || '"},';
      ljson := ljson || '{"value": "' || v_row.p || '"},';
      ljson := ljson || '{"value": "' || trim(' ' from to_char(round(v_row.p2,2),'990.99')) || '%"},';
      ljson := ljson || '{"value": "' || v_row.s || '"},';
      ljson := ljson || '{"value": "' || trim(' ' from to_char(round(v_row.s2,2),'990.99')) || '%"},';
      ljson := ljson || '{"value": "' || v_row.a || '"},';
      ljson := ljson || '{"value": "' || trim(' ' from to_char(round(v_row.a2,2),'990.99')) || '%"},';
      ljson := ljson || '{"value": "' || v_row.tr || '"},';
      ljson := ljson || '{"value": "' || trim(' ' from to_char(round(v_row.tr2,2),'990.99')) || '%"}';
      
      ljson := ljson || ']';
    end loop;
    ljson := ljson || ']}' || crlf;
    RETURN ljson;
  END ;

END PAV4_GENERIC_POS_CHART;
/
