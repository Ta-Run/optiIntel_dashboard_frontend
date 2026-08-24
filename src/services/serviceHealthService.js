import { apiGet } from '../api/client';

export async function getServices() {
  return apiGet('/operations/services');
}

export async function getServiceById(id) {
  const services = await getServices();
  const service = services.find((s) => s.id === id);
  if (!service) throw new Error('Service not found');
  return service;
}
