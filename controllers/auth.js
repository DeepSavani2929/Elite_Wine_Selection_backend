const generateUserCartId = (userId) => {
  return `user-${userId.toString()}`;
};

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, guestCartId } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.json({
        success: false,
        message: "User with this email already exists",
      });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
    });

    const userCartId = generateUserCartId(newUser._id);

    await mergeCarts(guestCartId, userCartId, newUser._id);

    const token = jwt.sign(
      { id: newUser._id, cartId: userCartId },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "User registered successfully!",
      token,
      userId: newUser._id,
      cartId: userCartId,
      data: newUser,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, guestCartId } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "Invalid Credentials!" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.json({ success: false, message: "Invalid Credentials!" });

    const userCartId = generateUserCartId(user._id);

    await mergeCarts(guestCartId, userCartId, user._id);

    const token = jwt.sign({ id: user._id, cartId: userCartId }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      success: true,
      message: "User loggedin successfully!",
      token,
      userId: user._id,
      cartId: userCartId,
      data: user,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const emailVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User with this email is not registered!",
      });

    const resetLink = `http://localhost:5173/reset-password/${email}`; // use user._id rather than email for safety
    const htmlTemplate = resetPasswordEmailTemplate(resetLink);
    await transporter.sendMail({
      from: EMAIL_USER,
      to: user.email,
      subject: "Reset Your Password",
      html: htmlTemplate,
    });

    return res.status(200).json({
      success: true,
      data: { id: user._id },
      message: "Email sent successfully!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword, email } = req.body;
    if (!email || !newPassword)
      return res
        .status(400)
        .json({ success: false, message: "email and newPassword required" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not registered" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "User password changed Successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  loginUser,
  emailVerify,
  resetPassword,
};
