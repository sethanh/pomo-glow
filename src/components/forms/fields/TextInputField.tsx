import { TextInput, TextInputProps, StyleSheet } from "react-native";
import { Controller, FieldValues, RegisterOptions, useFormContext } from "react-hook-form-base";
import { FlexBox, TextCommon } from "@/components/layouts";
import { colors, inputStyles, sizes, textInputs, wrapperStyles } from "@/constants";


interface InputFieldProps extends TextInputProps {
    readonly name: string;
    readonly labelTranslateCode?: string;
    readonly placeholder?: string;
    readonly tooltipContent?: string;
    readonly disabled?: boolean;
    readonly type?: 'primary' | 'default' | 'error';
    readonly rules?: Omit<RegisterOptions<FieldValues, string>, "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"> | undefined;
}

export const TextInputField = (props: React.PropsWithChildren<InputFieldProps>) => {
    const { control } = useFormContext();
    const { labelTranslateCode, name, rules, type = 'default', ...rest } = props;
    return (
        <FlexBox style={styles.wrapper}>
            {
                labelTranslateCode &&
                <TextCommon translateCode={labelTranslateCode} />

            }
            <Controller
                control={control}
                rules={rules}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
                    const inputType = error ? textInputs.error : textInputs?.[type];
                    return (
                        <FlexBox style={{ gap: sizes.xxs_2 }}>
                            <TextInput
                                {...rest}
                                style={[styles.input, inputType]}
                                onBlur={onBlur}
                                onChangeText={onChange}
                               value={value?.toString() || ''}
                            />
                            {error && (
                                <TextCommon style={{ color: colors.primaries.danger, fontStyle: 'italic' }}>
                                    {error.message}
                                </TextCommon>
                            )}
                        </FlexBox>
                    );
                }}
                name={name}
            />
        </FlexBox>
    );
};

const styles = StyleSheet.create({
    wrapper: wrapperStyles,
    input: inputStyles,
    errorText: {
        color: '#FF4D4F',
        fontSize: 12,
    },
});