const { postNew } = require('../models');

const craetePost = async (req, res) => {
  try {
    const { id, username } = req.user;
    const { title, body } = req.body;

    if(!title || !body) {
      return res.status(400).send({
        message: 'some field must be filled, cannot be empty'
      })
    }

    const createpost = await postNew.create({
      user_id: id,
      username: username,
      title: title,
      body: body
    })

    return res.status(201).send({
      message: 'new post success created'
    })
  } catch (error) {
    return res.send({
      message: 'error occured',
      data: error
    })
  }
}

const getAllPost = async (req, res) => {
  try {
    const allPosts = await postNew.findAll()

    res.status(200).send({
      message: 'data post retrieved',
      status: 'ok',
      data: allPosts
    })
    
  } catch (error) {
    return res.send({
      message: 'error occured',
      data: error
    })
  }
}

const getPostsByUsername = async (req, res) => { 
  try {
    const { username } = req.params;
    const postByUsername = await postNew.findAll({where: {username: username}});

    res.status(200).send({
      message: 'data post retrieved',
      status: 'ok',
      data: postByUsername
    })
  } catch (error) {
    return res.send({
      message: 'error occured',
      data: error
    })
  }
}

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const postById = await postNew.findOne({where: {id: id}});

    if(!postById) {
      return res.status(404).send({
        message: 'post not found'
      })
    }

    res.status(200).send({
      message: 'data post retrieved',
      status: 'ok',
      data: postById
    })
  } catch (error) {
    return res.send({
      message: 'error occured',
      data: error
    })
  }
}

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user.username;
    const getPost = await postNew.findOne({where: {id: id}});
    
    if(!getPost) {
      return res.status(404).send({
        message: `post not found`
      })
    }
    
    const usersPost = getPost.dataValues.username;

    if(usersPost !== currentUser) {
      return res.status(403).send({
        message: 'you have no access to update this post!'
      })
    }

    const { title, body } = req.body;
    const updatedPost = await postNew.update({
      title: title,
      body: body
    }, {where: {id: id}});

    res.status(201).send({
      message: 'post updated',
      status: 'ok'
    })

  } catch (error) {
    return res.send({
      message: 'error occured',
      data: error.message
    })
  }
}

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user.username;
    const getPost = await postNew.findOne({where: {id: id}});

    if(!getPost) {
      return res.status(404).send({
        message: `post not found`
      })
    }
    
    const usersPost = getPost.dataValues.username;

    if(usersPost !== currentUser) {
      return res.status(403).send({
        message: 'you have no access to delete this post!'
      })
    }

    const deletedPost = await postNew.destroy({where: {id: id}});

    res.status(200).send({
      message: 'post deleted',
      status: 'ok'
    })
  } catch (error) {
    return res.send({
      message: 'error occured',
      data: error.message
    })
  }
}

module.exports = { craetePost, getAllPost, getPostsByUsername, getPostById, updatePost, deletePost }