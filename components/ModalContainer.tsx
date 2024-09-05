import Colors from '@constants/Colors';
import { View as DefaultView } from 'react-native';

export type ViewProps = DefaultView['props'];

export function ModalContainer(props: ViewProps) {
  const { style, ...otherProps } = props;
  const backgroundColor = Colors.BLACK;
  const flex = 1;
  const padding = 20;
  return <DefaultView style={[{ backgroundColor, flex, padding }, style]} {...otherProps} />;
}
