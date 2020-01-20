const router = require('express').Router()
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const { registerValidation, loginValidation } = require('../validation')

router.post('/register', async (req, res) => {
  // valiudate the data before making an user
  const { error } = registerValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // Check if the user is already in the database
  const emailExists = await User.findOne({ email: req.body.email })
  if (emailExists) return res.status(400).send('Email already exists')
  // Hash the password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  // create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  })
  try {
    const savedUser = await user.save()
    res.send({ user: user._id })
  } catch (err) {
    res.status(400).send(err)
  }
})

// Login

router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  // checking if the email exists
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('Email is not found')
  // Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if (!validPass) return res.status(400).send('Invalid password')

  res.send('success')
})

module.exports = router
