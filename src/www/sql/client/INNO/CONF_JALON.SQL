-- JALCODE          : code used in deals or others
-- JALFLAGINTERNE   : Flag
-- JALCOLORPOS      : color used for POS display, use '#fff' color type
-- JALCOLORFO       : color used in the Front to display informations, use '#fff' color type

--set serveroutput on
DECLARE
   PROCEDURE UPDATE_OR_INSERT_JALON_ROW (CODE JALON.JALCODE%TYPE, FLAG JALON.JALFLAGINTERNE%TYPE, C_POS JALON.JALCOLORPOS%TYPE, C_FRONT JALON.JALCOLORFO%TYPE)
   IS
    NUMBER_ROWS number;
   BEGIN
    SELECT COUNT(*) INTO NUMBER_ROWS FROM JALON where JALCODE = CODE;
    DBMS_OUTPUT.put_line('Code ''' || CODE || '''');
    IF NUMBER_ROWS != 0
    THEN
      DBMS_OUTPUT.put_line('-    Already exists, updating');
      UPDATE JALON SET JALFLAGINTERNE = FLAG, JALCOLORPOS = C_POS, JALCOLORFO = C_FRONT WHERE JALCODE = CODE;
      DBMS_OUTPUT.put_line('Updated');
    ELSE
      DBMS_OUTPUT.put_line('-    Don''t exists, inserting');
      INSERT INTO JALON (JALCODE, JALFLAGINTERNE, JALCOLORPOS, JALCOLORFO) VALUES (CODE, FLAG, C_POS, C_FRONT);
      DBMS_OUTPUT.put_line('Inserted');
    END IF;
   END;
BEGIN

  -- Add here your new jalon
  -- Just duplicate the line and it will update or insert the new values

  UPDATE_OR_INSERT_JALON_ROW('D_CREE', 1, '#0073B7', NULL);
END;