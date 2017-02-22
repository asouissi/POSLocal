CREATE OR REPLACE PACKAGE PAV4_GENERIC_POS_CONFIGURATION
AS
    TYPE T_CURSOR IS REF CURSOR;
	FUNCTION GETCONFIGURATION(suticode utilisateur.uticode%type) RETURN CLOB;

END ;
/


CREATE OR REPLACE PACKAGE BODY PAV4_GENERIC_POS_CONFIGURATION
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
  readonly number(1);
  locale varchar2(5);
  skin varchar2(128);
  skinoption varchar2(128);
  showskinselector varchar2(15);

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
  showposdocuments varchar(15) := 'false';

BEGIN

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

  -- skin
  Begin
    select coalesce(uprstringvalue, '') into skin from utipreference where uticode=suticode and uprcode='POSSKIN';
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

  -- acl
  if groupecode = 'FLMANAG' Then

    showposdeals := 'true';
    showposdraw := 'true';
    showposassets := 'true';

  elsif groupecode = 'DEALER' Or groupecode = 'BROKER' Or groupecode = 'BROKER1' Or groupecode = 'BROKER2' Or groupecode = 'BROKER3' Or groupecode = 'GRPORFI' Then

    showtimeline := 'true';
	showposdeals := 'true';
    showposdeal := 'true';
    showposquote := 'true';
    showposmasterfacility := 'true';
    showposactors := 'true';
    showposdrivers := 'true';
    showposdocuments := 'true';
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
  else
	  landingpage := '/dashboard/MAIN';
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
    "readonly": "' || readonly || '"'
    || skinoption || '
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
      ,"customFields": [' ||
/*
            {
                "name": "cvastringvalue"
                , "type": "string"
                , "label": "Name"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "type": "number"
                , "label": "price"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "type": "currency"
                , "label": "price"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvadtvalue"
                , "type": "date"
                , "label": "Years"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvadtvalue"
                , "type": "date"
                , "label": "Years"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvadtvalue"
                , "type": "date"
                , "label": "Years"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
,*/
'           {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD00"
                , "type": "number"
                , "label": "Years in farming"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD01"
                , "type": "string"
                , "label": "Years at bank"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD02"
                , "type": "string"
                , "label": "Years at address"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvadtvalue"
                , "cchvaluecode":"TFDCCHVALJD03"
                , "type": "date"
                , "label": "Year starting farming land"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD04"
                , "type": "string"
                , "label": "Cereal"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD05"
                , "type": "string"
                , "label": "Dairy"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD06"
                , "type": "string"
                , "label": "Employees"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD07"
                , "type": "string"
                , "label": "Oilseed"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD08"
                , "type": "string"
                , "label": "Dairy followers"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD09"
                , "type": "string"
                , "label": "Land grade"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD10"
                , "type": "string"
                , "label": "Sugar"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD11"
                , "type": "string"
                , "label": "Calves"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD12"
                , "type": "string"
                , "label": "Acres owned"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD13"
                , "type": "string"
                , "label": "Grass"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD14"
                , "type": "string"
                , "label": "Beef"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD15"
                , "type": "string"
                , "label": "Acres rented"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD16"
                , "type": "string"
                , "label": "Set aside"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD17"
                , "type": "string"
                , "label": "Sows"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD18"
                , "type": "string"
                , "label": "Acres shared"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD19"
                , "type": "string"
                , "label": "Vegetables"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD20"
                , "type": "string"
                , "label": "Breeding ewes"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD21"
                , "type": "string"
                , "label": "Total"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD22"
                , "type": "string"
                , "label": "Fruit"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
            , {
                "name": "cvanumericvalue"
                , "cchvaluecode":"TFDCCHVALJD23"
                , "type": "string"
                , "label": "Store lambs"
                , "hidden": false
                , "disabled": false
                , "mandatory": true
            }
        ]';
  end if;
		
  ljson := ljson || '
    }
  ],';
  ljson := ljson || '
  "urlaccesskeys": [
    {
       "key": "/RestServices/userconfigurations"
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
     ,"comment": "without this key /userconfiguration cannot be reached!"

    }
    ,{
       "key": "/RestServices/tasks"
      ,"all": true
      ,"comment": "without this key /userconfiguration cannot be reached!"

    }
    ,{
       "key": "/RestServices/tasks/*"
      ,"all": true
      ,"comment": "without this key /userconfiguration cannot be reached!"

    }
    ,{
       "key": "/RestServices/charts"
      ,"all": true
      ,"comment": "without this key /userconfiguration cannot be reached!"

    }
    ,{
       "key": "/RestServices/charts/*"
      ,"all": true
      ,"comment": "without this key /userconfiguration cannot be reached!"

    }
    ,{
       "key": "/RestServices/poscontracts"
      ,"all": true
      ,"comment": "without this key /userconfiguration cannot be reached!"

    }
    ,{
       "key": "/RestServices/poscontracts/*"
      ,"all": true
      ,"comment": "without this key /userconfiguration cannot be reached!"

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
       "key": "/RestServices/userconfigurations"
      ,"all": true
      ,"comment": "without this key /userconfigurations cannot be reached!"
    }
    ,{
        "key": "/RestServices/users"
        ,"all": true
        ,"comment": "without this key /users cannot be reached!"
     }
      ,{
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
  ]
}';

  RETURN ljson;
END GETCONFIGURATION;

END ;
/
