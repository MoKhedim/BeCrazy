export default interface Post {
    _id: string;
    username: string;
    description: string;
    videoId: string;
    created: Date;
    nbLikes: number;
    nbComments: number;
}
