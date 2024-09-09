import Downshift from "downshift"
import { useCallback, useState, useEffect } from "react"
import classNames from "classnames"
import { DropdownPosition, GetDropdownPositionFn, InputSelectOnChange, InputSelectProps } from "./types"

export function InputSelect<TItem>({
  label,
  defaultValue,
  onChange: consumerOnChange,
  items,
  parseItem,
  isLoading,
  loadingLabel,
}: InputSelectProps<TItem>) {
  const [selectedValue, setSelectedValue] = useState<TItem | null>(defaultValue ?? null)
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
  })

  const onChange = useCallback<InputSelectOnChange<TItem>>(
    (selectedItem) => {
      if (selectedItem === null) {
        return
      }

      consumerOnChange(selectedItem)
      setSelectedValue(selectedItem)
    },
    [consumerOnChange]
  )

  // Effect to handle scrolling and updating the dropdown position
  useEffect(() => {
    const handleScroll = () => {
      const target = document.querySelector(".RampInputSelect--input")
      if (target) {
        setDropdownPosition(getDropdownPosition(target))
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <Downshift<TItem>
      id="RampSelect"
      onChange={onChange}
      selectedItem={selectedValue}
      itemToString={(item) => (item ? parseItem(item).label : "")}
    >
      {({
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        highlightedIndex,
        selectedItem,
        getToggleButtonProps,
        inputValue,
      }) => {
        const toggleProps = getToggleButtonProps()
        const parsedSelectedItem = selectedItem === null ? null : parseItem(selectedItem)

        return (
          <div className="RampInputSelect--root" style={{ position: "relative" }}>
            <label className="RampText--s RampText--hushed" {...getLabelProps()}>
              {label}
            </label>
            <div className="RampBreak--xs" />
            <div
              className="RampInputSelect--input"
              onClick={(event) => {
                setDropdownPosition(getDropdownPosition(event.target))
                toggleProps.onClick(event)
              }}
            >
              {inputValue}
            </div>

            <div
              className={classNames("RampInputSelect--dropdown-container", {
                "RampInputSelect--dropdown-container-opened": isOpen,
              })}
              {...getMenuProps()}
              //  style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
            >
              {renderItems()}
            </div>
          </div>
        )

        function renderItems() {
          if (!isOpen) {
            return null
          }

          if (isLoading) {
            return <div className="RampInputSelect--dropdown-item">{loadingLabel}...</div>
          }

          if (items.length === 0) {
            return <div className="RampInputSelect--dropdown-item">No items</div>
          }

          return items.map((item, index) => {
            const parsedItem = parseItem(item)
            return (
              <div
                key={parsedItem.value}
                {...getItemProps({
                  key: parsedItem.value,
                  index,
                  item,
                  className: classNames("RampInputSelect--dropdown-item", {
                    "RampInputSelect--dropdown-item-highlighted": highlightedIndex === index,
                    "RampInputSelect--dropdown-item-selected":
                      parsedSelectedItem?.value === parsedItem.value,
                  }),
                })}
              >
                {parsedItem.label}
              </div>
            )
          })
        }
      }}
    </Downshift>
  )
}

const getDropdownPosition: GetDropdownPositionFn = (target) => {
  if (target instanceof HTMLElement) {
    const { top, left, height } = target.getBoundingClientRect()
    const parentOffsetTop = (target.offsetParent as HTMLElement)?.getBoundingClientRect().top || 0
    return {
      top: top - parentOffsetTop + height,
      left: left,
    }
  }
  return { top: 0, left: 0 } // Ensure a default fallback to numbers
}

type Transaction = {
  id: number
  description: string
  amount: string
  date: string
}
function TransactionItem({ transaction }: { transaction: Transaction }) {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = () => {
    setIsChecked((prevChecked) => {
      const newCheckedState = !prevChecked
      console.log(
        `Transaction ${transaction.id} is now ${newCheckedState ? "approved" : "not approved"}`
      )
      return newCheckedState
    })
  }

  return (
    <div className="TransactionItem">
      <div className="TransactionDetails">
        <span>{transaction.description}</span>
        <span>{transaction.amount}</span>
        <span>{transaction.date}</span>
      </div>
      <div className="TransactionApproval">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="ApprovalCheckbox"
        />
      </div>
    </div>
  )
}
