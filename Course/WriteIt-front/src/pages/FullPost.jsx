import React from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import axios from '../axios';

import { Post } from '../components/Post';
import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';

export const FullPost = () => {
    const [data, setData] = React.useState();
    const [isLoading, setLoading] = React.useState(true);
    const [comments, setComments] = React.useState([]);
    const { id } = useParams();

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
    }, []);

    if (isLoading) {
        return <Post isLoading={isLoading} isFullPost />;
    }

    return (
        <>
            <Post
                id={data._id}
                title={data.title}
                imageUrl={`http://localhost:4444${data.imageUrl}`}
                //imageUrl={data.imageUrl ? `${process.env.REACT_APP_API_URL}${data.imageUrl}` : ''}
                // imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
                user={data.user}
                createdAt={data.createdAt}
                viewsCount={data.viewsCount}
                commentsCount={comments.length}
                tags={data.tags}
                isFullPost>
                <ReactMarkdown children={data.text} />
            </Post>
            {comments.length === 0 ? (
                <p>Напишите первый комментарий</p>
            ) : (
                <CommentsBlock items={comments} isLoading={false}>
                    <Index />
                </CommentsBlock>
            )}
        </>
    );
};
