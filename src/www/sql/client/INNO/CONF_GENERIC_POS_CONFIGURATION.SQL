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
  topLeftBarCartoucheVisible varchar2(15);
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
  showskinselector := 'true';
  topLeftBarCartoucheVisible := 'true';
  IF sRole = 'BRMAN' Then
    showposusers := 'true';
  END IF;


  toplefttitle := 'Cassiopae'; 

  if suticode = 'DEALERJD' Then
    if skin = 'skin-green' Then
		toplefttitleimage := 'img/logos/johndeere-logo.png'; 
		toplefttitleimagemin := 'img/logos/johndeere-logo-min.png'; 
	else
        toplefttitle := 'Cassiopae'; 
	end if;
  elsif suticode = 'DEALERMB' Then
	toplefttitleimage := 'img/logos/metrobank-logo.png'; 
	toplefttitleimagemin := 'img/logos/metrobank-logo-min.png'; 
  elsif suticode = 'DEALERVW' Then
	toplefttitleimage := 'img/logos/volkswagen-logo.png'; 
	toplefttitleimagemin := 'img/logos/volkswagen-logo-min.png'; 
  elsif suticode = 'DEALER1' Then
	if skin = 'skin-black' Then
		toplefttitleimage := 'img/logos/mercedes-logo.png';
		toplefttitleimagemin := 'img/logos/mercedes-logo-min.png';
    elsif skin = 'skin-black-light' Then
		toplefttitleimage := 'img/logos/bmw-logo.png';
		toplefttitleimagemin := 'img/logos/bmw-logo-min.png'; 
    elsif skin = 'skin-green' Then
		toplefttitleimage := 'img/logos/johndeere-logo.png';
		toplefttitleimagemin := 'img/logos/johndeere-logo-min.png';
    elsif skin = 'skin-blue-light' Then
		topLeftBarCartoucheVisible := 'false';
	end if;
  end if;  

  -- acl
  if groupecode = 'FLMANAG' Then

    showposdeals := 'true';
    showposdraw := 'true';
    showposassets := 'true';

  elsif groupecode = 'DEALER' Or groupecode = 'BROKER' Or groupecode = 'BROKER1' Or groupecode = 'BROKER2' Or groupecode = 'BROKER3' Or groupecode = 'GRPORFI'  Then

    showtimeline := 'true';
	showposdeals := 'true';
    showposdeal := 'true';
    showposquote := 'true';
    showposmasterfacility := 'true';
    showposactors := 'true';
    showposdrivers := 'true';
    showposdocuments := 'true';
  --elsif groupecode = 'GUEST' Then
    --no rights provided

  elsif groupecode = 'PORTAL' Then
    showposdeal := 'true';
    showposquote := 'true';
    restrictedaccess := 1;

  --elsif groupecode = 'MANAGER' Then
    -- no menu

  elsif groupecode = 'WSL' Then

    showtimeline := 'true';
    --showposdeals := 'true';
    showwholesalecreditlines := 'true';
    showwholesalecreditline := 'true';
    showwholesaledraw := 'true';
	toplefttitle := 'Santander'; -- hidden if the toplefttitle is set

  end if;

  if groupecode = 'WSL' Then
	  landingpage := '/wholesale/creditlines';
  elsif groupecode = 'PORTAL' Then
  	  landingpage := '/pos/deal';
  else
	  landingpage := '/dashboard/CMS';
  end if;


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
    ,"topLeftBarCartoucheVisible": ' || topLeftBarCartoucheVisible || '
    ,"showskinselector": ' || showskinselector || '  
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
      ,"visible": true';

  if suticode = 'DEALERJD' Then
	ljson := ljson || '
      ,"rules": [
          {
            "field": "actnom",
            "hidden" : "function (values) { return values.acttype === \"COMP\" }"
          }
         ,{
            "field": "actnom2",
            "mandatory" : true
          }
      ]
      ,"customFields": [
          {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD00].cvanumericvalue"
                , "type": "number"
                , "label": "Years in farming"
                , "hidden": "function (values) { return values.actnom ===\"admin\" }"
                , "disabled": false
                , "mandatory": true
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD01].cvanumericvalue"
                , "type": "string"
                , "label": "Years at bank"
                , "hidden": false
                , "disabled": "function (values) { return values.actnom2 === \"test\" }"
                , "mandatory": true
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD02].cvanumericvalue"
                , "type": "string"
                , "label": "Years at address"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD03].cvadtvalue"
                , "type": "date"
                , "label": "Year starting farming land"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD04].cvanumericvalue"
                , "type": "string"
                , "label": "Cereal"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD05].cvanumericvalue"
                , "type": "string"
                , "label": "Dairy"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD06].cvanumericvalue"
                , "type": "string"
                , "label": "Employees"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD07].cvanumericvalue"
                , "type": "string"
                , "label": "Oilseed"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD08].cvanumericvalue"
                , "type": "string"
                , "label": "Dairy followers"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD09].cvanumericvalue"
                , "type": "string"
                , "label": "Land grade"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD10].cvanumericvalue"
                , "type": "string"
                , "label": "Sugar"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD11].cvanumericvalue"
                , "type": "string"
                , "label": "Calves"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD12].cvanumericvalue"
                , "type": "string"
                , "label": "Acres owned"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD13].cvanumericvalue"
                , "type": "string"
                , "label": "Grass"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD14].cvanumericvalue"
                , "type": "string"
                , "label": "Beef"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD15].cvanumericvalue"
                , "type": "string"
                , "label": "Acres rented"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD16].cvanumericvalue"
                , "type": "string"
                , "label": "Set aside"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD17].cvanumericvalue"
                , "type": "string"
                , "label": "Sows"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD18].cvanumericvalue"
                , "type": "string"
                , "label": "Acres shared"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD19].cvanumericvalue"
                , "type": "string"
                , "label": "Vegetables"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD20].cvanumericvalue"
                , "type": "string"
                , "label": "Breeding ewes"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD21].cvanumericvalue"
                , "type": "string"
                , "label": "Total"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD22].cvanumericvalue"
                , "type": "string"
                , "label": "Fruit"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
            , {
                "field": "listcustomcharacteristic[cchvaluecode:TFDCCHVALJD23].cvanumericvalue"
                , "type": "string"
                , "label": "Store lambs"
                , "hidden": false
                , "disabled": false
                , "mandatory": false
            }
        ]';
  end if;
		
  ljson := ljson || '
    }
  ],';
if groupecode = 'PORTAL' Then
    ljson := ljson || '
    "urlaccesskeys": [
      {
             "key": "/RestServices/charts/*"
            ,"all": true
            ,"comment": "without this key /charts cannot be reached!"
      }
      ,{
         "key": "/RestServices/dashboards"
        ,"all": true
        ,"comment": "without this key /userconfiguration cannot be reached!"

      }
      ,{
         "key": "/RestServices/dashboards/*"
        ,"all": true
        ,"comment": "without this key /userconfiguration cannot be reached!"

      }
      ,{
         "key": "/RestServices/deals/financial"
        ,"all": true
       ,"comment": "without this key /userconfiguration cannot be reached!"

      }
      ,{
          "key": "/RestServices/referencetable"
         ,"all": true
         ,"comment": "this key controls everything related to deal, so /dealcomputepayment"
      }
      ,{
         "key": "/RestServices/userconfigurations"
         ,"all": true
         ,"comment": "without this key /userconfigurations cannot be reached!"
      }
      ,{
         "key": "/RestServices/actors"
         ,"all": true
         ,"comment": "this key controls everything related to deal, so /deal and all its sub urls, such as /deal/{id}"
       }
       ,{
          "key": "/RestServices/deals"
          ,"all": true
          ,"comment": "this key controls /deals"
       },{
          "key": "/RestServices/portal/*"
          ,"all": true
          ,"comment": "this key controls /portal"
       }
       ,{
          "key": "/RestServices/deals/*"
          ,"all": true
          ,"comment": "this key controls everything related to deal, so /deals and all its sub urls, such as /deals/{id}"
       }
  ]
}';
  elsif groupecode = 'GUEST' Then
    ljson := ljson || '
    "urlaccesskeys": [
      {
         "key": "/RestServices/userconfigurations"
         ,"all": true
         ,"comment": "without this key /userconfiguration cannot be reached!"
      },{
          "key": "/RestServices/portal/*"
          ,"all": true
          ,"comment": "this key controls /portal"
       }
      ,{
         "key": "/RestServices/users/validateusername"
        ,"all": true
        ,"comment": "this key helps to validate username for GUEST user"
      },{
          "key": "/RestServices/referencetable"
         ,"all": true
         ,"comment": "this key controls everything related to referencetable"
      }
      ,{
         "key": "/RestServices/users/createuser/"
         ,"all": true
         ,"comment": "this key helps to register a new user"
       }
      ,{
         "key": "/RestServices/actors"
         ,"all": true
         ,"comment": "this key helps to register a new actor/user"
       }
      ,{
         "key": "/RestServices/staticquotes"
         ,"all": true
         ,"comment": "this key helps to register a new actor/user"
       }

  ]
}';

  else
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
        "key": "/RestServices/referencetable/siteoption"
       ,"all": true
       ,"comment": "controls customer specific site-options"
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
        "key": "/RestServices/draws/*"
        ,"all": true
        ,"comment": "without this key /draws/* cannot be reached!"
     },{
        "key": "/RestServices/upload-pdf/*"
        ,"all": true
        ,"comment": "upload and split pdf"
     }
     ,{
         "key": "/RestServices/documentmanagements"
         ,"all": true
         ,"comment": "without this key /documentmanagements/* cannot be reached!"
      }
    ,{
       "key": "/RestServices/documentmanagements/*"
       ,"all": true
       ,"comment": "without this key /documentmanagements/* cannot be reached!"
    }
    ,{
           "key": "/RestServices/staticquotes"
           ,"all": true
     },{
          "key": "/RestServices/token/*"
          ,"all": true
          ,"comment": "this key controls /token"
       },{
          "key": "/RestServices/portal/*"
          ,"all": true
          ,"comment": "this key controls /portal"
       }
  ]
}';
end if;

  RETURN ljson;
END GETCONFIGURATION;

END ;
/
