import {getPostById, getPostsByAuthorId, createPost, updatePost, deletePost, getPosts} from "services/posts"
import express, { Response, Request } from "express"
import {authorized} from "middleware/authMiddleware"
import AuthUserRequest from "types/AuthUserRequest"

const router = express.Router()

/***************************AUTH ROUTES******************************/

//auth route to get all posts current user made
//POSTMAN: Get Posts By Author Id Authorized
router.get('/user', authorized, async (req: AuthUserRequest, res :Response) => {
  const id: number = req.user.id
  const {result, error: postError} = await getPostsByAuthorId(id)
  if(postError){
    //todo log error
    return res.status(401).send({errorMessage: "Could not retrieve posts."})
  }
  return res.status(200).json(result)
})

//POSTMAN: Create Post
router.post('/', authorized, async (req: AuthUserRequest, res :Response) => {
  const {result, error: postError} = await createPost(req.body.title, req.body.content, req.user.id)
  if(postError){
    //todo log error
    return res.status(401).send({errorMessage: "Could not create post."})
  }
  return res.status(200).json(result)
})

//POSTMAN: Edit Post
router.put('/:id', authorized, async (req: AuthUserRequest, res :Response) => {
  const id: number = +req.params.id
  const {result, error: postError} = await updatePost(id, req.body.title, req.body.content, req.user.id, req.body.published)
  if(postError){
    //todo log error
    return res.status(401).send({errorMessage: "Could not update post."})
  }
  return res.status(200).json(result)
})

//POSTMAN: Delete Post
router.delete('/:id', authorized, async (req: AuthUserRequest, res :Response) => {
  const id: number = +req.params.id
  const {result, error: postError} = await deletePost(id, req.user.id)
  if(postError){
    //todo log error
    return res.status(401).send({errorMessage: "Could not delete post."})
  }
  return res.status(200).json(result)
})

/***************************UNAUTH ROUTES******************************/

//POSTMAN: Get Posts By Author Id Unauthorized
router.get('/user/:id', async (req: Request, res :Response) => {
  const id: number = +req.params.id
  const {result, error: postError} = await getPostsByAuthorId(id)
  if(postError){
    //todo log error
    return res.status(401).send({errorMessage: "Could not retrieve posts."})
  }
  return res.status(200).json(result)
})

//POSTMAN: Get Posts Unauthorized
router.get('/', async (req: Request, res :Response) => {
  const {result, error: postError} = await getPosts(+req.query.skip, +req.query.take)
  if(postError){
    console.log(postError)
    //todo log error
    return res.status(401).send({errorMessage: "Could not retrieve posts."})
  }
  return res.status(200).json(result)
})

//POSTMAN: Get Post Unauthorized
router.get('/:id', async (req: Request, res :Response) => {
  const id: number = +req.params.id
  const {result, error: postError} = await getPostById(id)
  if(postError){
    //todo log error
    return res.status(401).send({errorMessage: "Could not retrieve post."})
  }
  return res.status(200).json(result)
})

export default router
