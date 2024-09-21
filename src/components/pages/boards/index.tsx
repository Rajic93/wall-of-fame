import { useNavigate } from 'react-router-dom';
import { Card, Col, Row, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import useUserData from '../../../domain/hooks/userProfile.ts';
import AuthenticatedPage from '../../templates/AuthenticatedPage';
import './index.css';

const Boards = () => {
    const { boards } = useUserData();
    const navigate = useNavigate();

    return (
        <AuthenticatedPage>
            <Row gutter={[24, 24]}>
                {boards.map((board: Record<string, any>) => (
                    <Col
                        xs={24}
                        md={12}
                        lg={6}
                        xl={4}
                        className='boards-container'
                    >
                        <Card
                            className='boards-card'
                            onClick={() => navigate(`/boards/${board.id}`)}
                        >
                            <Typography
                                className="boards-title"
                            >
                                {board.title}
                            </Typography>
                            <Row
                                justify="end"
                            >
                                <EyeOutlined />
                            </Row>
                        </Card>
                    </Col>
                ))}
            </Row>
        </AuthenticatedPage>
    );
}

export default Boards;
