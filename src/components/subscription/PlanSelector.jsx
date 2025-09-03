import React from 'react';
import { Check } from 'lucide-react';

function PlanSelector({ plans, currentPlan, onSelectPlan }) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`rounded-lg overflow-hidden ${
            plan.highlighted
              ? 'border-2 border-primary shadow-lg'
              : 'border border-gray-200'
          }`}
        >
          <div
            className={`p-6 ${
              plan.highlighted ? 'gradient-bg text-white' : 'bg-white text-text-primary'
            }`}
          >
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="flex items-baseline">
              <span className="text-4xl font-extrabold">{plan.price}</span>
              <span className="ml-2 text-sm opacity-80">{plan.period}</span>
            </div>
            <p className={`mt-4 ${plan.highlighted ? 'text-gray-100' : 'text-text-secondary'}`}>
              {plan.description}
            </p>
          </div>
          <div className="bg-white p-6">
            <ul className="space-y-4 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-text-secondary">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => onSelectPlan(plan)}
              disabled={plan.id === currentPlan}
              className={`w-full flex items-center justify-center px-6 py-3 rounded-md font-medium text-center transition-colors duration-200 ${
                plan.id === currentPlan
                  ? 'bg-gray-100 text-text-secondary cursor-not-allowed'
                  : plan.highlighted
                    ? 'bg-primary text-white hover:bg-accent'
                    : 'bg-white text-primary border border-primary hover:bg-gray-50'
              }`}
            >
              {plan.id === currentPlan ? 'Current Plan' : plan.cta}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlanSelector;

