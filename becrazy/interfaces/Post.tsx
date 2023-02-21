export default interface Post {
    _id: string;
    username: string;
    description: string | null;
    videoId: number;
    nbComment: number;
    nbLike: string;
}
