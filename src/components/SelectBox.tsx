import React, { useState, useRef, useEffect } from "react";
import style from "./SelectBox.module.scss";

export type IOption = {
    label: string;
    value: string | number;
};

type ISingleSelectProps = {
    multiple: false;
    value?: IOption;
    onChange: (value: IOption | undefined) => void;
};
type IMultiSelectProps = {
    multiple: true;
    value: IOption[];
    onChange: (value: IOption[]) => void;
};
type ISelectBoxProps = {
    options: IOption[];
} & (ISingleSelectProps | IMultiSelectProps);

const SelectBox: React.FunctionComponent<ISelectBoxProps> = ({
    multiple,
    options,
    value,
    onChange,
}) => {
    const [show, setShow] = useState<boolean>(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
    const selectBoxRef = useRef<HTMLDivElement>(null);

    const onClear = (e: React.FormEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (multiple) {
            onChange([]);
        } else {
            onChange(undefined);
        }
    };

    function isOptionSelected(option: IOption) {
        return multiple ? value?.includes(option) : option === value;
    }

    function selectOption(option: IOption) {
        if (multiple) {
            if (value.includes(option)) {
                onChange(value.filter((o) => o !== option));
            } else {
                onChange([...value, option]);
            }
        } else {
            if (option !== value) onChange(option);
        }
    }

    useEffect(() => {
        show && setHighlightedIndex(0);
    }, [show]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target != selectBoxRef.current) return;
            switch (e.code) {
                case "Enter":
                case "Space":
                    setShow((prev) => !prev);
                    if (show) selectOption(options[highlightedIndex]);
                    break;
                case "ArrowUp":
                case "ArrowDown": {
                    if (!show) {
                        setShow(true);
                        break;
                    }

                    const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
                    if (newValue >= 0 && newValue < options.length) {
                        setHighlightedIndex(newValue);
                    }
                    break;
                }
                case "Escape":
                    setShow(false);
                    break;
            }
        };
        selectBoxRef.current?.addEventListener("keydown", handler);

        return () => {
            selectBoxRef.current?.removeEventListener("keydown", handler);
        };
    }, [show, highlightedIndex, options]);

    return (
        <div
            className={style.container}
            onClick={() => setShow((show) => !show)}
            onBlur={() => setShow(false)}
            tabIndex={0}
            ref={selectBoxRef}
        >
            <span className={style.values}>
                {multiple
                    ? value?.map((v) => (
                          <button
                              key={v.value}
                              onClick={(e) => {
                                  e.stopPropagation();
                                  selectOption(v);
                              }}
                              className={style.optionBadge}
                          >
                              {v.label}
                              <span className={style.removeBtn}>&times;</span>
                          </button>
                      ))
                    : value?.label}
            </span>
            <button className={style.clearBtn} onClick={onClear}>
                &times;
            </button>
            <div className={style.divider}></div>
            <div className={style.arrow}></div>
            <ul className={`${style.options} ${show ? style.show : ""}`}>
                {options.map((o, i) => (
                    <li
                        className={`${style.option} ${isOptionSelected(o) ? style.selected : ""}
                        ${highlightedIndex === i ? style.highlighted : ""}`}
                        key={o.value}
                        onClick={() => selectOption(o)}
                        onMouseEnter={() => setHighlightedIndex(i)}
                    >
                        {o.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SelectBox;
