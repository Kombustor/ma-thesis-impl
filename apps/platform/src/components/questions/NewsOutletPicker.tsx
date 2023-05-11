import React, { useState } from 'react';
import { Button, Input, InputGroup } from 'react-daisyui';
import { Control, Controller } from 'react-hook-form';
import { HiPlus } from 'react-icons/hi';

import QuestionTitle from '@/components/questions/QuestionTitle';
import { unique } from '@/lib/unique';
import warningToast from '@/lib/warning-toast';

import { MultipleChoiceQuestion } from '@mbg/api-platform/lib/questions';
import { Answer } from '@mbg/api-platform/schemas/answer.schema';
import { classNames } from '@mbg/ui';

type Props = MultipleChoiceQuestion & {
  control: Control<Answer>;
};

export default function NewsOutletPicker({
  question,
  options,
  control,
}: Props) {
  const [currentOptions, setCurrentOptions] = useState(options);
  const [newOption, setNewOption] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isNewOptionValid, setIsNewOptionValid] = useState(false);
  const [disableOptions, setDisableOptions] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleAddNewsOutlet(onChange: (...event: any[]) => void) {
    return (e: React.MouseEvent | React.KeyboardEvent) => {
      e.preventDefault();

      // Filter duplicate between user input and existing options
      const newCurrentOptions = unique(
        [...currentOptions, newOption],
        (item) => {
          warningToast(`${item} already exists. Selecting it automatically.`);
        }
      );

      const newSelectedOptions = unique([...selectedOptions, newOption]);

      setSelectedOptions(() => {
        // Update values of react hook form
        onChange(newSelectedOptions);
        return newSelectedOptions;
      });

      setCurrentOptions(newCurrentOptions);
      setNewOption('');
      setIsNewOptionValid(false);
    };
  }

  return (
    <>
      <QuestionTitle question={question} />
      <p>You can select more than one option.</p>
      <Controller
        name={'newsOutlets'}
        control={control}
        render={({ field: { onChange, ...props } }) => (
          <div className="flex flex-col gap-4">
            {/* Rendering options */}
            <div className="flex flex-wrap gap-3">
              {currentOptions.map((option, idx) => (
                <Button
                  key={option + idx}
                  className={classNames(
                    'normal-case no-animation btn-success bg-green-200',
                    {
                      'bg-green-500 outline outline-2':
                        selectedOptions.includes(option),
                    }
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    // Is "I don't follow any news outlets" selected?
                    if (option === options[options.length - 1]) {
                      if (disableOptions) {
                        setDisableOptions(false);
                        // Set to undefined to disable the next button to get to the next question.
                        onChange();
                        setSelectedOptions(() => {
                          return [];
                        });
                      } else {
                        setDisableOptions(true);
                        // Empty array enables the next button
                        onChange([]);
                        setSelectedOptions(() => {
                          return [option];
                        });
                      }
                    } else {
                      if (!disableOptions) {
                        // Is the option already selected, then deselect.
                        const currentValue = selectedOptions.includes(option)
                          ? selectedOptions.filter((val) => val !== option)
                          : [...selectedOptions, option];
                        onChange(
                          currentValue.length > 0 ? currentValue : undefined
                        );
                        setSelectedOptions(() => {
                          return currentValue;
                        });
                      }
                    }
                  }}
                  // Never disable "I don't follow any news outlets"
                  disabled={
                    disableOptions && option !== options[options.length - 1]
                  }
                  {...props}
                >
                  {option}
                </Button>
              ))}
            </div>
            <p>You can add another option.</p>
            {/* Rendering add option */}
            <InputGroup vertical>
              <Input
                className="text-center"
                type="text"
                value={newOption}
                placeholder={newOption || 'My favorite news outlet'}
                disabled={disableOptions}
                onChange={({ target: { value } }) => {
                  setNewOption(() => {
                    if (value.trim() !== '') {
                      setIsNewOptionValid(true);
                    }
                    return value;
                  });
                }}
                onBlur={({ target: { value } }) => {
                  setNewOption(value.trim());
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (isNewOptionValid) handleAddNewsOutlet(onChange)(e);
                    else e.preventDefault();
                  }
                }}
              />
              <Button
                className="btn-primary"
                onClick={handleAddNewsOutlet(onChange)}
                startIcon={
                  <HiPlus
                    size={20}
                    className={classNames({
                      'text-white': !isNewOptionValid,
                    })}
                  />
                }
                disabled={disableOptions || !isNewOptionValid}
              >
                Add
              </Button>
            </InputGroup>
          </div>
        )}
      />
    </>
  );
}
