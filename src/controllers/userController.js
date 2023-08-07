const knexQuery = require('../modelknex/knex');
const { userNew } = require('../models')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const create = async (req, res) => {
  try {
    const { nama_depan, nama_belakang, username, email, password } = req.body;

  // const insertData = await knexQuery('users').insert({
  //   firstName: body.nama_depan,
  //   lastName: body.nama_belakang,
  //   username: body.username,
  //   email: body.email,
  //   password: body.password
  // }) 

  if(!nama_depan || !email || !password || !username) {
    return res.status(400).send({
      message: 'some field must be filled, cannot be empty'
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 8)

  const input = await userNew.create({
    firstname: nama_depan,
    lastname: nama_belakang,
    username: username,
    email: email,
    password: hashedPassword
  })

  return res.status(201).send({
    message: 'user created'
  })
  } catch (error) {
    return res.send({
      message: 'error occured',
      data: error
    })
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if(!password || !username) {
      return res.status(400).send({
        message: 'some field must be filled, cannot be empty'
      });
    }

    const getUser = await userNew.findOne(({
      where: {username: username},
    }));

    
    if(!getUser) {
      return res.status(404).send({
        message: `username ${username} not found`
      })
    }

    const isValidPassword = bcrypt.compareSync(password, getUser.dataValues.password);
    console.log(isValidPassword)
    if(!isValidPassword) {
      return res.status(400).send({
        message: 'invalid password'
      })
    }
    
    const token = jwt.sign({
      id: getUser.dataValues.id,
      username: getUser.dataValues.username
    }, process.env.JWT_SECRET, {expiresIn: 3600})

    return res.status(200).send({
      message: 'login success',
      token: token
    })
    
  } catch (error) {
    return res.send({
      message: 'error occured',
      data: error
    })
  }
}

const update = async (req, res) => {
  try {
    const idUser = req.user.id;
    const { nama_depan, nama_belakang, username } = req.body;

    const updatedData = await userNew.update({
      firstname: nama_depan,
      lastname: nama_belakang,
      username: username
    }, {where: {id: idUser}})

    const data = await userNew.findOne({
      where: {id: idUser}
    })

    res.status(201).send({
      message: 'user updated',
      data: data
    })
  } catch (error) {
    return res.send({
      message: 'error occured',
      data: error
    })
  }
}

const deleteUser = async (req, res) => {
  try {
    const idUser = req.user.id;

    const deletedUser = await userNew.destroy({
      where: {id: idUser}
    });

    res.status(200).send({
      message: 'user deleted',
      data: deletedUser
    })

  } catch (error) {
    return res.send({
      message: 'error occured',
      data: error
    })
  }
}

const uploadPic = async (req, res) => {
  try {
    const idUser = req.user.id;
    const filename = req.file.filename;

    const getUser = await userNew.findOne({
      where: {id: idUser}
    });

    if(!getUser) {
      return res.status(404).send({
        message: 'user ' + getUser.dataValues.username + 'not found'
      })
    }

    const updateFoto = await userNew.update({
      profilepic: filename
    }, {where: {id: idUser}})

    return res.status(201).send({
      message: 'upload success'
    })
  } catch (error) {
    return res.send({
      message: 'error occured',
      data: error
    })
  }
}

const changePassword = async (req, res) => {
  try {
    const idUser = req.user.id;
    const { old_password, new_password } = req.body;

    const getUser = await userNew.findOne({
      where: {id: idUser}
    });

    if(!getUser) {
      return res.status(404).send({
        message: `user not found`
      })
    }

    const isValidPassword = bcrypt.compareSync(old_password, getUser.dataValues.password);

    if(!isValidPassword) {
      return res.status(400).send({
        message: 'invalid old password'
      })
    }

    if (!validator.isStrongPassword(new_password)) {
      return res.status(400).send({
        message: `not strong password. password must be 8 character, 1 uppercase, 1 lowecase, 1 number, and 1 symbol`
      })
    }

    const hashedPassword = bcrypt.hashSync(new_password, 8);

    const updatepwd = await userNew.update({password: hashedPassword}, {where: {id: idUser}})

    return res.status(201).send({
      message: 'password changed '
    })
  } catch (error) {
    return res.send({
      message: 'error occured',
      data: error
    })
  }
}

module.exports = { create, login, update, deleteUser, uploadPic, changePassword }