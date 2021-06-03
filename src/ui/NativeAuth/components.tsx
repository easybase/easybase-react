import React, { Fragment } from 'react';
import { useToaster } from 'react-hot-toast/dist/core/use-toaster';
import styled from 'styled-components/native';

export const View = styled.View({
    width: "100%"
});

export const Form = styled.View((props: any) => ({
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: '25%',
    paddingBottom: '25%',
    paddingRight: 33,
    paddingLeft: 33,
    ...(props.theme.form ? { ...props.theme.form } : {})
}))

export const HeaderText = styled.Text((props: any) => ({
    fontSize: 37,
    fontWeight: "bold",
    marginTop: 25,
    color: '#3c4257',
    width: '100%',
    textAlign: "left",
    ...(props.theme.headerText ? { ...props.theme.headerText } : {})
}))

export const SecondaryText = styled.Text((props: any) => ({
    fontSize: 15,
    fontWeight: '300',
    textAlign: "left",
    color: '#3c4257',
    width: '100%',
    ...(props.theme.secondaryText ? { ...props.theme.secondaryText } : {})
}))

export const SpacerXL = styled.View((props: any) => ({
    height: 64
}))

export const SpacerL = styled.View((props: any) => ({
    height: 58
}))

export const SpacerS = styled.View((props: any) => ({
    height: 24
}))

export const Spacer = styled.View((props: any) => ({
    height: 37
}))

export const Input = styled.TextInput((props: any) => ({
    width: '100%',
    maxWidth: '100%',
    height: 60,
    borderColor: '#dbdbdb',
    borderStyle: 'solid',
    borderWidth: 1,
    fontWeight: 400,
    fontSize: 20,
    color: '#3c4257',
    background: 'transparent',
    borderRadius: 4,
    padding: 12,
    ...(props.theme.textField ? { ...props.theme.textField } : {})
}))

const SecondaryButtonRoot = styled.TouchableOpacity((props: any) => ({
    backgroundColor: 'transparent',
    height: 35,
    marginBottom: -35,
    overflow: "visible",
    ...(props.theme.secondaryButtonRoot ? { ...props.theme.secondaryButtonRoot } : {})
}))

const SecondaryButtonText = styled.Text((props: any) => ({
    fontWeight: 'bold',
    fontSize: 20,
    color: '#534eff',
    textAlign: "center",
    ...(props.theme.secondaryButton ? { ...props.theme.secondaryButton } : {})
}))

export const SecondaryButton = (props: any) => <SecondaryButtonRoot {...props}><SecondaryButtonText>{props.title}</SecondaryButtonText></SecondaryButtonRoot>

const ForgotButtonRoot = styled(SecondaryButtonRoot)((props: any) => ({
    width: "100%",
    ...(props.theme.forgotPasswordRoot ? { ...props.theme.forgotPasswordRoot } : {})
}))

const ForgotButtonText = styled(SecondaryButtonText)((props: any) => ({
    textAlign: "left",
    marginTop: 15,
    marginBottom: -15,
    fontSize: 16,
    ...(props.theme.forgotPassword ? { ...props.theme.forgotPassword } : {})
}))

export const ForgotPassword = (props: any) => <ForgotButtonRoot {...props}><ForgotButtonText>{props.title}</ForgotButtonText></ForgotButtonRoot>

const SubmitButtonRoot = styled.TouchableOpacity((props: any) => ({
    width: '100%',
    backgroundColor: 'rgb(99, 91, 255)',
    height: 60,
    borderRadius: 4,
    borderColor: '#534eff',
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...(props.theme.submitButtonRoot ? { ...props.theme.submitButtonRoot } : {})
}))

const SubmitButtonText = styled.Text((props: any) => ({
    fontWeight: 'bold',
    fontSize: 20,
    color: "#FFFFFF",
    ...(props.theme.submitButton ? { ...props.theme.submitButton } : {})
}))

export const SubmitButton = (props: any) => <SubmitButtonRoot {...props}><SubmitButtonText>{props.title}</SubmitButtonText></SubmitButtonRoot>

const StyledErrorText = styled.Text((props: any) => ({
    marginTop: 5,
    marginBottom: -5,
    fontSize: 12,
    fontWeight: '500',
    color: '#FF0000',
    height: 0,
    overflow: 'visible',
    ...(props.theme.errorText ? { ...props.theme.errorText } : {})
}))

export const ErrorText = (props: any) => props.value ? <StyledErrorText>{props.value}</StyledErrorText> : <Fragment />

export const Picker = styled.Picker((props: any) => ({
    width: '100%',
    maxWidth: '100%',
    height: 46,
    borderColor: '#dbdbdb',
    borderStyle: 'solid',
    borderWidth: 1,
    fontWeight: 400,
    fontSize: 16,
    background: 'transparent',
    borderRadius: 4,
    padding: 12,
    ...(props.theme.picker ? { ...props.theme.picker } : {})
}))

const Text = styled.Text({});
const ToastRoot = styled.View(props => ({
    margin: 20,
    backgroundColor: '#000',
    width: 150,
    borderRadius: '30px',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12
}));

const Toast = ({ t, updateHeight, offset }: any) => {
    return (
        <ToastRoot
            onLayout={(event) =>
                updateHeight(t.id, event.nativeEvent.layout.height)
            }
            key={t.id}>
            <Text>{t.icon}</Text>
            <Text style={{ color: '#fff', padding: 4, flex: 1, textAlign: 'center' }}>{t.message}</Text>
        </ToastRoot>
    )
};

export const Notifications = () => {
    const { toasts, handlers } = useToaster();
    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0
            }}>
            {toasts.map((t: any) => (
                <Toast
                    key={t.id}
                    t={t}
                    updateHeight={handlers.updateHeight}
                    offset={handlers.calculateOffset(t.id, {
                        reverseOrder: false
                    })}
                />
            ))}
        </View>
    );
}
