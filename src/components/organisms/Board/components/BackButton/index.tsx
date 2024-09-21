import { useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import './index.css';

const Index = () => {
    const navigate = useNavigate();

    return (
        <div
            className="back-button"
            onClick={() => navigate('/')}
        >
            <LeftOutlined />
        </div>
    );
}

export default Index;
