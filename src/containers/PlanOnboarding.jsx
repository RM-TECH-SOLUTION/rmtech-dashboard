import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import CreateMerchantForm from '../components/CreateMerchantForm';
import { PLAN_CATALOG, SUBSCRIPTION_OPTIONS, getPlanById, getSubscriptionById } from '../data/planCatalog';
import { createMerchant, getMerchant } from '../redux/actions/cmsActions';
import { useDispatch } from 'react-redux';
import logo from '../assets/logo4.png';
import { computeExpiryDate, savePlanDataToStorage } from '../utils/planExpiry';

const PlanOnboarding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState('plan-selection'); // plan-selection | subscription | merchant-form | payment | success
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState('monthly');
  const [selectedSetupOption, setSelectedSetupOption] = useState('with-hardware');
  const [nextMerchantId, setNextMerchantId] = useState('');
  const [merchantIdLoading, setMerchantIdLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [copiedStatus, setCopiedStatus] = useState({
    merchantId: false,
    email: false,
    password: false
  });
  const [timerStarted, setTimerStarted] = useState(false);
  const [autoLoginSeconds, setAutoLoginSeconds] = useState(30);

  const plan = selectedPlan ? getPlanById(selectedPlan) : null;
  const subscription = getSubscriptionById(selectedSubscription);
  const activeSetupOption =
    plan?.setupOptions?.find((option) => option.id === selectedSetupOption) ||
    plan?.setupOptions?.[0] ||
    null;
  const activePriceModel = activeSetupOption?.priceModel || plan?.priceModel || {};
  const selectedPrice = activePriceModel[selectedSubscription] || {
    amount: 0,
    label: 'Rs 0',
    note: ''
  };
  const gstRate = plan?.gstRate || 0;
  const isGstIncluded = plan?.gstIncluded === true;
  const baseAmount = Number(selectedPrice.amount || 0);
  const gstAmount = Number((baseAmount * gstRate).toFixed(2));
  const totalAmount = Number((baseAmount + gstAmount).toFixed(2));

  const formatRs = (value) =>
    `Rs ${value.toLocaleString('en-IN', {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
      maximumFractionDigits: 2
    })}`;

  const getPlanCardMonthlyPrice = (planOption) => {
    if (planOption?.setupOptions?.length) {
      return planOption.setupOptions[0].priceModel.monthly;
    }
    return planOption.priceModel.monthly;
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setSelectedSetupOption('with-hardware');
    setSelectedSubscription('monthly');
    setStep('subscription');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    if (step !== 'success') return;
    setCopiedStatus({ merchantId: false, email: false, password: false });
    setTimerStarted(false);
    setAutoLoginSeconds(30);
  }, [step, successData]);

  useEffect(() => {
    if (step !== 'merchant-form') return;

    const resolveNextMerchantId = async () => {
      setMerchantIdLoading(true);
      try {
        const response = await dispatch(getMerchant());
        const merchantList = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.merchantList)
            ? response.merchantList
            : [];

        const maxMerchantId = merchantList.reduce((maxValue, merchant) => {
          const rawId = merchant?.merchantId ?? merchant?.merchant_id ?? 0;
          const numericId = Number(rawId);
          if (Number.isFinite(numericId)) {
            return Math.max(maxValue, numericId);
          }
          return maxValue;
        }, 0);

        setNextMerchantId(String(maxMerchantId + 1));
      } catch (error) {
        setNextMerchantId('1');
      } finally {
        setMerchantIdLoading(false);
      }
    };

    resolveNextMerchantId();
  }, [dispatch, step]);

  const handleSubscriptionSelect = (subId) => {
    setSelectedSubscription(subId);
    setStep('merchant-form');
  };

  const handleMerchantFormSubmit = async (merchantData) => {
    try {
      setIsLoading(true);
      const result = await dispatch(createMerchant(merchantData));

      if (result?.success) {
        setSuccessData({
          merchantId: merchantData.merchantId,
          password: merchantData.password,
          name: merchantData.name,
          email: merchantData.email,
        });
        return result;
      } else {
        alert(result?.message || 'Failed to create merchant. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Merchant creation error:', error);
      alert('An error occurred while creating your merchant account.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentClick = () => {
    // Store plan data in localStorage for expiry tracking
    const expiryDate = computeExpiryDate(selectedSubscription);
    const planData = {
      planId: plan?.id,
      planName: plan?.name,
      subscriptionId: selectedSubscription,
      setupOptionId: selectedSetupOption || null,
      startDate: new Date().toISOString(),
      expiryDate,
      merchantId: successData?.merchantId,
      amount: totalAmount
    };
    savePlanDataToStorage(planData);

    alert(
      'Payment integration with Razorpay would be triggered here.\n\n' +
      'Plan: ' +
        plan?.name +
        '\n' +
        'Subscription: ' +
        subscription.durationLabel +
        '\n' +
        'Base Amount: ' +
        formatRs(baseAmount) +
        (gstRate > 0 ? `\nGST (18%): ${formatRs(gstAmount)}` : '') +
        '\nTotal: ' +
        formatRs(totalAmount)
    );
    setStep('success');
  };

  const goToLoginWithPrefill = () => {
    if (!successData) return;
    navigate('/login', {
      state: {
        prefillCredentials: {
          merchantId: successData.merchantId,
          email: successData.email,
          password: successData.password
        }
      }
    });
  };

  const handleCopyCredential = async (field, value, label) => {
    try {
      await navigator.clipboard.writeText(String(value || ''));
      setCopiedStatus((prev) => ({ ...prev, [field]: true }));
      alert(`${label} copied to clipboard`);
    } catch (error) {
      alert(`Unable to copy ${label}. Please copy manually.`);
    }
  };

  const allCredentialsCopied =
    copiedStatus.merchantId && copiedStatus.email && copiedStatus.password;

  useEffect(() => {
    if (step === 'success' && allCredentialsCopied && !timerStarted) {
      setTimerStarted(true);
      setAutoLoginSeconds(30);
    }
  }, [allCredentialsCopied, step, timerStarted]);

  useEffect(() => {
    if (step !== 'success' || !timerStarted) return;

    if (autoLoginSeconds <= 0) {
      goToLoginWithPrefill();
      return;
    }

    const timer = setInterval(() => {
      setAutoLoginSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [autoLoginSeconds, step, timerStarted]);

  const autoLoginTimerLabel = `${Math.floor(autoLoginSeconds / 60)
    .toString()
    .padStart(2, '0')}:${(autoLoginSeconds % 60)
    .toString()
    .padStart(2, '0')}`;

  // PLAN SELECTION STEP
  if (step === 'plan-selection') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 via-white to-blue-50 px-4 py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transform -skew-y-6"></div>
        <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-l from-purple-500/10 to-blue-500/10 transform skew-y-6"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <div className="flex justify-center mb-5">
              <img
                src={logo}
                alt="RM Tech Solution"
                className="object-cover"
                style={{ height: '90px', width: '200px' }}
              />
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Launch your business with RM Tech and start earning from day one.
              Select a plan that matches your business goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {PLAN_CATALOG.map((planOption) => (
              (() => {
                const monthlyPrice = getPlanCardMonthlyPrice(planOption);
                return (
              <div
                key={planOption.id}
                className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden border-2 border-slate-200 hover:border-blue-600"
              >
                <div
                  className={`h-1 bg-gradient-to-r ${planOption.accent}`}
                ></div>

                <div className="p-8">
                  <div className="mb-4 inline-flex px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
                    {planOption.badge}
                  </div>

                  <h2 className="text-3xl font-bold text-slate-900 mb-3">
                    {planOption.name}
                  </h2>

                  <p className="text-slate-600 mb-6 text-lg">
                    {planOption.headline}
                  </p>

                  {planOption.poster && (
                    <img
                      src={planOption.poster}
                      alt={planOption.name}
                      className="w-full rounded-xl mb-6 border border-slate-200"
                    />
                  )}

                  <div className="mb-6">
                    <div className="text-4xl font-bold text-slate-900">
                      {monthlyPrice.label}
                      <span className="text-lg text-slate-600 font-normal ml-2">
                        {monthlyPrice.note}
                      </span>
                    </div>
                  </div>

                  <div className="mb-8 space-y-3">
                    <p className="font-semibold text-slate-900">
                      What's Included:
                    </p>
                    {planOption.inclusions.map((inc, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{inc}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSelectPlan(planOption.id)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Choose {planOption.shortName} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
                );
              })()
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SUBSCRIPTION SELECTION STEP
  if (step === 'subscription' && plan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => setStep('plan-selection')}
            className="mb-8 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
          >
            ← Back to Plans
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              {plan.name}
            </h1>
            <p className="text-slate-600 mb-6 text-lg">{plan.headline}</p>

            {plan.setupOptions?.length ? (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Do you need system, scanner and printer?
                </h2>
                <div className="grid gap-4">
                  {plan.setupOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedSetupOption(option.id)}
                      className={`w-full p-5 rounded-xl border-2 text-left transition ${
                        selectedSetupOption === option.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <p className="text-lg font-bold text-slate-900">{option.label}</p>
                      <p className="text-sm text-slate-600 mt-1">{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Choose Your Billing Period
              </h2>

              <div className="space-y-4">
                {SUBSCRIPTION_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSubscriptionSelect(option.id)}
                    className={`w-full p-6 rounded-xl border-2 transition text-left ${
                      selectedSubscription === option.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {option.label}
                        </h3>
                        <p className="text-slate-600">{option.billingCopy}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">
                          {activePriceModel[option.id]?.label}
                        </div>
                        <p className="text-sm text-slate-600">
                          {activePriceModel[option.id]?.note}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
                <h3 className="font-bold text-green-900 mb-2">
                  Plan Summary
                </h3>
                <p className="text-green-800">
                  {plan.name} with{' '}
                  {getSubscriptionById(selectedSubscription).durationLabel}{' '}
                  billing = {selectedPrice.label}
                  {gstRate > 0 ? ` + GST (${formatRs(gstAmount)})` : ''}
                  {isGstIncluded ? ' (GST included)' : ''}
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep('merchant-form')}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Continue to Merchant Setup <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MERCHANT FORM STEP
  if (step === 'merchant-form' && plan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => setStep('subscription')}
            className="mb-8 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
          >
            ← Back to Subscription
          </button>

          <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border-l-4 border-blue-600">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Setup Your Merchant Account
            </h1>
            <p className="text-slate-600">
              Create your merchant profile to start using {plan.name}.
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Merchant ID is auto-generated from the existing sequence.
            </p>
          </div>

          {merchantIdLoading ? (
            <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Preparing next Merchant ID...
            </div>
          ) : null}

          <CreateMerchantForm
            renderMode="inline"
            title="Create Your Merchant Account"
            description={`Complete your profile to activate ${plan.name} (${selectedPrice.label}${gstRate > 0 ? ` + GST ${formatRs(gstAmount)}` : ''})`}
            initialData={{ merchantId: nextMerchantId }}
            hideInternalFields={true}
            lockMerchantId={true}
            showCancelButton={true}
            submitLabel="Create Account & Proceed to Payment"
            onClose={() => setStep('subscription')}
            onSubmit={(data) =>
              handleMerchantFormSubmit(data).then((result) => {
                if (result) {
                  setStep('payment');
                }
              })
            }
          />
        </div>
      </div>
    );
  }

  // PAYMENT STEP
  if (step === 'payment' && plan && successData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">
              Complete Your Payment
            </h1>

            <div className="space-y-6 mb-8">
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="font-bold text-blue-900 mb-3">Order Summary</h3>
                <div className="space-y-3 text-blue-800">
                  <p>
                    Plan: <strong>{plan.name}</strong>
                  </p>
                  <p>
                    Subscription:{' '}
                    <strong>
                      {getSubscriptionById(selectedSubscription).label}
                    </strong>
                  </p>
                  {activeSetupOption ? (
                    <p>
                      Setup: <strong>{activeSetupOption.label}</strong>
                    </p>
                  ) : null}
                  <p>
                    Base Amount: <strong>{formatRs(baseAmount)}</strong>
                  </p>
                  {gstRate > 0 ? (
                    <p>
                      GST (18%): <strong>{formatRs(gstAmount)}</strong>
                    </p>
                  ) : null}
                  {isGstIncluded ? (
                    <p>
                      GST: <strong>Included</strong>
                    </p>
                  ) : null}
                  <p className="text-2xl font-bold text-blue-900 mt-4">
                    Total: {formatRs(totalAmount)}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                <h3 className="font-bold text-green-900 mb-3">
                  Your Merchant Account
                </h3>
                <div className="space-y-2 text-green-800">
                  <p>
                    ID: <strong>{successData.merchantId}</strong>
                  </p>
                  <p>
                    Business Name: <strong>{successData.name}</strong>
                  </p>
                  <p>
                    Email: <strong>{successData.email}</strong>
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handlePaymentClick}
              disabled={isLoading}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading
                ? 'Processing...'
                : `Pay ${formatRs(totalAmount)} with Razorpay`}
            </button>

            <p className="text-center text-slate-600 mt-6 text-sm">
              Your payment is secure and handled by Razorpay, a PCI-DSS compliant
              payment gateway.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // SUCCESS STEP
  if (step === 'success' && successData && plan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex p-4 rounded-full bg-green-100">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              Success!
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Your merchant account has been created successfully.
            </p>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 mb-8 text-left">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Your Login Credentials
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Merchant ID
                  </label>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg font-mono text-slate-900 flex items-center justify-between">
                    <span>{successData.merchantId}</span>
                    <button
                      onClick={() => {
                        handleCopyCredential('merchantId', successData.merchantId, 'Merchant ID');
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      {copiedStatus.merchantId ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg text-slate-900 flex items-center justify-between">
                    <span>{successData.email}</span>
                    <button
                      onClick={() => {
                        handleCopyCredential('email', successData.email, 'Email');
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      {copiedStatus.email ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg font-mono text-slate-900 flex items-center justify-between">
                    <span>{successData.password}</span>
                    <button
                      onClick={() => {
                        handleCopyCredential('password', successData.password, 'Password');
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      {copiedStatus.password ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                ⚠️ Copy all credentials. This is mandatory before login.
                {allCredentialsCopied
                  ? ` Auto-redirect to login starts now: ${autoLoginTimerLabel}`
                  : ' Auto-redirect will start only after all 3 fields are copied.'}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={goToLoginWithPrefill}
                disabled={!allCredentialsCopied}
                className={`w-full px-6 py-3 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  allCredentialsCopied
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg'
                    : 'bg-slate-400 cursor-not-allowed'
                }`}
              >
                {allCredentialsCopied
                  ? 'Login to Your Dashboard'
                  : 'Copy all credentials to unlock login'}{' '}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PlanOnboarding;
