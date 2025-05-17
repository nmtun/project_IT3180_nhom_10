import FeeType from "../models/FeeType.js";

// Lấy tất cả các loại phí
export const getAllFeeTypes = async (req, res) => {
  try {
    const feeTypes = await FeeType.findAll({
      where: { isActive: true },
    });
    res.status(200).json(feeTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy một loại phí theo ID
export const getFeeTypeById = async (req, res) => {
  try {
    const feeType = await FeeType.findByPk(req.params.id);
    if (!feeType) {
      return res.status(404).json({ message: "Không tìm thấy loại phí" });
    }
    res.status(200).json(feeType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo loại phí mới
export const createFeeType = async (req, res) => {
  try {
    const { name, description, category, amount, unit } = req.body;

    // Validation
    if (!name || !category || !amount) {
      return res.status(400).json({
        message: "Vui lòng điền đầy đủ thông tin bắt buộc (tên, loại, số tiền)",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        message: "Số tiền phải lớn hơn 0",
      });
    }

    const feeType = await FeeType.create({
      name,
      description,
      category,
      amount,
      unit,
      isActive: true,
    });

    res.status(201).json(feeType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật loại phí
export const updateFeeType = async (req, res) => {
  try {
    const { name, description, category, amount, unit, isActive } = req.body;
    const feeType = await FeeType.findByPk(req.params.id);

    if (!feeType) {
      return res.status(404).json({ message: "Không tìm thấy loại phí" });
    }

    // Validation
    if (amount && amount <= 0) {
      return res.status(400).json({
        message: "Số tiền phải lớn hơn 0",
      });
    }

    await feeType.update({
      name: name || feeType.name,
      description: description || feeType.description,
      category: category || feeType.category,
      amount: amount || feeType.amount,
      unit: unit || feeType.unit,
      isActive: isActive !== undefined ? isActive : feeType.isActive,
    });

    res.status(200).json(feeType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa loại phí (soft delete)
export const deleteFeeType = async (req, res) => {
  try {
    const feeType = await FeeType.findByPk(req.params.id);
    if (!feeType) {
      return res.status(404).json({ message: "Không tìm thấy loại phí" });
    }

    // Thay vì xóa hoàn toàn, chúng ta sẽ set isActive = false
    await feeType.update({ isActive: false });
    res.status(200).json({ message: "Đã xóa loại phí thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
