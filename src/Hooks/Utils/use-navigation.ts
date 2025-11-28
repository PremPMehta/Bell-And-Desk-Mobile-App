import {
  RootStackParamList,
  StackNavigationProp,
} from '@/Navigation/AppNavigator';
import { useNavigation as useReactNavigation } from '@react-navigation/native';

export const useNavigation = () => {
  const navigation =
    useReactNavigation<StackNavigationProp<RootStackParamList>>();
  return navigation;
};
