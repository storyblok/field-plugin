import { useState } from 'react'
import { PluginActions } from '@storyblok/field-plugin'

type Props = {
  selectAsset: PluginActions['selectAsset']
}
const AssetSelector = ({ selectAsset }: Props) => {
  const [imageUrl, setImageUrl] = useState<string>('')

  const handleSelectAsset = async () => {
    setImageUrl(await selectAsset())
  }

  const removeAsset = async () => {
    setImageUrl('')
  }

  return (
    <div className="asset-selector">
      <h2>Asset Selector</h2>
      {imageUrl && (
        <img
          src={imageUrl}
          title="Selected Asset"
        />
      )}
      {imageUrl && (
        <button
          className="btn w-full"
          onClick={removeAsset}
        >
          Remove Asset
        </button>
      )}
      {!imageUrl && (
        <button
          className="btn w-full"
          onClick={handleSelectAsset}
        >
          Select Asset
        </button>
      )}
    </div>
  )
}

export default AssetSelector
