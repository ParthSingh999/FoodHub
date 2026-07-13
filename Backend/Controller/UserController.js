const crypto = require('crypto');
const User = require('../Models/UserModel');

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
};

const verifyPassword = (storedPassword, suppliedPassword) => {
  const [salt, key] = storedPassword.split(':');
  const suppliedKey = crypto.scryptSync(suppliedPassword, salt, 64).toString('hex');
  return key === suppliedKey;
};

const CreateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    const newUser = await User.create({
      username,
      email,
      password: hashPassword(password),
    });

    const { password: _password, ...safeUser } = newUser.toJSON();
    return res.status(201).json(safeUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !verifyPassword(user.password, password)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const { password: _password, ...safeUser } = user.toJSON();
    return res.status(200).json(safeUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const GetAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt'] });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { CreateUser, LoginUser, GetAllUsers };