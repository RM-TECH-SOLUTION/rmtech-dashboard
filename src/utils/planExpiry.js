const SUBSCRIPTION_DAYS = {
  monthly: 30,
  quarterly: 90,
  yearly: 365
};

export function computeExpiryDate(subscriptionId, fromDate = new Date()) {
  const days = SUBSCRIPTION_DAYS[subscriptionId] || 30;
  const expiry = new Date(fromDate);
  expiry.setDate(expiry.getDate() + days);
  return expiry.toISOString();
}

export function getDaysUntilExpiry(expiryDateStr) {
  if (!expiryDateStr) return null;
  const expiry = new Date(expiryDateStr);
  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function isPlanExpired(expiryDateStr) {
  const days = getDaysUntilExpiry(expiryDateStr);
  return days !== null && days <= 0;
}

export function isPlanExpiringSoon(expiryDateStr, daysThreshold = 5) {
  const days = getDaysUntilExpiry(expiryDateStr);
  return days !== null && days > 0 && days <= daysThreshold;
}

export function getPlanDataFromStorage() {
  try {
    const raw = localStorage.getItem('plan_data');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function savePlanDataToStorage(data) {
  localStorage.setItem('plan_data', JSON.stringify(data));
}

export function isAdminUser() {
  const token = localStorage.getItem('token');
  return token === '0' || token === 0;
}
