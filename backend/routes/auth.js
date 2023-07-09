const router = require("express").Router();
const User = require("../models/User");
const { registerSchema, loginSchema } = require('../validation')

const bcrypt = require("bcrypt");

//REGISTER
router.post('/register', async (req, res) => {

  const { result } = await registerSchema.validateAsync(req.body)
  if (result) return res.send(result)

  const emailExist = await User.findOne({ email: req.body.email })
  if (emailExist) return res.send('email is already exist')

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedpassword
  })
  try {
    const saveduser = await user.save()
    console.log("user detals is saved to db")
    res.json(saveduser)
  }
  catch (err) {
    console.log(err)
    res.json(err)
  }
  // res.send("register successful")
})

router.post('/login', async (req, res) => {

  const { result } = await loginSchema.validateAsync(req.body);
  if (result) return res.send(result);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.send("Email does't exists");

  const validpassword = await bcrypt.compare(req.body.password, user.password);
  if (!validpassword) return res.send('Invalid password');

  console.log(req.body.email, " logined in")
  res.send("login successful")
})

module.exports = router;
