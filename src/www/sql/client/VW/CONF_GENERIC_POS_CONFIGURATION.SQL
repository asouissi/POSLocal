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
  defaultworkflow varchar2(15);

  landingpage varchar(256) := '';

  showtimeline varchar(15) := 'false';

  showposdeals varchar(15) := 'false';
  showposdeal varchar(15) := 'false';
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
  restrictedaccess number(1);
  showposdocuments varchar(15) := 'false';


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

    showskinselector := 'false';
    toplefttitle := 'Cassiopae'; 
    showtimeline := 'true';
	showposdeals := 'true';
    showposdeal := 'true';
    --showposquote := 'true';
    --showposmasterfacility := 'true';
    --showposactors := 'true';
    --showposdrivers := 'true';

    if groupecode = 'GRPORFI' Then
	    showposusers := 'true';
	end if;

	
    if brandcurrent = 'AUDI' Then
		skinoption := ',' || crlf || '"skin": "skin-white-100_102"';
		toplefttitleimage := 'img/logos/audi-logo.png'; 
		toplefttitleimagemin := 'img/logos/audi-logo-min.png'; 
	elsif brandcurrent = 'DUCATI' Then
		skinoption := ',' || crlf || '"skin": "skin-grey-101"';
		toplefttitleimage := 'img/logos/ducati-logo.png'; 
		toplefttitleimagemin := 'img/logos/ducati-logo-min.png'; 
	elsif brandcurrent = 'SEAT' Then
		skinoption := ',' || crlf || '"skin": "skin-white-100_102"';
		toplefttitleimage := 'img/logos/seat-logo.png'; 
		toplefttitleimagemin := 'img/logos/seat-logo-min.png'; 
	elsif brandcurrent = 'SKOD' Then
		skinoption := ',' || crlf || '"skin": "skin-green-103"';
		toplefttitleimage := 'img/logos/skoda-logo.png'; 
		toplefttitleimagemin := 'img/logos/skoda-logo-min.png'; 
	elsif brandcurrent = 'VU' Then
		skinoption := ',' || crlf || '"skin": "skin-white-104_105"';
		toplefttitleimage := 'img/logos/vwuti-logo.png'; 
		toplefttitleimagemin := 'img/logos/vwuti-logo-min.png'; 
	elsif brandcurrent = 'VOLK' Then
		skinoption := ',' || crlf || '"skin": "skin-white-104_105"';
		toplefttitleimage := 'img/logos/volkswagen-logo.png'; 
		toplefttitleimagemin := 'img/logos/volkswagen-logo-min.png'; 
	else
		skinoption := ',' || crlf || '"skin": "skin-blue-106"';
		toplefttitleimage := 'img/logos/volkswagen-logo.png'; 
		toplefttitleimagemin := 'img/logos/volkswagen-logo-min.png'; 
	end if;


	showposdocuments := 'true';
	landingpage := '/dashboard/MAIN';


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
    "readonly": "' || readonly || '",
	"defaultworkflow": "' || defaultworkflow || '",    
    "restrictedaccess": "' || restrictedaccess || '"'
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
    ,"topLeftBarCartoucheVisible": false
    ,"networkstepselection": ' || sberoption || '
  },
  "accesskeys": [
    {
      "key": "/timeline",
      "visible": ' || showtimeline || '
    }
    ,{
      "key": "/pos/deals",
      "visible": ' || showposdeals || '
    }
    ,{
      "key": "/pos/deal",
      "visible": ' || showposdeal || '
      ,"rules": [
                {
                      "field": "deal.listdealasset[].acacode",
                      "mandatory" :  true
                  },
                  {
                      "field": "deal.listdealasset[$1].makid",
                      "mandatory" :  "function (values, conf) { return values.deal.listdealasset[$1].acacode === \"CAR\"}"
                  },
                  {
                      "component": "pos.newdeal.step.customer",
                      "hidden" :  true
                  },
                  {
                      "component": "pos.newdeal.step.prospect",
                      "hidden" :  "function (values, conf) { return values.deal.dosid != null}",
                       "order" : 2
                  },
                  {
                      "component": "pos.newdeal.step.client",
                      "hidden" :  "function (values, conf) { return values.deal.dosid == null}",
                      "order" : 3
                  },
                  {
                      "component": "pos.summary.assetinfo.type",
                      "hidden" :  true
                  },
                  {
                      "component": "pos.summary.assetinfo.model",
                      "hidden" :  true
                  },
                  {
                      "component": "pos.summary.assetinfo.finish",
                      "hidden" :  true
                  },
                  {
                      "component": "pos.summary.assetinfo.options",
                      "hidden" :  true
                  },
                  {
                      "component": "pos.summary.assetinfo.options.co2",
                      "hidden" :  true
                  },
                  {
                      "component": "pos.summary.assetinfo.options.sum",
                      "hidden" :  true
                  },
                  {
                      "component": "pos.summary.offerinfo.stdrate",
                      "hidden" :  true
                  },
                  {
                      "component": "pos.summary.offerinfo.firstpay",
                      "hidden" :  true
                  },
                  {
                      "component": "pos.summary.offerinfo.commission",
                      "hidden" :  true
                  }
				  ,
				  {
					"component": "pos.summary.offerinfo.rv",
					"hidden" :  true
				 }
				 ,
				 {
					"component": "pos.summary.offerinfo.profitability",
					"hidden" :  true
				 },
				 {
					"component": "pos.summary.offerinfo.pfinom",
					"hidden" :  true
				},
				 {
            "component": "pos.summary.offerinfo.frequency",
            "hidden" :  true
				 },
         {
             "component": "pos.deal.financialquote.commission.table",
             "hidden" : true
         }
        ]
      }
    ,{
      "key": "/pos/quote",
      "visible": ' || showposquote || '
    }
    ,{
      "key": "/actors",
      "visible": ' || showposactors || '
    }
    ,{
      "key": "/pos/masterfacility",
      "visible": ' || showposmasterfacility || '
    }
    ,{
      "key": "/pos/draw",
      "visible": ' || showposdraw || '
    }
    ,{
      "key": "/pos/assets",
      "visible": ' || showposassets || '
    }
    ,{
      "key": "/pos/drivers",
      "visible": ' || showposdrivers || '
    }
	,{
      "key": "/users",
      "visible": ' || showposusers || '
    }
    ,{
      "key": "/wholesale/creditlines",
      "visible": ' || showwholesalecreditlines || '
    }
    ,{
      "key": "/wholesale/creditline",
      "visible": ' || showwholesalecreditline || '
    }
    ,{
      "key": "/wholesale/draw",
      "visible": ' || showwholesaledraw || '
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
       "key": "/RestServices/deals"
      ,"all": true
    }
    ,{
       "key": "/RestServices/deals/*"
      ,"all": true
    }
    ,{
        "key": "/RestServices/actors"
       ,"all": true
    }
    ,{
        "key": "/RestServices/actors/*"
       ,"all": true
    }
     ,{
        "key": "/RestServices/assets"
       ,"all": true
    }
    ,{
        "key": "/RestServices/assets/*"
       ,"all": true
    }
     ,{
        "key": "/RestServices/referencetable"
       ,"all": true
    }
    ,{
        "key": "/RestServices/referencetable/siteoption"
       ,"all": true
     }
    ,{
       "key": "/RestServices/variants"
      ,"all": true
    }
    ,{
       "key": "/RestServices/variants/*"
      ,"all": true
    }
     ,{
       "key": "/RestServices/documents"
      ,"all": true
    }
    ,{
       "key": "/RestServices/documents/*"
      ,"all": true
    }
    ,{
       "key": "/RestServices/deals/events"
      ,"all": true
    }
    ,{
       "key": "/RestServices/timelines"
      ,"all": true
      ,"read": true
      ,"write": true
      ,"delete": true
    }
    ,{
       "key": "/RestServices/timelines/*"
      ,"all": true
      ,"read": true
      ,"write": true
      ,"delete": true
    }
    ,{
       "key": "/RestServices/deals/financial"
      ,"all": true
    }
    ,{
       "key": "/RestServices/tasks"
      ,"all": true
    }
    ,{
       "key": "/RestServices/tasks/*"
      ,"all": true
    }
    ,{
       "key": "/RestServices/charts"
      ,"all": true
    }
    ,{
       "key": "/RestServices/charts/*"
      ,"all": true
    }
    ,{
       "key": "/RestServices/poscontracts"
      ,"all": true
    }
    ,{
       "key": "/RestServices/poscontracts/*"
      ,"all": true
    }
    ,{
       "key": "/RestServices/dashboards"
      ,"all": true
    }
    ,{
       "key": "/RestServices/dashboards/*"
      ,"all": true
    }
    ,{
       "key": "/RestServices/userconfigurations"
      ,"all": true
    },
     {
       "key": "/RestServices/userconfigurations/*"
      ,"all": true
    }
     
    ,{
        "key": "/RestServices/users"
        ,"all": ' || showposusers || '
     } ,{
        "key": "/RestServices/masterfacilities"
        ,"all": true
     }
     ,{
        "key": "/RestServices/masterfacilities/*"
        ,"all": true
     }
     ,{
        "key": "/RestServices/draws"
        ,"all": true
     }
     ,{
        "key": "/RestServices/draws/*"
        ,"all": true
     },{
        "key": "/RestServices/upload-pdf/*"
        ,"all": true
     }
     ,{
         "key": "/RestServices/documentmanagements"
         ,"all": true
      }
    ,{
       "key": "/RestServices/documentmanagements/*"
       ,"all": true
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
