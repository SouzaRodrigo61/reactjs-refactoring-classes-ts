import {
    useEffect,
    useRef,
    useState,
    useCallback,
} from 'react';

import { useField } from '@unform/core';

import { Container } from './styles';

interface Props {
    name: string
}

type InputProps = JSX.IntrinsicElements['input'] & Props;

const Input = ({ name, ...rest }: InputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const { fieldName, defaultValue, registerField } = useField(name)

    const handleInputFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleInputBlur = useCallback(() => {
        setIsFocused(false);

        setIsFilled(!!inputRef.current?.value);
    }, []);


    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef,
            getValue: ref => {
                return ref.current.value
            },
            setValue: (ref, value) => {
                ref.current.value = value
            },
            clearValue: ref => {
                ref.current.value = ''
            },
        })
    }, [fieldName, registerField])

    return (
        <Container isFilled={isFilled} isFocused={isFocused}>
            {/*{Icon && <Icon size={20} />}*/}

            <input
                id={fieldName}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                defaultValue={defaultValue}
                ref={inputRef}
                {...rest}
            />
        </Container>
    );
};

export default Input;
