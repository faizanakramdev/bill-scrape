import React from "react";

export const NumberField = ({
    placeholder = "",
    isDisabled = false,
    isReadOnly = false,
    isClearable = false,
    className,
    value,
    onChange,
    classNamePrefix = "",
    name,
    focused = false,
    required,
}) => {

    return (
        <input
            type="number"
            autoComplete="nope"
            value={value}
            placeholder={placeholder}
            disabled={isDisabled || isReadOnly}
            onChange={(e) => onChange(e)}
            isClearable={isClearable}
            className={className}
            classNamePrefix={classNamePrefix}
            name={name}
            autoFocus={focused}
            required={required}
        />
    );
};