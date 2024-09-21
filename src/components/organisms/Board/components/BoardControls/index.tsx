import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import NewPostFormToggleButton from '../NewPostFormToggleButton';
import './index.css';

export interface BoardControlsProps {
    enabled: boolean;
    isCreationEnabled: boolean;
    isCreationMode: boolean;
    onToggleNewPostForm: (isOpen: boolean) => void;
    onZoom: (coefficient: number) => void;
}

const BoardControls = ({
    isCreationEnabled = false,
    isCreationMode = false,
    enabled = false,
    onToggleNewPostForm = () => {},
    onZoom = () => {},
}: BoardControlsProps) => enabled ? (
        <div
            className="controls"
        >
            {isCreationEnabled ? (
                <NewPostFormToggleButton
                    isOpen={isCreationMode}
                    onToggle={onToggleNewPostForm}
                />
            ) : null}
            <ZoomInOutlined
                onClick={() => onZoom(1)}
            />
            <ZoomOutOutlined
                onClick={() => onZoom(-1)}
            />
        </div>
) : null;

export default BoardControls;
