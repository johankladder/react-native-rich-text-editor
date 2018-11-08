import React from 'react';
import {StyleSheet, View} from 'react-native';
import EntityControlButton from "./EntityControlButton";
import MutableEntityButton from "./Buttons/MutableEntityButton";

export default class RichTextEditorControlBar extends React.Component {

    state = {
        buttons: [
            new MutableEntityButton('B', '<b>', '</b>'),
            new MutableEntityButton('C', '<i>', '</i>')
        ]
    };

    _renderButtons = (buttons) => {
        return buttons.map(button => {
            return this._renderButton(button)
        })
    };

    _onEntityControlButtonPressed = (button) => {
        if (this.props.onControllerButtonPressed) {
            this.props.onControllerButtonPressed(button)
        }
    };

    _renderButton = (button) => {
        return (
            <EntityControlButton
                entityInfo={button.entityInfo}
                onEntityControlButtonPressed={this._onEntityControlButtonPressed.bind(this)}
                entityMapper={this.props.entityMapper}
                currentSelection={this.props.currentSelection}
                button={button}
            >
                {button.contentTitle}
            </EntityControlButton>

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