import React from 'react';
import { TouchableOpacity, View, ViewProps, TouchableOpacityProps } from 'react-native';

interface FlexBoxProps extends ViewProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function FlexBox({ 
  children, 
  className, 
  onClick, 
  ...rest 
}: FlexBoxProps) {
  
  if (onClick) {
    return (
      <TouchableOpacity 
        {...rest as TouchableOpacityProps} 
        onPress={onClick}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View {...rest}>
      {children}
    </View>
  );
}