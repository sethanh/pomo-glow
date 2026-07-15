import { scale } from '../scales';

export const sizes = {
    none: 0,
    xxs_2: scale(2),
    xs_4: scale(4),
    sm_8: scale(8),
    md_12: scale(12),
    lg_24: scale(24),
    xl_32: scale(32),
};

export const colors = {
    primaries: {
        text: '#393e42',
        border: '#F2F4F7',
        background: '#ffffff',
        link: '#007AFF',
        warning: '#DC6803',
        danger: '#D92D20',
        backgroundOverlay: '#f5f5f5',
    },
    secondary: {
        text: '#344054',
        border: '#EAECF0',
        background: '#d49595',
    }
};

export const buttons = {
    primary: {
        backgroundColor: colors.primaries.link,
        color: colors.primaries.background,
        borderColor: colors.primaries.link,
        borderWidth: 1,
    },
    warning: {
        backgroundColor: colors.primaries.warning,
        color: colors.primaries.background,
        borderColor: colors.primaries.warning,
        borderWidth: 1,
    },
    error: {
        backgroundColor: colors.primaries.danger,
        color: colors.primaries.background,
        borderColor: colors.primaries.danger,
        borderWidth: 1,
    },
    default: {
        backgroundColor: colors.primaries.background,
        color: colors.primaries.text,
        borderColor: colors.primaries.border,
        borderWidth: 1,
    },
};

export const textInputs = {
    primary: {
        backgroundColor: colors.primaries.background,
        borderColor: colors.primaries.link,
        borderWidth: 1.5,
        color: colors.primaries.text,
        placeholderTextColor: colors.primaries.text,
    },
    warning: {
        backgroundColor: colors.primaries.background,
        borderColor: colors.primaries.warning,
        borderWidth: 1.5,
        color: colors.primaries.text,
        placeholderTextColor: colors.primaries.text,
    },
    error: {
        backgroundColor: colors.primaries.background,
        borderColor: colors.primaries.danger,
        borderWidth: 1.5,
        color: colors.primaries.text,
        placeholderTextColor: colors.primaries.text,
    },
    default: {
        backgroundColor: colors.primaries.background,
        borderColor: colors.primaries.border,
        borderWidth: 1,
        color: colors.primaries.text,
        placeholderTextColor: colors.primaries.text,
    },
};

