import { IStyles } from "../uiTypes";

export default {
    init: () => {},
    container: {
        fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Ubuntu,sans-serif',
        backgroundColor: '#fbfbfb'
    },
    textFieldRoot: {
        backgroundColor: "#FFF",
        height: 46,
        borderRadius: 4,
        cursor: "text",
        display: 'inline-flex',
        outline: 0,
        position: 'relative'
    },
    textField: {
        whiteSpace: 'nowrap',
        fontWeight: 400,
        fontSize: 16,
        lineHeight: 28,
        height: 34,
        display: 'inline-flex',
        background: 'transparent',
        transition: 'color .24s,background-color .24s,box-shadow .24s',
        boxShadow: 'rgb(60 66 87 / 16%) 0px 0px 0px 1px',
        outline: 'none',
        borderRadius: 4,
        padding: '6px 12px',
        '&:active, &:focus': {
            boxShadow: 'rgb(58 151 212 / 36%) 0px 0px 0px 4px, rgb(60 66 87 / 16%) 0px 0px 0px 1px'
        }
    },
    textFieldLabel: {
        display: "block",
        position: "absolute",
        top: -27,
        left: 0,
        fontSize: 14,
        color: "#3c4257"
    },
    submitButton: {
        width: '100%',
        backgroundColor: 'rgb(99, 91, 255)',
        boxShadow: 'rgb(0 0 0 / 12%) 0px 1px 1px 0px, rgb(69 56 255 / 80%) 0px 0px 0px 1px, rgb(60 66 87 / 8%) 0px 2px 5px 0px',
        height: 44,
        transition: 'background-color .24s,box-shadow .24s',
        fontWeight: 500,
        fontSize: 16,
        borderRadius: 4,
        color: '#fff',
        '&:focus, &:active': {
            boxShadow: 'rgb(58 151 212 / 36%) 0px 0px 0px 4px, rgb(0 0 0 / 12%) 0px 1px 1px 0px, rgb(69 56 255 / 80%) 0px 0px 0px 1px, rgb(60 66 87 / 8%) 0px 2px 5px 0px'
        }
    },
    genderSelect: {
        fontWeight: 400,
        fontSize: 16,
        height: 46,
        transition: 'color .24s,background-color .24s,box-shadow .24s',
        boxShadow: 'rgb(60 66 87 / 16%) 0px 0px 0px 1px',
        padding: '6px 12px',
        borderRadius: 4,
        '&:active, &:focus': {
            boxShadow: 'rgb(58 151 212 / 36%) 0px 0px 0px 4px, rgb(60 66 87 / 16%) 0px 0px 0px 1px'
        }
    },
    toast: {
        borderRadius: '10px'
    },
    form: {
        backgroundColor: "#FFF"
    },
    headerText: {
        color: '#3c4257'
    },
    secondaryText: {
        color: '#3c4257'
    }
} as IStyles
