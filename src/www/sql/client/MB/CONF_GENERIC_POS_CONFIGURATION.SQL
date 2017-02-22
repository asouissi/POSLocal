CREATE OR REPLACE PACKAGE CONF_GENERIC_POS_CONFIGURATION
AS
    TYPE T_CURSOR IS REF CURSOR;
	FUNCTION GETCONFIGURATION(suticode utilisateur.uticode%type) RETURN CLOB;

END ;
/


CREATE OR REPLACE PACKAGE BODY CONF_GENERIC_POS_CONFIGURATION
AS

FUNCTION GETCONFIGURATION( suticode utilisateur.uticode%type) RETURN CLOB
IS
  ljson CLOB:='';
  crlf CHAR(2) := '
';

  toplefttitle varchar(256);
  toplefttitleimage varchar(256);
  toplefttitleimagemin varchar(256);

  lastname varchar(256);
  firstname varchar(256);
  sRole ROLE.ROLCODE%TYPE;
  position utitsm.tsmmetier%type := null;
  positionTag varchar2(256) := null;
  currencycode char(3);
  currencysymbol varchar2(15);
  groupecode varchar2(15);
  groupelabel varchar2(128);
  locale varchar2(5);
  readonly number(1);
  skin varchar2(128);
  dealershipdefault varchar2(128);
  branddefault varchar2(128);
  dealershipcurrent varchar2(128);
  brandcurrent varchar2(128);
  skinoption varchar2(128);
  dealershipoption varchar2(128);
  brandoption varchar2(128);
  dealershipoptioncurrent varchar2(128);
  brandoptioncurrent varchar2(128);
  showskinselector varchar2(15);
  sberoption varchar2(1);

  landingpage varchar(256) := '';

  showtimeline varchar(15) := 'false';

  showposdeals varchar(15) := 'false';
  showposusers varchar(15) := 'false';
  showposquote varchar(15) := 'false';
  showposmasterfacility varchar(15) := 'false';
  showposdraw varchar(15) := 'false';
  showposassets varchar(15) := 'false';

  showposactors varchar(15) := 'false';
  showposdrivers varchar(15) := 'false';

  showwholesalecreditlines varchar(15) := 'false';
  showwholesalecreditline varchar(15) := 'false';
  showwholesaledraw varchar(15) := 'false';
  showposdocuments varchar(15) := 'false';
  defaultworkflow varchar2(15);
BEGIN

	-- Default workflow 
      Begin
        select TPATEXTE into defaultworkflow from topparam where toptable = 'POS' and TPAPARAM = 'WFNAME'; 
         Exception when NO_DATA_FOUND then
      defaultworkflow := '';
      end ; 
    -- sales network mode
    Begin
      select TPATEXTE into sberoption from topparam  where tpaparam='NETWORKSELECTIONSTEP' and toptable='SALESNETWORK';
       Exception when NO_DATA_FOUND then
      sberoption := '0';
    end;

  -- identity
  select utinom into lastname from utilisateur where uticode = suticode;
  select utiprenom into firstname from utilisateur where uticode = suticode;
  SELECT MAX(ROLCODE) INTO sRole FROM UTIACTDEFAULT WHERE UTICODE=suticode AND UADLINKTYPE='MYSELF';
  select groupe.grocode, groupe.grointitule into groupecode, groupelabel from groupe inner join utilisateur on utilisateur.grocode = groupe.grocode where utilisateur.uticode = suticode;

  -- position
  select min( tsmmetier ) into position from utitsm where uticode = suticode and tsmflagdefaut = 1;
  if position is null then
  	positionTag := 'null';
  else
  	positionTag := '"' || position || '"';
  end if;

  -- currency
  Begin
	select DEVSYMBOLE, devcode into currencysymbol, currencycode from devise where devcode = (
	select devcode
	from pays
	where paycode = ( select substr( uprstringvalue,4, 2 ) from utipreference where uticode=suticode and uprcode='LOCALE' ));
  Exception when NO_DATA_FOUND then
	currencycode := null;
  end;

  if currencycode is null then
    currencycode := 'EUR';
    currencysymbol := chr(128); /*euro sign*/
  end if;

-- dealership default
    Begin
      select coalesce(uprstringvalue, '') into dealershipdefault from utipreference where uticode=suticode and uprcode='DLRSHIPDEFAULT';
      dealershipoption := ',' || crlf || '"dealershipdefault": "' || dealershipdefault || '"';
    Exception when NO_DATA_FOUND then
      dealershipoption := '';
    end;

    -- brand default
    Begin
      select coalesce(uprstringvalue, '') into branddefault from utipreference where uticode=suticode and uprcode='BRANDDEFAULT';
      brandoption := ',' || crlf || '"branddefault": "' || branddefault || '"';
    Exception when NO_DATA_FOUND then
      brandoption := '';
    end;

-- dealership current
    Begin
      select coalesce(uprstringvalue, '') into dealershipcurrent from utipreference where uticode=suticode and uprcode='DLRSHIPCURRENT';
      dealershipoptioncurrent := ',' || crlf || '"dealershipcurrent": "' || dealershipcurrent || '"';
    Exception when NO_DATA_FOUND then
      dealershipoptioncurrent := '';
    end;

    -- brand current
    Begin
      select coalesce(uprstringvalue, '') into brandcurrent from utipreference where uticode=suticode and uprcode='BRANDCURRENT';
      brandoptioncurrent := ',' || crlf || '"brandcurrent": "' || brandcurrent || '"';
    Exception when NO_DATA_FOUND then
      brandoptioncurrent := '';
    end;

  -- skin
  Begin
      IF sberoption = 0 THEN
    select coalesce(uprstringvalue, '') into skin from utipreference where uticode=suticode and uprcode='POSSKIN';
      ELSE
        select coalesce(SNPPOSSKIN, ' ')  into skin from salesnetworkpreferences where uadsalesnetwork=brandcurrent;
        IF skin=' ' THEN
          select coalesce(uprstringvalue, '') into skin from utipreference where uticode=suticode and uprcode='POSSKIN';
        END IF;
      END IF;

    skinoption := ',' || crlf || '"skin": "' || skin || '"';
  Exception when NO_DATA_FOUND then
    skinoption := '';
  end;

  showskinselector := 'true';
  IF sRole = 'BRMAN' Then
    showposusers := 'true';
  END IF;

  if suticode = 'DEALERJD' Then
	toplefttitleimage := 'img/logos/johndeere-logo.png'; 
	toplefttitleimagemin := 'img/logos/johndeere-logo-min.png'; 
  elsif suticode = 'DEALERMB' Then
	toplefttitleimage := 'img/logos/metrobank-logo.png'; 
	toplefttitleimagemin := 'img/logos/metrobank-logo-min.png'; 
  elsif suticode = 'DEALERVW' Then
	toplefttitleimage := 'img/logos/volkswagen-logo.png'; 
	toplefttitleimagemin := 'img/logos/volkswagen-logo-min.png'; 
  else
    toplefttitle := 'Cassiopae'; 
  end if;  

  if groupecode = 'DEALER' Or groupecode = 'BROKER' Or groupecode = 'BROKER1' Or groupecode = 'BROKER2' Or groupecode = 'BROKER3' Or groupecode = 'GRPORFI' OR groupecode ='MTRBANK' Then

	toplefttitleimage := 'img/logos/metrobank-logo.png'; 
	toplefttitleimagemin := 'img/logos/metrobank-logo-min.png'; 

    showtimeline := 'true';
	showposdeals := 'true';
    showposquote := 'true';
    showposactors := 'true';
    --showposdocuments := 'true';
  --elsif groupecode = 'MANAGER' Then
    -- no menu

  end if;

  landingpage := '/pos/deals';


  select NVL(MAX( uprstringvalue ),'en_US') --for the new user created
  into locale
  from utipreference
  where uticode = suticode and uprcode = 'LOCALE';

   select NVL(MAX( UPRBOOLEANVALUE ),0)
   into readonly
   from utipreference
   where uticode = suticode and uprcode = 'READPOS';

  ljson := ljson || '{
  "user": {
    "uticode": "' || suticode || '",
    "firstname": "' || firstname || '",
    "lastname": "' || lastname || '",
    "groupecode": "' || groupecode || '",
    "groupelabel": "' || groupelabel || '",
    "defaultposition": ' || positionTag || ',
    "currencycode": "' || currencycode || '",
    "currencysymbol": "' || currencysymbol || '",
    "locale": "' || locale || '",
    "localeOverride": {
        "pos.mydeals.buttonFilter.finalisation": "Pending",
        "pos.mydeals.buttonFilter.negociation": "Enquiries",
        "pos.mydeals.buttonFilter.production": "Paid"
    },
	"defaultworkflow": "' || defaultworkflow || '",   
    "readonly": "' || readonly || '"'
    || skinoption || dealershipoption || brandoption || dealershipoptioncurrent || brandoptioncurrent || '
  },
  "options": {
    "toplefttitle": "' || toplefttitle || '"
    ,"toplefttitleimage": "' || toplefttitleimage || '"
    ,"toplefttitleimagemin": "' || toplefttitleimagemin || '"
    ,"landingpage": "' || landingpage || '"
    ,"HideLeftBar": false
    ,"HideTopBar": false
    ,"HideRightBar": false
    ,"showDashboardEditor": true
    ,"showskinselector": ' || showskinselector || '
    ,"networkstepselection": ' || sberoption || '
    ,"topLeftBarCartoucheVisible": false
  },
  "accesskeys": [
    {
      "key": "/pos/deals",
      "visible": ' || showposdeals || '
	  ,"rules": [
          {
                "field": "listdealasset[].acacode",
                "mandatory" :  true
            },
            {
                "field": "listdealasset[$1].makid",
                "mandatory" :  "(values, conf) => values.listdealasset[$1].acacode === \"CAR\""
            },
             {
                "component": "pos.summary.offerinfo.rv",
                "hidden" :  true
            }
             ,
             {
                "component": "pos.summary.offerinfo.profitability",
                "hidden" :  true
            }
             ,
             {
                "component": "pos.summary.offerinfo.frequency",
                "hidden" :  true
            },
			      {
                "component": "pos.summary.offerinfo.pfinom",
                "hidden" :  true
            }
        ]
    },   
    {
      "key": "/pos/quote",
      "visible": ' || showposquote || ' ';
       if groupecode != 'GRPORFI'
    Then 
   ljson := ljson ||' 
      ,"rules": [
            {
                "field": "listdealquote[].listdealquoteattribute[pfacode:TMP_FINDFROM].pfachaine",
                "hidden" :  true
            },
            {
                "field": "listdealquote[].listdealquoteattribute[pfacode:TMP_FINDWHAT].pfachaine",
                "hidden" :  true
            },
            {
                "field": "listdealquote[].listdealquoteattribute[pfacode:MTSUBSIDY].pfadouble",
                "hidden" :  true
            },
            {
                "field": "listdealquote[].listdealquoteattribute[pfacode:PCTSUBSIDY].pfadouble",
                "hidden" :  true
            },
            {
                "field": "listdealquote[].listdealquoteelement[].pfrtxnominal",
                "hidden" :  true
            },
            {
                "field": "listdealquote[].listdealquotecommission[tcocode:UKCOM].pcfmt",
                "disabled" :  true
            },
            {
                "field": "listdealquote[].listdealquotecommission[tcocode:UKCOM].pcftx",
                "disabled" :  true
            },
            {
                "field": "listdealquote[0].listdealquoteservice[tprcode:UKDOFI].pfpmtreverse",
                "disabled" :  true
            },
            {
                "field": "listdealquote[0].listdealquoteservice[tprcode:UKDOFI].pfptxreverse",
                "disabled" :  true
            },
            {
                "field": "listdealquote[0].listdealquoteservice[tprcode:UKOPFEE].pfpmtreverse",
                "disabled" :  true
            },
            {
                "field": "listdealquote[0].listdealquoteservice[tprcode:UKOPFEE].pfptxreverse",
                "disabled" :  true
            },
            {
                "component": "pos.quote.costanalysis.popup",
                "hidden" :  true
            },
             {
                 "component": "pos.quote.paymentprofile.popup",
                 "hidden" :  true
             }
      ]';
        end if ;
    ljson := ljson ||'}' ;
  
     ljson := ljson ||' ,{
      "key": "/actors",
      "visible": ' || showposactors || '
    }
	,{
      "key": "/users",
      "visible": ' || showposusers || '
    }
    ,{
      "key": "/timeline",
      "visible": ' || showtimeline || '
    }
    ,{
      "key": "/pos/documents",
      "visible": ' || showposdocuments || '
    }
    ,{
       "key": "/actor"
      ,"visible": true
    }
  ],';
  ljson := ljson || '
  "urlaccesskeys": [
    {
       "key": "/RestServices/userconfiguration"
      ,"all": true
      ,"comment": "without this key /userconfiguration cannot be reached!"
    }
     ,{
       "key": "/RestServices/deals"
      ,"all": true
      ,"comment": "this key controls everything related to deal, so /deals and all its sub urls, such as /deals/{id}"
    }
    ,{
       "key": "/RestServices/deals/*"
      ,"all": true
      ,"comment": "this key controls everything related to deal, so /deals and all its sub urls, such as /deals/{id}"
    }
    ,{
        "key": "/RestServices/actors"
       ,"all": true
       ,"comment": "this key controls everything related to deal, so /deal and all its sub urls, such as /deal/{id}"
    }
    ,{
        "key": "/RestServices/actors/*"
       ,"all": true
       ,"comment": "this key controls everything related to deal, so /deal and all its sub urls, such as /deal/{id}"
    }
     ,{
        "key": "/RestServices/assets"
       ,"all": true
       ,"comment": "this key controls everything related to deal, so /deal and all its sub urls, such as /deal/{id}"
    }
    ,{
        "key": "/RestServices/assets/*"
       ,"all": true
       ,"comment": "this key controls everything related to deal, so /deal and all its sub urls, such as /deal/{id}"
    }
     ,{
        "key": "/RestServices/referencetable"
       ,"all": true
       ,"comment": "this key controls everything related to deal, so /dealcomputepayment"
    }
    ,{
       "key": "/RestServices/variants"
      ,"all": true
      ,"comment": "this key controls everything related to deal, so /deals and all its sub urls, such as /deals/{id}"
    }
    ,{
       "key": "/RestServices/variants/*"
      ,"all": true
      ,"comment": "this key controls everything related to deal, so /deals and all its sub urls, such as /deals/{id}"
    }
     ,{
       "key": "/RestServices/documents"
      ,"all": true
      ,"comment": "this key controls everything related to timeline, so /deal and all its sub urls, but also /deals"
    }
    ,{
       "key": "/RestServices/documents/*"
      ,"all": true
      ,"comment": "this key controls everything related to timeline, so /deal and all its sub urls, but also /deals"
    }
    ,{
       "key": "/RestServices/deals/events"
      ,"all": true
      ,"comment": "TODO: make this obsolete by setting globaltimeline driven by timeline"
    }
    ,{
       "key": "/RestServices/timelines"
      ,"all": true
      ,"read": true
      ,"write": true
      ,"delete": true
      ,"comment": "setting \"read\", \"write\" and \"delete\" to true is equivalent to setting \"all\" to true BUT if \"all\" is false THEN /actors will fail, only /actor/{id} will succeed"
    }
    ,{
       "key": "/RestServices/timelines/*"
      ,"all": true
      ,"read": true
      ,"write": true
      ,"delete": true
      ,"comment": "setting \"read\", \"write\" and \"delete\" to true is equivalent to setting \"all\" to true BUT if \"all\" is false THEN /actors will fail, only /actor/{id} will succeed"
    }
    ,{
       "key": "/RestServices/deals/financial"
      ,"all": true
     ,"comment": "without this key /deals/financial cannot be reached!"

    }
    ,{
       "key": "/RestServices/tasks"
      ,"all": true
      ,"comment": "without this key /tasks cannot be reached!"

    }
    ,{
       "key": "/RestServices/tasks/*"
      ,"all": true
      ,"comment": "without this key /tasks cannot be reached!"

    }
    ,{
       "key": "/RestServices/charts"
      ,"all": true
      ,"comment": "without this key /charts cannot be reached!"

    }
    ,{
       "key": "/RestServices/charts/*"
      ,"all": true
      ,"comment": "without this key /charts cannot be reached!"

    }
    ,{
       "key": "/RestServices/poscontracts"
      ,"all": true
      ,"comment": "without this key /poscontracts cannot be reached!"

    }
    ,{
       "key": "/RestServices/poscontracts/*"
      ,"all": true
      ,"comment": "without this key /poscontracts cannot be reached!"

    }
    ,{
       "key": "/RestServices/dashboards"
      ,"all": true
      ,"comment": "without this key /dashboards cannot be reached!"

    }
    ,{
       "key": "/RestServices/dashboards/*"
      ,"all": true
      ,"comment": "without this key /dashboards cannot be reached!"

    }
    ,{
       "key": "/RestServices/userconfigurations"
      ,"all": true
      ,"comment": "without this key /userconfigurations cannot be reached!"
    },
     {
       "key": "/RestServices/userconfigurations/*"
      ,"all": true
      ,"comment": "without this key /userconfiguration cannot be reached!"
    }
    ,{
        "key": "/RestServices/users"
        ,"all": ' || showposusers || '
        ,"comment": "without this key /users cannot be reached!"
     } ,{
        "key": "/RestServices/masterfacilities"
        ,"all": true
        ,"comment": "without this key /masterfacilities cannot be reached!"
     }
     ,{
        "key": "/RestServices/masterfacilities/*"
        ,"all": true
        ,"comment": "without this key /masterfacilities cannot be reached!"
     }
     ,{
        "key": "/RestServices/draws"
        ,"all": true
        ,"comment": "without this key /draws cannot be reached!"
     }
     ,{
        "key": "/RestServices/documentmanagments"
        ,"all": true
        ,"comment": "without this key /documentmanagments/* cannot be reached!"
     }
       ,{
          "key": "/RestServices/documentmanagements/*"
          ,"all": true
          ,"comment": "without this key /documentmanagements/* cannot be reached!"
       }
   ,{
          "key": "/RestServices/staticquotes"
          ,"all": true
        }
  ]
}';

  RETURN ljson;
END GETCONFIGURATION;

END ;
/
