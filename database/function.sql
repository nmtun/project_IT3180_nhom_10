-- Function to calculate the total parking fee for a household based on the vehicles they own.
DELIMITER //

CREATE FUNCTION calculate_parking_fee_by_household(hid INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
READS SQL DATA
BEGIN
  DECLARE fee DECIMAL(10,2);

  SELECT SUM(
    CASE VehicleType
      WHEN 'Xe máy' THEN 70000
      WHEN 'Ô tô' THEN 1200000
      ELSE 0
    END
  ) INTO fee
  FROM Vehicles
  WHERE HouseholdID = hid;

  RETURN IFNULL(fee, 0);
END;
//

DELIMITER ;
