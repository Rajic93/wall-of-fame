import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props: Record<string, any>) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Record<string, any>, info: Record<string, any>) {
        console.log(error, info.componentStack);
    }

    render() {
        if ((this.state as Record<string, any>).hasError) {
            return null;
        }

        return (this.props as Record<string, any>).children;
    }
}

export default ErrorBoundary;