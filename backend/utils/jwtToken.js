export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  const safeUser = user.toObject ? user.toObject() : { ...user };
  delete safeUser.password;
  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      success: true,
      message,
      user: safeUser,
    });
};
