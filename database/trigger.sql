--Khi thay đổi HouseholdHead, cập nhật tên trong Residents
DELIMITER $$

CREATE TRIGGER trg_update_household_head
AFTER UPDATE ON Households
FOR EACH ROW
BEGIN
  IF NEW.HouseholdHead <> OLD.HouseholdHead THEN
    UPDATE Residents
    SET FullName = NEW.HouseholdHead
    WHERE HouseholdID = NEW.HouseholdID AND Relationship = 'Chủ hộ';
  END IF;
END$$

DELIMITER ;

-- Khi xóa Household, xóa các bản ghi liên quan trong Residents, Vehicles và FeeDetails
DELIMITER $$

CREATE TRIGGER trg_delete_household
BEFORE DELETE ON Households
FOR EACH ROW
BEGIN
  -- Xóa các bản ghi liên quan trong bảng Residents
  DELETE FROM Residents WHERE HouseholdID = OLD.HouseholdID;

  -- Xóa các bản ghi liên quan trong bảng Vehicles
  DELETE FROM Vehicles WHERE HouseholdID = OLD.HouseholdID;

  -- Xóa các bản ghi liên quan trong bảng FeeDetails
  DELETE FROM FeeDetails WHERE HouseholdID = OLD.HouseholdID;
END$$

DELIMITER ;

-- khi xóa feecollection thì sẽ xóa các bản ghi liên quan trong FeeDetails
DELIMITER $$

CREATE TRIGGER trg_delete_feecollection
BEFORE DELETE ON FeeCollections
FOR EACH ROW
BEGIN
  DELETE FROM FeeDetails WHERE CollectionID = OLD.CollectionID;
END$$

DELIMITER ;


-- Trigger cập nhật trạng thái HasVehicle trong bảng Households khi có xe mới được thêm vào
DELIMITER $$

CREATE TRIGGER trg_after_insert_vehicle
AFTER INSERT ON Vehicles
FOR EACH ROW
BEGIN
  UPDATE Households
  SET HasVehicle = TRUE
  WHERE HouseholdID = NEW.HouseholdID;
END$$

DELIMITER ;

-- Trigger cập nhật trạng thái HasVehicle trong bảng Households khi xe bị xóa
DELIMITER $$

CREATE TRIGGER trg_after_delete_vehicle
AFTER DELETE ON Vehicles
FOR EACH ROW
BEGIN
  DECLARE vehicle_count INT;

  SELECT COUNT(*) INTO vehicle_count
  FROM Vehicles
  WHERE HouseholdID = OLD.HouseholdID;

  IF vehicle_count = 0 THEN
    UPDATE Households
    SET HasVehicle = FALSE
    WHERE HouseholdID = OLD.HouseholdID;
  END IF;
END$$

DELIMITER ;