import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import EntityControlButton from "./EntityControlButton";
import MutableEntityButton from "./Buttons/MutableEntityButton";
import ImmutableEntityButton from "./Buttons/ImmutableEntityButton";
import EnterLinkModal from "./Modals/EnterLinkModal";


export default class RichTextEditorControlBar extends React.Component {

    state = {
        buttons: [
            new ImmutableEntityButton('A', '<a>', '</a>', <Image source={require('../Images/ZSSlink.png')}/>,
                (possiblyEntity) => {
                    this._openLinkCreationField(possiblyEntity)
                }),
            new MutableEntityButton('B', '<b>', '</b>', <Image source={require('../Images/ZSSbold.png')}/>),
            new MutableEntityButton('C', '<i>', '</i>', <Image source={require('../Images/ZSSitalic.png')}/>),
            new MutableEntityButton('C', '<s>', '</s>', <Image source={require('../Images/ZSSstrikethrough.png')}/>),

        ],
        buttonsActivated: []
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        return nextProps.currentSelection !== this.props.currentSelection;
    };

    _openLinkCreationField = (possibleEntity) => {
        if (this.props.onLinkInput) {
            this.props.onLinkInput(({url, name}) => {
                let options = {href: url};
                this._addToMapperCloseAndRefresh(possibleEntity, options, name)
            })
        } else {
            this.props.onNeedToShowEditorModal(<EnterLinkModal
                onSubmit={(options, content) => this._addToMapperCloseAndRefresh(possibleEntity, options, content)}
                onCancel={() => this._hideEditorModal()}
            />)
        }
    };

    _shouldShowTagButtons = () => {
        return this.props.tagSupport;
    };

    _addToMapperCloseAndRefresh = (possibleEntity, options, content) => {
        possibleEntity.options = options;
        possibleEntity.content = content;
        this.props.onContentNeedsToBeAdded(possibleEntity, content);
        possibleEntity.endIndex = possibleEntity.endIndex + content.length;
        this.props.entityMapper.addEntity(possibleEntity);
        this._onEntityManipulated();
        this._hideEditorModal();
    };

    _hideEditorModal = () => {
        this.props.onNeedToShowEditorModal(null)
    };

    _buttonVisibleAccordingToTagSupport = (button) => {
        let status = this._shouldShowTagButtons();

        if (button instanceof MutableEntityButton) {
            return !!status;
        }
        return true;
    };

    _renderButtons = (buttons) => {
        return buttons.map(button => {
            return this._renderButton(button, this._buttonVisibleAccordingToTagSupport(button))
        })
    };

    _onEntityManipulated = () => {
        if (this.props.onEntityManipulated) {
            this.props.onEntityManipulated()
        }
    };

    _onAllowedToBePressed = (button) => {
        if (!this.props.multiButtonAllowed) {
            // Allow to be pushed if already was pushed or if empty:
            return this.state.buttonsActivated.indexOf(button) >= 0 || !this.state.buttonsActivated.length;
        }
        return true;
    };

    _onButtonActivationChanged = (button, status) => {
        if (status) {
            this._addButtonToActivatedButtons(button)
        } else {
            this._removeButtonFromActivatedButtons(button)
        }
    };

    _addButtonToActivatedButtons = (button) => {
        this.setState({
            buttonsActivated: [...this.state.buttonsActivated, button]
        })
    };

    _removeButtonFromActivatedButtons = (button) => {
        let copy = [...this.state.buttonsActivated];
        copy.splice(copy.indexOf(button), 1);
        this.setState({
            buttonsActivated: copy
        })
    };

    _renderButton = (button, visible) => {
        let onAllowedToBePressedFunction = visible ? this._onAllowedToBePressed.bind(this) : () => {
            return false
        }
        let numberedBoolean = visible ? 1 : 0
        return (
            <View style={{opacity: numberedBoolean}}>
                <EntityControlButton
                    pressable={visible}
                    entityInfo={button.entityInfo}
                    onButtonActivationChanged={this._onButtonActivationChanged.bind(this)}
                    onEntityControlButtonPressed={this._onEntityManipulated.bind(this)}
                    onAllowedToBePressedCheck={onAllowedToBePressedFunction}
                    entityMapper={this.props.entityMapper}
                    currentSelection={this.props.currentSelection}
                    button={button}
                >
                    {button.image}
                </EntityControlButton>
            </View>

        )
    };

    /**
     * @override
     */
    render = () => {
        return (
            <View style={[styles.main, this.props.style]}>
                {this._renderButtons(this.state.buttons)}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'row-reverse',
        width: '100%',
    },
    controllerButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 50,
        backgroundColor: 'blue'
    }
});