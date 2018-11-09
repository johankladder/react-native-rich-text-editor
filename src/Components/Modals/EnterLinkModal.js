import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import BaseModal from "./BaseModal";

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
            }, this._getContent())
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
            <BaseModal
                onCancel={this._onCancel.bind(this)}
                onSubmit={this._tryToSubmit.bind(this)}
            >
                <View style={[styles.errorContent]}>
                    {this.state.errorText ? <Text styles={[styles.errorText]}>{this.state.errorText}</Text> : null}
                </View>
                <View style={[styles.textInputs]}>
                    <TextInput
                        placeholder={'Place your URL here'}
                        style={[styles.textInput]}
                        onChangeText={(text) => this.setState({link: text})}
                    />
                    <TextInput
                        style={[styles.textInput, {marginTop: 20}]}
                        onChangeText={(text) => this.setState({content: text})}
                        placeholder={'URL name'}
                    />
                </View>
            </BaseModal>
        )
    }
}

const styles = StyleSheet.create({
    textInputs: {
        padding: 20,
        width: '100%',
        flexDirection: 'column',
    },
    textInput: {
        backgroundColor: 'white',
        height: 50,
        borderWidth: 0.5,
        borderRadius: 6,
        borderColor: '#8C8D8E',
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 18,
    },
    errorContent: {
        alignItems: 'center'
    },
    errorText: {
        color: 'red'
    }
});