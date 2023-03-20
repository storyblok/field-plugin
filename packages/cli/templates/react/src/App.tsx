import {useFieldPlugin} from "./useFieldPlugin";

function App() {
    const {data, actions} = useFieldPlugin()

    if (!actions && !data) {
        return <div>not found</div>
    }

    const label =
        typeof data.value !== 'number' ? 'undefined' : JSON.stringify(data.value)

    return (
        <div>
            <button onClick={() => actions.setValue((typeof data.value === 'number' ? data.value : 0) + 1)}>
                increment {label}
            </button>
        </div>
    )
}

export default App
