--copied from INN0
CREATE OR REPLACE PACKAGE PAV4_GENERIC_POS
AS
	TYPE T_PARAMS IS TABLE OF VARCHAR2(256) INDEX BY VARCHAR2(32);

	FUNCTION F_GETPARAMS(
		p_keys STRING_ARRAY,
		p_values STRING_ARRAY)
	RETURN T_PARAMS;

	PROCEDURE P_DOREQUEST(
		p_request VARCHAR2,
		p_keys STRING_ARRAY,
		p_values STRING_ARRAY,
		p_clob IN OUT CLOB
		);

END PAV4_GENERIC_POS;
/


CREATE OR REPLACE PACKAGE BODY PAV4_GENERIC_POS
AS

	FUNCTION F_GETPARAMS(
		p_keys STRING_ARRAY,
		p_values STRING_ARRAY)
	RETURN T_PARAMS
	AS
		params T_PARAMS;
	BEGIN
		FOR i IN p_keys.FIRST .. p_keys.LAST
		LOOP
			params( p_keys(i) ) := p_values(i);
		END LOOP;
		return params;
	END F_GETPARAMS;

	PROCEDURE P_DOREQUEST(
		p_request VARCHAR2,
		p_keys STRING_ARRAY,
		p_values STRING_ARRAY,
		p_clob IN OUT CLOB
		)
	AS
		sql_stmt  VARCHAR2(200);
		params T_PARAMS;
		return_value CLOB;
		uticode VARCHAR2(256);
	BEGIN
		params := F_GETPARAMS(p_keys, p_values);

		uticode := params('uticode');

		sql_stmt := 'BEGIN :1 := ' || p_request || '(:2, PAV4_GENERIC_POS.F_GETPARAMS(:3, :4) ); END;';
		EXECUTE IMMEDIATE sql_stmt USING out return_value, uticode, p_keys, p_values;

		p_clob := return_value;

	END P_DOREQUEST;

END PAV4_GENERIC_POS;
/
