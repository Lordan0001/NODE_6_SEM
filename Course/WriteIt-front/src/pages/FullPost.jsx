import React from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import axios from '../axios';
import '../components/AddComment/CommentStyle.css';
import { Post } from '../components/Post';
import { CommentsBlock } from '../components/CommentsBlock';
import { selectIsAuth } from '../redux/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentLikes } from '../redux/slices/posts';

export const FullPost = () => {
    const [data, setData] = React.useState();
    const [isLoading, setLoading] = React.useState(true);
    const [comments, setComments] = React.useState([]);
    const { id } = useParams();
    const [commentText, setCommentText] = React.useState('');
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();
    const [likes, setLikes] = React.useState('');



    React.useEffect(() => {
        axios
            .get(`/posts/${id}`)
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.warn(err);
                alert('Ошибка при получении статьи');
            });

        axios
            .get(`/comments/${id}`)
            .then((res) => {
                setComments(res.data);
            })
            .catch((err) => {
                console.warn(err);
                alert('Ошибка при получении комментариев');
            });

        axios
            .get(`/like/${id}`)
            .then((data) => {
                console.log(data);
                setLikes(data.data.likesCount);
            })
            .catch((err) => {
                console.warn(err);
                alert('Ошибка при получении лайков');
            });
    }, [id, dispatch]);

    const handleCommentSubmit = async (event) => {
        event.preventDefault();

        const commentData = {
            postId: id,
            text: commentText,
        };

        try {
            const response = await axios.post('/comments', commentData);
            const newComment = response.data;
            setComments([...comments, newComment]);
            setCommentText('');

            // Fetch all comments again
            axios
                .get(`/comments/${id}`)
                .then((res) => {
                    setComments(res.data);
                })
                .catch((err) => {
                    console.warn(err);
                    alert('Ошибка при получении комментариев');
                });
        } catch (err) {
            console.warn(err);
            alert('Ошибка при отправке комментария');
        }





    };

    if (isLoading) {
        return <Post isLoading={isLoading} isFullPost />;
    }
    return (
        <>
            <Post
                id={data._id}
                title={data.title}
                imageUrl={`https://localhost:4444${data.imageUrl}`}
                user={data.user}
                createdAt={data.createdAt}
                viewsCount={data.viewsCount}
                commentsCount={comments.length}
                likes={likes}
                tags={data.tags}
                isFullPost
            >
                <ReactMarkdown children={data.text} />
            </Post>
            <CommentsBlock items={comments} isLoading={false}>
                {isAuth ? (
                    <>
                        <form onSubmit={handleCommentSubmit}>
                            <input
                                type="text"
                                value={commentText}
                                onChange={(event) => setCommentText(event.target.value)}
                                placeholder="Write Something..."
                                style={{ width: '100%', boxSizing: 'border-box' }}

                            />
                            <button type="submit">Send</button>
                        </form>
                    </>
                ) : (
                    <></>
                )}
            </CommentsBlock>
        </>
    );
};
