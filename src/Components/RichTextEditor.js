import React from 'react';
import {DeviceEventEmitter, Keyboard, KeyboardAvoidingView, StyleSheet, TextInput, View} from 'react-native';
import EntityMapper from "../Models/EntityMapper";
import EntityApplier from "../Models/EntityApplier";
import RichTextEditorControlBar from "./RichTextEditorControlBar";
import EntitiesToComponentConverter from "./Converter/EntitiesToComponentConverter";
import EntityCreator from "../Models/EntityCreator";

export default class RichTextEditor extends React.Component {

    state = {
        plainText: '',  // Text without any content-entities
        richText: '',   // Text with content-entities
        entityMapper: new EntityMapper(),
        entityApplier: new EntityApplier(),
        entitiesConverter: new EntitiesToComponentConverter(),
        entityCreator: new EntityCreator(),
        currentSelection: {
            start: 0,
            end: 0
        }, // Currently selection -> Place of the caret
        showController: false,      // Show controller status -> Only when keyboard is open,
        toShowEditorModal: null,    // A modal window that needs to be shown on top of the editor
    };

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide.bind(this));

        this.initializeEditor()

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
     * Initialises the textEditor with initial values when needed. An initial value can be a initial rich text value
     * that was previously saved and needs to be inserted again.
     */
    initializeEditor = () => {
        if (this.props.initialRichContent) {
            let {baseContent, entityMapper} = this.state.entityCreator.createFromRichText(this.props.initialRichContent)
            this.setState({
                entityMapper: entityMapper
            }, () => {
                this.onChangeText(baseContent)
            })
        }
    };

    /**
     * Function that gets called whenever a controller button was pressed and actions
     * on the entityMapper were executed. The reason this function exists, is to ensure UI
     * update after pressing the button. This is needed when adding entities on existing
     * plainText.
     */
    onEntityControlButtonPressed = () => {
        this.updateRichText();
    };

    updateRichText = () => {
        this.setState({
            richText: this.state.entityApplier.apply(
                this.state.plainText, this.state.entityMapper
            )
        })
    };

    /**
     * Function that is called whenever a modal needs to be showed for the editor. This modal can contain edit fields
     * for i.e. Immutable Entities.
     * @param modal
     */
    onNeedToShowEditorModal = (modal) => {
        this.setState({
            toShowEditorModal: modal
        })
    };

    /**
     * Function that gets called every time the plainText in the textInput changes. The
     * function updates the state's plainText prop to the new plainText and also updates the UI.
     * @param newText
     */
    onChangeText = (newText) => {
        let richText = this._getFormattedRichText(this.state.entityApplier.apply(newText, this.state.entityMapper));

        this.setState({
            plainText: newText,
            richText: richText
        });

        this.publishText(newText, richText)
    };

    /**
     * Function that published the text to the provided listener.
     * @param plainText
     * @param richText
     */
    publishText = (plainText, richText) => {
        if (this.props.onChangeText) {
            this.props.onChangeText({
                plainText: plainText,
                richText: richText
            })
        }
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

        if (this.state.entityMapper.removeEmptyEntities().length) {
            DeviceEventEmitter.emit('resetModes');
        }

        this.setState({
            currentSelection: selection,
        });
    };

    /**
     * Function for adding content at a certain position of the  current content
     * @param startIndex
     * @param endIndex
     * @param content
     */
    addContent = ({startIndex, endIndex}, content) => {
        let left = this.state.plainText.substr(0, startIndex);
        let right = this.state.plainText.substr(endIndex);
        this.setState({
            plainText: left + content + right
        })
    };

    _getFormattedRichText = (richText) => {
        return '<div>' + richText.replace(/(?:\r\n|\r|\n)/g, '<br>') + '</div>';
    };

    _renderControlBar = () => {
        if (this.state.showController) {
            let {entityMapper, currentSelection} = this.state;
            return (
                <RichTextEditorControlBar
                    currentSelection={currentSelection}
                    entityMapper={entityMapper}
                    onContentNeedsToBeAdded={this.addContent.bind(this)}
                    onEntityManipulated={this.updateRichText.bind(this)}
                    onNeedToShowEditorModal={this.onNeedToShowEditorModal.bind(this)}
                />
            )
        }
    };

    renderRichHtmlText = () => {
        return (
            <TextInput
                multiline={true}
                editable={false}
                style={[styles.textView, styles.richText]}
            >
                {this.state.richText}
            </TextInput>
        )
    };

    /**
     * @override
     */
    render() {
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={25} style={styles.main} behavior={'position'} enabled>
                {this.state.toShowEditorModal}
                <View style={styles.inputArea}>
                    {/*{this.renderRichHtmlText()}*/}
                    <TextInput
                        autoCorrect={!__DEV__}
                        onSelectionChange={this.onSelectionIndexesChange.bind(this)}
                        multiline={true}
                        style={[styles.textView, styles.textInput]}
                        onChangeText={this.onChangeText.bind(this)}
                    >
                        {this.state.entitiesConverter.convertToTextComponents(
                            this.state.plainText, this.state.entityMapper
                        )}
                    </TextInput>
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
        height: 200,
    },
    textInput: {
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderRadius: 6,
        borderColor: '#8C8D8E',
        padding: 10,
    },
    richText: {
        backgroundColor: 'yellow'
    },
    htmlText: {
        backgroundColor: 'green'
    }

})