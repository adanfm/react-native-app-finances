import React from 'react';
import { TextInputProps } from 'react-native';

import { Container } from './styles';

interface Props extends TextInputProps {
  error
}

export function Input({error, ...rest}: Props) {
  return (
    <Container {...rest} error={error} />
  );
}
