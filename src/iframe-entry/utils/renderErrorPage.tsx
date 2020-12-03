import React from 'react';
import { render } from 'react-dom';

export const renderErrorPage = (
    element: HTMLElement,
    onClose: () => void,
    error: string
): void => {
    render(
        <>
            <div
                style={{
                    position: 'fixed',
                    zIndex: -1,
                    height: '100%',
                    width: '100%',
                    overflow: 'hidden',
                    backgroundColor: '#000',
                    opacity: 0.6,
                }}
            />
            <div
                style={{
                    position: 'fixed',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    margin: 0,
                    backgroundColor: '#292F3C',
                    width: '520px',
                    borderRadius: '6px',
                    padding: '40px',
                    boxSizing: 'border-box',
                }}
            >
                <div
                    style={{
                        fontSize: '15px',
                        lineHeight: '20px',
                        color: '#fff',
                        marginBottom: '40px',
                        fontFamily: 'Roboto, sans-serif',
                    }}
                >
                    {error}
                </div>
                <button
                    onClick={onClose}
                    style={{
                        width: '100%',
                        fontSize: '15px',
                        lineHeight: '48px',
                        padding: ' 0 40px',
                        color: '#fff',
                        backgroundColor: '#5A81EA',
                        outline: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'Roboto, sans-serif',
                    }}
                >
                    OK
                </button>
            </div>
        </>,
        element
    );
};
