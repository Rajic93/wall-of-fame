import './index.css';

export interface UnusableSlotProps {
    isHidden: boolean;
}

const UnusableSlot = ({ isHidden = false }: UnusableSlotProps) => (
    <div
        className={`unusable-slot unusable-slot--${isHidden ? 'hidden' : ''}`}
    />
);

export default UnusableSlot;
