import { useState } from 'react'
import { FieldPluginFunc } from '../App'

const AssetSelector: FieldPluginFunc = ({ actions }) => {
  const [imageUrl, setImageUrl] = useState<string>('')

  const handleSelectAsset = () => {
    actions?.selectAsset((filename: string) => setImageUrl(filename))
  }

  return (
    <div className="asset-selector">
      <button onClick={handleSelectAsset}>Select Asset</button>
      <span>Image Url: {imageUrl}</span>
    </div>
  )
}

export default AssetSelector
