import Colors from '@constants/Colors';
import { View as DefaultView } from 'react-native';

export type ViewProps = DefaultView['props'];

export function View(props: ViewProps) {
  const { style, ...otherProps } = props;
  const backgroundColor = Colors.BLACK;

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
