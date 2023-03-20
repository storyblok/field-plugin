import {useFieldPlugin} from "./useFieldPlugin";

function App() {
    const {type, data, actions} = useFieldPlugin()

    const handleIncrement = () => {
        actions?.setValue((typeof data.value === 'number' ? data.value : 0) + 1)
    }


    if (type === 'loading') {
        return (
            <span>Loading...</span>
        )
    }

    if (type === 'error') {
        return (
            <span>Error</span>
        )
    }

    const label =
        typeof data.value !== 'number' ? 0 : JSON.stringify(data.value)

    return (
        <div>
            <span>Value: {label}</span>
            <button onClick={handleIncrement}>
                Increment
            </button>
        </div>
    )
}

export default App
