import Post from './Post';

export default interface UserInfo {
    username: string;
    followers: number;
    following: number;
    posts: Array<Post>;
}