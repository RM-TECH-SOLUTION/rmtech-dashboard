import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, X, RefreshCw, Calendar, Clock } from 'lucide-react';
import { useDispatch } from 'react-redux';
import {
  getPlanDataFromStorage,
  getDaysUntilExpiry,
  isPlanExpired,
  isPlanExpiringSoon,
  isAdminUser
} from '../utils/planExpiry';
import { updateMerchantStatus } from '../redux/actions/cmsActions';

const formatDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

const PlanExpiryBanner = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [planData, setPlanData] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [deactivated, setDeactivated] = useState(false);

  useEffect(() => {
    if (isAdminUser()) return;

    const data = getPlanDataFromStorage();
    if (!data) return;

    setPlanData(data);

    if (isPlanExpired(data.expiryDate) && !deactivated) {
      setDeactivated(true);
      const merchantId = data.merchantId || localStorage.getItem('token');
      if (merchantId && merchantId !== '0') {
        dispatch(updateMerchantStatus({ merchantId, status: 'inactive' }));
      }
    }
  }, [dispatch, deactivated]);

  if (isAdminUser()) return null;
  if (!planData) return null;

  const daysLeft = getDaysUntilExpiry(planData.expiryDate);
  const expired = isPlanExpired(planData.expiryDate);
  const expiringSoon = isPlanExpiringSoon(planData.expiryDate, 5);
  const expiryLabel = formatDate(planData.expiryDate);

  // ---- EXPIRED: full blocking overlay ----
  if (expired || deactivated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="mx-4 max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-red-500 to-rose-600" />
          <div className="p-8 text-center">
            <div className="inline-flex p-4 rounded-full bg-red-100 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Plan Expired</h2>
            <p className="text-sm text-slate-500 mb-4 flex items-center justify-center gap-1">
              <Calendar className="w-4 h-4" />
              Expired on {expiryLabel}
            </p>
            <p className="text-slate-600 mb-6">
              Your merchant operations are paused. Renew your plan to restore full access.
            </p>
            <button
              onClick={() => navigate('/dashboard/renew-plan')}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Renew Plan Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- EXPIRING SOON: rich red stripe ----
  if (expiringSoon && !dismissed) {
    return (
      <div className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse" />
            <div>
              <p className="text-sm font-bold">
                ⚠️ Your plan expires in <strong>{daysLeft} day{daysLeft !== 1 ? 's' : ''}</strong>
              </p>
              <p className="text-xs text-red-200 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3" /> Expiry date: {expiryLabel}
                &nbsp;·&nbsp;
                <Clock className="w-3 h-3" /> Plan: {planData.planName || 'Active plan'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => navigate('/dashboard/renew-plan')}
              className="px-4 py-1.5 bg-white text-red-600 text-sm font-bold rounded-lg hover:bg-red-50 transition-all"
            >
              Renew Now
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 hover:bg-red-500 rounded"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PlanExpiryBanner;
