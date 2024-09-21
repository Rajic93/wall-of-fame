import { useContext, useEffect, useState } from 'react';
import { Button, Modal, RadioChangeEvent, Steps } from 'antd';
import { CheckCircleOutlined, LeftOutlined, RightOutlined, StopOutlined } from '@ant-design/icons';
import { PostSizes, PostTypes } from '../../../domain/models/Post.ts';
import { PostFormStep, typeToSizeFilter } from '../../../domain/reducers/board';
import BoardContext from '../../context/board.context.ts';
import AuthContext from '../../context/auth.context.ts';
import TypeStep from './components/TypeStep';
import ContentStep from './components/ContentStep';
import SizeStep from './components/SizeStep';
import './index.css';

interface NewPostConfigurationProps {
    onConfirm?: () => void;
}

const steps = [
    {
        type: PostFormStep.NONE,
        title: '',
    },
    {
        type: PostFormStep.TYPE_STEP,
        title: 'Choose content type',
    },
    {
        type: PostFormStep.CONTENT_STEP,
        title: 'Add your content',
    },
    {
        type: PostFormStep.SIZE_STEP,
        title: 'Choose post size',
    },
    {
        type: PostFormStep.SLOT_STEP,
        title: 'Choose post position in a board',
    },
];

const NewPostConfiguration = ({
    onConfirm = () => null,
}: NewPostConfigurationProps) => {
    const [contents, setContent] = useState<Record<string, string | object>>({});
    const { state, actions } = useContext(BoardContext);
    const authContext = useContext(AuthContext);

    const isModalOpen = !!authContext.session && state.isPostFormOpen;

    useEffect(() => {
        if (!isModalOpen) {
            setContent({});
        }
    }, [isModalOpen]);

    const handleSizeChange = (newSize: PostSizes) => actions?.setCellSize(newSize);
    const handleOnSizeChange = (e: RadioChangeEvent) => handleSizeChange(e.target.value);

    const handleOnTypeChange = (e: RadioChangeEvent) => {
        actions?.setPostType(e.target.value);
        const mapping = typeToSizeFilter[e.target.value as PostTypes]
        handleSizeChange((mapping && mapping[0]) ? mapping[0] : PostSizes.v1x1);
    }

    const handleOnNextClick = () => actions?.onNextFormStep();
    const handleOnPrevClick = () => actions?.onPrevFormStep();
    const handleOnConfirm = () => !!state.selectedCells.length && onConfirm();

    const handleOnUpload = (ct: Record<string, string | File>) => {
        const nextContents = {...contents};
        nextContents[state.postType] = ct;
        setContent(nextContents);
        actions?.setContent(ct);
    };

    const handleOnStepClick = (index: number) => {
        const step = steps[index + 1];
        if (step) {
            actions?.setFormStep(step.type);
        }
    }

    const step = steps.find(({ type }) => type === state.postFormStep) || steps[0];
    return (
        <>
            <Modal
                open={isModalOpen}
                footer={null}
                mask={false}
                styles={{ content: { padding: 0 }, mask: { display: 'none'} }}
                closeIcon={null}
                width={600}
            >
                <div
                    className="slot-configuration"
                >
                    <div
                        style={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                            marginBottom: step?.type !== PostFormStep.SLOT_STEP ? 20 : 0,
                        }}
                    >
                        <Steps
                            size="small"
                            direction={step?.type !== PostFormStep.SLOT_STEP ? "vertical" : "horizontal"}
                            current={steps.findIndex(({ type }) => type === step?.type) - 1}
                            items={steps
                                .filter(({ type }) => type !== PostFormStep.NONE)
                                .map((step, index) => ({
                                    ...step,
                                    title: step?.type !== PostFormStep.SLOT_STEP ? step.title : (index === 3 ? step.title : ''),
                                }))}
                            onChange={handleOnStepClick}
                            style={{ width: step?.type !== PostFormStep.SLOT_STEP ? 300 : 'fit-content' }}
                        />
                        {step.type === PostFormStep.SIZE_STEP ? (
                            <SizeStep
                                size={state.cellSize}
                                onSizeChange={handleOnSizeChange}
                                filter={typeToSizeFilter[state.postType]}
                            />
                        ) : null}
                        {step.type === PostFormStep.CONTENT_STEP ? (
                            <ContentStep
                                type={state.postType}
                                onContentSet={handleOnUpload}
                                content={contents[state.postType] as string}
                            />
                        ) : null}
                        {step.type === PostFormStep.TYPE_STEP ? (
                            <TypeStep
                                type={state.postType}
                                onTypeChange={handleOnTypeChange}
                            />
                        ) : null}
                    </div>
                    {/* In-form navigation buttons */}
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Button
                            size="middle"
                            style={{ width: 100, visibility: step.type === PostFormStep.TYPE_STEP ? 'hidden': 'visible' }}
                            icon={<LeftOutlined/>}
                            iconPosition="start"
                            onClick={handleOnPrevClick}
                        >
                            Previous
                        </Button>
                        <Button
                            size="middle"
                            style={{ width: 100 }}
                            icon={<RightOutlined/>}
                            iconPosition="end"
                            onClick={handleOnNextClick}
                            disabled={step?.type === PostFormStep.CONTENT_STEP && !contents[state.postType]}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </Modal>
            {step?.type === PostFormStep.SLOT_STEP ? (
                <>
                    <div
                        style={{ position: 'fixed', zIndex: 9999, top: 0, right: 0, left: 0, display: "flex", justifyContent: 'center'
                    }}
                    >
                        <Steps
                            size="small"
                            direction={step?.type !== PostFormStep.SLOT_STEP ? "vertical" : "horizontal"}
                            current={step?.type}
                            items={steps.map((step, index) => ({
                                ...step,
                                title: step?.type !== PostFormStep.SLOT_STEP ? step.title : (index === 3 ? step.title : ''),
                            }))}
                            onChange={step?.type === PostFormStep.SLOT_STEP ? handleOnStepClick : undefined}
                            style={{ width: 'fit-content',  padding: 20, backgroundColor: 'white', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', border: '1px solid #d0d0d0'  }}
                        />
                    </div>
                    <div style={{
                        position: 'fixed', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 9999
                    }}>
                        <div style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }}>
                            <StopOutlined onClick={handleOnPrevClick} style={{ backgroundColor: 'white', padding: 10,  fontSize: 24, borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }} />
                            <CheckCircleOutlined
                                onClick={handleOnConfirm} style={{ backgroundColor: 'white', padding: 10, fontSize: 24, borderBottomRightRadius: 5, borderTopRightRadius: 5, opacity: step?.type === PostFormStep.SLOT_STEP && state.selectedCells.length ? 1 : 0.6 }}
                            />
                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
}

export default NewPostConfiguration;