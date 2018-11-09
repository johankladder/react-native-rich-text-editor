import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import EntityControlButton from "./EntityControlButton";
import MutableEntityButton from "./Buttons/MutableEntityButton";
import ImmutableEntityButton from "./Buttons/ImmutableEntityButton";
import EnterLinkModal from "./Modals/EnterLinkModal";


export default class RichTextEditorControlBar extends React.Component {

    state = {
        buttons: [
            new MutableEntityButton('B', '<b>', '</b>', <Image source={require('../Images/ZSSbold.png')}/>),
            new MutableEntityButton('C', '<i>', '</i>', <Image source={require('../Images/ZSSitalic.png')}/>),
            new MutableEntityButton('C', '<s>', '</s>', <Image source={require('../Images/ZSSstrikethrough.png')}/>),
            new ImmutableEntityButton('A', '<a>', '</a>', <Image source={require('../Images/ZSSlink.png')}/>,
                (possiblyEntity) => {
                    this._openLinkCreationField(possiblyEntity)
                })
        ],
    };

    _openLinkCreationField = (possibleEntity) => {
        this.props.onNeedToShowEditorModal(<EnterLinkModal
            onSubmit={(options, content) => this._addToMapperCloseAndRefresh(possibleEntity, options, content)}
            onCancel={() => this._hideEditorModal()}
        />)
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

    _renderButtons = (buttons) => {
        return buttons.map(button => {
            return this._renderButton(button)
        })
    };

    _onEntityManipulated = () => {
        if (this.props.onEntityManipulated) {
            this.props.onEntityManipulated()
        }
    };

    _renderButton = (button) => {
        return (
            <View>
                <EntityControlButton
                    entityInfo={button.entityInfo}
                    onEntityControlButtonPressed={this._onEntityManipulated.bind(this)}
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