import Colors from '@constants/Colors';
import { View as DefaultView } from 'react-native';

export type ViewProps = DefaultView['props'];

export function Container(props: ViewProps) {
  const { style, ...otherProps } = props;
  const backgroundColor = Colors.BLACK;
  const flex = 1;
  return <DefaultView style={[{ backgroundColor, flex }, style]} {...otherProps} />;
}
