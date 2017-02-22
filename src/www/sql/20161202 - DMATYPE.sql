-------------------------------
----- TABLE AVPARAMETRE -------
-------------------------------
INSERT INTO AVPARAMETRE (PARTYPE, PARCODE, PARFLAGGLOBAL, PARFLAGANDRO, PARFLAGFILTRABLE, PARINHERITANCE, PARFLAGPRICING) VALUES ('2', 'DMATYPE', '0', '0', '1', 'FILTER', '0')

-------------------------------
----- TABLE TUSPARAM ----------
-------------------------------
INSERT INTO TUSPARAM (TUSNOM, TUPCODE, TUPFLAGORFI) VALUES ('DMATYPE', 'BALSHEET', '1');
INSERT INTO TUSPARAM (TUSNOM, TUPCODE, TUPFLAGORFI) VALUES ('DMATYPE', 'BANKGUAR', '1');
INSERT INTO TUSPARAM (TUSNOM, TUPCODE, TUPFLAGORFI) VALUES ('DMATYPE', 'GUARDOC', '1');
INSERT INTO TUSPARAM (TUSNOM, TUPCODE, TUPFLAGORFI) VALUES ('DMATYPE', 'KBISEXT', '1');
INSERT INTO TUSPARAM (TUSNOM, TUPCODE, TUPFLAGORFI) VALUES ('DMATYPE', 'MANAGERID', '1');
INSERT INTO TUSPARAM (TUSNOM, TUPCODE, TUPFLAGORFI) VALUES ('DMATYPE', 'OTHERDOC', '1');
INSERT INTO TUSPARAM (TUSNOM, TUPCODE, TUPFLAGORFI) VALUES ('DMATYPE', 'PLACCOUNT', '1');

-------------------------------
--- TABLE FILTREPARAMPROFIL ---
-------------------------------
INSERT INTO FILTREPARAMPROFIL (TPGCODE, FPPTYPE, FPPNOM, FPPCODE) VALUES ('FL', '2', 'DMATYPE', 'BALSHEET');
INSERT INTO FILTREPARAMPROFIL (TPGCODE, FPPTYPE, FPPNOM, FPPCODE) VALUES ('FL', '2', 'DMATYPE', 'BANKGUAR');
INSERT INTO FILTREPARAMPROFIL (TPGCODE, FPPTYPE, FPPNOM, FPPCODE) VALUES ('FL', '2', 'DMATYPE', 'GUARDOC');
INSERT INTO FILTREPARAMPROFIL (TPGCODE, FPPTYPE, FPPNOM, FPPCODE) VALUES ('FL', '2', 'DMATYPE', 'KBISEXT');
INSERT INTO FILTREPARAMPROFIL (TPGCODE, FPPTYPE, FPPNOM, FPPCODE) VALUES ('FL', '2', 'DMATYPE', 'MANAGERID');
INSERT INTO FILTREPARAMPROFIL (TPGCODE, FPPTYPE, FPPNOM, FPPCODE) VALUES ('FL', '2', 'DMATYPE', 'OTHERDOC');
INSERT INTO FILTREPARAMPROFIL (TPGCODE, FPPTYPE, FPPNOM, FPPCODE) VALUES ('FL', '2', 'DMATYPE', 'PLACCOUNT');

-------------------------------
------ TABLE LANTUSPARAM ------
-------------------------------
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'KBISEXT',  'EN', 'Kbis extract');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'BALSHEET', 'EN', 'Balance Sheet');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'BANKGUAR', 'EN', 'Bank guarantee');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'GUARDOC',  'EN', 'Guarantee document');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'MANAGERID','EN', 'Manager Personal ID');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'OTHERDOC', 'EN', 'Other documents');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'PLACCOUNT','EN', 'PL accounts');

INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'KBISEXT',  'FR', 'Kbis extract');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'BALSHEET', 'FR', 'Balance Sheet');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'BANKGUAR', 'FR', 'Bank guarantee');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'GUARDOC',  'FR', 'Guarantee document');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'MANAGERID','FR', 'Manager Personal ID');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'OTHERDOC', 'FR', 'Other documents');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'PLACCOUNT','FR', 'PL accounts');

INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'KBISEXT',  'ES', 'Kbis extract');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'BALSHEET', 'ES', 'Balance Sheet');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'BANKGUAR', 'ES', 'Bank guarantee');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'GUARDOC',  'ES', 'Guarantee document');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'MANAGERID','ES', 'Manager Personal ID');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'OTHERDOC', 'ES', 'Other documents');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMATYPE', 'PLACCOUNT','ES', 'PL accounts');


-------------------------------
------ TABLE LKTUPTACTPG ------
------ No longer used ---------
-------------------------------
INSERT INTO LKTUPTACTPG (TUPCODE, TACCODE, TPGCODE, TUSNOM, TUGFLAGDEFAUT, TUGORDRE) VALUES ('DOCTYPE01', 'CBM', 'FL', 'DMATYPE', '0', '0');
INSERT INTO LKTUPTACTPG (TUPCODE, TACCODE, TPGCODE, TUSNOM, TUGFLAGDEFAUT, TUGORDRE) VALUES ('DOCTYPE02', 'CBM', 'FL', 'DMATYPE', '0', '0');
INSERT INTO LKTUPTACTPG (TUPCODE, TACCODE, TPGCODE, TUSNOM, TUGFLAGDEFAUT, TUGORDRE) VALUES ('DOCTYPE03', 'CBM', 'FL', 'DMATYPE', '0', '0');
INSERT INTO LKTUPTACTPG (TUPCODE, TACCODE, TPGCODE, TUSNOM, TUGFLAGDEFAUT, TUGORDRE) VALUES ('DOCTYPE04', 'CBM', 'FL', 'DMATYPE', '0', '0');
INSERT INTO LKTUPTACTPG (TUPCODE, TACCODE, TPGCODE, TUSNOM, TUGFLAGDEFAUT, TUGORDRE) VALUES ('DOCTYPE05', 'CBM', 'FL', 'DMATYPE', '0', '0');
INSERT INTO LKTUPTACTPG (TUPCODE, TACCODE, TPGCODE, TUSNOM, TUGFLAGDEFAUT, TUGORDRE) VALUES ('DOCTYPE06', 'CBM', 'FL', 'DMATYPE', '0', '0');
INSERT INTO LKTUPTACTPG (TUPCODE, TACCODE, TPGCODE, TUSNOM, TUGFLAGDEFAUT, TUGORDRE) VALUES ('DOCTYPE07', 'CBM', 'FL', 'DMATYPE', '0', '0');
INSERT INTO LKTUPTACTPG (TUPCODE, TACCODE, TPGCODE, TUSNOM, TUGFLAGDEFAUT, TUGORDRE) VALUES ('DOCTYPE08', 'CBM', 'FL', 'DMATYPE', '0', '0');
INSERT INTO LKTUPTACTPG (TUPCODE, TACCODE, TPGCODE, TUSNOM, TUGFLAGDEFAUT, TUGORDRE) VALUES ('DOCTYPE09', 'CBM', 'FL', 'DMATYPE', '0', '0');
INSERT INTO LKTUPTACTPG (TUPCODE, TACCODE, TPGCODE, TUSNOM, TUGFLAGDEFAUT, TUGORDRE) VALUES ('DOCTYPE10', 'CBM', 'FL', 'DMATYPE', '0', '0');
INSERT INTO LKTUPTACTPG (TUPCODE, TACCODE, TPGCODE, TUSNOM, TUGFLAGDEFAUT, TUGORDRE) VALUES ('DOCTYPE11', 'CBM', 'FL', 'DMATYPE', '0', '0');
INSERT INTO LKTUPTACTPG (TUPCODE, TACCODE, TPGCODE, TUSNOM, TUGFLAGDEFAUT, TUGORDRE) VALUES ('DOCTYPE12', 'CBM', 'FL', 'DMATYPE', '0', '0');
INSERT INTO LKTUPTACTPG (TUPCODE, TACCODE, TPGCODE, TUSNOM, TUGFLAGDEFAUT, TUGORDRE) VALUES ('DOCTYPE13', 'CBM', 'FL', 'DMATYPE', '0', '0');
INSERT INTO LKTUPTACTPG (TUPCODE, TACCODE, TPGCODE, TUSNOM, TUGFLAGDEFAUT, TUGORDRE) VALUES ('DOCTYPE14', 'CBM', 'FL', 'DMATYPE', '0', '0');
INSERT INTO LKTUPTACTPG (TUPCODE, TACCODE, TPGCODE, TUSNOM, TUGFLAGDEFAUT, TUGORDRE) VALUES ('DOCTYPE15', 'CBM', 'FL', 'DMATYPE', '0', '0');
INSERT INTO LKTUPTACTPG (TUPCODE, TACCODE, TPGCODE, TUSNOM, TUGFLAGDEFAUT, TUGORDRE) VALUES ('DOCTYPE16', 'CBM', 'FL', 'DMATYPE', '0', '0');

INSERT INTO LKTUPTACTPG (TUPCODE, TACCODE, TPGCODE, TUSNOM, TUGFLAGDEFAUT, TUGORDRE) VALUES ('DOCTYPE16', 'CBM', 'FLRV', 'DMATYPE', '0', '0');
INSERT INTO LKTUPTACTPG (TUPCODE, TACCODE, TPGCODE, TUSNOM, TUGFLAGDEFAUT, TUGORDRE) VALUES ('DOCTYPE16', 'PRET', 'HPFI', 'DMATYPE', '0', '0');
INSERT INTO LKTUPTACTPG (TUPCODE, TACCODE, TPGCODE, TUSNOM, TUGFLAGDEFAUT, TUGORDRE) VALUES ('DOCTYPE16', 'PRET', 'LOANS', 'DMATYPE', '0', '0');

-----------------------------------------------
------ INSERTION FOR DOCUMENT CATEGORIES ------
-----------------------------------------------
INSERT INTO TUSER (TUSNOM, TUSLONGUEUR) VALUES ('DMACAT', 15);

INSERT INTO TUSPARAM (TUSNOM, TUPCODE) VALUES ('DMACAT', '3');
INSERT INTO TUSPARAM (TUSNOM, TUPCODE) VALUES ('DMACAT', '4');
INSERT INTO TUSPARAM (TUSNOM, TUPCODE, TUPFLAGORFI) VALUES ('DMACAT', 'CONS', '1');
INSERT INTO TUSPARAM (TUSNOM, TUPCODE) VALUES ('DMACAT', 'J');
INSERT INTO TUSPARAM (TUSNOM, TUPCODE) VALUES ('DMACAT', 'K');
INSERT INTO TUSPARAM (TUSNOM, TUPCODE) VALUES ('DMACAT', 'O');
INSERT INTO TUSPARAM (TUSNOM, TUPCODE) VALUES ('DMACAT', 'P');
INSERT INTO TUSPARAM (TUSNOM, TUPCODE) VALUES ('DMACAT', 'Q');
INSERT INTO TUSPARAM (TUSNOM, TUPCODE) VALUES ('DMACAT', 'R');
INSERT INTO TUSPARAM (TUSNOM, TUPCODE) VALUES ('DMACAT', 'S');
INSERT INTO TUSPARAM (TUSNOM, TUPCODE) VALUES ('DMACAT', 'T');
INSERT INTO TUSPARAM (TUSNOM, TUPCODE) VALUES ('DMACAT', 'X');
INSERT INTO TUSPARAM (TUSNOM, TUPCODE) VALUES ('DMACAT', 'Y');
INSERT INTO TUSPARAM (TUSNOM, TUPCODE) VALUES ('DMACAT', 'Z');

INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMACAT', '3', 'EN', 'Appending Document');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMACAT', '4', 'EN', 'Agreement Statement');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMACAT', 'J', 'EN', 'Vehicle Relation');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMACAT', 'K', 'EN', 'Hypothec Relation');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMACAT', 'O', 'EN', 'Identification Card');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMACAT', 'P', 'EN', 'Bankbook');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMACAT', 'Q', 'EN', 'Residence Relation');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMACAT', 'R', 'EN', 'Income Relation');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMACAT', 'S', 'EN', 'Be In Service Relation');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMACAT', 'T', 'EN', 'Business Proof');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMACAT', 'X', 'EN', 'Court Document');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMACAT', 'Y', 'EN', 'Outside Document');
INSERT INTO LANTUSPARAM (TUSNOM, TUPCODE, LANCODE, TUPLIBELLE) VALUES ('DMACAT', 'Z', 'EN', 'Other');