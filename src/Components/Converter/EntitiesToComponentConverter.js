import React from 'react';
import {Text} from 'react-native';

export default class EntitiesToComponentConverter {

    componentMapper = {
        '<b>': EntitiesToComponentConverter.renderBoldComponent,
        '<i>': EntitiesToComponentConverter.renderItalicComponent,
        '<a>': EntitiesToComponentConverter.renderLinkComponent,
        '<s>': EntitiesToComponentConverter.renderStrikeThrough,
    };

    convertToTextComponents = (baseContent, entityMapper) => {
        let components = [];
        let lastEntity = null;

        entityMapper.forEach(entity => {
            if (lastEntity) {
                components.push(EntitiesToComponentConverter.renderDefaultComponent(
                    baseContent.substr(lastEntity.endIndex, entity.startIndex - lastEntity.endIndex)
                ))
            } else {
                components.push(EntitiesToComponentConverter.renderDefaultComponent(
                    baseContent.substr(0, entity.startIndex)
                ))
            }
            components.push(this.componentMapper[entity.openTag](this.extractContentWithEntity(baseContent, entity)));
            lastEntity = entity;
        });

        if (!entityMapper.length) {
            components.push(EntitiesToComponentConverter.renderDefaultComponent(baseContent))
        } else {
            components.push(EntitiesToComponentConverter.renderDefaultComponent(
                baseContent.substr(lastEntity.endIndex)
            ))
        }

        return components;
    };

    extractContentWithEntity = (baseContent, entity) => {
        return baseContent.substr(entity.startIndex, entity.endIndex - entity.startIndex)
    };

    static renderDefaultComponent = (content) => {
        return <Text>{content}</Text>
    };

    static renderBoldComponent = (content) => {
        return <Text style={{fontWeight: 'bold'}}>{content}</Text>
    };

    static renderItalicComponent = (content) => {
        return <Text style={{fontStyle: 'italic'}}>{content}</Text>
    };

    static renderLinkComponent = (content) => {
        return <Text style={{color: '#5ca1fc', fontWeight: 'bold'}}>{content}</Text>
    };

    static renderStrikeThrough = (content) => {
        return <Text style={{textDecorationLine: 'line-through'}}>{content}</Text>
    }
}