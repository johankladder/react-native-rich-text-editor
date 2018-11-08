import React from 'react';
import {StyleSheet, View} from 'react-native';
import EntityControlButton from "./EntityControlButton";

export default class RichTextEditorControlBar extends React.Component {

    state = {
        buttons: [
            {
                key: 'bold',
                content: {
                    title: 'B'
                },
                entityInfo: {
                    openTag: '<b>',
                    closeTag: '</b>'
                }
            }
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
        let {key, content} = button;
        let {title} = content;
        return (
            <EntityControlButton
                onEntityControlButtonPressed={this._onEntityControlButtonPressed.bind(this)}
                entityMapper={this.props.entityMapper}
                currentSelection={this.props.currentSelection}
                button={button}
                key={key}
            >
                {title}
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