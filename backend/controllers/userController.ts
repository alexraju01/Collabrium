//CRUD user 

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
};