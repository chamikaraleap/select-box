import React, { useState } from "react";
import SelectBox, { IOption } from "./components/SelectBox";

const options = [
    { label: "First", value: 1 },
    { label: "Second", value: 2 },
    { label: "Third", value: 3 },
    { label: "Fourth", value: 4 },
    { label: "Fifth", value: 5 },
];

function App() {
    const [value, setValue] = useState<IOption[]>([]);
    const onChange = (value: IOption[]) => {
        setValue(value);
    };
    return (
        <div style={{ margin: "1em" }}>
            <SelectBox options={options} onChange={onChange} value={value} multiple={true} />
        </div>
    );
}

export default App;
