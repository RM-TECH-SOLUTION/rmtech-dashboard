import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, RefreshCw, Calendar, Clock, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';
import { PLAN_CATALOG, SUBSCRIPTION_OPTIONS, getPlanById } from '../data/planCatalog';
import { updateMerchantStatus } from '../redux/actions/cmsActions';
import { useDispatch } from 'react-redux';
import {
  getPlanDataFromStorage,
  computeExpiryDate,
  savePlanDataToStorage,
  getDaysUntilExpiry,
  isPlanExpired,
  isPlanExpiringSoon
} from '../utils/planExpiry';

const SUBSCRIPTION_DAYS = { monthly: 30, quarterly: 90, yearly: 365 };
const SUBSCRIPTION_DAYS_LABEL = { monthly: '30 days', quarterly: '90 days', yearly: '365 days' };

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

/* ---- Airtel-style current plan status card ---- */
const CurrentPlanStatusCard = ({ planData }) => {
  if (!planData) return null;

  const daysLeft   = getDaysUntilExpiry(planData.expiryDate);
  const expired    = isPlanExpired(planData.expiryDate);
  const nearExpiry = isPlanExpiringSoon(planData.expiryDate, 5);

  const totalDays  = SUBSCRIPTION_DAYS[planData.subscriptionId] || 30;
  const usedDays   = Math.max(0, totalDays - Math.max(0, daysLeft || 0));
  const progress   = Math.min(100, Math.round((usedDays / totalDays) * 100));

  const statusConfig = expired
    ? { label: 'Expired', color: 'bg-red-100 text-red-700', barColor: 'bg-red-500', icon: <AlertCircle className="w-4 h-4" /> }
    : nearExpiry
    ? { label: 'Expiring Soon', color: 'bg-orange-100 text-orange-700', barColor: 'bg-orange-500', icon: <AlertTriangle className="w-4 h-4" /> }
    : { label: 'Active', color: 'bg-green-100 text-green-700', barColor: 'bg-green-500', icon: <ShieldCheck className="w-4 h-4" /> };

  return (
    <div className={`rounded-2xl overflow-hidden shadow-lg border-2 ${expired ? 'border-red-300' : nearExpiry ? 'border-orange-300' : 'border-green-200'}`}>
      <div className={`px-6 py-4 ${expired ? 'bg-red-600' : nearExpiry ? 'bg-orange-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Current Plan</p>
            <h3 className="text-xl font-bold mt-0.5">{planData.planName || 'RM Tech Plan'}</h3>
          </div>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${statusConfig.color}`}>
            {statusConfig.icon} {statusConfig.label}
          </span>
        </div>
      </div>

      <div className="bg-white px-6 py-5">
        {/* Expiry row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs text-slate-400">Expiry Date</p>
              <p className="font-bold text-slate-900 text-sm">{formatDate(planData.expiryDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4 text-indigo-500" />
            <div className="text-right">
              <p className="text-xs text-slate-400">Days Remaining</p>
              <p className={`font-bold text-sm ${expired ? 'text-red-600' : nearExpiry ? 'text-orange-600' : 'text-green-600'}`}>
                {expired ? 'Expired' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400">Start Date</p>
            <p className="font-bold text-slate-900 text-sm">{formatDate(planData.startDate)}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Plan usage</span>
            <span>{progress}% used ({usedDays}/{totalDays} days)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${statusConfig.barColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {expired && (
          <p className="mt-3 text-xs text-red-600 font-semibold bg-red-50 rounded-lg px-3 py-2">
            ⚠️ Your plan has expired. Renew below to restore all operations.
          </p>
        )}
        {nearExpiry && !expired && (
          <p className="mt-3 text-xs text-orange-700 font-semibold bg-orange-50 rounded-lg px-3 py-2">
            ⚠️ Expiring in {daysLeft} day{daysLeft !== 1 ? 's' : ''}. Renew now to avoid any interruption.
          </p>
        )}
      </div>
    </div>
  );
};


const RenewPlanContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentPlanData = getPlanDataFromStorage();
  const merchantId = localStorage.getItem('token');

  const [selectedPlan, setSelectedPlan] = useState(
    currentPlanData?.planId || PLAN_CATALOG[0].id
  );
  const [selectedSubscription, setSelectedSubscription] = useState(
    currentPlanData?.subscriptionId || 'monthly'
  );
  const [selectedSetupOption, setSelectedSetupOption] = useState(
    currentPlanData?.setupOptionId || 'with-hardware'
  );
  const [step, setStep] = useState('select'); // select | confirm | success
  const [isLoading, setIsLoading] = useState(false);

  const plan = getPlanById(selectedPlan);
  const activeSetupOption =
    plan?.setupOptions?.find((o) => o.id === selectedSetupOption) ||
    plan?.setupOptions?.[0] ||
    null;
  const activePriceModel = activeSetupOption?.priceModel || plan?.priceModel || {};
  const selectedPrice = activePriceModel[selectedSubscription] || { amount: 0, label: 'Rs 0', note: '' };
  const gstRate = plan?.gstRate || 0;
  const isGstIncluded = plan?.gstIncluded === true;
  const baseAmount = Number(selectedPrice.amount || 0);
  const gstAmount = Number((baseAmount * gstRate).toFixed(2));
  const totalAmount = Number((baseAmount + gstAmount).toFixed(2));

  const formatRs = (val) =>
    `Rs ${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

  const handleRenewPayment = async () => {
    setIsLoading(true);
    try {
      // Placeholder for actual Razorpay payment
      alert(
        `Razorpay payment for renewal would trigger here.\n\nPlan: ${plan?.name}\nDuration: ${SUBSCRIPTION_DAYS_LABEL[selectedSubscription]}\nAmount: ${formatRs(totalAmount)}`
      );

      // On success: update plan data in localStorage and reactivate merchant
      const expiryDate = computeExpiryDate(selectedSubscription);
      const newPlanData = {
        planId: plan?.id,
        planName: plan?.name,
        subscriptionId: selectedSubscription,
        setupOptionId: selectedSetupOption || null,
        startDate: new Date().toISOString(),
        expiryDate,
        merchantId,
        amount: totalAmount
      };
      savePlanDataToStorage(newPlanData);

      // Reactivate merchant status
      await dispatch(updateMerchantStatus({ merchantId, status: 'active' }));

      setStep('success');
    } catch (err) {
      alert('Renewal failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'success') {
    const daysLeft = getDaysUntilExpiry(getPlanDataFromStorage()?.expiryDate);
    return (
      <div className="max-w-xl mx-auto mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex p-4 rounded-full bg-green-100 mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Plan Renewed!</h2>
          <p className="text-slate-600 mb-6">
            Your plan has been renewed successfully. You now have{' '}
            <strong>{daysLeft} days</strong> of access remaining.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Page title */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <RefreshCw className="w-5 h-5 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Renew Your Plan</h1>
      </div>

      {/* Airtel-style current plan status card */}
      <CurrentPlanStatusCard planData={currentPlanData} />

      {/* Plan selection */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Choose Plan</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {PLAN_CATALOG.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPlan(p.id);
                setSelectedSetupOption(p.setupOptions?.[0]?.id || '');
              }}
              className={`p-4 rounded-xl border-2 text-left transition ${
                selectedPlan === p.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <p className="font-bold text-slate-900">{p.name}</p>
              <p className="text-sm text-slate-500 mt-1">{p.shortName}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Hardware option for complete plan */}
      {plan?.setupOptions?.length ? (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            System, Scanner and Printer?
          </h2>
          <div className="grid gap-3">
            {plan.setupOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedSetupOption(opt.id)}
                className={`p-4 rounded-xl border-2 text-left transition ${
                  selectedSetupOption === opt.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                <p className="font-bold text-slate-900">{opt.label}</p>
                <p className="text-sm text-slate-500 mt-1">{opt.description}</p>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Subscription duration */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Billing Period</h2>
        <div className="space-y-3">
          {SUBSCRIPTION_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedSubscription(opt.id)}
              className={`w-full p-4 rounded-xl border-2 text-left transition ${
                selectedSubscription === opt.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{opt.label}</p>
                  <p className="text-sm text-slate-500">{opt.billingCopy}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-slate-900">
                    {activePriceModel[opt.id]?.label}
                  </p>
                  <p className="text-xs text-slate-500">
                    {activePriceModel[opt.id]?.note}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Summary and pay */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Summary</h2>
        <div className="space-y-2 text-slate-700 mb-6">
          <div className="flex justify-between">
            <span>Plan</span>
            <strong>{plan?.name}</strong>
          </div>
          <div className="flex justify-between">
            <span>Duration</span>
            <strong>{SUBSCRIPTION_DAYS_LABEL[selectedSubscription]}</strong>
          </div>
          {activeSetupOption ? (
            <div className="flex justify-between">
              <span>Setup</span>
              <strong>{activeSetupOption.label}</strong>
            </div>
          ) : null}
          <div className="flex justify-between">
            <span>Base Amount</span>
            <strong>{formatRs(baseAmount)}</strong>
          </div>
          {gstRate > 0 ? (
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <strong>{formatRs(gstAmount)}</strong>
            </div>
          ) : null}
          {isGstIncluded ? (
            <div className="flex justify-between">
              <span>GST</span>
              <strong>Included</strong>
            </div>
          ) : null}
          <div className="flex justify-between text-lg font-bold text-slate-900 border-t pt-2 mt-2">
            <span>Total</span>
            <span>{formatRs(totalAmount)}</span>
          </div>
        </div>

        <button
          onClick={handleRenewPayment}
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          {isLoading ? 'Processing...' : `Pay ${formatRs(totalAmount)} & Renew`}
        </button>
        <p className="text-center text-slate-500 text-xs mt-3">
          Secure payment via Razorpay. Your plan activates immediately on success.
        </p>
      </div>
    </div>
  );
};

export default RenewPlanContainer;
