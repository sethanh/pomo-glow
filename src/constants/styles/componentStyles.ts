import type { ViewStyle, TextStyle } from 'react-native';
import { colors, sizes } from '../themes';

export const wrapperStyles: ViewStyle = {
    gap: sizes.sm_8,
};

export const inputStyles: TextStyle = {
    color: colors.primaries.text,
    borderColor: colors.primaries.border,
    borderWidth: 1,
    padding: sizes.sm_8,
    borderRadius: sizes.sm_8
};

export const buttonStyles: ViewStyle = {
    borderColor: colors.primaries.border,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
};

