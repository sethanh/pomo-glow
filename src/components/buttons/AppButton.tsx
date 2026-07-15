import { TouchableOpacity, TouchableOpacityProps, StyleSheet } from 'react-native';
import React, { ReactNode } from 'react';
import { buttons, buttonStyles, sizes } from '../../constants';
import { TextCommon } from '../layouts';

export interface AppButtonProps extends TouchableOpacityProps {
    labelTranslateCode?: string;
    shape?: 'circle' | 'default';
    shapeSize?: number;
    icon?: ReactNode;
    type?: 'primary' | 'default';
    onClick?: () => void;
}

export const AppButton = (props: AppButtonProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { style, labelTranslateCode, children, shape, shapeSize = 30, icon, type = 'default', onClick, ...rest } = props;

    const styleBtn = shape === 'circle' ? {
        width: shapeSize,
        height: shapeSize,
        borderRadius: shapeSize / 2,
        padding: 0,
    } : {
        paddingHorizontal: sizes.md_12,
        paddingVertical: sizes.sm_8,
    };

    var buttonTypeStyle = buttons?.[type];

    return (
        <TouchableOpacity
            style={[
                styles.button,
                styleBtn,
                buttonTypeStyle,
                { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: sizes.xxs_2 },
                style
            ]}
            {...rest}
            onPress={onClick}
        >
            {labelTranslateCode && <TextCommon style={{ color: buttonTypeStyle.color }} translateCode={labelTranslateCode} />}
            {children && children}
            {icon && icon}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: buttonStyles,
});