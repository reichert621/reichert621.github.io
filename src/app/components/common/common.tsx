import * as React from 'react';
import styled from 'styled-components';
import {
  space,
  color,
  fontSize,
  width,
  borders,
  flex,
  flexDirection,
  justifyContent,
  alignItems,
  fontWeight,
  lineHeight
} from 'styled-system';
import { Box, Flex, Card, Image, Heading, Text } from 'rebass';
import BaseInput, { InputProps } from 'antd/lib/input/Input';
import BaseTextArea, { TextAreaProps } from 'antd/lib/input/TextArea';
import BaseButton, { ButtonProps } from 'antd/lib/button';
import BaseIcon, { IconProps } from 'antd/lib/icon';
import BaseDivider, { DividerProps } from 'antd/lib/divider';
import Tooltip from 'antd/lib/tooltip';

export const colors = {
  white: '#FFFFFF',
  primary: '#1890ff',
  green: '#52c41a',
  red: '#f5222d',
  gold: '#faad14'
};

export const TextArea = styled((props: TextAreaProps) => (
  <BaseTextArea {...props} />
))`
  // NB: This is just a hack to increase specificity
  && {
    ${space}
    ${fontSize}
  }
`;

export const Input = styled((props: InputProps) => <BaseInput {...props} />)`
  // NB: This is just a hack to increase specificity
  && {
    height: auto;
    ${space}
    ${fontSize}
  }
`;

export const Button = styled((props: ButtonProps) => <BaseButton {...props} />)`
  // NB: This is just a hack to increase specificity
  && {
    height: auto;
    ${space}
    ${width}
    ${fontSize}
  }
`;

export const Divider = styled((props: DividerProps) => (
  <BaseDivider {...props} />
))`
  // NB: This is just a hack to increase specificity
  && {
    ${space}
  }
`;

export const Icon = styled((props: IconProps) => <BaseIcon {...props} />)`
  // NB: This is just a hack to increase specificity
  && {
    user-select: none;
    ${space}
  }
`;

export {
  // rebass
  Box,
  Flex,
  Card,
  Image,
  Heading,
  Text,
  // ant
  Tooltip
};
