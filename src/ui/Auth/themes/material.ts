import { IStyles } from "../uiTypes";

export default {
    init: () => {
        if (!document.getElementById('easybase-material-roboto')) {
            const roboto = document.createElement('link');
            roboto.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
            roboto.setAttribute('rel', 'stylesheet');
            roboto.setAttribute('id', 'easybase-material-roboto')
            document.head.appendChild(roboto);
        }
    },
    container: {
        fontFamily: '"Roboto","Segoe UI",BlinkMacSystemFont,system-ui,-apple-system,sans-serif',
        backgroundColor: '#fbfbfb'
    },
    form: {
        backgroundColor: "#FFF"
    },
    submitButton: {
        // https://codepen.io/finnhvman/pen/MQyJxV
        boxShadow: '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
        color: "rgb(255, 255, 255)",
        backgroundColor: "rgb(33, 150, 243)",
        transition: 'box-shadow 0.2s',
        borderRadius: 4,
        padding: "0 16px",
        minWidth: 64,
        height: 40,
        fontSize: 17,
        fontWeight: 500,
        width: '100%',
        '&:hover': {
            boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12)',
            '&::before': {
                opacity: 0.08
            },
            '&:focus::before': {
                opacity: 0.3
            }
        },
        '&:focus': {
            boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12)',
            '&::before': {
                opacity: 0.24
            }
        },
        '&::before': {
            content: "''", // Note two outer string
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgb(, 255, 255, 255)',
            opacity: 0,
            transition: 'opacity 0.2s'
        },
        '&::after': {
            content: "''", // Note two outer string
            position: 'absolute',
            left: '50%',
            top: '50%',
            borderRadius: '50%',
            padding: '50%',
            width: 32,
            height: 32,
            backgroundColor: 'rgb(255, 255, 255)',
            opacity: 0,
            transform: 'translate(-50%, -50%) scale(1)',
            transition: 'opacity 1s, transform 0.5s'
        },
        '&:active': {
            boxShadow: '0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12)',
            '&::after': {
                opacity: 0.32,
                transform: 'translate(-50%, -50%) scale(0)',
                transition: 'transform 0s'
            }
        },
        '&:disabled': {
            color: 'rgba(0, 0, 0, 0.38)',
            backgroundColor: 'rgba(0, 0, 0, 0.12)',
            boxShadow: 'none',
            cursor: 'initial',
            '&::before': {
                opacity: 0
            },
            '&::after': {
                opacity: 0
            }
        }
    },
    textField: {
        fontSize: 14,
        color: '#555',
        lineHeight: 1.2,
        height: 45,
        padding: '0 5px',
        borderRadius: 0,
        borderBottom: '1px solid rgba(255, 255, 255, 0.7)',
        '&:focus': {
            outline: "none"
        },
        '&:focus ~ label, &:valid ~ label, &:not(:placeholder-shown) ~ label': {
            top: -14,
            fontSize: 12,
            color: '#2196F3'
        },
        '&:focus ~ div:before': {
            width: '100%'
        }
    },
    textFieldBar: {
        position: 'relative',
        display: 'block',
        width: '100%',
        '&:before': {
            content: "''",
            height: 2,
            width: 0,
            bottom: -2,
            position: 'absolute',
            background: '#2196F3',
            transition: '300ms ease all',
            left: '0%'
        }
    },
    textFieldLabel: {
        display: 'block',
        color: '#878787',
        fontSize: 16,
        position: 'absolute',
        pointerEvents: 'none',
        left: 5,
        top: 10,
        transition: '300ms ease all'
    },
    textFieldRoot: {
        borderBottom: '2px solid #adadad',
        marginTop: -10
    },
    secondaryButton: {
        color: '#2196F3'
    },
    forgotPassword: {
        color: '#2196F3'
    },
    errorText: {
        color: '#ff0000'
    }
} as IStyles
