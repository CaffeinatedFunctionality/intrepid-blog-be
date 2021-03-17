import usingPostgres from "adapters/usingPostgres"
import {User, Post} from "types/models"
import PostWithUser from "types/PostWithUser"
import moment from "moment"

export async function getPostById(id: number): Promise<{result: PostWithUser, error: Error}> {
  return await usingPostgres<PostWithUser>(async postgresClient => {
    return await postgresClient.post.findFirst({
      where: {
        id
      },
      select: {
        title: true,
        content: true,
        authorId: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            fName: true,
            lName: true
          }
        }
      }
    })
  })
}

export async function getPostsByAuthorId(authorId: number): Promise<{result: Array<PostWithUser>, error: Error}> {
  return await usingPostgres<Array<PostWithUser>>(async postgresClient => {
    return await postgresClient.post.findMany({
      where: {
        authorId
      },
      select: {
        title: true,
        content: true,
        authorId: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            fName: true,
            lName: true
          }
        }
      }
    })
  })
}

export async function getPosts(skip: number, take: number): Promise<{result: Array<PostWithUser>, error: Error}> {
  return await usingPostgres<Array<PostWithUser>>(async postgresClient => {
    return await postgresClient.post.findMany({
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take,
      select: {
        title: true,
        content: true,
        authorId: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            fName: true,
            lName: true
          }
        }
      }
    })
  })
}

//could publish here as well, but I'm going to assume not to publish initially and then publish later
export async function createPost(title: string, content: string, authorId: number): Promise<{result: Post, error: Error}> {
  return await usingPostgres<Post>(async postgresClient => {
    return await postgresClient.post.create({
      data: {
        title,
        content,
        authorId,
        published: false,
        createdAt: moment().toDate(),
      }
    })
  })
}

export async function updatePost(id: number, title: string, content: string, authorId: number, published: boolean): Promise<{result: Post, error: Error}> {
  return await usingPostgres<Post>(async postgresClient => {
    return await postgresClient.post.update({
      where: {id},
      data: {
        title,
        content,
        authorId,
        published,
        updatedAt: moment().toDate(),
      }
    })
  })
}

export async function deletePost(id: number, authorId: number): Promise<{result: boolean, error: Error}> {
  const {result: user, error} = await usingPostgres<User>(async postgresClient => {
    //goes through user because that seems to be how you delete a connection with a relationship with
    return await postgresClient.user.update({
      where: {id: authorId},
      data: {
        posts: {
          delete: [{id}]
        }
      }
    })
  })
  //if it returns the user and no error then it went through
  return {result: !error && !!user, error}
}
