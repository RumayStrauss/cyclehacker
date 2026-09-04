import { useFonts } from 'expo-font';

/**
 * Blocks first paint until the brand fonts are ready, so text never flashes
 * in the system font then re-flows into Brume/Article a frame later.
 */
export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    'Brume-Regular': require('../../assets/fonts/Brume-Regular.otf'),
    'Article-Light': require('../../assets/fonts/Article-Light.otf'),
    'Article-Regular': require('../../assets/fonts/Article-Regular.otf'),
    'Article-Bold': require('../../assets/fonts/Article-Bold.otf'),
    'Article-ExtraBold': require('../../assets/fonts/Article-ExtraBold.otf'),
  });
  return loaded;
}
