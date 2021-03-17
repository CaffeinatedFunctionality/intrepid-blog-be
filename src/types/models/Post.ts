declare interface Post {
  id: number
  title: string
  createdAt: Date
  content: string | null
  published: boolean
  authorId: number
}

export default Post
