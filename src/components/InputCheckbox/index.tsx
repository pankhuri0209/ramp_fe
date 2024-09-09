import classNames from "classnames"
import { useRef, useState } from "react"
import { InputCheckboxComponent } from "./types"

export const InputCheckbox: InputCheckboxComponent = ({ id, checked = false, disabled, onChange }) => {
  const inputId = useRef(`RampInputCheckbox-${id}`).current
  const [localChecked, setLocalChecked] = useState(checked)

  const handleChange = () => {
    //   if (disabled) return // Prevent interaction if disabled

    // Update the local state first for immediate UI feedback
    setLocalChecked(!localChecked)

    // Call the parent onChange function with the new value
    onChange(!localChecked)
  }

  return (
    <div className="RampInputCheckbox--container" data-testid={inputId}>
      <label
        htmlFor={inputId}
        className={classNames("RampInputCheckbox--label", {
          "RampInputCheckbox--label-checked": localChecked,
          //    "RampInputCheckbox--label-disabled": disabled, // Apply only when disabled
        })}
      />
      <input
        id={inputId}
        type="checkbox"
        className="RampInputCheckbox--input"
        checked={localChecked}
        disabled={disabled} // Ensure the input is only disabled when the prop is true
        onChange={handleChange}
      />
    </div>
  )
}
