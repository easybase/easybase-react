import React, { Fragment } from 'react';
import styled from 'styled-components/native';

export const StatusBar = styled.StatusBar((props: any) => ({
    backgroundColor: '#fff',
    ...(props.theme.statusBar ? { ...props.theme.statusBar } : {})
}))

export const View = styled.View({
    width: "100%"
});

export const MainView = styled(View)({
    width: "100%",
    marginTop: 60,
    marginBottom: 60
});

export const Container = styled.KeyboardAvoidingView((props: any) => ({
    flex: 1,
    backgroundColor: '#fff',
    ...(props.theme.container ? { ...props.theme.container } : {})
}))

export const ScrollRoot = styled.ScrollView((props: any) => ({
    flex: 1,
    ...(props.theme.form ? { ...props.theme.form } : {})
}))

export const Form = (props: any) => <ScrollRoot
    keyboardShouldPersistTaps="handled"
    keyboardDismissMode="on-drag"
    contentContainerStyle={{
        flexGrow: 1,
        paddingTop: '24%',
        paddingRight: 33,
        paddingLeft: 33
    }}
    alwaysBounceVertical={false}
    showsVerticalScrollIndicator={false}
>
    <View style={{ flexGrow: 1, justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        {props.children}
    </View>
</ScrollRoot>

export const HeaderText = styled.Text((props: any) => ({
    fontSize: 37,
    fontWeight: "bold",
    marginTop: 25,
    color: '#13151b',
    width: '100%',
    textAlign: "left",
    ...(props.theme.headerText ? { ...props.theme.headerText } : {})
}))

export const SecondaryText = styled.Text((props: any) => ({
    fontSize: 18,
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

export const NoSecondaryButton = styled.View(() => ({
    backgroundColor: 'transparent',
    height: 35,
    overflow: "visible",
    marginBottom: '10%'  
}))

const SecondaryButtonRoot = styled.TouchableOpacity((props: any) => ({
    backgroundColor: 'transparent',
    height: 35,
    overflow: "visible",
    marginBottom: '10%',
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
    marginBottom: -35,
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
    height: 50,
    marginBottom: -55,
    overflow: "visible",
    marginTop: 5,
    fontSize: 14,
    fontWeight: '500',
    color: '#FF0000',
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

const ToastRoot = styled.View((props: any) => ({
    position: "absolute",
    top: 47,
    left: 0,
    right: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    ...(props.theme.toast ? { ...props.theme.toast } : {})
}))

const ToastContainer = styled.TouchableOpacity((props: any) => ({
    backgroundColor: '#333',
    elevation: '6',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 26,
    maxWidth: "94%",
    ...(props.theme.toast ? { ...props.theme.toast } : {})
}))

const ToastText = styled.Text((props: any) => ({
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 17,
    color: "#fff",
    textAlign: 'center',
    ...(props.theme.toastText ? { ...props.theme.toastText } : {})
}))

const CloseToastText = styled.Text((props: any) => ({
    color: "#AAA",
    fontWeight: '600',
    fontSize: 15,
    marginRight: 25,
    ...(props.theme.closeToastText ? { ...props.theme.closeToastText } : {})
}))

export const Toast = ({ toastMessage, toastOpen, setToastOpen }: { toastMessage: string, toastOpen: boolean, setToastOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    if (!toastOpen) return <Fragment />

    return (
        <ToastRoot>
            <ToastContainer activeOpacity={0.6} onPress={_ => setToastOpen(false)} style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.27, shadowRadius: 4.65 }}>
                <ToastText>{toastMessage}</ToastText>
                <CloseToastText>&#x2715;</CloseToastText>
            </ToastContainer>
        </ToastRoot>
    )
}
