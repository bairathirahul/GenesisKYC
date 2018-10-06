export class Comment {
  created: Date;
  text: string;

  static convert(input: any) {
    const comments = Array<Comment>();
    if (input != null && input.length > 0) {
      for (const entry of input) {
        const comment = new Comment();
        comment.created = new Date(entry.Created);
        comment.text = entry.Text;
        comments.push(comment);
      }
    }
    return comments;
  }
}
