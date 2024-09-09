import { Tweet } from "react-twitter-widgets";
import {useState} from "react";
import {Col} from "antd";

const XPost = ({ postId = '' }) => {
    const [id, setPostId] = useState<string>(postId);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setPostId(e.target.value);

    return (
        <Col style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} >
            <div>
                Tweet ID: <input onChange={onChange}/>
            </div>
            <div style={{ transform: 'scale(0.5) translateY(-300px)' }}>
                {id ? <Tweet tweetId={id} /> : null}
            </div>
        </Col>
    );
}

export default XPost;
