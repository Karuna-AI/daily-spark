import * as Location from 'expo-location';

export interface LocationResult {
  city: string;
  country: string;
  countryCode: string;
}

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentCity(): Promise<LocationResult | null> {
  const granted = await requestLocationPermission();
  if (!granted) return null;

  try {
    const coords = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const [geocode] = await Location.reverseGeocodeAsync({
      latitude: coords.coords.latitude,
      longitude: coords.coords.longitude,
    });

    if (!geocode) return null;

    return {
      city: geocode.city ?? geocode.district ?? 'Unknown',
      country: geocode.country ?? 'Unknown',
      countryCode: geocode.isoCountryCode ?? '',
    };
  } catch {
    return null;
  }
}
