import React from 'react';
import {Text} from 'react-native';

export default class EntitiesToComponentConverter {

    componentMapper = {
        '<b>': EntitiesToComponentConverter.renderBoldComponent,
        '<i>': EntitiesToComponentConverter.renderItalicComponent,
        '<a>': EntitiesToComponentConverter.renderLinkComponent,
        '<s>': EntitiesToComponentConverter.renderStrikeThrough,
    };

    convertToTextComponents = (baseContent, entityMapper, style) => {
        let components = [];
        let lastEntity = null;

        let defaultStyle = this.getTextStyle(style);

        entityMapper.forEach(entity => {
            if (lastEntity) {
                components.push(EntitiesToComponentConverter.renderDefaultComponent(
                    baseContent.substr(lastEntity.endIndex, entity.startIndex - lastEntity.endIndex), defaultStyle
                ))
            } else {
                components.push(EntitiesToComponentConverter.renderDefaultComponent(
                    baseContent.substr(0, entity.startIndex), defaultStyle
                ))
            }

            components.push(this.componentMapper[entity.openTag](
                this.extractContentWithEntity(baseContent, entity), defaultStyle));
            lastEntity = entity;
        });

        if (!entityMapper.length) {
            components.push(EntitiesToComponentConverter.renderDefaultComponent(baseContent, defaultStyle))
        } else {
            components.push(EntitiesToComponentConverter.renderDefaultComponent(
                baseContent.substr(lastEntity.endIndex), defaultStyle
            ))
        }

        return components;
    };

    getTextStyle = (possibleStyle) => {
        if (possibleStyle) {
            return possibleStyle
        }
        return {};
    };

    extractContentWithEntity = (baseContent, entity) => {
        return baseContent.substr(entity.startIndex, entity.endIndex - entity.startIndex)
    };

    static renderDefaultComponent = (content, baseStyle) => {
        return <Text style={baseStyle}>{content}</Text>
    };

    static renderBoldComponent = (content, baseStyle) => {
        return <Text style={[{fontWeight: 'bold'}, baseStyle]}>{content}</Text>
    };

    static renderItalicComponent = (content, baseStyle) => {
        return <Text style={[{fontStyle: 'italic'}, baseStyle]}>{content}</Text>
    };

    static renderLinkComponent = (content, baseStyle) => {
        return <Text style={[{color: '#5ca1fc', fontWeight: 'bold'}, baseStyle]}>{content}</Text>
    };

    static renderStrikeThrough = (content, baseStyle) => {
        return <Text style={[{textDecorationLine: 'line-through'}, baseStyle]}>{content}</Text>
    }
}