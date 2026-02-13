import Header from './Header';
import { StyleSheet } from 'react-native';

export const sharedStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#7b6b6b' },
  pagePadding: { padding: 15 },
});

export { Header };
export default { Header, sharedStyles };
