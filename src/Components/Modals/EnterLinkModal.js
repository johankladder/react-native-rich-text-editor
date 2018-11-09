import React from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import Modal from 'react-native-modal';

export default class EnterLinkModal extends React.Component {

    state = {
        link: '',
        content: '',

    };

    /**
     * Retrieves the content of the link. If no content was set, it will use the link as content.
     * @return {string}
     * @private
     */
    _getContent = () => {
        if (!this.state.content.length) {
            return this.state.link;
        }
        return this.state.content;
    };

    /**
     * Function for trying to submit. Will show a error message if the content couldn't be validated.
     * @private
     */
    _tryToSubmit = () => {
        if (this._validate()) {
            this.props.onSubmit({
                href: this.state.link
            }, this.state.content)
        } else {
            this.setState({
                errorText: 'Please fill in a least the link field, or cancel'
            })
        }
    };

    /**
     * Function that gets called whenever the user cancels the modal.
     * @private
     */
    _onCancel = () => {
        this.props.onCancel();
    };

    _validate = () => {
        return this.state.link.length
    };

    render = () => {
        return (
            <View>
                <Modal
                    avoidKeyboard={true}
                    isVisible={true}
                >
                    <View style={[styles.main]}>
                        {this.state.errorText ? <Text style={[styles.errorText]}>{this.state.errorText}</Text> : null}
                        <View style={[styles.textInputs]}>
                            <TextInput
                                style={[styles.textInput]}
                                onChangeText={(text) => this.setState({link: text})}
                            />

                            <TextInput
                                style={[styles.textInput, {marginTop: 20}]}
                                onChangeText={(text) => this.setState({content: text})}
                                placeholder={this._getContent()}
                            />
                        </View>
                        <View style={[styles.buttonsArea]}>
                            <Button
                                title={'Cancel'}
                                color={'red'}
                                onPress={this._onCancel.bind(this)}
                            />
                            <Button
                                title={'Submit'}
                                onPress={this._tryToSubmit.bind(this)}
                            />
                        </View>
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
    },
    buttonsArea: {
        flexDirection: 'column'
    },
    errorText: {
        color: 'red'
    }
});