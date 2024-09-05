import Colors from '@constants/Colors';
import { Text as DefaultText } from 'react-native';

export type TextProps = DefaultText['props'];

export function Text(props: TextProps) {
  const { style, ...otherProps } = props;
  const color = Colors.WHITE;

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}
