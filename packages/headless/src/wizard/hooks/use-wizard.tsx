import { FormConfig } from '@tutim/types';
import React from 'react';
import { UseFormReturn } from '@tutim/types';

interface WizardContext {
  config: FormConfig;
  currentStep: number;
  goToStep: (stepIndex: number) => void;
  wizardValues: Record<string, any>;
  setWizardValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  currentForm: UseFormReturn;
  setCurrentForm: React.Dispatch<React.SetStateAction<UseFormReturn>>;
}

const wizardContext: WizardContext = {
  config: { fields: [] },
  currentStep: 0,
  goToStep: () => null,
  wizardValues: {},
  setWizardValues: () => null,
  currentForm: {} as UseFormReturn,
  setCurrentForm: () => null,
};

export const WizardContext = React.createContext<WizardContext>(wizardContext);
export const useWizardContext = (): WizardContext => React.useContext(WizardContext);

export const useWizard = (config: FormConfig) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [wizardValues, setWizardValues] = React.useState<any>({});
  const [stepsState, setStepsState] = React.useState<any>({});
  const [currentForm, setCurrentForm] = React.useState<UseFormReturn>({} as any);
  const stepCount = config.wizard?.steps?.length || 0;

  const onStepSubmit = (stepValues: any) => {
    setWizardValues((prevWizardValues) => {
      const values = { ...prevWizardValues, ...stepValues };
      return values;
    });
    setStepsState((stepsState) => {
      const values = { ...stepsState, [currentStep]: currentForm.formState?.isValid };
      return values;
    });
  };

  const goToStep = (stepIndex: number) => {
    console.log('🚀 ~ file: use-wizard.tsx:42 ~ goToStep ~ stepIndex:', {
      stepIndex,
      isValid: currentForm.formState,
    });
    const shouldValidateStep = false;
    if (stepIndex < 0 || stepIndex > stepCount - 1) return;
    if (!shouldValidateStep || currentForm.formState?.isValid) {
      setCurrentStep(stepIndex);
      onStepSubmit(currentForm?.getValues());
    }
  };

  return {
    config,
    stepCount,
    currentStep,
    goToStep,
    wizardValues,
    setWizardValues,
    currentForm,
    setCurrentForm,
  };
};

export const WizardProvider = ({ children, config }: { config: FormConfig; children: React.ReactNode }) => {
  const wizard = useWizard(config);

  return <WizardContext.Provider value={wizard}>{children}</WizardContext.Provider>;
};
