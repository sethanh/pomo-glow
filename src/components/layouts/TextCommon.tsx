import React from 'react';
import { Text, TextProps } from 'react-native';

interface TextCommonProps extends TextProps {
    children?: React.ReactNode;
    translateCode?: string;
}

export const TextCommon = ({ children, translateCode, ...rest }: TextCommonProps) => {
    return <Text {...rest}>{translateCode ? translateCode : children}</Text>;
};