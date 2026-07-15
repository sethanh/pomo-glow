import React from 'react';
import { TouchableOpacity, View, ViewProps, StyleSheet, TouchableOpacityProps } from 'react-native';
import { colors, sizes } from '../../constants';

interface CardProps extends ViewProps {
  children?: React.ReactNode;
  onClick?: () => void;
}

export const Card = ({ children, onClick, ...rest }: CardProps) => {
  if (onClick) {
    return (
      <TouchableOpacity
        {...rest as TouchableOpacityProps}
        style={[styles.containerCard, rest.style]} // giữ style từ props nếu có
        onPress={onClick}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View {...rest} style={[styles.containerCard, rest.style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  containerCard: {
    padding: sizes.xs_4,
    backgroundColor: colors.primaries.background,
    borderColor: colors.primaries.border,
    borderWidth: 1,
    borderRadius: sizes.xs_4,
  },
});