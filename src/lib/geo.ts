// Координаты университета (по 2GIS)
export const UNI_LAT = 42.859356;
export const UNI_LON = 74.667841;

// Максимально допустимое расстояние в метрах (радиус)
export const MAX_DISTANCE_METERS = 200;

/**
 * Вычисляет расстояние между двумя координатами в метрах
 * с использованием формулы гаверсинуса (Haversine formula).
 */
export function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Радиус Земли в метрах
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Проверяет, находится ли пользователь достаточно близко к университету.
 */
export function isAtUniversity(userLat: number, userLon: number): boolean {
  const distance = getDistanceInMeters(userLat, userLon, UNI_LAT, UNI_LON);
  return distance <= MAX_DISTANCE_METERS;
}
