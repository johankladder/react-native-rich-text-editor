import React from 'react';
import {Button, StyleSheet, TextInput, View} from 'react-native';
import Modal from 'react-native-modal';

export default class EnterLinkModal extends React.Component {

    state = {
        link: null,
        content: null,
    };

    render = () => {
        return (
            <View>
                <Modal
                    avoidKeyboard={true}
                    isVisible={true}
                >
                    <View style={[styles.main]}>
                        <View style={[styles.textInputs]}>
                            <TextInput
                                style={[styles.textInput]}
                                onChangeText={(text) => this.setState({link: text})}
                            />

                            <TextInput
                                style={[styles.textInput, {marginTop: 20}]}
                                onChangeText={(text) => this.setState({content: text})}
                            />
                        </View>
                        <Button
                            title={'Button'}
                            onPress={() => this.props.onSubmit({
                                href: this.state.link
                            }, this.state.content)}
                        />
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInputs: {
        padding: 20,
        width: '100%',
        flexDirection: 'column',
    },
    textInput: {
        height: 50,
        borderWidth: 1
    }
});