set define off

insert into assetcategory  (acacode) values ('PRINT');  
insert into lanassetcategory values  ('PRINT','EN','Printer');  
insert into filtreparamprofil SELECT TPGCODE ,0,'NATUREMATERIEL','PRINT',0 FROM TPROFILGESTION;  
insert into  nap (napcode,paycode) values ('BLACK','US');  
insert into lannap (NAPCODE,PAYCODE,LANCODE,NAPLIBELLE) values ('BLACK','US','EN','Black & White Laser Printers');  
insert into filtreparamprofil select tpgcode ,0,'NAP','BLACK',0 FROM TPROFILGESTION;
insert into relationvaleurprofil SELECT 'NATMATNAP',TPGCODE ,'PRINT','BLACK',0 FROM TPROFILGESTION;
insert into  nap (napcode,paycode) values ('COLOR','US');
insert into lannap   (NAPCODE,PAYCODE,LANCODE,NAPLIBELLE)values ('COLOR','US','EN','Color Laser / LED Printers ');  
insert into filtreparamprofil select tpgcode ,0,'NAP','COLOR',0 from tprofilgestion  ;
insert into relationvaleurprofil select 'NATMATNAP',tpgcode,'PRINT','COLOR',0 from tprofilgestion ;

INSERT INTO make(makid,makcode,paycode,devcode) select SEQ_makid.NEXTVAL,  'BROTHER',  'US', 'USD' FROM dual WHERE not exists(select 1 from make WHERE makcode='Brother' and paycode='US')  ;	
INSERT INTO lanmake select  (select makid from make where makcode='BROTHER'  AND paycode='US'),  'EN',  'BROTHER'  FROM dual WHERE not exists(select 1 from lanmake WHERE makid=(select makid from make where makcode='BROTHER'  and paycode='US') and lancode='EN')  ;
insert into filtreparamprofil select TPGCODE,0,'CGMARQUE',(select makid from make where makcode='BROTHER' and paycode='US' ),0 FROM TPROFILGESTION ;
insert into makmodel (makid, mmocode) select  (select makid from make where makcode= 'BROTHER' and paycode='US' ), 'HL3140CW' FROM dual WHERE not exists(select 1 from makmodel WHERE  mmocode='HL3140CW' and makid =(select makid from make where makcode='BROTHER' and paycode='US'))   ;  
insert into lanmakmodel  select (select  makid from make where makcode= 'BROTHER' and paycode='US'),'HL3140CW','EN', 'HL-3140CW' FROM dual WHERE not exists (select 1 from lanmakmodel WHERE  mmocode='HL3140CW' and makid =(select makid from make where makcode='BROTHER' and paycode='US'))  ; 
insert into acammo  select 'PRINT', (select  makid from make where makcode= 'BROTHER' and paycode='US'),'HL3140CW', '' FROM dual WHERE not exists (select 1 from acammo WHERE  mmocode='HL3140CW' and makid =(select makid from make where makcode='BROTHER' and paycode='US'))  ; 
insert into MAKMODTPG (makid,mmocode,tpgcode) select  (select  makid from make where makcode= 'BROTHER' and paycode='US'),'HL3140CW', tpgcode FROM tprofilgestion; 
insert into makmodel (makid, mmocode) select  (select makid from make where makcode= 'BROTHER' and paycode='US' ), 'HL5450DN' FROM dual WHERE not exists(select 1 from makmodel WHERE  mmocode='HL5450DN' and makid =(select makid from make where makcode='BROTHER' and paycode='US'))   ; 
insert into lanmakmodel  select (select  makid from make where makcode= 'BROTHER' and paycode='US'),'HL5450DN','EN', 'HL-5450DN' FROM dual WHERE not exists (select 1 from lanmakmodel WHERE  mmocode='HL5450DN' and makid =(select makid from make where makcode='BROTHER' and paycode='US'))  ;  
insert into acammo  select 'PRINT', (select  makid from make where makcode= 'BROTHER' and paycode='US'),'HL5450DN', '' FROM dual WHERE not exists (select 1 from acammo WHERE  mmocode='HL5450DN' and makid =(select makid from make where makcode='BROTHER' and paycode='US'))  ; 
insert into MAKMODTPG (makid,mmocode,tpgcode) select  (select  makid from make where makcode= 'BROTHER' and paycode='US'),'HL5450DN', tpgcode FROM tprofilgestion  ;  
insert into MMONAP   (makid,mmocode , paycode,napcode)  select (select  makid from make where makcode= 'BROTHER' and paycode='US'),'HL3140CW', 'US','COLOR' FROM dual WHERE not exists (select 1 from MMONAP      WHERE  mmocode='HL3140CW' and makid =(select makid from make where makcode='BROTHER' and paycode='US'))  ;
insert into MMONAP   (makid,mmocode , paycode,napcode)  select (select  makid from make where makcode= 'BROTHER' and paycode='US'),'HL5450DN', 'US','BLACK' FROM dual WHERE not exists (select 1 from MMONAP      WHERE  mmocode='HL5450DN' and makid =(select makid from make where makcode='BROTHER' and paycode='US'))  ;
insert into variant (varid,paycode,varcode,devcode,vardtstart,makid,mmocode,VARVEHICLECATEGORY,VARENERGYTYPE,VARBODYTYPE,VARBHP,VARCOMMENT,VARCARBON,ACACODE,napcode,VAREXTERNALREF) select seq_varid.nextval,'US','HL3140','USD', to_date('21-09-2015 10:48:54', 'dd-mm-yyyy hh24:mi:ss'), (select  makid from make where makcode= 'BROTHER' and paycode='US'),'HL3140CW' ,'','','','','Digital Color Printer with Wireless Networking','','PRINT','',''  FROM dual WHERE not exists (select 1 from VARIANT  WHERE  makid = (select  makid from make where makcode= 'BROTHER' and paycode='US')  and mmocode='HL3140CW' and paycode='US'   and varcomment='Digital Color Printer with Wireless Networking'  );
insert into variant (varid,paycode,varcode,devcode,vardtstart,makid,mmocode,VARVEHICLECATEGORY,VARENERGYTYPE,VARBODYTYPE,VARBHP,VARCOMMENT,VARCARBON,ACACODE,napcode,VAREXTERNALREF) select seq_varid.nextval,'US','HLDN','USD', to_date('21-09-2015 10:48:54', 'dd-mm-yyyy hh24:mi:ss'), (select  makid from make where makcode= 'BROTHER' and paycode='US'),'HL5450DN' ,'','','','','High-Speed Laser Printer with Networking and Duplex','','PRINT','BLACK',''  FROM dual WHERE not exists (select 1 from VARIANT  WHERE  makid = (select  makid from make where makcode= 'BROTHER' and paycode='US')  and mmocode='HL5450DN' and paycode='US'   and varcomment='High-Speed Laser Printer with Networking and Duplex'  );
insert into lanvariant (varid,lancode,varlibelle) select (select varid from variant where makid=(select  makid from make where makcode= 'BROTHER' and paycode='US') and mmocode='HL3140CW' and paycode='US' and varcomment ='Digital Color Printer with Wireless Networking'),'EN','Brother HL3140' from dual where not exists (select 1 from lanVARIANT  WHERE  varid=(select varid from variant where makid =(select  makid from make where makcode= 'BROTHER' and paycode='US') and mmocode='HL3140CW'  and paycode='US' and varcomment ='Digital Color Printer with Wireless Networking')   and lancode='EN'   and varlibelle='Brother HL3140');
insert into lanvariant (varid,lancode,varlibelle) select (select varid from variant where makid=(select  makid from make where makcode= 'BROTHER' and paycode='US') and mmocode='HL5450DN' and paycode='US' and varcomment ='High-Speed Laser Printer with Networking and Duplex'),'EN','Brother HL5450DN' from dual where not exists (select 1 from lanVARIANT  WHERE  varid=(select varid from variant where makid =(select  makid from make where makcode= 'BROTHER' and paycode='US') and mmocode='HL5450DN'  and paycode='US' and varcomment ='High-Speed Laser Printer with Networking and Duplex')   and lancode='EN'   and varlibelle='Brother HL5450DN');
insert into VARYEAR  (varid,VYEYEARCODE,VYEDTSTART)  select (select varid from variant where makid=(select  makid from make where makcode= 'BROTHER' and paycode='US') and mmocode='HL3140CW'  and paycode='US' and varcomment ='Digital Color Printer with Wireless Networking'),'1' ,to_date('21-09-2015 10:48:54', 'dd-mm-yyyy hh24:mi:ss')  from dual where not exists (select 1 from VARYEAR   WHERE  varid= (select varid from variant where  makid in (select  makid from make where makcode= 'BROTHER')  and mmocode= 'HL3140CW'  and paycode='US' and varcomment ='Digital Color Printer with Wireless Networking')   AND VYEYEARCODE= '1' );
insert into VARYEAR  (varid,VYEYEARCODE,VYEDTSTART)  select (select varid from variant where makid=(select  makid from make where makcode= 'BROTHER' and paycode='US') and mmocode='HL5450DN'  and paycode='US' and varcomment ='High-Speed Laser Printer with Networking and Duplex'),'1' ,to_date('21-09-2015 10:48:54', 'dd-mm-yyyy hh24:mi:ss')  from dual where not exists (select 1 from VARYEAR   WHERE  varid= (select varid from variant where  makid in (select  makid from make where makcode= 'BROTHER')  and mmocode= 'HL5450DN'  and paycode='US' and varcomment ='High-Speed Laser Printer with Networking and Duplex')   AND VYEYEARCODE= '1' );

insert into VYEPRICE (varid,VYEYEARCODE,VPRORDER ,VPRDTSTART,devcode,VPRMT,VPRMTVAT)  select (select varid from variant where makid=(select  makid from make where makcode= 'BROTHER' and paycode='US') and mmocode='HL3140CW'  and paycode='US' and varcomment ='Digital Color Printer with Wireless Networking'),'1' ,'1' ,to_date('21-09-2015 10:48:54', 'dd-mm-yyyy hh24:mi:ss') ,'USD' ,199.99 ,null  from dual where not exists (select 1 from VYEPRICE  WHERE  varid= (select varid from variant where  makid in (select  makid from make where makcode= 'BROTHER')  and mmocode= 'HL3140CW'  and paycode='US' and varcomment ='Digital Color Printer with Wireless Networking')   and  vprorder='1' );
insert into VYEPRICE (varid,VYEYEARCODE,VPRORDER ,VPRDTSTART,devcode,VPRMT,VPRMTVAT)  select 
(select varid from variant where makid=(select  makid from make where makcode= 'BROTHER' and paycode='US') and mmocode='HL5450DN' 
and paycode='US' and varcomment ='High-Speed Laser Printer with Networking and Duplex'),'1' ,'1'
,to_date('21-09-2015 10:48:54', 'dd-mm-yyyy hh24:mi:ss') ,'USD' ,199.99 ,null  from dual where not exists (select 1 from VYEPRICE  WHERE  varid= (select varid from variant where  makid in (select  makid from make where makcode= 'BROTHER')  and mmocode= 'HL5450DN'  and paycode='US' and varcomment ='High-Speed Laser Printer with Networking and Duplex')   and  vprorder='1' );

insert into MAKMODTRIMLEVEL (MAKID,MMOCODE,MMTCODE)  select (select MAKID  from make where makcode= 'BROTHER' and paycode='US'),'HL3140CW' ,'1' 
  from dual where not exists (select 1 from MAKMODTRIMLEVEL  WHERE  MAKID= (select  makid from make where makcode= 'BROTHER' and paycode='US')    and  MMOCODE='HL3140CW' );

insert into LANMAKMODTRIMLEVEL (MAKID,MMOCODE,MMTCODE,LANCODE,MMTLIBELLE)  select (select MAKID  from make where makcode= 'BROTHER' and paycode='US'),'HL3140CW' ,'1' ,'EN','Digital Color LED Technology'
  from dual where not exists (select 1 from LANMAKMODTRIMLEVEL  WHERE  MAKID= (select  makid from make where makcode= 'BROTHER' and paycode='US')    and  MMOCODE='HL3140CW'  AND LANCODE='EN' AND MMTCODE='1');


insert into MAKMODTRIMLEVEL (MAKID,MMOCODE,MMTCODE)  select (select MAKID  from make where makcode= 'BROTHER' and paycode='US'),'HL5450DN' , '1' 
  from dual where not exists (select 1 from MAKMODTRIMLEVEL  WHERE  MAKID= (select  makid from make where makcode= 'BROTHER' and paycode='US')    and  MMOCODE='HL5450DN' );

insert into LANMAKMODTRIMLEVEL (MAKID,MMOCODE,MMTCODE,LANCODE,MMTLIBELLE)  select (select MAKID  from make where makcode= 'BROTHER' and paycode='US'),'HL5450DN' , '1' ,'EN','B/W Laser Technology'
  from dual where not exists (select 1 from LANMAKMODTRIMLEVEL  WHERE  MAKID= (select  makid from make where makcode= 'BROTHER' and paycode='US')    and  MMOCODE='HL5450DN'  AND LANCODE='EN' AND MMTCODE='1');

  
  
insert into makmodel (makid, mmocode) select  (select makid from make where makcode LIKE  '%BROT%' AND devcode='USD' ), 'GT381' FROM dual WHERE not exists(select 1 from makmodel WHERE  mmocode='GT381' and makid =(select makid from make where makcode='BROTHER' and devcode='USD'))   ;  
insert into lanmakmodel  select (select  makid from make where makcode= 'BROTHER' and devcode='USD'),'GT381','EN', 'GT-381' FROM dual WHERE not exists (select 1 from lanmakmodel WHERE  mmocode='GT381' and makid =(select makid from make where makcode='BROTHER' and devcode='USD'))  ; 
insert into acammo  select 'PRINT', (select  makid from make where makcode= 'BROTHER' and devcode='USD'),'GT381', '' FROM dual WHERE not exists (select 1 from acammo WHERE  mmocode='GT381' and makid =(select makid from make where makcode='BROTHER' and devcode='USD'))  ; 
insert into MAKMODTPG (makid,mmocode,tpgcode) select  (select  makid from make where makcode= 'BROTHER' and devcode='USD'),'GT381', tpgcode FROM tprofilgestion; 
insert into MMONAP   (makid,mmocode , paycode,napcode)  select (select  makid from make where makcode= 'BROTHER' and devcode='USD'),'GT381', 'US','BLACK' FROM dual WHERE not exists (select 1 from MMONAP      WHERE  mmocode='GT381' and makid =(select makid from make where makcode='BROTHER' and devcode='USD'))  ;

insert into variant (varid,paycode,varcode,devcode,vardtstart,makid,mmocode,VARVEHICLECATEGORY,VARENERGYTYPE,VARBODYTYPE,VARBHP,VARCOMMENT,VARCARBON,ACACODE,napcode,VAREXTERNALREF)
 select seq_varid.nextval,'','GT381','EUR', to_date('21-09-2015 10:48:54', 'dd-mm-yyyy hh24:mi:ss'), (select  makid from make where makcode= 'BROTHER' and devcode='USD'),'GT381' ,'','','','','GT-3 Series Garment Printer with CMYK and 4 White Print Heads','','','','' 
  FROM dual WHERE not exists (select 1 from VARIANT  WHERE  makid = (select  makid from make where makcode= 'BROTHER' and devcode='USD')  and mmocode='GT381' and devcode='EUR'   and varcomment='GT-3 Series Garment Printer with CMYK and 4 White Print Heads'  );

insert into lanvariant (varid,lancode,varlibelle) select 
(select varid from variant where makid=(select  makid from make where makcode= 'BROTHER' and devcode='USD') and mmocode='GT381' and devcode='EUR' and varcomment ='GT-3 Series Garment Printer with CMYK and 4 White Print Heads'),'EN','GT-381'
 from dual where not exists (select 1 from lanVARIANT  WHERE  varid=(select varid from variant where makid =(select  makid from make where makcode= 'BROTHER' and devcode='USD') and mmocode='GT381'  and devcode='EUR' and varcomment ='GT-3 Series Garment Printer with CMYK and 4 White Print Heads')   and lancode='EN'   and varlibelle='GT-381');
insert into VARYEAR  (varid,VYEYEARCODE,VYEDTSTART)  select (select varid from variant where makid=(select  makid from make where makcode= 'BROTHER' and devcode='USD') and mmocode='GT381'   and varcomment ='GT-3 Series Garment Printer with CMYK and 4 White Print Heads'),'1' ,to_date('21-09-2015 10:48:54', 'dd-mm-yyyy hh24:mi:ss')  from dual where not exists (select 1 from VARYEAR   WHERE  varid= (select varid from variant where  makid in (select  makid from make where makcode= 'BROTHER')  and mmocode= 'GT381'  and devcode='USD' and varcomment ='GT-3 Series Garment Printer with CMYK and 4 White Print Heads')   AND VYEYEARCODE= '1' );

insert into VYEPRICE (varid,VYEYEARCODE,VPRORDER ,VPRDTSTART,devcode,VPRMT,VPRMTVAT)  select 
(select varid from variant where makid=(select  makid from make where makcode= 'BROTHER' and devcode='USD') and mmocode='GT381' 
and devcode='EUR' ),'1' ,'1'
,to_date('21-09-2015 10:48:54', 'dd-mm-yyyy hh24:mi:ss') ,'USD' ,25000 ,null  from dual where not exists (select 1 from VYEPRICE  WHERE  varid= (select varid from variant where  makid in (select  makid from make where makcode= 'BROTHER')  and mmocode= 'GT381'  and devcode='EUR' and varcomment ='GT-3 Series Garment Printer with CMYK and 4 White Print Heads')   and  vprorder='1' );

insert into MAKMODTRIMLEVEL (MAKID,MMOCODE,MMTCODE)  select (select MAKID  from make where makcode= 'BROTHER' and devcode='USD'),'GT381' ,'1' 
  from dual where not exists (select 1 from MAKMODTRIMLEVEL  WHERE  MAKID= (select  makid from make where makcode= 'BROTHER' and devcode='USD')    and  MMOCODE='GT381' );
SELECT * FROM LANVARIANT  WHERE VARID=3421 FOR UPDATE
VARCODE LIKE 'GT%'


insert into LANMAKMODTRIMLEVEL (MAKID,MMOCODE,MMTCODE,LANCODE,MMTLIBELLE)  select (select MAKID  from make where makcode= 'BROTHER' and devcode='USD'),'GT381' ,'1' ,'EN','Direct Inkjet Garment Printer'
  from dual where not exists (select 1 from LANMAKMODTRIMLEVEL  WHERE  MAKID= (select  makid from make where makcode= 'BROTHER' and devcode='USD')    and  MMOCODE='GT381'  AND LANCODE='EN' AND MMTCODE='1');