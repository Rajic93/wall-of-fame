import { useParams } from 'react-router-dom';
import Board from '../../organisms/Board';
import AuthenticatedPage from '../../templates/AuthenticatedPage';


const WallOfFame = () => {
    const { id } = useParams();

    return (
        <AuthenticatedPage>
            <Board id={id ? parseInt(id) : undefined}/>
        </AuthenticatedPage>
    );
};

export default WallOfFame;
