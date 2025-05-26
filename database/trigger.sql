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