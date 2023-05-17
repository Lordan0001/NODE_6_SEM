import React from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import axios from '../axios';
import '../components/AddComment/CommentStyle.css';
import { Post } from '../components/Post';
import { CommentsBlock } from '../components/CommentsBlock';

export const FullPost = () => {
    const [data, setData] = React.useState();
    const [isLoading, setLoading] = React.useState(true);
    const [comments, setComments] = React.useState([]);
    const { id } = useParams();
    const [commentText, setCommentText] = React.useState('');

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
    }, [id]);

    const handleCommentSubmit = (event) => {
        event.preventDefault();

        const commentData = {
            postId: id,
            text: commentText,
        };

        axios
            .post('/comments', commentData)
            .then((res) => {
                setComments([...comments, res.data]);
                setCommentText('');
                setTimeout(() => window.location.reload(), 1500);//mb cringe
            })
            .catch((err) => {
                console.warn(err);
                alert('Ошибка при отправке комментария');
            });
    };

    if (isLoading) {
        return <Post isLoading={isLoading} isFullPost />;
    }

    return (
        <>
            <Post
                id={data._id}
                title={data.title}
                imageUrl={`http://localhost:4444${data.imageUrl}`}
                user={data.user}
                createdAt={data.createdAt}
                viewsCount={data.viewsCount}
                commentsCount={comments.length}
                tags={data.tags}
                isFullPost>
                <ReactMarkdown children={data.text} />
            </Post>
            <CommentsBlock items={comments} isLoading={false}>
                <form onSubmit={handleCommentSubmit}>
                    <input
                        type="text"
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        placeholder="Write Something..."
                    />
                    <button type="submit">Send</button>
                </form>
            </CommentsBlock>

        </>
    );
};
