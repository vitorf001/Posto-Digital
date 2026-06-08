export function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const latitude1 = Number(lat1);
  const longitude1 = Number(lon1);
  const latitude2 = Number(lat2);
  const longitude2 = Number(lon2);

  if (
    !Number.isFinite(latitude1) ||
    !Number.isFinite(longitude1) ||
    !Number.isFinite(latitude2) ||
    !Number.isFinite(longitude2)
  ) {
    return null;
  }

  const raioTerraKm = 6371;

  const dLat = grausParaRadianos(latitude2 - latitude1);
  const dLon = grausParaRadianos(longitude2 - longitude1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(grausParaRadianos(latitude1)) *
      Math.cos(grausParaRadianos(latitude2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return raioTerraKm * c;
}

function grausParaRadianos(graus) {
  return graus * (Math.PI / 180);
}