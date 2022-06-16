import {useCallback} from 'react';
import {Listbox} from '@headlessui/react';
import {useProductOptions} from '@shopify/hydrogen';

import {Text, IconCheck, IconCaret} from '~/components';

export function ProductOptions({values, ...props}) {
  const asDropdown = values.length > 4;

  return asDropdown ? (
    <OptionsDropdown values={values} {...props} />
  ) : (
    <OptionsGrid values={values} {...props} />
  );
}

function OptionsGrid({values, name, handleChange}) {
  const {selectedOptions} = useProductOptions();

  return (
    <>
      {values.map((value) => {
        const checked = selectedOptions[name] === value;
        const id = `option-${name}-${value}`;

        return (
          <Text as="label" key={id} htmlFor={id}>
            <input
              className="sr-only"
              type="radio"
              id={id}
              name={`option[${name}]`}
              value={value}
              checked={checked}
              onChange={() => handleChange(name, value)}
            />
            <div
              className={`leading-none py-1 border-b-[1.5px] cursor-pointer transition-all duration-200 ${
                checked ? 'border-primary/50' : 'border-primary/0'
              }`}
            >
              {value}
            </div>
          </Text>
        );
      })}
    </>
  );
}

function OptionsDropdown({values, name, handleChange}) {
  const {selectedOptions} = useProductOptions();

  const updateSelectedOption = useCallback(
    (value) => {
      handleChange(name, value);
      return value;
    },
    [name, handleChange],
  );

  return (
    <Listbox onChange={updateSelectedOption}>
      {({open}) => {
        return (
          <>
            <Listbox.Button
              className={`flex items-center justify-between w-full py-3 px-4 border border-black dark:border-white dark:bg-contrast ${
                open ? 'rounded-b md:rounded-t md:rounded-b-none' : 'rounded'
              }`}
            >
              <span>{selectedOptions[name]}</span>
              <IconCaret direction={open ? 'up' : 'down'} />
            </Listbox.Button>

            <Listbox.Options
              className={`
                bg-contrast border-black absolute bottom-12 z-10
                grid mt-[48px] h-48 w-full overflow-y-scroll rounded-t border dark:border-white
                px-2 py-2 transition-[max-height] duration-150 sm:bottom-auto md:rounded-b md:rounded-t-none md:border-t-0 md:border-b
                ${open ? 'max-h-48' : 'max-h-0'}
              `}
            >
              {values.map((value) => {
                const isSelected = selectedOptions[name] === value;
                const id = `option-${name}-${value}`;

                return (
                  <Listbox.Option key={id} value={value}>
                    {({active}) => (
                      <div
                        className={`text-primary w-full p-2 transition rounded flex justify-start items-center text-left cursor-pointer ${
                          active ? 'bg-contrast/20 dark:bg-black/5' : ''
                        }`}
                      >
                        {value}
                        {isSelected ? (
                          <span className="ml-2">
                            <IconCheck />
                          </span>
                        ) : null}
                      </div>
                    )}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </>
        );
      }}
    </Listbox>
  );
}