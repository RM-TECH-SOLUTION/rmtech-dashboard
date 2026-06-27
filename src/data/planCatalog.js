export const SUBSCRIPTION_OPTIONS = [
  {
    id: 'monthly',
    label: 'Monthly',
    durationLabel: '1 month',
    billingCopy: 'Billed every month'
  },
  {
    id: 'quarterly',
    label: '3 Months',
    durationLabel: '3 months',
    billingCopy: 'Quarterly access'
  },
  {
    id: 'yearly',
    label: 'Yearly',
    durationLabel: '12 months',
    billingCopy: 'Best value for long-term merchants'
  }
];

export const PLAN_CATALOG = [
  {
    id: 'multi-merchant-app',
    slug: 'multi-merchant-app',
    name: 'One App Multiple Merchants',
    shortName: '699 Plan',
    headline: 'Join the shared RM Tech ordering app and let customers discover your store inside one connected marketplace.',
    accent: 'from-blue-600 via-indigo-600 to-fuchsia-600',
    badge: 'Shared marketplace onboarding',
    poster: '/oneappmerchant.jpeg',
    merchantMode: 'shared-app',
    gstRate: 0.18,
    priceModel: {
      monthly: { amount: 699, label: 'Rs 699', note: '+ 18% GST / month' },
      quarterly: { amount: 1999, label: 'Rs 1,999', note: '+ 18% GST / 3 months' },
      yearly: { amount: 7999, label: 'Rs 7,999', note: '+ 18% GST / year' }
    },
    inclusions: [
      'Merchant listing inside the RM Tech multi-merchant customer app',
      'Merchant selection flow so customers can choose your store',
      'Catalog browsing, cart, and app ordering experience',
      'CRM and dashboard control for your business',
      'Coupons, loyalty, push notifications, and enquiry capture',
      'Payment gateway support inside the ordering flow'
    ],
    limits: [
      'This plan is for the shared RM Tech app experience',
      'Dedicated website, POS hardware, and standalone app branding are not included'
    ],
    summaryCards: [
      { title: 'Best for', value: 'Merchants joining the shared ordering app' },
      { title: 'Platform', value: 'One RM Tech app with multiple merchants' },
      { title: 'Delivery promise', value: 'Fast onboarding into the app ecosystem' }
    ]
  },
  {
    id: 'complete-business-solution',
    slug: 'complete-business-solution',
    name: 'Complete Business Solution',
    shortName: '29,999 Plan',
    headline: 'Launch a complete digital commerce stack with dashboard, website, ordering app, and hardware-ready business operations.',
    accent: 'from-sky-600 via-blue-700 to-violet-600',
    badge: 'Dedicated business stack',
    poster: '/completesetup.jpeg',
    merchantMode: 'dedicated-suite',
    gstRate: 0,
    gstIncluded: true,
    setupOptions: [
      {
        id: 'with-hardware',
        label: 'With system, scanner and printer',
        description: 'Complete hardware package included',
        priceModel: {
          monthly: { amount: 2500, label: 'Rs 2,500', note: 'Per month (GST included)' },
          quarterly: { amount: 7500, label: 'Rs 7,500', note: 'Per 3 months (GST included)' },
          yearly: { amount: 29999, label: 'Rs 29,999', note: 'Per year (GST included)' }
        }
      },
      {
        id: 'without-hardware',
        label: 'Without system, scanner and printer',
        description: 'Software suite only',
        priceModel: {
          monthly: { amount: 1667, label: 'Rs 1,667', note: 'Per month (GST included)' },
          quarterly: { amount: 5000, label: 'Rs 5,000', note: 'Per 3 months (GST included)' },
          yearly: { amount: 19999, label: 'Rs 19,999', note: 'Per year (GST included)' }
        }
      }
    ],
    inclusions: [
      'Dedicated dashboard plus website and web ordering experience',
      'Dedicated ordering app for your business',
      'POS-ready operations with printer and barcode workflow support',
      'Unlimited products and categories',
      'Payment gateway integration, coupons, referrals, and campaigns',
      'Free domain, hosting, responsive website, and 1 year technical support'
    ],
    limits: [
      'Hardware package and implementation are part of the premium solution scope',
      'Actual provisioning details can still be refined after payment and merchant creation'
    ],
    summaryCards: [
      { title: 'Best for', value: 'Businesses needing a full digital stack' },
      { title: 'Platform', value: 'Dedicated app, web ordering, and dashboard' },
      { title: 'Delivery promise', value: 'Complete business launch package' }
    ]
  }
];

export const getPlanById = (planId) => PLAN_CATALOG.find((plan) => plan.id === planId) || null;

export const getSubscriptionById = (subscriptionId) =>
  SUBSCRIPTION_OPTIONS.find((subscription) => subscription.id === subscriptionId) || SUBSCRIPTION_OPTIONS[0];
