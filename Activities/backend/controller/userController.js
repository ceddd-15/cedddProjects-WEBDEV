import User from "../models/User.js";

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("getProfile error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    console.log("updateProfile - user:", req.user);
    console.log("updateProfile - body:", req.body);
    
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const { username, email, phone, avatar } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    
    await user.save();
    
    const updatedUser = await User.findById(userId).select("-password");
    res.json(updatedUser);
  } catch (error) {
    console.error("updateProfile error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const { fullName, phone, address, city, postalCode } = req.body;
    
    console.log("addAddress - user.id:", req.user.id);
    console.log("addAddress - body:", req.body);
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const isFirst = user.addresses.length === 0;
    
    user.addresses.push({
      fullName,
      phone,
      address,
      city,
      postalCode,
      isDefault: isFirst,
    });
    
    await user.save();
    
    const updatedUser = await User.findById(req.user.id).select("-password");
    res.json(updatedUser);
  } catch (error) {
    console.error("addAddress error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { fullName, phone, address, city, postalCode } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const addr = user.addresses.id(addressId);
    if (!addr) {
      return res.status(404).json({ message: "Address not found" });
    }
    
    if (fullName) addr.fullName = fullName;
    if (phone) addr.phone = phone;
    if (address) addr.address = address;
    if (city) addr.city = city;
    if (postalCode) addr.postalCode = postalCode;
    
    await user.save();
    
    const updatedUser = await User.findById(req.user.id).select("-password");
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    user.addresses.pull(addressId);
    await user.save();
    
    const updatedUser = await User.findById(req.user.id).select("-password");
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setDefaultAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    user.addresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === addressId;
    });
    
    await user.save();
    
    const updatedUser = await User.findById(req.user.id).select("-password");
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
