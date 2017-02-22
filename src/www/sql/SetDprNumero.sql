
-- Set the deal number for clean increment

update dossierprospect set dprnumero=9 where dprnumero = 'TEMPO';
update dossierprospect set dprnumero = to_char(dprnumero,'00000000');
