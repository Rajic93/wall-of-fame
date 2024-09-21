import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import Boards from '../components/pages/boards';
import WallOfFame from '../components/pages/wall-of-fame';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Boards />,
    },
    {
        path: '/boards/:id',
        element: <WallOfFame />,
    },
]);

const Router = () => (
    <RouterProvider router={router} />
);

export default Router;
