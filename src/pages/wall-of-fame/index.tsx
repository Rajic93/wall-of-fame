import {SyntheticEvent, useState} from 'react';
import './index.css';
import Board from "../board";
import {
    sizeSpanClassMapping,
} from "../../utils/mappings.ts";
import DraggableElement from "../../molecules/DraggableElement";
import Post from "../../templates/Post";
import {PostSizes, PostTypes} from "../../templates/Post/types.ts";
import EmptySlot from "../../atoms/EmptySlot";
import NewPostConfiguration, {NewPostInstanceValue} from "../../organisms/NewPostConfiguration";
import SignIn from '../../molecules/SignIn/index.tsx';
import XPost from "../../templates/XPost";


let initialSlots = Array(100).fill(null); // 10x10 matrix
initialSlots[1] = {
    id: 'testing',
    text: 'I am full!',
}
initialSlots[3] = {
    id: 'testing',
    text: 'I am full!',
    className: sizeSpanClassMapping[PostSizes.v1x2],
    size: PostSizes.v1x2,
}
initialSlots[4] = {
    id: 'N/a',
    content: 'N/a',
}
initialSlots[8] = {
    id: 'testing',
    text: 'I am full!',
    className: sizeSpanClassMapping[PostSizes.v2x2],
    size: PostSizes.v2x2,
}
initialSlots[11] = {
    id: 'testing',
    text: 'I am full!',
    className: sizeSpanClassMapping[PostSizes.v4x4],
    size: PostSizes.v4x4,
}
initialSlots[12] = {
    id: 'N/a',
    content: 'N/a',
}
initialSlots[13] = {
    id: 'N/a',
    content: 'N/a',
}
initialSlots[14] = {
    id: 'N/a',
    content: 'N/a',
}
initialSlots[21] = {
    id: 'N/a',
    content: 'N/a',
}
initialSlots[22] = {
    id: 'N/a',
    content: 'N/a',
}
initialSlots[23] = {
    id: 'N/a',
    content: 'N/a',
}
initialSlots[24] = {
    id: 'N/a',
    content: 'N/a',
}
initialSlots[31] = {
    id: 'N/a',
    content: 'N/a',
}
initialSlots[32] = {
    id: 'N/a',
    content: 'N/a',
}
initialSlots[33] = {
    id: 'N/a',
    content: 'N/a',
}
initialSlots[34] = {
    id: 'N/a',
    content: 'N/a',
}
initialSlots[41] = {
    id: 'N/a',
    content: 'N/a',
}
initialSlots[42] = {
    id: 'N/a',
    content: 'N/a',
}
initialSlots[43] = {
    id: 'N/a',
    content: 'N/a',
}
initialSlots[44] = {
    id: 'N/a',
    content: 'N/a',
}

const testImage = "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2969&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const onSlotAdd = (updated) => {
    initialSlots = updated;
}

const rowSize = 10;
const columnSize = 10;

const removeNaSlots = (slots, size: number) => {
    console.log({ size })
    let cleanedSlots = slots;
    if (size === PostSizes.v1x1) {
        cleanedSlots = slots.map((slot, index) => {
            const isCurrentFree = !slots[index];
            return {
                ...slot,
                isNa: !isCurrentFree,
            };
        });
    }
    if (size == PostSizes.v1x2) {
        // Cases:
        // 1. next one is not free
        // 2. current one is end of the row
        cleanedSlots = slots.map((slot, index) => {
            const isCurrentFree = !slots[index];
            const isNextFree = !slots[index + 1];
            const isEndOfRow = (index + 1) % rowSize === 0;
            return {
                ...slot,
                isNa: !(isCurrentFree && isNextFree) || isEndOfRow,
            };
        });
    }
    if (size == PostSizes.v2x1) {
        // Cases:
        // 1. the one bellow is not free
        // 2. current one is end of the column
        cleanedSlots = slots.map((slot, index) => {
            const isCurrentFree = !slots[index];
            const isBellowFree = !slots[index + rowSize];
            const isEndOfColumn = (index + 1) / rowSize > columnSize - 1;
            return {
                ...slot,
                isNa: !(isCurrentFree && isBellowFree) || isEndOfColumn,
            };
        });
    }
    if (size == PostSizes.v2x2) {
        // Cases:
        // 1. the one bellow is not free
        // 2. next one is not free
        // 2. diagonal one is not free
        // 2. current one is end of the column
        cleanedSlots = slots.map((slot, index) => {
            const isCurrentFree = !slots[index];
            const isNextFree = !slots[index + 1];
            const isBellowFree = !slots[index + rowSize];
            const isDiagonalFree = !slots[index + rowSize + 1];

            const isEndOfColumn = (index + 1) / rowSize > columnSize - 1;
            const isEndOfRow = (index + 1) % rowSize === 0;
            return {
                ...slot,
                isNa: !(isCurrentFree && isBellowFree && isNextFree && isDiagonalFree) || isEndOfColumn || isEndOfRow,
            };
        });
    }
    if (size == PostSizes.v4x4) {
        // Cases:
        // 1. the three bellow are not free
        // 2. next three are not free
        // 2. diagonal one is not free
        // 2. current one is end of the column
        cleanedSlots = slots.map((slot, index) => {
            // check the first row
            const isCurrentFree = !slots[index];
            const isPlus1Free = !slots[index + 1];
            const isPlus2Free = !slots[index + 2];
            const isPlus3Free = !slots[index + 3];
            const isRow1Free = isCurrentFree && isPlus1Free && isPlus2Free && isPlus3Free;
            // check the second row
            const isBellowFree = !slots[index + rowSize];
            const isBellowPlus1Free = !slots[index + rowSize + 1];
            const isBellowPlus2Free = !slots[index + rowSize + 2];
            const isBellowPlus3Free = !slots[index + rowSize + 3];
            const isRow2Free = isBellowFree && isBellowPlus1Free && isBellowPlus2Free && isBellowPlus3Free;
            // check the third row
            const is2BellowFree = !slots[index + 2 * rowSize];
            const is2BellowPlus1Free = !slots[index + 2 * rowSize + 1];
            const is2BellowPlus2Free = !slots[index + 2 * rowSize + 2];
            const is2BellowPlus3Free = !slots[index + 2 * rowSize + 3];
            const isRow3Free = is2BellowFree && is2BellowPlus1Free && is2BellowPlus2Free && is2BellowPlus3Free;
            // check the fourth row
            const is3BellowFree = !slots[index + 3 * rowSize];
            const is3BellowPlus1Free = !slots[index + 3 * rowSize + 1];
            const is3BellowPlus2Free = !slots[index + 3 * rowSize + 2];
            const is3BellowPlus3Free = !slots[index + 3 * rowSize + 3];
            const isRow4Free = is3BellowFree && is3BellowPlus1Free && is3BellowPlus2Free && is3BellowPlus3Free;
            // check column and row position
            const isEndOfColumn = (index + 1) / rowSize > columnSize - 4;
            const isEndOfRow = (index + 4) % rowSize === 0;
            return {
                ...slot,
                isNa: !(isRow1Free && isRow2Free && isRow3Free && isRow4Free) || isEndOfColumn || isEndOfRow,
            };
        });
    }
    console.log({ cleanedSlots })
    return cleanedSlots;
}

const filterOutNASlots = (slots: any[]) => slots.filter((s) => !s || s.id !== 'N/a' && s.content !== 'N/a')

const WallOfFame = () => {
    const [slots, setSlots] = useState(initialSlots);
    const [possibleTables] = useState({
        [PostSizes.v1x1]: removeNaSlots(initialSlots, PostSizes.v1x1),
        [PostSizes.v1x2]: removeNaSlots(initialSlots, PostSizes.v1x2),
        [PostSizes.v2x1]: removeNaSlots(initialSlots, PostSizes.v2x1),
        [PostSizes.v2x2]: removeNaSlots(initialSlots, PostSizes.v2x2),
        [PostSizes.v4x4]: removeNaSlots(initialSlots, PostSizes.v4x4),
    });
    const [draggedItem, setDraggedItem] = useState<{ [x: string]: number| string; }>(null);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [shouldShowEmptySlots, setShouldShowEmptySlots] = useState(false);
    const [showNewPostConfiguration, setShowNewPostConfiguration] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [size, setSize] = useState(PostSizes.v1x1);
    const [type, setType] = useState(PostTypes.TEXT);
    console.log({ table: possibleTables[size] })
    const shouldUpdate = (index) => {
        console.log({ index, draggedItem })
        if (draggedItem.size == PostSizes.v4x4) {
            return !(
                slots[index] ||
                slots[index + 1] ||
                slots[index + 2] ||
                slots[index + 3] ||
                slots[index + 10] ||
                slots[index + 11] ||
                slots[index + 13] ||
                slots[index + 14] ||
                slots[index + 20] ||
                slots[index + 21] ||
                slots[index + 23] ||
                slots[index + 24] ||
                slots[index + 30] ||
                slots[index + 31] ||
                slots[index + 33] ||
                slots[index + 34]
            );
        }
        if (draggedItem.size == PostSizes.v2x2) {
            return !(slots[index] || slots[index + 1] || slots[index + 10] || slots[index + 11]);
        }
        if (draggedItem.size == PostSizes.v2x1) {
            return !(slots[index] || slots[index + 10]);
        }
        if (draggedItem.size == PostSizes.v1x2) {
            return !(slots[index] || slots[index + 1]);
        }
        return !slots[index]
    }

    const tryUpdateSlots = (index) => {
        if (!shouldUpdate(index)) {
            setShowNewPostConfiguration(true);
            return;
        }
        const updated = [...initialSlots];
        updated[index] = draggedItem;
        updated[index].className = sizeSpanClassMapping[size];
        if (size == 2) {
            updated[index + 1] = { id: 'N/a', content: 'N/a' };
        }
        if (size == 3) {
            updated[index + 10] = { id: 'N/a', content: 'N/a' };
        }
        if (size == 4) {
            updated[index + 1] = { id: 'N/a', content: 'N/a' };
            updated[index + 10] = { id: 'N/a', content: 'N/a' };
            updated[index + 11] = { id: 'N/a', content: 'N/a' };
        }
        if (size == 5) {
            updated[index + 1] = { id: 'N/a', content: 'N/a' };
            updated[index + 2] = { id: 'N/a', content: 'N/a' };
            updated[index + 3] = { id: 'N/a', content: 'N/a' };
            updated[index + 10] = { id: 'N/a', content: 'N/a' };
            updated[index + 11] = { id: 'N/a', content: 'N/a' };
            updated[index + 13] = { id: 'N/a', content: 'N/a' };
            updated[index + 14] = { id: 'N/a', content: 'N/a' };
            updated[index + 20] = { id: 'N/a', content: 'N/a' };
            updated[index + 21] = { id: 'N/a', content: 'N/a' };
            updated[index + 23] = { id: 'N/a', content: 'N/a' };
            updated[index + 24] = { id: 'N/a', content: 'N/a' };
            updated[index + 30] = { id: 'N/a', content: 'N/a' };
            updated[index + 31] = { id: 'N/a', content: 'N/a' };
            updated[index + 33] = { id: 'N/a', content: 'N/a' };
            updated[index + 34] = { id: 'N/a', content: 'N/a' };
        }
        console.log({ updated, index });
        setSlots(updated);
        onSlotAdd(filterOutNASlots(updated));
    }


    const handlePlaceholderDragStart = ({ event, ...item }: Record<string, NewPostInstanceValue>) => {
        setCursorPosition({ x: event?.clientX, y: event?.clientY });
        setDraggedItem(item);
    };

    const handleDragOver = (dragOverIndex) => {
        console.log('handleDragOver', { dragOverIndex })
        if (draggedItem) {
            setDraggedIndex(dragOverIndex);
            tryUpdateSlots(dragOverIndex);
        }
    };
    const handleDrag = ({ event }: Record<string, NewPostInstanceValue>) => {
        setCursorPosition({ x: event.clientX, y: event.clientY });
        if ((event.clientX - cursorPosition.x) % 10 === 0 || (event.clientY - cursorPosition.y) % 10 === 0) {
            setShowNewPostConfiguration(false);
        }
    };

    const handleDrop = (e) => {
        console.log('handleDrop', { e })
        if (!shouldUpdate(draggedIndex)) {
            setShowNewPostConfiguration(true);
            return;
        }
        setShouldShowEmptySlots(false);
        setShowNewPostConfiguration(false);
        tryUpdateSlots(draggedIndex);
        setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleOnShowNewPostConfiguration = () => {
        setShowNewPostConfiguration(true);
        setShouldShowEmptySlots(true);
    }
    const handleOnCloseNewPostConfiguration = () => {
        setShowNewPostConfiguration(false);
        setShouldShowEmptySlots(false);
    }

    const onSizeChange = (newValue: number) => setSize(newValue);
    const onTypeChange = (newType: number) => setType(newType)

    return (
        <>
            <SignIn />

            {showNewPostConfiguration ? (
                <NewPostConfiguration
                    onDragStart={handlePlaceholderDragStart}
                    onDrag={handleDrag}
                    onDragEnd={handleDrop}
                    onSizeChange={onSizeChange}
                    onTypeChange={onTypeChange}
                    onClose={handleOnCloseNewPostConfiguration}
                />
            ) : null}

            <Board
                onShowNewPostConfiguration={handleOnShowNewPostConfiguration}
                showControls
            >
                {(shouldShowEmptySlots ? possibleTables[size] : slots).map((slot, index) => {
                    const isDraggedElementOverEmptySlot = index === draggedIndex && !slots[draggedIndex];
                    const isSlotFull = slot && slot.id !== 'N/a' && slot.content !== 'N/a';
                    const isEmptySlot = !slot || !slot.isNa;
                    return (
                        <>
                            {isDraggedElementOverEmptySlot ? (
                                <DraggableElement
                                    // onDragStart={handlePlaceholderDragStart}
                                    // onDrag={handleDrag}
                                    onDragEnd={handleDrop}
                                >
                                    <Post
                                        type={PostTypes.POSTER}
                                        imageSrc={testImage}
                                    />
                                </DraggableElement>
                            ) : null}
                            {isSlotFull ? (
                                <Post
                                    type={slot.type || PostTypes.TEXT}
                                    {...slot}
                                />
                            ) : null}
                            {isEmptySlot ? (
                                <EmptySlot
                                    onDragEnd={() => handleDragOver(index)}
                                    key={index}
                                    shouldShow={shouldShowEmptySlots}
                                />
                            ) : null}
                        </>
                    );
                })}
            </Board>
        </>
    );
};

export default WallOfFame;
