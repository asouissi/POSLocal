CREATE OR REPLACE PACKAGE PAV4_GENERIC_POS_DASHBOARD
AS
	
	FUNCTION GETDASHBOARDS(
		SUTICODE UTILISATEUR.UTICODE%TYPE,
		P_PARAMS VARCHAR2,
		P_EXTPARAMS VARCHAR2)
	RETURN CLOB;

	FUNCTION F_MAIN(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;
	
	FUNCTION F_1(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_CMS(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;
	
	FUNCTION F_BLANK(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;
	
	FUNCTION F_MYDEALS(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_MANAGER(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_MANAGER2(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_PRICINGMATRIX(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

	FUNCTION F_WSMYCREDITLINES(
	 	SUTICODE UTILISATEUR.UTICODE%TYPE,
	 	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
	RETURN CLOB;

END ;
/


CREATE OR REPLACE PACKAGE BODY PAV4_GENERIC_POS_DASHBOARD
AS

FUNCTION GETDASHBOARDS( 
	SUTICODE UTILISATEUR.UTICODE%TYPE,
	P_PARAMS VARCHAR2,
	P_EXTPARAMS VARCHAR2)
RETURN CLOB
IS
  ljson CLOB:='';
  crlf CHAR(2) := '
';
  groupecode varchar2(15);

BEGIN

  select groupe.grocode into groupecode  from groupe inner join utilisateur on utilisateur.grocode = groupe.grocode where utilisateur.uticode = suticode;


  ljson := ljson || '{' || crlf;
  ljson := ljson || '  "user": "' || suticode || '",' || crlf;
  ljson := ljson || '  "dashboards": [' || crlf;
  if groupecode<> 'WSL' then
    ljson := ljson || '    { "title": "Dashboard 1", "id": "MAIN" }' || crlf;
    ljson := ljson || '   ,{ "title": "Dashboard 2", "id": "1" }' || crlf;
    ljson := ljson || '   ,{ "title": "CMS sample", "id": "CMS" }' || crlf;
    ljson := ljson || '   ,{ "title": "Blank", "id": "BLANK" }' || crlf;
  end if ; 
  
  If suticode = 'ORFI' Then
    ljson := ljson || '   ,{ "title": "Manager", "id": "MANAGER" }' || crlf;
    ljson := ljson || '   ,{ "title": "Manager 2", "id": "MANAGER2" }' || crlf;
  End If;
  
  ljson := ljson || '  ]
}
';
  RETURN ljson;
END GETDASHBOARDS;

/* **************************************************************
F_MAIN, dashboard
************************************************************** */  
FUNCTION F_MAIN(
	SUTICODE UTILISATEUR.UTICODE%TYPE,
	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
RETURN CLOB
IS
  ljson CLOB:='{ 
    "Editable": false
  , "layout": [                  
[
  {"url":"/charts/KPIDEALINPROGRESS", "layoutClass": "col-md-3 col-xs-6"},
  {"url":"/charts/KPICOMMISSION", "layoutClass": "col-md-3 col-xs-6"},
  {"url":"/charts/KPIPROPOSALATTENTION", "layoutClass": "col-md-3 col-xs-6"},
  {"url":"/charts/KPIRENEGOCIATION", "layoutClass": "col-md-3 col-xs-6"}
],        
[
  {"url":"/charts/DEALINPROGRESS"},
  {"url":"/charts/COMMISSIONPERMONTH"},
  {"url":"/charts/SALESPERMONTH2"}
],        
[
  {"url":"/charts/CONTACTLIST", "layoutClass": "col-md-4"},
  {"url":"/charts/HTMLCASSIOPAE", "layoutClass": "col-md-8"}
]
]}';

BEGIN
  RETURN ljson;
END F_MAIN; 

/* **************************************************************
DASHB_1, dashboard
************************************************************** */  
FUNCTION F_1(
	SUTICODE UTILISATEUR.UTICODE%TYPE,
	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
RETURN CLOB
IS
  ljson CLOB:='{ "layout": [                  
[
  {"url":"/charts/KPIDEALINPROGRESS", "layoutClass": "col-md-3 col-xs-6"},
  {"url":"/charts/KPICOMMISSION", "layoutClass": "col-md-3 col-xs-6"},
  {"url":"/charts/KPIPROPOSALATTENTION", "layoutClass": "col-md-3 col-xs-6"},
  {"url":"/charts/KPIRENEGOCIATION", "layoutClass": "col-md-3 col-xs-6"}
],        
[
  {"url":"/charts/DEALINPROGRESS"},
  {"url":"/charts/COMMISSIONPERMONTH"},
  {"url":"/charts/SALESPERMONTHAREA"}
],        
[
  {"url":"/charts/HTMLIMAGE?title=Cassiopae' || chr(38) || 'image=http://cassiopae.com/wp-content/uploads/2015/01/hp-slider-commlending-en.jpg"},
  {"url":"/charts/FLEETSTRUCTPERBRAND"},
  {"url":"/charts/PIVOT"}
],        
[
  {"url":"/charts/HTMLARKLE"},
  {"url":"/charts/PIVOT"}
]
]}';

BEGIN
  RETURN ljson;
END F_1; 

/* **************************************************************
F_MAIN, dashboard
************************************************************** */  
FUNCTION F_CMS(
	SUTICODE UTILISATEUR.UTICODE%TYPE,
	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
RETURN CLOB
IS
  ljson CLOB:='{ "layout": [                  
[
  {"url":"/charts/HTMLCASSIOPAE", "layoutClass": "col-md-8"},
  {"url":"/charts/CONTACTLIST", "layoutClass": "col-md-4"}
]
]}';

BEGIN
  RETURN ljson;
END ; 

/* **************************************************************
F_BLANK, dashboard
************************************************************** */  
FUNCTION F_BLANK(
	SUTICODE UTILISATEUR.UTICODE%TYPE,
	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
RETURN CLOB
IS
  ljson CLOB:='{ 
    "Editable": true
  , "layout": [                  
[
]
]}';

BEGIN
  RETURN ljson;
END ; 

/* **************************************************************
F_MYDEALS, dashboard
************************************************************** */  
FUNCTION F_MYDEALS(
	SUTICODE UTILISATEUR.UTICODE%TYPE,
	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
RETURN CLOB
IS
  ljson CLOB:='{ "layout": [                  
[
  {"url":"/charts/DEALINPROGRESS"},
  {"url":"/charts/SALESPERMONTH2"},
  {"url":"/charts/COMMISSIONPERMONTH"}
]
]  
}';
BEGIN
  RETURN ljson;
END F_MYDEALS;

/* **************************************************************
F_MANAGER, dashboard
************************************************************** */  
FUNCTION F_MANAGER(
	SUTICODE UTILISATEUR.UTICODE%TYPE,
	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
RETURN CLOB
IS
  ljson CLOB:='{ "layout": [                  
[
  {"url":"/charts/KPIDEALINPROGRESS", "layoutClass": "col-md-4 col-xs-12"}
 ,{"url":"/charts/KPICOMMISSION", "layoutClass": "col-md-4 col-xs-12"}
 ,{"url":"/charts/KPIPROPOSALATTENTION", "layoutClass": "col-md-4 col-xs-12"}
],        
[
  {"url":"/charts/COMMISSIONPERMONTH"},
  {"url":"/charts/SALESPERMONTHAREA"},
  {"url":"/charts/DEALINPROGRESS"}
],        
[
  {"url":"/charts/KPIRENEGOCIATION", "layoutClass": "col-md-4 col-xs-12"}
 ,{"url":"/charts/KPICONVERSIONRATE", "layoutClass": "col-md-4 col-xs-12"}
 ,{"url":"/charts/KPIAPPROVALRATE", "layoutClass": "col-md-4 col-xs-12"}
]
]}';

BEGIN
  RETURN ljson;
END ; 

/* **************************************************************
F_MANAGER2, dashboard
************************************************************** */  
FUNCTION F_MANAGER2(
	SUTICODE UTILISATEUR.UTICODE%TYPE,
	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
RETURN CLOB
IS
  ljson CLOB:='{ "layout": [                  
[
  {"url":"/charts/PIVOTCHART", "layoutClass": "col-md-12 col-xs-12"}
]
]}';

BEGIN
  RETURN ljson;
END ; 

/* **************************************************************
F_PRICINGMATRIX, dashboard
************************************************************** */  
FUNCTION F_PRICINGMATRIX(
	SUTICODE UTILISATEUR.UTICODE%TYPE,
	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
RETURN CLOB
IS
  ljson CLOB:='{ "layout": [                  
[
  {"url":"/charts/PRICINGMATRIX", "layoutClass": "col-md-12 col-xs-12"}
]
]}';

BEGIN
  RETURN ljson;
END ; 

/* **************************************************************
F_WSMYCREDITLINES, dashboard
************************************************************** */  
FUNCTION F_WSMYCREDITLINES(
	SUTICODE UTILISATEUR.UTICODE%TYPE,
	P_PARAMS PAV4_GENERIC_POS.T_PARAMS)
RETURN CLOB
IS
  ljson CLOB:='{ "layout": [                  
[
  {"url":"/charts/WSOUTSTANDING", "layoutClass": "col-lg-6 col-xs-12"}
 ,{"url":"/charts/WSTABLESTOCK", "layoutClass": "col-lg-2 col-md-6 col-xs-12"}
 ,{"url":"/charts/WSTABLEINVOICESINTEREST", "layoutClass": "col-lg-2 col-md-6 col-xs-12"}
 ,{"url":"/charts/WSTABLEINVOICESPRINCIPAL", "layoutClass": "col-lg-2 col-md-6 col-xs-12"}
]
]  
}';
BEGIN
  RETURN ljson;
END ;

END ;
/
