import {useFieldPlugin} from "./useFieldPlugin";
import {useState} from "react";

function App() {
    const {type, data, actions} = useFieldPlugin()
    const [imageUrl, setImageUrl] = useState<string>('');

    const handleIncrement = () => {
        actions?.setValue((typeof data.value === 'number' ? data.value : 0) + 1)
    }

    const handleToggleModal = (isOpen: boolean) => {
        actions?.setModalOpen(isOpen)
    }

    const handleSelectAsset = () => {
        actions?.selectAsset((filename) => setImageUrl(filename))
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
            <div>
                <span>Value: {label}</span>
                <button onClick={handleIncrement}>
                    Increment
                </button>
            </div>
            <div>
                <button
                    onClick={() => handleToggleModal(!data.isModalOpen)}>{data.isModalOpen ? 'Close' : 'Open'} modal
                </button>
            </div>
            <div>
                <button onClick={handleSelectAsset}>Select Asset</button>
                <span>Image Url: {imageUrl}</span>
            </div>
        </div>

    )
}

export default App
