import React from 'react';
import {DeviceEventEmitter, Keyboard, KeyboardAvoidingView, StyleSheet, TextInput, View} from 'react-native';
import EntityMapper from "../Models/EntityMapper";
import EntityApplier from "../Models/EntityApplier";
import RichTextEditorControlBar from "./RichTextEditorControlBar";
import HTMLView from "react-native-htmlview";

export default class RichTextEditor extends React.Component {

    state = {
        plainText: '',  // Text without any content-entities
        richText: '',   // Text with content-entities
        entityMapper: new EntityMapper(),
        entityApplier: new EntityApplier(),
        currentSelection: null, // Currently selection -> Place of the caret
        showController: false,  // Show controller status -> Only when keyboard is open
    };

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide.bind(this));
    };

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    };

    _keyboardWillShow = () => {
        this.setState({
            showController: true
        })
    };

    _keyboardWillHide = () => {
        this.setState({
            showController: false
        })
    };

    /**
     * Function that gets called whenever a controller button was pressed and actions
     * on the entityMapper were executed. The reason this function exists, is to ensure UI
     * update after pressing the button. This is needed when adding entities on existing
     * plainText.
     */
    onEntityControlButtonPressed = () => {
        this.setState({
            richText: this.state.entityApplier.apply(
                this.state.plainText, this.state.entityMapper
            )
        })
    };

    /**
     * Function that gets called every time the plainText in the textInput changes. The
     * function updates the state's plainText prop to the new plainText and also updates the UI.
     * @param newText
     */
    onChangeText = (newText) => {
        this.setState({
            plainText: newText,
            richText: this.state.entityApplier.apply(newText, this.state.entityMapper)
        })
    };

    /**
     * Function that gets called whenever a selection has changed in the textInput.
     * This function is called before the onChangeText function, so new selection indexes
     * can be used over there.
     *
     * This function is called when a user makes a selection of content, types or
     * deletes some content.
     * @param newSelection
     */
    onSelectionIndexesChange = (newSelection) => {
        let {nativeEvent} = newSelection;
        let {selection} = nativeEvent;
        DeviceEventEmitter.emit('selectionChanged', selection);
        this.setState({
            currentSelection: selection
        })
    };

    _renderControlBar = () => {
        if (this.state.showController) {
            let {entityMapper, currentSelection} = this.state;
            return (
                <RichTextEditorControlBar
                    currentSelection={currentSelection}
                    entityMapper={entityMapper}
                    onControllerButtonPressed={this.onEntityControlButtonPressed.bind(this)}
                />
            )
        }
    };

    /**
     * @override
     */
    render() {
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={25} style={styles.main} behavior={'position'} enabled>
                <View style={styles.inputArea}>
                    <TextInput
                        multiline={true}
                        editable={false}
                        style={[styles.textView, styles.richText]}
                    >
                        {this.state.richText}
                    </TextInput>
                    <HTMLView  style={[styles.htmlText, styles.textView]} value={'<div>' + this.state.richText + '</div>'}/>
                    <TextInput
                        autoCorrect={!__DEV__}
                        onSelectionChange={this.onSelectionIndexesChange.bind(this)}
                        multiline={true}
                        style={[styles.textView, styles.textInput]}
                        onChangeText={this.onChangeText.bind(this)}
                    />
                </View>
                {this._renderControlBar()}

            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        width: '100%',
    },
    inputArea: {
        backgroundColor: 'white',
    },
    textView: {
        width: '100%',
        height: 100,
    },
    textInput: {
        // TODO: Enable to place on top!
        // position: 'absolute',
        // opacity: 0,
        backgroundColor: 'red',
    },
    richText: {
        backgroundColor: 'yellow'
    },
    htmlText: {
        backgroundColor: 'green'
    }

})