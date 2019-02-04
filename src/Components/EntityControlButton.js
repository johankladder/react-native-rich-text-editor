import React from 'react';
import {DeviceEventEmitter, StyleSheet, TouchableOpacity} from 'react-native';
import EntityButton from "./EntityButton";
import Entity from "../Models/Entities/Entity";
import MutableEntityButton from "./Buttons/MutableEntityButton";
import ImmutableEntityButton from "./Buttons/ImmutableEntityButton";
import MutableEntity from "../Models/Entities/MutableEntity";
import ImmutableEntity from "../Models/Entities/ImmutableEntity";

export default class EntityControlButton extends React.Component {

    // TODO: When more modes, please make this more dynamic by adding a mode property
    state = {

        /**
         * Mutable modes:
         */
        // Insertion-Mode values:
        insertionMode: false,
        insertionModeEntity: null,

        // Update-Mode values:
        updateMode: false,
        updateModeEntities: [],
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState.insertionMode !== this.state.insertionMode) {
            return true;
        }

        return nextState.updateMode !== this.state.updateMode;
    };

    componentDidMount() {
        this.selectionChangedEvent = DeviceEventEmitter.addListener('selectionChanged', this.onCurrentSelectionChange.bind(this))
        this.resetModesEvent = DeviceEventEmitter.addListener('resetModes', this._resetModes.bind(this))
    };

    componentWillUnmount() {
        this.selectionChangedEvent.remove();
        this.resetModesEvent.remove();
    }

    _resetModes = () => {
        this.setState({
            insertionMode: false,
            insertionModeEntity: null,
            updateMode: false,
            updateModeEntities: [],
        })
    };

    /**
     * Function that gets called every time a user presses an controller button. It will also call a callback if
     * the parent provided on.
     *
     * @param button
     * @private
     */
    _onPressControllerButton = (button) => {
        if (this._isAllowedToBePressed(this)) {
            if (this.props.currentSelection) {
                this._determineActionToPerform(
                    this.props.currentSelection,
                    button
                );
                if (this.props.onEntityControlButtonPressed) {
                    this.props.onEntityControlButtonPressed(button)
                }
            }
        }
    };

    /**
     * Function to check whether a button can be pressed. In some situation a button is not allowed to be pressed.
     *
     * @param button
     * @return {*}
     * @private
     */
    _isAllowedToBePressed = (button) => {
        if (this.props.onAllowedToBePressedCheck) {
            return this.props.onAllowedToBePressedCheck(button)
        }
        return true;
    };

    /**
     * Determines whether the action should be a 'toggleAdd' (when the user selected multiple content) or a
     * 'insertionAdd' (when the user didn't selected multiple content, so just presses the button).
     *
     * @param currentSelection
     * @param button
     * @private
     */
    _determineActionToPerform = (currentSelection = {}, button) => {
        let {entityInfo} = button;
        let possibleEntity = this._createEntityFromSelectionAndInfo(currentSelection, entityInfo);
        if (button instanceof MutableEntityButton) {
            this._determineMutableActions(currentSelection, possibleEntity)
        }
        if (button instanceof ImmutableEntityButton) {
            this._determineImmutableActions(currentSelection, possibleEntity)
        }
    };

    _determineMutableActions = (currentSelection = {}, possibleEntity) => {
        if (this.state.updateMode) {
            this._toggleUpdateMode();
        } else if (this._isMultiSelection(currentSelection)) {
            this._toggleAdd(possibleEntity)
        } else {
            this._toggleInsertionMode(possibleEntity)
        }
    };

    _determineImmutableActions = (currentSelection = {}, possibleEntity) => {
        if (this.props.button.onImmutableAction) {
            this.props.button.onImmutableAction(possibleEntity)
        }
    };

    /**
     * Function that is called when the selectionChanged event is emitted in the application.
     *
     * @param newSelection
     */
    onCurrentSelectionChange = (newSelection) => {
        this._checkEveryChange(newSelection);

        if (this.state.updateMode) {
            this._onSelectionChangeWhileUpdateModeIsOn(newSelection, this.state.updateModeEntities)
        }

        if (this.state.insertionMode) {
            this._onSelectionChangeWhileInsertionModeIsOn(newSelection)
        }
    };

    /**
     * Function that hold all the functions that needs to be executed at every content change. For example
     * function that check whether content is added between entities or when an entity needs to be deleted.
     *
     * @param newSelection
     * @private
     */
    _checkEveryChange = (newSelection) => {
        this._checkUpdateMode(newSelection);
    };

    /**
     * Function that checks if the newSelection is already wrapped. If so (and the updateMode is not already on)
     * then the function will get these entities and sets the updateMode to true. After that it will call
     * the selectionChange function of this mode, to ensure all content is updated correctly.
     *
     * @param newSelection
     * @private
     */
    _checkUpdateMode = (newSelection) => {
        if (!this.state.updateMode) {
            let wrappedAroundEntities = this.props.entityMapper.wrappedAroundSelection(newSelection, this.props.entityInfo);
            if (wrappedAroundEntities.length) {
                this._toggleUpdateMode(newSelection, wrappedAroundEntities)
            }
        }
    };

    /**
     * Performs a toggleAdd on the given entity. So it inserts a entity when not added and deleted the entity when
     * already in mapper.
     *
     * @param entity
     * @private
     */
    _toggleAdd = (entity) => {
        this.props.entityMapper.toggleAddEntity(
            entity
        );
    };

    /**
     * Function for toggling the insertion mode of an Entity. The insertion-mode is toggled when a user presses a
     * control button when not selecting any content. For usability this means that the user would like to 'open' to
     * entity and place content in it till its un-toggled.
     *
     * @param entity
     * @private
     */
    _toggleInsertionMode = (entity) => {
        this._insertionModeAction(!this.state.insertionMode, entity);
        this.setState({
            insertionMode: !this.state.insertionMode
        }, () => {
            this._setButtonAsActivated(this.state.insertionMode)
        })
    };

    /**
     * Toggles the updateMode.
     * @private
     */
    _toggleUpdateMode = (newSelection, wrappedAroundEntities) => {

        // Immutable Entities can not be updated, so they are deleted when found!
        if (this.props.button instanceof ImmutableEntityButton) {
            return wrappedAroundEntities.forEach(entity => {
                this.props.entityMapper.removeEntity(entity)
            })
        }

        this._updateModeAction(!this.state.updateMode, newSelection, wrappedAroundEntities);
        this.setState({
            updateMode: !this.state.updateMode
        }, () => {
            this._setButtonAsActivated(this.state.updateMode)
        })
    };

    /**
     * Sets the button as activated in the controlBar. This is needed to control whether the user likes to have
     * multi tag support.
     *
     * @param status
     * @private
     */
    _setButtonAsActivated = (status) => {
        if (this.props.onButtonActivationChanged) {
            this.props.onButtonActivationChanged(this, status)
        }
    };

    /**
     * Function that handles the insertion-mode press. This means that when a user presses the button (when likely want
     * to be in insertion-mode) a base Entity object will be stored. From this base object, all future content appending
     * will be handled. When the user switched of the insertion-mode, this object is cleared, as it can't be used for
     * future insertion-modes.
     *
     * @param modeStatus
     * @param entity
     * @private
     */
    _insertionModeAction = (modeStatus, entity) => {
        if (modeStatus) {
            this.props.entityMapper.addEntity(entity);
            this.setState({
                insertionModeEntity: entity
            })
        } else {
            this._resetModes();
        }
    };

    /**
     * Function that handles the updateMode press. The update mode is not really a press, but a action
     * that is triggered automatically. The user can only toggle it off by pressing the controller button
     * again.
     *
     * @param modeStatus
     * @param newSelection
     * @param wrappedAroundEntities
     * @private
     */
    _updateModeAction = (modeStatus, newSelection, wrappedAroundEntities) => {
        if (modeStatus) {
            this._onSelectionChangeWhileUpdateModeIsOn(newSelection, wrappedAroundEntities);
        } else {
            this._resetModes();
        }
    };

    /**
     * Function that is called whenever a selection is changed while the insertion-mode is toggled on. This function
     * will create a updated entity and will update the state with it. The updated entity keeps the same startIndex as
     * the base Entity.
     *
     * @param newSelection
     * @private
     */
    _onSelectionChangeWhileInsertionModeIsOn = (newSelection) => {
        // Create a new Entity with the new selection and base values:
        let updatedEntity = this._createEntityFromSelectionAndInfo(newSelection, this.state.insertionModeEntity, this.props.button);

        // Keep the start-index, as this is needed to ensure appending:
        updatedEntity.startIndex = this.state.insertionModeEntity.startIndex;

        // Update the entity in the mapper and ensure that the state has a new base Entity:
        this.props.entityMapper.updateEntity(this.state.insertionModeEntity, updatedEntity);
        this.setState({
            insertionModeEntity: updatedEntity
        })
    };

    _onSelectionChangeWhileUpdateModeIsOn = (newSelection, wrappedEntities) => {
        // Update all the wrapped entities:
        let updatedEntities = wrappedEntities.map(entity => {

            // Clone the wrappedEntity:
            let updated = this._createEntityFromSelectionAndInfo(newSelection, entity);

            // Update with new values:
            updated.startIndex = entity.startIndex;
            this.props.entityMapper.updateEntity(entity, updated);

            // Return the updated entity to add to a new set:
            return updated;
        });
        this.setState({
            updateModeEntities: updatedEntities
        })
    };


    /**
     * Determines if the currentSelection (so the place where this entity could be placed) is a
     * multiSelection. This basically means that the user selected multiple characters to apply this
     * entity on. I.e. a currentSelection: {start: 0 , end: 1} returns TRUE and {start: 0, end: 0} FALSE
     *
     * @param currentSelection
     * @return {boolean}
     * @private
     */
    _isMultiSelection = (currentSelection) => {
        return currentSelection.start !== currentSelection.end;
    };

    /**
     * Function for creating a new Entity object from a selection and entity
     * information. This entity information can be a object like {openTag: '',
     * closeTag: ''} or a other Entity object. The selection object needs to
     * contain a 'start' and a 'end' property.
     *
     * @param selection
     * @param entityInfo
     * @param button
     * @return {Entity}
     * @private
     */
    _createEntityFromSelectionAndInfo = (selection, entityInfo) => {
        if (this.props.button instanceof MutableEntityButton) {
            return this._createMutableEntityFromSelectionAndInfo(selection, entityInfo)
        }
        if (this.props.button instanceof ImmutableEntityButton) {
            return this._createImmutableEntityFromSelectionAndInfo(selection, entityInfo)
        }
    };

    _createMutableEntityFromSelectionAndInfo = (selection, entityInfo) => {
        let {start, end} = selection;
        let {openTag, closeTag} = entityInfo;
        return new MutableEntity(start, end, openTag, closeTag);
    };

    _createImmutableEntityFromSelectionAndInfo = (selection, entityInfo) => {
        let {start, end} = selection;
        let {openTag, closeTag, options} = entityInfo;
        return new ImmutableEntity(start, end, openTag, options, closeTag)
    };

    /**
     * @override
     */
    render() {
        return (
            <EntityButton>
                <TouchableOpacity
                    style={[styles.button, this.state.insertionMode || this.state.updateMode ? styles.buttonActivatedStyle : styles.buttonStyle]}
                    onPress={() => this._onPressControllerButton(this.props.button)}

                >
                    {this.props.children}
                </TouchableOpacity>
            </EntityButton>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonActivatedStyle: {
        backgroundColor: '#5ca1fc'
    },
    buttonStyle: {}
});