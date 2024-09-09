import {
    sizeHeightMapping,
    sizePreviewClassMapping,
    sizeWidthMapping
} from "../../utils/mappings.ts";
import {PostSizes} from "../../templates/Post/types.ts";

interface DraggableElementProsp {
    onDragStart: React.DragEventHandler<HTMLDivElement> | undefined;
    onDrag: React.DragEventHandler<HTMLDivElement> | undefined;
    onDragEnd: React.DragEventHandler<HTMLDivElement> | undefined;
    children: React.ReactNode;
    showPlaceholder?: boolean;
    shouldScale?: boolean;
    size?: PostSizes;
}

const DraggableElement = ({ children, onDragStart, onDrag, onDragEnd, showPlaceholder, size = PostSizes.v1x1, shouldScale }: DraggableElementProsp) => (
    <div
        draggable
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        style={{
            position: "relative",
            width: sizeWidthMapping[size],
            height: sizeHeightMapping[size],
            visibility: showPlaceholder ? 'visible' : 'hidden',
        }}
        className={shouldScale ? sizePreviewClassMapping[size] : '' }
    >
        { children}
    </div>
);

export default DraggableElement;
